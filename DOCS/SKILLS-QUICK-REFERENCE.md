# Claude Skills Quick Reference

## 📘 Available Skills (10 total)

### Frontend & UI
- **nextjs-app-router-specialist** - Next.js 14+ patterns, Server/Client Components, routing
- **shadcn-ui-component-builder** - Shadcn/UI + Radix + RunExpression branding
- **framer-motion-animation** - Accessible animations, scroll triggers, transitions

### Backend & Data
- **supabase-integration-expert** - RLS, Realtime, Storage, Auth
- **database-schema-migration** - Schema design, migrations, JSONB patterns
- **content-moderation-trust-systems** - OpenAI moderation, trust scoring, admin tools

### Payment & Integration
- **stripe-payment-integration** - Checkout, webhooks, order management

### Development Workflow
- **git-workflow-conventional-commits** - Commit standards, branches, PRs
- **testing-qa-automation** - Jest, RTL, Playwright
- **typescript-type-safety** - Type generation, strict TypeScript

## 🔍 When to Use Each Skill

### "I need to create a new page/route"
→ Use `nextjs-app-router-specialist`

### "I need to add a UI component"
→ Use `shadcn-ui-component-builder`

### "I need to add animations"
→ Use `framer-motion-animation`

### "I need to change the database schema"
→ Use `database-schema-migration`

### "I need to implement authentication/authorization"
→ Use `supabase-integration-expert`

### "I need to moderate user content"
→ Use `content-moderation-trust-systems`

### "I need to accept payments"
→ Use `stripe-payment-integration`

### "I need to commit code"
→ Use `git-workflow-conventional-commits`

### "I need to write tests"
→ Use `testing-qa-automation`

### "I'm getting TypeScript errors"
→ Use `typescript-type-safety`

## 💡 Common Workflows

### Creating a New Feature
1. `database-schema-migration` - Add tables/columns
2. `typescript-type-safety` - Generate types
3. `nextjs-app-router-specialist` - Create routes
4. `shadcn-ui-component-builder` - Build UI
5. `supabase-integration-expert` - Add RLS policies
6. `testing-qa-automation` - Write tests
7. `git-workflow-conventional-commits` - Commit changes

### Building a Form with Validation
1. `shadcn-ui-component-builder` - Form components
2. `typescript-type-safety` - Type definitions + Zod schemas
3. `nextjs-app-router-specialist` - API route handler
4. `supabase-integration-expert` - Database insert

### Implementing Animations
1. `framer-motion-animation` - Animation patterns
2. `shadcn-ui-component-builder` - Component structure
3. `nextjs-app-router-specialist` - Dynamic imports (if heavy)

### Debugging Issues
- **TypeScript errors** → `typescript-type-safety`
- **RLS policy blocking query** → `supabase-integration-expert`
- **Test failures** → `testing-qa-automation`
- **Next.js hydration error** → `nextjs-app-router-specialist`
- **Animation not working** → `framer-motion-animation`

## 📁 Skill Locations

**Claude Skills**: `~/.claude/skills/[skill-name]/SKILL.md`
**Cursor Skills** (source): `.cursor/skills/[skill-name]/SKILL.md`

## 🔧 Maintenance

Update a skill:
1. Edit in `.cursor/skills/[skill-name]/SKILL.md`
2. Run `./convert-skills.sh` to sync to Claude
3. Verify: `cat ~/.claude/skills/[skill-name]/SKILL.md`

## 🎯 Tips

- Skills are automatically discovered by Claude Code
- Descriptions are optimized for search ("Use when...")
- All skills include RunExpression-specific patterns
- Skills reference project docs in `DOCS/` folder

## 📚 Related Resources

- **CLAUDE.md** - Project overview and conventions
- **SKILLS-CONVERSION-README.md** - Detailed conversion documentation
- **DOCS/** - Comprehensive project documentation
- **Superpowers Skills** - Additional TDD, debugging, planning skills

---

**Quick Access**: `cat ~/Projects/runexpression/SKILLS-QUICK-REFERENCE.md`
