# Ringy Browser Automation Scripts

## Overview
Ringy has no API. All automation must happen via browser automation (OpenClaw browser control).
These scripts automate the key actions in Gary's onboarding pipeline.

**Ringy URL:** https://app.ringy.com
**Login:** garycosbyjr@gmail.com / Start345
**Gary's Ringy Phone:** 321-386-6527

---

## Script 1: Send Welcome Text to New Agent

### Trigger
Gary says "signed [Name]" or new ICA detected

### Steps (Browser Automation)
1. Navigate to `https://app.ringy.com/home/sms`
2. Search for contact by name or phone number
3. Click on the contact to open conversation
4. Type welcome message in text input
5. Click send

### Welcome Message Template
```
Hey [NAME]! 🎉 Welcome to the team — this is Gary's number. I'm excited to get you started. Check your email in the next hour — I'm sending you something important to read before our first training session. Let's go! 💪
```

### Donna's Automation Flow
```
1. Gary texts Donna: "signed John Smith 407-555-1234"
2. Donna parses name + phone
3. Donna opens Ringy in browser
4. Donna searches for contact (or creates if new)
5. Donna sends welcome text
6. Donna triggers "Expect the Pushback" email (via Gmail)
7. Donna updates pipeline tracker
8. Donna confirms to Gary on Telegram: "✅ John Smith — welcome text sent, email queued, pipeline started"
```

---

## Script 2: Update Contact Status in Ringy

### Steps
1. Navigate to contact in Ringy
2. Click on contact to open profile
3. Find status/disposition dropdown
4. Update to appropriate stage:
   - "ICA'd" → New agent, just signed
   - "Onboarding" → In CE Part 1/2
   - "Training" → In HOT or field training
   - "Active" → Independent/producing
   - "Stalled" → 7-day filter failed

---

## Script 3: Send Milestone Text

### Templates by Stage

**After CE Part 1 booked (confirmation):**
```
[NAME] — CE Part 1 confirmed for [DATE/TIME]! 🎯 Make sure you've started listening to Building an Empire before we meet. See you on Zoom!
```

**1 hour before CE Part 1:**
```
Reminder: Your CE Part 1 training is in 1 hour! Zoom link: [LINK]. Come ready to learn how this business actually works. 🔥
```

**After CE Part 1 (send CE Part 2 link):**
```
Great session today [NAME]! 🙌 Next step: book CE Part 2 so we can lock in your financial plan. Book here: [Calendly link]. Let's keep this momentum!
```

**After CE Part 2 (send HOT info):**
```
[NAME] — real progress. Next: Hands-On Training where we practice the 7 Fundamentals. I'll send scheduling options. You're closer than you think. 💪
```

**PhoneZone invite:**
```
[NAME] — Monday PhoneZones: 8 PM EST every Monday. This is where we sharpen skills together. You in? 📞🔥
```

---

## Script 4: 24-Hour Follow-Up Check

### Logic
- 24 hours after "Expect the Pushback" email sent
- Check if CE Part 1 has been booked (Calendly webhook or manual check)
- If NOT booked → send follow-up text:

```
Hey [NAME], just checking in — did you get a chance to start the audiobook? When you're ready, book your first training here: [Calendly link]. The sooner we meet, the sooner you start earning. 🔥
```

---

## Script 5: 7-Day Engagement Check

### Logic
- 7 days after ICA date
- Check: Has agent booked/attended CE Part 1? Started audiobook?
- If YES → continue active pipeline
- If NO → alert Gary:
  ```
  ⚠️ 7-Day Check: [NAME] has not engaged since ICA.
  No CE Part 1 booked. No audiobook started.
  Recommendation: Deprioritize or match with another mentor.
  ```

---

## Implementation Notes

### Browser Automation via OpenClaw
All Ringy interactions use OpenClaw's browser control:
- Profile: "openclaw" (managed browser)
- Login session should persist between automations
- Use `browser.snapshot` to find elements, `browser.act` to interact
- Ringy loads slowly — add waits after navigation

### Email via Gmail
"Expect the Pushback" email sent through Gary's Google Workspace:
- Account: wearegfi@oocunlimited.com
- Can use browser automation on Gmail or Google Apps Script
- HTML formatting preferred for the email template

### Pipeline State
Track in `onboarding-pipeline-tracker.md` (manual for now)
Future: JSON state file for automated tracking

### Trigger Detection
For now: Gary texts Donna "signed [Name]" on Telegram
Future: Monitor email for ICA payment notifications
