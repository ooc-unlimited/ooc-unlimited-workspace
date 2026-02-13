import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'onboarding.db');

// Ensure data directory exists
import fs from 'fs';
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    licensed INTEGER DEFAULT 1,
    current_stage INTEGER DEFAULT 1,
    ica_date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    notes_text TEXT DEFAULT '',
    stalled INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS stage_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT NOT NULL REFERENCES agents(id),
    stage INTEGER NOT NULL,
    entered_at TEXT DEFAULT (datetime('now')),
    exited_at TEXT
  );

  CREATE TABLE IF NOT EXISTS agent_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT NOT NULL REFERENCES agents(id),
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT REFERENCES agents(id),
    agent_name TEXT,
    action TEXT NOT NULL,
    details TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS engagement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT NOT NULL REFERENCES agents(id),
    type TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    due_date TEXT,
    completed_at TEXT
  );

  /* Grand Opening Factory tables */
CREATE TABLE IF NOT EXISTS grand_openings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT NOT NULL REFERENCES agents(id),
    event_date TEXT NOT NULL,
    status TEXT DEFAULT setup,
    luma_url TEXT,
    zoom_link TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS go_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grand_opening_id INTEGER NOT NULL REFERENCES grand_openings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    category TEXT,
    status TEXT DEFAULT new,
    invited_at TEXT,
    registered_at TEXT,
    attended INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS go_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grand_opening_id INTEGER NOT NULL REFERENCES grand_openings(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    platform TEXT,
    scheduled_at TEXT,
    posted_at TEXT,
    status TEXT DEFAULT draft
  );

  CREATE TABLE IF NOT EXISTS go_social_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT NOT NULL REFERENCES agents(id),
    platform TEXT NOT NULL,
    handle TEXT,
    credentials_encrypted TEXT
  );

  CREATE TABLE IF NOT EXISTS go_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grand_opening_id INTEGER NOT NULL REFERENCES grand_openings(id) ON DELETE CASCADE,
    total_invited INTEGER DEFAULT 0,
    total_registered INTEGER DEFAULT 0,
    total_attended INTEGER DEFAULT 0,
    total_booked INTEGER DEFAULT 0,
    total_closed INTEGER DEFAULT 0
  );

  /* Grand Opening Factory v2 tables */
  CREATE TABLE IF NOT EXISTS grand_opening_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_name TEXT NOT NULL,
    agent_phone TEXT,
    agent_email TEXT,
    agent_story TEXT,
    event_title TEXT NOT NULL DEFAULT 'Grand Opening',
    event_date TEXT NOT NULL,
    event_time TEXT NOT NULL DEFAULT '19:00',
    event_timezone TEXT NOT NULL DEFAULT 'America/New_York',
    zoom_link TEXT,
    trainer_name TEXT,
    status TEXT NOT NULL DEFAULT 'planning',
    target_guests INTEGER DEFAULT 100,
    checklist_state TEXT DEFAULT '{}',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS grand_opening_guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES grand_opening_events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    category TEXT DEFAULT 'warm',
    relationship TEXT,
    rsvp_status TEXT DEFAULT 'invited',
    became_client INTEGER DEFAULT 0,
    became_partner INTEGER DEFAULT 0,
    follow_up_status TEXT DEFAULT 'none',
    follow_up_notes TEXT,
    macho_score INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS grand_opening_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES grand_opening_events(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    post_type TEXT NOT NULL,
    content TEXT NOT NULL,
    suggested_date TEXT,
    posted INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export default db;
