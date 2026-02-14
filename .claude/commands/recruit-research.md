# /recruit-research — Deep Research on a Licensed Agent Prospect

## Usage
`/recruit-research <agent name> [state] [additional context]`

## Instructions

Research a specific licensed insurance agent prospect before Gary reaches out.

### 1. Research
- Search for their insurance license (state DOI lookup if possible)
- LinkedIn profile and career history
- Current agency/IMO affiliation
- Social media presence
- Any reviews, complaints, or public records
- Production indicators if available
- Lines of authority (life, health, P&C, etc.)

### 2. Generate Report
Save to `outputs/recruit-<name-slug>-YYYY-MM-DD.md`:

```markdown
# Recruit Research: <Full Name>
**Date:** YYYY-MM-DD
**State:** <State>
**License Status:** <Active/Inactive>

## Profile Summary
<Who they are, experience level, current situation>

## License Details
- Lines of Authority: ...
- License Number: ...
- Active Since: ...
- Current Appointments: ...

## Career History
<Where they've been, what they've done>

## Online Presence
- LinkedIn: <url>
- Social: <urls>
- Other: ...

## Talking Points for Outreach
<Personalized angles Gary can use based on their background>
- ...
- ...

## Risk Factors
<Anything to watch out for — complaints, frequent moves, etc.>

## Recommended Approach
<How to reach out — call, text, LinkedIn, referral>
```

### 3. Summarize
Give Gary a quick 3-sentence brief on who this person is and the best angle for outreach.

**Agent to research:** $ARGUMENTS
