import { calculateQuarterlyTax, formatCurrency, getNextDeadline, NO_INCOME_TAX_STATES, parseCurrencyToCents, STATES } from './calculator.js';

const stateSelect = document.querySelector('#state');
const form = document.querySelector('#calculator-form');
const results = document.querySelector('#results');
const modal = document.querySelector('#email-modal');
const notifyButton = document.querySelector('#notify-me');

let taxConfig;
let selectedComingSoonState = null;
const notifiedStates = new Set();

const filingStatusLabelMap = {
  single: 'Single',
  mfj: 'Married Filing Jointly',
  hoh: 'Head of Household'
};

const tooltips = {
  grossIncome: 'The total freelance income you entered, before any deductions.',
  expenses: 'Your deductible business expenses — subtracted from gross income to get your net profit.',
  netIncome: 'Freelance income minus business expenses. This is your net profit — the starting point for all tax calculations.',
  seBase: 'The IRS only charges self-employment tax on 92.35% of your net income. This mirrors the split W-2 workers get with their employer.',
  ssTax: 'As a freelancer, you pay both the employer and employee share of Social Security — 12.4% total. W-2 workers split this 50/50 with their employer.',
  medicareTax: "Same as Social Security — you pay both halves, 2.9% total. Unlike Social Security, there's no income cap.",
  totalSeTax: 'Social Security + Medicare combined. This is the "self-employment tax" you hear about — it\'s separate from your regular income tax.',
  seDeduction: 'The IRS lets you deduct half of your self-employment tax from your income. This lowers your income tax — think of it as the government covering the "employer half."',
  agi: 'Your total income minus the SE tax deduction. The IRS uses AGI as the starting point for income tax.',
  standardDeduction: 'A flat amount the IRS lets everyone deduct. Updated for the One Big Beautiful Bill Act signed July 2025.',
  qbiDeduction: 'The Qualified Business Income deduction lets you deduct up to 20% of your net freelance profit. Most freelancers earning under $197,300 qualify automatically. Made permanent by the One Big Beautiful Bill Act in 2025.',
  federalTaxable: 'Your AGI minus deductions. This is the amount the IRS actually taxes.',
  federalIncomeTax: 'Calculated using the federal tax brackets for your filing status. This is your regular income tax — separate from self-employment tax.',
  totalFederalTax: 'Federal income tax plus self-employment tax. This is your total federal tax bill for the year.',
  quarterlyPayment: 'Your annual federal tax divided into four equal payments — one for each IRS quarterly deadline.'
};

function fillStates() {
  stateSelect.innerHTML = '<option value="">Select your state</option>';
  for (const [code, name] of STATES) {
    const opt = document.createElement('option');
    const supported = NO_INCOME_TAX_STATES.has(code);
    opt.value = code;
    opt.textContent = supported ? name : `${name} — State taxes coming soon`;
    opt.dataset.supported = supported ? 'true' : 'false';
    stateSelect.appendChild(opt);
  }
}

function validate() {
  let valid = true;
  const incomeRaw = form.income.value.trim();
  const income = parseCurrencyToCents(incomeRaw);
  const expenses = parseCurrencyToCents(form.expenses.value);
  const state = form.state.value;

  const errors = {
    income: !incomeRaw ? 'Please enter your projected freelance income.' : income <= 0 ? 'Enter a number greater than $0.' : '',
    expenses: '',
    state: !state ? 'Please select your state to get your estimate.' : ''
  };

  for (const key of Object.keys(errors)) {
    document.getElementById(`${key}-error`).textContent = errors[key];
    const field = form[key];
    field.classList.toggle('input-error', Boolean(errors[key]));
    if (errors[key]) valid = false;
  }

  if (expenses > income && income > 0) {
    document.getElementById('expenses-error').textContent = "Expenses exceed income — that means a net loss. Double-check, or continue if that's right.";
  }

  return valid;
}

function lineItem(label, value, tooltip) {
  return `<li><span class="line-with-tip">${label}<button type="button" class="tip-icon" title="${tooltip}" aria-label="More info: ${label}">i</button></span><strong>${formatCurrency(value)}</strong></li>`;
}

