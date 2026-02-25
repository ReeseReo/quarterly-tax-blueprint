# Screen 3: Dashboard (Logged-In Home)

**Route:** `/dashboard`
**Purpose:** Give the returning user their number and next action in one glance.
**Emotional Target:** Control and calm. "I'm on top of this."
**Primary Action:** Recalculate estimate OR add an expense.

## Layout

Replaces landing page when logged in. Single column, max-width 640px.

- **Top Bar (sticky):** Green `#1B6B4A` bg, white text. Logo (left), avatar dropdown (right): Settings, Log Out.
- **Deadline Card (top, prominent):** Full-width, green gradient. Quarter label ("Q2 2026"), amount in 36px white bold, countdown, progress ring, "Recalculate" outlined white button.
- **Expense Summary Card:** White. Header: "This Quarter's Expenses" + "Add Expense" small green button. Total in 24px bold. Top 3 categories as horizontal bars. "See All Expenses →" link.
- **Quarterly Timeline:** Horizontal row Q1–Q4. Current highlighted. Past: green check (paid) or red warning (missed).
- **Quick Actions (mobile sticky):** "Add Expense" (primary) + "Snap Receipt" (secondary).

## Element Spec

| Element | Type | Behavior | Why |
|---------|------|----------|-----|
| Deadline Card | Hero card | Tap amount → full results. Recalculate → pre-filled calculator. | Primary info at a glance. |
| Expense Summary | Summary card | Category bars tappable → filter expense list. | Encourages weekly logging. |
| Quarterly Timeline | Horizontal nav | Tap quarter → view details. | Year-long context. |
| Quick Actions | Sticky bar | Add Expense → sheet. Snap Receipt → camera. | One-tap frequent actions. |

## Edge Cases

- **New account, no expenses:** Expense card: "Track expenses for a more accurate estimate." + "Add First Expense."
- **Deadline passed:** Card turns amber. "The Q1 deadline has passed. Here's what to do."
- **Mid-year sign-up:** Previous quarters: "Not tracked" with backfill option.

## Onboarding
Welcome banner (first session): "Your dashboard will show quarterly estimates and expenses. Start by running your first calculation." Auto-dismisses after first calc.
