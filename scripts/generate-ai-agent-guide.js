#!/usr/bin/env node

/**
 * Generate AI Agent Guide from Source Documentation
 *
 * This script reads all documentation files, skills, agents, and configuration
 * to generate a comprehensive guide for AI agents working on RunExpression.
 *
 * Sources included:
 * - DOCS/*.md (core documentation)
 * - docs/adr/*.md (architectural decision records)
 * - .cursor/skills/ (Cursor skills)
 * - .cursor/agents/ (Cursor agents)
 * - .claude/skills/ (Claude skills)
 * - .claude/agents/ (Claude agents)
 * - CLAUDE.md, AGENTS.md, WARP.md (if they exist)
 * - .kiro/ directory (if it exists)
 *
 * Usage:
 *   node scripts/generate-ai-agent-guide.js
 *
 * Output:
 *   AI-AGENT-GUIDE.md (root directory)
 *
 * This maintains a single source of truth - update source docs, then regenerate.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_DIRS = [
  { path: 'docs', pattern: /\.md$/, category: 'Core Documentation', exclude: ['adr'] },
  { path: 'docs/adr', pattern: /\.md$/, category: 'Architectural Decision Records' }
];

const OUTPUT_FILE = 'AI-AGENT-GUIDE.md';
const ROOT_DIR = path.join(__dirname, '..');

/**
 * Read all markdown files from a directory recursively
 */
function readMarkdownFiles(dirPath, pattern, excludeDirs = []) {
  const fullPath = path.join(ROOT_DIR, dirPath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`Warning: Directory ${dirPath} does not exist`);
    return [];
  }

  const files = [];
  
  function walkDir(currentPath, relativePath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      const relativeEntryPath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip excluded directories
        if (!excludeDirs.includes(entry.name) && !entry.name.startsWith('.')) {
          walkDir(entryPath, relativeEntryPath);
        }
      } else if (entry.isFile() && pattern.test(entry.name)) {
        const content = fs.readFileSync(entryPath, 'utf-8');
        files.push({
          filename: entry.name,
          path: path.join(dirPath, relativeEntryPath),
          content,
          fullPath: entryPath
        });
      }
    }
  }
  
  walkDir(fullPath, '');
  return files.sort((a, b) => a.filename.localeCompare(b.filename));
}

/**
 * Read skills from a directory
 */
function readSkills(skillsDir) {
  const fullPath = path.join(ROOT_DIR, skillsDir);
  
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  
  const skills = [];
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const skillFile = path.join(fullPath, entry.name, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, 'utf-8');
        // Extract name and description from frontmatter
        const nameMatch = content.match(/^---\nname:\s*(.+?)\n/);
        const descMatch = content.match(/description:\s*(.+?)\n/);
        
        skills.push({
          name: nameMatch ? nameMatch[1] : entry.name,
          description: descMatch ? descMatch[1] : '',
          filename: entry.name,
          path: path.join(skillsDir, entry.name, 'SKILL.md'),
          content
        });
      }
    }
  }
  
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Read agents from a directory
 */
function readAgents(agentsDir) {
  const fullPath = path.join(ROOT_DIR, agentsDir);
  
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  
  const agents = [];
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
      const agentFile = path.join(fullPath, entry.name);
      const content = fs.readFileSync(agentFile, 'utf-8');
      
      // Extract name and description from frontmatter
      const nameMatch = content.match(/^---\nname:\s*(.+?)\n/);
      const descMatch = content.match(/description:\s*(.+?)\n/);
      
      agents.push({
        name: nameMatch ? nameMatch[1] : entry.name.replace('.md', ''),
        description: descMatch ? descMatch[1] : '',
        filename: entry.name,
        path: path.join(agentsDir, entry.name),
        content
      });
    }
  }
  
  return agents.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Extract key sections from documentation
 */
