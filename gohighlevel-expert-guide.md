# GoHighLevel (GHL) — Expert-Level Platform Guide

> Last updated: February 2026 | Research compiled from official docs, API references, and industry usage patterns

---

## 1. Platform Overview

**GoHighLevel (GHL)** is an all-in-one CRM, marketing automation, and sales platform built primarily for **agencies**, though widely adopted by small businesses, coaches, consultants, and financial services firms. Founded by Shaun Clark in 2018, GHL consolidates 12+ tool categories into a single platform — replacing the need for separate subscriptions to tools like HubSpot, ClickFunnels, Calendly, Twilio, ActiveCampaign, and more.

### Core Value Proposition
- **Agency-first**: Built for marketing agencies to white-label and resell to clients
- **All-in-one**: CRM + funnels + email/SMS + phone + calendars + automation + reputation + websites
- **Sub-account model**: Each client gets their own isolated environment
- **Cost consolidation**: Replaces $500-1000+/mo in SaaS subscriptions with one platform

### Pricing Tiers (2024-2025)

| Plan | Price | Key Features |
|------|-------|-------------|
| **Starter** | $97/mo | 1 user, basic CRM, funnels, calendar, email/SMS, basic automations. No white-label. Limited sub-accounts. |
| **Unlimited** | $297/mo | Unlimited users & contacts, unlimited sub-accounts, full API access, advanced workflows, full funnel/website builder, enhanced reporting. No white-label. |
| **SaaS Pro** | $497/mo | Everything in Unlimited + white-labeling (custom domain, branding, mobile app), SaaS mode (charge clients directly), priority support, advanced integrations. |

**Additional costs**: SMS/calling via Twilio (pay-per-use), email via Mailgun (volume-based), premium features like AI chatbot add-ons. Annual billing saves ~17% (2 months free).

### White-Labeling (SaaS Pro)
- Full rebrand: your logo, domain, colors, mobile app (iOS/Android — ~$497 one-time setup)
- Clients never see "GoHighLevel" branding
- Set your own pricing for client sub-accounts (recurring revenue model)
- Custom login page, support email, and onboarding flows

### Sub-Account Architecture
- **Agency level**: Master dashboard managing all clients
- **Sub-accounts**: Each client/location gets isolated CRM, contacts, funnels, automations
- **Snapshots**: Pre-built templates (workflows, funnels, pipelines) that can be deployed to new sub-accounts instantly — critical for scaling

---

## 2. CRM Features

### Contacts
- Unlimited contact storage (Unlimited/SaaS Pro plans)
- Rich contact profiles: name, email, phone, address, company, source, tags, custom fields, notes, activity timeline
- Contact activity tracking: emails opened, SMS sent/received, calls, form submissions, page visits
- Bulk import/export (CSV), deduplication, DND (Do Not Disturb) management

### Pipelines & Opportunities
- **Pipelines**: Visual Kanban boards for tracking deals through stages
- Multiple pipelines per account (e.g., "New Recruits", "Active Agents", "Onboarding")
- **Opportunities**: Individual deals/prospects within pipelines
  - Assign monetary values, expected close dates, owners
  - Move between stages via drag-and-drop or automation
  - Track win/loss rates and conversion metrics

### Tags & Custom Fields
- **Tags**: Unlimited tags for segmentation (e.g., "Licensed Agent", "Life Insurance", "Hot Lead", "Contacted")
- Tags trigger automations and filter smart lists
- **Custom Fields**: Text, dropdown, date, checkbox, number, file upload fields
- Custom fields appear on contact records and can be used in merge fields for personalization

### Smart Lists
- Dynamic contact segments that auto-update based on criteria
- Filter by: tags, custom field values, last activity date, pipeline stage, source, etc.
- Example: "Licensed agents tagged 'Interested' who haven't been contacted in 7 days"
- Power targeted campaigns and follow-up sequences

---

## 3. Automation & Workflows

GHL's workflow engine is its most powerful feature — a visual drag-and-drop builder for complex multi-step automations.

### Triggers (What starts a workflow)
- Form submission, survey completion
- Tag added/removed
- Appointment booked/cancelled/no-show
- Pipeline stage change
- Inbound SMS/email/call
- Contact created/updated
- Invoice paid, birthday/date field
- Custom webhook received
- Manual trigger

