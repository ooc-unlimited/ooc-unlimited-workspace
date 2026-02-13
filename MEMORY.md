# MEMORY.md — Donna's Long-Term Memory

## ⚠️ CRITICAL RULES (read first — primacy bias)
- **Gary's #1 goal**: $556K cash flow by May 23, 2026. Floor: $165K.
- **Key gap**: Closing. Gary recruits great but must close his own clients (stop matching up).
- **DC's minimums**: 2 directs + 10K pts/mo = $6K/mo = $72K/yr = Jennifer retired.
- **RITA always**: Recruiting Is The Answer.
- **Gary gave blanket implementation authority** — build it, don't ask permission.
- **Never mix trading with GFI business**. Separate project, separate folder.
- **Sub-agent cost rule**: Use cheaper models for research/content spawns. Opus for strategy only.
- **Plan before build**: Any build >100 lines gets a spec document first.
- **Review after build**: Spawn fresh reviewer agent after significant builds.

## Who I Am
- **Donna ⚡** — Chief of Staff to Gary Cosby. Direct, competent, slightly dry. Born 2026-02-07.

## Who Gary Is
- Gary Cosby, 43, Orlando FL. MD at GFI. Agent Code A2081. Upline: Launa Da Roza.
- Wife Jennifer (Canadian, ~$72K income, every dime needed). Kids: Joli (2016), Levin (2020).
- Father deceased (pancreatic cancer, no life insurance — core motivator).
- Background: 23yr Best Buy → fired → $100K debt → insurance via ZipRecruiter → now MD.
- Telegram: @Gary_Cosby (id: 1056863555)

## 2026 Goals (Brain Dump — Feb 12)
- $556K by birthday (May 23). Floor: $165K.
- Recruit licensed AND non-licensed → sell policy → 3 referrals → recruit 1 → repeat
- Double-digit → triple-digit monthly recruiting (best month: 7-8)
- Delegate within 1 month. Trainer problem unsolved (no override benefit for downline trainers).
- Starting from $0 cash flow.
- DC's plan: 30 recruits/yr, 6 solid doing minimums = $180K, EMD by June 30.
- Carriers: F&G (IUL/annuity), Corbridge (term), Ethos (term). North American blocked by credit.
- Goals file: `garys-goals.md` | DC session: `memory/dajuan-business-plan-dec21.md`

## Team Roster
- **Donna** ⚡ Chief of Staff | **Stacy** 📋 Ops Manager | **Milan** 🎯 Zoom EA
- **Tom** 📈 Trading (NQ, Discord only) | **Amanda** 📱 Social Media | **Cody** 🔧 Coding
- **Webby** 🎨 Web Design | **Austin** 🧮 Sales Lead (final product decision, Gary picks carrier)
- **Doug** 📈 IUL Specialist → Austin | **Chris** 🛡️ Whole Life Specialist → Austin
- **RITA** 🎯 "Recruiting Is The Answer" | **Papa Kapp** 📚 Brian Carruthers (GFI only, never trading)

## Pipeline & Recruiting
- Recruits licensed agents via PropHog (credits exhausted) + Ringy SMS drip
- Pipeline: PropHog → Ringy → iDecide → Zoom interview → ICA → Onboarding
- ~100 recruited lifetime, low stick rate (~5-10%). Biggest leak: after SMS.
- 70 ICA'd agents in Ringy, only 14% got a phone call.
- Top objections: $199 cost, lead source, don't want team, comp too low.

## Onboarding Flow
ICA+$199 → Welcome SMS → "Expect the Pushback" Email → CE Part 1 (Gary books on call) → CE Part 2 → HOT → Field Training → Independent
- Detailed spec: `garys-onboarding-automation-spec.md`
- iDecide = recruiting tool (pre-ICA), NOT post-ICA

## GHL Setup
- Login: wearegfi@oocunlimited.com (Google sign-in). $297 Unlimited. Location: `Gy0H1V7ydacMTFYcNz2f`
- 11-stage pipeline built. 12 tags, 7 custom fields, 2 calendars (Interview + CE Part 1).
- Workflow 1 (New Lead Welcome) = published. iDecide Follow-Up = draft (trigger wrong). Post-ICA = designed, needs trigger.
- Gary adds triggers (2 clicks), Donna builds actions. No Voice AI. No browser during overnight builds.
- Comp grid: `gfi-compensation-grid.md` (100% payout: F&G IUL, Ameritas WL, Ethos Term)

## Tech Stack (details in TOOLS.md)
- Ringy, PropHog, iDecide, Tevah, GHL, Codex CLI, Gemini/Grok/Perplexity APIs
- garylifeindex.com: Next.js port 3001, Cloudflare tunnel, password Start345
- Discord: OOC Unlimited Bot, 17 channels + webhooks
- Ollama: llama3.1:8b + phi3:mini (Sweat Shop 4-8AM only)
- mlx_whisper: local transcription on M4
- QMD: markdown search (5 collections, 157 files)

## Cron Schedule
3AM Overnight Build → 4AM Sweat Shop → 7AM Morning Brief → 7:05-7:20 Agent Huddles (Stacy/Austin/Amanda/Webby post to own channel + #general, with last30days research) → 8AM Stacy Audit + Cleanup → 8:30AM Tom Trading → 9AM Zoom → 2PM Research Report → 11PM Amanda Social

## Key Decisions (Feb 12)
- Trading removed from website → Tom's Discord only
- OOC Unlimited is the brand, not GFI (logo internal only)
- Sub-agent Webby 🎨 for web design. Sales dept: Austin/Doug/Chris.
- /join page mirrors makegfi.com with OOC branding (dark royal purple)
- 4-step web design: Inspiration → Build → Refine → Deploy
- All 6 /join videos are Adilo embeds. Thumbnails + play overlay > raw iframes.

## Documents Index
Recruiting: `garys-recruiting-os.md`, `agent-activation-os.md`, `agent-follow-up-tracker.md`
Agents: `ringy-gfi-agents.md`, `onboarding-pipeline-tracker.md`, `new-agent-automation.md`
Templates: `expect-the-pushback-email.md`, `expect-the-pushback-day1-handout.md`, `onboarding-checklist-printable.md`
Trading: `trading/garys-nq-trading-playbook.md`, `tom-soul.md`, `tom-trading-agent.md`
Research: `second-brain/docs/concepts/the-90-day-gravity-problem.md`
Improvement plans: `memory/webby-improvement-plan.md`, `memory/openclaw-6-usecases-improvement-plan.md`, `memory/claude-code-course-improvement-plan.md`

## Hosting & Domain
- garylifeindex.com (Namecheap, expires Dec 14 2026)
- Cloudflare tunnel → localhost:3001. LaunchAgent auto-starts.
- Mac Mini: M4, 16GB, sudo Start345, sleep disabled.
