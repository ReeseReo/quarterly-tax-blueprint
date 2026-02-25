# State Tax Rollout Plan

## Why States Are Phased (Not Day 1)

Each state requires its own config with **8 dimensions** that vary independently:

1. **Bracket table** — 1 to 12 tiers, unique thresholds per state
2. **Standard deduction** — by filing status. Some states have none.
3. **Personal exemption / credit** — dollar amount or credit, varies wildly
4. **Federal conformity** — does the state start from federal AGI? Federal taxable income? Its own calculation?
5. **QBI conformity** — does the state allow the Section 199A deduction? (CA does not)
6. **Estimated payment schedule** — equal quarters or custom split (CA: 30/40/0/30)
7. **Payment threshold** — minimum owed before estimated payments required ($150 VA, $500 CA, $1,000+ others)
8. **Safe harbor exceptions** — most mirror federal, but CA has a $1M AGI exception

## Rollout Phases

### MVP: No-Income-Tax States (9 states)

Alaska, Florida, Nevada, New Hampshire*, South Dakota, Tennessee, Texas, Washington, Wyoming.

*New Hampshire taxes dividends and interest only (being phased out). For freelance SE income, effectively no state tax.

**Implementation:** When user selects these states, show: "Great news — [State] has no state income tax. Your quarterly payment is federal only."

### Phase 2: Top 10 Income-Tax States

| State | Brackets | Quarterly Schedule | Key Complexity |
|-------|----------|--------------------|----------------|
| California | 9 (1%–12.3% + 1% mental health) | 30/40/0/30 | Does NOT conform to QBI. Own standard deduction ($5,706 single). |
| New York | 8 (4%–10.9%) | Equal quarters | NYC adds 3.078%–3.876% local tax. Phase 2: state only, NYC in Phase 3. |
| Illinois | Flat 4.95% | Equal quarters | Simple — flat rate, no brackets. |
| Pennsylvania | Flat 3.07% | Equal quarters | Simple — flat rate. No standard deduction (all income taxed). |
| Ohio | 4 (0%–3.5%) | Equal quarters | First $26,050 exempt (2025). |
| Georgia | 5 (1%–5.39%) | Equal quarters | Recently transitioned toward flat tax. |
| North Carolina | Flat 4.5% | Equal quarters | Simple — flat rate. |
| New Jersey | 6 (1.4%–10.75%) | Equal quarters | |
| Virginia | 4 (2%–5.75%) | Equal quarters | Low $150 threshold for estimated payments. |
| Massachusetts | Flat 5% + 4% surtax > $1M | Equal quarters | Surtax affects very high earners. |

### Phase 3: Remaining 33 States + DC

Batch implementation using the config architecture below. Prioritize by `state_notify_signup` event volume from MVP.

### Coming-Soon State UX

When a user selects a state not yet supported:
1. Calculator still runs — shows **federal-only** result
2. Below the result: amber callout: "State tax estimates for [State] are coming soon. Your federal estimate is shown above."
3. Email capture: "Get notified when [State] is added." → captures email + state → tracked as `state_notify_signup` event
4. This email list drives rollout prioritization in Phase 2/3

## Per-State Config Schema

Each state config is a separate JSON file: `state-{abbrev}-{year}.json`

```json
{
  "state": "CA",
  "state_name": "California",
  "tax_year": 2025,
  "has_income_tax": true,
  "federal_conformity": {
    "starting_point": "federal_agi",
    "allows_qbi_deduction": false,
    "allows_se_deduction": true,
    "adjustments_notes": "CA does not conform to Section 199A. SE deduction is allowed."
  },
  "standard_deduction": {
    "single": 570600,
    "mfj": 1141200,
    "hoh": 1141200
  },
  "personal_exemption_credit": {
    "type": "credit",
    "single": 15300,
    "mfj": 30600,
    "hoh": 15300
  },
  "brackets": {
    "single": [
      { "min": 0, "max": 1107900, "rate": 0.01 },
      { "min": 1107900, "max": 2626400, "rate": 0.02 },
      { "min": 2626400, "max": 4145200, "rate": 0.04 },
      { "min": 4145200, "max": 5754200, "rate": 0.06 },
      { "min": 5754200, "max": 7272400, "rate": 0.08 },
      { "min": 7272400, "max": 37147900, "rate": 0.093 },
      { "min": 37147900, "max": 44577100, "rate": 0.103 },
      { "min": 44577100, "max": 74295300, "rate": 0.113 },
      { "min": 74295300, "max": 999999999999, "rate": 0.123 }
    ]
  },
  "surtax": {
    "rate": 0.01,
    "threshold": 100000000,
    "name": "Mental Health Services Tax (Prop 63)"
  },
  "estimated_payment": {
    "schedule": [0.30, 0.40, 0.00, 0.30],
    "deadlines": ["2025-04-15", "2025-06-16", null, "2026-01-15"],
    "threshold": 50000,
    "threshold_mfs": 25000
  },
  "safe_harbor": {
    "mirrors_federal": true,
    "exceptions": "AGI >= $1,000,000 ($500,000 MFS): cannot use prior-year safe harbor. Must base estimates on current-year tax."
  }
}
```

## Flat-Tax State Config (Simpler)

```json
{
  "state": "IL",
  "state_name": "Illinois",
  "tax_year": 2025,
  "has_income_tax": true,
  "federal_conformity": {
    "starting_point": "federal_agi",
    "allows_qbi_deduction": true,
    "allows_se_deduction": true
  },
  "flat_rate": 0.0495,
  "personal_exemption": {
    "type": "deduction",
    "single": 250000,
    "mfj": 500000
  },
  "estimated_payment": {
    "schedule": [0.25, 0.25, 0.25, 0.25],
    "deadlines": ["2025-04-15", "2025-06-16", "2025-09-15", "2026-01-15"],
    "threshold": 100000
  },
  "safe_harbor": {
    "mirrors_federal": true,
    "exceptions": null
  }
}
```

## No-Tax State Config

```json
{
  "state": "TX",
  "state_name": "Texas",
  "tax_year": 2025,
  "has_income_tax": false,
  "display_message": "Great news — Texas has no state income tax. Your quarterly payment is federal only."
}
```