### Actions (What the workflow does)
- Send email, SMS, voicemail drop
- Add/remove tags
- Update contact fields
- Move opportunity to pipeline stage
- Create/update opportunity
- Internal notification (email, SMS, Slack)
- Add to/remove from workflow
- Wait (time delay, specific date, event-based)
- If/Else conditional branching
- Go-to action (loop)
- Assign to user (round-robin or specific)
- Send webhook (outbound)
- Facebook/Google conversion tracking

### Conditions & Logic
- **If/Else branches**: Route contacts based on tag, field value, email opened, SMS replied, etc.
- **Wait steps**: Wait X minutes/hours/days, wait until specific time, wait for event
- **Goal events**: Exit workflow when a goal is met (e.g., "appointment booked")

### Common Workflow Templates
- **Speed-to-lead**: Form submission → immediate SMS + email + internal notification → 5-min follow-up call task
- **Nurture sequence**: 7-day drip campaign with email Day 1, SMS Day 3, email Day 5, call task Day 7
- **No-show recovery**: Appointment no-show → wait 1 hour → SMS "Sorry we missed you" → reschedule link
- **Review request**: Appointment completed → wait 2 hours → SMS review request → if no response, email in 3 days
- **Onboarding**: Tag "New Agent" added → welcome email → training video series (drip) → task assigned to manager

---

## 4. Funnels & Websites

### Funnel Builder
- Drag-and-drop editor (similar to ClickFunnels)
- Pre-built templates for lead capture, sales pages, webinar registration, upsells, order forms
- A/B split testing on any funnel page
- Payment integration: Stripe, PayPal, Square
- Order bumps, upsells, downsells
- Custom code injection (HTML/CSS/JS)
- Membership areas for course delivery

### Website Builder
- Full website creation with drag-and-drop
- Custom domains with SSL
- Mobile-responsive by default
- Blog functionality
- SEO settings per page
- Global sections (headers/footers)

### Forms & Surveys
- Form builder with conditional logic
- Survey builder for multi-step qualification
- Embedded on funnels, websites, or external sites
- Submissions auto-create contacts and trigger workflows

---

## 5. Conversations (Unified Inbox)

One of GHL's killer features — a single inbox for ALL communication channels:

| Channel | Details |
|---------|---------|
| **SMS** | Two-way texting via Twilio. Templates, scheduling, bulk send. |
| **Email** | Send/receive via Mailgun or SMTP. Templates, tracking. |
| **Facebook Messenger** | Direct integration with FB pages. |
| **Instagram DM** | Business account integration. |
| **Google Business Messages** | Chat from Google search/maps. |
| **WhatsApp** | Business API integration (additional setup). |
| **Live Chat** | Website chat widget. |
| **Phone/Voicemail** | Call logs and voicemail transcripts. |

- **Assignment**: Conversations can be assigned to team members
- **Templates**: Canned responses for quick replies
- **Missed Call Text-Back**: Auto-SMS when a call is missed (huge for lead capture)
- **Two-way sync**: All conversations logged on contact timeline

---

## 6. Calendar System

### Calendar Types
- **Simple calendar**: One-on-one bookings with a single person
- **Round-robin**: Auto-distributes bookings among team members (weighted or equal)
- **Class booking**: Multiple people book the same time slot (webinars, group calls)
- **Collective booking**: Finds mutual availability across multiple team members
- **Service calendar**: Different services with different durations/prices

### Features
- Embeddable booking widget for websites/funnels
- Automated reminders (SMS + email) before appointments
- Google Calendar and Outlook two-way sync
- Buffer time between appointments
- Custom availability per day/time
- Payment collection at booking (Stripe integration)
- No-show and cancellation tracking
- Timezone auto-detection

---

## 7. Phone System

### Built-in Calling (via Twilio)
- Inbound/outbound calls from within GHL
- Local and toll-free numbers
- Call recording and logging
- Voicemail with transcription
- Call forwarding and routing
- IVR (Interactive Voice Response) menus

### Power Dialer
- Bulk outbound calling for sales teams
- Auto-dial from contact lists
- Disposition codes after each call
- Call scripts displayed during calls
- Local presence dialing (shows local area code to improve answer rates)

### Voicemail Drops
- Pre-record voicemail messages
- Drop directly to voicemail without ringing (ringless voicemail)
- Used in workflows for automated outreach

### Call Tracking
- Assign tracking numbers to marketing campaigns
- Track which campaigns generate calls
- Whisper messages (announce lead source before connecting)

---

## 8. Reputation Management

- **Automated review requests**: Send SMS/email after service completion requesting Google/Facebook reviews
- **Review monitoring**: See all Google reviews in dashboard
- **Response management**: Reply to reviews from within GHL
- **Review widgets**: Embed review feeds on websites/funnels
- **Reporting**: Track review volume, average rating, response rates
- **Templates**: Customizable review request messages with direct links

