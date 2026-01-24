#!/bin/bash

# Script to convert remaining cursor skills to Claude format
# Run this script to complete the skill conversion

CURSOR_SKILLS_DIR=".cursor/skills"
CLAUDE_SKILLS_DIR=".claude/skills"

echo "Converting cursor skills to Claude format..."

# Array of remaining skills to convert
SKILLS=(
  "framer-motion-animation"
  "git-workflow-conventional-commits"
  "shadcn-ui-component-builder"
  "stripe-payment-integration"
  "supabase-integration-expert"
  "testing-qa-automation"
  "typescript-type-safety"
)

for skill in "${SKILLS[@]}"; do
  echo "Converting $skill..."
  mkdir -p "$CLAUDE_SKILLS_DIR/$skill"

  # Copy the skill file (cursor skills already have proper YAML frontmatter)
  if [ -f "$CURSOR_SKILLS_DIR/$skill/SKILL.md" ]; then
    cp "$CURSOR_SKILLS_DIR/$skill/SKILL.md" "$CLAUDE_SKILLS_DIR/$skill/SKILL.md"
    echo "✓ Converted $skill"
  else
    echo "✗ Skill file not found: $CURSOR_SKILLS_DIR/$skill/SKILL.md"
  fi
done

echo ""
echo "Conversion complete!"
echo "Skills are now available in: $CLAUDE_SKILLS_DIR (project-specific)"
echo ""
echo "To verify skills are working, run:"
echo "  ls -la $CLAUDE_SKILLS_DIR"
