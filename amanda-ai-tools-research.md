# Amanda's AI Tools Research — Social Media Factory Stack
## Comprehensive Tool Evaluation for Automated Content Production
*Compiled: February 11, 2026*

---

# 1. AI VIDEO CREATION

## For Short-Form Content (Reels / TikTok / Shorts)

### HeyGen ⭐ RECOMMENDED FOR AVATAR VIDEOS
- **Pricing**: Free (1 credit/mo) → Creator $24/mo (15 credits) → Business $120/mo (30 credits) → Enterprise custom
- **Key Features**: 240+ AI avatars, instant avatar cloning (upload 2min video → get your avatar), lip-sync in 40+ languages, text-to-video, custom avatar creation, brand kits
- **API**: ✅ Yes — full REST API for video generation, avatar creation, template rendering
- **Automation**: ✅ Excellent — API enables fully automated video pipeline
- **Best For**: Talking-head style videos WITHOUT being on camera (avatar speaks for you), personalized outreach videos, multilingual content
- **Faceless**: ✅ Perfect — use stock avatars or create a custom brand avatar

### Synthesia
- **Pricing**: Free (3 min/mo) → Starter $22/mo (10 min) → Creator $67/mo (30 min) → Enterprise custom
- **Key Features**: 240+ avatars, 130+ languages, screen recording + avatar overlay, brand kits, SOC 2 compliant
- **API**: ✅ Yes — enterprise tier, full video generation API
- **Automation**: ✅ Good at enterprise level
- **Best For**: Corporate/training videos, multilingual content, professional brand
- **Faceless**: ✅ Yes via avatars
- **Note**: More enterprise-focused than HeyGen; overkill for social media shorts

### InVideo ⭐ RECOMMENDED FOR QUICK SHORTS
- **Pricing**: Free (watermark) → Business $25/mo → Unlimited $60/mo
- **Key Features**: AI script-to-video (type a prompt → full video with stock footage, music, voiceover), 16M+ stock assets, text-to-video, auto-captions, brand presets, 5000+ templates
- **API**: ❌ No public API
- **Automation**: ⚠️ Limited — browser-based, no API pipeline
- **Best For**: Quick social media videos from text prompts, repurposing blog posts to video
- **Faceless**: ✅ Excellent — stock footage + AI voiceover = fully faceless

### Runway (Gen-3 Alpha)
- **Pricing**: Free (125 credits) → Standard $15/mo (625 credits) → Pro $35/mo (2250 credits) → Unlimited $95/mo
- **Key Features**: Text-to-video (Gen-3), image-to-video, video-to-video style transfer, motion brush, inpainting, green screen removal
- **API**: ✅ Yes — full API for Gen-3 video generation
- **Automation**: ✅ Good — API-driven pipeline possible
- **Best For**: Creative/artistic video generation, B-roll creation, visual effects
- **Faceless**: ✅ Great for generating unique visual content without any human face

### Kling (by Kuaishou)
- **Pricing**: Free tier → Pro ~$8/mo → Premium ~$28/mo
- **Key Features**: Text-to-video up to 2 min (longest in class), image-to-video, excellent motion quality, cinematic outputs
- **API**: ⚠️ Limited — API through third-party integrations
- **Automation**: ⚠️ Moderate
- **Best For**: High-quality cinematic clips, longer-form AI video
- **Faceless**: ✅ Yes

### Pika
- **Pricing**: Free (150 credits) → Standard $10/mo → Pro $35/mo → Unlimited $75/mo
- **Key Features**: Text-to-video, image-to-video, video modification (extend, add elements), lip sync, sound effects
- **API**: ✅ Yes — API available
- **Automation**: ✅ Possible via API
- **Best For**: Quick creative clips, modifying existing videos
- **Faceless**: ✅ Yes

### Higgsfield (Diffuse)
- **Pricing**: Free beta → pricing TBA
- **Key Features**: Social media-native video generation, selfie-to-animation, short-form optimized
- **API**: ❌ Not yet
- **Automation**: ❌ Early stage
- **Best For**: Experimental/creative social media clips
- **Note**: Still in beta — not production-ready for a factory

## 🏆 VIDEO VERDICT
- **Primary**: **HeyGen** — best API, avatar system for faceless talking-head content
- **Secondary**: **InVideo** — fastest script-to-video for quick daily shorts
- **Creative B-roll**: **Runway** — when you need unique visual content via API
- **Budget option**: **Kling** — best bang for buck on raw video quality

