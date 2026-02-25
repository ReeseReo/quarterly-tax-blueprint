# User Flows

## Flow 1: First-Time User → First Value

1. User lands on home page via Google search or Reddit link.
2. Sees headline + calculator card (no scroll needed on mobile).
3. Enters projected annual income → auto-formats with commas.
4. Enters estimated expenses → validates.
5. Selects state. If no-tax state: proceeds. If coming-soon state: email capture modal appears, then federal-only calculation proceeds.
6. Selects filing status (defaulted to Single).
7. Optionally expands W-2 accordion and enters withholding.
8. Taps "Calculate My Quarterly Tax" → 300ms calculation feedback.
9. Results panel slides in. Calculator compresses to summary bar.
10. User sees quarterly amount + deadline countdown.

**Success:** "Your Estimated Quarterly Payment: $X,XXX." Full breakdown visible.
**Error:** Inline error below invalid field. No page reload, no data loss.

## Flow 2: Calculate → Understand → Retain

1. Calculation complete. User reads hero number + deadline.
2. Reviews tax breakdown (default: expanded).
3. Optionally taps (i) tooltips to learn about each line item.
4. Reads safe harbor note.
5. Taps "Remind Me Before the Deadline" → email capture modal.
6. Enters email → "Set Reminder" → confirmation.
7. Optionally taps "How Do I Actually Pay?" for IRS payment instructions.

**Success:** User has number, understands it, has reminder set.
**Error:** Invalid email → "Please enter a valid email address."

## Flow 3: Return User → Recalculate

1. Opens app or clicks reminder email link → dashboard.
2. Sees current estimate + deadline countdown.
3. Taps "Recalculate" → calculator pre-filled, expenses auto-summed from tracker.
4. Adjusts income if needed → recalculates.
5. Dashboard updates with new estimate.

**Success:** Updated estimate. Previous quarter archived in timeline.

## Flow 4: Free → Trial → Paid

1. User taps "Start 14-Day Free Trial" from pricing page or upsell strip.
2. Auth modal: Google OAuth or email + password.
3. Trial confirmation: "Trial started! 14 days of Pro free."
4. Day 12: Email — "Trial ends in 2 days. Add payment to keep Pro."
5. User: Settings → Billing → Stripe Checkout.
6. Confirmation: "You're on Pro!"

**Success:** Full Pro access. Dashboard unlocks all features.
**Error:** "Couldn't process your card. Please check and retry." User keeps trial until expiry.

## Interaction Details

| Interaction | Specification | Emotional Intent |
|-------------|---------------|-----------------|
| Loading | Button: "Calculating..." (300ms). Dashboard: skeleton cards. Expenses: skeleton rows. | Perceived speed. |
| Success | Calculation: number counts up (600ms). Expense: green toast (3s). Reminder: inline confirmation. | Closure. |
| Errors | Below the field. Red `#D92D20` border + text. Focus returns to error. Never: "Invalid input." | Guide, don't blame. |
| Empty States | Illustration + explanation + CTA. Every empty state is onboarding. | Invitation, not absence. |
| Transitions | Results: slide-down 300ms. Modals: fade + scale 200ms. Navigation: instant. Toasts: slide 200ms. | Orientation, not decoration. |
