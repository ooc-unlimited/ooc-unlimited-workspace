---
title: "Gary's Recruiting OS"
date: "2026-02-07"
tags:
  - playbook
  - recruiting
  - pipeline
---

# Gary's Recruiting OS
### PropHog → Ringy → iDecide → Zoom → ICA Pipeline
*Last updated: 2026-02-08*

---

## Overview

This is Gary's end-to-end system for recruiting **already-licensed** insurance agents into GFI. Unlike warm-market recruiting, this pipeline sources cold leads from PropHog, nurtures via Ringy SMS/calls, qualifies through iDecide, interviews on Zoom, and closes with ICA signing.

**The Edge:** Gary recruits agents who already have their license. They skip the 2-4 week licensing bottleneck and go straight to onboarding + field training. This compresses the activation timeline by weeks.

**Current Reality:** ~100 recruited, low stick rate. The system below tightens every stage to improve conversion and retention.

---

## Stage 0: Lead Sourcing (PropHog)

### Login & Setup
- URL: https://agent-recruiting.prophog.ai/leads
- Credentials: garycosby / winning

### Filtering Criteria

| Filter | Setting | Why |
|--------|---------|-----|
| License Status | Active, newly licensed | Fresh agents = more open to opportunity |
| License Date | Last 30-90 days | Sweet spot: licensed but haven't committed elsewhere |
| States | IL, MO, NE, NJ, NY, NC, OK, OR, TN, WA | Gary's current active states |
| Experience | New agents preferred | Less baggage, more coachable |
| DNC | Exclude DNC numbers | Compliance |

### Daily Lead Pull
- **Target:** 50-100 new leads per day
- **Action:** Export to CSV → Import to Ringy
- **Credit Management:** 10K credits = ~10K leads. At 50/day = ~200 working days. Budget accordingly.
- **Pro tip:** Rotate states weekly to avoid market fatigue in any one area

### Lead Quality Tiers

| Tier | Profile | Priority |
|------|---------|----------|
| **A — Hot** | Licensed <30 days, no current agency affiliation visible | Contact within 2 hours |
| **B — Warm** | Licensed 30-90 days, may have agency but new | Contact same day |
| **C — Long Shot** | Licensed 90+ days, established elsewhere | Batch into weekly drip |

---

## Stage 1: Import & First Contact (Ringy)

### Login & Setup
- URL: https://app.ringy.com
- Credentials: garycosbyjr@gmail.com / Start345

### Ringy Pipeline Stages
Set up these exact pipeline stages in Ringy:

1. **New Lead** — Just imported from PropHog
2. **First Contact** — Initial SMS/call made
3. **iDecide Sent** — Presentation link delivered
4. **Overview Complete** — They watched it
5. **Zoom Scheduled** — Interview booked
6. **Zoom Complete** — Interview done
7. **ICA Sent** — Agreement sent for signature
8. **ICA Signed** — Closed. Move to Onboarding.
9. **Dead/Not Interested** — Archive
10. **Referral Source** — Didn't join but gave referrals

### First Contact — Same Day Rule
**The single most important rule: Contact leads the same day they're pulled.**

#### Initial SMS Template (Send within 2 hours of import)
```
Hey [First Name], this is Gary with GFI — I see you recently got 
your insurance license, congrats! 🎉 Quick question: are you 
currently with a team or still figuring out your next move?
```

#### If No Response (4 hours later)
```
[First Name], no pressure at all. I help newly licensed agents 
get producing fast with a proven system + mentorship. If you're 
open to a quick look, I'll send over a short presentation. 
Takes about 12 min.
```

#### Initial Call Script (if they pick up or call back)
```
"Hey [Name], thanks for picking up — this is Gary. I'll be real 
quick with you. I saw you just got your license, and I wanted to 
reach out because I work with a team that specializes in helping 
new agents actually get into production — not just get licensed 
and sit on it.

Quick question for you: are you currently with a team, or are 
you still kind of figuring things out?"

[LISTEN]

IF already with a team:
"Got it — how's that going? Are they actually putting you in 
front of clients, or is it more 'figure it out yourself'?"

IF not with a team:
"That's actually really common. Most people get licensed and then 
hit a wall because nobody shows them the actual business side. 
That's exactly what we solve.

Here's what I'd like to do — I'm going to send you a quick 
interactive presentation. Takes about 12 minutes. It'll show you 
our system, the comp structure, everything. If it makes sense, 
we'll jump on a quick Zoom. If not, no hard feelings. Fair enough?"
```