---

## 9. Reporting & Analytics

### Dashboard
- Customizable overview with KPIs: leads, opportunities, revenue, conversion rates
- Pipeline performance (stage-by-stage conversion)
- Campaign performance (email/SMS open rates, click rates)

### Attribution Reporting
- Track lead sources (Facebook Ads, Google Ads, organic, referral)
- First-touch and multi-touch attribution
- ROI per campaign/channel

### Call Reporting
- Call volume, duration, answer rates
- Agent performance (calls made, avg duration, outcomes)
- Peak call time analysis

### Ad Reporting
- Facebook Ads and Google Ads integration
- Cost per lead, cost per acquisition
- Campaign-level breakdowns

---

## 10. Integration Points

### Native Integrations
- **Twilio**: SMS, calling, phone numbers (required for phone/SMS features)
- **Mailgun**: Email sending infrastructure
- **Stripe**: Payment processing for funnels, invoices, subscriptions
- **Google**: Calendar sync, My Business, Ads, Analytics
- **Facebook**: Lead Ads, Messenger, Pixel, Ads reporting
- **Instagram**: DM integration
- **WhatsApp**: Business messaging
- **Quickbooks**: Accounting sync
- **Shopify**: E-commerce integration

### Zapier
- 1000+ app connections via Zapier
- GHL triggers available: contact created, opportunity stage changed, appointment booked, form submitted
- GHL actions available: create/update contact, create opportunity, send SMS

### Custom Webhooks
- **Inbound**: Receive data from external systems to create contacts or trigger workflows
- **Outbound**: Send data from GHL workflows to external endpoints
- Full JSON payload customization

### API
- REST API (v1 with API key, v2 with OAuth 2.0)
- Full CRUD on contacts, opportunities, calendars, conversations
- Workflow triggering via API
- See separate API Reference document for details

---

## 11. Best Practices

### Agency Setup
1. Start with SaaS Pro ($497/mo) if planning to resell
2. Set up your white-label domain and branding first
3. Create a "master snapshot" with your standard workflows, pipelines, and funnels
4. Use snapshots to instantly deploy new client sub-accounts
5. Set up Twilio and Mailgun at the agency level for cost control

### Sub-Account Structure
- **One sub-account per client** (or per location for multi-location clients)
- Use consistent naming conventions
- Deploy snapshots for standardized setup
- Set permissions per user role (admin, user, read-only)

### Workflow Templates
- Build once, snapshot, deploy everywhere
- Start with these essential workflows:
  1. Speed-to-lead (immediate follow-up)
  2. Long-term nurture (30-60 day drip)
  3. Appointment reminder sequence
  4. No-show recovery
  5. Review request automation
  6. Re-engagement (dormant leads)

### Snapshot Sharing
- Export snapshots (includes workflows, funnels, pipelines, templates)
- Share via snapshot link or import ID
- GHL marketplace has pre-built snapshots for various industries
- Community snapshots available (Facebook group, HighLevel marketplace)

---

## 12. GHL for Insurance & Financial Services

### Why Insurance Agencies Love GHL
GHL is exceptionally well-suited for insurance agencies and financial services firms, especially those focused on **recruiting and onboarding licensed agents**.

### Recruiting Licensed Agents — Pipeline Setup
```
Pipeline: "Agent Recruiting"
Stages:
  1. Lead (sourced from PropHog, referrals, ads)
  2. Contacted (first outreach made)
  3. Interested (responded positively)
  4. Presentation Scheduled (iDecide booked)
  5. Presentation Completed
  6. Contract Sent
  7. Contracted (signed up)
  8. In Onboarding
  9. Active Agent
  10. Lost/Not Interested
```

### Common Automations for Agent Recruiting

#### 1. Speed-to-Lead for New Recruits
- **Trigger**: New contact added (from PropHog import or form)
- **Actions**: Immediate SMS → "Hi [FirstName], this is [AgencyName]. I saw you're a licensed agent in [State]. I'd love to chat about an opportunity. When works best?"
- Wait 10 min → if no reply → send email with more details
- Wait 1 day → if no reply → voicemail drop
- Wait 3 days → SMS follow-up #2
- Continue for 14 days with multi-channel touches

#### 2. Presentation Booking Automation
- **Trigger**: Contact replies or clicks booking link
- **Actions**: Auto-book iDecide presentation via calendar
- Send confirmation SMS + email with prep materials
- Reminder SMS 1 hour before, 15 min before
- If no-show → automatic reschedule sequence

