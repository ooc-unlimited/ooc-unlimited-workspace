# HEARTBEAT.md

## Every Heartbeat — Site Health Check
1. Verify garylifeindex.com is reachable: `curl -s -o /dev/null -w "%{http_code}" https://garylifeindex.com/login` → expect 200
2. Verify /grand-opening/1/invite loads (public, no auth): `curl -s -o /dev/null -w "%{http_code}" https://garylifeindex.com/grand-opening/1/invite` → expect 200
3. Verify Next.js process running: `lsof -i :3001` → expect output
4. Verify Cloudflare tunnel running: `pgrep -f cloudflared` → expect PID
5. If anything is down, restart it and alert Gary

## Quick Status Checks (rotate, 2-3 per heartbeat)
- Onboarding dashboard routes (authenticated ones return 307 to /login — that's correct)
- Any sub-agent tasks still running
- Overnight queue items

## Notes
- The real app is `onboarding-system/` (NOT `onboarding-dashboard/`)
- Auth middleware redirects to /login (307) — this is EXPECTED for protected routes
- Public routes: /login, /grand-opening/[id]/invite, /grand-opening/[id]/invite/success
