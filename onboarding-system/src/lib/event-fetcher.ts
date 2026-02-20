// Server-side event fetching utility
export interface Event { 
  id: number; 
  agent_name: string; 
  event_title: string; 
  event_date: string; 
  event_time: string; 
  event_timezone: string;
}

export async function fetchEvent(id: string): Promise<Event | null> {
  try {
    // Direct database query to avoid HTTP call issues
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/ooc_onboarding'
    });
    
    const result = await pool.query('SELECT * FROM grand_opening_events WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Return the first row as our event
    return result.rows[0] as Event;
    
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}