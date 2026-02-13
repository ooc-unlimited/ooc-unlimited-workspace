# GHL Workflow Spec: Stall Alert (Contact Idle Notification)

## Purpose
Alert Gary when a contact in the pipeline goes silent for 3+ days so no one falls through the cracks.

## Trigger
- **Type:** Contact Stale/Idle
- **Condition:** No activity (email open, SMS reply, form submission, call) for **3 days (4320 minutes)**
- **Filter:** Contact must have tag `ica-signed` (only alert for agents who've started onboarding)
- **Alternative trigger if "Stale" isn't available:** Use a recurring "Every 24 hours" trigger with If/Else checking last activity date

## Actions

### Step 1: Internal Notification (Immediate)
- **Type:** Internal Notification
- **To:** Gary Cosby (or assign to user)
- **Message:** `🚨 Stall Alert: {{contact.first_name}} {{contact.last_name}} has had no activity for 3+ days. Phone: {{contact.phone}}. Last stage: {{contact.tags}}. Follow up now or reassign.`

### Step 2: Send Re-Engagement SMS (Immediate)
- **Type:** Send SMS
- **Content:** `Hey {{contact.first_name}}, I noticed we haven't connected in a few days. Everything good? I want to make sure you're set up for success. Call me when you get a sec. - Gary`

### Step 3: Wait 48 Hours (2880 minutes)

### Step 4: If/Else — Check for Response
- **If:** Contact replied (SMS reply or call in last 48h) → END
- **Else:** Continue to Step 5

### Step 5: Final Nudge SMS
- **Content:** `{{contact.first_name}}, just want you to know I'm still here. The door is always open. When you're ready to pick back up, just text me back. - Gary`

### Step 6: Add Tag → `stalled`

### Step 7: END

## Notes
- The `stalled` tag syncs with the onboarding dashboard (garylifeindex.com shows stalled agents)
- Gary can manually remove `stalled` tag to re-engage
- Do NOT auto-remove from pipeline — people come back weeks/months later
- This workflow replaces manual "check who hasn't responded" — Donna still monitors via dashboard
