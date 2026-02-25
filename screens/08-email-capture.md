# Screen 8: Email Capture Modal

**Route:** Modal (no dedicated route)
**Purpose:** Capture email for retention without requiring account creation.
**Primary Action:** Enter email + tap Set Reminder.

## Layout

Small centered modal (360px). Triggered by "Remind Me Before the Deadline" on results screen, OR by selecting a coming-soon state.

### For Deadline Reminders
- **Headline:** "Get a Reminder Before [Deadline Date]"
- **Subtext:** "We'll send you one email, 2 weeks before your payment is due. No spam."
- Email field (auto-focused). Placeholder: "your@email.com"
- CTA: "Set Reminder" green button.
- **Success:** Modal content replaces with green check + "You're set! We'll email you before [date]." Auto-closes 3s.

### For Coming-Soon States
- **Headline:** "Get Notified When [State] Is Added"
- **Subtext:** "We're adding state tax estimates soon. Be the first to know."
- Email field. Same styling.
- CTA: "Notify Me" green button.
- **Success:** "Got it! We'll email you when [State] tax estimates go live."

## Edge Cases
- Email already in system: "You're already signed up! Check your spam folder if you haven't received one."
