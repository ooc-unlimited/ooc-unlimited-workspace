# Last 30 Days Research: Discord Bots (Feb 2026)

## Topic
Discord bots — best practices for building Discord bots in 2026, discord.js vs other frameworks, Discord API changes, automation trends, business operations, AI Discord bots.

---

## What's Happening Right Now

### Discord Developer News — February 2026
- Discord posted official developer news for Feb 2026 on r/discordapp
- New tutorials available: User-Installable Apps, Hosting on Cloudflare Workers, Upgrading to Application Commands
- Monetization APIs now stable: SKUs, App Subscriptions, One-Time Purchases, IAP for Activities
- Lobby resources added (likely for game-related bots)
- Soundboard and Poll APIs fully available

### discord.js Remains Dominant
- **26.6K GitHub stars**, 8,665+ commits, active development
- discord.js guide covers: slash commands, components, embeds, canvas, reactions, sharding, databases (Sequelize, Keyv)
- v14+ is the current stable — built around slash commands and interactions API
- Monorepo structure with separate packages for modularity
- Community consensus on Reddit (r/discordapp, r/Discord_Bots): discord.js is the go-to for JS/TS bots

### Framework Landscape
| Framework | Language | Stars | Best For |
|-----------|----------|-------|----------|
| discord.js | JavaScript/TypeScript | 26.6K | Most versatile, best docs, largest community |
| discord.py (Pycord/Nextcord forks) | Python | ~10K combined | Python devs, AI integrations |
| Serenity | Rust | ~5K | Performance-critical bots |
| JDA | Java/Kotlin | ~4K | Enterprise/JVM shops |
| Eris | JavaScript | ~1.5K | Lightweight alternative to discord.js |
| Discordeno | TypeScript/Deno | ~1K | Deno ecosystem |

**Verdict:** discord.js is the clear winner for 2026. Best documentation, largest community, most tutorials, fastest updates when Discord changes API.

### AI Discord Bots — Hot Topic
- Multiple Reddit threads about integrating LLMs (GPT, Claude, etc.) into Discord bots
- Key concerns: API costs, rate limiting, data privacy
- Popular patterns:
  - AI moderation bots (auto-detect toxic content)
  - Conversational AI bots (per-channel personality)
  - AI-assisted customer support in business servers
  - Trading/forex bots with ML integration (r/Discord_Bots)
- Ticketing bots with AI triage getting traction

### Discord for Business Operations
- Teams using Discord as an internal ops hub (alternative to Slack)
- Bot-driven workflows: task tracking, CRM integration, alerts pipeline
- Ticketing systems for customer support
- Channel-based automation: auto-routing messages, scheduled posts, digest generation
- Cost advantage over Slack for small teams

### Automation Trends
- Cross-platform integration (Discord ↔ CRM, social media, email)
- Webhook-based architectures for real-time alerts
- Scheduled task bots (cron-like functionality)
- Multi-agent bot architectures: one bot token, multiple "personalities" per channel
- Auto-moderation using Discord's built-in AutoMod + custom bot logic

---

## Discord API — Key Technical Details

### Permissions for Common Bot Operations

**For Gary's OOC Unlimited bot needs:**

| Operation | Permission | Bit Value |
|-----------|-----------|-----------|
| Create channels | MANAGE_CHANNELS | 1 << 4 (0x10) |
| Post messages | SEND_MESSAGES | 1 << 11 (0x800) |
| Read messages | VIEW_CHANNEL + READ_MESSAGE_HISTORY | (1 << 10) + (1 << 16) |
| Manage roles | MANAGE_ROLES | 1 << 28 |
| Add reactions | ADD_REACTIONS | 1 << 6 |
| Embed links | EMBED_LINKS | 1 << 14 |
| Manage messages (delete) | MANAGE_MESSAGES | 1 << 13 |
| Use slash commands | USE_APPLICATION_COMMANDS | 1 << 31 |
| Manage webhooks | MANAGE_WEBHOOKS | 1 << 29 |
| Send polls | SEND_POLLS | 1 << 49 |

**Combined permission integer for OOC bot:**
All of the above OR'd together = `0x20010042C50` (approximate — use Discord's Permission Calculator)

### Slash Commands vs Message Commands
- **Slash commands are now the standard** — Discord deprecated message content intent for unverified bots
- Message content requires privileged intent (must be approved for bots in 100+ servers)
- Slash commands: auto-complete, validation, discoverability, built-in help
- Message commands: more flexible, legacy, requires MESSAGE_CONTENT intent
- **Recommendation: Use slash commands exclusively for new bots**

### Multi-Agent Bot Architecture (One Bot, Multiple Personalities)
Best approach for Gary's use case (Donna, Milan, Amanda, Devin, Tom posting to their channels):

**Pattern: Single bot with channel-based personality routing**
```
1. One Discord application / one bot token
2. Bot listens to events across all channels
3. When posting to #donna → use Donna's avatar/name via webhook
4. When posting to #milan → use Milan's avatar/name via webhook
5. Each "agent" has its own webhook per channel
```

**Why webhooks for multi-personality:**
- Webhooks can have custom username and avatar per message
- No need for multiple bot accounts
- Each agent "looks" like a different user
- Bot manages all webhooks programmatically

**Alternative: Multiple bot accounts**
- More complex, requires multiple tokens
- Better isolation but harder to manage
- Not recommended for <10 agents

---

## Key Patterns from Research

1. **Slash commands are mandatory** — message content intent is privileged; new bots should be 100% slash commands
2. **Webhooks for multi-personality** — single bot token + webhooks per channel = each agent has unique identity
3. **AI integration is mainstream** — LLM-powered bots for moderation, support, and conversation are the norm in 2026
4. **Discord for business ops** — small teams prefer Discord over Slack for cost and community feel
5. **discord.js dominates** — 26.6K stars, best docs, fastest API coverage updates

---

## Sources
- r/discordapp: Discord Developer News Feb 2026, bot coding threads, auto-delete discussions
- r/Discord_Bots: ticketing bots, forex/ML bots, bot publishing checklists, database setup
- Discord Developer Docs: Permissions reference, tutorials, monetization APIs
- discord.js GitHub: 26.6K stars, monorepo structure, active development
- discord.js Guide: Setup tutorials, slash commands, components, sharding

---

*Research compiled: 2026-02-12*