---

# 2. AI VOICE / AUDIO

### ElevenLabs ⭐ RECOMMENDED
- **Pricing**: Free (10K chars/mo) → Starter $5/mo (30K) → Creator $22/mo (100K) → Pro $99/mo (500K) → Scale $330/mo (2M) → Enterprise custom
- **Key Features**: Most realistic AI voices available, voice cloning (30 sec sample), 32 languages, voice design (create new voices from description), sound effects, audio isolation, Projects (long-form), dubbing
- **API**: ✅ Excellent — full REST API, streaming, websocket support, voice cloning API
- **Automation**: ✅ Best in class — designed for API-first workflows
- **Best For**: Everything voice — voiceovers, content narration, voice cloning Gary's voice
- **Key Advantage**: Can clone Gary's voice from a 30-second sample → all content sounds like him
- **Startup Grant**: 12 months free for startups (33M characters)

### Murf AI
- **Pricing**: Free (10 min) → Creator $26/mo (24h/yr) → Business $66/mo (96h/yr) → Enterprise custom
- **Key Features**: 200+ voices, 20+ languages, voice cloning, API access, voice changer (upload recording → change voice), video editor integration
- **API**: ✅ Yes — enterprise API available
- **Automation**: ✅ Good via API
- **Best For**: Studio-quality voiceovers, video narration with built-in editor

### PlayHT
- **Pricing**: Free (12.5K chars) → Creator $31.20/mo (300K) → Pro $99/mo (3M) → Enterprise custom
- **Key Features**: Ultra-realistic voices (PlayHT 3.0), voice cloning, 142+ languages, API streaming, custom pronunciations
- **API**: ✅ Yes — full API with streaming
- **Automation**: ✅ Good
- **Best For**: High-volume voice generation, multilingual content

### WellSaid Labs
- **Pricing**: Individual $44/mo → Team $99/seat/mo → Enterprise custom
- **Key Features**: 120+ voices, brand voice customization, pronunciation studio, team collaboration
- **API**: ✅ Enterprise API
- **Automation**: ⚠️ Enterprise only
- **Best For**: Corporate/brand-consistent voice, team environments
- **Note**: Most expensive per-seat, less suited for solo automation

## 🏆 VOICE VERDICT
- **Primary**: **ElevenLabs** — unmatched quality, best API, voice cloning, most affordable
- **Backup**: **PlayHT** — if ElevenLabs ever has issues, solid alternative
- **Skip**: WellSaid (too expensive for what you get), Murf (good but ElevenLabs is better)

---

# 3. AI IMAGE GENERATION

### Midjourney ⭐ RECOMMENDED FOR QUALITY
- **Pricing**: Basic $10/mo (200 images) → Standard $30/mo (900) → Pro $60/mo (1800) → Mega $120/mo (3600)
- **Key Features**: Best aesthetic quality, consistent style, web editor, style references, character references (keep same person across images), pan/zoom, custom styles
- **API**: ⚠️ No official API — but accessible via Discord bot or third-party wrappers
- **Automation**: ⚠️ Possible via Discord bot automation or third-party APIs (GoAPI, etc.)
- **Best For**: Highest quality thumbnails, brand graphics, lifestyle imagery
- **Faceless**: ✅ Can generate faceless branded imagery consistently

### DALL-E 3 (OpenAI / ChatGPT)
- **Pricing**: Included in ChatGPT Plus ($20/mo) → API: $0.040-0.080 per image
- **Key Features**: Best text rendering in images, integrated with ChatGPT for prompt refinement, native image editing, API access
- **API**: ✅ Yes — OpenAI Images API, very easy to integrate
- **Automation**: ✅ Excellent — straightforward API, cheapest per-image
- **Best For**: Text-heavy graphics (quotes, stats), quick thumbnails, API automation
- **Key Advantage**: Best at rendering text in images — great for quote graphics and stat cards

### Flux (by Black Forest Labs)
- **Pricing**: Free via ComfyUI → API via Replicate/Together (~$0.003-0.05 per image)
- **Key Features**: Open-source, multiple model sizes (Schnell/Dev/Pro), excellent prompt following, fast generation, good at text rendering
- **API**: ✅ Yes — via Replicate, Together AI, FAL, BFL API
- **Automation**: ✅ Excellent — cheapest option for high-volume automated generation
- **Best For**: High-volume automated image generation at lowest cost

