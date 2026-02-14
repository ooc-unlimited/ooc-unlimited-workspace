# 2026-02-13: Apify MCP + PPTX Skill Setup

## 1. Apify MCP Integration

### What Was Done
- Configured Apify MCP server in `.claude/settings.local.json` using the local stdio transport (`npx @apify/actors-mcp-server`)
- Created `.env` file with `APIFY_TOKEN` placeholder
- The MCP gives Claude Code access to **all 8,000+ Apify Actors** including:
  - YouTube channel scraper
  - LinkedIn profile scraper
  - Website/RAG web browser scraper
  - Instagram, Facebook, Google Maps scrapers
  - Google Search scraper

### To Activate
1. Go to https://console.apify.com/account#/integrations
2. Create/copy your API token
3. Edit `/Users/donna/.openclaw/workspace/.env` and replace `your_apify_token_here` with the real token
4. Also export it in your shell: `export APIFY_TOKEN=apify_api_xxxxx`
5. Restart Claude Code — the MCP server will auto-download and connect

### Usage Examples
Once activated, Claude Code can run commands like:
- "Scrape the YouTube channel @GFIrecruiting"
- "Get LinkedIn profile data for [person]"
- "Scrape competitor website symmetryfinancial.com"
- "Search Google for 'life insurance recruiting companies'"

### Config Location
- MCP config: `.claude/settings.local.json` → `mcpServers.apify`
- API key: `.env` → `APIFY_TOKEN`

---

## 2. PPTX Generator Skill

### What Was Done
- Installed `python-pptx` library (system-level via pip3)
- Created skill at `.claude/skills/pptx-generator/SKILL.md`
- Created `/Users/donna/.openclaw/workspace/output/` directory for generated files

### How to Use
Just ask Claude Code to create a presentation:
- "Create a Grand Opening presentation for the Atlanta office"
- "Make a recruiting deck for licensed agents"
- "Build a competitor analysis presentation comparing GFI vs Symmetry"
- "Generate a training deck on how to use iDecide"

### What It Does
- Generates professional .pptx files using python-pptx
- Uses OOC Unlimited/GFI brand colors (navy + gold) by default
- Creates widescreen 16:9 slides
- Saves to `/Users/donna/.openclaw/workspace/output/`
- Can be opened directly on Mac with `open [filename]`

### Slide Types Available
1. Title slides with branded backgrounds
2. Content slides with bullet points
3. Two-column comparison slides
4. Stats/numbers highlight slides
5. Quote/testimonial slides
6. CTA/closing slides

### Skill Location
`/Users/donna/.openclaw/workspace/.claude/skills/pptx-generator/SKILL.md`
