# Grand Opening Factory — Full Product Spec
## garylifeindex.com/grand-opening

### Overview
A fully automated sub-site where new recruits create, manage, and execute their Grand Opening events. The recruit provides minimal input; the system handles countdown posts, invite templates, RSVP tracking, event hosting links, follow-up sequences, and KPI tracking.

**Live URL:** https://garylifeindex.com/grand-opening
**Tech:** Next.js 14 (App Router), TypeScript, Tailwind CSS, SQLite (better-sqlite3), deployed via Cloudflare Tunnel to existing onboarding-system app on port 3001.

---

## Architecture

### Route Structure
```
/grand-opening                          → Dashboard (list all events, stats)
/grand-opening/new                      → Create new grand opening event
/grand-opening/[id]                     → Event detail/management page
/grand-opening/[id]/invite              → Public RSVP page (shareable link for guests)
/grand-opening/[id]/invite/success      → RSVP confirmation page
/grand-opening/[id]/live                → Event day page (Zoom link, countdown)
/grand-opening/[id]/followup            → Post-event follow-up dashboard
/grand-opening/[id]/kpi                 → KPI tracking (Invited→Registered→Attended→Client)
/api/grand-opening/events               → CRUD for events
/api/grand-opening/events/[id]/guests   → CRUD for guests/RSVPs
/api/grand-opening/events/[id]/social   → Social media post generator
```

### Database Schema (SQLite)
```sql
-- Grand Opening Events
CREATE TABLE IF NOT EXISTS grand_opening_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_name TEXT NOT NULL,
  agent_phone TEXT,
  agent_email TEXT,
  agent_story TEXT,           -- Their personal "why" story (< 7 min version)
  event_title TEXT NOT NULL DEFAULT 'Grand Opening',
  event_date TEXT NOT NULL,   -- ISO date
  event_time TEXT NOT NULL,   -- e.g., "19:00"
  event_timezone TEXT NOT NULL DEFAULT 'America/New_York',
  zoom_link TEXT,
  trainer_name TEXT,
  status TEXT NOT NULL DEFAULT 'planning', -- planning, inviting, live, completed, cancelled
  target_guests INTEGER DEFAULT 100,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Guest List / RSVPs
CREATE TABLE IF NOT EXISTS grand_opening_guests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES grand_opening_events(id),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  category TEXT DEFAULT 'warm',  -- warm, reconnect, cold
  relationship TEXT,              -- e.g., "cousin", "college friend", "coworker"
  rsvp_status TEXT DEFAULT 'invited', -- invited, registered, confirmed, attended, no_show
  became_client BOOLEAN DEFAULT 0,
  became_partner BOOLEAN DEFAULT 0,
  follow_up_status TEXT DEFAULT 'none', -- none, contacted, scheduled, completed
  follow_up_notes TEXT,
  macho_score INTEGER DEFAULT 0,  -- 0-5 (Married, Age28+, Children, Homeowner50K+, Owner)
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Social Media Posts (generated)
CREATE TABLE IF NOT EXISTS grand_opening_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES grand_opening_events(id),
  platform TEXT NOT NULL,        -- facebook, instagram, twitter, linkedin
  post_type TEXT NOT NULL,       -- announcement, countdown_7, countdown_3, countdown_1, day_of, post_event
  content TEXT NOT NULL,
  suggested_date TEXT,
  posted BOOLEAN DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
```

---

## Pages & Features

### 1. Dashboard (`/grand-opening`)
- List all grand opening events with status badges
- Quick stats: total events, total guests invited, total RSVPs, conversion rates
- "Create New Grand Opening" button (prominent)
- Each event card shows: agent name, date, status, guest count, RSVP count
- Dark theme consistent with existing onboarding dashboard

### 2. Create Event (`/grand-opening/new`)
Multi-step form:
- **Step 1: Agent Info** — Name, phone, email
- **Step 2: Event Details** — Date, time, timezone, Zoom link (optional, can add later), trainer name
- **Step 3: Your Story** — Textarea for their personal "why" story. Include prompt: "Why did you get into this business? What drives you? This is what you'll share at your grand opening (keep it under 4 minutes)."
- **Step 4: Guest List Builder** — Add guests with name, phone, email, category (warmest/reconnect/cold), relationship. Bulk import option (paste CSV: name, phone, email). Target: 100 guests minimum. Show progress bar toward 100.
- On submit: creates event, auto-generates social media posts and invite templates

### 3. Event Detail (`/grand-opening/[id]`)
Main management hub with tabs:
- **Overview** — Event info, status, countdown to event
- **Guest List** — Full table with sort/filter. Columns: Name, Category, RSVP Status, MACHO Score, Follow-up Status, Actions
- **Outreach** — Three-category outreach templates:
  - **Warmest Market:** "Hey [name], I'm doing a relaunch of my business. Your support would mean the world. Can I count on you? [date/time]"
  - **Reconnect Market:** "Hey [name], it's been forever. You just came to mind. How are you? How's the family?" (then follow-up after reply)
  - **Cold/Professional:** Customizable template
  - Each template has copy-to-clipboard button
