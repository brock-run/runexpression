# ADR Refresh Workflow

Refreshes skills and agents to reflect changes in Architectural Decision Records (ADRs).

## When to Use

Use this command when:
- You've updated an existing ADR
- You've created a new ADR
- You want to ensure skills/agents are in sync with ADRs
- You're doing regular maintenance

## Workflow Steps

### Step 1: Validate Current State

First, check what needs updating:

```bash
npm run validate:skills
```

This will show:
- ✅ Skills/agents that are up to date
- ❌ Missing ADR references
- ⚠️  Files that need attention

### Step 2: Preview Changes (Optional)

Before applying changes, preview what will be updated:

```bash
npm run sync:adrs:dry
```

This shows:
- Which ADRs will be processed
- Which skills/agents will be updated
- What references will be added

**Note**: No files are modified in dry-run mode.

### Step 3: Sync ADRs to Skills/Agents

Apply the updates:

```bash
npm run sync:adrs
```

This script:
- Reads all accepted ADRs from `docs/adr/`
- Injects ADR references into relevant skills/agents
- Adds "Related ADRs" sections with links and summaries
- Updates 22+ skill/agent files

**Expected Output:**
```
🔄 Syncing ADRs to skills and agents...

Found 10 accepted ADRs

📄 Processing ADR-001: Adopt Next.js 14+ with App Router
  ✓ Updated skill: nextjs-app-router-specialist
  ✓ Updated agent: full-stack-feature-agent
  ...

✅ Sync complete! 22 file(s) updated.
```

### Step 4: Review Changes

Review the updated files:

```bash
# Review a specific skill
git diff .cursor/skills/nextjs-app-router-specialist/SKILL.md

# Review a specific agent
git diff .cursor/agents/full-stack-feature-agent.md

# Review all changes
git diff .cursor/
```

Look for:
- ✅ New "Related ADRs" sections
- ✅ ADR references with summaries
- ✅ Correct links to ADR files

### Step 5: Sync to Claude (If Using Claude Code)

If you're using Claude Code, sync skills to Claude format:

```bash
npm run sync:skills
```

This copies skills from `.cursor/skills/` to `~/.claude/skills/`.

### Step 6: Commit Changes

Commit both ADR and skill/agent updates together:

```bash
git add docs/adr/ .cursor/skills/ .cursor/agents/
git commit -m "docs(adr): update ADR-XXX and sync to skills/agents"
```

**Commit Message Format:**
```
docs(adr): [brief description of ADR change]

- Updated ADR-XXX: [title]
- Synced ADR references to [list affected skills/agents]
```

## Quick Reference

### Commands

| Command | Purpose |
|---------|---------|
| `npm run validate:skills` | Check if skills/agents are up to date |
| `npm run sync:adrs:dry` | Preview changes without modifying files |
| `npm run sync:adrs` | Apply ADR updates to skills/agents |
| `npm run sync:skills` | Convert Cursor skills to Claude format |
| `npm run skills:list` | List all available skills |
| `npm run agents:list` | List all available agents |

### ADR Mappings

The sync script automatically maps ADRs to skills/agents:

- **ADR-001** (Next.js) → nextjs-app-router-specialist, full-stack-feature-agent, frontend-development-agent
- **ADR-002** (Supabase) → supabase-integration-expert, backend-database-agent, full-stack-feature-agent
- **ADR-003** (Monolith) → full-stack-feature-agent, backend-database-agent
- **ADR-004** (Hybrid Schema) → database-schema-migration, backend-database-agent, full-stack-feature-agent
- **ADR-005** (MDX) → content-brand-agent
- **ADR-006** (Stripe) → stripe-payment-integration, backend-database-agent
- **ADR-007** (Moderation) → content-moderation-trust-systems, backend-database-agent, full-stack-feature-agent
- **ADR-008** (Compression) → frontend-development-agent, full-stack-feature-agent
- **ADR-009** (Shadcn/UI) → shadcn-ui-component-builder, frontend-development-agent
- **ADR-010** (Sticker Studio) → full-stack-feature-agent

## Troubleshooting

### Validation shows missing references

**Solution**: Run `npm run sync:adrs` to add missing references.

### Sync script doesn't find ADRs

**Check**:
- ADR files are in `docs/adr/` directory
- ADR has `Status: Accepted` in frontmatter
- ADR follows standard format (see `docs/adr/000-template.md`)

### Skills not appearing in Claude

**Solution**: 
1. Verify skills have proper YAML frontmatter
2. Run `npm run sync:skills`
3. Check `~/.claude/skills/` directory exists

### Need to add new ADR mapping

**Solution**: Edit `scripts/sync-adrs-to-skills.js` and add mapping to `ADR_MAPPINGS` object.

## Regular Maintenance

Run validation periodically to ensure everything stays in sync:

```bash
# Weekly check
npm run validate:skills
```

If issues are found, run sync to fix:

```bash
npm run sync:adrs
```

## Related Documentation

- **Maintenance Guide**: `docs/SKILLS-AGENTS-MAINTENANCE.md`
- **Skills Recommendations**: `docs/RECOMMENDATIONS.md`
- **ADRs**: `docs/adr/README.md`
- **Optimization Summary**: `docs/SKILLS-OPTIMIZATION-SUMMARY.md`

---

**Tip**: Add this to your pre-commit hook or CI/CD pipeline to catch issues early!
