# Zoom API Reference
## Complete Endpoint Guide for Gary's Executive Assistant System
*Last Updated: February 9, 2026*

---

## Authentication

### Server-to-Server OAuth (Recommended)

#### Setup Steps
1. Go to https://marketplace.zoom.us/develop
2. Click **Develop** → **Build App** → **Server-to-Server OAuth**
3. Name the app (e.g., "Donna Executive Assistant")
4. Save credentials: **Account ID**, **Client ID**, **Client Secret**
5. Go to **Information** tab → fill Company Name + Developer Contact
6. Go to **Scopes** tab → add required scopes (see below)
7. **Activate** the app

#### Required Scopes for Full Executive Assistant
```
meeting:read:admin
meeting:write:admin
user:read:admin
user:write:admin
recording:read:admin
recording:write:admin
report:read:admin
dashboard:read:admin
webinar:read:admin
webinar:write:admin
group:read:admin
group:write:admin
chat_channel:read:admin
chat_message:read:admin
```

#### Get Access Token
```bash
curl -X POST "https://zoom.us/oauth/token" \
  -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=account_credentials&account_id=ACCOUNT_ID"
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "scope": "meeting:read:admin meeting:write:admin ..."
}
```

Token expires in **1 hour**. Cache and refresh before expiry.

#### Using the Token
```bash
curl -H "Authorization: Bearer ACCESS_TOKEN" \
  "https://api.zoom.us/v2/users/me"
```

---

## Base URL
```
https://api.zoom.us/v2
```

---

## Meetings API

### Core CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/{userId}/meetings` | Create a meeting |
| GET | `/users/{userId}/meetings` | List user's meetings |
| GET | `/meetings/{meetingId}` | Get meeting details |
| PATCH | `/meetings/{meetingId}` | Update meeting |
| DELETE | `/meetings/{meetingId}` | Delete meeting |
| PUT | `/meetings/{meetingId}/status` | Update meeting status (end) |

### Create Meeting — Full Example
```bash
curl -X POST "https://api.zoom.us/v2/users/me/meetings" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "GFI Weekly Training",
    "type": 8,
    "start_time": "2026-02-10T19:00:00",
    "duration": 90,
    "timezone": "America/New_York",
    "password": "gfi2026",
    "agenda": "Weekly GFI training session with breakout rooms",
    "recurrence": {
      "type": 2,
      "repeat_interval": 1,
      "weekly_days": "2",
      "end_times": 52
    },
    "settings": {
      "host_video": true,
      "participant_video": false,
      "join_before_host": false,
      "mute_upon_entry": true,
      "waiting_room": true,
      "auto_recording": "cloud",
      "approval_type": 2,
      "audio": "both",
      "alternative_hosts": "cohost@email.com",
      "breakout_room": {
        "enable": true,
        "rooms": [
          {
            "name": "New Recruits Training",
            "participants": ["recruit1@email.com", "recruit2@email.com"]
          },
          {
            "name": "Advanced Agents",
            "participants": ["agent1@email.com", "agent2@email.com"]
          }
        ]
      }
    }
  }'
```

**Response:**
```json
{
  "id": 12345678901,
  "uuid": "abc123==",
  "host_id": "host_user_id",
  "host_email": "gary@oocunlimited.com",
  "topic": "GFI Weekly Training",
  "type": 8,
  "status": "waiting",
  "start_time": "2026-02-10T19:00:00Z",
  "duration": 90,
  "timezone": "America/New_York",
  "created_at": "2026-02-09T01:00:00Z",
  "start_url": "https://zoom.us/s/12345678901?zak=...",
  "join_url": "https://zoom.us/j/12345678901?pwd=...",
  "password": "gfi2026",
  "settings": { ... }
}
```

### End a Meeting
```bash
curl -X PUT "https://api.zoom.us/v2/meetings/{meetingId}/status" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "end"}'
```

