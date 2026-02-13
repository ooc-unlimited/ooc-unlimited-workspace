# GoHighLevel API Reference

> Comprehensive API reference for GoHighLevel (GHL) CRM platform  
> Last updated: February 2026

---

## Authentication

GHL offers two authentication methods:

### API Key (v1 — Legacy)
- Found in **Settings → Business Info → API Key**
- Tied to a single location/agency
- Header: `Authorization: Bearer <api-key>`
- **Deprecated for new integrations** — use OAuth 2.0

### OAuth 2.0 (v2 — Recommended)
- Create app in **Settings → API → OAuth Apps** to get `client_id` and `client_secret`
- Supports scoped permissions (e.g., `contacts.read`, `opportunities.write`, `calendars.write`)
- Multi-location support

#### OAuth Flow
```
1. Redirect user to authorization URL
2. User authorizes → code returned to redirect_uri  
3. Exchange code for access_token + refresh_token
4. Use access_token for API calls
5. Refresh when expired
```

#### Authorization URL
```
GET https://marketplace.gohighlevel.com/oauth/chooselocation
  ?response_type=code
  &redirect_uri=https://your-app.com/callback
  &client_id=YOUR_CLIENT_ID
  &scope=contacts.readonly contacts.write opportunities.write
```

#### Token Exchange
```bash
curl -X POST https://services.leadconnectorhq.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE" \
  -d "redirect_uri=https://your-app.com/callback"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "refresh_token": "def50200...",
  "scope": "contacts.readonly contacts.write",
  "locationId": "loc_abc123"
}
```

#### Refresh Token
```bash
curl -X POST https://services.leadconnectorhq.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=YOUR_REFRESH_TOKEN"
```

---

## Base URLs

| Version | Base URL |
|---------|----------|
| v1 (Legacy) | `https://rest.gohighlevel.com/v1` |
| v2 (Current) | `https://services.leadconnectorhq.com` |

### Required Headers (All Requests)
```
Authorization: Bearer <access-token-or-api-key>
Content-Type: application/json
Version: 2021-07-28          # API version header (v2)
```

For location-specific v2 requests, the `locationId` is often a query parameter or in the request body.

---

## Rate Limits

| Metric | Limit |
|--------|-------|
| Requests per minute | **100** per token |
| Burst | Short bursts allowed, sustained rate enforced |
| HTTP 429 | Returned when exceeded |

### Rate Limit Response Headers
```
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 42
X-Rate-Limit-Reset: 1703275260
```

**Best practice**: Implement exponential backoff on 429 responses. Cache where possible.

---

## API Endpoints Reference

### Contacts

#### Create Contact
```bash
POST /contacts/
```
```bash
curl -X POST "https://services.leadconnectorhq.com/contacts/" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Version: 2021-07-28" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "+14075551234",
    "locationId": "loc_abc123",
    "tags": ["Licensed", "PropHog-Lead", "Life-Licensed"],
    "customFields": [
      {"id": "cf_license_state", "value": "FL"},
      {"id": "cf_license_number", "value": "W123456"}
    ],
    "source": "PropHog"
  }'
```

**Response (201):**
```json
{
  "contact": {
    "id": "cont_xyz789",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "+14075551234",
    "locationId": "loc_abc123",
    "tags": ["Licensed", "PropHog-Lead", "Life-Licensed"],
    "dateAdded": "2026-02-12T13:00:00Z"
  }
}
```

#### Search/List Contacts
```bash
GET /contacts/?locationId=loc_abc123&query=john&limit=20&offset=0
```

#### Get Contact by ID
```bash
GET /contacts/{contactId}
```

#### Update Contact
```bash
PUT /contacts/{contactId}
```
```bash
curl -X PUT "https://services.leadconnectorhq.com/contacts/cont_xyz789" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Version: 2021-07-28" \
  -d '{
    "tags": ["Licensed", "Contracted", "Active-Agent"],
    "customFields": [
      {"id": "cf_contract_date", "value": "2026-02-12"}
    ]
  }'
```

#### Delete Contact
```bash
DELETE /contacts/{contactId}
```

#### Add Tags to Contact
```bash
POST /contacts/{contactId}/tags
```
```json
{"tags": ["Hot-Lead", "Presentation-Scheduled"]}
```

#### Remove Tag from Contact
```bash
DELETE /contacts/{contactId}/tags
```
```json
{"tags": ["Cold-Lead"]}
```

#### Add/Remove from Workflow
```bash
POST /contacts/{contactId}/workflow/{workflowId}
DELETE /contacts/{contactId}/workflow/{workflowId}
```

