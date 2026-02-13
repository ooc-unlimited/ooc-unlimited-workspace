# Screen Share + Audio — Technical Notes

## Feb 12, 2026 — Overnight Improvements

### Problem
step5-screen-share.sh used `entire contents` AppleScript queries which are extremely slow (30+ seconds per query on Zoom's complex UI).

### Solution
Rewrote to use coordinate-based clicking:
1. Get the share dialog window bounds (position + size)
2. Calculate relative click positions for Advanced tab, Slides option, Share sound checkbox, Share button
3. Use `cliclick` for fast, reliable coordinate clicks
4. Verify by checking if share dialog closed after clicking Share

### Key Coordinates (relative to share window)
- **Advanced tab**: 50% width, 45px from top
- **Slides as Background**: 50% width, 45% height
- **Share sound checkbox**: 15% width, 88% height
- **Share button**: 85% width, 92% height

### Pre-Flight Test
Run: `bash /opt/homebrew/lib/node_modules/openclaw/skills/zoom-morning-opening/scripts/test-screen-share.sh`

### Known Issues
- Coordinate positions may shift if Zoom updates the share dialog layout
- Screen Recording permission can't be verified programmatically (SIP blocks TCC.db)
- SiriusXM requires login with SMS verification — may need manual first-time setup

### Display
- Mac mini: 1360x768
