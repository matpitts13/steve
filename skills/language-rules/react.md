# React Conventions

## Component structure
- One component per file. File name matches component name (PascalCase).
- Props interface at top of file, named `<ComponentName>Props`.
- Local helper functions and sub-components below the main component export, not above.

## Hooks
- All hooks called unconditionally at the top of the component body — never inside conditions, loops, or returns.
- Custom hooks extracted to `hooks/` directory, prefixed `use`.
- `useEffect` dependencies must be exhaustive. If lint flags a dep you genuinely don't want to watch, suppress with a comment explaining why — don't just remove it.
- `useLayoutEffect` only when DOM measurement or synchronous layout mutation is required before paint; otherwise `useEffect`.
- Never call a hook inside another hook's callback — that violates the rules of hooks.

## State
- Prefer `useState` + controlled inputs. Uncontrolled inputs only when performance requires it.
- Derived values computed from state — don't store derivable state in a separate `useState`.
- `useReducer` when ≥3 related state variables change together.

## Refs
- `useRef` for mutable values that don't trigger re-renders (DOM nodes, timers, cached values).
- Never mutate a ref during render.

## Event handlers
- Prefix: `handle<Event>` (e.g. `handleClick`, `handleChange`).
- Stable references via `useCallback` only when passed to memoized children or in effect deps.

## Performance
- `React.memo` only when profiling shows a re-render problem. Don't pre-optimize.
- Keys on list items must be stable, unique IDs — never array index.

## Never
- Mutate props or state directly.
- Call `setState` inside a render body (infinite loop).
- Use `React.FC` type — just type props and let TS infer the return.
- Use deprecated lifecycle methods (`componentWillMount`, etc.).
