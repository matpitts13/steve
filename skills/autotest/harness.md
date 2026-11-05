# Autotest: Project Harness Setup

This file documents how to set up the test harness for a new project. Update this file when the harness is first configured for a specific repo.

## Detecting the harness

Before running any tests, check:
1. Does `vitest.config.ts` / `vitest.config.js` exist? → Vitest is configured.
2. Does `playwright.config.ts` / `playwright.config.js` exist? → Playwright is configured.
3. Does `tests/` exist? → Project has a test directory.

If neither config exists, set up the harness (see Setup below) before generating tests.

## Vitest setup (Electron + React projects)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
```

Required packages: `vitest`, `better-sqlite3` (for in-memory DB tests).

## Playwright setup (Electron)

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/autotest/e2e',
  timeout: 30000,
  use: {
    // Electron apps use electronApplication fixture — configure per test
  },
  projects: [
    {
      name: 'electron',
      use: {},
    },
  ],
})
```

Required package: `@playwright/test`, `electron` (already installed for Electron projects).

## In-memory SQLite helper

```typescript
// tests/helpers/db.ts
import Database from 'better-sqlite3'

export function createTestDb() {
  const db = new Database(':memory:')
  // Run migrations here
  return db
}
```

## IPC test helper

For testing IPC handlers without a full Electron window, invoke the handler function directly with a mock `event` object:

```typescript
import { mockEvent } from './helpers/ipc'
import { handleSaveDocument } from '../../electron/ipc/document.ipc'

test('saves document', async () => {
  const db = createTestDb()
  const result = await handleSaveDocument(mockEvent, { id: '1', title: 'Test' }, db)
  expect(result.success).toBe(true)
})
```

## Project-specific notes

(Update this section after harness is first configured for a project)

