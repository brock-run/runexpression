# Linear Import Guide

## Quick Start

You have a complete CSV file ready to import into Linear: `docs/linear-import.csv`

This contains:
- **12 Epics** (labeled as `epic;...`)
- **~80 Stories** (child issues under epics)
- **Priority levels**: 0 (P0/Critical), 1 (P1/High), 2 (P2/Medium)
- **Story point estimates**: 1-5 points per story
- **Labels**: For filtering and organization
- **Parent relationships**: Stories linked to their epics

---

## How to Import into Linear

### Step 1: Access Linear CSV Import

1. Open your Linear workspace
2. Click on your workspace icon (top-left)
3. Go to **Settings** → **Import**
4. Select **CSV import**

### Step 2: Upload the CSV

1. Click **Choose file** or drag the file
2. Select: `/Users/brockstudio/Projects/runexpression/docs/linear-import.csv`
3. Click **Continue**

### Step 3: Map CSV Columns

Linear will show you a preview. Map columns as follows:

| CSV Column | Linear Field | Notes |
|------------|-------------|-------|
| Title | Title | ✅ Auto-mapped |
| Description | Description | ✅ Auto-mapped |
| Priority | Priority | Map: 0=Urgent, 1=High, 2=Medium |
| Labels | Labels | ✅ Auto-mapped (creates labels automatically) |
| Estimate | Estimate | ✅ Auto-mapped (story points) |
| Parent | Parent Issue | ✅ Links stories to epics |

### Step 4: Review & Import

1. **Project**: Select or create "RunExpression V1"
2. **Team**: Assign to your team
3. **Status**: Set default status (e.g., "Backlog" or "Todo")
4. **Assignee**: Leave blank or assign to yourself
5. Click **Import**

⏱️ Import takes 1-2 minutes for ~90 issues.

---

## After Import

### 1. Review Epic Structure

All stories should be nested under their epics:

```
📦 Foundation & Infrastructure (Epic)
  ├─ Project Setup & Configuration
  ├─ Supabase Project Setup
  ├─ Design System & Theme Configuration
  └─ ...

📦 Homepage & Manifesto Experience (Epic)
  ├─ Homepage Layout & Structure
  ├─ Hero Section with Primary CTA
  └─ ...

📦 The Flow (Interactive Canvas) (Epic)
  └─ ...

📦 DWTC Clubhouse (Epic)
  └─ ...
```

### 2. Set Up Views

Create helpful views:

**By Epic** (Group by Parent)
- Groups: Parent issue
- Filters: None
- Sort: Priority

**By Priority** (P0 Critical Issues)
- Filters: Priority = Urgent
- Sort: Estimate

**Current Sprint**
- Filters: Status = In Progress OR Status = In Review
- Sort: Updated (descending)

### 3. Adjust as Needed

Feel free to:
- Update priorities based on your timeline
- Break down large stories (5+ points) into smaller tasks
- Adjust estimates after team discussion
- Add custom labels for your workflow
- Set specific assignees

---

## Linear Labels Created

The import will create these labels:

### By Type
- `epic` - Top-level epic/milestone
- `foundation` - Foundation & infrastructure work
- `frontend` - Frontend development
- `backend` - Backend/API development
- `design` - Design work
- `content` - Content creation

### By Feature Area
- `homepage` - Homepage features
- `flow` - The Flow canvas
- `clubhouse` - DWTC Clubhouse
- `shop` - Shop & commerce
- `auth` - Authentication
- `moderation` - Content moderation
- `ai-coach` - AI coach hooks
- `blog` - Blog features
- `testing` - Testing & QA
- `devops` - DevOps & deployment

### By Activity
- `setup` - Initial setup tasks
- `database` - Database work
- `api` - API endpoints
- `forms` - Form implementation
- `upload` - Upload functionality
- `animation` - Animation work
- `realtime` - Realtime features
- `performance` - Performance optimization

---

## Using Linear with Git Workflow

Once MCP is configured, you can use:

```bash
# Start work on an issue
/linear-sync start RUN-123

# Create a PR when done
/linear-sync pr

# Check status
/linear-sync status
```

See `LINEAR-EPICS-AND-STORIES.md` for full sprint planning details.

---

## Sprint Planning

### Suggested Sprint Structure (2-week sprints)

**Sprint 1-2 (Foundation)**
- All P0 stories from Foundation & Infrastructure epic
- Start Homepage Layout & Structure

**Sprint 3-4 (Homepage + Flow)**
- Complete Homepage & Manifesto Experience epic
- Start The Flow epic (P0 stories)

**Sprint 5-6 (Flow + Clubhouse)**
- Complete The Flow epic
- Start DWTC Clubhouse epic (P0 stories)

**Sprint 7-8 (Clubhouse + Shop)**
- Complete DWTC Clubhouse epic
- Start Shop & Commerce epic

**Sprint 9-10 (Testing + Launch)**
- Complete all Testing & QA
- Content & Brand final review
- Production deployment

---

## Troubleshooting

### "Parent Issue Not Found"

If parent relationships don't work:
1. Import epics first (filter CSV to only epic rows)
2. Then import stories with parent references

### "Invalid Priority Value"

Linear priorities vary by workspace. Common mappings:
- 0 → Urgent
- 1 → High
- 2 → Medium
- 3 → Low

Adjust in Linear after import if needed.

### "Labels Not Created"

Labels are created automatically on import. If missing:
1. Go to Settings → Labels
2. Manually create missing labels
3. Apply to imported issues

### "Estimates Not Showing"

Linear estimates require:
1. Estimates enabled for your team (Team Settings)
2. Valid numeric values in CSV
3. Team-specific scale (1-5, Fibonacci, T-shirt sizes)

---

## Quick Reference

| File | Purpose |
|------|---------|
| `linear-import.csv` | CSV file to import |
| `LINEAR-EPICS-AND-STORIES.md` | Full specification with acceptance criteria |
| This file | Import instructions |

---

## Next Steps After Import

1. ✅ Review all imported issues
2. ✅ Set up Linear views for your workflow
3. ✅ Create first sprint
4. ✅ Assign P0 issues to team members
5. ✅ Configure Linear MCP for git workflow
6. ✅ Start development on Sprint 1 stories

---

**Questions?** Check the full spec in `LINEAR-EPICS-AND-STORIES.md` or adjust issues directly in Linear.
