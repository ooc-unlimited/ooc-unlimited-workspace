# Domain Hosting & DNS Configuration Guide
## Connecting Gary's Namecheap Domain to the Onboarding Dashboard

> **TL;DR:** Use Cloudflare Tunnel (free) to expose the Next.js dashboard on Gary's Mac mini to the internet via his Namecheap domain. No port forwarding, no static IP needed. Free SSL. Survives reboots.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Add Domain to Cloudflare (Free Tier)](#step-1-add-domain-to-cloudflare)
4. [Step 2: Change Namecheap Nameservers](#step-2-change-namecheap-nameservers)
5. [Step 3: Install cloudflared on Mac mini](#step-3-install-cloudflared)
6. [Step 4: Create a Permanent Named Tunnel](#step-4-create-permanent-tunnel)
7. [Step 5: Configure the Tunnel](#step-5-configure-tunnel)
8. [Step 6: Set Up DNS CNAME](#step-6-dns-cname)
9. [Step 7: Test the Tunnel](#step-7-test)
10. [Step 8: Make It Survive Reboots (launchd)](#step-8-launchd)
11. [Step 9: SSL/HTTPS (Automatic)](#step-9-ssl)
12. [Common Gotchas](#common-gotchas)
13. [Alternative Approaches Comparison](#alternatives)
14. [Quick Command Reference](#quick-reference)

---

## Architecture Overview

```
User's Browser
     │
     ▼ (HTTPS)
Cloudflare Edge (free SSL, DDoS protection, CDN)
     │
     ▼ (encrypted tunnel, outbound-only from Mac mini)
cloudflared daemon on Mac mini
     │
     ▼ (localhost)
Next.js app on port 3000
```

**Why Cloudflare Tunnel?**
- **Free forever** on Cloudflare's free tier
- **No port forwarding** — tunnel is outbound-only from Mac mini
- **No static IP needed** — works behind any NAT/ISP
- **Automatic SSL** — Cloudflare handles certificates
- **DDoS protection** included
- **Enterprise-grade reliability** with global CDN

---

## Prerequisites

- [ ] Namecheap domain registered (e.g., `garydomain.com`)
- [ ] Free Cloudflare account (sign up at [dash.cloudflare.com](https://dash.cloudflare.com))
- [ ] Mac mini with admin access
- [ ] Next.js app running on a port (e.g., `localhost:3000`)
- [ ] Static local IP for Mac mini (System Settings > Network > Details > TCP/IP > Configure IPv4: Manually)

---

## Step 1: Add Domain to Cloudflare (Free Tier) {#step-1-add-domain-to-cloudflare}

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **"Add a site"**
3. Enter the **apex domain** (e.g., `garydomain.com` — NOT a subdomain)
4. Select **Free plan** → Continue
5. Cloudflare scans existing DNS records (ignore if empty) → Continue
6. **Copy the two nameservers** Cloudflare gives you (e.g., `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`)

> ⚠️ Don't close this page — you need the nameservers for the next step.

---

## Step 2: Change Namecheap Nameservers {#step-2-change-namecheap-nameservers}

1. Log in to [Namecheap](https://www.namecheap.com)
2. Go to **Domain List** → click **Manage** next to your domain
3. Scroll to **Nameservers** section
4. Change dropdown from "Namecheap BasicDNS" to **Custom DNS**
5. Paste the two Cloudflare nameservers (one per field)
6. Click the **green checkmark** to save

**Propagation:** Takes 1-48 hours (usually under 1 hour). Check with:
```bash
dig NS garydomain.com
# Should show Cloudflare nameservers
```

Or check at [whatsmydns.net](https://www.whatsmydns.net/)

**Verify in Cloudflare:** Once propagated, your domain status shows **"Active"** in Cloudflare dashboard.

---

## Step 3: Install cloudflared on Mac mini {#step-3-install-cloudflared}

### Option A: Homebrew (recommended)
```bash
brew install cloudflared
```

### Option B: Direct download (Apple Silicon)
```bash
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-arm64.tgz | tar -xz
sudo mv cloudflared /usr/local/bin/
```

### Verify
```bash
cloudflared --version
```

---

## Step 4: Create a Permanent Named Tunnel {#step-4-create-permanent-tunnel}

### Authenticate with Cloudflare
```bash
cloudflared tunnel login
```
- Browser opens → log in to Cloudflare → select your domain zone → authorize
- Creates `~/.cloudflared/cert.pem`

### Create the tunnel
```bash
cloudflared tunnel create gary-dashboard
```

**Output:**
```
Created tunnel gary-dashboard with id abc12345-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Tunnel credentials written to /Users/gary/.cloudflared/abc12345-xxxx-xxxx-xxxx-xxxxxxxxxxxx.json
```

> 📝 **Save this UUID** — you need it for config and DNS.

### List tunnels (verify)
```bash
cloudflared tunnel list
```

---

## Step 5: Configure the Tunnel {#step-5-configure-tunnel}

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: gary-dashboard
credentials-file: /Users/gary/.cloudflared/<TUNNEL-UUID>.json

ingress:
  # Main domain → Next.js dashboard
  - hostname: garydomain.com
    service: http://localhost:3000

  # Subdomain example (optional)
  - hostname: app.garydomain.com
    service: http://localhost:3000

  # Catch-all (REQUIRED — must be last)
  - service: http_status:404
```

### Validate config
```bash
cloudflared tunnel ingress validate
```

> ⚠️ **Important:** The catch-all rule (`- service: http_status:404`) MUST be the last entry. Cloudflare will reject the config without it.

---

## Step 6: Set Up DNS CNAME {#step-6-dns-cname}

### Automatic method (recommended)
```bash
# For apex domain
cloudflared tunnel route dns gary-dashboard garydomain.com

# For subdomain
cloudflared tunnel route dns gary-dashboard app.garydomain.com
```

This automatically creates a CNAME record in Cloudflare DNS pointing to `<TUNNEL-UUID>.cfargotunnel.com`.

### Manual method (Cloudflare dashboard)
Go to Cloudflare Dashboard → Your domain → DNS → Records → Add record:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `@` (or subdomain) | `<TUNNEL-UUID>.cfargotunnel.com` | **Proxied** (orange cloud) |

> ⚠️ **Proxy MUST be orange (Proxied)** — grey cloud bypasses the tunnel and breaks everything.

---

## Step 7: Test the Tunnel {#step-7-test}

### Start the tunnel manually
```bash
cloudflared tunnel --config ~/.cloudflared/config.yml run gary-dashboard
```

### Test from another device
```bash
curl -I https://garydomain.com
# Should return 200 OK with Cloudflare headers
```

Visit `https://garydomain.com` in a browser — you should see the Next.js dashboard.

Press `Ctrl+C` to stop the manual tunnel once verified.

---

## Step 8: Make It Survive Reboots (launchd) {#step-8-launchd}

### Option A: cloudflared service install (easiest)
```bash
sudo cloudflared service install
```
This auto-creates the launchd plist. Then:
```bash
sudo launchctl start com.cloudflare.cloudflared
```

### Option B: Custom LaunchDaemon (more control)

Create `/Library/LaunchDaemons/com.cloudflare.tunnel.plist`:

```bash
sudo tee /Library/LaunchDaemons/com.cloudflare.tunnel.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.cloudflare.tunnel</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/cloudflared</string>
        <string>tunnel</string>
        <string>--config</string>
        <string>/Users/gary/.cloudflared/config.yml</string>
        <string>run</string>
        <string>gary-dashboard</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/var/log/cloudflared.stdout</string>
    <key>StandardErrorPath</key>
    <string>/var/log/cloudflared.stderr</string>
</dict>
</plist>
EOF
```

> ⚠️ **Use absolute paths only** — no `~` tildes. launchd doesn't expand them.

### Load and start
```bash
sudo launchctl load /Library/LaunchDaemons/com.cloudflare.tunnel.plist
sudo launchctl start com.cloudflare.tunnel
```

### Verify
```bash
sudo launchctl list | grep cloudflare
# Should show PID and 0 exit status

tail -f /var/log/cloudflared.stderr
# Should show "Connection registered" messages
```

### Monitor in Cloudflare
Dashboard → Zero Trust → Network → Tunnels → `gary-dashboard` should show **green/healthy**.

---

## Step 9: SSL/HTTPS (Automatic) {#step-9-ssl}

**You don't need to do anything.** When the CNAME is proxied (orange cloud):

- Cloudflare automatically issues a **free Universal SSL certificate**
- HTTP automatically redirects to HTTPS
- The tunnel encrypts traffic between Cloudflare edge and your Mac mini

### Recommended SSL settings
In Cloudflare Dashboard → SSL/TLS → Overview:
- Set encryption mode to **Full** (since your local app is HTTP, not HTTPS)
- Enable **Always Use HTTPS**
- Enable **Automatic HTTPS Rewrites**

> 💡 Your local Next.js app can stay on plain HTTP (port 3000). Cloudflare handles all the HTTPS for you.

---

## Common Gotchas {#common-gotchas}

| Issue | Solution |
|-------|----------|
| **Nameserver propagation takes forever** | Wait up to 48h; check with `dig NS domain.com` |
| **Tunnel won't connect** | Check credentials path in config.yml; re-run `cloudflared tunnel login` |
| **CNAME not working** | Use `cloudflared tunnel route dns` instead of manual; ensure orange cloud proxy |
| **Grey cloud = broken** | CNAME proxy MUST be orange (Proxied); grey bypasses tunnel |
| **launchd fails silently** | Check `/var/log/cloudflared.stderr`; ensure absolute paths, no `~` |
| **Wrong binary (ARM vs Intel)** | Use `arm64` for Apple Silicon Mac mini, `amd64` for Intel |
| **Config validation fails** | Must have catch-all rule as last ingress entry |
| **502 Bad Gateway** | Your local app isn't running on the configured port |
| **Tunnel shows "inactive"** | Restart: `sudo launchctl stop com.cloudflare.tunnel && sudo launchctl start com.cloudflare.tunnel` |
| **Multiple hostnames** | Add multiple ingress rules in config.yml; create CNAME for each |

---

## Alternative Approaches Comparison {#alternatives}

| Feature | **Cloudflare Tunnel** | **Tailscale Funnel** | **ngrok** | **Caddy + DDNS** |
|---------|----------------------|---------------------|-----------|-------------------|
| **Cost** | **Free** | Free (limited) / paid per-user | $8+/mo for custom domains | Free (domain cost only) |
| **Setup difficulty** | Moderate | Easy | Easiest | Hardest |
| **Custom domain** | ✅ Free | Limited | Paid plans only | ✅ Free |
| **SSL** | Automatic | Automatic | Automatic | Auto via Let's Encrypt |
| **Reliability** | Enterprise-grade | Good (beta features) | Good (centralized) | Depends on ISP |
| **DDoS protection** | ✅ Included | ❌ | ❌ | ❌ |
| **CDN/caching** | ✅ Global CDN | ❌ | ❌ | ❌ |
| **Port forwarding needed** | ❌ | ❌ | ❌ | ✅ Yes |
| **Static IP needed** | ❌ | ❌ | ❌ | ❌ (DDNS) |
| **Speed** | 1-10 Gbps | 100 Mbps-1 Gbps | Variable | ISP dependent |
| **Best for** | **Production 24/7** | Internal/team access | Development/testing | Full local control |

### Verdict: **Cloudflare Tunnel wins** for Gary's use case
- Free, production-grade, custom domain, auto-SSL, DDoS protection, no port forwarding
- Only downside: moderate initial setup (this guide handles that)

---

## Quick Command Reference {#quick-reference}

```bash
# === SETUP (one-time) ===
brew install cloudflared
cloudflared tunnel login
cloudflared tunnel create gary-dashboard
cloudflared tunnel route dns gary-dashboard garydomain.com

# === CONFIG ===
nano ~/.cloudflared/config.yml
cloudflared tunnel ingress validate

# === RUN ===
cloudflared tunnel run gary-dashboard                    # Manual (foreground)
sudo launchctl start com.cloudflare.tunnel               # As service

# === MANAGE ===
cloudflared tunnel list                                  # List tunnels
cloudflared tunnel info gary-dashboard                   # Tunnel details
sudo launchctl list | grep cloudflare                    # Check service status
tail -f /var/log/cloudflared.stderr                      # View logs

# === TROUBLESHOOT ===
cloudflared tunnel ingress validate                      # Validate config
dig CNAME garydomain.com                                 # Check DNS
curl -I https://garydomain.com                           # Test endpoint
sudo launchctl stop com.cloudflare.tunnel                # Stop
sudo launchctl start com.cloudflare.tunnel               # Restart
```

---

## Namecheap API (Optional — Programmatic DNS)

If Gary wants to manage DNS programmatically via Namecheap API:
- Enable API access in Namecheap account (Profile → Tools → API Access)
- Requires whitelisted IP
- Endpoint: `https://api.namecheap.com/xml.response`
- **Not needed for Cloudflare Tunnel setup** — once nameservers point to Cloudflare, all DNS is managed there

---

## Summary: What Gary Needs to Do

1. **Sign up** for free Cloudflare account
2. **Add domain** to Cloudflare (free plan)
3. **Change nameservers** in Namecheap to Cloudflare's
4. **Wait** for propagation (usually <1 hour)
5. **Install cloudflared** on Mac mini
6. **Create tunnel** and configure it
7. **Set up DNS** CNAME pointing to tunnel
8. **Install as service** for auto-start on boot
9. **Done** — dashboard accessible at `https://garydomain.com` permanently

**Estimated time:** 30-60 minutes (plus DNS propagation wait)
**Ongoing cost:** $0 (Cloudflare free tier)
**Maintenance:** Near zero — tunnel auto-reconnects, SSL auto-renews
