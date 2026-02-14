# GHL Workflow Spec: Post-Grand Opening (Onboarding 3)

**Created:** 2026-02-13  
**Status:** Ready to Build  
**GHL Location:** Gy0H1V7ydacMTFYcNz2f

---

## Purpose

DC's breakthrough: "If we get them to Onboarding 3, they'll be an EMD." This is the piece that was missing for 4 years. After Grand Opening, the agent has done all the awkward stuff (3-way texts, became a client, spouse meeting, grand opening). Now it's about field training and expansion ONLY. No product training — that happens in the field.

## Trigger

- **Type:** Contact Tag Added
- **Tag:** `grand-opening-complete`

## Workflow Steps

### Day 0 — Congratulations (Immediate)

**Wait:** 0 minutes  
**SMS:**
```
{{contact.first_name}} CONGRATS on your Grand Opening!! 🎉 That was huge. Now the real work begins. I'm pumped for what's next. -Gary
```
*(131 chars)*

---

### Day 1 — Field Training Push (24h)

**Wait:** 24 hours  
**SMS:**
```
Let's book your first 3 field training appointments this week. Who are 3 people you can sit down with? Send me names. -Gary
```
*(123 chars)*

---

### Day 2 — System Tracker (48h)

**Wait:** 24 hours  
**SMS:**
```
Check your system progression tracker — it shows exactly where you are and what's next. {{custom_values.tracker_link}} -Gary
```
*(~120 chars with link)*

**Note:** `tracker_link` custom value should be set when Grand Opening is created. Can point to onboarding dashboard or Google Sheet.

---

### Day 3 — Expansion (72h)

**Wait:** 24 hours  
**SMS:**
```
Quick question — who are 3 CPAs or tax preparers you know? Send me their names. We're going to do 3-way texts this week. -Gary
```
*(126 chars)*

---

### Day 5 — Field Training Check-In (120h)

**Wait:** 48 hours  
**SMS:**
```
How are those field training appointments coming? Did you book the 3? Let me know what you need. -Gary
```
*(101 chars)*

---

### Day 7 — Debrief (168h)

**Wait:** 48 hours  
**SMS:**
```
How did your first field training go? Let's debrief. When can you hop on a quick Zoom? -Gary
```
*(91 chars)*

---

### Day 14 — Mid-Month Pulse (336h)

**Wait:** 168 hours  
**SMS:**
```
{{contact.first_name}} — 2 week check. Where are you at? What do you need from me? Let's make sure you stay on track. -Gary
```
*(120 chars)*

---

## What This Drip Does NOT Cover

- Product training (happens in field, not via text)
- Carrier-specific education (that's Thursday T2 trainings)
- Compensation plan details (covered in Onboarding 3 live session)

## Post-Workflow Actions

After Day 14:
- Add tag `onboarding-3-complete`
- Add tag `field-training-active`
- Agent moves to ongoing monthly check-in workflow

## GHL Build Checklist

- [ ] Create workflow in GHL
- [ ] Set trigger: Tag Added → `grand-opening-complete`
- [ ] Add 7 SMS steps with wait timers
- [ ] Create custom value `tracker_link`
- [ ] Enable reply notifications
- [ ] Test with Gary's own contact
- [ ] Publish workflow
