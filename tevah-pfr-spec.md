# Tevah PFR Integration Spec
## Personal Financial Review → Tevah Back Office Flow

### Purpose
Connects client PFR (Personal Financial Review) data from field operations to Tevah Tech platform for:
- Commission tracking and projections
- Agent performance metrics
- Client lifecycle reporting
- Production analytics
- Revenue forecasting

---

## PFR → Tevah Data Flow

### Core PFR Data Points

| Field | Source | Tevah Destination | Purpose |
|-------|---------|-------------------|---------|
| **Client Name** | PFR Form | Client Master | Identity & policy matching |
| **Agent Code** | PFR Form | Agent Production | Commission attribution |
| **Product Type** | PFR Analysis | Product Performance | Production mix analysis |
| **Premium Amount** | PFR Recommendation | Revenue Tracking | Commission calculation |
| **Face Amount** | PFR Recommendation | Coverage Tracking | Production volume |
| **Carrier** | PFR Selection | Carrier Mix | Relationship metrics |
| **Application Date** | PFR Submission | Pipeline Tracking | Time-to-close metrics |
| **Commission Estimate** | PFR Calculator | Financial Planning | Cash flow projection |
| **Lead Source** | PFR Intake | Marketing ROI | Source effectiveness |

### Tevah Integration Points

#### 1. **Agent Production Dashboard**
```
PFR Completed → Tevah Agent Metrics
- PFRs conducted (monthly/weekly)
- Closing ratio (PFR → Application)
- Average premium per PFR
- Product mix by agent
- Pipeline velocity
```

#### 2. **Commission Forecasting**
```
PFR Recommendations → Tevah Revenue Projection
- Estimated commissions by month
- Pipeline value by agent
- Product type performance
- Carrier relationship metrics
```

#### 3. **Client Lifecycle Tracking**
```
PFR → Application → Issued → In Force
Tevah tracks complete journey:
- Days from PFR to application
- Approval rate by carrier
- Persistency by product type
- Client lifetime value
```

---

## PFR Form → Tevah Mapping

### Required PFR Fields for Tevah Integration

**Client Information:**
- Full Name (First, Last)
- DOB
- Address (City, State, ZIP)
- Phone, Email
- Spouse Information (if applicable)

**Financial Snapshot:**
- Current Income
- Debt Load
- Existing Coverage
- Financial Goals
- Risk Tolerance

**Product Recommendation:**
- Primary Product (IUL/Term/WL/Annuity/FE)
- Carrier Selection
- Premium Amount (Monthly/Annual)
- Face Amount / Coverage
- Riders/Options

**Sales Process:**
- PFR Date
- Agent Code (A2081 + team member)
- Lead Source
- Closing Status
- Follow-up Schedule

---

## Tevah Reporting Requirements

### Agent Performance Reports
1. **PFR Activity Report**
   - PFRs conducted by agent
   - Closing percentage
   - Average premium
   - Product mix

2. **Pipeline Report**
   - PFRs → Applications (conversion)
   - Applications → Issued (approval rate)
   - Days in each stage
   - Revenue projection

3. **Commission Forecast**
   - Estimated commissions by month
   - Agent production trends
   - Product performance
   - Carrier relationships

### Team Metrics (Gary's Dashboard)
1. **Recruiting Velocity**
   - New agent PFR performance
   - Training effectiveness
   - Agent retention by PFR success

2. **Revenue Tracking**
   - Team production
   - Commission flow
   - Goal progress ($556K target)

3. **Business Intelligence**
   - Lead source ROI
   - Product profitability
   - Market penetration

---

## Implementation Phases

### Phase 1: Manual Data Entry (Immediate)
- Gary manually enters PFR outcomes into Tevah
- Focus on core metrics: Agent, Product, Premium, Carrier
- Weekly batch upload from PFR tracking sheets

### Phase 2: GHL → Tevah Integration (30 days)
- GHL pipeline stage changes trigger Tevah updates
- API integration for real-time data sync
- Automated commission calculations

### Phase 3: PFR Form → Tevah Direct (60 days)
- Digital PFR form with direct Tevah submission
- Real-time agent performance tracking
- Client portal integration

---

## Tevah Agent Code Structure

**Primary Code:** A2081 (Gary)
**Team Structure:**
- A2081-01 → First recruit
- A2081-02 → Second recruit
- A2081-[XX] → Agent sequence

**PFR Attribution:**
- Each PFR tagged with conducting agent code
- Commission split calculations
- Recruiting credit tracking

---

## Key Performance Indicators (KPIs)

### Agent-Level KPIs
- **PFR Conversion Rate:** PFRs → Applications (Target: 60%+)
- **Premium Per PFR:** Average premium per completed PFR
- **PFR Velocity:** PFRs completed per week
- **Pipeline Time:** Days from PFR to policy issued

### Team-Level KPIs
- **Total Team Production:** Sum of all agent production
- **Recruiting Effectiveness:** New agent PFR success rate
- **Revenue Per Life License:** Production ÷ licensed agents
- **Net License Ratio:** Licensed agents ÷ total recruits

### Business-Level KPIs
- **Monthly Recurring Revenue:** Total team premiums
- **Commission Flow:** Monthly commission income
- **Goal Progress:** Progress toward $556K target
- **Agent Retention:** Agents active > 90 days

---

## Tevah Dashboard Requirements

### Gary's Executive View
- Total team PFR activity
- Commission projections by month
- Agent performance rankings
- Goal tracking vs. $556K target

### Agent Individual View
- Personal PFR metrics
- Commission tracker
- Pipeline status
- Performance vs. team average

### Field Training Integration
- PFR scheduling for new agents
- Training effectiveness tracking
- Mentor assignment and results

---

## Data Validation & Quality Control

### Required Fields (Must Have)
- Agent Code
- Client Name
- Product Type
- Premium Amount
- PFR Date

### Optional Fields (Nice to Have)
- Lead Source
- Carrier
- Face Amount
- Commission Estimate

### Quality Checks
- Duplicate client detection
- Agent code validation
- Premium amount reasonableness
- Date range validation

---

## Security & Compliance

### Data Protection
- Client PII encryption
- Agent code access controls
- Audit trail for all entries
- GDPR/privacy compliance

### Access Levels
- **Gary (A2081):** Full team visibility
- **Agents:** Own clients only
- **Admin:** System management
- **Reports:** Read-only dashboard access

---

## Success Metrics

### 30-Day Goals
- [ ] All PFRs logged in Tevah within 24 hours
- [ ] Agent performance tracking operational
- [ ] Commission forecasting accurate ±10%

### 60-Day Goals
- [ ] GHL → Tevah integration live
- [ ] Real-time agent dashboards
- [ ] Automated KPI reporting

### 90-Day Goals
- [ ] PFR → Tevah direct integration
- [ ] Complete business intelligence suite
- [ ] $556K goal tracking system operational

---

*Spec by Donna ⚡ | Feb 20, 2026 | Supporting Gary's mission to $556K cash flow by May 23, 2026*