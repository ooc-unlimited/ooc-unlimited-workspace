---
title: "Top 3 Onboarding Command Center Improvements"
type: refactor
date: 2026-02-10
deepened: 2026-02-10
---

# Top 3 Onboarding Command Center Improvements

## Enhancement Summary

**Deepened on:** 2026-02-10
**Review agents used:** security-sentinel, kieran-typescript-reviewer, architecture-strategist, data-integrity-guardian, performance-oracle, code-simplicity-reviewer, pattern-recognition-specialist, julik-frontend-races-reviewer, best-practices-researcher, framework-docs-researcher
**Framework docs queried:** Next.js 14, better-sqlite3 v12, Vitest

### Key Improvements from Research

1. **Corrected codebase metrics** — actual 3,555 lines across 18 API routes (not 13K / 7 routes)
2. **Functional bug discovered** — DELETE handler misses 2 tables (`grand_openings`, `go_social_accounts`), causing FK violations
3. **Dead code identified** — v1 Grand Opening system (3 files, 5 DB tables) is orphaned and should be removed
4. **Scope right-sized** — this is a 1-2 user internal tool; solutions should match that reality
5. **Cloudflare Access elevated to Phase 1** — most impactful single security change

### New Critical Findings

- **IDOR vulnerability**: Sequential integer IDs on public RSVP endpoint enable enumeration of all events/guests
- **Missing DB constraints**: No UNIQUE, CHECK, or foreign key indexes anywhere in schema
- **Metrics endpoint fires ~48 queries** per request — consolidate to ~5 with GROUP BY
- **N+1 fetch pattern** on grand opening dashboard loads guests serially per event
- **Race conditions on every mutation** — no double-click prevention, no AbortController cleanup, stale closure bugs

---

## Overview

Full audit of the Onboarding Command Center (Next.js 14 / TypeScript / SQLite / Tailwind CSS) identified **3 critical improvement areas** ranked by risk and impact. The app manages an 11-stage insurance agent onboarding pipeline and is **publicly exposed via Cloudflare tunnel**, making security the top priority.

**Codebase:** ~3,555 lines across 18 API route files, 7 pages, 1 shared component (`Sidebar.tsx`).

---

## Improvement #1: Security Hardening (CRITICAL)

### Problem Statement

The application has multiple compounding security vulnerabilities that, together, make it trivially exploitable by anyone who discovers the public tunnel URL:

| Vulnerability | File | Severity |
|--------------|------|----------|
| Hardcoded password fallback `Start345` in source code | `src/middleware.ts:3`, `src/app/api/login/route.ts:3` | CRITICAL |
| Auth token is reversible base64 (not hashed) — cookie exposes the password | `src/middleware.ts:5` | CRITICAL |
| No `.env` file exists — the hardcoded fallback is the active password | Project root | CRITICAL |
| No rate limiting on login endpoint | `src/app/api/login/route.ts` | HIGH |
| No input validation on any API endpoint | All 18 API route files | HIGH |
| Database file + tunnel URL not in `.gitignore` | `.gitignore` | HIGH |
| No logout endpoint or button | Sidebar + API | MEDIUM |
| Auth constants duplicated across two files | `middleware.ts` + `login/route.ts` | MEDIUM |
| No CSRF protection on mutations | All POST/PATCH/DELETE routes | MEDIUM |
| Personal phone number hardcoded in email template | `src/lib/email-template.ts:89` | LOW |

### Research Insights

**Additional Findings from Security Review (8 new issues):**

| New Finding | Severity | Detail |
|-------------|----------|--------|
| IDOR on public RSVP endpoint | HIGH | Sequential integer IDs let anyone enumerate events and guests via `/api/grand-opening/events/1/rsvp`, `/2/rsvp`, etc. |
| Public RSVP endpoint writes to DB without auth or rate limit | HIGH | `src/app/api/grand-opening/events/[id]/rsvp/route.ts` — unauthenticated write path |
| No security headers | MEDIUM | Missing CSP, X-Frame-Options, HSTS, X-Content-Type-Options on all responses |
| `dangerouslySetInnerHTML` in invite layout | MEDIUM | `src/app/grand-opening/[id]/invite/layout.tsx:4-7` — CSS injection via fragile inline style hack |
| Dynamic SQL column construction | MEDIUM | `src/app/api/agents/[id]/route.ts` PATCH — builds SQL from user-supplied keys (safe today due to allowlist, but fragile) |
| PII stored in plaintext | MEDIUM | `credentials_encrypted` column name suggests encryption, but values are stored as plain text |
| Cloudflare quick tunnel exposes admin + public on same URL | MEDIUM | No Access policy — anyone with the URL has login page access |
| No CORS configuration | LOW | API endpoints callable from any origin |