### Leonardo AI
- **Pricing**: Free (150 tokens/day) → Apprentice $12/mo → Artisan $30/mo → Maestro $60/mo
- **Key Features**: Real-time canvas, image guidance (ControlNet), motion generation, consistent character via Phoenix model, texture generation, prompt enhance
- **API**: ✅ Yes — full API available
- **Automation**: ✅ Good API support
- **Best For**: Versatile image generation with good control, real-time editing

## 🏆 IMAGE VERDICT
- **Primary**: **DALL-E 3 via API** — best text rendering, easiest API, cheapest for automation
- **Quality**: **Midjourney** — when you need premium brand imagery (use via automation wrapper)
- **Volume**: **Flux** — cheapest per-image for high-volume automated generation
- **Skip for now**: Leonardo (good but redundant with DALL-E + Midjourney)

---

# 4. FACELESS CONTENT TOOLS & STRATEGY

### Complete Faceless Content Pipeline

| Step | Tool | Purpose |
|------|------|---------|
| Script | Claude/GPT | Write hooks, scripts, captions |
| Voice | ElevenLabs | Clone Gary's voice or use AI voice |
| Visuals | Runway + DALL-E | Generate B-roll, thumbnails |
| Avatar | HeyGen | Optional: AI avatar as "host" |
| Assembly | InVideo or CapCut | Combine voice + visuals |
| Captions | CapCut / Opus Clip | Auto-subtitles for shorts |
| Schedule | SocialBee / Metricool | Post to all platforms |

### Dedicated Faceless Tools

**Pictory**
- **Pricing**: Starter $25/mo → Pro $49/mo → Teams $99/mo
- **Features**: Blog/script to video, AI voiceover, stock footage matching, auto-captions
- **API**: ❌ No
- **Best For**: Turning scripts/articles into faceless video content quickly

**Opus Clip** ⭐
- **Pricing**: Free (60 min/mo) → Starter $19/mo → Growth $49/mo → Pro $149/mo
- **Features**: Long video → short clips (AI picks best moments), auto-captions with animation, virality score, B-roll insertion, multi-platform export
- **API**: ✅ Yes
- **Best For**: Repurposing any long content into viral short-form clips

**CapCut (by ByteDance)**
- **Pricing**: Free → Pro $9.99/mo
- **Features**: Auto-captions (best animated captions), templates, effects, direct TikTok integration, AI script-to-video
- **API**: ❌ No
- **Best For**: Final editing and caption styling for all short-form content

**Canva**
- **Pricing**: Free → Pro $15/mo → Teams $10/person/mo
- **Features**: Massive template library, brand kits, Magic Studio (AI tools), video editing, social media resize, content planner
- **API**: ⚠️ Limited (Connect API for apps)
- **Best For**: Graphics, carousels, thumbnails, brand-consistent visual content

### Faceless Content Formats That Work
1. **Stock footage + voiceover** — Motivational/educational content
2. **AI avatar host** — HeyGen avatar delivers content "on camera"
3. **Screen recordings + narration** — Tutorial/how-to content
4. **Text animation + music** — Quote/stat cards with motion
5. **AI-generated visuals + narration** — Runway/DALL-E scenes with ElevenLabs voice
6. **Carousel posts** — Static image sequences (Canva/DALL-E)

---

# 5. SOCIAL MEDIA SCHEDULING & AUTOMATION

### For Managing 50+ Accounts (The Social Media Factory)

### SocialBee ⭐ RECOMMENDED
- **Pricing**: Bootstrap $29/mo (5 profiles) → Accelerate $49/mo (10 profiles) → Pro $99/mo (25 profiles) → Agency custom
- **Key Features**: Content categories (evergreen recycling), AI post generator, Canva integration, RSS automation, bulk scheduling, approval workflows, white-label reports
- **API**: ✅ Yes — API for automation
- **Automation**: ✅ Content categories auto-rotate posts, evergreen recycling
- **Best For**: Content categorization system (pillars auto-rotate), agency scaling
- **Multi-Account**: ✅ Up to 25 on Pro, custom for agency tier
- **Why**: Category-based posting is PERFECT for the factory model — set up content pillars once, they auto-rotate forever

