# Marketing Skills for Claude Code — Installed 2026-02-13

**Source:** https://github.com/coreyhaines31/marketingskills (by Corey Haines)
**Website:** https://marketing-skills.com
**Installed to:** `.claude/skills/` (25 skills)
**Method:** Git clone → copy to `.claude/skills/`

## All 25 Skills

### Conversion Optimization (CRO)
| Skill | What It Does | Invoke |
|-------|-------------|--------|
| **page-cro** | Optimize any marketing page for conversions (homepage, landing, pricing, feature) | "optimize this page for conversions" or `/page-cro` |
| **signup-flow-cro** | Optimize signup/registration/trial activation flows | "reduce signup dropoff" or `/signup-flow-cro` |
| **onboarding-cro** | Post-signup activation, first-run experience, time-to-value | "improve onboarding flow" or `/onboarding-cro` |
| **form-cro** | Optimize lead capture, contact, demo request forms (not signup) | "optimize this form" or `/form-cro` |
| **popup-cro** | Create/optimize popups, modals, exit-intent overlays | "create exit intent popup" or `/popup-cro` |
| **paywall-upgrade-cro** | In-app paywalls, upgrade screens, upsell modals, feature gates | "optimize upgrade screen" or `/paywall-upgrade-cro` |
| **ab-test-setup** | Plan, design, implement A/B tests and experiments | "set up an A/B test" or `/ab-test-setup` |

### Content & Copy
| Skill | What It Does | Invoke |
|-------|-------------|--------|
| **copywriting** | Write/rewrite marketing copy for any page | "write homepage copy" or `/copywriting` |
| **copy-editing** | Edit, review, polish existing marketing copy (multi-pass system) | "edit this copy" or `/copy-editing` |
| **email-sequence** | Create drip campaigns, welcome sequences, lifecycle emails | "create a welcome email sequence" or `/email-sequence` |
| **social-content** | Social media content for LinkedIn, Twitter/X, Instagram, TikTok | "write a LinkedIn post" or `/social-content` |
| **content-strategy** | Plan what content to create, topic clusters, blog strategy | "plan my content strategy" or `/content-strategy` |

### SEO & Discovery
| Skill | What It Does | Invoke |
|-------|-------------|--------|
| **seo-audit** | Audit technical SEO, on-page SEO, diagnose ranking issues | "audit my site's SEO" or `/seo-audit` |
| **programmatic-seo** | Create SEO pages at scale (templates + data: location pages, directories) | "build programmatic SEO pages" or `/programmatic-seo` |
| **schema-markup** | Add/fix JSON-LD structured data, rich snippets | "add schema markup" or `/schema-markup` |
| **competitor-alternatives** | Create "vs" and "alternative to" comparison pages | "create a competitor comparison page" or `/competitor-alternatives` |

### Growth & Strategy
| Skill | What It Does | Invoke |
|-------|-------------|--------|
| **pricing-strategy** | Pricing tiers, packaging, freemium vs trial, value metrics | "help with pricing strategy" or `/pricing-strategy` |
| **referral-program** | Design referral/affiliate/ambassador programs | "create a referral program" or `/referral-program` |
| **launch-strategy** | Product launches, Product Hunt, go-to-market, beta/waitlist | "plan my product launch" or `/launch-strategy` |
| **paid-ads** | Google Ads, Meta, LinkedIn ad campaigns, targeting, ROAS | "set up a Google Ads campaign" or `/paid-ads` |
| **free-tool-strategy** | Build free tools for lead gen / SEO (engineering as marketing) | "build a free tool for leads" or `/free-tool-strategy` |
| **marketing-ideas** | 139 proven marketing approaches organized by category | "give me marketing ideas" or `/marketing-ideas` |
| **marketing-psychology** | 70+ mental models and cognitive biases for marketing | "apply psychology to this page" or `/marketing-psychology` |

### Foundation
| Skill | What It Does | Invoke |
|-------|-------------|--------|
| **product-marketing-context** | Creates `.claude/product-marketing-context.md` — foundational positioning doc referenced by all other skills | "set up my product marketing context" or `/product-marketing-context` |
| **analytics-tracking** | Set up GA4, GTM, conversion tracking, event tracking, UTMs | "set up analytics tracking" or `/analytics-tracking` |

## How They Work
Skills are markdown files in `.claude/skills/`. Claude Code automatically detects relevant skills based on your request. You can also invoke directly with `/skill-name`.

## Recommended First Step
Run `/product-marketing-context` to set up your foundational positioning document. All other skills reference it for context.

## Cleanup
Repo clone at `/tmp/marketingskills` can be deleted.
