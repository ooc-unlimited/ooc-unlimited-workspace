#!/bin/bash
# Onboarding Dashboard Cloudflare Tunnel
# Starts both the Next.js app and cloudflared tunnel

APP_DIR="/Users/donna/.openclaw/workspace/onboarding-system"
TUNNEL_URL_FILE="$APP_DIR/tunnel-url.txt"
LOG_FILE="/tmp/onboarding-tunnel.log"

echo "$(date): Starting tunnel service..." >> "$LOG_FILE"

# Ensure Next.js is running
if ! curl -s http://127.0.0.1:3001/login > /dev/null 2>&1; then
    echo "$(date): Starting Next.js..." >> "$LOG_FILE"
    cd "$APP_DIR"
    npx next start -p 3001 &
    sleep 5
fi

# Start cloudflared and capture URL
cloudflared tunnel --url http://127.0.0.1:3001 2>&1 | while IFS= read -r line; do
    echo "$line" >> "$LOG_FILE"
    # Extract and save tunnel URL
    if echo "$line" | grep -q "trycloudflare.com"; then
        URL=$(echo "$line" | grep -o 'https://[a-z-]*\.trycloudflare\.com')
        if [ -n "$URL" ]; then
            echo "$URL" > "$TUNNEL_URL_FILE"
            echo "$(date): Tunnel URL: $URL" >> "$LOG_FILE"
        fi
    fi
done
