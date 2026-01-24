# Skills & Agents Optimization Summary

**Date**: 2026-01-23  
**Purpose**: Optimize RunExpression's AI skills and agents to reflect ADRs and project requirements

## What Was Done

### 1. ADR Sync System ✅

Created an automated system to keep skills and agents in sync with Architectural Decision Records:

- **Sync Script** (`scripts/sync-adrs-to-skills.js`)
  - Reads all accepted ADRs from `docs/adr/`
  - Injects ADR references into relevant skills/agents
  - Adds "Related ADRs" sections with links and summaries
  - Supports dry-run mode for preview

- **Validation Script** (`scripts/validate-skills-agents.js`)
  - Checks if all ADRs are referenced in appropriate skills/agents
  - Reports missing references
  - Helps maintain consistency

- **Documentation** (`docs/SKILLS-AGENTS-MAINTENANCE.md`)
  - Complete guide on maintaining skills/agents
  - Workflow for when ADRs change
  - Troubleshooting guide

### 2. New Skills Created ✅

Added three new skills from RECOMMENDATIONS.md:

#### RunExpression Brand Voice
- **Location**: `.cursor/skills/runexpression-brand-voice/SKILL.md`
- **Purpose**: Ensures all user-facing content matches "The Sage in the Parking Lot" brand voice
- **Covers**: UI copy, error messages, success messages, content guidelines, tone attributes, messaging pillars

#### Flow Feature Patterns
- **Location**: `.cursor/skills/flow-feature-patterns/SKILL.md`
- **Purpose**: Patterns for Flow feature implementation
- **Covers**: Vibe tag taxonomy, moderation workflows, real-time subscriptions, submission patterns, Flow wall display

#### Clubhouse Patterns
- **Location**: `.cursor/skills/clubhouse-patterns/SKILL.md`
- **Purpose**: Patterns for clubhouse features
- **Covers**: Upload portal multi-step flows, media archive lightbox patterns, lore story markdown rendering, club-specific features

### 3. Enhanced Existing Skills ✅

#### Database Schema & Migration
- **Enhancement**: Added comprehensive RLS policy naming standards section
- **New Content**: 
  - Pattern: `{Who} can {action} {what} [{condition}]`
  - Examples of good vs. bad policy names
  - Naming checklist
  - Consistent policy naming across project

### 4. New NPM Commands ✅

Added useful commands to `package.json`:

```bash
# ADR Sync
npm run sync:adrs          # Sync ADRs to skills/agents
npm run sync:adrs:dry      # Preview changes (dry run)

# Validation
npm run validate:skills    # Check if skills/agents are up to date

# Skill Management
npm run sync:skills        # Convert Cursor skills to Claude format
npm run skills:list        # List all skills
npm run agents:list        # List all agents
```

## How to Use

### When ADRs Change

1. Update ADR file in `docs/adr/`
2. Run validation: `npm run validate:skills`
3. Sync ADRs: `npm run sync:adrs`
4. Review and commit changes

### Regular Maintenance

Run validation periodically:
```bash
npm run validate:skills
```

If issues found, sync to fix:
```bash
npm run sync:adrs
```

### Adding New Skills/Agents

1. Create skill/agent file
2. Update ADR mappings in `scripts/sync-adrs-to-skills.js` if needed
3. Run sync: `npm run sync:adrs`
4. Sync to Claude: `npm run sync:skills`

## Coverage Status

### RECOMMENDATIONS.md Items (Lines 409-428)

✅ **RunExpression Brand Voice** - New skill created  
✅ **Flow Feature Patterns** - New skill created  
✅ **Clubhouse Patterns** - New skill created  
✅ **Database Naming Conventions** - Enhanced existing skill with RLS policy naming standards

### ADR Coverage

All 10 accepted ADRs are now mapped to skills/agents:
- ✅ ADR-001: Next.js App Router
- ✅ ADR-002: Supabase Backend
- ✅ ADR-003: Pragmatic Monolith
- ✅ ADR-004: Hybrid Schema
- ✅ ADR-005: MDX Content
- ✅ ADR-006: Stripe Hosted Checkout
- ✅ ADR-007: OpenAI Moderation
- ✅ ADR-008: Client-Side Compression
- ✅ ADR-009: Shadcn/UI
- ✅ ADR-010: Defer Sticker Studio

## Files Created/Modified

### New Files
- `scripts/sync-adrs-to-skills.js` - ADR sync script
- `scripts/validate-skills-agents.js` - Validation script
- `.cursor/skills/runexpression-brand-voice/SKILL.md` - Brand voice skill
- `.cursor/skills/flow-feature-patterns/SKILL.md` - Flow patterns skill
- `.cursor/skills/clubhouse-patterns/SKILL.md` - Clubhouse patterns skill
- `docs/SKILLS-AGENTS-MAINTENANCE.md` - Maintenance guide
- `docs/SKILLS-OPTIMIZATION-SUMMARY.md` - This file

### Modified Files
- `package.json` - Added new npm commands
- `.cursor/skills/database-schema-migration/SKILL.md` - Enhanced with RLS naming standards

## Next Steps

1. **Run initial sync** to add ADR references:
   ```bash
   npm run sync:adrs
   ```

2. **Review changes** in skills/agents to ensure ADR references are correct

3. **Sync to Claude** if using Claude Code:
   ```bash
   npm run sync:skills
   ```

4. **Set up regular validation** - Consider adding to CI/CD or pre-commit hooks

5. **Update ADR mappings** as new ADRs are added or skills/agents change

## Benefits

1. **Automated Sync**: ADR changes automatically propagate to skills/agents
2. **Consistency**: All skills/agents reference relevant architectural decisions
3. **Maintainability**: Easy to validate and fix inconsistencies
4. **Documentation**: Clear workflow for maintaining skills/agents
5. **Coverage**: All RECOMMENDATIONS.md items now have dedicated skills

## Related Documentation

- **Maintenance Guide**: `docs/SKILLS-AGENTS-MAINTENANCE.md`
- **Skills Recommendations**: `docs/RECOMMENDATIONS.md`
- **Skills Conversion**: `SKILLS-CONVERSION-README.md`
- **ADRs**: `docs/adr/README.md`

---

**Status**: ✅ Complete  
**Ready for Use**: Yes