- **Social Posts** — Auto-generated countdown posts (7-day, 3-day, 1-day, day-of). Each has platform-specific formatting. Copy buttons.
- **Preparation Checklist** — 10-step checklist from Dajuan's framework:
  1. ☐ Have a professional flyer ready
  2. ☐ Upline has set up the grand opening logistics
  3. ☐ Sent invites via social media + text
  4. ☐ Collected phone numbers from social contacts
  5. ☐ Invited 100+ guests (show current count)
  6. ☐ Ensured guests have Zoom + correct timezone
  7. ☐ Day-before follow-up sent to ALL
  8. ☐ No-shows redirected to field training
  9. ☐ Day-of morning confirmation sent
  10. ☐ Rehearsed the grand opening with trainer
- **Shareable RSVP Link** — Copy button for the public invite page

### 4. Public RSVP Page (`/grand-opening/[id]/invite`)
**This is the guest-facing page.** Clean, professional, NO login required.
- Agent's name and professional headshot placeholder
- Event title, date, time (with timezone conversion)
- Brief description: "Join [Agent Name] for an exclusive look at a financial services opportunity that's changing lives."
- RSVP form: Name, Email, Phone (optional)
- "Can I Count on You?" button (CTA — matches Prince Z's close)
- After RSVP → success page with: "You're registered! Add to calendar" + calendar link (.ics download)
- Mobile-responsive, looks great shared via text

### 5. Event Day Page (`/grand-opening/[id]/live`)
- Countdown timer to event start
- "Join Zoom" button (large, prominent)
- Agent's story summary
- Agenda: "Welcome (5 min) → Presentation (20 min) → Q&A (5 min)"
- Reminder: "Turn cameras ON — your broker is tracking attendance for your agent's promotion"

### 6. Follow-Up Dashboard (`/grand-opening/[id]/followup`)
Post-event management:
- **Attendees** — Mark who attended, follow-up actions
- **No-Shows** — Pre-written follow-up script (from Dajuan):
  "Hey [name], I'm sorry you missed my grand opening, but you can still potentially help me. I'm up for a promotion. I have to witness 10 field trainings. The good news is I've already seen 7. I just need 3 more. That's why I'm messaging you. Can I count on you?"
- **Redirect Options** for no-shows:
  1. Company Overview (every Saturday 11 AM Pacific)
  2. Prolific Daily Overview (every day 10 AM Pacific / 1 PM Eastern)
  3. Send them the recording → set up 1-on-1 field training
- Mark guests as: became_client, became_partner
- Follow-up status tracking per guest

### 7. KPI Dashboard (`/grand-opening/[id]/kpi`)
Visual pipeline:
- **Invited** → **Registered** → **Confirmed** → **Attended** → **Client** → **Business Partner**
- Funnel visualization with percentages at each step
- Target benchmarks (from training):
  - 100 invited → 60 registered → 30 show → 10 move forward
- Color-coded: green (on track), yellow (below average), red (needs attention)
- 3-3-30 target tracker: 3 clients, 3 business partners, 30 days

---

## Design Requirements
- **Dark theme** — consistent with existing onboarding dashboard (dark gray/purple tones)
- **Mobile-first** — agents will manage from their phones
- **No auth on public RSVP page** — guests should register friction-free
- **Dashboard pages** — protected by existing password auth (Start345)
- **Tailwind CSS** — use existing setup
- **Animations** — subtle, professional. Countdown timers, progress bars, funnel animations.

## Social Media Post Templates (Auto-Generated)

### Announcement Post
"🎉 I'm excited to announce the launch of my financial services practice! Join me for a special virtual event on [DATE] at [TIME] [TZ]. I'd love your support — it would mean the world. Comment ATTENDING to confirm! 🙌 #NewBeginnings #FinancialFreedom"

### 7-Day Countdown
"7️⃣ days until my Grand Opening! I can't wait to share what I've been working on. If you haven't registered yet, there's still time! Link in bio 👆"

### 3-Day Countdown
"3️⃣ DAYS! My Grand Opening is almost here! [X] people have already registered. Don't miss out — this is going to be special. Register: [LINK]"

### 1-Day Countdown
"TOMORROW IS THE DAY! 🎊 My Grand Opening is at [TIME] [TZ]. Last chance to register! I'd love to see you there. Can I count on you? [LINK]"

### Day-Of
"IT'S HERE! 🚀 My Grand Opening starts in [X] hours! Join me at [TIME] [TZ]. Zoom link: [LINK]. See you there! 💪"

### Post-Event
"Thank you to everyone who attended my Grand Opening! 🙏 What an incredible night. If you missed it, don't worry — reach out and I'll get you the recording. This is just the beginning! 🔥"

---

## Non-Functional Requirements
- All data in SQLite (same db as onboarding system: `/data/onboarding.db`)
- No external services required (no Luma, no third-party RSVP — we build it all)
- Must work behind Cloudflare Tunnel (existing setup)
- Page load < 2 seconds
- Guest RSVP page must be shareable via text message (clean URL, good Open Graph meta tags)

## Open Graph / Social Preview
For the RSVP page:
- Title: "[Agent Name]'s Grand Opening"
- Description: "Join [Agent Name] for an exclusive virtual event about financial services. [Date] at [Time]."
- Image: Generate a simple OG image or use a default branded one
