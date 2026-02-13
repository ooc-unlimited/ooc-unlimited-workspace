# Claude Code Course — Improvement Plan for OOC Setup

Source: "Claude Code Full Beginner Course: Learn Agents In 2026" by Nick Seraph (4hr 10min)
Video: https://www.youtube.com/watch?v=QoQBzR1NIqI

## Course Topics Covered
1. Setup & IDE (VS Code, Antigravity)
2. CLAUDE.md / project brain — steering the ship
3. .claude directory (settings, rules, agents, skills)
4. Design methodology (screenshot loop, voice transcript, 21st.dev components)
5. Plan mode — blueprint before building
6. Permissions modes (ask, auto-accept, bypass)
7. Sub-agents (research, reviewer, QA/testing)
8. Skills (custom slash commands → automated workflows)
9. Hooks (custom scripts before/after tool calls)
10. MCP (Model Context Protocol) — email managers, bookkeepers, data tools
11. Chrome DevTools integration — scraping without APIs
12. Agent teams — delegation from parent to child agents
13. Git worktrees — parallel sessions without conflicts
14. Scaling & deployment (Netlify, Vercel, webhooks, GitHub Actions)
15. Context management — the #1 bottleneck

## What Applies to Us (OpenClaw ≠ Claude Code, but concepts transfer)

### Already Doing Well ✅
- **Project brain / CLAUDE.md equivalent**: Our AGENTS.md, SOUL.md, MEMORY.md system is more sophisticated than what most Claude Code users have
- **Sub-agents**: We have 9 agents (Donna, Stacy, Milan, Tom, Amanda, Cody, Webby, Austin + team). OpenClaw's sessions_spawn is our sub-agent system.
- **Memory system**: MEMORY.md + daily files + QMD search — exceeds the basic memory.md approach in Claude Code
- **Skills**: OpenClaw has its own skill system (last30days, sag, weather, etc.)
- **Design methodology**: Already using screenshot-loop approach (makegfi.com → /join page) and 21st.dev component strategy per Webby's improvement plan

### Gaps & Improvements 🔧

#### 1. Context Management (HIGH PRIORITY)
**Course insight**: Context is the #1 bottleneck. Keep CLAUDE.md under 500 lines. Primacy bias = put critical rules at top. Periodically prune.
**Our gap**: MEMORY.md is already large and growing. AGENTS.md is hefty. Session summaries can bloat.
**Action**: 
- Audit MEMORY.md — prune stale entries, compress redundant sections
- Move detailed reference data (comp grid, team roster, etc.) to separate files, only reference from MEMORY.md
- Put most critical rules/context at TOP of AGENTS.md (primacy bias)

#### 2. Plan Mode Before Complex Builds (MEDIUM)
**Course insight**: "A minute of planning saves 10 minutes of building." Always plan before building complex features.
**Our gap**: We sometimes jump straight into building (especially sub-agents doing batch work). Webby builds without a formal spec step.
**Action**:
- For any build over 100 lines of code: create a spec/plan document first
- Have Webby use plan-then-build workflow: spec → approve → build → review
- Template: `specs/[feature-name]-spec.md` before any major build

#### 3. Sub-Agent Cost Optimization (MEDIUM)
**Course insight**: Use cheaper models (Sonnet/Haiku) for research sub-agents. Parent agent stays on Opus. Only summaries flow back to parent — 50x cost savings.
**Our gap**: All our spawned sub-agents use the default model (Opus). Research tasks, content generation, and simple builds could use cheaper models.
**Action**:
- Use `model` parameter in sessions_spawn for non-critical tasks
- Research/content tasks → use sonnet or cheaper model
- Complex builds/strategy → keep Opus
- Track cost savings over time

#### 4. Reviewer Agent Pattern (NEW)
**Course insight**: After any build, spawn a fresh agent with ZERO context to review the code. Fresh eyes catch what biased builders miss.
**Our gap**: We don't do post-build code review. Webby builds and ships. Cody builds and ships.
**Action**:
- After any significant build (>50 lines), spawn a review sub-agent
- Review agent gets: the code files + a prompt "review this with zero context, find issues"
- Catches bugs, security issues, and design problems before they go live
- Especially important for garylifeindex.com (public-facing)

#### 5. Chrome DevTools / Browser Scraping Skills (LOW)
**Course insight**: Chrome DevTools integration lets you scrape data from sites without APIs. "Very slept on."
**Our gap**: We use OpenClaw's browser tool for GHL but not systematically for data collection.
**Action**: 
- Could use browser snapshots to monitor competitor recruiting pages
- Could scrape PropHog data without API credits
- Low priority — nice to have, not urgent

#### 6. Hooks (LOW)
**Course insight**: Custom scripts that fire before/after every tool call. Used for notifications, logging, custom sounds.
**Our gap**: OpenClaw doesn't use Claude Code hooks, but has its own event system (cron, heartbeat).
**Action**: No direct action needed — our cron/heartbeat system covers this use case.

#### 7. Git Worktrees for Parallel Work (LOW)
**Course insight**: Spin up parallel coding sessions on separate git branches without conflicts.
**Our gap**: We do sequential builds, not parallel. When Webby and Cody both need to edit the same project, they conflict.
**Action**: 
- For future parallel builds, use git worktrees to avoid merge conflicts
- Not urgent — sequential works fine for now

## Priority Implementation Order

### This Week
1. **Audit & prune MEMORY.md** — compress, move detailed data to reference files
2. **Set model overrides for sub-agent spawns** — cheaper models for research/content tasks
3. **Add spec-first workflow for Webby** — plan before build

### Next Week  
4. **Implement reviewer agent pattern** — post-build code review for garylifeindex.com
5. **Reorganize AGENTS.md** — critical rules at top (primacy bias)

### Later
6. Chrome DevTools scraping for competitor research
7. Git worktrees if parallel builds become needed

## Key Quote from Course
"A minute of planning saves you 10 minutes of building. Work in the theoretical plan space, not the actual build space."
