# Tax Calculation Algorithm

> **CRITICAL:** This is the core logic of the product. Every step must be implemented exactly as specified. All rates and thresholds are stored in JSON config files (`federal-2025.json`, `federal-2026.json`) so they can be updated annually without a code deploy.

## Inputs

| Input | Field Label | Type | Validation |
|-------|-------------|------|------------|
| `gross_income` | "What's your projected income for the full year?" | Currency (integer cents) | > 0 |
| `expenses` | "Estimated business expenses for the year?" | Currency (integer cents) | >= 0. Warning (not block) if > gross_income |
| `state` | "What state do you live in?" | Enum (US states + DC) | Required |
| `filing_status` | "Filing status?" | Enum: `single`, `mfj`, `hoh` | Default: `single` |
| `w2_withholding` | "Expected W-2 withholding for the year" | Currency (integer cents) | >= 0. Optional (default 0) |

All amounts stored and calculated in **cents** (integers) to avoid floating point issues. Display as dollars.

## The 15-Step Calculation

```
STEP 1: net_se_income = gross_income - expenses

STEP 2: se_tax_base = net_se_income × 0.9235
         (IRS Schedule SE — equivalent of employer FICA exclusion)

STEP 3: ss_wage_base = config.ss_wage_base  // $176,100 for 2025, $184,500 for 2026
         ss_taxable = MIN(se_tax_base, ss_wage_base)
         ss_tax = ss_taxable × 0.124

STEP 4: medicare_tax = se_tax_base × 0.029

STEP 5: additional_medicare_threshold = config.additional_medicare_threshold[filing_status]
         // $200,000 single/hoh, $250,000 mfj, $125,000 mfs
         // Threshold is REDUCED by W-2 Medicare wages (for simplicity, use w2_withholding / 0.0145 as estimate of W-2 wages, OR ask for W-2 wages directly in Phase 2)
         // For MVP: if no W-2, full threshold applies against se_tax_base
         additional_medicare = MAX(0, se_tax_base - additional_medicare_threshold) × 0.009

STEP 6: total_se_tax = ss_tax + medicare_tax + additional_medicare

STEP 7: se_deduction = total_se_tax × 0.50
         (Above-the-line deduction — IRS Schedule SE Line 13)

STEP 8: agi = net_se_income - se_deduction + w2_income
         // w2_income is estimated from w2_withholding for MVP
         // For MVP simplification: agi = net_se_income - se_deduction
         // (W-2 income affects brackets but isn't the core use case)

STEP 9: standard_deduction = config.standard_deduction[filing_status]
         // 2025 post-OBBBA: single=$15,750, mfj=$31,500, hoh=$23,625
         // 2026: single=$16,100, mfj=$32,200, hoh=$24,150

STEP 10: taxable_income_before_qbi = MAX(0, agi - standard_deduction)

STEP 11: qbi = net_se_income - se_deduction
          // Simplified: no self-employed health insurance or retirement deductions in MVP
          qbi_20_pct = qbi × 0.20
          taxable_20_pct = taxable_income_before_qbi × 0.20
          qbi_deduction = MIN(qbi_20_pct, taxable_20_pct)
          // This simplified Form 8995 logic applies when taxable income < $197,300 single / $394,600 mfj (2025)
          // Above those thresholds: show disclaimer "Your income may affect the QBI deduction. Consult a tax professional."

STEP 12: federal_taxable_income = MAX(0, agi - standard_deduction - qbi_deduction)

STEP 13: federal_income_tax = apply_brackets(federal_taxable_income, config.brackets[filing_status])
          // See bracket application algorithm below

STEP 14: total_federal_tax = federal_income_tax + total_se_tax

STEP 15: quarterly_payment = MAX(0, (total_federal_tax - w2_withholding)) / 4
          // Round to nearest dollar for display
```

## Bracket Application Algorithm

```javascript
function apply_brackets(taxable_income, brackets) {
  // brackets = [{min: 0, max: 11925, rate: 0.10}, {min: 11925, max: 48475, rate: 0.12}, ...]
  let tax = 0;
  for (const bracket of brackets) {
    if (taxable_income <= bracket.min) break;
    const taxable_in_bracket = Math.min(taxable_income, bracket.max) - bracket.min;
    tax += taxable_in_bracket * bracket.rate;
  }
  return Math.round(tax);
}
```

