---
title: "Agent Follow-Up Tracker"
date: "2026-02-07"
tags:
  - system
  - tracking
  - pipeline
---

# Agent Follow-Up Tracker
### Pipeline Stage Tracking System
*Last updated: 2026-02-08*

---

## Overview

Every prospect and agent is in exactly ONE stage at all times. This tracker defines each stage, what triggers movement between stages, follow-up rules, and red/green flags.

**Tools:** Track stages in Ringy (pipeline view). This document defines the system behind the stages.

---

## Pipeline Stages

```
RECRUITING PIPELINE                    ACTIVATION PIPELINE
─────────────────                      ────────────────────
1. New Lead                            6. Onboarding 1
2. First Contact Made                  7. Onboarding 2
3. iDecide Sent                        8. Onboarding 3
4. Overview Complete                   9. Ambassador Training
5. Zoom Scheduled                     10. Field Training (1-10)
   └→ Zoom Complete                   11. First Solo Close
   └→ ICA Sent                        12. Producing Agent
   └→ ICA Signed ──────────────────→  13. First Recruit
                                      14. CFT In Progress
EXITS                                 15. CFT Certified
─────                                 16. MD Path
❌ Dead/Not Interested                 17. EMD Path
🔄 Re-Engagement Pool
📇 Referral Source
```

---

## Stage Definitions & Rules

### STAGE 1: New Lead
**Source:** PropHog import
**Entry trigger:** Lead imported into Ringy
**Required action:** First contact within 2 hours (Tier A) or same day (Tier B/C)
**Exit trigger:** SMS sent or call made → Stage 2
**Max time in stage:** 24 hours. If not contacted → flag for immediate action.

---

### STAGE 2: First Contact Made
**Entry trigger:** Initial SMS or call completed
**Required action:** Gauge interest, qualify, prepare to send iDecide
**Follow-up cadence:**
| Day | Action |
|-----|--------|
| 0 | Initial contact |
| 0 (+4hr) | Follow-up if no reply |
| 1 | Call attempt |
| 2 | Final text |

**Exit triggers:**
- Interested → Send iDecide → Stage 3
- Not interested → ❌ Dead
- No response after 3 touches → 🔄 Re-Engagement Pool

---

### STAGE 3: iDecide Sent
**Entry trigger:** Presentation link delivered via SMS
**Required action:** Monitor iDecide for view status. Follow up within 24 hours.
**Follow-up cadence:**
| Day | Action |
|-----|--------|
| 1 | 24-hour loop call |
| 2 | Second follow-up (SMS) |
| 3 | Final "door closing" text |

**Exit triggers:**
- Watched >80% → Call with "good news" → Stage 4
- Watched 40-80% → Call to re-engage → Stay in Stage 3
- Not watched after 3 days + 3 touches → 🔄 Re-Engagement Pool
- Bad fit → pivot to referral → 📇 Referral Source

---

### STAGE 4: Overview Complete
**Entry trigger:** Prospect watched iDecide (confirmed >80%)
**Required action:** Schedule Zoom within 24 hours
**Follow-up:** "I've got [Day] at [Time] or [Day] at [Time]" — always two options

**Exit triggers:**
- Zoom scheduled → Stage 5
- Won't schedule after 48 hours → one more attempt → ❌ Dead or 🔄 Re-Engagement

---

### STAGE 5: Zoom Scheduled → Complete → ICA
This stage has sub-stages:

#### 5a: Zoom Scheduled
**Follow-up:**
- 24hr before: confirmation SMS
- 1hr before: reminder SMS
- No-show: reschedule once. Two no-shows → ❌ Dead

#### 5b: Zoom Complete
**Action:** Score on Zoom Scorecard (see Recruiting OS)
- Score 20+: Send ICA immediately
- Score 15-19: Send ICA with expectations
- Score 10-14: Homework assignment, 48hr follow-up
- Score <10: Thank, ask for referrals → ❌ Dead or 📇 Referral

#### 5c: ICA Sent
**Follow-up:**
| Hours | Action |
|-------|--------|
| 24 | "Did you see the email?" SMS |
| 48 | Call — "what's holding you back?" |
| 72 | Final call, then archive |

#### 5d: ICA Signed → MOVE TO ACTIVATION PIPELINE → Stage 6

---

