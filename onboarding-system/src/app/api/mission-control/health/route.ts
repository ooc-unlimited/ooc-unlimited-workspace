import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

function check(label: string, fn: () => boolean): { label: string; ok: boolean } {
  try { return { label, ok: fn() }; } catch { return { label, ok: false }; }
}

export async function GET() {
  const checks = [
    check('Next.js (port 3001)', () => {
      execSync('curl -sf -o /dev/null http://localhost:3001', { timeout: 3000 });
      return true;
    }),
    check('Cloudflare Tunnel', () => {
      const out = execSync('pgrep -x cloudflared', { timeout: 2000 }).toString().trim();
      return out.length > 0;
    }),
    check('garylifeindex.com', () => {
      execSync('curl -sf -o /dev/null --max-time 5 https://garylifeindex.com', { timeout: 6000 });
      return true;
    }),
  ];
  return NextResponse.json(checks);
}