### Meeting Participants (Registrants)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/meetings/{meetingId}/registrants` | Add registrant |
| GET | `/meetings/{meetingId}/registrants` | List registrants |
| PUT | `/meetings/{meetingId}/registrants/status` | Approve/deny/cancel registrants |
| DELETE | `/meetings/{meetingId}/registrants/{registrantId}` | Remove registrant |

### Meeting Polls
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/meetings/{meetingId}/polls` | Create poll |
| GET | `/meetings/{meetingId}/polls` | List polls |
| GET | `/meetings/{meetingId}/polls/{pollId}` | Get poll |
| PUT | `/meetings/{meetingId}/polls/{pollId}` | Update poll |
| DELETE | `/meetings/{meetingId}/polls/{pollId}` | Delete poll |

### Create Poll Example
```bash
curl -X POST "https://api.zoom.us/v2/meetings/{meetingId}/polls" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "GFI Knowledge Check",
    "anonymous": false,
    "poll_type": 1,
    "questions": [
      {
        "name": "What does GFI stand for?",
        "type": "single",
        "answers": [
          "Global Financial Independence",
          "Group Financial Insurance",
          "General Finance Inc",
          "None of the above"
        ]
      }
    ]
  }'
```

### Meeting Livestream
| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/meetings/{meetingId}/livestream` | Update livestream |
| GET | `/meetings/{meetingId}/livestream/status` | Get livestream status |
| PATCH | `/meetings/{meetingId}/livestream/status` | Update livestream status |

### Meeting Invitation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/meetings/{meetingId}/invitation` | Get meeting invitation text |

### Meeting Batch Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/meetings/batch_registrants` | Batch add registrants |
| POST | `/meetings/batch_polls` | Batch create polls |

---

## Users API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List users |
| POST | `/users` | Create user |
| GET | `/users/{userId}` | Get user details |
| PATCH | `/users/{userId}` | Update user |
| DELETE | `/users/{userId}` | Delete user |
| GET | `/users/{userId}/settings` | Get user settings |
| PATCH | `/users/{userId}/settings` | Update user settings |
| PUT | `/users/{userId}/status` | Activate/deactivate user |
| PUT | `/users/{userId}/password` | Update password |
| GET | `/users/{userId}/permissions` | Get permissions |
| GET | `/users/{userId}/token` | Get user token (ZAK) |
| GET | `/users/{userId}/meetings` | List user's meetings |
| GET | `/users/{userId}/webinars` | List user's webinars |
| GET | `/users/{userId}/recordings` | List user's recordings |
| GET | `/users/{userId}/assistants` | List assistants |
| POST | `/users/{userId}/assistants` | Add assistants |
| DELETE | `/users/{userId}/assistants` | Remove all assistants |
| DELETE | `/users/{userId}/assistants/{assistantId}` | Remove specific assistant |

### Get User Example
```bash
curl "https://api.zoom.us/v2/users/me" \
  -H "Authorization: Bearer TOKEN"
```

**Response:**
```json
{
  "id": "abc123",
  "first_name": "Gary",
  "last_name": "Cosby",
  "email": "gary@oocunlimited.com",
  "type": 2,
  "status": "active",
  "pmi": 1234567890,
  "timezone": "America/New_York",
  "created_at": "2020-01-01T00:00:00Z",
  "last_login_time": "2026-02-08T20:00:00Z",
  "plan_united_type": "2"
}
```

---

## Recordings API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/{userId}/recordings` | List all cloud recordings |
| GET | `/meetings/{meetingId}/recordings` | Get meeting recordings |
| DELETE | `/meetings/{meetingId}/recordings` | Delete all recordings for meeting |
| DELETE | `/meetings/{meetingId}/recordings/{recordingId}` | Delete specific recording file |
| PUT | `/meetings/{meetingId}/recordings/status` | Recover from trash |
| GET | `/meetings/{meetingId}/recordings/settings` | Get recording settings |
| PATCH | `/meetings/{meetingId}/recordings/settings` | Update recording settings |
| GET | `/meetings/{meetingId}/recordings/registrants` | List recording registrants |
| POST | `/meetings/{meetingId}/recordings/registrants` | Add recording registrant |

