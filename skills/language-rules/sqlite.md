# SQLite Conventions

## Schema
- All tables have a `INTEGER PRIMARY KEY` (`id`) autoincrement column.
- `TEXT NOT NULL DEFAULT ''` for strings. `INTEGER NOT NULL DEFAULT 0` for booleans. `TEXT` (nullable) for optional foreign keys stored as string IDs.
- Foreign key constraints declared and `PRAGMA foreign_keys = ON` at connection open. Never skip FK enforcement.
- Column names in `snake_case`. Table names in `snake_case` plural (`documents`, `projects`).

## Migrations
- Migrations are additive: `ALTER TABLE ... ADD COLUMN` only. Never drop or rename columns in migrations (breaks older app versions reading existing DBs).
- Migration is a sequential array of `ALTER TABLE` statements. Each migration is guarded with `IF NOT EXISTS` or a try/catch on column-already-exists error — idempotent.
- No data migrations in code — do those manually or with a one-time migration script.

## Queries
- Parameterized queries always (`?` placeholders). Never string concatenation for query construction (SQL injection).
- `RETURNING` clause on `INSERT`/`UPDATE` to get the created/updated row without a second round trip.
- `BEGIN TRANSACTION` / `COMMIT` for any multi-statement write sequence. Wrap in try/catch and `ROLLBACK` on error.

## Row mapping
- `rowToX()` helper function that maps a raw DB row (snake_case) to the TypeScript type (camelCase). One place per table, no ad-hoc property access scattered through handlers.
- Boolean columns mapped via `row.col === 1`. Never `!!row.col` (hides `null`).

## Performance
- Index on columns used in `WHERE` clauses of hot paths. Check `EXPLAIN QUERY PLAN` if a query is slow.
- `PRAGMA journal_mode = WAL` for better read/write concurrency in Electron apps.

## Never
- `SELECT *` in production queries — select only needed columns.
- Run migrations on every app start without checking if they've already been applied.
- Store large blobs (images, binary) in SQLite — use the file system and store the path.
