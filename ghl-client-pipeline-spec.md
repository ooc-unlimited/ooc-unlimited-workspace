# GHL Client Pipeline & Workflow Spec
## OOC Unlimited — Client Acquisition Flow

### Purpose
Separate pipeline for **clients** (not recruits). Tracks from lead → policy issued → referrals. Used for:
- Paid ad leads (future)
- Agent field training appointments
- Warm market referrals
- Walk-in/direct clients
- Tap root referrals from existing clients

---

## Pipeline: "Client Pipeline"

### Stages

| # | Stage | Description | Auto-Actions |
|---|-------|-------------|--------------|
| 1 | **New Lead** | Lead comes in (ad, referral, warm market, agent tap root) | Welcome SMS, assign to agent |
| 2 | **Appointment Scheduled** | PFR/client experience booked | Calendar confirmation, reminder SMS 24h + 1h before |
| 3 | **Client Experience** | PFR completed, needs identified | Tag with product type (IUL/Term/WL/Annuity/FE) |
| 4 | **Application Submitted** | App sent to carrier | Notification to agent + Gary |
| 5 | **Underwriting** | Carrier reviewing | Weekly status check SMS to client |
| 6 | **Policy Issued** | Approved, commission pending | Congratulations SMS + delivery scheduling |
| 7 | **Delivered / In Force** | Policy delivered, in force | Thank you SMS + referral ask (Day 3) |
| 8 | **Referral Follow-Up** | Ask for 3 referrals | Referral request sequence (Day 3, 7, 14) |

---

## Tags

| Tag | Purpose |
|-----|---------|
| `client-lead` | Entered client pipeline |
| `product-iul` | IUL prospect |
| `product-term` | Term prospect |
| `product-wl` | Whole life prospect |
| `product-annuity` | Annuity prospect |
| `product-fe` | Final expense prospect |
| `appointment-set` | Has appointment on calendar |
| `app-submitted` | Application with carrier |
| `policy-issued` | Policy approved |
| `delivered` | Policy delivered |
| `referral-asked` | Referral sequence triggered |
| `referral-received` | Gave referral(s) |
| `hot-lead` | High priority / urgent |
| `paid-ad` | Came from paid advertising |
| `warm-market` | Came from warm market |
| `tap-root` | Came from existing client referral |
| `agent-field-training` | Agent's field training appointment |

---

## Custom Fields

| Field | Type | Purpose |
|-------|------|---------|
| `Carrier` | Dropdown | F&G, Ameritas, Corebridge, Ethos, SBLI, North American, OneAmerica, Lincoln, MOO |
| `Product Type` | Dropdown | IUL, Term, Whole Life, Final Expense, Annuity, GUL, LTC |
| `Premium` | Currency | Monthly/annual premium |
| `Face Amount` | Currency | Death benefit / coverage amount |
| `Commission Est.` | Currency | Estimated commission |
| `Assigned Agent` | Text | Which agent owns this client |
| `Lead Source` | Dropdown | Paid Ad, Warm Market, Tap Root, Referral, Grand Opening, Cold Call |
| `Referrals Given` | Number | How many referrals this client provided |
| `Spouse Name` | Text | For household approach |

---

## Workflows

### Workflow 1: New Client Lead Welcome
**Trigger:** Contact added to "Client Pipeline" stage "New Lead"

**Actions:**
1. **Immediately** — SMS: "Hey [first_name], this is Gary with OOC Unlimited. Looking forward to helping you and your family get ahead financially. I'll be reaching out shortly to schedule a time for us to sit down. Talk soon! 🙏"
2. **+5 min** — Internal notification to Gary (email or Telegram)
3. **+1 hour** — If no appointment set, SMS: "Quick question — what works better for you, a weekday evening or weekend morning? I want to make sure we find a time that works for both you and your spouse."
4. **+24 hours** — If still no appointment, SMS: "Hey [first_name], just following up. Want to make sure we get your financial checkup on the calendar. What does this week look like?"

### Workflow 2: Appointment Reminders
**Trigger:** Appointment scheduled on "Client Experience" calendar

**Actions:**
1. **-24 hours** — SMS: "Hey [first_name], just a reminder about our meeting tomorrow at [time]. Please make sure [spouse_name] can join — it's important we're both on the same page. See you then!"
2. **-1 hour** — SMS: "See you in an hour! If anything changed, just let me know. Otherwise, I'm looking forward to it. 🙌"
3. **No-show +15 min** — SMS: "Hey [first_name], I had us down for [time] today. Everything okay? Let me know if we need to reschedule — no worries at all."

