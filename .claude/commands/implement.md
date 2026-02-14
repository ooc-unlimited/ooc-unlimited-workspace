# /implement — Execute an Implementation Plan

## Usage
`/implement <path-to-plan-file>`

## Instructions

You are executing an implementation plan. Follow these steps exactly:

### 1. Read the Plan
- Load the plan file specified: $ARGUMENTS
- If no file specified, check `plans/` for the most recent plan and confirm with the user
- Parse all implementation steps, files to create/modify, and success criteria

### 2. Load Context
Read workspace context files to ensure consistency:
- `SOUL.md`, `USER.md`, `AGENTS.md`
- Any files listed in the plan's "Files to Create/Modify" table

### 3. Execute Every Step
- Work through each implementation step sequentially
- For each step:
  - Announce what you're doing
  - Do it (create files, modify code, run commands)
  - Verify it worked
- If a step fails, note the failure and continue with remaining steps

### 4. Update Documentation
- Update `AGENTS.md` or `TOOLS.md` if new tools/conventions were added
- Update any relevant workspace docs to reflect changes
- Log what was done in `memory/YYYY-MM-DD.md`

### 5. Mark Plan Complete
- Update the plan file's **Status** from `Draft` to `Complete`
- Check off success criteria that were met
- Note any criteria that weren't met and why

### 6. Summary
Provide a concise summary:
- ✅ What was completed
- ⚠️ What had issues
- 📝 What needs follow-up
- Files created/modified list

**Plan to implement:** $ARGUMENTS
