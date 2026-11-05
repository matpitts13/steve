# C# Conventions

## Style
- PascalCase for types, methods, properties, events. camelCase for locals and parameters. `_camelCase` for private fields.
- File-scoped namespaces (`namespace Foo;`) in C# 10+. Top-level statements for entry points only.
- One type per file, file name matches type name.

## Nullability
- `<Nullable>enable</Nullable>` in all new projects. No warnings suppressed without explanation.
- `string?` vs `string` — be explicit. Use `!` (null-forgiving) only after a null check has proven non-null.
- Prefer `is not null` pattern over `!= null` (clearer intent, works with pattern matching).

## Async
- `async Task` / `async Task<T>` everywhere. No `async void` except event handlers.
- `ConfigureAwait(false)` in library code. Not needed in top-level application code.
- `CancellationToken` parameter on every I/O method — pass it through, don't ignore it.

## Records vs Classes
- `record` for immutable data (DTOs, value objects). `class` for mutable objects with identity.
- `record struct` for small value types that would box frequently.

## LINQ
- Method syntax preferred over query syntax for single-chain expressions. Query syntax acceptable for multi-join queries.
- Materialize with `.ToList()` / `.ToArray()` when the result is used more than once (avoid re-enumeration).

## Error handling
- Custom exceptions only for domain-meaningful error conditions. Don't throw `Exception` directly.
- `catch (Exception ex) when (condition)` for filtered catches — avoids double-catch pitfalls.

## Never
- `Thread.Sleep` — use `await Task.Delay`.
- `GC.Collect()` in production code.
- Mutable public fields — use properties.
- Swallow exceptions with an empty `catch {}`.