### Workflow 3: Post-Client Experience Follow-Up
**Trigger:** Moved to "Application Submitted" stage

**Actions:**
1. **Immediately** — SMS: "Great news, [first_name]! Your application is submitted. The carrier will review everything and we should hear back within [X] days. I'll keep you posted every step of the way."
2. **+7 days** — If still in "Underwriting": SMS: "Quick update — your application is still in review. No news is usually good news. I'll reach out the moment I hear something."
3. **+14 days** — If still in "Underwriting": SMS: "Still waiting on the carrier. I'm staying on top of it. Hang tight — we're close."

### Workflow 4: Policy Delivered + Referral Sequence
**Trigger:** Moved to "Delivered / In Force" stage

**Actions:**
1. **Immediately** — SMS: "Congratulations, [first_name]! 🎉 Your policy is officially in force. You and your family are now protected. It was a pleasure working with you."
2. **+3 days** — SMS: "Hey [first_name], quick favor — who are 3 people in your life (family, friends, coworkers) who might benefit from the same kind of financial checkup we did? Just first names is fine. I'll take great care of them just like I did with you."
3. **+7 days** — If no referrals: SMS: "Hey [first_name], hope you're feeling good about the policy! Real quick — any friends or family come to mind who might need a financial checkup? Even one name helps. 🙏"
4. **+14 days** — If still no referrals: SMS: "Last follow-up on this — if anyone ever comes to mind who could use help with their finances, just shoot me their name. No pressure at all. You're taken care of either way! 💪"
5. **Tag:** `referral-asked`

### Workflow 5: Paid Ad Lead (Future)
**Trigger:** Tag `paid-ad` added

**Actions:**
1. **Immediately** — SMS: "Hey [first_name]! Thanks for your interest. I'm Gary, a financial specialist here in [city]. I help families make sure they're protected and building wealth the right way. When's a good time for a quick 15-min call?"
2. **+5 min** — Voicemail drop (if available in GHL)
3. **+30 min** — Email: Welcome + what to expect
4. **+4 hours** — If no reply, SMS: "Just wanted to make sure you saw my message. No pressure — just here to help when you're ready."
5. **+24 hours** — If no reply, SMS: "Hey [first_name], I know life gets busy. If now's not the right time, no worries. But if you want to chat about getting your finances on track, I'm here. 🙌"
6. **Speed to lead:** Goal is response within 5 minutes of ad lead coming in

---

## Referral Loop (The Money Machine)

DC's system: Every client → 3 referrals → 1 becomes a recruit

```
Client Experience
    → Policy Issued
    → Ask for 3 Referrals (Day 3, 7, 14)
    → Each referral enters "New Lead" stage
    → Tag: tap-root
    → 1 out of 3 referrals → becomes agent recruit
    → New recruit enters RECRUITING pipeline
    → Repeat
```

This is how you scale without cold prospecting. Every client is a lead generator.

---

## Calendar: "Client Experience"

- **Name:** Client Experience / Financial Review
- **Duration:** 90 minutes (per DC's updated system — don't rush it)
- **Availability:** Mon-Sat, 9AM-7PM
- **Buffer:** 30 min between appointments
- **Confirmation:** Auto SMS + email
- **Reminder:** 24h + 1h before
- **Note:** "Please have your spouse present. This is a financial checkup for your household."

---

## Integration with Recruiting Pipeline

When a client referral shows interest in becoming an agent:
1. Move them from Client Pipeline → Recruiting Pipeline
2. Add tag: `client-to-recruit`
3. Trigger: Recruiting Welcome workflow
4. Track conversion: `Lead Source = Tap Root`

This closes the loop: **Recruit → Train → Field Training (client) → Referral → New Client → Referral → New Recruit**

---

## Setup Steps (Gary)

1. **Create Pipeline** in GHL → Pipelines → + New Pipeline → "Client Pipeline"
2. **Add 8 stages** (copy from table above)
3. **Create custom fields** (Settings → Custom Fields)
4. **Create calendar** "Client Experience" (Calendars → + New)
5. **Build workflows** (Automation → + New Workflow) — start with #1 and #4
6. **Create tags** (Settings → Tags)

Estimated setup time: 20-30 minutes with the GHL Quick Start Guide.

---

*Spec by Donna ⚡ | Feb 13, 2026 | Based on Coach DC's updated Prolific system + Gary's GHL setup*
