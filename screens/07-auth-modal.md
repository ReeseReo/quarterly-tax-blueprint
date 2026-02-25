# Screen 7: Auth Modal (Sign Up / Log In)

**Route:** Modal (no dedicated route)
**Purpose:** Minimal-friction account creation.
**Emotional Target:** Speed. "This took 10 seconds."
**Primary Action:** Continue with Google (lowest friction).

## Layout

Centered modal, backdrop blur, 400px max-width. Tabs: "Sign Up" | "Log In."

### Sign Up Tab
- "Continue with Google" — Google icon, outlined button, full-width
- Divider: "or"
- Email field + password field (8+ char requirement inline)
- "Create Account" green button

### Log In Tab
Same layout minus password requirements.
- "Forgot password?" text link below password field

### Forgot Password
Replaces modal content: email field + "Send Reset Link." Success: "Check your email for a reset link."

### Footer
"By signing up, you agree to our Terms and Privacy Policy." (links). 12px muted.

## Edge Cases
- Google OAuth fails: "Couldn't connect to Google. Please try email sign-up."
- Account exists: "An account with this email already exists. Try logging in."
