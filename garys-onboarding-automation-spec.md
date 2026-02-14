# Gary's Automated Onboarding Flow — Final Spec
## Last Updated: 2026-02-13

**Updated to reflect Coach DC's 3-Part Onboarding System (Prolific, Feb 2026)**

---

## SYSTEM OVERVIEW

DC met with Matt Welsh (Field Chairman) — first system update in 4 years. Streamlined ~80% of old content. The system has 3 onboarding stages with clear triggers and outcomes.

### Pipeline Stages (Prolific System)
1. **ICA Signed** — Associate agreement ($199 paid)
2. **Exam Scheduled** — Target 7-10 days out
3. **Onboarding 1** — Client Experience (within 48h of agent code)
4. **Licensed** — Passed state exam
5. **Onboarding 2** — Business Plan + Grand Opening Prep
6. **Grand Opening Scheduled**
7. **Grand Opening Complete**
8. **Onboarding 3** — Post-Grand Opening (the missing piece)
9. **Field Training** — Real appointments, product ed happens here
10. **Net Licensed / CFT** — Certified Field Trainer
11. **Independent** — Fully producing, building downline

---

## TRIGGER
ICA submitted + $199 paid
- Detected via: GHL tag `ica-signed` (auto or manual)
- Karen (DC's assistant) sends welcome email same day
- 7-Day SMS Drip activates (see `ghl-7day-drip-spec.md`)

---

## ONBOARDING 1 — Client Experience (Personal, 1-on-1)

**When:** Within 48 hours of getting agent code  
**Duration:** 45-90 min (don't rush — "we can't microwave leaders")  
**Can split into 2 sessions if needed**

### What Happens:
1. Schedule exam (7-10 days out)
2. Client experience walkthrough (4 buckets, IUL Family Bank, flagship products)
3. Practice what you preach — get them on GFI products
4. For already-licensed agents: "You're starting ahead — you get to skip licensing boxes"
5. Income protection policy using **Ethos**
6. Tell them what's next: "Tuesday, your first class is orientation"

### Key Principle — Baby Analogy:
> "Most important days are the first 7. Text me every day, I text you every day."

### Path A: NOT Licensed
- Study prep materials → connect with licensing dept (Karen) → schedule exam → proceed after passing

### Path B: Already Licensed (Gary's typical recruit)
- Skip licensing → straight to client experience → Onboarding 2

---

## ONBOARDING 2 — Business Plan (After License)

**When:** After agent passes exam and completes post-licensing  
**Purpose:** Set the trajectory

### What Happens:
1. Build business plan
2. **Set grand opening date**
3. Set net license date target
4. Set CFT date target
5. Deliberate intention — plan to go ballistic on appointments after grand opening

### Grand Opening Prep:
- Guest list building (target: 100 invites)
- 3-way texts with warm market
- Social media promo
- Spouse involvement confirmed
- See Grand Opening Factory in dashboard

---

## ONBOARDING 3 — Post-Grand Opening (THE BREAKTHROUGH)

**When:** After Grand Opening is complete  
**This is the piece DC never had for 4 years**

> "If we get them to Onboarding 3, they'll be an EMD"

### Why It Works:
Agent has already done all the awkward stuff:
- 3-way texts ✅
- Became a client ✅
- Spouse meeting ✅
- Grand opening ✅

### What Happens:
1. Teach the SYSTEM: compensation, contracts, 5 ways to gain clients
2. System progression tracker
3. Action steps: 3-way texts with CPAs, teachers, tax preparers
4. Scripts for objections (spouse needed? MLM? buy anything?)
5. Field training begins immediately
6. Post-Grand Opening SMS drip activates (see `ghl-post-grand-opening-spec.md`)

### What Does NOT Happen:
- No product training (that's field training)
- No carrier education (that's Thursday T2, only after net license)
- Keep mindset on **rapid expansion**, not products

---

## 7-DAY FILTER
- Applied from ICA date
- "Engaged" = listened to Building an Empire (homework) AND attended orientation
- If not engaged in 7 days → deprioritize (don't mute, match with someone else)
- 7-Day SMS Drip keeps them warm (see `ghl-7day-drip-spec.md`)

---

## STEP 2: WITHIN 1 HOUR — "Expect the Pushback" Email
All text, beautifully formatted. Contains:
1. **Inoculation content** — how friends/family will react, how to handle it
2. **Building an Empire audiobook link**: https://drive.google.com/file/d/1ZsPw1zyX104g9w7RINqBMSYHxhnhIAxW/view?usp=sharing
3. **Calendly link to book Onboarding 1**: https://api.leadconnectorhq.com/widget/bookings/gary-cosby-jr-personal-calendar-kd5a-po0d

---

## FIELD TRAINING
- Scheduled through calendar link
- Run by Gary + sidelines/uplines + CFTs
- Real appointments, real exposure
- **This is where product education happens** — not Zoom classes
- Number before independence varies per person
- "The faster I get people to exposures, the less skepticism they have"

---

## T3 / T2 TRAINING STRUCTURE

### Tuesday T3 (Team Training) — 6 Breakout Rooms Max:
1. **Orientation** — industry overview, GFI story, company vision
2. **Grand Opening** — prep, scripts, practice
3. **Onboarding 1** — system walkthrough (taught by MDs/EMDs)
4. **Onboarding 2** — business plan class
5. **Onboarding 3** — post-grand opening, field training, expansion
6. (Optional — prospecting, social media, etc.)

### Thursday T2 (Technical Training):
- Carrier trainings, product education
- **Only for net licensed+ agents** — don't send new agents here
- Keep new agent mindset on rapid expansion

---

## GHL AUTOMATION WORKFLOWS

| # | Workflow | Spec File | Trigger |
|---|---------|-----------|---------|
| 1 | New Lead Welcome | (existing in GHL) | New contact |
| 2 | New ICA Welcome Sequence | (existing in GHL) | Tag: `ica-signed` |
| 3 | iDecide Follow-Up | (existing in GHL) | Tag: `idecide-finished` |
| 4 | 7-Day New Agent SMS Drip | `ghl-7day-drip-spec.md` | Tag: `ica-signed` |
| 5 | Post-Grand Opening Drip | `ghl-post-grand-opening-spec.md` | Tag: `grand-opening-complete` |
| 6 | Mid-Month Check-In | `ghl-midmonth-checkin-spec.md` | 15th monthly, 10 AM |
| 7 | Stall Alert | `ghl-stall-alert-spec.md` | Contact stalled >48h |
| 8 | Missed Call Auto-Response | `ghl-missed-call-spec.md` | Missed call |

---

## ONGOING AUTOMATION
- **PhoneZones**: Mondays 8 PM EST (+ Sundays after church for base shop)
- **Mid-month check-ins**: 15th of every month (see `ghl-midmonth-checkin-spec.md`)
- **Donna tracks pipeline** — alerts Gary if someone stalls >24h without a next step
- **Milestone texts**: After each step, auto-send next step instructions + scheduling link

---

## KEY TOOLS
- **GHL (GoHighLevel)**: CRM, pipeline automation, SMS/email workflows
- **Ringy**: Legacy SMS (being migrated to GHL)
- **iDecide**: Interactive presentations (GFI + Welcome to GFI)
- **Tevah**: Digital PFR (beta — don't blanket rollout yet, March/April/May)
- **Agency Rocket**: Webinar + comparison tool
- **Ethos**: Income protection policy
- **Building an Empire**: Audiobook (Google Drive) — homework/filter
- **Donna (Telegram)**: Pipeline alerts, status tracking, Gary notifications
- **Onboarding Dashboard**: Next.js app at `/onboarding-system/`

---

## WHAT GARY DOES (everything else is automated):
1. Run Onboarding 1 (1-on-1, Zoom)
2. Run Onboarding 2 (1-on-1 or small group, Zoom)
3. Run/attend Grand Openings
4. Run Onboarding 3 (can delegate to CFTs/MDs)
5. Run/assign field training appointments
6. Show up for PhoneZones
7. Reply to agent texts (the drips start the conversation)

**Everything else = Donna + GHL automation.**