### List Recordings Example
```bash
curl "https://api.zoom.us/v2/users/me/recordings?from=2026-02-01&to=2026-02-09" \
  -H "Authorization: Bearer TOKEN"
```

**Response:**
```json
{
  "from": "2026-02-01",
  "to": "2026-02-09",
  "page_count": 1,
  "page_size": 30,
  "total_records": 3,
  "meetings": [
    {
      "uuid": "abc123==",
      "id": 12345678901,
      "topic": "GFI Training",
      "start_time": "2026-02-03T19:00:00Z",
      "duration": 87,
      "total_size": 156000000,
      "recording_count": 4,
      "recording_files": [
        {
          "id": "file-id-1",
          "meeting_id": "abc123==",
          "recording_start": "2026-02-03T19:00:15Z",
          "recording_end": "2026-02-03T20:27:30Z",
          "file_type": "MP4",
          "file_extension": "MP4",
          "file_size": 120000000,
          "download_url": "https://zoom.us/rec/download/...",
          "play_url": "https://zoom.us/rec/play/...",
          "status": "completed",
          "recording_type": "shared_screen_with_speaker_view"
        },
        {
          "id": "file-id-2",
          "file_type": "M4A",
          "file_extension": "M4A",
          "file_size": 25000000,
          "recording_type": "audio_only"
        },
        {
          "id": "file-id-3",
          "file_type": "TRANSCRIPT",
          "file_extension": "VTT",
          "recording_type": "audio_transcript"
        },
        {
          "id": "file-id-4",
          "file_type": "CHAT",
          "file_extension": "TXT",
          "recording_type": "chat_file"
        }
      ]
    }
  ]
}
```

### Download a Recording
```bash
# The download_url requires the access token as a query parameter
curl -L "https://zoom.us/rec/download/RECORDING_TOKEN?access_token=TOKEN" \
  -o recording.mp4
```

### Recover Deleted Recording
```bash
curl -X PUT "https://api.zoom.us/v2/meetings/{meetingId}/recordings/status" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "recover"}'
```

---

## Reports API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/report/daily` | Daily usage report |
| GET | `/report/users` | Active/inactive users |
| GET | `/report/users/{userId}/meetings` | User's meeting reports |
| GET | `/report/meetings/{meetingId}` | Meeting detail report |
| GET | `/report/meetings/{meetingId}/participants` | Meeting participants report |
| GET | `/report/meetings/{meetingId}/polls` | Meeting poll report |
| GET | `/report/webinars/{webinarId}` | Webinar detail report |
| GET | `/report/webinars/{webinarId}/participants` | Webinar participants |
| GET | `/report/webinars/{webinarId}/polls` | Webinar poll report |
| GET | `/report/webinars/{webinarId}/qa` | Webinar Q&A report |
| GET | `/report/telephone` | Telephone report |
| GET | `/report/cloud_recording` | Cloud recording storage |
| GET | `/report/operationlogs` | Operation logs |

### Get Meeting Participants Report
```bash
curl "https://api.zoom.us/v2/report/meetings/{meetingId}/participants?page_size=300" \
  -H "Authorization: Bearer TOKEN"
```

**Response:**
```json
{
  "page_count": 1,
  "page_size": 300,
  "total_records": 45,
  "participants": [
    {
      "id": "participant-uuid",
      "user_id": "16778240",
      "name": "John Smith",
      "user_email": "john@email.com",
      "join_time": "2026-02-03T19:02:15Z",
      "leave_time": "2026-02-03T20:27:30Z",
      "duration": 5115,
      "attentiveness_score": "",
      "bo_mtg_id": "breakout-room-uuid",
      "status": "in_meeting",
      "customer_key": ""
    }
  ]
}
```

**Key field:** `bo_mtg_id` identifies which breakout room a participant was in.