---

## Stage 2: The Filter (iDecide)

### Login & Setup
- URL: https://login.idecide.com/members/#contacts
- Credentials: gary@oocunlimited.com / Start1234$

### Which Presentation to Send

| Prospect Profile | Presentation | Why |
|-----------------|-------------|-----|
| Newly licensed, no experience, cold lead | **GFI** (standard) | Lower stature, educational approach |
| Has experience, came via referral, shows ambition | **Welcome to GFI** | Higher stature, partnership framing |
| Came from another agency, producing | **Welcome to GFI** | They need to see the upgrade, not the basics |

### iDecide SMS Template
```
[First Name], here's that presentation I mentioned. It's 
interactive — takes about 12 min. Let me know once you've 
gone through it and I'll follow up with you:

[iDecide Link]
```

### The 24-Hour Loop
**You MUST follow up within 24 hours of sending the iDecide link.**

#### If they watched it:
```
CALL SCRIPT:
"Hey [Name], I see you went through the presentation — thanks 
for taking the time. So I've got some good news: based on what 
I'm seeing, I think you'd be a great fit for our team.

Here's what I'd like to do next — let's jump on a quick Zoom so 
I can answer any questions and we can see if this makes sense for 
both of us. I've got [Day] at [Time] or [Day] at [Time] — which 
works better?"
```

#### If they didn't watch it:
```
SMS:
"Hey [First Name], just checking in — did you get a chance to 
look at that presentation? No rush, just want to make sure the 
link worked. 👍"
```

*Wait 24 more hours. If still nothing:*
```
SMS:
"[First Name], I know you're busy. Last thing I'll say — the 
agents I work with are getting into production within their first 
2 weeks. If that interests you, the presentation is still there. 
If not, all good — I appreciate your time."
```

#### If they're not a fit (Bad News pivot to referrals):
```
CALL SCRIPT:
"Hey [Name], I appreciate you going through the presentation. 
Honestly, based on what I'm seeing, I don't think the timing is 
right for us to work together — and I'd rather be straight with 
you than waste your time.

That said — do you know anyone else who recently got licensed 
who might be looking for a team? I'd love to connect with them."
```

### Decision Tree: Who Moves Forward?

```
Did they watch iDecide?
├── YES
│   ├── Watched >80% → GOOD FIT → Schedule Zoom
│   ├── Watched 40-80% → MAYBE → Call to re-engage, answer questions
│   └── Watched <40% → LOW INTEREST → One more follow-up, then archive
└── NO (after 48 hours + 2 follow-ups)
    └── DEAD → Archive, add to monthly re-engagement drip
```

---

## Stage 3: The Interview (Zoom)

