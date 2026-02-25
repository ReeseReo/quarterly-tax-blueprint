# QuarterlyTax — App Design Blueprint v1.2

> **Know what you owe before it hits.**
> The freelancer quarterly tax estimator.

## What This Is

A developer-ready specification for a web + mobile tool that calculates quarterly estimated tax payments for freelancers. Three inputs → one number → relief.

**Core Value Proposition:** A freelancer enters their projected income, expenses, state, and filing status. They instantly see their quarterly federal estimated tax payment with a full transparent breakdown — no sign-up required.

## Repo Structure

```
quarterly-tax-blueprint/
├── README.md                      ← You are here
├── BUILD-ORDER.md                 ← What to build and when
├── specs/
│   ├── ARCHITECTURE.md            ← Technical constraints, data models, integrations
│   ├── USER-FLOWS.md              ← All user flows with step-by-step specs
│   ├── DESIGN-SYSTEM.md           ← Colors, typography, components, accessibility
│   └── CONTENT.md                 ← All copy: headlines, errors, emails, empty states
├── tax-logic/
│   ├── CALCULATION.md             ← The exact 15-step tax calculation algorithm
│   ├── federal-2025.json          ← 2025 federal brackets, deductions, rates
│   ├── federal-2026.json          ← 2026 federal brackets, deductions, rates
│   └── STATE-ROLLOUT.md           ← Phased state support plan + config schema
└── screens/
    ├── 01-landing-calculator.md   ← Landing page + calculator card
    ├── 02-results-breakdown.md    ← Results panel (inline, not separate page)
    ├── 03-dashboard.md            ← Logged-in user home
    ├── 04-expense-tracker.md      ← Expense list + add expense sheet
    ├── 05-pricing.md              ← Pricing page
    ├── 06-how-to-pay.md           ← How to pay the IRS guide
    ├── 07-auth-modal.md           ← Sign up / log in
    ├── 08-email-capture.md        ← Deadline reminder email capture
    └── 09-settings.md             ← User settings + billing
```

## Target User

**Alex, 28–40.** Freelance designer/developer/writer. Self-employed < 2 years. Earns $40K–$120K/year. Has never made a quarterly estimated tax payment or has missed one. Anxious, overwhelmed, zero patience for complexity. Wants to do the right thing but doesn't know what it is.

**Secondary: Jordan, 25–45.** Has a W-2 day job + freelance side income. Employer withholds on the W-2 portion but they owe additional tax on freelance income.

## Key Design Decisions

1. **Calculator on the landing page.** No sign-up gate. Value in < 30 seconds.
2. **Federal-first MVP.** State taxes are complex (43 unique configs). MVP ships federal-only + 9 no-income-tax states. States added in phases.
3. **QBI deduction included.** The Section 199A deduction (20% of qualified business income) was made permanent by the OBBBA in July 2025. Omitting it overstates quarterly payments by ~$200/quarter on a $60K income.
4. **Transparent math.** Every line item is visible and explained. No black boxes.
5. **Retention via reminders.** Email capture for deadline reminders is the primary retention mechanism. No account required.

## Pricing Model

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 forever | Quarterly calculator, federal + SE + QBI, safe harbor guidance |
| Pro | $6/mo or $49/yr | Everything in Free + expense tracking, receipt capture, deadline reminders, quarterly history, tax preparer export |

14-day free trial, no card required. 30-day money-back guarantee.

## Quick Start for Codex

1. Read `BUILD-ORDER.md` for what to build first
2. Read `tax-logic/CALCULATION.md` for the exact tax algorithm
3. Read `screens/01-landing-calculator.md` and `screens/02-results-breakdown.md` for the two MVP screens
4. Read `specs/ARCHITECTURE.md` for data models and technical constraints
5. Build MVP (Weeks 1–2): Landing + Calculator → Results → Email Capture → How to Pay