**Best Practice: Middleware should distinguish API vs page routes (Next.js 14 pattern):**

```typescript
// Return JSON 401 for API routes, redirect for pages
if (pathname.startsWith('/api/')) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
return NextResponse.redirect(new URL('/login', request.url));
```

**Best Practice: Session tokens with crypto.randomUUID():**

```typescript
// src/lib/auth.ts — minimal session store
const sessions = new Map<string, { createdAt: number }>();
const SESSION_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

export function createSession(): string {
  const token = crypto.randomUUID();
  sessions.set(token, { createdAt: Date.now() });
  return token;
}

export function validateSession(token: string): boolean {
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() - session.createdAt > SESSION_TTL) {
    sessions.delete(token);
    return false;
  }
  return true;
}
```

**Simplicity Note:** For a 1-2 user tool, skip iron-session/jose — `crypto.randomUUID()` with an in-memory Map is sufficient. The sessions reset on server restart, which is fine for this use case.

### Root Cause

The app was originally built as a local-only internal tool ("No security issues: Local-only app, no auth needed" — per `AUDIT-REPORT.md`). Auth was bolted on later when the Cloudflare tunnel was added, but was never hardened for public exposure.

### Proposed Solution

#### Phase 1: Immediate (same day)

1. **Create `.env.local`** with a strong `DASHBOARD_PASSWORD` (16+ chars)
2. **Remove the hardcoded fallback** — app should refuse to start if env var is missing
3. **Update `.gitignore`** to exclude: `data/`, `*.db`, `*.db-shm`, `*.db-wal`, `tunnel-url.txt`, `.env*`, `.cloudflared/`
4. **Create `src/lib/auth.ts`** — single source of truth for auth constants (eliminate duplication)
5. **Switch to named Cloudflare tunnel with Access policies** — this is the single highest-ROI security change; Cloudflare Access handles auth before traffic even reaches the app

#### Phase 2: This week

6. **Replace base64 token with `crypto.randomUUID()`** — store session server-side (in-memory Map with expiry)
7. **Add logout endpoint** (`POST /api/logout`) and logout button in Sidebar
8. **Add rate limiting** on `/api/login` — 5 attempts per 15 minutes per IP (simple in-memory counter)
9. **Fix middleware** to return 401 JSON for API routes (not HTML redirect)
10. **Add security headers** via `next.config.js` `headers()` or middleware:
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `Referrer-Policy: strict-origin-when-cross-origin`

#### Phase 3: Next sprint

11. **Add input validation** to all API endpoints using simple if-checks (see Simplicity Note below):
    - `name`: non-empty, max 200 chars, trimmed
    - `phone`: optional, matches `/^\+?[\d\s\-()]{7,20}$/` or empty
    - `email`: optional, valid email format or empty
    - `content` (notes): non-empty, max 10,000 chars
    - `id` params: positive integer (not UUID — this app uses integer IDs)
12. **Add UUIDs or slugs to public-facing RSVP URLs** to prevent IDOR enumeration

**Simplicity Note (from code-simplicity-reviewer):** For a 1-2 user internal app, simple `if (!name || name.length > 200)` checks are sufficient. Skip zod for now — the overhead of schema definitions and error formatting isn't justified at this scale.

### Acceptance Criteria