#### 3. Post-Presentation Follow-Up
- **Trigger**: Opportunity moves to "Presentation Completed"
- **Actions**: Immediate follow-up SMS → "Great meeting you today! Any questions?"
- Wait 1 day → send contract/application link
- Wait 3 days → if contract not received → SMS reminder
- If/Else: Contract received → move to "Contracted" → trigger onboarding workflow

#### 4. New Agent Onboarding Sequence
- **Trigger**: Tag "Contracted" added
- **Actions**: 
  - Day 0: Welcome email with login credentials, training portal link
  - Day 1: SMS with first training video
  - Day 2: Task created for manager — "Schedule 1-on-1 with [AgentName]"
  - Day 3: Email with compliance checklist
  - Day 7: Check-in SMS → "How's your first week going?"
  - Day 14: Drip training materials (carrier info, product guides)
  - Day 30: Manager notification — "30-day check-in due for [AgentName]"

#### 5. Retention & Re-Engagement
- **Trigger**: Custom date field "Last Activity" > 30 days
- **Actions**: SMS → "Hey [FirstName], haven't heard from you in a while. Everything okay? Let's connect."
- Email with success stories from other agents
- Task for manager to call personally

### Custom Fields for Insurance Recruiting
- License State(s)
- License Number
- License Type (Life, Health, P&C)
- License Expiration Date
- Carrier Appointments
- Recruiting Source (PropHog, Referral, Facebook Ad)
- iDecide Presentation Type (GFI, Welcome to GFI)
- Agent Code
- Upline Manager
- Contract Date
- First Sale Date

### Tags for Segmentation
- `Licensed`, `Life-Licensed`, `Health-Licensed`, `P&C-Licensed`
- `PropHog-Lead`, `Referral`, `Facebook-Ad`, `Cold-Outreach`
- `Presentation-Watched`, `Contract-Sent`, `Contracted`
- `Active-Agent`, `Inactive-Agent`, `Churned`
- `Hot-Lead`, `Warm-Lead`, `Cold-Lead`
- `State-FL`, `State-TX`, `State-CA` (etc.)

### Reporting for Insurance Agencies
- **Pipeline conversion**: Lead → Contracted conversion rate
- **Speed metrics**: Average time from lead to first contact, lead to presentation, presentation to contract
- **Agent activity**: Calls made, SMS sent, appointments booked per recruiter
- **Source attribution**: Which lead source produces the most contracted agents
- **Retention**: 30/60/90-day agent retention rates

---

## 13. GHL vs. Current Stack Comparison

| Feature | Current Tool | GHL Equivalent |
|---------|-------------|---------------|
| CRM & SMS campaigns | Ringy | GHL CRM + Conversations |
| Lead sourcing | PropHog | Still use PropHog → import into GHL |
| Presentations | iDecide | Still use iDecide → link from GHL calendar |
| Back office | Tevah | Still use Tevah → GHL for front-end recruiting |
| Calendar booking | Manual | GHL Calendar with booking widgets |
| Email sequences | None/manual | GHL Workflows |
| Pipeline tracking | Ringy (basic) | GHL Pipelines (visual, automated) |
| Review management | None | GHL Reputation Management |
| Website/funnels | None | GHL Funnel & Website Builder |
| Reporting | Tevah (back office) | GHL Dashboard + Attribution |

### Migration Strategy
1. **Phase 1**: Set up GHL, build recruiting pipeline, import PropHog leads into GHL instead of Ringy
2. **Phase 2**: Build automated follow-up workflows (replace manual Ringy SMS campaigns)
3. **Phase 3**: Create booking funnels with iDecide integration, calendar automation
4. **Phase 4**: Build onboarding sequences, new agent drip campaigns
5. **Phase 5**: Add reputation management, reporting dashboards, website/funnel for agent recruiting

---

## Summary

GoHighLevel is a transformative platform for insurance recruiting operations. It consolidates CRM, communication, automation, funnels, calendars, and reporting into one system — replacing fragmented tool stacks and manual processes. For an operation focused on recruiting licensed agents at volume, GHL's automation workflows alone can dramatically improve follow-up consistency, speed-to-lead, and onboarding completion rates. Combined with pipeline visibility and source attribution, it provides the data and systems needed to scale recruiting while improving stick rates.

The $297/mo Unlimited plan is the sweet spot for a single agency operation. The $497/mo SaaS Pro only makes sense if you plan to white-label and resell to downline agencies.
