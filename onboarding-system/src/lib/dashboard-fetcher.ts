// Server-side dashboard data fetching utility
export interface Event {
  id: number;
  agent_name: string;
  event_date: string;
  event_time: string;
  status: string;
  target_guests: number;
}

export interface Stats { 
  total: number; 
  registered: number; 
  confirmed: number; 
  attended: number; 
  clients: number; 
  partners: number; 
}

export interface DashboardData {
  events: Event[];
  stats: Record<number, Stats>;
}

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/ooc_onboarding'
    });
    
    // Fetch all events
    const eventsResult = await pool.query('SELECT * FROM grand_opening_events ORDER BY created_at DESC');
    const events: Event[] = eventsResult.rows;
    
    // Fetch stats for each event
    const stats: Record<number, Stats> = {};
    
    for (const event of events) {
      try {
        const guestsResult = await pool.query('SELECT * FROM grand_opening_guests WHERE event_id = $1', [event.id]);
        const guests = guestsResult.rows;
        
        stats[event.id] = {
          total: guests.length,
          registered: guests.filter(g => ['registered','confirmed','attended'].includes(g.rsvp_status)).length,
          confirmed: guests.filter(g => ['confirmed','attended'].includes(g.rsvp_status)).length,
          attended: guests.filter(g => g.rsvp_status === 'attended').length,
          clients: guests.filter(g => g.became_client).length,
          partners: guests.filter(g => g.became_partner).length,
        };
      } catch (err) {
        console.error(`Error fetching guests for event ${event.id}:`, err);
        stats[event.id] = { total: 0, registered: 0, confirmed: 0, attended: 0, clients: 0, partners: 0 };
      }
    }
    
    return { events, stats };
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { events: [], stats: {} };
  }
}