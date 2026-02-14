# /create-plan — Generate an Implementation Plan

## Usage
`/create-plan <task description>`

## Instructions

You are creating a detailed implementation plan. Follow these steps exactly:

### 1. Load Context
Read these files to understand the full workspace state:
- `SOUL.md` — who you are
- `USER.md` — who you're helping
- `MEMORY.md` — long-term memory
- `.claude/product-marketing-context.md` — product/marketing context
- `AGENTS.md` — workspace conventions

### 2. Analyze Current State
- Review relevant existing files in the workspace
- Check `onboarding-system/` if the task involves the site
- Check `plans/` for any related existing plans
- Identify what already exists vs what needs to be built

### 3. Generate the Plan

Create a file at `plans/YYYY-MM-DD-<slug>.md` with this structure:

```markdown
# Plan: <Title>
**Created:** YYYY-MM-DD
**Status:** Draft
**Task:** <original task description>

## Why This Matters
<Business context — why this is worth doing for OOC Unlimited>

## Current State
<What exists now relevant to this task>

## Key Decisions
<Decisions that need to be made, with recommended choices>

## Files to Create/Modify
| File | Action | Purpose |
|------|--------|---------|
| path/to/file | Create/Modify/Delete | Why |

## Implementation Steps
1. **Step name** — detailed description of what to do
2. **Step name** — detailed description of what to do
   - Sub-step details
   - Expected outcome
3. ...

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Risks & Mitigations
- **Risk:** X → **Mitigation:** Y
```

### 4. Confirm
After saving the plan, summarize it and ask if the user wants to proceed with `/implement plans/YYYY-MM-DD-<slug>.md`

**Task to plan:** $ARGUMENTS
