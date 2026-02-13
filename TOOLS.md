# TOOLS.md - Local Notes

## Gary's Tech Stack

### Ringy (CRM)
- URL: https://app.ringy.com/home/sms
- Login: garycosbyjr@gmail.com
- Password: Start345
- Use: Managing recruited agents, SMS/call campaigns

### PropHog (Lead Source)
- URL: https://agent-recruiting.prophog.ai/leads
- Login: garycosby
- Password: winning
- Use: Finding licensed agents to recruit

### iDecide (Presentation Tool)
- URL: https://login.idecide.com/members/#contacts
- Login: gary@oocunlimited.com
- Password: Start1234$
- Use: Interactive presentations — "GFI" (standard) and "Welcome to GFI" (higher stature prospects)
- **GHL Integration API Creds** (separate from personal login):
  - Install URL: https://iDecide.com/InstallGHL
  - Username: gary@oocunlimited.com
  - Password: Cosby4215

### Tevah (Back Office)
- URL: https://tevahtech.com/
- Login: 3213866527
- Password: Start345
- Agent Code: A2081
- Use: Commission tracking, recruiting metrics, carrier contracts, operations brain
- Tracks: recruits, life licenses, net licenses, total points, points per recruit, net license ratio, cash flow, % recruits with license, revenue per life license, points per license, persistency, chargebacks

### Codex CLI (Coding Agent — "Cody 🔧")
- Installed: `codex` v0.98.0 (global npm)
- API: OpenAI API key in `~/.codex/.env` and `~/.zshrc`
- Use: All coding tasks — run via `codex` command
- **Full auto mode**: `codex --full-auto` (workspace-write + auto-approve)
- **Full access**: `codex --sandbox danger-full-access`
- **No longer read-only** — Gary explicitly unlocked

### QMD (Quick Markdown Search)
- Installed: via `bun install -g https://github.com/tobi/qmd`
- Binary: `/Users/donna/.bun/bin/qmd`
- Index: `~/.cache/qmd/index.sqlite` (157 files, 5 collections)
- Collections: workspace, memory, grand-openings, trading, second-brain
- Use: `qmd search "query"` (BM25), `qmd vsearch "query"` (semantic), `qmd status`
- Created by Tobias Lütke (Shopify CEO)

### Gemini API (Web Search)
- API Key: stored in `~/.zshrc` as `GEMINI_API_KEY`
- Endpoint: `generativelanguage.googleapis.com/v1beta`
- Model: `gemini-2.0-flash` (or latest)
- Use: All web search queries

### Perplexity API (Web Search — Primary)
- API Key: stored in `~/.zshrc` as `PERPLEXITY_API_KEY`
- Endpoint: `api.perplexity.ai/chat/completions`
- Model: `sonar`
- Use: **Primary web search tool** — grounded, cited, token-efficient
- Preferred over Gemini for general web search

### Grok API (Social/X Search)
- API Key: stored in `~/.zshrc` as `XAI_API_KEY`
- Endpoint: `api.x.ai/v1`
- Model: `grok-3`
- Use: All social media / X (Twitter) search queries

### TradingView (Charting & Data)
- URL: https://www.tradingview.com
- Login: gmoney56@aol.com
- Password: Hotboy56$
- Plan: Pro Premium (real-time CME/COMEX/NYMEX data)
- Auth token: stored at `trading/.tv_auth_token` (JWT, expires periodically)
- Real-time feed: `trading/tv-realtime.py` — websocket connection to TradingView
- Permissions: cme-full, cme_mini, comex, comex_mini, cbot, nymex
- Use: NQ1! futures charting, real-time price feed for paper trading

### SiriusXM (Ambiance Music)
- URL: https://player.siriusxm.com
- Login: gmoney56@aol.com
- Password: Hotboy56
- Channel: **Yacht Soul** (Easy yacht-era R&B and soul) — Xtra channel
- Channel URL: /player/channel-xtra/yacht-soul/1a8c7e32-a74d-20a9-9842-63fecb57f97c
- Use: Background ambiance music during Virtual Office Zoom meetings
- Note: Login requires SMS verification code to phone ending in 4215
- Browser profile: openclaw

### Discord (OOC Unlimited Server)
- Server Name: OOC Unlimited
- Guild ID: 1471377225021526071
- Login: 4074934215 / Hotboy56$
- Username: Deebo56
- Created: 2026-02-12
- Text Channels: general, approvals, pipeline, alerts, research, social-drafts, daily-digest, trading
- Agent Direct Lines: donna, milan, amanda, devin, tom
- Voice: War Room
- Key Channel IDs:
  - #general: 1471377225889878028
  - #approvals: 1471377576445349898
  - #pipeline: 1471377580400574475
  - #alerts: 1471377583877787648
  - #research: 1471377587472302112
  - #social-drafts: 1471377590743859242
  - #daily-digest: 1471377593747116157
  - #trading: 1471377597123526747
  - #donna: 1471377600592216064
  - #milan: 1471377604035612828
  - #amanda: 1471377607499972769
  - #devin: 1471377611136565363
  - #tom: 1471377614559248415
  - #webby: 1471664005931077705
  - #austin: 1471703029479637134
  - #doug: 1471703032319180800
  - #chris: 1471703034475319461
  - War Room (voice): 1471377617910235189
- Next: Create Discord bot for agent posting

## Key Context
- Gary recruits **licensed agents** (not unlicensed people) — this is his groove
- ~100 recruited, low stick rate — numbers game but room to improve ratios
- Has never run a tight GFI system
- Self-identified strength: recruiting volume via PropHog + Ringy pipeline

### Granola.ai (Meeting Transcription)
- MCP endpoint: https://mcp.granola.ai/mcp
- Auth: OAuth2 (Bearer token)
- Token file: `.granola-tokens.json` (workspace)
- Client ID: client_01KHAN5HJCPSAJMXHFJXXTRGAD
- Refresh token stored for re-auth
- Account: garycosbyjr@gmail.com
- Tools: query_granola_meetings, list_meetings, get_meetings, get_meeting_transcript
- Token expires every 6 hours — use refresh_token to renew

### GoHighLevel (GHL)
- URL: https://app.gohighlevel.com
- Login: wearegfi@oocunlimited.com
- Password: Start345$
- Use: CRM, pipeline automation, Voice AI, recruiting funnel, white-label for downline

### Twilio
- URL: https://www.twilio.com/console
- Login: garycosbyjr@gmail.com
- Password: Hotboy56$
- Use: SMS/voice provider (may integrate with GHL LC Phone or use directly)

### Google Workspace (Donna's Account)
- Email: wearegfi@oocunlimited.com
- Password: Start345
- Access: Gmail, Calendar, Drive, Docs, Sheets, Meet
- Gary's calendar is shared/visible from this account
- Use: Calendar checks, email, document creation, scheduling
- Browser profile: openclaw (OpenClaw managed browser)
