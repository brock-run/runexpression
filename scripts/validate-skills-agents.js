#!/usr/bin/env node

/**
 * Validate that skills and agents are up to date with ADRs
 * 
 * This script:
 * 1. Checks if all ADRs are referenced in appropriate skills/agents
 * 2. Validates skill/agent structure
 * 3. Reports missing ADR references
 * 
 * Usage:
 *   npm run validate:skills
 */

const fs = require('fs');
const path = require('path');

const ADR_DIR = path.join(__dirname, '../docs/adr');
const SKILLS_DIR = path.join(__dirname, '../.cursor/skills');
const AGENTS_DIR = path.join(__dirname, '../.cursor/agents');

// ADR to Skill/Agent mapping (same as sync script)
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

function checkADRReference(filePath, adrNumber) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const adrPattern = new RegExp(`ADR-${adrNumber}|${adrNumber}-[a-z-]+\\.md`, 'i');
  return adrPattern.test(content);
}

function validateSkillOrAgent(filePath, adrNumber) {
  if (!fs.existsSync(filePath)) {
    return { valid: false, error: 'File not found' };
  }
  
  const hasReference = checkADRReference(filePath, adrNumber);
  return { valid: hasReference, error: hasReference ? null : 'Missing ADR reference' };
}

function main() {
  console.log('🔍 Validating skills and agents against ADRs...\n');
  
  const adrFiles = fs.readdirSync(ADR_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md' && f !== '000-template.md')
    .map(f => path.join(ADR_DIR, f));
  
  let totalIssues = 0;
  const issues = [];
  
  for (const adrFile of adrFiles) {
    const filename = path.basename(adrFile);
    const content = fs.readFileSync(adrFile, 'utf-8');
    const numberMatch = content.match(/^# ADR-(\d+):/m);
    const statusMatch = content.match(/\*\*Status:\*\* (.+)/);
    
    if (!numberMatch || statusMatch?.[1] !== 'Accepted') {
      continue; // Skip non-accepted ADRs
    }
    
    const adrNumber = numberMatch[1];
    const targets = ADR_MAPPINGS[filename] || [];
    
    if (targets.length === 0) {
      console.log(`⚠️  ADR-${adrNumber}: No mappings defined`);
      continue;
    }
    
    for (const target of targets) {
      const skillPath = path.join(SKILLS_DIR, target, 'SKILL.md');
      const agentPath = path.join(AGENTS_DIR, `${target}.md`);
      
      let result;
      let fileType;
      
      if (fs.existsSync(skillPath)) {
        result = validateSkillOrAgent(skillPath, adrNumber);
        fileType = 'skill';
      } else if (fs.existsSync(agentPath)) {
        result = validateSkillOrAgent(agentPath, adrNumber);
        fileType = 'agent';
      } else {
        issues.push({
          adr: `ADR-${adrNumber}`,
          target,
          type: fileType || 'unknown',
          error: 'Target file not found'
        });
        totalIssues++;
        continue;
      }
      
      if (!result.valid) {
        issues.push({
          adr: `ADR-${adrNumber}`,
          target,
          type: fileType,
          error: result.error
        });
        totalIssues++;
      }
    }
  }
  
  if (issues.length === 0) {
    console.log('✅ All skills and agents are up to date with ADRs!\n');
    return 0;
  }
  
  console.log(`\n❌ Found ${totalIssues} issue(s):\n`);
  
  for (const issue of issues) {
    console.log(`  • ${issue.adr} → ${issue.target} (${issue.type})`);
    console.log(`    ${issue.error}\n`);
  }
  
  console.log('💡 Run `npm run sync:adrs` to fix these issues\n');
  return 1;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { validateSkillOrAgent, checkADRReference };