## Worked Example

**Inputs:** $60,000 gross income, $8,000 expenses, Single, $0 W-2 withholding, 2025 tax year.

| Step | Calculation | Result |
|------|-------------|--------|
| 1 | $60,000 − $8,000 | **Net SE income: $52,000** |
| 2 | $52,000 × 0.9235 | **SE tax base: $48,022** |
| 3 | $48,022 × 0.124 (under $176,100 cap) | **SS tax: $5,955** |
| 4 | $48,022 × 0.029 | **Medicare tax: $1,393** |
| 5 | $48,022 < $200,000 threshold | **Additional Medicare: $0** |
| 6 | $5,955 + $1,393 + $0 | **Total SE tax: $7,348** |
| 7 | $7,348 × 0.50 | **SE deduction: $3,674** |
| 8 | $52,000 − $3,674 | **AGI: $48,326** |
| 9 | Single, 2025 post-OBBBA | **Standard deduction: $15,750** |
| 10 | $48,326 − $15,750 | **Taxable before QBI: $32,576** |
| 11a | QBI = $52,000 − $3,674 = $48,326 | 20% of QBI = **$9,665** |
| 11b | 20% of taxable = $32,576 × 0.20 | = **$6,515** |
| 11c | MIN($9,665, $6,515) | **QBI deduction: $6,515** |
| 12 | $48,326 − $15,750 − $6,515 | **Federal taxable: $26,061** |
| 13a | 10% on $0–$11,925 | = $1,193 |
| 13b | 12% on $11,925–$26,061 | = $1,696 |
| 13 | $1,193 + $1,696 | **Federal income tax: $2,889** |
| 14 | $2,889 + $7,348 | **Total federal tax: $10,237** |
| 15 | $10,237 ÷ 4 | **Quarterly payment: $2,559** |

### What the user sees in the results breakdown:

```
Your Estimated Quarterly Payment: $2,559
Due by June 15 — 47 days from now

How We Calculated This:
  Gross freelance income:                    $60,000
  Business expenses:                         −$8,000
  Net self-employment income:                $52,000
  SE tax base (92.35% of net):               $48,022
  Social Security tax (12.4%):                $5,955
  Medicare tax (2.9%):                        $1,393
  Total self-employment tax:                  $7,348
  SE tax deduction (50%):                    −$3,674
  Adjusted gross income:                     $48,326
  Standard deduction (Single, 2025):        −$15,750
  QBI deduction (20%, limited):              −$6,515
  Federal taxable income:                    $26,061
  Federal income tax:                         $2,889
  ─────────────────────────────────────────────────
  Total annual federal tax:                  $10,237
  Quarterly payment (÷ 4):                    $2,559
```

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Expenses > income (net loss) | Warning: "Expenses exceed income — is this correct? You won't owe quarterly taxes on a loss." Show $0 quarterly payment. |
| Income = $0 | Show $0. Message: "No income, no estimated tax owed." |
| Very high income (> $200K single) | Additional Medicare Tax kicks in at Step 5. Show amber callout explaining it. |
| Taxable income above QBI threshold ($197,300 single) | Show disclaimer: "Your income may affect the QBI deduction. Consult a tax professional." Use simplified calculation anyway — better than omitting QBI entirely. |
| W-2 withholding > total tax | Quarterly payment = $0. Message: "Your W-2 withholding may cover your freelance tax liability. You might not need to make estimated payments." |
| State with income tax (MVP) | Show federal-only result + "State taxes for [State] coming soon. Get notified." |
| No-income-tax state | Show "Great news — [State] has no state income tax. Your quarterly payment is federal only." |

## Safe Harbor Rules (Display Only — Not Part of Calculation)

Show as an informational callout below the breakdown:

> **Safe Harbor Rule:** Pay at least 100% of last year's tax liability (110% if AGI > $150K) and you won't owe a penalty — even if you underpay.

The product does NOT calculate safe harbor amounts (requires prior-year tax data we don't have). It educates the user about the rule.

## Config Update Process

1. IRS publishes new brackets/deductions (typically October for next tax year)
2. Update the relevant JSON config file (e.g., `federal-2026.json`)
3. Deploy config update — no code changes needed
4. State configs updated similarly, one file per state per year