### Metricool ⭐ BEST VALUE
- **Pricing**: Free (1 brand) → Starter $22/mo (5 brands) → Advanced $54/mo (15 brands) → Custom for agencies
- **Key Features**: Analytics powerhouse, competitor analysis, hashtag tracker, auto-scheduling (AI best time), link-in-bio, ad analytics, report builder
- **API**: ⚠️ Limited API
- **Automation**: ✅ Smart scheduling (AI picks best times), auto-lists
- **Best For**: Analytics-driven scheduling, competitor monitoring
- **Multi-Account**: ✅ Up to 15 brands on Advanced
- **Why**: Best analytics per dollar, great for tracking recruit performance

### SocialPilot
- **Pricing**: Professional $30/mo (10 accounts) → Small Team $50/mo (20) → Agency $100/mo (30) → Agency+ $200/mo (50+)
- **Key Features**: Bulk scheduling (500 posts), content curation, white-label dashboard, client management, team collaboration, RSS feeds
- **API**: ✅ Yes
- **Automation**: ✅ Bulk scheduling, RSS auto-post
- **Best For**: Agencies managing many clients at scale
- **Multi-Account**: ✅ Up to 50+ on Agency+
- **Why**: Most accounts per dollar at scale

### Sendible
- **Pricing**: Creator $29/mo (6 profiles) → Traction $89/mo (24) → White Label $240/mo (60) → Custom
- **Key Features**: White-label (full rebrand), CRM integration, content library, smart compose, priority inbox, automated reporting
- **API**: ✅ Yes
- **Automation**: ✅ Good — smart queues, automated reports
- **Best For**: White-label agency solution
- **Multi-Account**: ✅ Up to 60 on White Label

### Buffer
- **Pricing**: Free (3 channels) → Essentials $6/channel/mo → Team $12/channel/mo → Agency custom
- **Key Features**: Clean UI, AI assistant, landing pages, start page, approval flows, engagement tools
- **API**: ✅ Yes
- **Automation**: ⚠️ Basic — queue-based
- **Best For**: Simple scheduling for small teams
- **Multi-Account**: ⚠️ Per-channel pricing gets expensive at scale (50 channels = $300-600/mo)

### Hootsuite
- **Pricing**: Professional $99/mo (10 accounts) → Team $249/mo (20) → Enterprise custom
- **Key Features**: Most integrations, AI writer, social listening, ad management, analytics, OwlyWriter AI
- **API**: ✅ Yes
- **Automation**: ✅ Good — auto-scheduling, streams
- **Best For**: Large teams needing social listening + ads
- **Multi-Account**: ✅ Good but expensive
- **Note**: Most expensive option, overkill for this use case

### Later
- **Pricing**: Starter $25/mo (1 social set) → Growth $45/mo (3 sets) → Advanced $80/mo (6 sets) → Agency $200/mo (15 sets)
- **Key Features**: Visual planner (Instagram-first), Linkin.bio, AI caption writer, best time to post, UGC collection, influencer analytics
- **API**: ❌ No public API
- **Automation**: ⚠️ Limited — visual scheduling focused
- **Best For**: Instagram-centric brands
- **Multi-Account**: ⚠️ Limited sets per plan

## 🏆 SCHEDULING VERDICT
- **Primary**: **SocialBee** — content category system is perfect for factory model
- **Analytics**: **Metricool** — best analytics, use alongside SocialBee
- **Scale (50+)**: **SocialPilot Agency+** — most accounts per dollar when scaling to all recruits
- **Skip**: Hootsuite (too expensive), Buffer (too simple), Later (Instagram-only focus)

---

# 6. AI CAPTION / COPY TOOLS

### Claude (Anthropic) ⭐ ALREADY AVAILABLE
- **Pricing**: Included in OpenClaw stack
- **Best For**: Writing captions, hooks, scripts, content calendars — Amanda IS the copy tool
- **Automation**: ✅ Built into the workflow

### Copy.ai
- **Pricing**: Free (2000 words/mo) → Starter $49/mo → Advanced $249/mo → Enterprise custom
- **Features**: 90+ templates, social media posts, ads, product descriptions, workflow automation, brand voice
- **API**: ✅ Yes — workflow API
- **Note**: Redundant since Amanda (Claude) handles all copy

