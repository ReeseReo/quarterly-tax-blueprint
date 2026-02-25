# Screen 4: Expense Tracker

**Route:** `/expenses`
**Purpose:** Fast expense logging that feeds into more accurate tax estimates.
**Emotional Target:** Efficiency. "I'm building a record."
**Primary Action:** Add a new expense (FAB → sheet → save).

## Layout

- **Filter Bar (sticky, 44px):** Quarter selector (Q1–Q4 + All Year) + sort toggle (Date/Amount/Category).
- **Category Chips (scrollable):** Horizontal: "All ($5,200)", "Software ($1,200)", etc. Tap to filter.
- **Expense List:** Each row: category icon (color dot) + name (bold) + date (muted) on left; amount (bold) + IRS category (muted) on right. Swipe left: Edit/Delete.
- **FAB:** "+" button, bottom-right, green `#1B6B4A`. Opens Add Expense sheet.

## Add Expense Sheet

Bottom sheet (mobile) or centered modal (desktop):

- **Amount:** Auto-focused, 32px font, $ prefix.
- **Description:** Single line. Placeholder: "e.g., Adobe Creative Cloud."
- **Category:** Grid of IRS Schedule C categories with icons: Advertising, Car/Truck, Contract Labor, Insurance, Legal/Professional, Office, Rent/Lease, Repairs, Software/Subscriptions, Supplies, Travel, Meals (50%), Utilities, Other.
- **Date:** Default: today. Tap to change.
- **Receipt:** "Add Receipt Photo" — camera icon. Optional.
- **Save:** Full-width green: "Save Expense." Disabled until amount + category filled.

## Edge Cases

- **No expenses:** Illustration + "Start Tracking Your Business Expenses" + "Logging expenses lowers your taxable income." + "Add First Expense."
- **Receipt capture fails:** "Couldn't capture image. You can add a receipt later." Save proceeds.
- **Delete:** Confirmation: "Delete this expense? This can't be undone." Red "Delete" + gray "Cancel."
- **First expense saved:** One-time toast: "Nice! Expenses are deducted from your income, reducing what you owe."