---

### Opportunities

#### Create Opportunity
```bash
POST /opportunities/
```
```bash
curl -X POST "https://services.leadconnectorhq.com/opportunities/" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Version: 2021-07-28" \
  -d '{
    "pipelineId": "pipe_recruiting",
    "locationId": "loc_abc123",
    "name": "John Smith - Agent Recruit",
    "pipelineStageId": "stage_lead",
    "contactId": "cont_xyz789",
    "monetaryValue": 5000,
    "assignedTo": "user_gary123",
    "status": "open"
  }'
```

**Response (201):**
```json
{
  "opportunity": {
    "id": "opp_abc456",
    "name": "John Smith - Agent Recruit",
    "pipelineId": "pipe_recruiting",
    "pipelineStageId": "stage_lead",
    "contactId": "cont_xyz789",
    "monetaryValue": 5000,
    "status": "open"
  }
}
```

#### List Opportunities
```bash
GET /opportunities/?locationId=loc_abc123&pipelineId=pipe_recruiting
```

#### Update Opportunity (Move Stage)
```bash
PUT /opportunities/{opportunityId}
```
```json
{
  "pipelineStageId": "stage_contracted",
  "status": "won",
  "monetaryValue": 5000
}
```

#### Delete Opportunity
```bash
DELETE /opportunities/{opportunityId}
```

---

### Pipelines

#### List Pipelines
```bash
GET /opportunities/pipelines?locationId=loc_abc123
```

**Response:**
```json
{
  "pipelines": [
    {
      "id": "pipe_recruiting",
      "name": "Agent Recruiting",
      "stages": [
        {"id": "stage_lead", "name": "Lead", "position": 0},
        {"id": "stage_contacted", "name": "Contacted", "position": 1},
        {"id": "stage_interested", "name": "Interested", "position": 2},
        {"id": "stage_presentation", "name": "Presentation Scheduled", "position": 3},
        {"id": "stage_contracted", "name": "Contracted", "position": 4}
      ]
    }
  ]
}
```

---

### Conversations & Messages

#### Send SMS
```bash
POST /conversations/messages
```
```bash
curl -X POST "https://services.leadconnectorhq.com/conversations/messages" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Version: 2021-07-28" \
  -d '{
    "type": "SMS",
    "contactId": "cont_xyz789",
    "message": "Hi John, this is Gary from OOC Unlimited. I saw you are a licensed agent in FL. Would love to chat about an opportunity. When works best?"
  }'
```

**Response (201):**
```json
{
  "messageId": "msg_123",
  "contactId": "cont_xyz789",
  "type": "SMS",
  "status": "sent",
  "dateAdded": "2026-02-12T13:05:00Z"
}
```

#### Send Email
```bash
POST /conversations/messages
```
```json
{
  "type": "Email",
  "contactId": "cont_xyz789",
  "subject": "Exciting Opportunity for Licensed Agents",
  "message": "<html><body><p>Hi John...</p></body></html>",
  "emailFrom": "gary@oocunlimited.com"
}
```

#### List Conversations
```bash
GET /conversations/?locationId=loc_abc123&contactId=cont_xyz789
```

#### Get Messages in Conversation
```bash
GET /conversations/{conversationId}/messages
```

---

### Calendars

#### List Calendars
```bash
GET /calendars/?locationId=loc_abc123
```

#### Get Free Slots
```bash
GET /calendars/{calendarId}/free-slots?startDate=2026-02-12&endDate=2026-02-19&timezone=America/New_York
```

**Response:**
```json
{
  "slots": {
    "2026-02-12": [
      {"start": "2026-02-12T09:00:00-05:00", "end": "2026-02-12T09:30:00-05:00"},
      {"start": "2026-02-12T10:00:00-05:00", "end": "2026-02-12T10:30:00-05:00"}
    ],
    "2026-02-13": [
      {"start": "2026-02-13T09:00:00-05:00", "end": "2026-02-13T09:30:00-05:00"}
    ]
  }
}
```

#### Create Appointment
```bash
POST /calendars/events/appointments
```
```bash
curl -X POST "https://services.leadconnectorhq.com/calendars/events/appointments" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Version: 2021-07-28" \
  -d '{
    "calendarId": "cal_abc",
    "locationId": "loc_abc123",
    "contactId": "cont_xyz789",
    "startTime": "2026-02-14T10:00:00-05:00",
    "endTime": "2026-02-14T10:30:00-05:00",
    "title": "iDecide Presentation - John Smith",
    "appointmentStatus": "confirmed"
  }'
```

