export const NO_INCOME_TAX_STATES = new Set([
  'AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY'
]);

export const STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'], ['CO', 'Colorado'],
  ['CT', 'Connecticut'], ['DE', 'Delaware'], ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'],
  ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'],
  ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'],
  ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'],
  ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'], ['DC', 'District of Columbia']
];

export function parseCurrencyToCents(raw) {
  const normalized = String(raw ?? '').replace(/[^\d.]/g, '');
  if (!normalized) return 0;
  return Math.round(Number(normalized) * 100);
}

function applyBrackets(taxableIncomeCents, brackets) {
  let tax = 0;
  for (const bracket of brackets) {
    if (taxableIncomeCents <= bracket.min) break;
    const taxableInBracket = Math.min(taxableIncomeCents, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }
  return Math.round(tax);
}

export function calculateQuarterlyTax(inputs, config) {
  const netSeIncome = Math.max(0, inputs.incomeCents - inputs.expensesCents);
  const seTaxBase = Math.round(netSeIncome * config.se_tax_base_factor);
  const ssTaxableBase = Math.min(seTaxBase, config.ss_wage_base);
  const ssTax = Math.round((ssTaxableBase * config.se_tax_rate_ss) / 100) * 100;
  const medicareTax = Math.round((seTaxBase * config.se_tax_rate_medicare) / 100) * 100;
  const threshold = config.additional_medicare_threshold[inputs.filingStatus] ?? config.additional_medicare_threshold.single;
  const additionalMedicareTax = seTaxBase > threshold ? Math.round(((seTaxBase - threshold) * config.additional_medicare_rate) / 100) * 100 : 0;
  const totalSeTax = ssTax + medicareTax + additionalMedicareTax;
  const seDeduction = Math.round((totalSeTax * config.se_deduction_factor) / 100) * 100;
  const agi = Math.max(0, netSeIncome - seDeduction);
  const standardDeduction = config.standard_deduction[inputs.filingStatus];
  const taxableBeforeQbi = Math.max(0, agi - standardDeduction);
  const qbi = Math.max(0, netSeIncome - seDeduction);
  const qbiDeduction = Math.min(Math.round((qbi * 0.2) / 100) * 100, Math.round((taxableBeforeQbi * 0.2) / 100) * 100);
  const federalTaxableIncome = Math.max(0, agi - standardDeduction - qbiDeduction);
  const federalIncomeTax = Math.round(applyBrackets(federalTaxableIncome, config.brackets[inputs.filingStatus]) / 100) * 100;
  const totalFederalTax = federalIncomeTax + totalSeTax;
  const quarterlyPayment = Math.max(0, totalFederalTax - inputs.w2WithholdingCents) / 4;

  const qbiThreshold = config.qbi_simplified_threshold[inputs.filingStatus] ?? config.qbi_simplified_threshold.single;
  return {
    quarterlyPaymentCents: Math.round(quarterlyPayment),
    steps: {
      netSeIncome,
      seTaxBase,
      ssTax,
      medicareTax,
      additionalMedicareTax,
      totalSeTax,
      seDeduction,
      agi,
      standardDeduction,
      taxableBeforeQbi,
      qbiDeduction,
      federalTaxableIncome,
      federalIncomeTax,
      totalFederalTax
    },
    warnings: {
      netLoss: inputs.expensesCents > inputs.incomeCents,
      qbiThreshold: taxableBeforeQbi > qbiThreshold,
      w2CoversTax: inputs.w2WithholdingCents > totalFederalTax,
      additionalMedicareTax: additionalMedicareTax > 0,
      noIncome: inputs.incomeCents === 0
    }
  };
}

export function formatCurrency(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);
}

export function getNextDeadline(deadlines) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcoming = deadlines
    .map((d) => ({ ...d, date: new Date(`${d.due_date}T00:00:00`) }))
    .find((d) => d.date >= now);

  const picked = upcoming ?? { due_date: `${now.getFullYear()}-12-31`, date: new Date(`${now.getFullYear()}-12-31T00:00:00`) };
  const days = Math.max(0, Math.ceil((picked.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  return { label: picked.due_date, days };
}
