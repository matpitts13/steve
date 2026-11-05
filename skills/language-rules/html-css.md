# HTML / CSS Conventions

## HTML
- Semantic elements: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>` over `<div>` soup.
- Every interactive element must be keyboard-accessible (`tabindex`, `role`, `aria-*` as needed).
- `alt` text on every `<img>` — empty string `alt=""` only for decorative images.
- Form inputs always have a `<label>` (visible or visually-hidden via `sr-only`).

## CSS
- CSS custom properties (`--var-name`) for all repeated color, spacing, and type values.
- Mobile-first: base styles for small screen, `@media (min-width: ...)` for larger.
- No `!important` except for utility overrides (e.g. `.sr-only`). Document why if used.
- Prefer `gap` over margin hacks for flex/grid spacing.
- Avoid `position: absolute` for centering — use flex or grid instead. JS measurement only as last resort (see `Editor.tsx` centering pattern).

## Specificity
- Class selectors only. No ID selectors in stylesheets (IDs are for JS anchors, not styling).
- BEM or a flat, project-consistent naming scheme. Don't mix conventions in one project.

## Animations
- `prefers-reduced-motion` media query: wrap all motion in `@media (prefers-reduced-motion: no-preference)`.
- Use `transform` and `opacity` for animated properties — avoid animating `width`, `height`, `top`, `left` (triggers layout).

## Never
- Inline `style` attributes for values that belong in a stylesheet.
- `*` selector with expensive properties (layout-triggering).
- Hard-coded color values outside of a design token (`--color-*` variable).