---

## Dashboard / Metrics API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/metrics/meetings` | List meetings (real-time) |
| GET | `/metrics/meetings/{meetingId}` | Meeting details (real-time) |
| GET | `/metrics/meetings/{meetingId}/participants` | Meeting participants (real-time) |
| GET | `/metrics/meetings/{meetingId}/participants/{participantId}/qos` | Participant QoS |
| GET | `/metrics/webinars` | List webinars (real-time) |
| GET | `/metrics/zoomrooms` | Zoom Rooms dashboard |
| GET | `/metrics/im` | IM metrics |
| GET | `/metrics/client/feedback` | Client feedback |
| GET | `/metrics/client/satisfaction` | Client satisfaction |

**Note:** Dashboard endpoints require Business or Enterprise plan.

---

## Webinars API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/{userId}/webinars` | Create webinar |
| GET | `/users/{userId}/webinars` | List user's webinars |
| GET | `/webinars/{webinarId}` | Get webinar |
| PATCH | `/webinars/{webinarId}` | Update webinar |
| DELETE | `/webinars/{webinarId}` | Delete webinar |
| PUT | `/webinars/{webinarId}/status` | End webinar |
| GET | `/webinars/{webinarId}/registrants` | List registrants |
| POST | `/webinars/{webinarId}/registrants` | Add registrant |
| PUT | `/webinars/{webinarId}/registrants/status` | Update registrant status |
| GET | `/webinars/{webinarId}/panelists` | List panelists |
| POST | `/webinars/{webinarId}/panelists` | Add panelists |
| DELETE | `/webinars/{webinarId}/panelists` | Remove all panelists |
| GET | `/webinars/{webinarId}/polls` | List polls |
| POST | `/webinars/{webinarId}/polls` | Create poll |
| GET | `/webinars/{webinarId}/absentees` | List absentees |

---

## Groups API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/groups` | List groups |
| POST | `/groups` | Create group |
| GET | `/groups/{groupId}` | Get group |
| PATCH | `/groups/{groupId}` | Update group |
| DELETE | `/groups/{groupId}` | Delete group |
| GET | `/groups/{groupId}/members` | List group members |
| POST | `/groups/{groupId}/members` | Add members |
| DELETE | `/groups/{groupId}/members/{memberId}` | Remove member |
| GET | `/groups/{groupId}/settings` | Get group settings |
| PATCH | `/groups/{groupId}/settings` | Update group settings |
| GET | `/groups/{groupId}/lock_settings` | Get locked settings |
| PATCH | `/groups/{groupId}/lock_settings` | Update locked settings |

---

## Roles API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/roles` | List roles |
| POST | `/roles` | Create role |
| GET | `/roles/{roleId}` | Get role details |
| PATCH | `/roles/{roleId}` | Update role |
| DELETE | `/roles/{roleId}` | Delete role |
| GET | `/roles/{roleId}/members` | List role members |
| POST | `/roles/{roleId}/members` | Assign members to role |
| DELETE | `/roles/{roleId}/members/{memberId}` | Remove member from role |

---

## Chat API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/chat/users/{userId}/channels` | List user's channels |
| POST | `/chat/users/{userId}/channels` | Create channel |
| GET | `/chat/channels/{channelId}` | Get channel |
| PATCH | `/chat/channels/{channelId}` | Update channel |
| DELETE | `/chat/channels/{channelId}` | Delete channel |
| GET | `/chat/channels/{channelId}/members` | List members |
| POST | `/chat/channels/{channelId}/members` | Add members |
| DELETE | `/chat/channels/{channelId}/members/{memberId}` | Remove member |
| GET | `/chat/users/{userId}/messages` | List messages |
| POST | `/chat/users/{userId}/messages` | Send message |
| PUT | `/chat/users/{userId}/messages/{messageId}` | Update message |
| DELETE | `/chat/users/{userId}/messages/{messageId}` | Delete message |

---

## Webhook Event Types — Complete Reference