### Booking
- Use Calendly/LeadConnector link for scheduling
- Always offer 2 specific time slots (don't say "when works for you")
- Send calendar invite + Zoom link immediately after booking

### Zoom Confirmation Sequence

**24 hours before:**
```
SMS: "Hey [First Name], just confirming our Zoom tomorrow at 
[Time]. Looking forward to it. Here's the link: [Zoom Link]"
```

**1 hour before:**
```
SMS: "See you in about an hour! 🤙 [Zoom Link]"
```

**If no-show (5 min past start):**
```
SMS: "[First Name], I'm on Zoom waiting for you — everything 
okay? [Zoom Link]"
```

**If no-show (15 min past start):**
```
SMS: "Hey, looks like something came up. No worries — want to 
reschedule? I've got [Day] at [Time] or [Day] at [Time]."
```

*One reschedule allowed. Two no-shows = archive.*

### Zoom Interview Framework (20-30 minutes)

#### Opening (2 min)
```
"[Name], thanks for jumping on. Before we get into anything, 
I just want to set the frame — this is a two-way conversation. 
I'm going to learn about you, you're going to learn about us, 
and at the end we'll both decide if this makes sense. Fair?"
```

#### Discovery (8-10 min)
Ask these in order:
1. **"What made you get your insurance license in the first place?"** *(Reveals motivation)*
2. **"What's happened since you got licensed?"** *(Reveals current situation)*
3. **"What are you looking to get out of this — income, freedom, career change?"** *(Reveals goals)*
4. **"If you had a system that could get you producing within 2 weeks, what would that change for you?"** *(Reveals urgency/desire)*
5. **"On a scale of 1-10, how serious are you about making this work?"** *(Commitment gauge)*

#### Money-Language Classifier (use during discovery)
Listen for their language patterns:

| Quadrant | Keywords They Use | Your Reframe |
|----------|------------------|--------------|
| **Employee (E)** | "job," "hours," "salary," "security" | "This isn't a job — it's a business. You're building equity." |
| **Self-Employed (S)** | "control," "do it myself," "my way" | "The system duplicates so you're not the bottleneck." |
| **Business Owner (B)** | "systems," "scale," "leverage" | "That's exactly what GFI is built on. Let me show you." |
| **Investor (I)** | "passive income," "freedom," "ROI" | "Residual income + team equity = exactly that." |

#### The Pitch (5-7 min)
```
"Here's what makes us different from every other agency you'll 
talk to:

1. You already have your license — most teams make you wait 
   weeks before you can earn. With us, we start your onboarding 
   and field training immediately.

2. We have a proven system — you're not going to get licensed 
   and then get told 'go figure it out.' You'll have a structured 
   onboarding, a trainer working with you, and 10 field training 
   appointments before you ever go solo.

3. Our comp structure is built for agents who want to build. 
   Personal production is great, but the real money is when you 
   start building a team and earning overrides.

4. I'm not going to hand you off to someone else. I'm your 
   point of contact. Period."
```

#### Objection Handling

| Objection | Response |
|-----------|----------|
| "I'm already with a team" | "I respect that. Quick question — are they putting you in front of clients, or are you mostly on your own? Because if you're not producing, the license is just a piece of paper." |
| "I need to think about it" | "Totally fair. What specifically do you want to think about? Let me see if I can answer that right now." |
| "What's the cost?" | "There's no cost to join. You need your license (which you already have), and we handle the rest. The only investment is your time and effort." |
| "I've heard bad things about insurance MLM" | "I hear that. Here's the difference — in most MLMs, you're selling product nobody needs. We sell life insurance. Your dad needs it, your neighbor needs it, everyone needs it. And you're building a real book of business." |
| "I don't have a warm market" | "Neither did I. I was dead broke with zero connections. That's exactly why we have a system — PropHog, Ringy, cold prospecting. You don't need a warm market to succeed here." |

#### The Close (3-5 min)
```
"So here's where we're at. I think you'd be a great fit, and 
I'd like to get you started. The next step is simple — we 
complete your Independent Contractor Agreement, and I'll get 
you scheduled for your first onboarding session this week.

The ICA is standard — it just formalizes that you're part of the 
team. Takes about 5 minutes. Can we knock that out right now?"
```

### Zoom Scorecard — Who Gets an ICA?

Rate each factor 1-5 after the call:

| Factor | Score (1-5) |
|--------|-------------|
| Coachability (listened, asked questions) | ___ |
| Urgency (wants to start now, not "eventually") | ___ |
| Motivation clarity (knows their "why") | ___ |
| Communication (articulate, professional) | ___ |
| Commitment level (self-reported + vibe) | ___ |
| **TOTAL** | **___/25** |

- **20-25:** Send ICA immediately. Priority onboarding.
- **15-19:** Send ICA with clear expectations. Standard onboarding.
- **10-14:** Give them homework first (watch presentation again, write their "why"). Follow up in 48 hours.
- **Below 10:** Thank them, pivot to referral ask, archive.

---

## Stage 4: The Commitment (ICA)

### Sending the ICA
- Send immediately after Zoom (while they're still warm)
- Use e-signature (DocuSign, PandaDoc, or GFI's built-in)

### ICA Confirmation SMS
```
"[First Name], I just sent over the ICA to your email. Quick 
5-min form — once that's done, I'll get you scheduled for 
onboarding. Welcome to the team! 🔥"
```

### If ICA not signed within 24 hours:
```
SMS: "Hey [Name], just checking — did you see the ICA in your 
email? Sometimes it goes to spam. Want me to resend?"
```

### If ICA not signed within 48 hours:
```
CALL: "Hey [Name], I want to be real with you. The agents who 
succeed in this business are the ones who move fast. The ICA has 
been sitting for 2 days — is there something holding you back 
that I can help with?"
```

*After 72 hours unsigned = one final call, then archive.*

### Post-ICA Immediate Actions (within 1 hour of signing)
1. ✅ Move Ringy stage to "ICA Signed"
2. ✅ Send welcome text:
```
"Welcome to the team, [Name]! 🎉 Here's what happens next:
I'm scheduling your Onboarding 1 session for [Day/Time]. 
This is where we get you into the system and start your 
activation. Talk soon."
```
3. ✅ Schedule Onboarding 1 within 48 hours
4. ✅ Add to Tevah (back office)
5. ✅ Notify upline/EMD of new recruit
6. ✅ Hand off to Agent Activation OS (see agent-activation-os.md)

---

## Follow-Up Cadence — Complete Timeline

### Active Prospect (Pre-Zoom)

| Day | Action | Channel |
|-----|--------|---------|
| 0 | Import + Initial SMS | Ringy SMS |
| 0 (+4hr) | Follow-up SMS if no reply | Ringy SMS |
| 1 | Call attempt #1 | Ringy Call |
| 1 | Send iDecide if connected | iDecide + SMS |
| 2 | iDecide follow-up (24-hour loop) | Call |
| 3 | Second iDecide follow-up if unwatched | SMS |
| 5 | Final outreach | SMS |
| 7 | Archive if no engagement | — |

### Active Prospect (Post-Zoom, Pre-ICA)

| Day | Action |
|-----|--------|
| 0 | Send ICA immediately after Zoom |
| 1 | Check-in SMS if unsigned |
| 2 | Call if still unsigned |
| 3 | Final call — commit or archive |

### Dead Lead Re-Engagement (Monthly)
```
SMS (every 30 days, 3x max):
"Hey [First Name], it's Gary. When we talked a while back the 
timing wasn't right. Just checking — has anything changed on 
your end? We're growing fast and I've got a spot if you're 
ready."
```

---

## Daily Operating Rhythm

| Time Block | Activity | Target |
|------------|----------|--------|
| 8:00-9:00 AM | Pull PropHog leads, import to Ringy | 50-100 leads |
| 9:00-11:00 AM | First contact calls + SMS | Contact all new leads |
| 11:00-12:00 PM | iDecide follow-ups (24-hour loop) | All pending presentations |
| 12:00-1:00 PM | Lunch + admin | — |
| 1:00-3:00 PM | Zoom interviews | 2-4 interviews |
| 3:00-4:00 PM | ICA follow-ups + post-close onboarding scheduling | — |
| 4:00-5:00 PM | Ringy pipeline cleanup, stage updates, notes | — |

---

## Key Metrics to Track Weekly

| Metric | Target | Current |
|--------|--------|---------|
| Leads pulled (PropHog) | 250-500/week | — |
| First contacts made | 200+/week | — |
| iDecide links sent | 50+/week | — |
| iDecide watched (>80%) | 25+/week | — |
| Zooms scheduled | 10+/week | — |
| Zooms completed | 7+/week | — |
| ICAs sent | 5+/week | — |
| ICAs signed | 3-4/week | — |
| Conversion: Lead → ICA | 1-2% | — |

---

## Red Flags — Drop Immediately

- Won't watch iDecide after 3 follow-ups
- Two no-shows to Zoom
- Asks "how much does it cost to join" more than once after being told
- Badmouths previous agency excessively (blame mindset)
- Can't articulate any reason for getting licensed
- Wants guarantees or "proof it works" before doing anything

## Green Flags — Fast Track

- Watched full iDecide same day
- Asks specific questions about comp structure or training
- Already has warm market contacts in mind
- Recently left another agency (knows the game, wants better)
- Responds to texts within minutes
- Self-reported 8+ on commitment scale

---

*This document is the front end of Gary's system. Once an agent signs the ICA, they enter the Agent Activation OS (agent-activation-os.md).*