### Jasper
- **Pricing**: Creator $49/mo → Pro $69/mo → Business custom
- **Features**: Brand voice, templates, SEO optimization, art generation, campaigns, team collaboration
- **API**: ✅ Yes
- **Note**: Also redundant with Claude — more expensive, less capable

### Hashtag Tools
- **Flick**: $14/mo — AI hashtag research, scheduling, analytics, hashtag collections
- **RiteTag**: Free/paid — instant hashtag suggestions based on real-time engagement data
- **Hashtagify**: $29/mo — trending hashtags, competitor hashtag tracking

## 🏆 COPY VERDICT
- **Primary**: **Claude/Amanda** — already the best copy engine, no additional tool needed
- **Hashtags**: **Flick** — $14/mo for data-driven hashtag optimization
- **Skip**: Jasper, Copy.ai (redundant with Claude)

---

# 7. CONTENT REPURPOSING

### Opus Clip ⭐ RECOMMENDED
- **Pricing**: Free (60 min/mo) → Starter $19/mo → Growth $49/mo → Pro $149/mo
- **Key Features**: AI clips long video → viral shorts, virality score, auto-captions with animation, B-roll auto-insert, multi-platform export (9:16, 1:1, 16:9), brand templates
- **API**: ✅ Yes
- **Automation**: ✅ Good — upload → auto-clip → export
- **Best For**: Any long content (Zoom calls, YouTube, podcasts) → short-form clips

### Repurpose.io
- **Pricing**: Content Marketer $25/mo → Agency $125/mo
- **Key Features**: Auto-publish across platforms, workflow automations (if this then that), supports TikTok/YouTube/Instagram/Facebook/LinkedIn/Twitter/Podcast platforms, auto-resize
- **API**: ⚠️ Webhook-based automation
- **Automation**: ✅ Excellent — fully automated cross-posting pipeline
- **Best For**: Automated distribution (post on TikTok → auto-repurpose to Shorts, Reels, etc.)

### Munch
- **Pricing**: $49/mo (Creator) → $116/mo (Business) → Custom
- **Key Features**: AI-driven clip extraction, trend analysis, keyword detection, social insights, multi-platform formatting
- **API**: ❌ No
- **Automation**: ⚠️ Manual upload required
- **Best For**: Smart clip selection from long content

### Castmagic
- **Pricing**: Starter $23/mo → Pro $49/mo → Teams $99/mo
- **Key Features**: Audio/video → transcripts, show notes, social posts, email drafts, quotes, clips — all from one upload
- **API**: ✅ Yes
- **Automation**: ✅ Good — one upload generates 40+ content assets
- **Best For**: Podcast/meeting → full content suite

## 🏆 REPURPOSING VERDICT
- **Primary**: **Opus Clip** — best at creating viral short clips from long content
- **Distribution**: **Repurpose.io** — auto-cross-post everywhere
- **From Audio**: **Castmagic** — if Gary starts a podcast
- **Skip**: Munch (Opus Clip does it better)

---

# 8. RECOMMENDED STACK — "THE SOCIAL MEDIA FACTORY"

## Core Stack (Monthly Cost: ~$200-300)

| Category | Tool | Monthly Cost | Why |
|----------|------|-------------|-----|
| **Voice** | ElevenLabs Pro | $99/mo | Clone Gary's voice, API automation |
| **Video** | HeyGen Creator | $24/mo | Avatar videos, API-driven |
| **Images** | DALL-E 3 API | ~$20/mo (usage) | Text rendering, easy API |
| **Scheduling** | SocialBee Pro | $99/mo | Content categories, 25 profiles |
| **Repurposing** | Opus Clip Growth | $49/mo | Long → short clips |
| **Captions** | CapCut Pro | $10/mo | Best animated captions |
| **Copy** | Claude (Amanda) | Included | All writing/strategy |
| **Hashtags** | Flick | $14/mo | Data-driven optimization |

**Total**: ~$315/mo for a complete automated content factory

## Scale Stack (When managing 50+ recruit accounts)

Add:
- **SocialPilot Agency+** ($200/mo) — replaces SocialBee for 50+ account management
- **Repurpose.io Agency** ($125/mo) — automated cross-platform distribution
- **Midjourney Pro** ($60/mo) — premium brand imagery

**Scale Total**: ~$600/mo for full factory at scale

---

*This research should be reviewed quarterly as AI tools evolve rapidly. Last updated: February 11, 2026.*
