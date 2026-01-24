# Claude Code Automation Setup Guide

This guide will help you set up Claude Code automation hooks and MCP integration for RunExpression.

## Prerequisites

- Claude Code CLI installed: `npm install -g @anthropic/claude-code`
- Authenticated with Claude: `claude auth`
- Git repository cloned
- Environment variables configured

## Quick Start

### 1. Set Up Environment Variables

Add these to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
# Linear API Key
export LINEAR_API_KEY="lin_api_xxxxxxxxxxxx"

# Supabase Access Token (for MCP)
export SUPABASE_ACCESS_TOKEN="sbp_xxxxxxxxxxxx"
export SUPABASE_PROJECT_ID="your-project-id"

# Greptile API Key
export GREPTILE_API_KEY="greptile_xxxxxxxxxxxx"

# Optional: GitLab Token
export GITLAB_TOKEN="glpat-xxxxxxxxxxxx"
```

**Getting API Keys:**

- **Linear**: Settings → API → Personal API keys → Create key
- **Supabase**: Project Settings → API → Project API keys → Generate access token
- **Greptile**: Dashboard → Settings → API Keys → Create key
- **GitLab**: Profile → Access Tokens → Add token (scopes: `api`, `read_api`, `write_repository`)

### 2. Verify MCP Servers

Check that MCP servers are connected:

```bash
claude mcp list
```

You should see:
- ✓ linear
- ✓ supabase
- ✓ greptile
- ✓ context7
- ✓ playwright

If any are missing, they'll be automatically configured from `.mcp.json` on next Claude Code session.

### 3. Test the Setup

Try the linear-sync skill:

```bash
# Start work on a Linear issue
/linear-sync start RUN-XXX

