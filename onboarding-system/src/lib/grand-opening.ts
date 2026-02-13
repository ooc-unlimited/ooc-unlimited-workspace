import db from "./db";

export interface GrandOpening {
  id: number;
  agent_id: string;
  event_date: string;
  status: string;
  luma_url?: string;
  zoom_link?: string;
  created_at: string;
}

export function createGrandOpening(agentId: string, eventDate: string): GrandOpening {
  const stmt = db.prepare(`
    INSERT INTO grand_openings (agent_id, event_date)
    VALUES (?, ?)
    RETURNING *;
  `);
  return stmt.get(agentId, eventDate) as GrandOpening;
}

export function getGrandOpening(id: number): GrandOpening | undefined {
  const stmt = db.prepare("SELECT * FROM grand_openings WHERE id = ?");
  return stmt.get(id) as GrandOpening | undefined;
}

export function listGrandOpenings(): GrandOpening[] {
  const stmt = db.prepare("SELECT * FROM grand_openings ORDER BY created_at DESC");
  return stmt.all() as GrandOpening[];
}

export function updateGrandOpeningStatus(id: number, status: string) {
  const stmt = db.prepare(`
    UPDATE grand_openings
    SET status = ?
    WHERE id = ?;
  `);
  stmt.run(status, id);
}

