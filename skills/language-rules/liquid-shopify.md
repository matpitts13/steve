# Shopify Liquid Conventions

## Templates
- One concern per template/section. Split sections rather than creating monolithic layout files.
- Use `{% render %}` (not `{% include %}`) — scoped context prevents unintended variable leakage.
- Sections and snippets go in `/sections/` and `/snippets/` respectively. Never cross-include.

## Schema
- Every section has a `{% schema %}` block — even if it has no settings (add an empty `settings: []`).
- All user-facing text in schema settings uses `t:` translation keys. No hardcoded English strings in schema labels.
- `default` values on all settings so themes render correctly before configuration.

## Variables
- Prefer `assign` for derived values. Don't re-compute the same thing multiple times in a loop.
- `capture` for multi-line string construction. Keep captures short — extract to a snippet if they grow.
- `forloop` variables (`forloop.first`, `forloop.last`, `forloop.index0`) for positional logic — don't use a manual counter.

## Performance
- Avoid liquid inside `<style>` or `<script>` tags. Prefer data attributes and CSS custom properties for passing Liquid values to CSS/JS.
- `{% liquid %}` tag for multi-line logic blocks — avoids template clutter.
- Paginate collection loops. Never render more than 50 items without pagination.

## Metafields
- Access via `product.metafields.namespace.key` with explicit null checks.
- Never assume a metafield exists — always `{% if product.metafields.ns.key %}`.

## Never
- `{% javascript %}` blocks for complex logic — extract to a JS file in `/assets/`.
- `forloop.index` as a CSS class suffix for styling (fragile and specific to position).
- Raw `{{ variable }}` output without `| escape` when content could contain HTML (XSS risk in theme editor).
