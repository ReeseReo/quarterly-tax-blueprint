# Build Order

## MVP — Weeks 1–2

Federal tax only + 9 no-income-tax states. Delivers value to ~30% of US freelancers.

| Priority | What | Why | Spec |
|----------|------|-----|------|
| 1 | Landing Page + Calculator | This IS the product. 4 inputs, 1 button, 1 result. | `screens/01-landing-calculator.md` |
| 2 | Results Breakdown | Delivers the value. Transparent math. Retention hook (reminder CTA). | `screens/02-results-breakdown.md` |
| 3 | Email Capture Modal | Simplest retention. Also captures emails from coming-soon state users. | `screens/08-email-capture.md` |
| 4 | How to Pay Guide | Prevents dead-end. Static content. | `screens/06-how-to-pay.md` |
| 5 | 404 Page | Catches bad links from SEO/Reddit traffic. | (simple redirect to `/`) |

### MVP Definition of Done

- [ ] User can enter income, expenses, state, filing status
- [ ] Calculator produces correct quarterly federal estimated payment (verified against `tax-logic/CALCULATION.md` worked example)
- [ ] QBI deduction is applied
- [ ] Standard deduction uses post-OBBBA 2025 amounts
- [ ] SE tax correctly uses 92.35% base with SS/Medicare split
- [ ] W-2 withholding accordion works and subtracts from estimate
- [ ] Results show full line-item breakdown with (i) tooltips
- [ ] Legal disclaimer visible on every result
- [ ] "Remind Me Before the Deadline" opens email capture
- [ ] "How Do I Actually Pay?" links to guide
- [ ] No-tax states show "$0 state tax" message
- [ ] Coming-soon states show notification signup
- [ ] Page loads in < 1.5s (LCP)
- [ ] Calculation runs client-side in < 100ms
- [ ] Mobile-first, works on 320px+ screens

---

## Phase 2 — Weeks 3–4

Retention mechanics, monetization, and top 10 income-tax states.

| Priority | What | Spec |
|----------|------|------|
| 6 | Auth (Sign Up / Log In) | `screens/07-auth-modal.md` |
| 7 | Dashboard | `screens/03-dashboard.md` |
| 8 | Expense Tracker + Receipts | `screens/04-expense-tracker.md` |
| 9 | Pricing + Stripe | `screens/05-pricing.md` |
| 10 | Settings | `screens/09-settings.md` |
| 11 | State Tax: Top 10 States | `tax-logic/STATE-ROLLOUT.md` |

**Top 10 states (Phase 2):** CA, NY, IL, PA, OH, GA, NC, NJ, VA, MA.
Combined with no-tax states, this covers ~65% of US freelancers.

---

## Phase 3 — Weeks 5–8

Complete state coverage and advanced features.

| Priority | What |
|----------|------|
| 12 | Remaining 33 income-tax states + DC |
| 13 | State-specific safe harbor rules |
| 14 | State-specific quarterly payment schedules |

---

## Backlog

- Push notifications for deadline reminders
- Quarterly history with year-over-year comparison
- Export to CSV/PDF for tax preparer
- Dark mode
- Expense insights ("40% more on software this quarter")
- Multi-state support (freelancer in two states same year)
- 1040-ES voucher pre-fill
- Annualized income installment method for uneven earnings
- QBI phase-out logic for high-income SSTB above $197,300
- Itemized deduction support
- Local/city income tax (NYC, Portland, etc.)

---

## Analytics Events to Instrument

| Event | Trigger | Why |
|-------|---------|-----|
| `calculator_started` | First input interaction | Engagement rate |
| `w2_accordion_opened` | Expand W-2 section | Secondary persona demand |
| `calculator_completed` | Results displayed | Core conversion |
| `breakdown_toggled` | Expand/collapse breakdown | Trust engagement |
| `tooltip_opened` | Tap (i) icon | Which concepts confuse users |
| `reminder_signup` | Email submitted for reminder | Most important retention signal |
| `state_notify_signup` | Coming-soon state email submitted | State rollout prioritization |
| `how_to_pay_clicked` | Tap How to Pay | Intent to act |
| `account_created` | Sign-up completed | Free → registered |
| `expense_added` | Expense saved | Weekly retention signal |
| `receipt_captured` | Receipt photo attached | Feature adoption |
| `trial_started` | Pro trial begins | Free → trial |
| `subscription_started` | Stripe payment completes | Revenue event |
| `subscription_churned` | Cancel or non-renewal | Churn diagnosis |
| `reminder_email_opened` | Email open tracked | Re-engagement quality |
