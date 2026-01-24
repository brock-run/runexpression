# Generate AI Agent Guide

Regenerates the comprehensive AI Agent Guide from all source documentation, skills, agents, and configuration files.

## When to Use

Use this command when:
- You've updated documentation (docs/, docs/adr/)
- You've added or modified skills (.cursor/skills/, .claude/skills/)
- You've added or modified agents (.cursor/agents/, .claude/agents/)
- You've updated configuration files (CLAUDE.md, AGENTS.md, WARP.md)
- You want to ensure the AI Agent Guide is up to date
- You're preparing for a new development session

## What It Does

The script generates `AI-AGENT-GUIDE.md` by reading from:

### Core Documentation
- `docs/*.md` - Core documentation files
- `docs/adr/*.md` - Architectural Decision Records

### Skills
- `.cursor/skills/` - Cursor IDE skills (source)
- `.claude/skills/` - Claude Code skills (converted)

### Agents
- `.cursor/agents/` - Cursor IDE agents (source)
- `.claude/agents/` - Claude Code agents (converted)

### Configuration Files
- `CLAUDE.md` - Claude Code configuration
- `AGENTS.md` - Agents configuration (if exists)
- `WARP.md` - WARP configuration (if exists)
- `.kiro/` - Kiro configuration directory (if exists)

## Workflow Steps

### Step 1: Run the Generator

```bash
node scripts/generate-ai-agent-guide.js
```

Or use the npm command (if added to package.json):

```bash
npm run generate:guide
```

**Expected Output:**
```
🤖 Generating AI Agent Guide...

📂 Processing Core Documentation (docs)...
   ✓ 01-OVERVIEW.md
   ✓ 02-PRODUCT-REQUIREMENTS.md
   ...

📂 Processing Architectural Decision Records (docs/adr)...
   ✓ 001-nextjs-app-router.md
   ✓ 002-supabase-backend.md
   ...

📚 Processing Cursor Skills...
   ✓ clubhouse-patterns
   ✓ content-moderation-trust-systems
   ✓ database-schema-migration
   ...

🤖 Processing Cursor Agents...
   ✓ backend-database-agent
   ✓ content-brand-agent
   ✓ full-stack-feature-agent
   ...

📚 Processing Claude Skills...
   ✓ content-moderation-trust-systems
   ✓ database-schema-migration
   ...

🤖 Processing Claude Agents...
   ✓ backend-database-agent
   ✓ content-brand-agent
   ...

📄 Processing Configuration Files...
   ✓ CLAUDE.md

✅ AI Agent Guide generated: AI-AGENT-GUIDE.md
📊 Total size: 45KB

💡 To update: node scripts/generate-ai-agent-guide.js
```

### Step 2: Review the Generated Guide

Open `AI-AGENT-GUIDE.md` and verify:

1. **All sections are present:**
   - Core Documentation
   - Architectural Decision Records
   - Cursor Skills
   - Cursor Agents
   - Claude Skills
   - Claude Agents
   - Configuration Files

2. **Skills and agents are listed:**
   - Check that all skills have descriptions
   - Verify agent summaries are included
   - Ensure file paths are correct

3. **Statistics are accurate:**
   - Counts match actual files
   - All expected sources are included

### Step 3: Commit Changes

If the guide was updated:

```bash
git add AI-AGENT-GUIDE.md
git commit -m "docs: regenerate AI Agent Guide"
```

**Note:** The guide is auto-generated, so commit it alongside source changes:

```bash
# Example: After updating skills
git add .cursor/skills/ AI-AGENT-GUIDE.md
git commit -m "feat(skills): add new skill and update guide"
```

## Quick Reference

### Command

```bash
node scripts/generate-ai-agent-guide.js
```

### Output File

- **Location:** `AI-AGENT-GUIDE.md` (root directory)
- **Size:** Typically 30-50KB depending on content
- **Format:** Markdown

### What Gets Included

✅ **Included:**
- All `.md` files in `docs/` (except `adr/` subdirectory)
- All `.md` files in `docs/adr/` (except templates)
- All skills from `.cursor/skills/` and `.claude/skills/`
- All agents from `.cursor/agents/` and `.claude/agents/`
- `CLAUDE.md`, `AGENTS.md`, `WARP.md` (if they exist)
- `.kiro/` directory contents (if it exists)

❌ **Excluded:**
- Template files (`000-template.md`, etc.)
- README files (unless specifically needed)
- Hidden directories (starting with `.` except `.cursor` and `.claude`)

## Troubleshooting

### Script doesn't find files

**Check:**
- Files are in expected directories
- File extensions are `.md`
- Files are not in excluded directories

### Skills/agents missing

**Verify:**
- Skills are in `.cursor/skills/[name]/SKILL.md`
- Agents are in `.cursor/agents/[name].md`
- Files have proper frontmatter (for name/description extraction)

### Configuration files not found

**Note:** The script checks for optional files:
- `AGENTS.md` - Only included if it exists
- `WARP.md` - Only included if it exists
- `.kiro/` - Only included if directory exists

If these don't exist, that's expected behavior.

### Guide is too large

**Options:**
- The guide includes summaries, not full content
- Full details are linked to source files
- Consider splitting if it exceeds 100KB

## Integration with Other Workflows

### After ADR Changes

1. Update ADR file
2. Run `/adr-refresh` to sync ADRs to skills/agents
3. Run `/generate-agent-guide` to regenerate guide
4. Commit all changes

### After Adding Skills/Agents

1. Create skill/agent files
2. Run `/generate-agent-guide` to include them
3. Commit skill/agent files and updated guide

### Regular Maintenance

Run periodically to ensure guide stays current:

```bash
# Weekly check
node scripts/generate-ai-agent-guide.js
git diff AI-AGENT-GUIDE.md
```

If changes detected, commit the update.

## Related Documentation

- **AI Agent Guide**: `AI-AGENT-GUIDE.md` (generated output)
- **Skills Maintenance**: `docs/SKILLS-AGENTS-MAINTENANCE.md`
- **ADR Refresh**: `.cursor/commands/adr-refresh.md`
- **Skills Conversion**: `SKILLS-CONVERSION-README.md`

---

**Tip:** Add this to your pre-commit hook or CI/CD pipeline to ensure the guide is always up to date!