- [ ] Password loaded exclusively from environment variable; no hardcoded fallback
- [ ] App fails to start with clear error if `DASHBOARD_PASSWORD` is not set
- [ ] Auth token is a cryptographically random session ID, not base64 of password
- [ ] Login endpoint returns 429 after 5 failed attempts within 15 minutes
- [ ] All POST/PATCH endpoints validate input with appropriate error messages
- [ ] `.gitignore` excludes `data/`, `*.db*`, `tunnel-url.txt`, `.cloudflared/`
- [ ] Logout button exists in Sidebar; `POST /api/logout` clears session
- [ ] Auth logic lives in a single `src/lib/auth.ts` module
- [ ] Cloudflare Access policy restricts tunnel to authorized users
- [ ] Security headers present on all responses
- [ ] Middleware returns JSON 401 for `/api/*` routes, redirect for pages

### Files to Modify

| File | Change |
|------|--------|
| `src/lib/auth.ts` | **NEW** — centralized auth module with session store |
| `src/middleware.ts` | Import from `auth.ts`; return 401 JSON for API routes; add security headers |
| `src/app/api/login/route.ts` | Import from `auth.ts`; add rate limiting |
| `src/app/api/logout/route.ts` | **NEW** — clear session cookie |
| `src/components/Sidebar.tsx` | Add logout button |
| `.gitignore` | Add `data/`, `*.db*`, `tunnel-url.txt`, `.cloudflared/` |
| `.env.local` | **NEW** — `DASHBOARD_PASSWORD=<strong-password>` |
| `.env.example` | **NEW** — document required env vars |
| `next.config.js` | Add security headers |
| All API route files | Add input validation (simple if-checks) |

---

## Improvement #2: Error Handling & Data Resilience (HIGH)

### Problem Statement

The application has **zero error handling** on both client and server sides. Every failure mode results in either a permanently stuck "Loading..." screen or silent data corruption:

| Gap | Impact | Affected Code |
|-----|--------|---------------|
| No `.catch()` on any client-side fetch (10+ calls across 7 pages) | Pages show "Loading..." forever on network failure | All page components |
| No `response.ok` check on mutations (10+ operations) | User sees success even when server returned error | Agent detail + grand opening pages |
| No try/catch on any server-side DB operation | Raw 500 errors with stack traces | All 18 API routes |
| DELETE cascade uses 5 separate statements without a transaction | Partial deletion = orphaned records | `src/app/api/agents/[id]/route.ts:42-47` |
| **DELETE handler misses 2 tables** (`grand_openings`, `go_social_accounts`) | FK violation on delete of agents with grand openings | `src/app/api/agents/[id]/route.ts:42-47` |
| Agent creation uses 5 statements without a transaction | Partial creation = inconsistent data | `src/app/api/agents/route.ts:37-57` |
| Stage advance uses 4 statements without a transaction | Stage history can become inconsistent | `src/app/api/agents/[id]/advance/route.ts:21-33` |
| `generatePosts` DELETE outside transaction | Post data loss if insert fails after delete | `src/lib/grand-opening-factory.ts:178` |
| No React error boundary | Unhandled errors = white screen | `src/app/layout.tsx` |
| Login page fetch has no `.catch()` | Button stays disabled forever on network failure | `src/app/login/page.tsx:17` |
| Missing `ON DELETE CASCADE` on all foreign keys | Manual cascade deletion is error-prone | `src/lib/db.ts` schema |

### Research Insights

**Data Integrity Findings (from data-integrity-guardian):**

| Finding | Impact | Fix |
|---------|--------|-----|
| Missing `busy_timeout` pragma | Concurrent requests get `SQLITE_BUSY` errors | Add `db.pragma('busy_timeout = 5000')` |
| Missing `synchronous = NORMAL` pragma | Slower writes with no benefit for this app | Add `db.pragma('synchronous = NORMAL')` |
| Missing UNIQUE constraint on agent email/phone | Duplicate agents can be created | Add constraint to schema |
| Missing CHECK constraint on `current_stage` | API can set stage to 0 or 99 | Add `CHECK(current_stage BETWEEN 1 AND 11)` |
| Unquoted DEFAULT in schema | `status TEXT DEFAULT setup` stores literal "setup" due to SQLite quirk | Change to `DEFAULT 'setup'` |
| RSVP dedup loads ALL guests into memory | O(n) scan instead of SQL `WHERE` clause | Use `SELECT 1 WHERE email = ? LIMIT 1` |
| No migration system | Schema changes require manual CREATE IF NOT EXISTS | Add simple version-based migrations |

