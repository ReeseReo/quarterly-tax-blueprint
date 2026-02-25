# Design System

## Personality

**If this app were a person:** A calm, knowledgeable friend who understands taxes. No lectures, no jargon. Just the number, what it means, and when to pay.

**Mood:** Clean, trustworthy, approachable.
**Anti-mood:** NOT corporate, NOT playful, NOT dense.

**References:** Linear (clarity, whitespace), Wise (financial typography, green palette), Calm (relief, soft edges).

## Layout

- **Max width:** 640px centered. Single column. No sidebar.
- **Spacing:** 24px between sections, 16px between related elements, 8px within tight groups.
- **Breakpoints:** Mobile-first (< 640px), Tablet (640–768px), Desktop (> 768px). Layout barely changes.

## Typography

| Level | Size | Weight | Tracking | Usage |
|-------|------|--------|----------|-------|
| H1 | 32px | 700 | -0.02em | Page headlines |
| H2 | 24px | 600 | — | Section headers |
| H3 | 18px | 600 | — | Card titles |
| Body | 16px | 400 | — | All readable text, 1.5 line-height |
| Caption | 14px | 400 | — | Helper text, timestamps, labels |
| Hero Number | 48px | 700 | — | Quarterly tax amount |

**Font:** Inter (variable weight). Fallback: system sans-serif stack.

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary Green | `#1B6B4A` | CTAs, active states, logged-in top bar |
| Light Green | `#F0FDF4` | Hero/result backgrounds, success states |
| Dark Text | `#101828` | Headlines, body, hero numbers |
| Muted Text | `#475467` / `#667085` / `#98A2B3` | Three tiers: subheadlines, helpers, timestamps |
| Background | `#FFFFFF` / `#F9FAFB` | Page (white), cards and inputs (off-white) |
| Error | `#D92D20` | Error borders, text, missed deadlines |
| Warning | `#DC6803` / `#FFFBEB` | Safe harbor callouts, deadline warnings |
| Success | `#039855` | Checkmarks, toasts, paid indicators |
| Borders | `#D0D5DD` / `#EAECF0` | Cards, inputs, dividers |

## Components

### Buttons

| Type | Style |
|------|-------|
| Primary | `#1B6B4A` bg, white text, 12px radius, 52px height, full-width mobile. Hover: `#145236`. Disabled: `#D0D5DD` bg. |
| Secondary | White bg, green border + text. Hover: `#F0FDF4` bg. |
| Ghost | No border, green text, underline on hover. |

### Inputs

48px height, 8px radius, 1px `#D0D5DD` border. Focus: 2px `#1B6B4A`. Error: 2px `#D92D20`. Label above (14px/600). Helper below (14px/muted).

### Cards

White bg, 1px `#EAECF0` border, 16px radius, `shadow-sm`, 24px padding.

### Modals / Bottom Sheets

Backdrop blur overlay. 16px radius. Slide up on mobile, centered on desktop. Close: X icon, backdrop tap, swipe down.

### Toasts

Slide from top-center, 3s auto-dismiss. Green (success) or red (error), white text.

### Icons

Lucide icon set (outlined, 1.5px stroke). 20px size. Color inherits context.

## Component States

| Component | Default | Hover | Active/Focus | Disabled | Loading | Error | Success |
|-----------|---------|-------|-------------|----------|---------|-------|---------|
| Primary Button | Green bg | Darken `#145236` | Scale 98% | Gray `#D0D5DD` | "Calculating..." + spinner | N/A | Check icon (1s) |
| Text Input | Gray border | N/A | Green 2px border | Gray bg, no cursor | N/A | Red 2px + msg below | Green 2px (500ms) |
| State Dropdown | Placeholder | Border darkens | Options visible | Gray, not clickable | N/A | Red border + msg | State shown |
| Filing Status | Single highlighted | Segment lightens | Selected = green | All gray | N/A | N/A | Selection shown |
| Expense Row | White bg | Shadow lift | Swipe: Edit/Delete | N/A | Skeleton row | N/A | Green flash |
| Toast | Hidden | N/A | N/A | N/A | N/A | Red bg + msg | Green bg + msg |
| W-2 Accordion | Collapsed | Chevron color | Expanded | N/A | N/A | Red on field | N/A |

## Transitions

| Element | Animation | Duration | Intent |
|---------|-----------|----------|--------|
| Results panel | Slide-down | 300ms ease-out | Orientation |
| Modals | Fade + scale-up | 200ms | Focus attention |
| Page navigation | Instant (SPA) | 0ms | Speed |
| Toasts | Slide from top | 200ms in, 3s hold, 200ms out | Feedback |
| Hero number | Count up from $0 | 600ms | Satisfaction |

Respect `prefers-reduced-motion`: replace all animations with instant transitions.

## Accessibility

- WCAG AA contrast: 4.5:1 body, 3:1 large. `#1B6B4A` on white = 5.9:1.
- Keyboard navigation + visible 2px focus rings on all interactive elements.
- `<label>` on all form fields. `alt` text on all images.
- ARIA: results panel = `role="region"` + `aria-live="polite"`, toasts = `role="alert"`.
- Touch targets: minimum 44×44px. Inputs: 48px.
- Screen reader: Hero number announced as "Your estimated quarterly tax payment is [amount] dollars."