function renderResults(inputSnapshot, output) {
  const nextDeadline = getNextDeadline(taxConfig.quarterly_deadlines);

  let stateMsg = '';
  if (NO_INCOME_TAX_STATES.has(inputSnapshot.state)) {
    stateMsg = `<p class="callout success">Good news — ${inputSnapshot.stateName} has no state income tax. Your quarterly payment is federal only.</p>`;
  } else if (notifiedStates.has(inputSnapshot.state)) {
    stateMsg = `<p class="callout warning">${inputSnapshot.stateName} has a state income tax, but we're still building the ${inputSnapshot.stateName} calculator. We'll let you know when it's ready. Your federal estimate is shown above.</p>`;
  } else {
    stateMsg = `<p class="callout warning">We don't have ${inputSnapshot.stateName} yet — want us to email you when it's ready? <button type="button" class="inline-link" id="notify-state-cta">Notify Me</button></p>`;
  }

  const warningBlocks = [
    output.warnings.netLoss ? '<p class="callout warning">Your expenses exceed your income — that\'s a net loss. You won\'t owe quarterly taxes on a loss. If this doesn\'t look right, tap "Edit" above to double-check your numbers.</p>' : '',
    output.warnings.noIncome ? '<p class="callout success">Your estimated quarterly payment is $0. Based on your numbers, you may not owe estimated taxes this year. If your income changes, recalculate anytime.</p>' : '',
    output.warnings.w2CoversTax ? '<p class="callout success">Based on your W-2 withholding, your employer may already be covering your total tax liability. You might not need to make a separate quarterly payment — but verify with a tax professional to be sure.</p>' : '',
    output.warnings.qbiThreshold ? '<p class="callout warning">Heads up: at your income level, the QBI deduction may be limited for certain service businesses (legal, consulting, health, financial services, and others). A tax professional can confirm whether this applies to you.</p>' : '',
    output.warnings.additionalMedicareTax ? '<p class="callout warning">Your self-employment income exceeds $200,000, which triggers the Additional Medicare Tax (0.9%). It\'s already included in the calculation above.</p>' : ''
  ].join('');

  const standardDeductionLabel = `Standard deduction (${inputSnapshot.filingStatusLabel}, ${taxConfig.tax_year})`;

  results.innerHTML = `
    <div class="summary-bar">Income: ${formatCurrency(inputSnapshot.incomeCents)} | Expenses: ${formatCurrency(inputSnapshot.expensesCents)} | ${inputSnapshot.state} | ${inputSnapshot.filingStatusLabel} <button type="button" class="inline-link" id="edit-values">Edit</button></div>
    <p class="disclaimer">This is an estimate for planning purposes only. It is not tax advice. Consult a tax professional for your specific situation.</p>
    <section class="result-card">
      <p class="result-label">YOUR ESTIMATED QUARTERLY PAYMENT</p>
      <p class="result-amount">${formatCurrency(output.quarterlyPaymentCents)}</p>
      <p>Due by ${nextDeadline.label} — ${nextDeadline.days} days from now</p>
    </section>
    <details class="breakdown" open>
      <summary>How We Calculated This</summary>
      <ul class="breakdown-list">
        ${lineItem('Gross freelance income', inputSnapshot.incomeCents, tooltips.grossIncome)}
        ${lineItem('Business expenses', -inputSnapshot.expensesCents, tooltips.expenses)}
        ${lineItem('Net self-employment income', output.steps.netSeIncome, tooltips.netIncome)}
        ${lineItem('SE tax base (92.35% of net)', output.steps.seTaxBase, tooltips.seBase)}
        ${lineItem('Social Security tax (12.4%)', output.steps.ssTax, tooltips.ssTax)}
        ${lineItem('Medicare tax (2.9%)', output.steps.medicareTax, tooltips.medicareTax)}
        ${lineItem('Total self-employment tax', output.steps.totalSeTax, tooltips.totalSeTax)}
        ${lineItem('SE tax deduction (50% of SE tax)', -output.steps.seDeduction, tooltips.seDeduction)}
        ${lineItem('Adjusted gross income (AGI)', output.steps.agi, tooltips.agi)}
        ${lineItem(standardDeductionLabel, -output.steps.standardDeduction, tooltips.standardDeduction)}
        ${lineItem('QBI deduction (20% of qualified business income)', -output.steps.qbiDeduction, tooltips.qbiDeduction)}
        ${lineItem('Federal taxable income', output.steps.federalTaxableIncome, tooltips.federalTaxable)}
        ${lineItem('Federal income tax', output.steps.federalIncomeTax, tooltips.federalIncomeTax)}
        ${lineItem('Total annual federal tax (income + SE)', output.steps.totalFederalTax, tooltips.totalFederalTax)}
        ${lineItem('Quarterly payment (÷ 4)', output.quarterlyPaymentCents, tooltips.quarterlyPayment)}
      </ul>
    </details>
    ${stateMsg}
    ${warningBlocks}
    <p class="callout warning">Safe harbor rule: If you pay at least 100% of last year's total tax liability (110% if your AGI was over $150K), you won't owe an underpayment penalty — even if your estimate is off. That's why most accountants recommend it.</p>
    <div class="actions">
      <button type="button" class="secondary">Remind Me Before the Deadline</button>
      <button type="button" onclick="window.location.href='how-to-pay.html'">How Do I Actually Pay?</button>
    </div>
    <p class="upsell-strip">Want a more accurate number? Track your expenses and your estimate updates automatically. <a href="pricing.html">Start free →</a></p>
  `;

  results.classList.remove('hidden');
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('edit-values')?.addEventListener('click', () => {
    document.getElementById('calculator-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('notify-state-cta')?.addEventListener('click', () => modal.showModal());
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validate()) return;

  const inputSnapshot = {
    incomeCents: parseCurrencyToCents(form.income.value),
    expensesCents: parseCurrencyToCents(form.expenses.value),
    w2WithholdingCents: parseCurrencyToCents(form.w2.value),
    filingStatus: form.filingStatus.value,
    filingStatusLabel: filingStatusLabelMap[form.filingStatus.value] ?? 'Single',
    state: form.state.value,
    stateName: form.state.options[form.state.selectedIndex].textContent.split(' — ')[0]
  };

  const button = document.getElementById('calculate');
  button.textContent = 'Calculating...';
  button.disabled = true;

  setTimeout(() => {
    const output = calculateQuarterlyTax(inputSnapshot, taxConfig);
    renderResults(inputSnapshot, output);
    button.textContent = 'Calculate My Quarterly Tax';
    button.disabled = false;
  }, 300);
});

stateSelect.addEventListener('change', () => {
  const selected = stateSelect.options[stateSelect.selectedIndex];
  if (selected?.dataset.supported === 'false') {
    selectedComingSoonState = selected.value;
    modal.showModal();
  }
});

notifyButton?.addEventListener('click', () => {
  if (selectedComingSoonState) {
    notifiedStates.add(selectedComingSoonState);
  }
  modal.close();
});

document.getElementById('close-modal').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  const r = modal.getBoundingClientRect();
  const inDialog = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
  if (!inDialog) modal.close();
});

function formatOnBlur(input) {
  input.addEventListener('blur', () => {
    const cents = parseCurrencyToCents(input.value);
    if (!cents) return;
    input.value = (cents / 100).toLocaleString('en-US');
  });
}

formatOnBlur(form.income);
formatOnBlur(form.expenses);
formatOnBlur(form.w2);

function resolveConfigYear() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const jan15 = new Date(currentYear, 0, 15, 23, 59, 59, 999);
  return now > jan15 ? currentYear : currentYear - 1;
}

async function loadTaxConfig() {
  const preferredYear = resolveConfigYear();
  const fallbackYears = [preferredYear, 2026, 2025];
  const uniqueYears = [...new Set(fallbackYears)];

  for (const year of uniqueYears) {
    try {
      const response = await fetch(`./tax-logic/federal-${year}.json`);
      if (!response.ok) continue;
      taxConfig = await response.json();
      return;
    } catch {
      // Try next available config year.
    }
  }

  results.classList.remove('hidden');
  results.innerHTML = '<p class="callout warning">Could not load tax configuration. Please refresh the page.</p>';
}

fillStates();
loadTaxConfig();
