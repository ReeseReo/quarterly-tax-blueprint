import { calculateQuarterlyTax, formatCurrency, getNextDeadline, NO_INCOME_TAX_STATES, parseCurrencyToCents, STATES } from './calculator.js';

const stateSelect = document.querySelector('#state');
const form = document.querySelector('#calculator-form');
const results = document.querySelector('#results');
const modal = document.querySelector('#email-modal');

let taxConfig;

function fillStates() {
  stateSelect.innerHTML = '<option value="">Select your state.</option>';
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
  const income = parseCurrencyToCents(form.income.value);
  const expenses = parseCurrencyToCents(form.expenses.value);
  const state = form.state.value;

  const errors = {
    income: income <= 0 ? 'Please enter income greater than $0.' : '',
    expenses: expenses < 0 ? 'Expenses cannot be negative.' : '',
    state: !state ? 'Please select a state.' : ''
  };

  for (const key of Object.keys(errors)) {
    document.getElementById(`${key}-error`).textContent = errors[key];
    const field = form[key];
    field.classList.toggle('input-error', Boolean(errors[key]));
    if (errors[key]) valid = false;
  }

  if (expenses > income && income > 0) {
    document.getElementById('expenses-error').textContent = 'Expenses exceed income — double-check if this is intentional.';
  }

  return valid;
}

function lineItem(label, value) {
  return `<li><span>${label}</span><strong>${formatCurrency(value)}</strong></li>`;
}

function renderResults(inputSnapshot, output) {
  const nextDeadline = getNextDeadline(taxConfig.quarterly_deadlines);
  const stateMsg = NO_INCOME_TAX_STATES.has(inputSnapshot.state)
    ? `<p class="callout success">Great news — ${inputSnapshot.stateName} has no state income tax. Your quarterly payment is federal only.</p>`
    : '<p class="callout warning">State taxes coming soon. This estimate is federal-only for now.</p>';

  const warningBlocks = [
    output.warnings.netLoss ? '<p class="callout warning">Expenses exceed income — you likely will not owe quarterly taxes on a loss.</p>' : '',
    output.warnings.qbiThreshold ? '<p class="callout warning">Your income may affect the QBI deduction. Consult a tax professional.</p>' : '',
    output.warnings.w2CoversTax ? '<p class="callout success">Your W-2 withholding may cover your freelance tax liability. You might not need estimated payments.</p>' : '',
    output.warnings.additionalMedicareTax ? '<p class="callout warning">Additional Medicare Tax is included because your self-employment tax base exceeds the threshold.</p>' : '',
    output.warnings.noIncome ? '<p class="callout success">No income, no estimated tax owed.</p>' : ''
  ].join('');

  results.innerHTML = `
    <div class="summary-bar">Income: ${formatCurrency(inputSnapshot.incomeCents)} | Expenses: ${formatCurrency(inputSnapshot.expensesCents)} | ${inputSnapshot.state} | ${inputSnapshot.filingStatusLabel}</div>
    <p class="disclaimer">This is an estimate for planning purposes. It is not tax advice. Consult a tax professional for your specific situation.</p>
    <section class="result-card">
      <p class="result-label">Your Estimated Quarterly Payment</p>
      <p class="result-amount">${formatCurrency(output.quarterlyPaymentCents)}</p>
      <p>Due by ${nextDeadline.label} — ${nextDeadline.days} days from now</p>
    </section>
    <details class="breakdown" open>
      <summary>How We Calculated This</summary>
      <ul class="breakdown-list">
        ${lineItem('Gross freelance income', inputSnapshot.incomeCents)}
        ${lineItem('Business expenses', -inputSnapshot.expensesCents)}
        ${lineItem('Net self-employment income', output.steps.netSeIncome)}
        ${lineItem('SE tax base (92.35% of net)', output.steps.seTaxBase)}
        ${lineItem('Social Security tax (12.4%)', output.steps.ssTax)}
        ${lineItem('Medicare tax (2.9%)', output.steps.medicareTax)}
        ${lineItem('Total self-employment tax', output.steps.totalSeTax)}
        ${lineItem('SE tax deduction (50%)', -output.steps.seDeduction)}
        ${lineItem('Adjusted gross income', output.steps.agi)}
        ${lineItem('Standard deduction', -output.steps.standardDeduction)}
        ${lineItem('QBI deduction', -output.steps.qbiDeduction)}
        ${lineItem('Federal taxable income', output.steps.federalTaxableIncome)}
        ${lineItem('Federal income tax', output.steps.federalIncomeTax)}
        ${lineItem('Total annual federal tax', output.steps.totalFederalTax)}
        ${lineItem('Quarterly payment (÷ 4)', output.quarterlyPaymentCents)}
      </ul>
    </details>
    ${stateMsg}
    ${warningBlocks}
    <p class="callout warning"><strong>Safe Harbor Rule:</strong> Pay at least 100% of last year's tax liability (110% if AGI &gt; $150K) and you won't owe a penalty — even if you underpay.</p>
    <div class="actions">
      <button type="button" class="secondary">Remind Me Before the Deadline</button>
      <button type="button" onclick="window.location.href='how-to-pay.html'">How Do I Actually Pay?</button>
    </div>
  `;
  results.classList.remove('hidden');
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validate()) return;

  const inputSnapshot = {
    incomeCents: parseCurrencyToCents(form.income.value),
    expensesCents: parseCurrencyToCents(form.expenses.value),
    w2WithholdingCents: parseCurrencyToCents(form.w2.value),
    filingStatus: form.filingStatus.value,
    filingStatusLabel: form.querySelector('input[name="filingStatus"]:checked').parentElement.textContent,
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
  if (selected?.dataset.supported === 'false') modal.showModal();
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

fillStates();
fetch('./tax-logic/federal-2025.json')
  .then((res) => res.json())
  .then((json) => {
    taxConfig = json;
  })
  .catch(() => {
    results.classList.remove('hidden');
    results.innerHTML = '<p class="callout warning">Could not load tax configuration. Please refresh the page.</p>';
  });