#### Update Appointment
```bash
PUT /calendars/events/appointments/{eventId}
```

#### Delete Appointment
```bash
DELETE /calendars/events/appointments/{eventId}
```

---

### Workflows

#### List Workflows
```bash
GET /workflows/?locationId=loc_abc123
```

#### Add Contact to Workflow (Trigger)
```bash
POST /contacts/{contactId}/workflow/{workflowId}
```
```bash
curl -X POST "https://services.leadconnectorhq.com/contacts/cont_xyz789/workflow/wf_onboarding" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Version: 2021-07-28"
```

**Response (200):**
```json
{"status": "success"}
```

#### Remove Contact from Workflow
```bash
DELETE /contacts/{contactId}/workflow/{workflowId}
```

---

### Locations

#### List Locations (Agency Level)
```bash
GET /locations/search?companyId=comp_abc
```

#### Get Location
```bash
GET /locations/{locationId}
```

---

### Users

#### List Users
```bash
GET /users/?locationId=loc_abc123
```

#### Get User
```bash
GET /users/{userId}
```

---

## Webhooks

### Setup
1. Go to **Settings → Webhooks** in GHL
2. Add endpoint URL
3. Select events to subscribe to

### Available Webhook Events
| Event | Description |
|-------|-------------|
| `ContactCreate` | New contact created |
| `ContactUpdate` | Contact record updated |
| `ContactDelete` | Contact deleted |
| `ContactDndUpdate` | DND status changed |
| `ContactTagUpdate` | Tags added/removed |
| `NoteCreate` | Note added to contact |
| `TaskCreate` | Task created |
| `OpportunityCreate` | New opportunity |
| `OpportunityUpdate` | Opportunity updated (stage change, etc.) |
| `OpportunityDelete` | Opportunity deleted |
| `OpportunityStageUpdate` | Pipeline stage changed |
| `AppointmentCreate` | Appointment booked |
| `AppointmentUpdate` | Appointment modified |
| `AppointmentDelete` | Appointment cancelled |
| `InboundMessage` | SMS/email received |
| `OutboundMessage` | SMS/email sent |
| `ConversationUnreadUpdate` | Unread count changed |

### Webhook Payload Example (ContactCreate)
```json
{
  "type": "ContactCreate",
  "locationId": "loc_abc123",
  "id": "cont_xyz789",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "phone": "+14075551234",
  "tags": ["Licensed"],
  "source": "PropHog",
  "dateAdded": "2026-02-12T13:00:00Z"
}
```

### Webhook Payload Example (OpportunityStageUpdate)
```json
{
  "type": "OpportunityStageUpdate",
  "locationId": "loc_abc123",
  "id": "opp_abc456",
  "name": "John Smith - Agent Recruit",
  "pipelineId": "pipe_recruiting",
  "pipelineStageId": "stage_contracted",
  "previousStageId": "stage_presentation",
  "contactId": "cont_xyz789",
  "monetaryValue": 5000,
  "dateUpdated": "2026-02-12T15:00:00Z"
}
```

---

## Node.js SDK Example

