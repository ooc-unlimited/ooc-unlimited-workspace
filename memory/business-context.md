# Business Context - Systems & Operations

## Tech Stack Details (see TOOLS.md for credentials)
- **Ringy** (CRM): Managing recruited agents, SMS/call campaigns
- **PropHog** (Lead Source): Finding licensed agents to recruit (credits exhausted)
- **iDecide** (Presentations): GFI standard + Welcome to GFI (higher stature)
- **Tevah** (Back Office): Commission tracking, recruiting metrics, operations brain
- **GHL** (Automation): $297 Unlimited, 11-stage pipeline, 12 tags, 7 custom fields
- **garylifeindex.com**: Next.js port 3001, Cloudflare tunnel, password Start345

## GHL Setup Details
- Location ID: `Gy0H1V7ydacMTFYcNz2f`
- Login: wearegfi@oocunlimited.com (Google sign-in)
- 2 calendars: Interview + CE Part 1
- Workflow 1 (New Lead Welcome) = published
- iDecide Follow-Up = draft (trigger wrong)
- Post-ICA = designed, needs trigger
- Gary adds triggers (2 clicks), Donna builds actions

## Pipeline & Recruiting Process
**Current Flow:** PropHog → Ringy → iDecide → Zoom interview → ICA → Onboarding
**Top Objections:** $199 cost, lead source, don't want team, comp too low
**Biggest leak:** After SMS (70 ICA'd, only 14% got calls)

## Onboarding Flow
ICA+$199 → Welcome SMS → "Expect the Pushback" Email → CE Part 1 (Gary books on call) → CE Part 2 → HOT → Field Training → Independent
- Detailed spec: `garys-onboarding-automation-spec.md`
- iDecide = recruiting tool (pre-ICA), NOT post-ICA

## Carriers & Compensation
- **F&G** (IUL/annuity), **Corbridge** (term), **Ethos** (term)
- **North American** blocked by credit
- Comp grid: `gfi-compensation-grid.md`
- 100% payout: F&G IUL, Ameritas WL, Ethos Term

## Marketing & SEO Infrastructure
- 25 marketing skills installed (.claude/skills/)
- Product marketing context: .claude/product-marketing-context.md
- Google Search Console: verified, sitemap submitted (Feb 13)
- SEO audit completed: meta tags, robots.txt, sitemap.xml, Open Graph, schema, canonicals
- Command system: /create-plan, /implement, /analyze-competitor, /market-scan, /recruit-research

## Discord Infrastructure
- **OOC Unlimited Server** (Guild ID: 1471377225021526071)
- 17 channels including agent direct lines
- Key channels: general, pipeline, alerts, research, social-drafts, daily-digest, trading
- Agent channels: donna, milan, amanda, devin, tom, webby, austin, matt, doug, chris
- War Room (voice): 1471377617910235189

## Cron Schedule Pattern
3AM Overnight Build → 4AM Sweat Shop → 7AM Morning Brief → Agent rotations (7:05 Stacy, 7:20 Austin, 7:35 Amanda, 7:50 Webby) → 8AM Stacy Audit → 8:30AM Tom Trading → 9AM Zoom → 2PM Research → 11PM Amanda Social
*15-min gaps between agents to avoid API rate limits*

## Document Index Structure
- **Recruiting:** `garys-recruiting-os.md`, `agent-activation-os.md`, `agent-follow-up-tracker.md`
- **Agents:** `ringy-gfi-agents.md`, `onboarding-pipeline-tracker.md`, `new-agent-automation.md`  
- **Templates:** `expect-the-pushback-email.md`, `onboarding-checklist-printable.md`
- **Trading:** `trading/garys-nq-trading-playbook.md`, `tom-soul.md`, `tom-trading-agent.md`
- **Research:** `second-brain/docs/concepts/the-90-day-gravity-problem.md`

## Hosting & Domain
- garylifeindex.com (Namecheap, expires Dec 14 2026)
- Cloudflare tunnel → localhost:3001
- Mac Mini: M4, 16GB, sudo Start345, sleep disabled
- LaunchAgent auto-starts tunnel and Next.js