### STAGE 6: Onboarding 1
**Entry trigger:** ICA signed
**Timeline:** Schedule within 48 hours of ICA
**Prerequisites agent must complete before session:**
- [ ] *Build an Empire* Ch. 1-3 read
- [ ] "Why" statement written
- [ ] Top 25 list started

**Session covers:** Company overview, internal consumption, tech setup, Client Experience scheduling
**Exit trigger:** Onboarding 1 complete + Client Experience scheduled → Stage 7
**Red flag:** Shows up without homework done → reschedule (1 chance). Second time → serious conversation about commitment.

---

### STAGE 7: Onboarding 2
**Entry trigger:** Onboarding 1 complete + Client Experience done
**Timeline:** Day 5-7 (Track A) or Day 16-23 (Track B)
**Prerequisites:**
- [ ] *Build an Empire* finished
- [ ] Top 50+ list prepared
- [ ] Client Experience completed (agent is now a client)

**Session covers:** EMD handoff, Top 100 extraction, system launch briefing
**Conducted by:** EMD (or Gary if no active EMD)
**Exit trigger:** Top 100 list built + system launch explained → Stage 8

---

### STAGE 8: Onboarding 3
**Entry trigger:** Onboarding 2 complete
**Timeline:** Day 7-10 (Track A) or Day 18-25 (Track B)
**Session covers:** Top 100 prioritization, system dry run, transition to Ambassador Training
**Exit trigger:** Session complete + Ambassador Training Day 1 scheduled → Stage 9

---

### STAGE 9: Ambassador Training
**Entry trigger:** Onboarding 3 complete
**Timeline:** 5 consecutive business days
**Daily tracking:**

| Day | Topic | Complete? | Notes |
|-----|-------|-----------|-------|
| 1 | ETHOS Script | ☐ | |
| 2 | Zoom Etiquette | ☐ | |
| 3 | Webinar Practice | ☐ | |
| 4 | Snapshot + Magic Questions | ☐ | |
| 5 | Role Play Assessment | ☐ | Pass / Fail |

**Exit trigger:** Pass Day 5 role play → Stage 10
**If fail:** Repeat Day 4-5. Two failures → reassess commitment.

---

### STAGE 10: Field Training
**Entry trigger:** Ambassador Training passed
**Timeline:** 10 appointments over 7-14 days
**Tracking:**

| # | Date | Format | Client | Outcome | Confidence (1-10) | Notes |
|---|------|--------|--------|---------|-------------------|-------|
| 1 | | Watch & Learn | | | | |
| 2 | | Watch & Learn | | | | |
| 3 | | Watch & Learn | | | | |
| 4 | | Guided Practice | | | | |
| 5 | | Guided Practice | | | | |
| 6 | | Guided Practice | | | | |
| 7 | | Solo + Safety Net | | | | |
| 8 | | Solo + Safety Net | | | | |
| 9 | | Solo + Safety Net | | | | |
| 10 | | Final Assessment | | | | |

**Exit trigger:** 10 appointments complete + trainer sign-off → Stage 11
**Red flags during field training:**
- Cancels/reschedules more than 2 sessions
- Confidence not improving (stuck at 3-4 after 6+ appointments)
- Won't book appointments from their own list
- Arguing with trainer about approach

---

### STAGE 11: First Solo Close
**Entry trigger:** Released from field training
**This is THE milestone.** Everything before this was preparation.
**Action:** Celebrate. Publicly recognize. Set next 10 appointment targets.
**Exit trigger:** Close confirmed → Stage 12

---

### STAGE 12: Producing Agent
**Entry trigger:** First solo close
**Ongoing tracking:**

| Week | Appointments Set | Appointments Kept | Presentations | Closes | Premium | Notes |
|------|-----------------|-------------------|---------------|--------|---------|-------|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |

**Introduce recruiting conversation after 3-5 closes.**
**Exit trigger:** First personal recruit → Stage 13

---

### STAGE 13: First Recruit
**Entry trigger:** Agent recruits their first person
**Action:** Help them run their recruit through the same system
**This is where duplication begins.**
**Exit trigger:** Consistent recruiting + production → Stage 14

---

### STAGE 14: CFT In Progress
**Entry trigger:** 10+ field trainings done, 5+ solo closes, 1+ recruits
**Tracking:** Agent is now training their own recruits through field training
**Exit trigger:** 2+ agents trained who each produced at least 1 close → Stage 15

---

### STAGE 15: CFT Certified
**Entry trigger:** CFT sign-off by EMD/Gary
**The agent can now independently train new agents.**

