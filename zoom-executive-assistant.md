# Zoom Executive Assistant Knowledge Base
## Gary Cosby's AI-Powered Meeting Management System
*Last Updated: February 9, 2026*

---

## Table of Contents
1. [Meeting Management](#1-meeting-management)
2. [Participant Management](#2-participant-management)
3. [Breakout Rooms](#3-breakout-rooms)
4. [Recording](#4-recording)
5. [Security](#5-security)
6. [Advanced Features](#6-advanced-features)
7. [Zoom API Overview](#7-zoom-api-overview)
8. [Webhooks](#8-webhooks)
9. [Zoom Apps & SDK](#9-zoom-apps--sdk)
10. [AppleScript Automation (Proven)](#10-applescript-automation-proven)
11. [API + AppleScript Hybrid Strategy](#11-api--applescript-hybrid-strategy)
12. [Common Issues & Solutions](#12-common-issues--solutions)
13. [Best Practices](#13-best-practices)

---

## 1. Meeting Management

### Meeting Types
| Type | Value | Description |
|------|-------|-------------|
| Instant | 1 | Start immediately |
| Scheduled | 2 | One-time scheduled meeting |
| Recurring (no fixed time) | 3 | Recurring, no fixed schedule |
| Recurring (fixed time) | 8 | Recurring with fixed schedule |
| Personal Meeting Room | 4 | PMI-based meeting |

### Scheduling a Meeting
**Via API:** `POST /users/{userId}/meetings`
```json
{
  "topic": "GFI Training Call",
  "type": 2,
  "start_time": "2026-02-10T19:00:00",
  "duration": 60,
  "timezone": "America/New_York",
  "password": "gfi2026",
  "agenda": "Weekly GFI training and Q&A",
  "settings": {
    "host_video": true,
    "participant_video": false,
    "join_before_host": false,
    "mute_upon_entry": true,
    "waiting_room": true,
    "auto_recording": "cloud",
    "approval_type": 0,
    "registration_type": 1,
    "audio": "both",
    "alternative_hosts": "",
    "breakout_room": {
      "enable": true,
      "rooms": [
        {"name": "New Agents", "participants": ["agent1@email.com"]},
        {"name": "Experienced Agents", "participants": ["agent2@email.com"]}
      ]
    }
  },
  "recurrence": {
    "type": 2,
    "repeat_interval": 1,
    "weekly_days": "2",
    "end_times": 52
  }
}
```

**Via AppleScript (proven):**
```applescript
tell application "zoom.us"
  activate
end tell
-- Then use UI scripting to click "New Meeting" or join via URL
tell application "System Events"
  tell process "zoom.us"
    -- Navigate menus
  end tell
end tell
```

### Recurring Meetings
- **No fixed time (type 3):** Meeting ID persists, start anytime
- **Fixed time (type 8):** Set recurrence pattern (daily/weekly/monthly)
- Recurrence patterns: daily (type 1), weekly (type 2), monthly (type 3)
- `weekly_days`: 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat
- Max 365 days or end after N occurrences

### Meeting Settings (Key Options)
| Setting | API Field | Description |
|---------|-----------|-------------|
| Waiting Room | `waiting_room: true` | Hold participants before admit |
| Mute on Entry | `mute_upon_entry: true` | All join muted |
| Join Before Host | `join_before_host: false` | Require host present |
| Auto-Record | `auto_recording: "cloud"` | cloud, local, or none |
| Password | `password: "string"` | Meeting passcode |
| Registration | `approval_type: 0` | 0=auto, 1=manual, 2=none |
| Alternative Host | `alternative_hosts: "email"` | Comma-separated emails |
| Breakout Pre-assign | `breakout_room.enable: true` | Pre-assign rooms |
| E2E Encryption | `encryption_type: "e2ee"` | End-to-end encryption |
| Watermark | `watermark: true` | Screen watermark |

### Meeting Registration
- Enable via `approval_type` in settings
- Registration types: 1=register once for all occurrences, 2=register each, 3=register once pick any
- Custom registration fields available via API
- **API:** `POST /meetings/{meetingId}/registrants`

### Waiting Room
- Enabled per-meeting or account-wide
- Can selectively admit participants
- Customize waiting room with branding/message
- **API doesn't directly admit from waiting room** — this requires client interaction or AppleScript

---

## 2. Participant Management

### Roles
| Role | Capabilities |
|------|-------------|
| **Host** | Full control: mute all, record, breakout rooms, end meeting |
| **Co-Host** | Most host powers: mute, remove, spotlight, manage breakout rooms. Cannot end meeting or start cloud recording |
| **Alternative Host** | Can start the meeting if host absent, becomes host |
| **Participant** | Basic: mute/unmute self, chat, raise hand, reactions |

### Making Someone Co-Host
**Via AppleScript (proven):**
```applescript
-- Click participant name in participants panel
-- Click "More" > "Make Co-Host"
-- Click "Yes" on confirmation dialog
tell application "System Events"
  tell process "zoom.us"
    -- Navigate participant list, right-click name, select Make Co-Host
    click button "Yes" of window 1  -- Confirm
  end tell
end tell
```
**Via API:** Not directly available as a real-time meeting control. Must set `alternative_hosts` at scheduling time or use co-host setting.

### Muting Participants
**Via API (in-meeting controls — requires Zoom client SDK or manual):**
- No REST API endpoint for real-time muting
- Use AppleScript: `click button "Mute All"` in participants panel

**Best Practice:** Set `mute_upon_entry: true` in meeting settings

### Spotlight / Pin
- Spotlight: visible to all (host/co-host only)
- Pin: visible to self only
- Up to 9 spotlights simultaneously
- **API:** No REST endpoint — AppleScript or client SDK only

### Removing Participants
- Host/co-host can remove
- Removed participants cannot rejoin (unless setting allows)
- **API:** No REST endpoint for removal during meeting

### Raise Hand
- Participants raise hand to get attention
- Host sees raised hands at top of participant list
- **Webhook:** `meeting.participant_joined` includes hand raise events

---

## 3. Breakout Rooms

### Overview
Breakout rooms split a meeting into up to **50 separate sessions**. Each room supports up to 200 participants (500 with large meeting add-on).

### Creating Breakout Rooms

**Pre-assignment via API (BEFORE meeting starts):**
```json
POST /users/{userId}/meetings
{
  "topic": "Training with Breakout Rooms",
  "type": 2,
  "settings": {
    "breakout_room": {
      "enable": true,
      "rooms": [
        {
          "name": "New Recruits",
          "participants": ["recruit1@email.com", "recruit2@email.com"]
        },
        {
          "name": "Experienced Agents",
          "participants": ["agent1@email.com", "agent2@email.com"]
        },
        {
          "name": "Leadership",
          "participants": ["leader1@email.com"]
        }
      ]
    }
  }
}
```

**During meeting via AppleScript (proven):**
```applescript
tell application "System Events"
  tell process "zoom.us"
    -- Click "Breakout Rooms" button in toolbar
    -- Select number of rooms
    -- Choose automatic or manual assignment
    -- Click "Create Rooms"
    -- Click "Open All Rooms"
  end tell
end tell
```

### Breakout Room Operations
| Action | Method | Notes |
|--------|--------|-------|
| Pre-assign rooms | API (`settings.breakout_room`) | At meeting creation/update |
| Create rooms (live) | AppleScript | Click toolbar button |
| Open all rooms | AppleScript | Click "Open All Rooms" |
| Close all rooms | AppleScript | Click "Close All Rooms" |
| Move participant | AppleScript | Drag or use Assign button |
| Broadcast message | AppleScript | "Broadcast a message to all" |
| Set timer | AppleScript | Configure countdown timer |

### Breakout Room Settings
- **Auto-move:** Participants auto-move to assigned room when opened
- **Allow return:** Participants can return to main session
- **Countdown timer:** Warn before closing (10-120 seconds)
- **Pre-assigned:** Assign by email before meeting (API supported!)

### Webhook Events for Breakout Rooms
- `meeting.participant_joined_breakout_room` — participant enters a breakout room
- `meeting.participant_left_breakout_room` — participant leaves breakout room
- The `bo_mtg_id` field in participant reports identifies which breakout room

### Best Practices for Gary's GFI Calls
1. **Pre-assign rooms via API** based on agent experience level
2. Set **5-minute countdown timer** so agents know rooms are closing
3. **Broadcast key announcements** to all rooms simultaneously
4. Use **automatic assignment** for large open trainings
5. Have **co-hosts in each room** for facilitation

---

## 4. Recording

### Recording Types
| Type | Storage | Control | Best For |
|------|---------|---------|----------|
| **Local** | Host's computer | Start/stop manual or auto | Small meetings, immediate access |
| **Cloud** | Zoom cloud storage | Auto or manual, accessible via API | Distribution, sharing, API access |

### Local Recording
**Via AppleScript (proven):**
```applescript
tell application "System Events"
  tell process "zoom.us"
    -- Click "Record" button or use menu
    click menu item "Record on this Computer" of menu "Meeting" of menu bar 1
  end tell
end tell
```
- Saves as `.zoom` temp files during meeting
- Converts to MP4/M4A after meeting ends
- Default location: `~/Documents/Zoom/` or `~/Desktop/Zoom/`
- **Post-meeting conversion** happens automatically

### Cloud Recording
**Via API:**
- `auto_recording: "cloud"` in meeting settings
- Access recordings: `GET /users/{userId}/recordings`
- Get specific recording: `GET /meetings/{meetingId}/recordings`
- Delete recording: `DELETE /meetings/{meetingId}/recordings`
- Recover deleted: `PUT /meetings/{meetingId}/recordings/status` with `action: "recover"`

**Cloud Recording Settings:**
```json
{
  "settings": {
    "auto_recording": "cloud",
    "cloud_recording": {
      "recording_audio_transcript": true,
      "save_chat_text": true,
      "show_timestamp": true,
      "recording_thumbnails": true,
      "record_speaker_view": true,
      "record_gallery_view": true,
      "record_audio_file": true
    }
  }
}
```

### Recording Files (Cloud)
Each cloud recording produces multiple files:
| File Type | Extension | Description |
|-----------|-----------|-------------|
| Shared screen with speaker view | MP4 | Main recording |
| Shared screen with gallery view | MP4 | All participants visible |
| Audio only | M4A | Just audio track |
| Chat file | TXT | In-meeting chat log |
| Transcript | VTT | Auto-generated transcript |
| Timeline | JSON | Chapters/timeline data |

### Transcription
- **Auto-transcription:** Available for cloud recordings (enabled in settings)
- Generates VTT file alongside recording
- Searchable in Zoom portal
- **AI Companion Meeting Summary:** Generates AI-powered meeting summary (newer feature)
- Summary includes: key topics, action items, next steps

### Recording Workflow for Gary
1. Set `auto_recording: "cloud"` for all GFI meetings
2. After meeting: API retrieves recording URL
3. Download via `download_url` (with access token)
4. Convert/compress if needed with ffmpeg
5. Send via Telegram to relevant agents
6. **Proven pipeline:** Local recording → convert → send via Telegram

### Recording API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users/{userId}/recordings` | GET | List all recordings |
| `/meetings/{meetingId}/recordings` | GET | Get meeting recordings |
| `/meetings/{meetingId}/recordings` | DELETE | Delete recordings |
| `/meetings/{meetingId}/recordings/status` | PUT | Recover deleted |
| `/meetings/{meetingId}/recordings/settings` | GET | Recording settings |
| `/meetings/{meetingId}/recordings/settings` | PATCH | Update settings |
| `/meetings/{meetingId}/recordings/registrants` | GET | List registrants |
| `/meetings/{meetingId}/recordings/registrants` | POST | Add registrant |

### Webhook: `recording.completed`
Fires when cloud recording finishes processing. Payload includes:
- `download_url` for each file
- `file_type`, `file_size`, `file_extension`
- `recording_start`, `recording_end`
- `meeting_id`, `topic`, `host_email`

**This is key for automation:** Set up webhook → receive recording.completed → auto-download → send to Telegram.

---

## 5. Security

### Meeting Security Features
| Feature | Description | API Setting |
|---------|-------------|-------------|
| **Passcode** | Required to join | `password: "string"` |
| **Waiting Room** | Hold before admitting | `waiting_room: true` |
| **Lock Meeting** | Prevent new joins | Client-only (AppleScript) |
| **E2E Encryption** | End-to-end encryption | `encryption_type: "e2ee"` |
| **Watermark** | Overlay on shared screens | `watermark: true` |
| **Authentication** | Require Zoom login | `meeting_authentication: true` |
| **Signed-in users only** | Block anonymous | Account setting |
| **Block removed users** | Can't rejoin after removal | `allow_multiple_devices: false` |

### Security Best Practices
1. **Always enable waiting room** for public-facing meetings
2. **Use passcodes** embedded in join links (seamless for invitees)
3. **Disable join before host** to prevent unauthorized early access
4. **Lock meeting** once all expected participants have joined
5. **Disable file transfer** in chat if not needed
6. **Disable screen sharing** for participants (host/co-host only)
7. **Use registration** for large/public meetings

### E2E Encryption Limitations
- Disables: cloud recording, breakout rooms, polls, reactions, join before host
- Only use for highly sensitive 1-on-1 or small group meetings
- **Not recommended for Gary's GFI trainings** (need recording + breakout rooms)

---

## 6. Advanced Features

### Polls & Quizzes
- Create in advance or during meeting
- Multiple choice or open-ended
- **API:** `POST /meetings/{meetingId}/polls`
```json
{
  "title": "GFI Knowledge Check",
  "anonymous": false,
  "poll_type": 1,
  "questions": [
    {
      "name": "What is the primary benefit of GFI?",
      "type": "single",
      "answers": ["Financial education", "Insurance products", "Both", "Neither"],
      "right_answers": ["Both"]
    }
  ]
}
```
- Retrieve results: `GET /meetings/{meetingId}/polls`
- **Great for training engagement** — quiz agents after presentations

### Q&A (Webinar feature)
- Available in webinars, not standard meetings
- Participants submit questions
- Host/panelists answer live or in writing
- **API:** Webinar Q&A endpoints available

### Reactions & Non-verbal Feedback
- Thumbs up, clap, heart, laugh, surprise, etc.
- Raise hand (persists until lowered)
- Speed up / Slow down feedback
- No API control — client-side only

### Virtual Backgrounds
- Set per-user in client settings
- Account admin can enforce/restrict
- Custom backgrounds uploadable
- **No API for virtual backgrounds**

### AI Companion (Zoom IQ)
- **Meeting Summary:** Auto-generates meeting summaries with key topics, action items
- **Smart Recording:** Chapters, highlights, next steps
- **In-meeting questions:** "What was discussed about X?"
- **Compose:** Draft messages based on meeting context
- Available on Business/Enterprise plans
- **API:** No direct API for AI Companion — it's client-integrated
- Summaries accessible via recording endpoints after meeting

### Zoom Clips
- Short async video messages
- Record and share outside meetings
- AI-generated titles and descriptions
- Useful for Gary to send quick training updates

### Zoom Scheduler
- Share booking link (like Calendly)
- Integrates with Google/Outlook calendar
- Participants book time slots
- Good for 1-on-1 agent coaching sessions

---

## 7. Zoom API Overview

### Base URL
```
https://api.zoom.us/v2/
```

### Authentication
**Server-to-Server OAuth (recommended for automation):**
1. Create app at marketplace.zoom.us
2. Get Account ID, Client ID, Client Secret
3. Request token:
```bash
curl -X POST "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=ACCOUNT_ID" \
  -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)"
```
4. Token expires in 3600 seconds (1 hour)
5. Use: `Authorization: Bearer ACCESS_TOKEN`

### Rate Limits
- **Light:** 30 requests/second (GET most endpoints)
- **Medium:** 20 requests/second
- **Heavy:** 10 requests/second (POST/PUT/DELETE)
- **Resource-intensive:** 1 request/second (reports, dashboards)
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Key API Categories
See [zoom-api-reference.md](zoom-api-reference.md) for complete endpoint listing.

| Category | Base Path | Key Operations |
|----------|-----------|----------------|
| Meetings | `/meetings/` | CRUD, participants, polls, registrants |
| Users | `/users/` | List, create, get, update, settings |
| Recordings | `/meetings/{id}/recordings` | List, get, delete, recover |
| Webinars | `/webinars/` | CRUD, panelists, registrants, polls |
| Reports | `/report/` | Meeting participants, daily usage |
| Dashboard | `/metrics/` | Real-time meeting data |
| Groups | `/groups/` | Manage user groups |
| Rooms | `/rooms/` | Zoom Rooms management |
| Chat | `/chat/` | Channels, messages |

### Pagination
- Most list endpoints use `page_size` (max 300) and `next_page_token`
- Default page size: 30
- Iterate with `next_page_token` until empty

---

## 8. Webhooks

### Setup
1. In your Zoom app (marketplace.zoom.us), go to **Features** > **Event Subscriptions**
2. Add endpoint URL (must be HTTPS)
3. Select events to subscribe to
4. Zoom sends verification challenge on save
5. Your endpoint must respond with `challenge` value

### Verification
```
POST your-endpoint
{
  "payload": { "plainToken": "abc123" },
  "event_ts": 1234567890,
  "event": "endpoint.url_validation"
}
```
Respond with:
```json
{
  "plainToken": "abc123",
  "encryptedToken": "hmac_sha256(plainToken, webhook_secret)"
}
```

### Security Validation
Every webhook includes headers:
- `x-zm-signature`: HMAC SHA256 of `v0:{timestamp}:{request_body}` using secret token
- `x-zm-request-timestamp`: Unix timestamp
- Validate signature to ensure authentic Zoom webhook

### Key Webhook Events

#### Meeting Events
| Event | Trigger |
|-------|---------|
| `meeting.created` | Meeting scheduled |
| `meeting.updated` | Meeting settings changed |
| `meeting.deleted` | Meeting cancelled |
| `meeting.started` | Meeting begins |
| `meeting.ended` | Meeting ends |
| `meeting.participant_joined` | Someone joins |
| `meeting.participant_left` | Someone leaves |
| `meeting.participant_joined_waiting_room` | Entered waiting room |
| `meeting.participant_admitted` | Admitted from waiting room |
| `meeting.participant_joined_breakout_room` | Entered breakout room |
| `meeting.participant_left_breakout_room` | Left breakout room |
| `meeting.sharing_started` | Screen share begins |
| `meeting.sharing_ended` | Screen share ends |

#### Recording Events
| Event | Trigger |
|-------|---------|
| `recording.started` | Recording begins |
| `recording.stopped` | Recording paused/stopped |
| `recording.completed` | Cloud recording processed & ready |
| `recording.trashed` | Recording moved to trash |
| `recording.deleted` | Recording permanently deleted |
| `recording.recovered` | Recording restored from trash |

#### User Events
| Event | Trigger |
|-------|---------|
| `user.created` | New user added |
| `user.updated` | User profile changed |
| `user.deleted` | User removed |
| `user.activated` | User activated |
| `user.deactivated` | User deactivated |

### Webhook Payload Structure
```json
{
  "event": "meeting.participant_joined",
  "event_ts": 1635885799302,
  "payload": {
    "account_id": "ACCOUNT_ID",
    "object": {
      "id": 12345678,
      "uuid": "abc123==",
      "topic": "GFI Training",
      "host_id": "host_user_id",
      "participant": {
        "user_id": "participant_id",
        "user_name": "John Smith",
        "email": "john@email.com",
        "join_time": "2026-02-10T19:05:00Z"
      }
    }
  }
}
```

### Automation Ideas Using Webhooks
1. **Attendance tracking:** `participant_joined`/`participant_left` → log to spreadsheet
2. **Auto-record notification:** `recording.completed` → download → send via Telegram
3. **Meeting start alert:** `meeting.started` → notify Gary via Telegram
4. **Waiting room alert:** `participant_joined_waiting_room` → notify host
5. **No-show detection:** Compare registered vs. joined after meeting ends
6. **Breakout room tracking:** Log which agents went to which rooms

---

## 9. Zoom Apps & SDK

### Zoom Meeting SDK
- Embed Zoom meetings into custom apps
- Available for: Web, iOS, Android, Windows, macOS, Linux
- **Not needed for Gary's use case** — we use the native Zoom client

### Zoom Apps (In-Meeting Apps)
- Apps that run inside the Zoom meeting window
- Access to meeting context (participants, chat)
- **Potential use:** Custom GFI training app that runs during meetings
- Requires Zoom App Marketplace submission for distribution

### Zoom Phone API
- Manage phone system via API
- Call logs, voicemail, call routing
- **Not relevant unless Gary uses Zoom Phone**

### Relevant SDKs for Our Use
- **REST API** (primary) — scheduling, recordings, reports
- **Webhooks** (real-time events) — attendance, recording completion
- **AppleScript** (client control) — in-meeting actions on Mac Mini

---

## 10. AppleScript Automation (Proven)

### What We've Proven Works
| Action | Status | Method |
|--------|--------|--------|
| Launch Zoom | ✅ Proven | `tell application "zoom.us" to activate` |
| Start recurring meeting | ✅ Proven | Navigate to meeting, click Start |
| Join audio | ✅ Proven | Click "Join Audio" / "Join with Computer Audio" |
| Open breakout rooms | ✅ Proven | Click Breakout Rooms button → Open All |
| Make co-host | ✅ Proven | Right-click participant → Make Co-Host → Confirm |
| Start local recording | ✅ Proven | Click Record button or menu |
| Stop recording | ✅ Proven | Click Stop Recording |
| Navigate participants | ✅ Proven | Open Participants panel, scroll list |
| End meeting | ✅ Proven | Click End → End Meeting for All |
| Convert recording | ✅ Proven | Automatic post-meeting, or manual ffmpeg |
| Send via Telegram | ✅ Proven | Via OpenClaw/Telegram integration |

### AppleScript Limitations
- **No scheduling** — can't create new meetings
- **No pre-assigning breakout rooms** — must do manually or via API
- **No cloud recording control** — local only
- **No webhook equivalent** — can't detect events automatically
- **Fragile** — depends on UI element positions, breaks with Zoom updates
- **Sequential** — one action at a time, timing-dependent
- **No participant data extraction** — can see names but hard to export list

---

## 11. API + AppleScript Hybrid Strategy

### The Optimal Setup for Gary
```
┌─────────────────────────────────────────────┐
│           ZOOM EXECUTIVE ASSISTANT           │
├─────────────────────────────────────────────┤
│                                             │
│  BEFORE MEETING (API):                      │
│  • Schedule meeting with all settings       │
│  • Pre-assign breakout rooms                │
│  • Set auto-record to cloud                 │
│  • Create polls                             │
│  • Register participants                    │
│                                             │
│  DURING MEETING (AppleScript):              │
│  • Launch Zoom, join meeting                │
│  • Join audio                               │
│  • Make co-hosts                            │
│  • Open/close breakout rooms                │
│  • Manage participants (mute, spotlight)    │
│  • Start/stop local recording backup        │
│                                             │
│  DURING MEETING (Webhooks):                 │
│  • Track who joins/leaves                   │
│  • Monitor breakout room participation      │
│  • Detect recording status                  │
│                                             │
│  AFTER MEETING (API):                       │
│  • Download cloud recordings                │
│  • Get transcripts                          │
│  • Pull participant reports                 │
│  • Get poll results                         │
│  • Send recordings via Telegram             │
│                                             │
└─────────────────────────────────────────────┘
```

### Implementation Priority
1. **Phase 1 (Now):** AppleScript for all in-meeting control ✅ DONE
2. **Phase 2:** Set up Server-to-Server OAuth app for API access
3. **Phase 3:** API for meeting scheduling + breakout room pre-assignment
4. **Phase 4:** Webhooks for attendance tracking + recording automation
5. **Phase 5:** Full pipeline — schedule → run → record → distribute → report

---

## 12. Common Issues & Solutions

### Meeting Issues
| Issue | Solution |
|-------|----------|
| Participants can't join | Check waiting room settings, passcode, meeting link |
| Audio not working | Ensure "Join Audio" clicked, check computer audio settings |
| Recording not starting | Check recording permissions, disk space |
| Breakout rooms grayed out | Enable in account settings first (admin) |
| Co-host can't record | Cloud recording requires host; co-host can only do local |
| Meeting capacity reached | Upgrade plan or use webinar for large audiences |

### AppleScript Issues
| Issue | Solution |
|-------|----------|
| UI element not found | Zoom updated UI — need to re-map element paths |
| Click doesn't register | Add delays between actions (`delay 1`) |
| Wrong window focused | Ensure `tell process "zoom.us"` targets correct window |
| Confirmation dialog missed | Add explicit waits for dialog appearance |
| Multiple monitors | Ensure Zoom window is on expected screen |

### API Issues
| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Token expired — refresh every hour |
| 429 Rate Limited | Back off, check `X-RateLimit-Reset` header |
| 404 Not Found | Check meeting ID format (long vs short ID) |
| Scope insufficient | Add required scopes in app settings |
| Webhook not firing | Verify endpoint URL, check event subscriptions |

---

## 13. Best Practices

### For Gary's GFI Training Meetings
1. **Schedule via API** with all settings pre-configured
2. **Pre-assign breakout rooms** based on agent roster/experience level
3. **Enable cloud auto-recording** for every training
4. **Use waiting room** to control entry and start on time
5. **Mute on entry** — prevents chaos when 50+ agents join
6. **Set alternative host** so a co-host can start if Gary is late
7. **Create polls** in advance to check agent comprehension
8. **Use webhooks** to auto-track attendance for compliance

### For Recording Distribution
1. Auto-record to cloud → webhook triggers on completion
2. Download recording via API
3. Compress with ffmpeg if needed
4. Send to relevant Telegram group/channel
5. Archive to Google Drive for long-term storage

### For Attendance & Compliance
1. Use `meeting.participant_joined` webhook for real-time tracking
2. After meeting: `GET /report/meetings/{meetingId}/participants` for full report
3. Cross-reference with registered/expected participants
4. Generate attendance report → send to Gary

### Security for Recruiting Calls
1. Always use passcodes (embedded in link for convenience)
2. Enable waiting room for prospect meetings
3. Disable file transfer in chat
4. Host-only screen sharing
5. Lock meeting once session begins
6. Remove disruptive participants immediately

---

*This knowledge base is the foundation of Gary Cosby's Zoom executive assistant system. Combined with the [API Reference](zoom-api-reference.md), it enables Donna to manage every aspect of Gary's virtual meeting operations.*
