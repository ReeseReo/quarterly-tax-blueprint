# Screen 2: Results Breakdown

**Route:** Inline on `/` (not a separate page)
**Purpose:** Deliver the answer and convert relief into a retained relationship.
**Emotional Target:** Relief, then confidence. "I know my number. I understand it."
**Primary Action:** Tap "Remind Me Before the Deadline."

## Layout

Not a separate page. Slides into view below calculator card (300ms ease-out). Calculator compresses to summary bar.

### Summary Bar (replaces calculator)
Compact row: "Income: $60,000 | Expenses: $8,000 | CA | Single" + "Edit" text link. 48px, `#F9FAFB` bg.

### Legal Disclaimer
Immediately above result card: "This is an estimate for planning purposes. It is not tax advice. Consult a tax professional for your specific situation." — 12px muted. Always visible. Not dismissible.

### Primary Result Card
`#F0FDF4` bg, 4px `#1B6B4A` left border. Centered:
- **Label:** "Your Estimated Quarterly Payment" — 14px uppercase muted green
- **Amount:** "$2,559" — 48px bold, `#101828`. Counts up from $0 (600ms). `aria-live="polite"`.
- **Subtext:** "Due by [next deadline] — [X] days from now" — 16px gray

### Tax Breakdown Panel (default: expanded)
"How We Calculated This" — chevron toggle. Line items per `tax-logic/CALCULATION.md`:

```
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

Each line has (i) icon → tap reveals plain-English tooltip with IRS source link.
QBI tooltip: "The Qualified Business Income deduction lets you deduct up to 20% of your freelance profit. Made permanent by the One Big Beautiful Bill Act in 2025."

### State Tax Section (conditional)
- **No-tax state:** "Great news — [State] has no state income tax. Your quarterly payment is federal only."
- **Coming-soon state:** "State tax estimates for [State] are coming soon. Your federal estimate is shown above. Get notified when [State] is added." + email capture.
- **Supported state (Phase 2+):** Full state breakdown with state-specific brackets and quarterly schedule.

### Additional Medicare Tax Note (conditional)
Shown only when SE income > $200K single. Amber callout.

### Safe Harbor Note
Amber callout (`#FFFBEB`): "Safe Harbor Rule: Pay at least 100% of last year's tax liability (110% if AGI > $150K) and you won't owe a penalty — even if you underpay."

### Action Buttons
- **Primary:** "Remind Me Before the Deadline" — green. Anonymous: email capture modal. Logged in: notification toggle + confirmation.
- **Secondary:** "How Do I Actually Pay?" — ghost button → How to Pay guide.

### Upsell Strip
Subtle banner: "Track expenses and get even more accurate estimates. Start free →"

## Element Spec

| Element | Type | Behavior | Why |
|---------|------|----------|-----|
| Quarterly Amount | Hero number | Counts up from $0 (600ms). `aria-live="polite"`. | This IS the product. |
| Deadline Countdown | Dynamic text | Auto-calculates from today to next IRS deadline. | Creates urgency. |
| Legal Disclaimer | Static text | Always visible. Not dismissible. | Legal protection. |
| Breakdown Toggle | Collapsible | Expand/collapse with chevron. Default: expanded. | Trust through transparency. |
| Info Tooltips | Popover | Tap/hover → explanation + IRS source link. | Educates without clutter. |
| Remind Me CTA | Primary button | Anonymous: email modal. Logged in: toggle + confirmation. | Core retention. |
| How to Pay CTA | Ghost button | Navigates to guide. | Prevents dead-end. |
| Edit Link | Text button | Expands summary bar back to full calculator. | Recalculate without losing results. |

## Onboarding
**Pattern:** Progressive disclosure. Breakdown expanded by default. Tooltips invite learning without requiring it.