### Meeting Events
```
meeting.created
meeting.updated
meeting.deleted
meeting.started
meeting.ended
meeting.recovered
meeting.permanently_deleted
meeting.registration_created
meeting.registration_approved
meeting.registration_cancelled
meeting.registration_denied
meeting.participant_joined
meeting.participant_left
meeting.participant_joined_waiting_room
meeting.participant_admitted
meeting.participant_put_in_waiting_room
meeting.participant_joined_breakout_room
meeting.participant_left_breakout_room
meeting.sharing_started
meeting.sharing_ended
meeting.alert
```

### Recording Events
```
recording.started
recording.paused
recording.resumed
recording.stopped
recording.completed
recording.renamed
recording.trashed
recording.deleted
recording.recovered
recording.transcript_completed
recording.registration_created
recording.registration_approved
recording.registration_denied
```

### Webinar Events
```
webinar.created
webinar.updated
webinar.deleted
webinar.started
webinar.ended
webinar.registration_created
webinar.registration_approved
webinar.registration_cancelled
webinar.registration_denied
webinar.participant_joined
webinar.participant_left
webinar.sharing_started
webinar.sharing_ended
```

### User Events
```
user.created
user.updated
user.deleted
user.activated
user.deactivated
user.presence_status_updated
user.personal_notes_updated
user.settings_updated
user.signed_in
user.signed_out
```

### Account Events
```
account.created
account.updated
account.settings_updated
account.disassociated
```

### Chat Events
```
chat_message.sent
chat_message.updated
chat_message.deleted
chat_message.replied
chat_message.reacted
chat_channel.created
chat_channel.updated
chat_channel.deleted
chat_channel.member_added
chat_channel.member_removed
```

---

## Webhook Payload Examples

### meeting.participant_joined
```json
{
  "event": "meeting.participant_joined",
  "event_ts": 1707500000000,
  "payload": {
    "account_id": "ABCDEF123",
    "object": {
      "id": 12345678901,
      "uuid": "abc123==",
      "topic": "GFI Weekly Training",
      "type": 8,
      "host_id": "gary_user_id",
      "participant": {
        "user_id": "16778240",
        "user_name": "John Smith",
        "id": "participant_uuid",
        "email": "john@email.com",
        "participant_user_id": "zoom_user_id",
        "join_time": "2026-02-10T19:05:23Z"
      }
    }
  }
}
```

### recording.completed
```json
{
  "event": "recording.completed",
  "event_ts": 1707500000000,
  "payload": {
    "account_id": "ABCDEF123",
    "object": {
      "id": 12345678901,
      "uuid": "abc123==",
      "topic": "GFI Weekly Training",
      "host_id": "gary_user_id",
      "host_email": "gary@oocunlimited.com",
      "start_time": "2026-02-10T19:00:00Z",
      "duration": 90,
      "total_size": 250000000,
      "recording_count": 4,
      "share_url": "https://zoom.us/rec/share/...",
      "recording_files": [
        {
          "id": "file-uuid",
          "meeting_id": "abc123==",
          "recording_start": "2026-02-10T19:00:15Z",
          "recording_end": "2026-02-10T20:30:00Z",
          "file_type": "MP4",
          "file_extension": "MP4",
          "file_size": 180000000,
          "download_url": "https://zoom.us/rec/download/...",
          "play_url": "https://zoom.us/rec/play/...",
          "status": "completed",
          "recording_type": "shared_screen_with_speaker_view"
        }
      ]
    }
  }
}
```

---

## Webhook Setup — Step by Step

### 1. Create Webhook Endpoint
Your server needs an HTTPS endpoint that:
- Accepts POST requests
- Responds to URL validation challenges
- Validates `x-zm-signature` header
- Processes events and returns 200 OK within 3 seconds

