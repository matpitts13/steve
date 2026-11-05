# C++ Conventions

## Modern C++ (C++17 minimum)
- Smart pointers (`unique_ptr`, `shared_ptr`) over raw `new`/`delete`. Raw pointers only as non-owning observers.
- RAII everywhere — resources (file handles, sockets, locks) must be managed by a scope-bound object.
- `auto` for complex/verbose types where the type is obvious from context. Explicit types when clarity matters.
- Prefer `std::span`, `std::string_view`, `std::optional`, `std::variant` over raw arrays, const char*, pointers, and unions.

## Initialization
- Brace-initialization `{}` for all local variables to prevent narrowing.
- `= delete` on copy/move constructors that should not exist — don't leave them implicitly defined.

## Const correctness
- `const` on every variable, parameter, and method that doesn't need to be mutable.
- `[[nodiscard]]` on functions whose return value must be checked.

## Error handling
- No exceptions in performance-critical paths. Use `std::expected` or error codes + `std::optional`.
- Never swallow exceptions silently. If `noexcept`, the function must truly never throw.

## Memory
- Never `delete[]` manually — use `std::vector` or `std::array`.
- `std::string` over char arrays. `std::string_view` for read-only string access.
- Profile before using `reserve()` or custom allocators.

## Concurrency
- `std::mutex` + `std::lock_guard` / `std::scoped_lock` for shared data. Never use raw lock/unlock calls.
- `std::atomic` for lock-free single-variable access.
- Thread functions as `std::jthread` (C++20) — joins automatically on destruction.

## Never
- `reinterpret_cast` without a documented reason and understanding of UB risk.
- C-style casts `(Type)x` — use `static_cast`, `const_cast`, etc. explicitly.
- Global mutable state (non-const globals, singletons with mutable state).
- `using namespace std` in header files.
