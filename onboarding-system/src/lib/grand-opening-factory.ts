import db from './db';

// ─── Types ───────────────────────────────────────────────────────
export interface GOEvent {
  id: number;
  agent_name: string;
  agent_phone: string | null;
  agent_email: string | null;
  agent_story: string | null;
  event_title: string;
  event_date: string;
  event_time: string;
  event_timezone: string;
  zoom_link: string | null;
  trainer_name: string | null;
  status: string;
  target_guests: number;
  checklist_state: string;
  created_at: string;
  updated_at: string;
}

export interface GOGuest {
  id: number;
  event_id: number;
  name: string;
  phone: string | null;
  email: string | null;
  category: string;
  relationship: string | null;
  rsvp_status: string;
  became_client: number;
  became_partner: number;
  follow_up_status: string;
  follow_up_notes: string | null;
  macho_score: number;
  created_at: string;
  updated_at: string;
}

export interface GOPost {
  id: number;
  event_id: number;
  platform: string;
  post_type: string;
  content: string;
  suggested_date: string | null;
  posted: number;
  created_at: string;
}

// ─── Events ──────────────────────────────────────────────────────
export function listEvents(): GOEvent[] {
  return db.prepare('SELECT * FROM grand_opening_events ORDER BY event_date DESC').all() as GOEvent[];
}

export function getEvent(id: number): GOEvent | undefined {
  return db.prepare('SELECT * FROM grand_opening_events WHERE id = ?').get(id) as GOEvent | undefined;
}

export function createEvent(data: Partial<GOEvent>): GOEvent {
  const stmt = db.prepare(`
    INSERT INTO grand_opening_events (agent_name, agent_phone, agent_email, agent_story, event_title, event_date, event_time, event_timezone, zoom_link, trainer_name, target_guests)
    VALUES (@agent_name, @agent_phone, @agent_email, @agent_story, @event_title, @event_date, @event_time, @event_timezone, @zoom_link, @trainer_name, @target_guests)
  `);
  const info = stmt.run({
    agent_name: data.agent_name || '',
    agent_phone: data.agent_phone || null,
    agent_email: data.agent_email || null,
    agent_story: data.agent_story || null,
    event_title: data.event_title || 'Grand Opening',
    event_date: data.event_date || '',
    event_time: data.event_time || '19:00',
    event_timezone: data.event_timezone || 'America/New_York',
    zoom_link: data.zoom_link || null,
    trainer_name: data.trainer_name || null,
    target_guests: data.target_guests || 100,
  });
  return getEvent(info.lastInsertRowid as number)!;
}

export function updateEvent(id: number, data: Partial<GOEvent>): GOEvent | undefined {
  const fields: string[] = [];
  const values: Record<string, unknown> = { id };
  for (const key of ['agent_name','agent_phone','agent_email','agent_story','event_title','event_date','event_time','event_timezone','zoom_link','trainer_name','status','target_guests','checklist_state'] as const) {
    if (data[key as keyof GOEvent] !== undefined) {
      fields.push(`${key} = @${key}`);
      values[key] = data[key as keyof GOEvent];
    }
  }
  if (fields.length === 0) return getEvent(id);
  fields.push("updated_at = datetime('now')");
  db.prepare(`UPDATE grand_opening_events SET ${fields.join(', ')} WHERE id = @id`).run(values);
  return getEvent(id);
}

export function deleteEvent(id: number): void {
  db.prepare('DELETE FROM grand_opening_events WHERE id = ?').run(id);
}

// ─── Guests ──────────────────────────────────────────────────────
export function listGuests(eventId: number): GOGuest[] {
  return db.prepare('SELECT * FROM grand_opening_guests WHERE event_id = ? ORDER BY created_at DESC').all(eventId) as GOGuest[];
}

export function getGuest(id: number): GOGuest | undefined {
  return db.prepare('SELECT * FROM grand_opening_guests WHERE id = ?').get(id) as GOGuest | undefined;
}

export function createGuest(data: Partial<GOGuest> & { event_id: number; name: string }): GOGuest {
  const stmt = db.prepare(`
    INSERT INTO grand_opening_guests (event_id, name, phone, email, category, relationship, rsvp_status, macho_score)
    VALUES (@event_id, @name, @phone, @email, @category, @relationship, @rsvp_status, @macho_score)
  `);
  const info = stmt.run({
    event_id: data.event_id,
    name: data.name,
    phone: data.phone || null,
    email: data.email || null,
    category: data.category || 'warm',
    relationship: data.relationship || null,
    rsvp_status: data.rsvp_status || 'invited',
    macho_score: data.macho_score || 0,
  });
  return getGuest(info.lastInsertRowid as number)!;
}

export function updateGuest(id: number, data: Partial<GOGuest>): GOGuest | undefined {
  const fields: string[] = [];
  const values: Record<string, unknown> = { id };
  for (const key of ['name','phone','email','category','relationship','rsvp_status','became_client','became_partner','follow_up_status','follow_up_notes','macho_score'] as const) {
    if (data[key as keyof GOGuest] !== undefined) {
      fields.push(`${key} = @${key}`);
      values[key] = data[key as keyof GOGuest];
    }
  }
  if (fields.length === 0) return getGuest(id);
  fields.push("updated_at = datetime('now')");
  db.prepare(`UPDATE grand_opening_guests SET ${fields.join(', ')} WHERE id = @id`).run(values);
  return getGuest(id);
}