### 2. URL Validation Handler
```python
import hashlib, hmac, json

def handle_webhook(request):
    body = request.json
    
    # URL validation challenge
    if body.get('event') == 'endpoint.url_validation':
        plain_token = body['payload']['plainToken']
        encrypted = hmac.new(
            WEBHOOK_SECRET.encode(), 
            plain_token.encode(), 
            hashlib.sha256
        ).hexdigest()
        return {'plainToken': plain_token, 'encryptedToken': encrypted}
    
    # Validate signature
    timestamp = request.headers.get('x-zm-request-timestamp')
    signature = request.headers.get('x-zm-signature')
    message = f"v0:{timestamp}:{request.data.decode()}"
    expected = 'v0=' + hmac.new(
        WEBHOOK_SECRET.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()
    
    if signature != expected:
        return 'Invalid signature', 403
    
    # Process event
    event = body['event']
    payload = body['payload']
    
    if event == 'meeting.participant_joined':
        # Log attendance
        pass
    elif event == 'recording.completed':
        # Download and distribute
        pass
    
    return 'OK', 200
```

### 3. Subscribe to Events
In Zoom App Marketplace → your app → Features → Event Subscriptions:
1. Click "Add New Event Subscription"
2. Enter subscription name
3. Enter your endpoint URL
4. Click "Add Events"
5. Select desired events
6. Save → Zoom validates your endpoint

---

## Rate Limits Quick Reference

| Tier | Limit | Applies To |
|------|-------|-----------|
| Light | 30 req/sec | GET list endpoints |
| Medium | 20 req/sec | GET detail endpoints |
| Heavy | 10 req/sec | POST/PUT/DELETE |
| Resource-intensive | 1 req/sec | Reports, dashboard |

**Headers in response:**
- `X-RateLimit-Limit` — max requests
- `X-RateLimit-Remaining` — remaining
- `X-RateLimit-Reset` — reset timestamp

---

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | — |
| 201 | Created | Resource created |
| 204 | No Content | Success, no body |
| 300 | Meeting ID not found (ended/wrong) | Check meeting ID |
| 400 | Bad Request | Check request body |
| 401 | Unauthorized | Refresh token |
| 403 | Forbidden | Check scopes |
| 404 | Not Found | Check resource ID |
| 409 | Conflict | Resource already exists |
| 429 | Rate Limited | Wait and retry |

---

## Quick Copy — Common Operations

### Schedule Gary's Weekly GFI Call
```bash
TOKEN=$(curl -s -X POST "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=$ZOOM_ACCOUNT_ID" \
  -H "Authorization: Basic $(echo -n "$ZOOM_CLIENT_ID:$ZOOM_CLIENT_SECRET" | base64)" | jq -r '.access_token')

curl -X POST "https://api.zoom.us/v2/users/me/meetings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "GFI Weekly Training",
    "type": 8,
    "start_time": "2026-02-10T19:00:00",
    "duration": 90,
    "timezone": "America/New_York",
    "password": "gfi2026",
    "recurrence": {"type": 2, "repeat_interval": 1, "weekly_days": "2", "end_times": 52},
    "settings": {
      "host_video": true, "participant_video": false,
      "mute_upon_entry": true, "waiting_room": true,
      "auto_recording": "cloud",
      "breakout_room": {
        "enable": true,
        "rooms": [
          {"name": "New Recruits", "participants": []},
          {"name": "Experienced Agents", "participants": []}
        ]
      }
    }
  }'
```

### Get Today's Recordings
```bash
curl "https://api.zoom.us/v2/users/me/recordings?from=$(date +%Y-%m-%d)&to=$(date +%Y-%m-%d)" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Attendance for Last Meeting
```bash
curl "https://api.zoom.us/v2/report/meetings/{meetingId}/participants?page_size=300" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Poll Results
```bash
curl "https://api.zoom.us/v2/report/meetings/{meetingId}/polls" \
  -H "Authorization: Bearer $TOKEN"
```

---

*See [zoom-executive-assistant.md](zoom-executive-assistant.md) for the full operational knowledge base with best practices and the hybrid AppleScript + API strategy.*
