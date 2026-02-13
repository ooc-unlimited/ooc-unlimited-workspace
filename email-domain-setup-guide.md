# Email Domain Setup Guide — oocunlimited.com

## Why This Matters
Without SPF/DKIM/DMARC, Gary's onboarding emails ("Expect the Pushback") land in spam. That kills the whole automation.

## Step-by-Step

### 1. Get DNS Records from GHL
1. Log into GHL → https://app.gohighlevel.com
2. Settings (gear icon, bottom left) → **Email Services**
3. Click **"Add Sending Domain"** → enter `oocunlimited.com`
4. GHL generates 3 DNS records. Copy them.

### 2. Add DNS Records in Namecheap
1. Log into Namecheap → https://www.namecheap.com
2. Domain List → `oocunlimited.com` → **Manage** → **Advanced DNS**
3. Add the following records:

**SPF Record:**
| Type | Host | Value |
|------|------|-------|
| TXT | @ | `v=spf1 include:_spf.leadconnectorhq.com ~all` |

**DKIM Record:**
| Type | Host | Value |
|------|------|-------|
| TXT | (GHL provides this — usually `ghl._domainkey`) | (GHL provides the long DKIM value) |

**DMARC Record:**
| Type | Host | Value |
|------|------|-------|
| TXT | _dmarc | `v=DMARC1; p=none; rua=mailto:gary@oocunlimited.com` |

4. Save all records

### 3. Verify in GHL
1. Wait 15-60 minutes for DNS propagation
2. Go back to GHL → Email Services → click **Verify** next to oocunlimited.com
3. All 3 should show green checkmarks ✅

### 4. Set as Default Sending Domain
1. In Email Services, click the ⋯ menu next to oocunlimited.com
2. Select "Set as Default"
3. Now all automated emails send from `gary@oocunlimited.com`

## Verify It Worked
Send a test email from GHL to gmail. Check:
- ✅ Lands in Primary inbox (not spam/promotions)
- ✅ Shows "from gary@oocunlimited.com" (not via leadconnectorhq)
- ✅ Click the ⋮ menu → "Show original" → SPF: PASS, DKIM: PASS, DMARC: PASS

## Troubleshooting
- **Still in spam?** Wait 24 hours. DNS can be slow.
- **DKIM fails?** Double-check you copied the full value (it's usually very long).
- **SPF fails?** Make sure there's no conflicting SPF record. Only one SPF record per domain.
- **Namecheap has existing TXT records?** Don't delete them — add new ones alongside.

## Total Time: ~5 minutes active, 15-60 min waiting
