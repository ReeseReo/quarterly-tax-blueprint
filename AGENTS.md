# Agent Instructions

This repository contains the complete product specification for **QuarterlyTax**, a freelancer quarterly tax estimator web app.

## Repository Purpose

This is a **spec repo, not a code repo**. It contains the full design blueprint that should be used to build the application. All product decisions, tax logic, screen designs, and technical constraints are documented here.

## How to Use This Spec

### Starting a new feature or screen
1. Read `BUILD-ORDER.md` for implementation priority
2. Read the relevant screen spec in `screens/` for layout, behavior, and edge cases
3. Read `specs/ARCHITECTURE.md` for data models and technical constraints
4. Read `specs/DESIGN-SYSTEM.md` for colors, typography, and component specs

### Implementing the tax calculator
1. Read `tax-logic/CALCULATION.md` — this is the **exact 15-step algorithm** with a worked example
2. Load the appropriate config from `tax-logic/federal-2025.json` or `federal-2026.json`
3. All amounts are in **cents** (integers) to avoid floating point issues
4. Verify your implementation against the worked example: $60K income, $8K expenses, Single → **$2,559/quarter**

### Adding state tax support
1. Read `tax-logic/STATE-ROLLOUT.md` for the phased plan and per-state config schema
2. MVP ships with **federal-only + 9 no-income-tax states**
3. Each state needs its own JSON config file following the schema in STATE-ROLLOUT.md

### Writing copy or error messages
1. All UI copy is in the relevant `screens/*.md` file
2. Error messages, empty states, and email templates are in `specs/CONTENT.md`

## Key Constraints

- **Mobile-first**, max-width 640px, single column
- **Client-side calculation** — no API round-trip for tax math, must run in < 100ms
- **LCP < 1.5s** on landing page
- Tax rates stored in **JSON config files** — updatable without code deploy
- **Legal disclaimer required** on every calculation result
- Calculator must work with **zero sign-up** — auth is only for persistent features

## File Index

| File | What It Contains |
|------|-----------------|
| `README.md` | Project overview, user personas, key decisions |
| `BUILD-ORDER.md` | Prioritized build phases, MVP checklist, analytics events |
| `specs/ARCHITECTURE.md` | Tech constraints, data models, integrations, routes |
| `specs/DESIGN-SYSTEM.md` | Colors, typography, components, states, accessibility |
| `specs/USER-FLOWS.md` | 4 core user flows with step-by-step specs |
| `specs/CONTENT.md` | All copy: page meta, errors, emails, empty states, legal |
| `tax-logic/CALCULATION.md` | The 15-step tax algorithm + worked example + edge cases |
| `tax-logic/federal-2025.json` | 2025 brackets, deductions, rates (post-OBBBA) |
| `tax-logic/federal-2026.json` | 2026 brackets, deductions, rates |
| `tax-logic/STATE-ROLLOUT.md` | Phased state plan + per-state config schema |
| `screens/01-landing-calculator.md` | Landing page + calculator layout and behavior |
| `screens/02-results-breakdown.md` | Results panel with full tax breakdown |
| `screens/03-dashboard.md` | Logged-in dashboard |
| `screens/04-expense-tracker.md` | Expense list + add expense sheet |
| `screens/05-pricing.md` | Pricing page (Free vs Pro) |
| `screens/06-how-to-pay.md` | IRS payment guide |
| `screens/07-auth-modal.md` | Sign up / log in modal |
| `screens/08-email-capture.md` | Email capture for reminders + state notifications |
| `screens/09-settings.md` | User settings + billing |
