# Architecture & Technical Constraints

## Performance

- **LCP** (Largest Contentful Paint): < 1.5 seconds on landing page
- **Tax calculation**: Client-side, < 100ms. No API round-trip for the core calculation.
- **Approach**: SPA (single-page app behavior). Results panel is inline, not a page navigation.

## Tech Stack Constraints (Not Prescriptive)

We don't mandate a specific stack. The app needs to support:

- Client-side tax calculation (JavaScript)
- JSON config loading (tax rates by year)
- Email capture and storage (no account required)
- User auth (email/password + Google OAuth)
- Subscription billing (Stripe)
- Image upload (receipt photos)
- Transactional email delivery
- Responsive mobile-first UI

## Data Models

### User (created at sign-up)

```
{
  id: uuid
  email: string
  auth_provider: "email" | "google"
  state: string (2-letter code)
  filing_status: "single" | "mfj" | "hoh"
  plan: "free" | "pro_trial" | "pro_monthly" | "pro_annual"
  trial_expires_at: timestamp | null
  stripe_customer_id: string | null
  created_at: timestamp
}
```

### Calculation (saved when user has account)

```
{
  id: uuid
  user_id: uuid
  tax_year: integer
  quarter: 1-4
  gross_income: integer (cents)
  expenses: integer (cents)
  state: string
  filing_status: string
  w2_withholding: integer (cents)
  result_quarterly_payment: integer (cents)
  result_total_federal_tax: integer (cents)
  result_se_tax: integer (cents)
  result_federal_income_tax: integer (cents)
  result_state_tax: integer (cents) | null
  config_version: string (e.g., "federal-2025")
  created_at: timestamp
}
```

### Expense (Pro feature)

```
{
  id: uuid
  user_id: uuid
  amount: integer (cents)
  description: string (max 200 chars)
  category: enum (see IRS categories below)
  date: date
  receipt_url: string | null
  quarter: 1-4 (derived from date)
  tax_year: integer (derived from date)
  created_at: timestamp
}
```

### Reminder (no account needed)

```
{
  id: uuid
  email: string
  state: string | null
  type: "deadline" | "state_notify"
  next_send_date: date | null
  created_at: timestamp
}
```

## IRS Schedule C Expense Categories

```
advertising
car_truck
contract_labor
insurance
legal_professional
office_expense
rent_lease
repairs
software_subscriptions
supplies
travel
meals_50_pct
utilities
other
```

Note: Meals are 50% deductible. The expense amount stored is the full amount; the deduction calculation applies the 50% factor.

## Integrations

| Integration | Purpose | When |
|-------------|---------|------|
| **Stripe Checkout** | Subscription billing ($6/mo, $49/yr). 14-day trial, no card required. | Phase 2 |
| **Google OAuth** | One-tap sign-up/login | Phase 2 |
| **SendGrid / Postmark / Resend** | Transactional email: deadline reminders, trial expiry, password reset | MVP (reminders), Phase 2 (auth emails) |
| **S3 or equivalent** | Receipt photo storage. Max 5MB, JPEG/PNG. Client-side compression before upload. | Phase 2 |

## Email Schedule

| Email | Trigger | Content Spec |
|-------|---------|--------------|
| Deadline reminder | 2 weeks before each IRS deadline (Apr 15, Jun 15, Sep 15, Jan 15) | See `CONTENT.md` |
| Trial expiry | Day 12 of 14-day trial | See `CONTENT.md` |
| Password reset | User requests | Standard reset link flow |
| State available | State goes live that user requested | "Good news — [State] tax estimates are now available. Recalculate →" |

## Legal Requirements

- **Disclaimer on every result:** "This is an estimate for planning purposes. It is not tax advice. Consult a tax professional for your specific situation."
- **Terms of service:** Must include liability limitation for tax estimates.
- **QBI high-income disclaimer:** When taxable income > $197,300 single: "Your income may affect the QBI deduction. Consult a tax professional."
- **Privacy policy:** Required. Email addresses collected for reminders.

## Naming Conventions

| Screen / Component | Internal Name | Route |
|-------------------|---------------|-------|
| Landing + Calculator | `landing` | `/` |
| Results Panel | `results-panel` | (inline on `/`) |
| Dashboard | `dashboard` | `/dashboard` |
| Expense List | `expense-list` | `/expenses` |
| Add Expense Sheet | `add-expense-sheet` | (modal) |
| Pricing Page | `pricing` | `/pricing` |
| How to Pay Guide | `how-to-pay` | `/how-to-pay` |
| Auth Modal | `auth-modal` | (modal) |
| Email Capture Modal | `email-capture` | (modal) |
| Settings | `settings` | `/settings` |
| 404 Page | `not-found` | `/*` |