# Check if branch was created and Linear updated
git branch
```

## Automation Hooks Configured

### 1. Post-Migration Database Review

**What it does:** Automatically reviews database security and performance when you create or modify a migration file.

**Trigger:** Writing to `supabase/migrations/*.sql`

**Actions:**
1. Displays notification: "🔍 Database migration detected!"
2. Analyzes migration with `db-review` skill
3. Reports security issues (missing RLS policies, exposed keys)
4. Reports performance issues (missing indexes)
5. Provides fix suggestions

**Example:**
```bash
# Create a migration
echo "CREATE TABLE test (...)" > supabase/migrations/20260123_test.sql

# Claude automatically reviews it and shows:
🔍 Database migration detected! Running security and performance review...

## Database Review Report
⚠️  Missing RLS policy on `test` table
💡 Consider adding index on `user_id` column
```

### 2. Pre-PR Linear Issue Reminder

**What it does:** Reminds you to use `/linear-sync pr` when you mention creating a PR.

**Trigger:** User prompt contains "create pr", "open pull request", "make merge request", etc.

**Actions:**
1. Checks current git branch for Linear issue ID
2. If found: Suggests using `/linear-sync pr` with the issue ID
3. If not found: Warns about missing Linear tracking

**Example:**
```bash
User: "Let's create a PR for this feature"

💡 Tip: Use /linear-sync pr to create PR with Linear issue linkage for RUN-123

# Or if no issue ID:
⚠️  No Linear issue ID found in branch name. Consider using /linear-sync start <issue-id> for proper tracking.
```

### 3. Post-Merge Linear Issue Update

**What it does:** Automatically marks Linear issues as "Done" when branches are merged to main.

**Trigger:** Git post-merge hook on main/master branch

**Actions:**
1. Detects merge to main
2. Extracts Linear issue ID from commit message
3. Updates Linear issue to "Done" status
4. Adds comment: "Merged to main in commit [hash]"

**Example:**
```bash
# After merging PR to main
git merge feature/RUN-123-add-vibe-filtering

✅ Merge complete! Updating Linear issue RUN-123 to Done...
✅ Linear issue RUN-123 updated to Done
```

## Skills Available

### `/linear-sync` - Linear Workflow Automation

Automate Linear issue workflow from start to completion.

**Commands:**

```bash
# Start work on issue (creates branch, updates Linear to "In Progress")
/linear-sync start RUN-123

# Create PR (links to Linear, updates to "In Review")
/linear-sync pr

# Check status
/linear-sync status

# Manually complete (usually automatic via git hook)
/linear-sync complete RUN-123
```

**Full Workflow:**
```bash
# 1. Start
/linear-sync start RUN-123
# → Creates: feature/RUN-123-add-vibe-tag-filtering
# → Linear: Backlog → In Progress

# 2. Develop
git commit -m "feat(flow): Add vibe filtering for RUN-123"
git push

# 3. Create PR
/linear-sync pr
# → Creates PR with Linear link
# → Linear: In Progress → In Review

# 4. Merge (automatic)
# → Linear: In Review → Done
```

### `db-review` - Database Security Audit (Claude-only)

Automatically invoked by Claude when migrations are created. Cannot be called directly by users.

**What it checks:**
- Security: Missing RLS policies, exposed keys, SQL injection risks
- Performance: Missing indexes, slow queries, JSONB optimization
- Best practices: Naming conventions, idempotency

**When invoked:**
- After creating/modifying migration files
- During PR review of database changes
- When explicitly requested: "Review database security"

## Troubleshooting

### MCP Connection Issues

**Problem:** `✗ Failed to connect` for MCP server

**Solution:**
```bash
# Check MCP status
claude mcp list

# Verify environment variable
echo $LINEAR_API_KEY

# Reconnect MCP
claude mcp remove linear
claude mcp add linear

# Restart Claude Code session
```

### Hooks Not Running

**Problem:** Automation hooks don't trigger

**Solution:**
```bash
# Check hooks are enabled
cat .claude/settings.local.json | grep hooks

# Verify permissions
cat .claude/settings.local.json | grep allow

# Make git hook executable
chmod +x .husky/post-merge

# Test hook manually
.husky/post-merge
```

### Linear API Permissions

**Problem:** "Permission denied" when updating Linear issues

**Solution:**
- Go to Linear Settings → API → Check token permissions
- Token needs: `read`, `write` permissions
- Regenerate token if needed
- Update `LINEAR_API_KEY` environment variable

### Git Hook Not Updating Linear

**Problem:** Post-merge hook doesn't update Linear issue

**Solution:**
```bash
# Check if hook is executable
ls -la .husky/post-merge

# Test hook manually after merge
.husky/post-merge

# Check commit message includes issue ID
git log -1 --pretty=%B

# Verify Linear MCP connection
claude mcp list | grep linear
```

## Best Practices

### 1. Always Start from Linear

```bash
# ✅ Good: Issue-driven development
/linear-sync start RUN-123
# ... develop ...
/linear-sync pr

# ❌ Bad: Create branch manually
git checkout -b my-feature
# ... hard to link to Linear later
```

### 2. Include Issue ID in Commits

```bash
# ✅ Good
git commit -m "feat(flow): Add vibe filtering for RUN-123"

# ⚠️  OK (issue in body)
git commit -m "feat(flow): Add vibe filtering

Implements RUN-123"

# ❌ Bad (no issue reference)
git commit -m "add vibe tags"
```

### 3. Review Database Changes Before PR

```bash
# After creating migration
# Wait for automatic db-review
# Address any issues found
# Then create PR

/linear-sync pr
```

### 4. Keep Branches Short-Lived

```bash
# ✅ Good: Feature → PR → Merge → Done (1-2 days)
/linear-sync start RUN-123
# ... quick implementation ...
/linear-sync pr
# ... review → merge ...

# ❌ Bad: Long-lived branches (weeks)
# Harder to track, more merge conflicts
```

## Team Workflow

### Daily Workflow

**Morning:**
1. Check Linear for assigned issues
2. Pick issue to work on
3. `/linear-sync start RUN-XXX`

**During Development:**
1. Commit frequently with conventional commits
2. Reference Linear issue ID in commits
3. Push regularly

**End of Development:**
1. `/linear-sync pr`
2. Request review from team
3. Address feedback
4. Merge (Linear auto-updates to Done)

### Code Review Workflow

**Reviewer:**
1. Check PR description has Linear link
2. Click Linear link to see issue context
3. Review code with context
4. Check db-review results (if database changes)
5. Approve or request changes

**Author:**
1. Address review feedback
2. Commit fixes (still references issue ID)
3. Push updates
4. Request re-review

### Database Migration Workflow

**Creating Migration:**
1. Create migration file
2. Wait for automatic db-review
3. Address security/performance issues
4. Commit fixed migration
5. Run `npm run db:types` to update types

**Reviewing Migration:**
1. Check db-review results in PR
2. Verify RLS policies are present
3. Check indexes on foreign keys
4. Review naming conventions
5. Test migration locally

## Advanced Configuration

### Custom Hook Timeouts

Add to `.claude/settings.local.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(supabase/migrations/*.sql)",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "...",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

### Disable Specific Hooks

Temporarily disable a hook:

```json
{
  "disableAllHooks": true
}
```

Or remove specific hook from settings.

### Custom Status Messages

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(supabase/migrations/*.sql)",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "...",
            "statusMessage": "Analyzing database security..."
          }
        ]
      }
    ]
  }
}
```

## Support & Feedback

**Issues or Questions:**
- Check `docs/11-MCP-INTEGRATION-WORKFLOW.md` for detailed documentation
- Ask in team chat
- Create issue in repository

**Feature Requests:**
- Suggest new automation hooks
- Request additional MCP integrations
- Propose workflow improvements

---

**Last Updated:** 2026-01-23
**Maintained By:** Engineering Team
