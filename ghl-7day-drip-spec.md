# GHL Workflow Spec: 7-Day New Agent SMS Drip

**Created:** 2026-02-13  
**Status:** Ready to Build  
**GHL Location:** Gy0H1V7ydacMTFYcNz2f

---

## Purpose

First 7 days after ICA are the most critical (DC's "baby analogy"). This drip keeps Gary top-of-mind and builds momentum toward exam day. Every message should feel like Gary personally texting — not a bot.

## Trigger

- **Type:** Contact Tag Added
- **Tag:** `ica-signed`
- **Filters:** None (all new ICAs get this)

## Workflow Steps

### Day 0 — Welcome (Immediate)

**Wait:** 0 minutes  
**SMS:**
```
Hey {{contact.first_name}}! Welcome to the team 🔥 First 7 days are everything. I'm texting you every day this week — text me back every day too. Let's go! -Gary
```
*(156 chars)*

---

### Day 1 — Exam Prep (24h)

**Wait:** 24 hours  
**SMS:**
```
{{contact.first_name}} your exam is coming up — you got this. Start studying today even if it's just 30 min. What questions do you have? -Gary
```
*(139 chars)*

---

### Day 2 — Check-In (48h)

**Wait:** 24 hours  
**SMS:**
```
Day 2! How's it going? Hit any roadblocks? I'm here. Just text me back. -Gary
```
*(78 chars)*

---

### Day 3 — Social Proof (72h)

**Wait:** 24 hours  
**SMS:**
```
Fun fact — agents who pass their exam in the first 7 days are 3x more likely to hit $10K month one. You're on track 💪 -Gary
```
*(124 chars)*

---

### Day 4 — Onboarding 1 Reminder (96h)

**Wait:** 24 hours  
**SMS:**
```
Quick reminder — we've got your Onboarding 1 meeting coming up. That's where the magic starts. Make sure you're there! -Gary
```
*(124 chars)*

---

### Day 5 — Spouse Involvement (120h)

**Wait:** 24 hours  
**SMS:**
```
Hey have you told your spouse about what we're building? They need to be at our next meeting. It makes a huge difference. -Gary
```
*(126 chars)*

---

### Day 6 — Exam Encouragement (144h)

**Wait:** 24 hours  
**SMS:**
```
Almost exam time! Review your weak spots tonight. You're more ready than you think. I believe in you. -Gary
```
*(104 chars)*

---

### Day 7 — Day Before Exam (168h)

**Wait:** 24 hours  
**SMS:**
```
Tomorrow's the big day! Get some rest tonight. You've put in the work. Go crush it and text me when you pass 🎉 -Gary
```
*(117 chars)*

---

## Implementation Notes

1. **Voice:** Casual, encouraging, personal. Gary's actual texting style — short sentences, emojis sparingly, always signs "-Gary"
2. **Reply handling:** Any inbound reply should notify Gary via internal notification (GHL → Telegram webhook or GHL mobile app)
3. **Stop condition:** If contact replies "stop" or tag `ica-cancelled` is added, remove from workflow
4. **Custom values:** If exam date is stored as custom field `exam_date`, Day 1 message can be personalized further
5. **Concept:** "Text me every day, I text you every day" — DC's principle. The drip initiates Gary's side; Gary should actually reply to responses

## GHL Build Checklist

- [ ] Create workflow in GHL
- [ ] Set trigger: Tag Added → `ica-signed`
- [ ] Add 8 SMS steps with wait timers
- [ ] Set sender number (LC Phone or Twilio)
- [ ] Enable reply notifications
- [ ] Test with Gary's own contact
- [ ] Publish workflow
