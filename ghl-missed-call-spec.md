# GHL Workflow Spec: Missed Call Auto-Response

## Purpose
Instantly text back anyone whose call Gary misses. No lead left hanging.

## Trigger
- **Type:** Call Status
- **Condition:** Call Status = **Missed** (or "No Answer")
- **Filter:** Inbound calls only

## Actions

### Step 1: Send SMS (Immediate)
- **Type:** Send SMS
- **Content:** `Hey {{contact.first_name}}, sorry I missed your call! I'm with a client right now but I'll call you back ASAP. If it's easier, just text me what you need. - Gary`

### Step 2: Internal Notification (Immediate)
- **Type:** Internal Notification
- **To:** Gary Cosby
- **Message:** `📞 Missed call from {{contact.first_name}} {{contact.last_name}} ({{contact.phone}}) — auto-response sent.`

### Step 3: Wait 30 Minutes (30 min)

### Step 4: If/Else — Check if Gary Called Back
- **If:** Outbound call made to this contact in last 30 min → END
- **Else:** Continue to Step 5

### Step 5: Reminder Notification
- **Type:** Internal Notification
- **Message:** `⚠️ Still haven't called back {{contact.first_name}} {{contact.last_name}} ({{contact.phone}}). It's been 30 min since their missed call.`

### Step 6: END

## Notes
- This is the highest-ROI workflow — speed to lead is everything
- First-name personalization only works if the contact exists in GHL
- For unknown numbers: consider a fallback message without {{contact.first_name}} → "Hey, sorry I missed your call! I'll ring you back shortly. - Gary"
- Average missed-call-to-callback time in insurance: 47 minutes. This workflow cuts it to near-instant.

## Build Time
~3 minutes in GHL workflow builder.