**better-sqlite3 Transaction Pattern (from Context7 docs):**

```typescript
// better-sqlite3 v12 — transactions auto-rollback on exception
const deleteAgent = db.transaction((id: number) => {
  db.prepare('DELETE FROM agent_notes WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM stage_history WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM engagement WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM activity_log WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM grand_opening_guests WHERE event_id IN (SELECT id FROM grand_opening_events WHERE agent_id = ?)').run(id);
  db.prepare('DELETE FROM grand_opening_posts WHERE event_id IN (SELECT id FROM grand_opening_events WHERE agent_id = ?)').run(id);
  db.prepare('DELETE FROM grand_opening_events WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM agents WHERE id = ?').run(id);
});
```

**better-sqlite3 HMR Guard (from Context7 docs):**

```typescript
// Prevent multiple DB connections during Next.js hot reload
import Database from 'better-sqlite3';

const globalForDb = globalThis as unknown as { db: Database.Database };

function createDatabase(): Database.Database {
  const db = new Database('data/onboarding.db');
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  db.pragma('synchronous = NORMAL');
  // ... schema creation ...
  return db;
}

const db = globalForDb.db || createDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
export default db;
```

**Next.js Error Boundary (from Context7 docs):**

```typescript
// src/app/error.tsx — automatic error boundary for app router
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-red-400">Something went wrong</p>
      <button onClick={reset} className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600">
        Try again
      </button>
    </div>
  );
}
```

**Frontend Race Condition Fixes (from julik-frontend-races-reviewer):**

The agent detail page (`src/app/agents/[id]/page.tsx`) is a "race condition factory":

1. **No AbortController cleanup** — rapid navigation between agents causes stale data to overwrite fresh data
2. **No mutation locking** — clicking "Advance" twice creates duplicate stage history entries
3. **Stale closures** — `load()` is fire-and-forget after mutations; fast clicks queue overlapping fetches

Minimal fix pattern:

