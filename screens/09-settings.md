# Screen 9: Settings

**Route:** `/settings`
**Purpose:** Account management and preferences. Users visit rarely.
**Primary Action:** Update state/filing status if life changes.

## Layout

Simple grouped list.

- **Profile:** Email (read-only + "Change" link), password ("Change Password"), state selector, filing status selector.
- **Notifications:** Toggle: "Deadline reminders (email)" — on by default. Toggle: "Weekly expense reminder" — off by default.
- **Billing (Pro only):** Current plan, next billing date, "Switch to Annual/Monthly" link, "Cancel Subscription" link.
- **Data:** "Export My Data" (CSV). "Delete My Account" (red text, confirmation modal).

## Edge Cases
- **Cancel subscription:** "You'll keep Pro access until [date]. After that, you'll switch to Free automatically. Your data is never deleted."
- **Delete account:** Confirmation: "This will permanently delete your account and all data. This cannot be undone." Red "Delete" + gray "Cancel."
