# New Agent Automation — Donna's Playbook

## When Gary Says "signed [Name]" or "new ICA [Name]"

### Step 1: Parse the Info (Immediate)
Extract from Gary's message:
- Agent name
- Phone number (if provided)
- Email (if provided)
- Any notes

### Step 2: Welcome Text via Ringy (Within 5 minutes)
1. Open Ringy browser: https://app.ringy.com/home/sms
2. Search for agent by name or phone
3. If not found → create contact
4. Send welcome text:

> Hey [NAME]! 🎉 Welcome to the team — this is Gary's number. I'm excited to get you started. Check your email in the next hour — I'm sending you something important to read before our first training session. Let's go! 💪

### Step 3: "Expect the Pushback" Email (Within 1 hour)
1. Open Gmail: wearegfi@oocunlimited.com
2. Compose new email to agent
3. Subject: "Before our next meeting — read this first"
4. Body: Use template from `expect-the-pushback-email.md`
5. Replace [FIRST NAME] with agent's first name
6. Send

### Step 4: Pipeline Tracking
1. Add agent to `onboarding-pipeline-tracker.md`
2. Set Stage: 1 (ICA Submitted) → immediately advance to 2 (Welcome Text Sent) → then 3 (Email Sent)
3. Record timestamp for each

### Step 5: Set Follow-Up Reminders
1. Create cron job: 24 hours later → check if CE Part 1 booked
2. Create cron job: 7 days later → engagement filter check

### Step 6: Confirm to Gary
Send on Telegram:
> ✅ [NAME] — automation started:
> • Welcome text sent via Ringy
> • "Expect the Pushback" email sent with audiobook + Calendly link
> • Pipeline tracking active
> • 24-hour follow-up set
> • 7-day engagement check set

---

## Stall Check Protocol (runs daily)

For each active agent in pipeline:
1. Check current stage and time in stage
2. If exceeds stall threshold → alert Gary on Telegram:

> ⚠️ Pipeline Stall: [NAME]
> Stage: [STAGE NAME]
> Days stalled: [X]
> Last action: [DESCRIPTION]
> Recommendation: [ACTION]

## Advancement Protocol

When Gary completes a stage (CE Part 1, CE Part 2, etc.):
1. Gary tells Donna: "[Name] completed CE Part 1"
2. Donna advances pipeline stage
3. Donna sends next milestone text via Ringy
4. Donna sends next booking link
5. Donna confirms to Gary

---

## Quick Reference: All Text Templates

### Welcome (Stage 2)
> Hey [NAME]! 🎉 Welcome to the team — this is Gary's number. I'm excited to get you started. Check your email in the next hour — I'm sending you something important to read before our first training session. Let's go! 💪

### 24hr Follow-up (if CE Part 1 not booked)
> Hey [NAME], checking in — did you get to start the audiobook? Book your first training when you're ready: https://api.leadconnectorhq.com/widget/bookings/gary-cosby-jr-personal-calendar-kd5a-po0d 🔥

### CE Part 1 Booked (confirmation)
> [NAME] — CE Part 1 confirmed! 🎯 Make sure you've started "Building an Empire" before we meet. See you on Zoom!

### CE Part 1 Reminder (1hr before)
> Reminder: CE Part 1 in 1 hour! Come ready. This is where we show you how the business works. 🔥

### After CE Part 1
> Great session today [NAME]! 🙌 Book CE Part 2 here to lock in your financial plan: https://api.leadconnectorhq.com/widget/bookings/gary-cosby-jr-personal-calendar-kd5a-po0d

### After CE Part 2
> [NAME] — real progress! Next: Hands-On Training (HOT) — we practice the 7 Fundamentals together. Scheduling info coming. 💪

### HOT Reminder
> Hey [NAME], HOT session tomorrow at [TIME]. Come ready to practice — "you say it, I say it." 🎯

### PhoneZone Invite
> [NAME] — Monday PhoneZones: 8 PM EST. Where we sharpen skills together. You in? 📞🔥

### 7-Day Not Engaged
> Hey [NAME], just checking in. We haven't connected since you joined. Everything okay? I'm here when you're ready — book time here: https://api.leadconnectorhq.com/widget/bookings/gary-cosby-jr-personal-calendar-kd5a-po0d
