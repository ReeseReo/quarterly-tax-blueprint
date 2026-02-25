# Content Inventory

## Page Titles & Meta Descriptions

| Page | Title | Meta Description |
|------|-------|-----------------|
| Landing | QuarterlyTax — Free Quarterly Tax Calculator for Freelancers | Calculate your quarterly estimated tax payment in 30 seconds. Federal + self-employment tax + QBI deduction. Free. No sign-up. |
| Dashboard | QuarterlyTax — Dashboard | (no public meta, requires auth) |
| Pricing | QuarterlyTax Pricing — Free Calculator, $6/mo Pro | Free quarterly tax calculator. Pro: expense tracking, receipt capture, deadline reminders for $6/mo or $49/yr. |
| How to Pay | How to Pay Quarterly Taxes — QuarterlyTax | Step-by-step guide to paying estimated quarterly taxes to the IRS and your state. |

## Error Messages

All errors: helpful tone, below the offending element, red `#D92D20` border + text. Focus returns to errored field.

| Trigger | Message |
|---------|---------|
| Income empty | "Please enter your projected freelance income." |
| Income invalid | "Please enter a number greater than $0." |
| Expenses > income | "Your expenses exceed your income. This means a net loss — is this correct? (You won't owe quarterly taxes on a loss.)" |
| No state selected | "Please select your state so we can tailor your estimate." |
| Email invalid | "Please enter a valid email address." |
| Password too short | "Password must be at least 8 characters." |
| Account already exists | "An account with this email already exists. Try logging in." |
| Wrong password | "Incorrect password. Try again or reset your password." |
| Payment failed | "We couldn't process your card. Please check and retry." |
| Network error | "Something went wrong. Your data is safe — please try again." |
| Receipt upload failed | "Couldn't upload image. You can try again or add a receipt later." |
| Google OAuth failed | "Couldn't connect to Google. Please try email sign-up." |
| 404 page | "Page not found. Let's get you back on track." CTA: "Go to Calculator." |

## Empty States

| Screen | Headline | Subtext | CTA |
|--------|----------|---------|-----|
| Expense list (no expenses) | "Start Tracking Your Business Expenses" | "Logging expenses lowers your taxable income and makes your quarterly estimate more accurate." | "Add First Expense" |
| Dashboard (no calculation) | "Welcome! Let's Figure Out What You Owe." | "Run your first quarterly tax calculation to get started." | "Calculate Now" |
| Receipt thumbnail (no image) | — | — | Gray placeholder with camera icon. Label: "No receipt" |

## Email Templates

### Deadline Reminder (2 weeks before each IRS deadline)

**Subject:** Your Q[X] estimated tax payment is due in 2 weeks.

**Body:**
Your estimated quarterly payment of $[amount] is due [date].

[CTA Button: "Recalculate My Estimate"]

[Secondary link: "How to pay the IRS"]

[Footer: Unsubscribe link]

### Trial Expiry (Day 12 of 14-day trial)

**Subject:** Your QuarterlyTax Pro trial ends in 2 days.

**Body:**
Add a payment method to keep expense tracking, receipt capture, and deadline reminders.

[CTA: "Upgrade to Pro"]

You'll switch to Free automatically. Your data stays.

### State Available Notification

**Subject:** [State] tax estimates are now available on QuarterlyTax.

**Body:**
Good news — we now calculate [State] state taxes alongside your federal estimate.

[CTA: "Recalculate with [State] Taxes"]

## Legal Copy

**Results disclaimer (always visible):**
"This is an estimate for planning purposes. It is not tax advice. Consult a tax professional for your specific situation."

**QBI high-income disclaimer (taxable income > $197,300 single):**
"Your income may affect the QBI deduction. Consult a tax professional."

**Auth footer:**
"By signing up, you agree to our Terms and Privacy Policy." (linked)

**Cancel subscription:**
"You'll keep Pro access until [date]. After that, you'll switch to Free automatically. Your data is never deleted."
