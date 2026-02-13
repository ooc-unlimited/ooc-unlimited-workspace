# 🖥️ Zoom Screen Share + Audio Automation
### Me-Lin's Morning Flow: Welcome Screen + Yacht Soul Music
*February 9, 2026*

---

## The Goal
When Gary's Virtual Office Zoom meeting starts (9 AM Mon-Fri):
1. Me-Lin joins the meeting and enters Gary's breakout room
2. Chrome is playing SiriusXM Yacht Soul in background
3. Me-Lin shares screen showing `zoom/virtual-office-welcome.jpg`
4. Me-Lin shares **computer audio** so attendees hear Yacht Soul through Zoom
5. When Gary's ready to start, Me-Lin stops sharing

## Technical Challenge
Zoom's "Share Screen" dialog has a **"Share sound"** checkbox (previously "Share computer audio"). This checkbox must be enabled to pipe system audio through Zoom. AppleScript must:
1. Click "Share Screen" button in Zoom toolbar
2. Select the correct screen/window
3. Check the "Share sound" checkbox
4. Click "Share"

## AppleScript Commands

### Step 1: Ensure Chrome is Playing Yacht Soul
```applescript
tell application "Google Chrome"
    activate
    -- Navigate to Yacht Soul if not already playing
    set yachtSoulURL to "https://player.siriusxm.com/player/channel-xtra/yacht-soul/1a8c7e32-a74d-20a9-9842-63fecb57f97c"
    
    -- Check if any tab has SiriusXM open
    set found to false
    repeat with w in windows
        repeat with t in tabs of w
            if URL of t contains "siriusxm.com" then
                set found to true
                set active tab index of w to (index of t)
                set index of w to 1
            end if
        end repeat
    end repeat
    
    if not found then
        open location yachtSoulURL
    end if
end tell
```

### Step 2: Share Screen with Audio in Zoom
```applescript
-- Zoom must be in the meeting and in the correct breakout room already
tell application "System Events"
    tell process "zoom.us"
        -- Click "Share Screen" button in meeting toolbar
        -- The toolbar button is in the meeting window
        click menu item "Share Screen..." of menu "Meeting" of menu bar 1
        
        delay 1.5 -- Wait for share dialog to appear
        
        -- The share dialog has a "Share sound" checkbox at the bottom
        -- and an "Optimize for video clip" checkbox
        
        -- Find and check "Share sound" checkbox
        tell window 1
            -- Look for the "Share sound" checkbox
            set shareSound to checkbox "Share sound"
            if value of shareSound is 0 then
                click shareSound
            end if
            
            -- Select "Desktop" (first item) to share entire screen
            -- The screen options are in a scroll area
            click button "Share"
        end tell
    end tell
end tell
```

### Step 3: Alternative — Using Keyboard Shortcuts
```applescript
-- More reliable than GUI scripting for Zoom
tell application "zoom.us" to activate
delay 0.5

tell application "System Events"
    -- Cmd+Shift+S = Share Screen shortcut in Zoom
    keystroke "s" using {command down, shift down}
    delay 2 -- Wait for share dialog
    
    -- Tab to "Share sound" checkbox and check it
    -- This requires knowing the exact tab order, which varies
    -- Safer to use accessibility inspector to find exact element
    
    -- Click Share button
    keystroke return
end tell
```

## Recommended Approach: Hybrid

The most reliable method combines API pre-configuration with AppleScript:

### Pre-Meeting Setup (run once)
1. In Zoom Settings → Share Screen → enable "Share sound" by default
2. Set default share to "Desktop 1"
3. This way, when share is triggered, audio is already included

### During Meeting (AppleScript)
```applescript
-- Full flow: ensure Chrome audio + share screen in Zoom
on shareScreenWithAudio()
    -- 1. Make sure Chrome is playing Yacht Soul
    tell application "Google Chrome" to activate
    delay 0.5
    
    -- 2. Switch to Zoom
    tell application "zoom.us" to activate
    delay 0.5
    
    -- 3. Trigger screen share via keyboard shortcut
    tell application "System Events"
        keystroke "s" using {command down, shift down}
        delay 2
        
        -- 4. The share dialog is open. Enable "Share sound" if needed.
        tell process "zoom.us"
            tell window 1
                -- Check "Share sound"
                try
                    set cb to checkbox "Share sound"
                    if value of cb is 0 then click cb
                end try
                
                -- Click Share
                click button "Share"
            end tell
        end tell
    end tell
    
    delay 1
end shareScreenWithAudio
```

### Stop Sharing
```applescript
tell application "System Events"
    tell process "zoom.us"
        -- Click "Stop Share" button (appears in floating toolbar when sharing)
        try
            click button "Stop Share" of window 1
        on error
            -- Fallback: keyboard shortcut
            keystroke "s" using {command down, shift down}
        end try
    end tell
end tell
```

## Integration with Me-Lin Cron Job

The existing 9 AM cron job (id: 5fa61012) handles:
1. Launch Zoom → Join meeting → Join audio → Open breakout rooms → Make Gary co-host → Join Gary's breakout

**Add to the flow after joining breakout room:**
1. Wait 10 seconds for breakout room to load
2. Open Chrome → SiriusXM Yacht Soul
3. Wait for audio to start playing (5 seconds)
4. Execute screen share with audio
5. Welcome screen (virtual-office-welcome.jpg) should be set as desktop wallpaper OR open in full-screen Preview

### Desktop Wallpaper Approach (Cleanest)
```applescript
-- Set desktop wallpaper to welcome image before sharing
tell application "System Events"
    tell every desktop
        set picture to "/Users/donna/.openclaw/workspace/zoom/virtual-office-welcome.jpg"
    end tell
end tell
delay 1
-- Then share Desktop 1 with audio
```

## Testing Checklist
- [ ] Chrome can navigate to SiriusXM Yacht Soul and play audio
- [ ] Zoom "Share sound" checkbox is accessible via AppleScript
- [ ] Desktop wallpaper changes to welcome image
- [ ] Screen share shows welcome image + pipes audio to meeting
- [ ] Stop share works cleanly
- [ ] Full flow runs end-to-end in cron job

## ⚠️ Known Issues
1. SiriusXM requires login with SMS verification — may need to stay logged in
2. Zoom's share dialog UI changes between versions — test after updates
3. Chrome must have audio permissions (System Preferences → Privacy)
4. Mac Mini audio output must be configured correctly for Zoom to capture it

## Next Steps
1. **Test each AppleScript block individually** on the Mac Mini
2. **Use Accessibility Inspector** (Xcode) to find exact element names in Zoom's share dialog
3. **Integrate into Me-Lin's cron job** after testing
4. **SiriusXM session persistence** — keep Chrome logged in, don't close the tab

---

*Note: This needs live testing. The AppleScript element names may differ based on Zoom version. Will need to use `UI Browser` or Accessibility Inspector to verify exact button/checkbox names.*
