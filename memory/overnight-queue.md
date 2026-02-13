# Overnight Queue — 2026-02-12 (Updated 5:30 PM)

## PRIORITY 1: Finish "New ICA Welcome Sequence" Workflow

Workflow URL: https://app.gohighlevel.com/location/Gy0H1V7ydacMTFYcNz2f/workflow/fbf36d0e-fd7c-49fd-a556-8d5a370e5f4d

### Current state (built so far):
- Trigger: "Customer booked appointment" (WRONG — Gary needs to swap to Contact Tag `ica-signed`)
- Email action (unconfigured — needs to be "Expect the Pushback" email with audiobook link + CE Part 1 booking link backup)
- Welcome SMS ✅ — "Welcome to the team, {{contact.first_name}}! Check your email - I just sent over some important next steps. - Gary"
- Wait 24 Hours ✅ — 1440 minutes
- Check-In SMS ✅ — "Hey {{contact.first_name}}, how are you feeling about everything? Any questions coming up? I'm here. - Gary"

### Still need to add:
1. Wait 48 Hours (2880 minutes) — after Check-In SMS
2. Nudge SMS — "Hey {{contact.first_name}}, just checking in. Did you get a chance to listen to that audiobook? It'll change the way you think about this business. - Gary"
3. Configure Email action as "Expect the Pushback" — subject: "Welcome to GFI - Read This Before Anything Else", body: inoculation content + audiobook link + CE Part 1 booking link
4. Note: Email and SMS both fire immediately (no wait between them), order is cosmetic for immediate actions

### Order issue:
- Current order: Email → Welcome SMS → Wait 24h → Check-In SMS → END
- Ideal: Welcome SMS → Email → Wait 24h → Check-In SMS → Wait 48h → Nudge SMS → END
- Since Email and Welcome SMS both fire immediately with no wait, order doesn't matter functionally
- Just need to add the remaining Wait 48h + Nudge SMS after Check-In SMS

### Gary's tasks (triggers — can't be done by browser automation):
- Swap trigger from "Customer booked appointment" to Contact Tag → `ica-signed`
- Swap iDecide Follow-Up trigger from "ICA Signed Tag" to "iDecide Finished"

## PRIORITY 2: iDecide Follow-Up Workflow (PARKED)
- Workflow ID: caabfce7-4900-4a38-9cc8-4520a93f050d
- Actions are complete: Wait 24h → iDecide Follow-Up SMS → Wait 24h (2) → Book Interview SMS → END
- Trigger needs swapping: Gary removing "ICA Signed Tag", adding "iDecide Finished" from iDecide GHL integration
- BLOCKED on Gary's iDecide/GHL account issue (different GHL account conflict)
- Future v2: Add If/Else branches based on iDecide viewer choices (which sections they clicked)

## PRIORITY 3: Remaining Workflows (need Gary's triggers)
- Post-ICA Onboarding → being built as "New ICA Welcome Sequence" (above)
- Stall Alert — Contact Stale/Idle → 3 days → internal notification
- Missed Call Auto-Response — Call Status → Missed → immediate SMS

## PRIORITY 4: Add "tag cold-lead" action to Workflow 1 (New Lead Welcome) before END

## PRIORITY 5: GHL email domain setup (oocunlimited.com SPF/DKIM/DMARC)

## KEY CONTEXT FROM TODAY
- iDecide is for RECRUITING (pre-ICA), not post-ICA onboarding
- Gary sent full iDecide training transcript from Zoom call with Mike (iDecide founder/CEO)
- 6 iDecide presentations available; "GFI Difference" is Gary's use case (recruiting licensed reps)
- iDecide GHL integration: triggers for Started/Finished, actions for choices made
- iDecide has built-in 1/3/5 day reminders already
- Gary's CE Part 1 should be booked during the interview call (not via automation)
- Welcome SMS should point to check email (Gary's instruction)
- Cannot open browser during overnight builds — finish remaining 2 actions via API if possible, otherwise early morning browser session
