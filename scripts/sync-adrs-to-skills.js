#!/usr/bin/env node

/**
 * Sync ADR (Architectural Decision Records) information into skills and agents
 * 
 * This script:
 * 1. Reads all ADR files from docs/adr/
 * 2. Extracts key decisions and patterns
 * 3. Injects relevant ADR references into skills and agents
 * 4. Updates skills/agents with ADR context
 * 
 * Usage:
 *   npm run sync:adrs
 *   npm run sync:adrs -- --dry-run
 */

const fs = require('fs');
const path = require('path');

const ADR_DIR = path.join(__dirname, '../docs/adr');
const SKILLS_DIR = path.join(__dirname, '../.cursor/skills');
const AGENTS_DIR = path.join(__dirname, '../.cursor/agents');

const DRY_RUN = process.argv.includes('--dry-run');

// ADR to Skill/Agent mapping
const ADR_MAPPINGS = {
  '001-nextjs-app-router.md': [
    'nextjs-app-router-specialist',
    'full-stack-feature-agent',
    'frontend-development-agent'
  ],
  '002-supabase-backend.md': [
    'supabase-integration-expert',
    'backend-database-agent',
    'full-stack-feature-agent'
  ],
  '003-pragmatic-monolith.md': [
    'full-stack-feature-agent',
    'backend-database-agent'
  ],
  '004-hybrid-schema.md': [
    'database-schema-migration',
    'backend-database-agent',
    'full-stack-feature-agent'
  ],
  '005-mdx-content.md': [
    'content-brand-agent'
  ],
  '006-stripe-hosted-checkout.md': [
    'stripe-payment-integration',
    'backend-database-agent'
  ],
  '007-openai-moderation.md': [
    'content-moderation-trust-systems',
    'backend-database-agent',
    'full-stack-feature-agent'
  ],
  '008-client-side-compression.md': [
    'frontend-development-agent',
    'full-stack-feature-agent'
  ],
  '009-shadcn-ui.md': [
    'shadcn-ui-component-builder',
    'frontend-development-agent'
  ],
  '010-defer-sticker-studio.md': [
    'full-stack-feature-agent'
  ]
};

/**
 * Parse an ADR file into structured metadata.
 */
function parseADR(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  
  // Extract ADR number and title
  const titleMatch = content.match(/^# ADR-(\d+): (.+)$/m);
  const statusMatch = content.match(/\*\*Status:\*\* (.+)/);
  const dateMatch = content.match(/\*\*Date:\*\* (.+)/);
  
  // Extract decision section
  const decisionMatch = content.match(/## Decision\s*\n([\s\S]*?)(?=\n## |$)/);
  
  // Extract key implementation details
  const implementationMatch = content.match(/### Key Implementation Details:([\s\S]*?)(?=\n## |$)/);
  
  return {
    number: titleMatch ? titleMatch[1] : null,
    title: titleMatch ? titleMatch[2] : null,
    status: statusMatch ? statusMatch[1] : null,
    date: dateMatch ? dateMatch[1] : null,
    decision: decisionMatch ? decisionMatch[1].trim() : null,
    implementation: implementationMatch ? implementationMatch[1].trim() : null,
    filename,
    path: filePath
  };
}

/**
 * Create a short summary from an ADR decision section.
 */
function extractADRSummary(adr) {
  if (!adr.decision) return null;
  
  // Extract first few sentences of decision
  const sentences = adr.decision
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 20)
    .slice(0, 3)
    .map(s => s.trim() + '.');
  
  return sentences.join(' ');
}

/**
 * Inject an ADR reference into skill/agent content.
 */
function injectADRReference(content, adr) {
  // Check if ADR section already exists
  const adrSectionRegex = /## Related ADRs?\s*\n([\s\S]*?)(?=\n---|\n## |$)/i;
  const existingMatch = content.match(adrSectionRegex);
  
  const adrReference = `- [ADR-${adr.number}: ${adr.title}](../../docs/adr/${adr.filename}) - ${extractADRSummary(adr) || adr.title}`;
  
  if (existingMatch) {
    // Add to existing section if not already present
    if (!existingMatch[1].includes(`ADR-${adr.number}`)) {
      const newSection = existingMatch[1] + '\n' + adrReference;
      return content.replace(adrSectionRegex, `## Related ADRs\n${newSection}`);
    }
    return content; // Already present
  } else {
    // Add new section before the final --- or at the end
    const endMarker = content.match(/\n---\s*$/);
    if (endMarker) {
      return content.replace(/\n---\s*$/, `\n\n## Related ADRs\n\n${adrReference}\n\n---`);
    } else {
      return content + `\n\n## Related ADRs\n\n${adrReference}\n`;
    }
  }
}

/**
 * Update a skill/agent file with ADR references.
 */
function updateSkillOrAgent(filePath, adr) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const updated = injectADRReference(content, adr);
  
  if (content !== updated) {
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, updated, 'utf-8');
    }
    return true; // Updated
  }
  return false; // No changes
}

/**
 * Sync accepted ADRs into mapped skills and agents.
 */
function main() {
  console.log('🔄 Syncing ADRs to skills and agents...\n');
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  // Read all ADR files
  const adrFiles = fs.readdirSync(ADR_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md' && f !== '000-template.md')
    .map(f => path.join(ADR_DIR, f));
  
  const adrs = adrFiles.map(parseADR).filter(adr => adr.status === 'Accepted');
  
  console.log(`Found ${adrs.length} accepted ADRs\n`);
  
  let totalUpdates = 0;
  
  // Process each ADR
  for (const adr of adrs) {
    const targets = ADR_MAPPINGS[adr.filename] || [];
    
    if (targets.length === 0) {
      console.log(`⚠️  No mappings for ${adr.filename}`);
      continue;
    }
    
    console.log(`📄 Processing ADR-${adr.number}: ${adr.title}`);
    
    for (const target of targets) {
      // Check if it's a skill or agent
      const skillPath = path.join(SKILLS_DIR, target, 'SKILL.md');
      const agentPath = path.join(AGENTS_DIR, `${target}.md`);
      
      let updated = false;
      
      if (fs.existsSync(skillPath)) {
        updated = updateSkillOrAgent(skillPath, adr);
        if (updated) {
          console.log(`  ✓ Updated skill: ${target}`);
          totalUpdates++;
        }
      } else if (fs.existsSync(agentPath)) {
        updated = updateSkillOrAgent(agentPath, adr);
        if (updated) {
          console.log(`  ✓ Updated agent: ${target}`);
          totalUpdates++;
        }
      } else {
        console.log(`  ⚠️  Target not found: ${target}`);
      }
    }
    console.log('');
  }
  
  console.log(`\n✅ Sync complete! ${totalUpdates} file(s) updated.`);
  
  if (DRY_RUN) {
    console.log('\n💡 Run without --dry-run to apply changes');
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseADR, injectADRReference };
