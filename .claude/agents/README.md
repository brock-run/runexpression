# Claude Agents Reference

These agent definitions from cursor have been converted to reference documents for Claude Code.

## Understanding Claude Agents

Claude Code uses the **Task tool** to spawn specialized agents. The cursor agent definitions here serve as **reference guides** for understanding project roles and responsibilities.

## How to Use with Claude

Instead of selecting an "agent" like in cursor, you work with Claude by:

1. **Describing your task clearly** - Claude will automatically use relevant skills
2. **Using the Task tool** - For complex multi-step work, spawn subagents
3. **Referencing agent docs** - Use these files to understand domain boundaries

## Cursor Agent → Claude Workflow Mapping

| Cursor Agent | Claude Approach | When to Use |
|--------------|-----------------|-------------|
| **frontend-development-agent** | Use skills: `nextjs-app-router-specialist`, `shadcn-ui-component-builder`, `framer-motion-animation` | Building UI components, pages, animations |
| **backend-database-agent** | Use skills: `database-schema-migration`, `supabase-integration-expert`, `content-moderation-trust-systems` | API routes, database changes, RLS policies |
| **content-brand-agent** | Reference `content-brand-agent.md` for brand voice | Writing UI copy, content creation |
| **testing-qa-agent** | Use skill: `testing-qa-automation` | Writing tests, debugging test failures |
| **devops-deployment-agent** | Use Task tool with `subagent_type: Bash` | Deployment, CI/CD, infrastructure |
| **full-stack-feature-agent** | Combine multiple skills or use Task tool with `subagent_type: general-purpose` | Full feature implementation |

## Using the Task Tool

For complex work, use the Task tool:

```typescript
// Example: Spawn a subagent for a complex task
<Task
  subagent_type="general-purpose"
  description="Implement user authentication"
  prompt="Create a complete auth flow with Supabase Auth, including login, signup, and protected routes"
/>
```

Available subagent types:
- `Bash` - Command execution
- `general-purpose` - Complex multi-step tasks
- `Explore` - Codebase exploration (quick/medium/thorough)
- `Plan` - Implementation planning

## Agent Reference Files

- **frontend-development-agent.md** - React, Next.js, UI/UX patterns
- **backend-database-agent.md** - API routes, database, Supabase
- **content-brand-agent.md** - Brand voice, copywriting guidelines
- **testing-qa-agent.md** - Testing patterns, QA workflows
- **devops-deployment-agent.md** - Deployment, infrastructure
- **full-stack-feature-agent.md** - Full feature development

These files provide context and conventions but are not invoked like cursor agents.
