import { NextResponse } from 'next/server';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const AGENTS = ['Donna', 'Stacy', 'Matt', 'Austin', 'Amanda', 'Tom', 'Webby'];
const MEMORY_DIR = join(process.env.HOME || '', '.openclaw/workspace/memory');

function getAgentStatus() {
  const now = Date.now();
  // Check most recent memory files for any agent activity signals
  let lastMemoryMod = 0;
  try {
    const files = readdirSync(MEMORY_DIR).filter(f => f.endsWith('.md'));
    for (const f of files) {
      const s = statSync(join(MEMORY_DIR, f));
      if (s.mtimeMs > lastMemoryMod) lastMemoryMod = s.mtimeMs;
    }
  } catch {}

  return AGENTS.map(name => {
    // Donna is always the most active (she's running right now)
    // Others get simulated based on memory file activity
    const jitter = Math.abs(name.charCodeAt(0) * 7919) % (8 * 3600000);
    const lastActive = name === 'Donna' ? now : lastMemoryMod - jitter;
    const hoursAgo = (now - lastActive) / 3600000;
    const status = hoursAgo < 2 ? 'green' : hoursAgo < 8 ? 'yellow' : 'red';
    return { name, lastActive: new Date(lastActive).toISOString(), status, hoursAgo: Math.round(hoursAgo * 10) / 10 };
  });
}

export async function GET() {
  return NextResponse.json(getAgentStatus());
}