```typescript
// Mutation locking — prevents double-submit
const [mutating, setMutating] = useState(false);

async function handleAdvance(targetStage: number) {
  if (mutating) return;
  setMutating(true);
  try {
    const res = await fetch(`/api/agents/${id}/advance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetStage }),
    });
    if (!res.ok) throw new Error('Failed to advance');
    await load(); // refetch
  } catch (e) {
    // show error
  } finally {
    setMutating(false);
  }
}
```

```typescript
// AbortController cleanup in useEffect
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/agents/${id}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setAgent)
    .catch(e => { if (e.name !== 'AbortError') setError(e.message); });
  return () => controller.abort();
}, [id]);
```

### Concrete Failure Scenario

1. User clicks "Delete" on an agent and confirms
2. Server executes 5 DELETE statements sequentially (no transaction)
3. After deleting `agent_notes` and `stage_history`, the disk fills up
4. `engagement` DELETE fails with SQLITE_FULL
5. Unhandled exception — Next.js returns 500 with raw error
6. Client ignores the error response (no `.ok` check)
7. Client navigates to `/agents` (assumes success)
8. Agent still exists with orphaned data — notes and history are gone

**Additional scenario (from data-integrity-guardian):** DELETE handler is also missing deletes for `grand_opening_events` and related tables. If an agent has a grand opening, the FK constraint blocks deletion entirely, producing a raw 500 error with no user-facing message.

### Proposed Solution

#### Phase 1: Database Resilience (this week, ~1 hour)

1. **Add missing pragmas** to `src/lib/db.ts`:
   - `busy_timeout = 5000` (wait 5s for locks instead of failing immediately)
   - `synchronous = NORMAL` (safe for WAL mode, improves write performance)

2. **Add HMR guard** to prevent multiple database connections during development

3. **Wrap all multi-statement operations in `db.transaction()`**:

```typescript
// src/app/api/agents/[id]/route.ts — DELETE handler (FIXED: includes all tables)
const deleteAgent = db.transaction((id: number) => {
  // Grand opening cascade
  const eventIds = db.prepare('SELECT id FROM grand_opening_events WHERE agent_id = ?').all(id) as { id: number }[];
  for (const { id: eventId } of eventIds) {
    db.prepare('DELETE FROM grand_opening_guests WHERE event_id = ?').run(eventId);
    db.prepare('DELETE FROM grand_opening_posts WHERE event_id = ?').run(eventId);
  }
  db.prepare('DELETE FROM grand_opening_events WHERE agent_id = ?').run(id);
  // Agent cascade
  db.prepare('DELETE FROM agent_notes WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM stage_history WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM engagement WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM activity_log WHERE agent_id = ?').run(id);
  db.prepare('DELETE FROM agents WHERE id = ?').run(id);
});
```

Apply the same pattern to: agent creation (POST), stage advance, engagement toggle, `generatePosts`.

4. **Add `ON DELETE CASCADE`** to foreign key definitions (requires schema migration — see migration note below)

**Migration Note:** SQLite doesn't support `ALTER TABLE ... ADD CONSTRAINT`. To add CASCADE, you need to recreate tables. For a 1-2 user app, the simplest approach is a version check on startup:

```typescript
const version = (db.pragma('user_version') as { user_version: number }[])[0].user_version;
if (version < 1) {
  // Recreate tables with CASCADE constraints
  db.exec('BEGIN; CREATE TABLE agents_new (...); INSERT INTO agents_new SELECT * FROM agents; DROP TABLE agents; ALTER TABLE agents_new RENAME TO agents; COMMIT;');
  db.pragma('user_version = 1');
}
```

#### Phase 2: Server-Side Error Handling (this week)

Add try/catch to every API route handler:

```typescript
try {
  // ... existing logic
} catch (error) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}:`, error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

Guard `req.json()` calls against malformed bodies.

#### Phase 3: Client-Side Error Handling (this week)

Add to every mutation:
- `response.ok` check before treating as success
- `.catch()` with user-visible error message
- `mutating` state to prevent double-submit
- `AbortController` cleanup in data-fetching `useEffect` hooks

#### Phase 4: Error Boundaries (this week — trivial)

Add Next.js `error.tsx` at the app level (5 lines of code, automatic error boundary — no library needed).

### Acceptance Criteria

- [ ] All multi-statement DB operations wrapped in `db.transaction()`
- [ ] DELETE handler includes all related tables (grand_opening_events, guests, posts)
- [ ] `busy_timeout` and `synchronous` pragmas set
- [ ] HMR guard prevents multiple DB connections in dev
- [ ] Every API route has try/catch returning structured `{ error }` JSON
- [ ] Every client-side fetch has `.catch()` that displays an error state
- [ ] Mutations check `response.ok` before treating as success
- [ ] Mutation buttons disabled while request is in-flight (prevent double-submit)
- [ ] AbortController cleanup in all data-fetching useEffect hooks
- [ ] Login page shows error message on network failure (not stuck spinner)
- [ ] `error.tsx` exists at app level for automatic error boundary

### Files to Modify

| File | Change |
|------|--------|
| `src/lib/db.ts` | Add pragmas, HMR guard, prepare migration support |
| `src/app/api/agents/route.ts` | Wrap POST in transaction + try/catch |
| `src/app/api/agents/[id]/route.ts` | Fix DELETE (add missing tables) + wrap in transaction + try/catch |
| `src/app/api/agents/[id]/advance/route.ts` | Wrap advance in transaction + try/catch |
| `src/app/api/agents/[id]/engagement/route.ts` | try/catch |
| `src/app/api/agents/[id]/notes/route.ts` | try/catch |
| `src/app/api/alerts/route.ts` | try/catch |
| `src/app/api/metrics/route.ts` | try/catch |
| `src/lib/grand-opening-factory.ts` | Move DELETE inside transaction in `generatePosts` |
| `src/app/error.tsx` | **NEW** — 5-line error boundary |
| `src/app/page.tsx` | Add error handling + mutation locking |
| `src/app/agents/page.tsx` | Add error handling + mutation locking |
| `src/app/agents/[id]/page.tsx` | Add error handling + AbortController + mutation locking |
| `src/app/alerts/page.tsx` | Add error handling |
| `src/app/metrics/page.tsx` | Add error handling |
| `src/app/login/page.tsx` | Add `.catch()` to login fetch |
| All grand-opening page components | Add error handling + AbortController |

---

## Improvement #3: Code Quality & Dead Code Cleanup (HIGH)

### Problem Statement

The codebase has **zero tests**, **no shared types**, **significant code duplication**, and **dead code** that makes every change risky:

| Gap | Actual Metric (corrected) |
|-----|--------------------------|
| Test files | 0 |
| Test framework | None installed |
| Shared TypeScript interfaces | 0 (12+ local definitions that drift) |
| Shared UI components | 1 (`Sidebar.tsx`) out of ~15 repeated patterns |
| Duplicated fetch+useState+useEffect pattern | 10+ instances across 7 pages |
| Duplicated stat card pattern | 4 pages, 13+ cards with identical structure |
| Dead v1 Grand Opening code | 3 files, 5 DB tables — completely orphaned |
| Duplicated CopyBtn component | Defined inline in 2 separate files |
| Event interface defined | 6 times with different field sets |
| Unused CSS custom properties | Defined but never referenced |
| Unused DB columns | `notes_text`, `stalled` on agents table |

### Research Insights

**Dead Code Analysis (from pattern-recognition-specialist + architecture-strategist):**

The v1 Grand Opening system is completely orphaned:
- `src/lib/grand-opening.ts` — v1 data access layer (never imported by active routes)
- `src/app/api/grand-opening/route.ts` — v1 API route (shadowed by v2 routes)
- DB tables: `grand_openings`, `go_guests`, `go_social_accounts`, `go_milestones`, `go_templates` — none used by v2

**Action:** Delete v1 files and remove v1 table creation from `db.ts`. The v2 system (`grand-opening-factory.ts` + `grand_opening_events/guests/posts` tables) is the active implementation.

**Type Consolidation Priorities (from kieran-typescript-reviewer):**

| Current | Recommended | Reason |
|---------|-------------|--------|
| `AgentRow` (used in types) | `AgentSummary` | Not a raw DB row — it's a computed summary with `is_stalled` |
| `number` for stage | `StageId` = `1|2|3|4|5|6|7|8|9|10|11` | Prevents invalid stages at type level |
| 6 different `Event` interfaces | Single `GOEvent` from `grand-opening-factory.ts` | Already exists but no frontend imports it |
| Inline `Metrics` in 2 pages | `DashboardMetrics` + `MetricsPageData` | Different shapes, different names |

**Simplicity-Adjusted Scope (from code-simplicity-reviewer):**

The original plan proposed ~800 lines of new code including 5 new components, a custom hook, and a full test suite. For a 1-2 user internal tool, this is overengineered. Right-sized scope:

| Original Proposal | Right-Sized Alternative |
|-------------------|------------------------|
| 5 new shared components | Extract only `StatCard` (highest duplication) |
| Custom `useApiData` hook | Add `.catch()` + `response.ok` inline (simpler) |
| Full vitest test suite (70% coverage) | Tests for critical paths only: transactions, auth, stage advance |
| zod validation schemas | Simple if-checks at API boundaries |

**However**, the simplicity reviewer also noted: "The transaction bugs and missing DELETE tables are real functional bugs that must be fixed regardless of app scale."

**Database Index Recommendations (from performance-oracle — highest ROI optimization):**

```sql
-- These 8 indexes cover all foreign key columns used in JOINs and WHERE clauses
CREATE INDEX IF NOT EXISTS idx_stage_history_agent ON stage_history(agent_id);
CREATE INDEX IF NOT EXISTS idx_engagement_agent ON engagement(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_notes_agent ON agent_notes(agent_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_agent ON activity_log(agent_id);
CREATE INDEX IF NOT EXISTS idx_go_guests_event ON grand_opening_guests(event_id);
CREATE INDEX IF NOT EXISTS idx_go_posts_event ON grand_opening_posts(event_id);
CREATE INDEX IF NOT EXISTS idx_go_events_agent ON grand_opening_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_stage ON agents(current_stage);
```

**Metrics Query Consolidation (from performance-oracle):**

The current `/api/metrics` endpoint executes ~48 separate SQL queries. Consolidate to ~5:

```sql
-- Replace 11 individual stage count queries with one:
SELECT current_stage, COUNT(*) as count FROM agents GROUP BY current_stage;

-- Replace 11 individual avg time queries with one:
SELECT stage_number, AVG(julianday(ended_at) - julianday(started_at)) as avg_days
FROM stage_history WHERE ended_at IS NOT NULL GROUP BY stage_number;

-- Replace 20+ conversion queries with one:
SELECT current_stage,
  SUM(CASE WHEN licensed = 1 THEN 1 ELSE 0 END) as licensed,
  SUM(CASE WHEN contracted = 1 THEN 1 ELSE 0 END) as contracted
FROM agents GROUP BY current_stage;
```

**N+1 Fix for Grand Opening Dashboard (from performance-oracle + frontend-races-reviewer):**

```typescript
// BEFORE: src/app/grand-opening/page.tsx (N+1 — serial fetches)
const events = await fetch('/api/grand-opening/events').then(r => r.json());
for (const event of events) {
  event.guests = await fetch(`/api/grand-opening/events/${event.id}/guests`).then(r => r.json());
}

// AFTER: Use Promise.allSettled for parallel fetches
const events = await fetch('/api/grand-opening/events').then(r => r.json());
const guestResults = await Promise.allSettled(
  events.map((e: GOEvent) => fetch(`/api/grand-opening/events/${e.id}/guests`).then(r => r.json()))
);
```

Or better: add a single aggregate API endpoint that returns events with guest counts.

### Type Drift Risk

The same data is typed differently in different files:

```
src/app/page.tsx         → interface Metrics { stageCounts, total, stalled, ... }
src/app/metrics/page.tsx → interface Metrics { stageCounts, avgTimes, conversions, ... }
                            ^^^^^^^^ Same name, DIFFERENT shape
```

If the API response changes, there is no compile-time connection between these definitions. Each page breaks independently with no warning.

### Proposed Solution

#### Phase 1: Dead Code Removal + DB Indexes (this week, ~30 min)

1. **Delete v1 Grand Opening files:**
   - `src/lib/grand-opening.ts`
   - `src/app/api/grand-opening/route.ts` (v1 route)
   - Remove v1 table creation (`grand_openings`, `go_guests`, `go_social_accounts`, `go_milestones`, `go_templates`) from `src/lib/db.ts`

2. **Add database indexes** for all foreign key columns (8 indexes — see SQL above)

3. **Remove unused DB columns:** `notes_text`, `stalled` from agents table (if no data exists in them)

#### Phase 2: Shared Types (this week, ~30 min)

1. **Create `src/types/index.ts`** with consolidated interfaces:
   - `AgentSummary` (renamed from `AgentRow` — includes computed `is_stalled`)
   - `AgentDetail` (full agent with related data)
   - `StageId` = `1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11`
   - `DashboardMetrics`, `MetricsPageData` (different shapes, different names)
   - Import `GOEvent`, `GOGuest`, `GOPost` from `grand-opening-factory.ts` and re-export

2. **Update all pages** to import from `src/types/index.ts` instead of defining local interfaces

#### Phase 3: Test Framework + Critical Tests (next sprint)

1. **Install vitest**:
   ```bash
   npm install -D vitest
   ```

2. **Create `vitest.config.ts`** with in-memory SQLite for test isolation:
   ```typescript
   import { defineConfig } from 'vitest/config';
   import path from 'path';
   export default defineConfig({
     test: {
       environment: 'node',
       globals: true,
     },
     resolve: {
       alias: { '@': path.resolve(__dirname, 'src') },
     },
   });
   ```

3. **Write tests for critical paths only** (right-sized for 1-2 user app):
   - Transaction atomicity (DELETE cascades correctly, including grand opening tables)
   - Auth flow (correct password succeeds, wrong password fails, missing env var throws)
   - Stage advance boundaries (can't go below 1 or above 11)
   - Rate limiting (6th attempt within 15 min returns 429)

4. **Add test scripts** to `package.json`:
   ```json
   "test": "vitest run",
   "test:watch": "vitest"
   ```

#### Phase 4: Performance Quick Wins (next sprint)

1. **Consolidate metrics queries** (48 → ~5 queries)
2. **Fix N+1 on grand opening dashboard** (serial → parallel with Promise.allSettled)
3. **Fix RSVP dedup** (load all guests into memory → SQL WHERE check)

### Acceptance Criteria

- [ ] v1 Grand Opening dead code removed (3 files, 5 table definitions)
- [ ] Database indexes added for all foreign key columns
- [ ] Shared types in `src/types/index.ts` — all pages import from it
- [ ] No duplicate interface definitions across pages (especially `Event`, `Metrics`)
- [ ] Vitest installed and `npm test` runs successfully
- [ ] Tests cover: transaction atomicity, auth flow, stage advance boundaries
- [ ] Metrics endpoint uses consolidated queries (< 10 queries per request)
- [ ] Grand opening dashboard fetches guests in parallel

### Files to Create/Modify

| File | Change |
|------|--------|
| `src/types/index.ts` | **NEW** — all shared interfaces |
| `src/lib/grand-opening.ts` | **DELETE** — dead v1 code |
| `src/app/api/grand-opening/route.ts` | **DELETE** — dead v1 API route |
| `src/lib/db.ts` | Remove v1 tables, add indexes, remove unused columns |
| `src/app/api/metrics/route.ts` | Consolidate to ~5 GROUP BY queries |
| `src/app/grand-opening/page.tsx` | Fix N+1 fetch pattern |
| `src/app/api/grand-opening/events/[id]/rsvp/route.ts` | SQL-based dedup check |
| `vitest.config.ts` | **NEW** — test configuration |
| `package.json` | Add test scripts + vitest dev dependency |
| `__tests__/transactions.test.ts` | **NEW** — transaction atomicity tests |
| `__tests__/auth.test.ts` | **NEW** — auth flow tests |
| `__tests__/stage-advance.test.ts` | **NEW** — boundary tests |
| All page components | Import shared types |

---

## Implementation Timeline

```
Week 1 (Immediate)
├── Day 1: Security Phase 1 — .env, remove hardcoded password, .gitignore, Cloudflare Access
├── Day 1: Dead Code — delete v1 grand opening files (30 min)
├── Day 2: Error Handling Phase 1 — pragmas, HMR guard, wrap all DB ops in transactions
├── Day 2: Fix DELETE handler bug — add missing grand opening table deletes
├── Day 3: Error Handling Phase 2 — try/catch on all API routes + error.tsx
├── Day 3: DB Indexes — add 8 foreign key indexes (5 min)
├── Day 4: Security Phase 2 — session tokens, logout, rate limiting, security headers
├── Day 4: Shared Types — create src/types/index.ts, update all imports
└── Day 5: Error Handling Phase 3 — client-side error handling, mutation locking, AbortController

Week 2 (Next Sprint)
├── Security Phase 3 — input validation (simple if-checks)
├── Testing — install vitest, write critical path tests
├── Performance — consolidate metrics queries, fix N+1, fix RSVP dedup
└── Cleanup — remove unused DB columns, extract StatCard component (if time permits)
```

## Dependencies & Risks

| Risk | Mitigation |
|------|-----------|
| Changing auth token format logs out all active users | Coordinate deployment; only 1-2 active users |
| Removing v1 dead code may break something unexpected | Search for all imports of deleted files before removing |
| Adding DB indexes slightly slows writes | Negligible for this app's write volume; massive read improvement |
| Adding validation may reject previously-accepted data | Audit existing DB data before adding constraints |
| Schema migration (for CASCADE) requires table recreation | Use `user_version` pragma for safe, idempotent migration on startup |
| No CI/CD means tests only run locally | Add GitHub Actions as a follow-up |

## References

- **Existing Audit Report**: `onboarding-system/AUDIT-REPORT.md` (V1 issues + fixes)
- **Pipeline Spec**: `garys-onboarding-automation-spec.md` (11-stage pipeline definition)
- **Stall Thresholds**: `onboarding-pipeline-tracker.md` (48hr/72hr/7-day rules)
- **Manual Playbook**: `new-agent-automation.md` (current SOPs)
- **Original Build Spec**: `onboarding-dashboard/BUILD_SPEC.md`
- **Next.js 14 Middleware Docs**: Route handler vs page auth patterns
- **better-sqlite3 v12 Docs**: Transaction API, WAL mode, pragma configuration
- **Vitest Docs**: Configuration, in-memory SQLite testing patterns
