# Screen 1: Landing Page + Calculator

**Route:** `/`
**Purpose:** Convert a stressed freelancer into a relieved user within 30 seconds.
**Emotional Target:** Relief and confidence. "Finally, something simple."
**Primary Action:** Fill in fields and tap "Calculate My Quarterly Tax."

## Layout (top to bottom)

### Top Bar (sticky, 56px)
- Logo ("QuarterlyTax" wordmark) — left
- "Log In" text link — right
- White background, no hamburger menu

### Hero Section
- Full-width, `#F0FDF4` background, 48px top / 32px bottom padding
- **H1:** "Know What You Owe — In 30 Seconds" — 32px bold, `#101828`, centered
- **Subheadline:** "The quarterly tax calculator built for freelancers, not accountants." — 18px, `#475467`, centered, 12px below
- **Trust bar:** "Free to use · Federal + self-employment tax · Takes 30 seconds." — 14px, `#98A2B3`, centered, 24px below

### Calculator Card
White, `shadow-md`, 24px radius, 32px padding. 24px below hero. **Four input fields** stacked with 20px gaps:

**Field 1 — "What's your projected income for the full year?"**
Currency input, "$" prefix. Placeholder: "e.g. 60,000"
Helper: "Your best estimate of total freelance income for the entire tax year, before expenses."

**Field 2 — "Estimated business expenses for the year?"**
Currency input, "$" prefix. Placeholder: "e.g. 8,000"
Helper: "Software, equipment, home office, travel — anything you buy to do your work. Enter $0 if none."

**Field 3 — "What state do you live in?"**
Dropdown select.
- MVP: 9 no-income-tax states fully functional
- All other states visible but marked "State taxes coming soon — get notified"
- Selecting a coming-soon state opens email capture modal
- Default: "Select your state."

**Field 4 — "Filing status?"**
Segmented control: Single | Married Filing Jointly | Head of Household
Default: Single
Helper: "This determines your federal tax bracket. Most single freelancers choose Single."

**Optional Accordion — "Already have taxes withheld from a W-2 job?"**
Collapsed by default. Expands to single currency input: "Expected W-2 withholding for the year."
Helper: "Find this on your latest pay stub under 'Federal Tax Withheld YTD.' We'll subtract this from your quarterly estimate."

**CTA Button:** Full-width, 52px, `#1B6B4A`, white bold text: "Calculate My Quarterly Tax." Radius 12px. Hover: `#145236`.

**Micro-reassurance:** 8px below button, centered, 12px, `#98A2B3`: "No sign-up required. Free forever for basic calculations."

### Below the Card
Three feature cards (stack on mobile):
- "Quarterly Deadlines" — calendar icon — "Never miss a payment. We'll remind you 2 weeks early."
- "Expense Tracking" — receipt icon — "Log expenses by IRS category. Snap receipts with your phone."
- "Accurate Math" — calculator icon — "SE tax, QBI deduction, standard deduction — all built in."

### Social Proof
Pull quote with left green border: "I was totally confused about quarterly taxes. This showed me exactly what I owed in 20 seconds." — Sarah, Freelance Designer.

### Footer
About, Privacy, Terms, Contact. Copyright. No social links in MVP.

## Element Spec

| Element | Type | Behavior | Why |
|---------|------|----------|-----|
| Income Input | Currency field | Auto-formats commas on blur. Validates > 0. Red border + error if invalid. | Core calculation input |
| Expense Input | Currency field | Auto-formats. Validates >= 0. Warning (not block) if > income. Allows $0. | Deduction from taxable income |
| State Dropdown | Select | Native on mobile, searchable on desktop. Coming-soon states open email capture. | Determines state tax portion |
| Filing Status | Segmented control | Tapping highlights segment, updates bracket logic. | Federal bracket selection |
| W-2 Accordion | Collapsible | Collapsed default. If value entered, subtracted from estimate. | Side-job freelancers |
| Calculate Button | Primary CTA | Validates all. Inline errors if invalid. Success: smooth scroll to results. | Core value trigger |
| Trust Bar | Static text | No interaction. | Sets expectations |

## Edge Cases

- **Returning user (logged in):** Top bar shows "Dashboard" instead of "Log In." Calculator pre-fills from last calculation.
- **Error:** Inline red border. Message below field. Button scrolls to first error on tap.
- **Loading:** Client-side calc (< 100ms), but button shows "Calculating..." for 300ms for perceptual feedback.

## Onboarding

**Pattern:** No onboarding. The calculator IS the onboarding. "Do-first" — value before any ask.
**First value moment:** User sees estimated quarterly payment within 30 seconds. Zero sign-up.
**Withhold:** Expense tracker, dashboard, deadline reminders — introduced AFTER first calculation.