---

### STAGE 16-17: MD / EMD Path
Defined by GFI corporate requirements. Track in Tevah.

---

## Follow-Up Rules (Universal)

### Response Time Standards
| Situation | Max Response Time |
|-----------|------------------|
| New lead (Tier A) | 2 hours |
| New lead (Tier B/C) | Same day |
| Prospect replies to SMS | 30 minutes during business hours |
| Post-Zoom ICA follow-up | 24 hours |
| Agent in onboarding asks question | Same day |
| Agent in field training needs help | Within 2 hours |

### When to Drop a Prospect
- 3 contact attempts with zero response → Re-Engagement Pool
- 2 Zoom no-shows → Dead
- ICA unsigned after 72 hours + call → Dead
- Homework not done twice → Serious talk, then potentially dead
- Explicitly says not interested → Dead (ask for referrals first)

### When to Drop an Agent (Post-ICA)
This is harder. You invested time. But:
- Misses 2+ onboarding sessions without rescheduling → Direct conversation
- Goes dark for 7+ days during onboarding → "Are you in or out?" call
- Refuses internal consumption (won't become a client) → Release
- Shows up unprepared 3+ times → Release with door open for future

**The Release Script:**
```
"[Name], I want to be straight with you. The system works, but 
it requires consistency — and right now I'm not seeing that from 
you. I'm not mad and I'm not giving up on you, but I can't 
invest more time until you're ready to invest yours. When that 
changes, call me. The door is open."
```

---

## Red Flags & Green Flags (Quick Reference)

### 🔴 Red Flags (Any Stage)
- Goes dark for 48+ hours without explanation
- Blames everyone else for lack of progress
- "I'll get to it when I have time"
- Constantly reschedules
- Asks about money before doing any work
- Won't follow the system ("I have my own way")
- Complains about homework/reading
- Negative talk about other agents or the company

### 🟢 Green Flags (Any Stage)
- Completes homework early
- Asks "what else can I do?"
- Texts updates without being asked
- Shows up 5 minutes early
- References the book unprompted
- Already talking to people on their list before being told to
- Brings energy, not excuses
- Takes notes during every session

---

## Weekly Pipeline Review

**Every Monday morning, Gary reviews:**

### Recruiting Pipeline Health
| Stage | Count | Stuck (>3 days)? | Action Needed |
|-------|-------|-------------------|---------------|
| New Lead | | | |
| First Contact | | | |
| iDecide Sent | | | |
| Overview Complete | | | |
| Zoom Scheduled | | | |
| ICA Sent | | | |
| **Total Active** | | | |

### Activation Pipeline Health
| Stage | Agent Name | Days in Stage | On Track? | Next Action |
|-------|-----------|---------------|-----------|-------------|
| Onboarding 1 | | | | |
| Onboarding 2 | | | | |
| Onboarding 3 | | | | |
| Ambassador Training | | | | |
| Field Training | | | | |
| Producing Agent | | | | |

### Key Metrics
| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| New leads imported | | | |
| First contacts made | | | |
| iDecide presentations sent | | | |
| Zooms completed | | | |
| ICAs signed | | | |
| Agents in onboarding | | | |
| Agents in field training | | | |
| Solo closes (team) | | | |
| New recruits (from agents) | | | |

---

## Monthly Metrics (Track in Tevah)

| Metric | Target | Actual |
|--------|--------|--------|
| Personal recruits | 10/month | |
| Licensing ratio (recruited → licensed) | 50% | N/A (Track A already licensed) |
| Activation ratio (ICA → first close) | 30% | |
| Points per recruit | 5,000 | |
| Agent retention (90-day) | 40% | |
| Agents reaching CFT | 10% of recruits | |

---

## Re-Engagement Pool

Leads who went cold but weren't explicitly "not interested."

**Monthly drip (Ringy automation):**
```
"Hey [First Name], it's Gary. When we connected a while back 
the timing wasn't right. Just checking — has anything changed? 
We're growing fast and I've got a spot if you're ready."
```

**Rules:**
- Max 3 re-engagement attempts (monthly spacing)
- If they respond → restart at Stage 2
- After 3 attempts with no response → permanently archive

---

*This tracker works alongside the Recruiting OS (garys-recruiting-os.md) and Agent Activation OS (agent-activation-os.md). All three documents form Gary's complete system.*
