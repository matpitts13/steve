# TypeScript Conventions

## Strictness
- Always `"strict": true` — never disable it or add `@ts-ignore` without a comment explaining why.
- No `any` except at external system boundaries (raw JSON from API, `unknown` → guard → typed). Use `unknown` and narrow with guards.
- Prefer `as const` over type assertions (`as SomeType`) for literal values.

## Types vs Interfaces
- `interface` for object shapes that may be extended (component props, service contracts, DB row types).
- `type` for unions, intersections, mapped/conditional types, and aliases for primitives.
- Don't mix: pick one for a given shape and stay consistent within a file.

## Functions
- Named functions for exported/hoisted code; arrow functions for callbacks and component event handlers.
- Explicit return type on public functions, optional on private/local where inference is obvious.
- Avoid overloads where a union type + guard is clearer.

## Null handling
- Prefer `??` over `||` when the left operand could be `0`, `""`, or `false`.
- Never `!` (non-null assertion) on values that could realistically be null — narrow instead.
- Use optional chaining `?.` liberally, but don't chain through more than 3 levels — restructure.

## Imports
- Named imports preferred over `import *`. Only use default imports where the module exports one.
- Alias paths (`@/`) over relative `../../` when the project has them configured.

## Error handling
- `try/catch` only at async boundaries and IPC handlers — not inside pure functions.
- Always type the `catch` variable: `catch (err: unknown) { if (err instanceof Error) ... }`.
- Never swallow errors silently (`catch (_) {}`).

## Enums
- Avoid `enum` — use `as const` object or string literal union instead. Enums have surprising runtime semantics.

## Never
- `eval`, `Function()`, or dynamic `require()` with user-controlled input.
- Circular imports. Restructure the module graph if they arise.
