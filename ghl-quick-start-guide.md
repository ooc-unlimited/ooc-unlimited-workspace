# GHL Quick-Start Guide — 5 Minutes to Finish Everything

**For Gary — Do this before your first coffee ☕**

Last updated: February 13, 2026, 3:00 AM (by Donna)

---

## Task 1: Fix "New ICA Welcome Sequence" Trigger (30 seconds)

**Workflow:** New ICA Welcome Sequence
**URL:** https://app.gohighlevel.com/location/Gy0H1V7ydacMTFYcNz2f/workflow/fbf36d0e-fd7c-49fd-a556-8d5a370e5f4d

1. Open the workflow
2. Click the **trigger** at the top (currently says "Customer booked appointment")
3. Change trigger type to → **Contact Tag**
4. Set tag to → `ica-signed`
5. Save

**That's it.** The rest of the workflow (Welcome SMS → Email → Wait 24h → Check-In SMS → Wait 48h → Nudge SMS) is already built.

---

## Task 2: Fix "iDecide Follow-Up" Trigger (30 seconds)

**Workflow:** iDecide Follow-Up Sequence
**URL:** https://app.gohighlevel.com/location/Gy0H1V7ydacMTFYcNz2f/workflow/caabfce7-4900-4a38-9cc8-4520a93f050d

1. Open the workflow
2. Click the **trigger** (currently says "ICA Signed Tag")
3. Change to → **Contact Tag** → `idecide-finished`
4. Save

**Note:** This trigger comes from the iDecide GHL integration. Make sure iDecide is connected to THIS GHL location (Gy0H1V7ydacMTFYcNz2f), not the other account.

---

## Task 3: Verify Email Action Content (1 minute)

Still in the "New ICA Welcome Sequence" workflow:

1. Click the **Email** action
2. Subject should be: `Read This Before You Talk to ANYONE About Your New Business`
3. If the body is empty, I've prepared the full HTML below — just paste it into the HTML editor
4. **To get the HTML:** Open https://garylifeindex.com/email-preview — copy from there, or use the file `onboarding-system/src/lib/email-template.ts`

---

## Task 4: Add "cold-lead" Tag to Workflow 1 (30 seconds)

**Workflow:** New Lead Welcome
1. Open the workflow
2. Before the END step, add action: **Add Tag** → `cold-lead`
3. Save

This tags contacts who went through the full welcome sequence without converting, so you can retarget them later.

---

## Task 5: Email Domain Setup (5 minutes — one-time)

For emails to land in inbox instead of spam, oocunlimited.com needs SPF/DKIM/DMARC. Full guide: `email-domain-setup-guide.md`

**Quick version:**
1. Go to GHL → Settings → Email Services → Add Domain → `oocunlimited.com`
2. GHL gives you 3 DNS records (SPF, DKIM, DMARC)
3. Log into Namecheap → Advanced DNS → Add the 3 records
4. Wait 15-60 min for propagation
5. Go back to GHL → Verify

---

## Workflow Status Summary

| # | Workflow | Status | Blocked On |
|---|---------|--------|-----------|
| 1 | New Lead Welcome | ✅ Published | Add `cold-lead` tag (30 sec) |
| 2 | New ICA Welcome Sequence | 🟡 Built, wrong trigger | Gary swaps trigger (30 sec) |
| 3 | iDecide Follow-Up | 🟡 Built, wrong trigger | Gary swaps trigger + iDecide/GHL conflict |
| 4 | Stall Alert | 📋 Spec ready | Build in GHL (see `ghl-stall-alert-spec.md`) |
| 5 | Missed Call Auto-Response | 📋 Spec ready | Build in GHL (see `ghl-missed-call-spec.md`) |

---

**Total time for Tasks 1-4: ~3 minutes.** Task 5 (email domain) is 5 minutes but only needs to happen once.

After you do Tasks 1-2, the core pipeline automation is LIVE:
- New lead → Welcome sequence → cold-lead tag
- iDecide finished → Follow-up sequence → Book interview
- ICA signed → Pushback email + SMS drip → CE Part 1 booking

🔥 Three workflows, zero manual follow-up. The system works while you sleep.
