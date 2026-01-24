# RunExpression Scripts

This directory contains utility scripts for maintaining the RunExpression codebase, documentation, and AI agent configurations.

## 📜 Available Scripts

### 1. `convert-skills.sh`

**Purpose**: Convert cursor skills to Claude Code format

**What it does**:
- Copies skill files from `.cursor/skills/` to `.claude/skills/`
- Maintains project-specific skill configuration
- Ensures Claude Code can discover RunExpression-specific patterns

**Usage**:
```bash
./scripts/convert-skills.sh
```

**When to run**:
- After updating cursor skills in `.cursor/skills/`
- When adding new skills to the project
- After significant documentation changes that affect skills

**Output**:
- Skills in `.claude/skills/` (10 total)
- Console confirmation of converted skills

**Source of truth**: `.cursor/skills/` (edit skills there, then run script)

---

### 2. `convert-agents.sh`

**Purpose**: Convert cursor agents to Claude reference format

**What it does**:
- Copies agent files from `.cursor/agents/` to `.claude/agents/`
- Creates reference documentation for understanding project roles
- Generates usage guide mapping cursor agents to Claude workflows

**Usage**:
```bash
./scripts/convert-agents.sh
```

**When to run**:
- After updating cursor agent definitions
- When adding new agent roles
- To refresh agent reference documentation

**Output**:
- Agent reference files in `.claude/agents/`
- `README.md` with usage guide
- Mapping of cursor agents to Claude patterns

**Important**: Claude doesn't use agents the same way cursor does. These become reference documents.

---

### 3. `generate-ai-agent-guide.js`

**Purpose**: Generate comprehensive AI agent guide from source documentation

**What it does**:
- Reads all documentation from `DOCS/` and `docs/adr/`
- Compiles into single `AI-AGENT-GUIDE.md` file
- Maintains single source of truth (source docs → generated guide)

**Usage**:
```bash
node scripts/generate-ai-agent-guide.js
```

**When to run**:
- After updating any documentation in `DOCS/`
- After adding/modifying ADRs in `docs/adr/`
- Before committing documentation changes
- As part of CI/CD pipeline

**Output**:
- `AI-AGENT-GUIDE.md` (root directory)

**Source of truth**: `DOCS/` and `docs/adr/` (edit source, then regenerate)

---

### 4. `sync-adrs-to-skills.js`

**Purpose**: Sync architectural decisions from ADRs to skill files

**What it does**:
- Reads ADRs from `docs/adr/`
- Updates relevant skill files with architectural context
- Ensures skills reference current architectural decisions

**Usage**:
```bash
node scripts/sync-adrs-to-skills.js
```

**When to run**:
- After creating new ADRs
- After modifying existing ADRs
- When skill content needs ADR context

**Dependencies**:
- ADR files in `docs/adr/`
- Skill files in `.cursor/skills/`

---

### 5. `validate-skills-agents.js`

**Purpose**: Validate skill and agent files for correct format and content

**What it does**:
- Checks YAML frontmatter syntax
- Validates required fields (name, description)
- Ensures description follows "Use when..." format
- Checks for broken internal links
- Verifies skill/agent naming conventions

**Usage**:
```bash
node scripts/validate-skills-agents.js
```

**When to run**:
- Before committing skill/agent changes
- As part of pre-commit hook
- In CI/CD pipeline for validation
- After running conversion scripts

**Output**:
- Validation report with errors/warnings
- Exit code 0 (success) or 1 (failures)

---

## 🔄 Typical Workflows

### Updating Skills

1. Edit skill in `.cursor/skills/[skill-name]/SKILL.md`
2. Run `./scripts/convert-skills.sh`
3. Run `node scripts/validate-skills-agents.js`
4. Commit both `.cursor/skills/` and `.claude/skills/`

### Updating Agents

1. Edit agent in `.cursor/agents/[agent-name].md`
2. Run `./scripts/convert-agents.sh`
3. Commit both `.cursor/agents/` and `.claude/agents/`

### Updating Documentation

1. Edit source docs in `DOCS/` or `docs/adr/`
2. Run `node scripts/generate-ai-agent-guide.js`
3. Run `node scripts/sync-adrs-to-skills.js` (if ADRs changed)
4. Run `./scripts/convert-skills.sh` (if skills need updates)
5. Commit source docs + generated files

## 📁 File Structure

```
RunExpression/
├── .cursor/
│   ├── skills/          ← Source of truth for skills
│   └── agents/          ← Source of truth for agents
├── .claude/
│   ├── skills/          ← Generated from .cursor/skills/
│   └── agents/          ← Generated from .cursor/agents/
├── DOCS/                ← Source documentation
├── docs/adr/            ← Architectural decisions
├── AI-AGENT-GUIDE.md    ← Generated from DOCS/ + docs/adr/
└── scripts/             ← This directory
    ├── README.md        ← This file
    ├── convert-skills.sh
    ├── convert-agents.sh
    ├── generate-ai-agent-guide.js
    ├── sync-adrs-to-skills.js
    └── validate-skills-agents.js
```

## 🔍 Source of Truth

| Content Type | Source Location | Generated Location |
|--------------|----------------|-------------------|
| **Skills** | `.cursor/skills/` | `.claude/skills/` |
| **Agents** | `.cursor/agents/` | `.claude/agents/` |
| **Documentation** | `DOCS/`, `docs/adr/` | `AI-AGENT-GUIDE.md` |

**Always edit source files**, then run generation scripts.

## 🚀 Quick Reference

```bash
# Convert everything
./scripts/convert-skills.sh
./scripts/convert-agents.sh
node scripts/generate-ai-agent-guide.js

# Validate everything
node scripts/validate-skills-agents.js

# Full sync workflow
./scripts/convert-skills.sh && \
./scripts/convert-agents.sh && \
node scripts/generate-ai-agent-guide.js && \
node scripts/validate-skills-agents.js
```

## 🛠️ Development Tips

### Adding a New Script

1. Create script file in `scripts/`
2. Make executable: `chmod +x scripts/your-script.sh`
3. Add documentation to this README
4. Update the "Available Scripts" section
5. Add to relevant workflow sections

### Testing Scripts

Always test scripts on a clean branch before committing:
```bash
git checkout -b test-script-changes
./scripts/your-script.sh
git diff  # Review changes
```

### Script Naming Conventions

- Use kebab-case: `convert-skills.sh`
- Shell scripts: `.sh` extension
- Node scripts: `.js` extension
- Make scripts executable: `chmod +x`

## 📚 Additional Resources

- **Skills Conversion**: See `SKILLS-CONVERSION-README.md`
- **Skills Quick Reference**: See `SKILLS-QUICK-REFERENCE.md`
- **Project Documentation**: See `DOCS/` directory
- **ADRs**: See `docs/adr/` directory

## 🤝 Contributing

When modifying scripts:
1. Update this README with changes
2. Test thoroughly before committing
3. Document any new dependencies
4. Add validation for new file types
5. Consider CI/CD integration

---

**Last Updated**: 2026-01-23
**Maintained By**: RunExpression Development Team