export function deleteGuest(id: number): void {
  db.prepare('DELETE FROM grand_opening_guests WHERE id = ?').run(id);
}

export function bulkCreateGuests(eventId: number, guests: Array<{ name: string; phone?: string; email?: string; category?: string; relationship?: string }>): GOGuest[] {
  const insert = db.prepare(`
    INSERT INTO grand_opening_guests (event_id, name, phone, email, category, relationship)
    VALUES (@event_id, @name, @phone, @email, @category, @relationship)
  `);
  const tx = db.transaction((items: typeof guests) => {
    const ids: number[] = [];
    for (const g of items) {
      const info = insert.run({
        event_id: eventId,
        name: g.name,
        phone: g.phone || null,
        email: g.email || null,
        category: g.category || 'warm',
        relationship: g.relationship || null,
      });
      ids.push(info.lastInsertRowid as number);
    }
    return ids;
  });
  const ids = tx(guests);
  return ids.map(id => getGuest(id)!);
}

// ─── Social Posts ────────────────────────────────────────────────
export function listPosts(eventId: number): GOPost[] {
  return db.prepare('SELECT * FROM grand_opening_posts WHERE event_id = ? ORDER BY suggested_date ASC').all(eventId) as GOPost[];
}

export function generatePosts(event: GOEvent): GOPost[] {
  // Delete existing
  db.prepare('DELETE FROM grand_opening_posts WHERE event_id = ?').run(event.id);

  const date = event.event_date;
  const time = event.event_time;
  const tz = event.event_timezone;
  const link = `[RSVP LINK]`;

  const templates: Array<{ platform: string; post_type: string; content: string; suggested_date: string | null }> = [];

  const platforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
  const postDefs = [
    {
      type: 'announcement',
      content: `🎉 I'm excited to announce the launch of my financial services practice! Join me for a special virtual event on ${date} at ${time} ${tz}. I'd love your support — it would mean the world. Comment ATTENDING to confirm! 🙌 #NewBeginnings #FinancialFreedom`,
      daysBefore: 14,
    },
    {
      type: 'countdown_7',
      content: `7️⃣ days until my Grand Opening! I can't wait to share what I've been working on. If you haven't registered yet, there's still time! Link in bio 👆`,
      daysBefore: 7,
    },
    {
      type: 'countdown_3',
      content: `3️⃣ DAYS! My Grand Opening is almost here! Don't miss out — this is going to be special. Register: ${link}`,
      daysBefore: 3,
    },
    {
      type: 'countdown_1',
      content: `TOMORROW IS THE DAY! 🎊 My Grand Opening is at ${time} ${tz}. Last chance to register! I'd love to see you there. Can I count on you? ${link}`,
      daysBefore: 1,
    },
    {
      type: 'day_of',
      content: `IT'S HERE! 🚀 My Grand Opening starts TODAY! Join me at ${time} ${tz}. See you there! 💪`,
      daysBefore: 0,
    },
    {
      type: 'post_event',
      content: `Thank you to everyone who attended my Grand Opening! 🙏 What an incredible night. If you missed it, don't worry — reach out and I'll get you the recording. This is just the beginning! 🔥`,
      daysBefore: -1,
    },
  ];

  for (const p of platforms) {
    for (const def of postDefs) {
      const d = new Date(date);
      d.setDate(d.getDate() - def.daysBefore);
      templates.push({
        platform: p,
        post_type: def.type,
        content: def.content,
        suggested_date: d.toISOString().split('T')[0],
      });
    }
  }

  const insert = db.prepare(`
    INSERT INTO grand_opening_posts (event_id, platform, post_type, content, suggested_date)
    VALUES (@event_id, @platform, @post_type, @content, @suggested_date)
  `);
  const tx = db.transaction((items: typeof templates) => {
    for (const t of items) {
      insert.run({ event_id: event.id, ...t });
    }
  });
  tx(templates);
  return listPosts(event.id);
}

// ─── Stats ───────────────────────────────────────────────────────
export function getEventStats(eventId: number) {
  const total = (db.prepare('SELECT COUNT(*) as c FROM grand_opening_guests WHERE event_id = ?').get(eventId) as { c: number }).c;
  const registered = (db.prepare("SELECT COUNT(*) as c FROM grand_opening_guests WHERE event_id = ? AND rsvp_status IN ('registered','confirmed','attended')").get(eventId) as { c: number }).c;
  const confirmed = (db.prepare("SELECT COUNT(*) as c FROM grand_opening_guests WHERE event_id = ? AND rsvp_status IN ('confirmed','attended')").get(eventId) as { c: number }).c;
  const attended = (db.prepare("SELECT COUNT(*) as c FROM grand_opening_guests WHERE event_id = ? AND rsvp_status = 'attended'").get(eventId) as { c: number }).c;
  const clients = (db.prepare("SELECT COUNT(*) as c FROM grand_opening_guests WHERE event_id = ? AND became_client = 1").get(eventId) as { c: number }).c;
  const partners = (db.prepare("SELECT COUNT(*) as c FROM grand_opening_guests WHERE event_id = ? AND became_partner = 1").get(eventId) as { c: number }).c;
  return { total, registered, confirmed, attended, clients, partners };
}