```javascript
const axios = require('axios');

class GHLClient {
  constructor(accessToken, locationId) {
    this.baseURL = 'https://services.leadconnectorhq.com';
    this.headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    };
    this.locationId = locationId;
  }

  // Create a contact from PropHog lead
  async createContact(lead) {
    const { data } = await axios.post(`${this.baseURL}/contacts/`, {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      locationId: this.locationId,
      tags: ['PropHog-Lead', 'Licensed'],
      source: 'PropHog',
      customFields: [
        { id: 'cf_license_state', value: lead.state },
        { id: 'cf_license_type', value: lead.licenseType }
      ]
    }, { headers: this.headers });
    return data.contact;
  }

  // Create recruiting opportunity
  async createOpportunity(contactId, name, pipelineId, stageId) {
    const { data } = await axios.post(`${this.baseURL}/opportunities/`, {
      pipelineId,
      locationId: this.locationId,
      name,
      pipelineStageId: stageId,
      contactId,
      status: 'open'
    }, { headers: this.headers });
    return data.opportunity;
  }

  // Send SMS to contact
  async sendSMS(contactId, message) {
    const { data } = await axios.post(`${this.baseURL}/conversations/messages`, {
      type: 'SMS',
      contactId,
      message
    }, { headers: this.headers });
    return data;
  }

  // Add contact to workflow (e.g., onboarding sequence)
  async triggerWorkflow(contactId, workflowId) {
    const { data } = await axios.post(
      `${this.baseURL}/contacts/${contactId}/workflow/${workflowId}`,
      {},
      { headers: this.headers }
    );
    return data;
  }

  // Get available calendar slots
  async getSlots(calendarId, startDate, endDate) {
    const { data } = await axios.get(
      `${this.baseURL}/calendars/${calendarId}/free-slots`,
      {
        params: { startDate, endDate, timezone: 'America/New_York' },
        headers: this.headers
      }
    );
    return data.slots;
  }

  // Book appointment
  async bookAppointment(calendarId, contactId, startTime, endTime, title) {
    const { data } = await axios.post(
      `${this.baseURL}/calendars/events/appointments`,
      {
        calendarId,
        locationId: this.locationId,
        contactId,
        startTime,
        endTime,
        title,
        appointmentStatus: 'confirmed'
      },
      { headers: this.headers }
    );
    return data;
  }

  // Search contacts by query
  async searchContacts(query, limit = 20) {
    const { data } = await axios.get(`${this.baseURL}/contacts/`, {
      params: { locationId: this.locationId, query, limit },
      headers: this.headers
    });
    return data.contacts;
  }

  // Update opportunity stage
  async moveOpportunityStage(opportunityId, newStageId, status = 'open') {
    const { data } = await axios.put(
      `${this.baseURL}/opportunities/${opportunityId}`,
      { pipelineStageId: newStageId, status },
      { headers: this.headers }
    );
    return data;
  }
}

// Usage Example: Import PropHog lead → Create contact → Add to pipeline → Trigger workflow
async function processNewRecruit(lead) {
  const ghl = new GHLClient(process.env.GHL_ACCESS_TOKEN, process.env.GHL_LOCATION_ID);
  
  // 1. Create contact
  const contact = await ghl.createContact(lead);
  console.log(`Created contact: ${contact.id}`);
  
  // 2. Create opportunity in recruiting pipeline
  const opp = await ghl.createOpportunity(
    contact.id,
    `${lead.firstName} ${lead.lastName} - Agent Recruit`,
    'pipe_recruiting',
    'stage_lead'
  );
  console.log(`Created opportunity: ${opp.id}`);
  
  // 3. Send initial SMS
  await ghl.sendSMS(contact.id, 
    `Hi ${lead.firstName}, this is Gary from OOC Unlimited. I noticed you're a licensed agent in ${lead.state}. I'd love to share an opportunity with you. When's a good time to chat?`
  );
  
  // 4. Add to speed-to-lead workflow
  await ghl.triggerWorkflow(contact.id, 'wf_speed_to_lead');
  
  console.log('New recruit processed successfully!');
}
```

---

## OAuth Scopes Reference

| Scope | Description |
|-------|-------------|
| `contacts.readonly` | Read contacts |
| `contacts.write` | Create/update/delete contacts |
| `opportunities.readonly` | Read opportunities |
| `opportunities.write` | Create/update/delete opportunities |
| `calendars.readonly` | Read calendars and events |
| `calendars.write` | Create/update/delete calendar events |
| `conversations.readonly` | Read conversations |
| `conversations.write` | Send messages |
| `conversations/message.readonly` | Read messages |
| `conversations/message.write` | Send messages |
| `workflows.readonly` | Read workflows |
| `locations.readonly` | Read locations |
| `locations.write` | Manage locations |
| `users.readonly` | Read users |
| `users.write` | Manage users |

---

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Check request body/params |
| 401 | Unauthorized | Refresh token or check API key |
| 403 | Forbidden | Check scopes/permissions |
| 404 | Not Found | Verify resource ID |
| 422 | Unprocessable Entity | Validation error — check field values |
| 429 | Rate Limited | Implement backoff, retry after reset |
| 500 | Server Error | Retry with backoff |

---

## Quick Reference: Common Operations

| Task | Method | Endpoint |
|------|--------|----------|
| Create contact | POST | `/contacts/` |
| Search contacts | GET | `/contacts/?query=X` |
| Update contact | PUT | `/contacts/{id}` |
| Add tags | POST | `/contacts/{id}/tags` |
| Create opportunity | POST | `/opportunities/` |
| Move opportunity stage | PUT | `/opportunities/{id}` |
| List pipelines | GET | `/opportunities/pipelines` |
| Send SMS | POST | `/conversations/messages` |
| Send email | POST | `/conversations/messages` |
| List calendars | GET | `/calendars/` |
| Get free slots | GET | `/calendars/{id}/free-slots` |
| Book appointment | POST | `/calendars/events/appointments` |
| Trigger workflow | POST | `/contacts/{id}/workflow/{wfId}` |
| List workflows | GET | `/workflows/` |