function extractKeySections(doc) {
  const sections = {
    overview: '',
    technicalDetails: '',
    patterns: ''
  };

  // Extract overview (first section or heading)
  const overviewMatch = doc.content.match(/## Overview\n([\s\S]*?)(?=\n## |$)/);
  if (overviewMatch) {
    sections.overview = overviewMatch[1].trim();
  }

  // Extract technical details
  const techMatch = doc.content.match(/## (?:Technical|Architecture|Implementation)([\s\S]*?)(?=\n## |$)/i);
  if (techMatch) {
    sections.technicalDetails = techMatch[0].trim();
  }

  // Extract patterns
  const patternMatch = doc.content.match(/## (?:Patterns|Guidelines|Best Practices)([\s\S]*?)(?=\n## |$)/i);
  if (patternMatch) {
    sections.patterns = patternMatch[0].trim();
  }

  return sections;
}

/**
 * Extract skill summary
 */
function extractSkillSummary(skill) {
  // Get description from frontmatter or first paragraph
  let summary = skill.description;
  
  if (!summary) {
    const firstPara = skill.content.match(/^# .+\n\n([^\n]+)/);
    if (firstPara) {
      summary = firstPara[1].trim();
    }
  }
  
  // Get "Use when" from description
  const useWhenMatch = skill.description.match(/Use when (.+?)(?:\.|$)/);
  if (useWhenMatch) {
    summary = `Use when: ${useWhenMatch[1]}`;
  }
  
  return summary || 'No description available';
}

/**
 * Extract agent summary
 */
function extractAgentSummary(agent) {
  // Get description from frontmatter
  let summary = agent.description;
  
  if (!summary) {
    // Try to get from "Primary Focus" section
    const focusMatch = agent.content.match(/## Primary Focus\n\n(.+?)(?=\n## |$)/);
    if (focusMatch) {
      summary = focusMatch[1].trim();
    }
  }
  
  return summary || 'No description available';
}

/**
 * Generate AI Agent Guide
 */
function generateGuide() {
  console.log('🤖 Generating AI Agent Guide...\n');

  let guide = `# RunExpression: AI Agent Development Guide

**Last Generated:** ${new Date().toISOString().split('T')[0]}
**Auto-generated from:** Multiple sources (see below)

> ⚠️ **DO NOT EDIT THIS FILE DIRECTLY**
>
> This file is auto-generated from source documentation. To update this guide:
> 1. Edit the source documentation in the appropriate location
> 2. Run: \`node scripts/generate-ai-agent-guide.js\`
> 3. Commit both source docs and regenerated guide

---

## Purpose

This guide provides AI agents (like Claude, GitHub Copilot, Cursor, etc.) with comprehensive context about RunExpression's architecture, conventions, patterns, skills, and agents. Use this as a reference when:

- Writing new features
- Fixing bugs
- Reviewing code
- Making architectural decisions
- Answering questions about the codebase
- Selecting appropriate skills or agents for tasks

---

## Quick Reference

### Tech Stack
- **Frontend:** Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Payments:** Stripe (Hosted Checkout)
- **Content:** MDX (next-mdx-remote)
- **Animations:** Framer Motion
- **Deployment:** Vercel

### Project Structure
\`\`\`
/app/              # Next.js App Router pages
  (public)/        # Public routes (no auth)
  (flow)/          # Flow feature routes
  (app)/           # Authenticated routes
  api/             # API routes
/components/       # React components
  ui/              # Shadcn/UI components
  flow/            # Flow-specific components
  clubhouse/       # Clubhouse-specific components
/lib/              # Utilities and helpers
  supabase/        # Supabase clients
  types/           # TypeScript types
/docs/             # Core documentation
/docs/adr/         # Architectural Decision Records
/.cursor/skills/    # Cursor skills (source)
/.cursor/agents/    # Cursor agents (source)
/.claude/skills/    # Claude skills (converted)
/.claude/agents/    # Claude agents (converted)
\`\`\`

### Key Commands
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run tests
npm run type-check   # TypeScript type checking
npm run sync:adrs    # Sync ADRs to skills/agents
npm run validate:skills  # Validate skills/agents
\`\`\`

---

`;

  // Process core documentation
  SOURCE_DIRS.forEach(({ path: dirPath, pattern, category, exclude }) => {
    console.log(`📂 Processing ${category} (${dirPath})...`);

    guide += `## ${category}\n\n`;
    guide += `> Source: \`${dirPath}/\`\n\n`;

    const docs = readMarkdownFiles(dirPath, pattern, exclude);

    if (docs.length === 0) {
      guide += `*No documents found in ${dirPath}*\n\n`;
      console.log(`   ⚠️  No documents found\n`);
      return;
    }

    docs.forEach(doc => {
      // Skip template and README files
      if (doc.filename.includes('template') || doc.filename === 'README.md') {
        return;
      }

      console.log(`   ✓ ${doc.filename}`);

      guide += `### ${doc.filename.replace('.md', '')}\n\n`;
      guide += `**File:** \`${doc.path}\`\n\n`;

      // For ADRs, include key sections
      if (dirPath === 'docs/adr') {
        const contextMatch = doc.content.match(/## Context\n([\s\S]*?)(?=\n## |$)/);
        const decisionMatch = doc.content.match(/## Decision\n([\s\S]*?)(?=\n## |$)/);
        const consequencesMatch = doc.content.match(/## Consequences\n([\s\S]*?)(?=\n## |$)/);

        if (contextMatch) {
          guide += `**Context:**\n${contextMatch[1].trim()}\n\n`;
        }
        if (decisionMatch) {
          guide += `**Decision:**\n${decisionMatch[1].trim()}\n\n`;
        }
        if (consequencesMatch) {
          guide += `**Key Consequences:**\n${consequencesMatch[1].trim().split('\n').slice(0, 10).join('\n')}\n\n`;
        }

        guide += `*[Full details in ${doc.path}]*\n\n`;
      } else {
        // For other docs, include overview
        const overviewMatch = doc.content.match(/## Overview\n([\s\S]*?)(?=\n## |$)/);
        if (overviewMatch) {
          guide += `**Overview:**\n${overviewMatch[1].trim()}\n\n`;
        }

        guide += `*[Full details in ${doc.path}]*\n\n`;
      }

      guide += `---\n\n`;
    });

    console.log();
  });

  // Process Cursor Skills
  console.log('📚 Processing Cursor Skills...');
  guide += `## Cursor Skills\n\n`;
  guide += `> Source: \`.cursor/skills/\`\n\n`;
  guide += `These skills are available in Cursor IDE. Each skill provides specialized knowledge for specific domains.\n\n`;

  const cursorSkills = readSkills('.cursor/skills');
  if (cursorSkills.length === 0) {
    guide += `*No skills found*\n\n`;
    console.log(`   ⚠️  No skills found\n`);
  } else {
    cursorSkills.forEach(skill => {
      console.log(`   ✓ ${skill.name}`);
      guide += `### ${skill.name}\n\n`;
      guide += `**Description:** ${extractSkillSummary(skill)}\n\n`;
      guide += `**File:** \`${skill.path}\`\n\n`;
      guide += `*[Full skill documentation in ${skill.path}]*\n\n`;
      guide += `---\n\n`;
    });
    console.log(`   ✅ Found ${cursorSkills.length} skills\n`);
  }

  // Process Cursor Agents
  console.log('🤖 Processing Cursor Agents...');
  guide += `## Cursor Agents\n\n`;
  guide += `> Source: \`.cursor/agents/\`\n\n`;
  guide += `These agents coordinate multiple skills for specific workflows.\n\n`;

  const cursorAgents = readAgents('.cursor/agents');
  if (cursorAgents.length === 0) {
    guide += `*No agents found*\n\n`;
    console.log(`   ⚠️  No agents found\n`);
  } else {
    cursorAgents.forEach(agent => {
      console.log(`   ✓ ${agent.name}`);
      guide += `### ${agent.name}\n\n`;
      guide += `**Description:** ${extractAgentSummary(agent)}\n\n`;
      guide += `**File:** \`${agent.path}\`\n\n`;
      guide += `*[Full agent documentation in ${agent.path}]*\n\n`;
      guide += `---\n\n`;
    });
    console.log(`   ✅ Found ${cursorAgents.length} agents\n`);
  }

  // Process Claude Skills
  console.log('📚 Processing Claude Skills...');
  guide += `## Claude Skills\n\n`;
  guide += `> Source: \`.claude/skills/\`\n\n`;
  guide += `These skills are converted from Cursor skills for use with Claude Code.\n\n`;

  const claudeSkills = readSkills('.claude/skills');
  if (claudeSkills.length === 0) {
    guide += `*No skills found*\n\n`;
    console.log(`   ⚠️  No skills found\n`);
  } else {
    claudeSkills.forEach(skill => {
      console.log(`   ✓ ${skill.name}`);
      guide += `### ${skill.name}\n\n`;
      guide += `**Description:** ${extractSkillSummary(skill)}\n\n`;
      guide += `**File:** \`${skill.path}\`\n\n`;
      guide += `*[Full skill documentation in ${skill.path}]*\n\n`;
      guide += `---\n\n`;
    });
    console.log(`   ✅ Found ${claudeSkills.length} skills\n`);
  }

  // Process Claude Agents
  console.log('🤖 Processing Claude Agents...');
  guide += `## Claude Agents\n\n`;
  guide += `> Source: \`.claude/agents/\`\n\n`;
  guide += `These agents are converted from Cursor agents for use with Claude Code.\n\n`;

  const claudeAgents = readAgents('.claude/agents');
  if (claudeAgents.length === 0) {
    guide += `*No agents found*\n\n`;
    console.log(`   ⚠️  No agents found\n`);
  } else {
    claudeAgents.forEach(agent => {
      console.log(`   ✓ ${agent.name}`);
      guide += `### ${agent.name}\n\n`;
      guide += `**Description:** ${extractAgentSummary(agent)}\n\n`;
      guide += `**File:** \`${agent.path}\`\n\n`;
      guide += `*[Full agent documentation in ${agent.path}]*\n\n`;
      guide += `---\n\n`;
    });
    console.log(`   ✅ Found ${claudeAgents.length} agents\n`);
  }

  // Process root-level configuration files
  console.log('📄 Processing Configuration Files...');
  guide += `## Configuration Files\n\n`;
  guide += `> Source: Root directory\n\n`;

  const configFiles = [
    { name: 'CLAUDE.md', path: 'CLAUDE.md' },
    { name: 'AGENTS.md', path: 'AGENTS.md' },
    { name: 'WARP.md', path: 'WARP.md' }
  ];

  configFiles.forEach(file => {
    const filePath = path.join(ROOT_DIR, file.path);
    if (fs.existsSync(filePath)) {
      console.log(`   ✓ ${file.name}`);
      const content = fs.readFileSync(filePath, 'utf-8');
      const overviewMatch = content.match(/^# .+\n\n([^\n]+)/);
      
      guide += `### ${file.name}\n\n`;
      if (overviewMatch) {
        guide += `**Overview:** ${overviewMatch[1].trim()}\n\n`;
      }
      guide += `**File:** \`${file.path}\`\n\n`;
      guide += `*[Full documentation in ${file.path}]*\n\n`;
      guide += `---\n\n`;
    }
  });

  // Check for .kiro directory
  const kiroPath = path.join(ROOT_DIR, '.kiro');
  if (fs.existsSync(kiroPath)) {
    console.log('📁 Processing .kiro directory...');
    guide += `## Kiro Configuration\n\n`;
    guide += `> Source: \`.kiro/\`\n\n`;
    guide += `Kiro configuration directory found. Contents:\n\n`;
    
    const kiroFiles = readMarkdownFiles('.kiro', /\.md$/);
    if (kiroFiles.length > 0) {
      kiroFiles.forEach(file => {
        console.log(`   ✓ ${file.filename}`);
        guide += `- \`${file.path}\`\n`;
      });
    } else {
      guide += `*No markdown files found*\n`;
    }
    guide += `\n---\n\n`;
  }

  // Add practical guidelines section
  guide += `## Practical Guidelines for AI Agents

### When Writing Code

1. **Follow TypeScript standards** (docs/07-CODING-STANDARDS.md)
   - Always use explicit types
   - Prefer interfaces for objects
   - Use \`unknown\` instead of \`any\`

2. **Follow database conventions** (docs/08-DATABASE-CONVENTIONS.md)
   - Table names: plural, snake_case
   - Enable RLS on all tables
   - Use JSONB for flexible attributes

3. **Follow UI/UX patterns** (docs/09-UI-UX-PATTERNS.md)
   - Default to Server Components
   - Use Shadcn/UI components
   - Ensure WCAG AA accessibility

4. **Follow git workflow** (docs/10-GIT-WORKFLOW.md)
   - Use conventional commit format
   - Keep PRs small (<300 lines)
   - Write clear commit messages

### When Making Decisions

**Check ADRs first** (docs/adr/):
- Why Next.js App Router? → ADR-001
- Why Supabase? → ADR-002
- Why monolith? → ADR-003
- Why hybrid schema? → ADR-004
- Why MDX? → ADR-005
- Why Stripe Hosted Checkout? → ADR-006
- Why OpenAI Moderation? → ADR-007
- Why client-side compression? → ADR-008
- Why Shadcn/UI? → ADR-009
- Why defer sticker studio? → ADR-010

### When Selecting Skills

**Available Cursor Skills:**
${cursorSkills.map(s => `- **${s.name}**: ${extractSkillSummary(s)}`).join('\n')}

**Available Claude Skills:**
${claudeSkills.map(s => `- **${s.name}**: ${extractSkillSummary(s)}`).join('\n')}

### When Selecting Agents

**Available Cursor Agents:**
${cursorAgents.map(a => `- **${a.name}**: ${extractAgentSummary(a)}`).join('\n')}

**Available Claude Agents:**
${claudeAgents.map(a => `- **${a.name}**: ${extractAgentSummary(a)}`).join('\n')}

### When Implementing Features

**Refer to:**
- **Product requirements:** docs/02-PRODUCT-REQUIREMENTS.md
- **Technical design:** docs/03-TECHNICAL-DESIGN.md
- **Database schema:** docs/06-DATA-SCHEMA.md
- **Implementation plan:** docs/05-IMPLEMENTATION-PLAN.md

### When Reviewing Code

**Check:**
- TypeScript types are explicit
- RLS policies protect data
- Components are accessible (ARIA, keyboard nav)
- Commit messages follow conventional format
- Tests are included for new logic

### When Stuck

**Resources:**
1. Check relevant ADR for architectural context
2. Check docs/ for implementation details
3. Check coding standards for conventions
4. Review relevant skills/agents for patterns
5. Ask for clarification if ambiguous

---

## Brand Voice & Philosophy

**From docs/04-BRAND-CONTENT-GUIDE.md:**

RunExpression is "The Sage in the Parking Lot" — deep but accessible, serious but lighthearted.

**Four Pillars:**
1. **Motion Creates Emotion** - Physical movement unlocks emotional processing
2. **Process Over Outcome** - The journey matters more than the destination
3. **Interdependence** - We need each other (shift from independence)
4. **Living Laboratory** - Experiment, learn, adapt

**Tone:** Vulnerable, honest, generative, invitational (not prescriptive)

---

## Common Patterns

### API Route Pattern
\`\`\`typescript
// app/api/flow/submit/route.ts
export async function POST(request: Request) {
  try {
    // 1. Auth check
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Validate input
    const body = await request.json()
    const result = schema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // 3. Process request
    const { data, error } = await supabase
      .from('table')
      .insert({ ...result.data, user_id: user?.id })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
\`\`\`

### Component Pattern
\`\`\`typescript
// components/flow/flow-post-card.tsx
import type { FlowPost } from '@/lib/types/flow'

interface FlowPostCardProps {
  post: FlowPost
}

export function FlowPostCard({ post }: FlowPostCardProps) {
  return (
    <div className="rounded-lg border p-6">
      {/* Component content */}
    </div>
  )
}
\`\`\`

### Database Query Pattern
\`\`\`typescript
// Fetch with RLS protection
const { data, error } = await supabase
  .from('expression_events')
  .select('id, content, created_at, profiles:user_id(full_name)')
  .eq('moderation_status', 'approved')
  .order('created_at', { ascending: false })
  .limit(20)
\`\`\`

---

## Summary Statistics

- **Core Documentation Files:** ${readMarkdownFiles('docs', /\.md$/, ['adr']).length}
- **Architectural Decision Records:** ${readMarkdownFiles('docs/adr', /\.md$/).filter(d => !d.filename.includes('template') && d.filename !== 'README.md').length}
- **Cursor Skills:** ${cursorSkills.length}
- **Cursor Agents:** ${cursorAgents.length}
- **Claude Skills:** ${claudeSkills.length}
- **Claude Agents:** ${claudeAgents.length}

---

## Version History

| Date       | Changes                                      |
|------------|----------------------------------------------|
| ${new Date().toISOString().split('T')[0]} | Regenerated with all skills, agents, and configuration files |

---

**Questions or unclear requirements?** Check the source documentation or ask for clarification.

**To regenerate this guide:** Run \`node scripts/generate-ai-agent-guide.js\`
`;

  // Write guide to file
  const outputPath = path.join(ROOT_DIR, OUTPUT_FILE);
  fs.writeFileSync(outputPath, guide);

  console.log(`\n✅ AI Agent Guide generated: ${OUTPUT_FILE}`);
  console.log(`📊 Total size: ${Math.round(guide.length / 1024)}KB`);
  console.log(`\n💡 To update: node scripts/generate-ai-agent-guide.js\n`);
}

// Run generator
try {
  generateGuide();
} catch (error) {
  console.error('❌ Error generating guide:', error);
  process.exit(1);
}
