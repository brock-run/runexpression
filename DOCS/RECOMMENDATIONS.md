# RunExpression: Recommended Skills & Subagents

**Last Updated:** 2025-01-23  
**Purpose:** Guide for setting up optimal AI assistance for RunExpression development

---

## Recommended Skills

### 1. **Next.js App Router Specialist**
**Purpose:** Deep expertise in Next.js 14+ App Router patterns, Server/Client Components, and Next.js-specific optimizations.

**Key Capabilities:**
- Server Components vs Client Components decision-making
- Route groups and layout patterns
- API route best practices
- Image optimization and dynamic imports
- Middleware patterns for auth

**When to Use:**
- Setting up new routes and layouts
- Optimizing page performance
- Implementing SSR/SSG strategies
- Debugging Next.js-specific issues

---

### 2. **Supabase Integration Expert**
**Purpose:** Mastery of Supabase patterns including RLS policies, Realtime subscriptions, Storage, and Auth flows.

**Key Capabilities:**
- Row Level Security policy design
- Realtime subscription patterns
- Storage bucket configuration and upload flows
- Auth callback handling
- Database query optimization

**When to Use:**
- Creating new database tables and policies
- Implementing real-time features (Flow wall updates)
- Setting up file uploads
- Debugging RLS policy issues
- Optimizing database queries

---

### 3. **TypeScript & Type Safety**
**Purpose:** Ensuring type safety across the codebase, generating types from Supabase, and maintaining strict TypeScript standards.

**Key Capabilities:**
- Type generation from Supabase schema
- Complex type definitions (JSONB, unions, generics)
- Type-safe API route handlers
- Type inference optimization

**When to Use:**
- Adding new features requiring type definitions
- Refactoring for better type safety
- Generating database types after schema changes
- Debugging type errors

---

### 4. **Shadcn/UI Component Builder**
**Purpose:** Creating and customizing Shadcn/UI components to match RunExpression brand aesthetic.

**Key Capabilities:**
- Component composition with Radix UI primitives
- Tailwind CSS customization
- Accessibility (ARIA, keyboard navigation)
- Brand-specific styling (sage green, purple glows, monospace fonts)

**When to Use:**
- Building new UI components
- Customizing existing Shadcn components
- Ensuring accessibility compliance
- Implementing brand-specific visual patterns

---

### 5. **Database Schema & Migration**
**Purpose:** Designing database schemas, writing migrations, and maintaining data integrity.

**Key Capabilities:**
- Hybrid relational + JSONB schema design
- Migration writing and rollback strategies
- Index optimization
- Seed data creation

**When to Use:**
- Adding new features requiring database changes
- Optimizing query performance
- Creating seed data for development/testing
- Planning schema evolution

---

### 6. **Framer Motion Animation**
**Purpose:** Implementing smooth, performant animations that respect accessibility preferences.

**Key Capabilities:**
- Scroll-triggered animations (manifesto chapters)
- Stagger animations for lists
- Shared element transitions
- `prefers-reduced-motion` handling

**When to Use:**
- Homepage manifesto scroll experience
- Flow wall entry animations
- Modal/dialog transitions
- Any motion-heavy features

---

### 7. **Content Moderation & Trust Systems**
**Purpose:** Implementing OpenAI moderation, trust scoring, and moderation queue workflows.

**Key Capabilities:**
- OpenAI Moderation API integration
- Trust scoring logic (auto-approve after N posts)
- Admin moderation queue UI
- Content filtering and validation

**When to Use:**
- Flow submission moderation
- Clubhouse upload approval workflows
- Building admin tools
- Handling edge cases in moderation

---

### 8. **Stripe Payment Integration**
**Purpose:** Implementing Stripe Checkout, webhooks, and order management.

**Key Capabilities:**
- Stripe Checkout session creation
- Webhook signature verification
- Order status management
- Digital product delivery

**When to Use:**
- Shop feature implementation
- Payment flow debugging
- Webhook handler development
- Order management features

---

### 9. **Testing & QA Automation**
**Purpose:** Writing unit tests, integration tests, and E2E tests for critical flows.

**Key Capabilities:**
- Jest + React Testing Library patterns
- Playwright E2E test setup
- Test data factories
- Accessibility testing automation

**When to Use:**
- Adding tests for new features
- Setting up test infrastructure
- Debugging test failures
- CI/CD test configuration

---

### 10. **Git Workflow & Conventional Commits**
**Purpose:** Enforcing commit message standards, branch strategies, and PR best practices.

**Key Capabilities:**
- Conventional commit format validation
- Branch naming conventions
- PR template creation
- Git hook configuration

**When to Use:**
- Setting up project Git standards
- Reviewing commit history
- Creating PR templates
- Configuring Husky hooks

---

## Recommended Subagents

### 1. **Frontend Development Agent**
**Primary Focus:** React components, UI/UX implementation, client-side interactivity

**Responsibilities:**
- Building Flow wall components
- Implementing homepage manifesto scroll experience
- Creating form components (Flow submission, clubhouse upload)
- Client-side state management
- Real-time UI updates (Supabase Realtime)

**Skills to Include:**
- Next.js App Router Specialist
- Shadcn/UI Component Builder
- Framer Motion Animation
- TypeScript & Type Safety

**Best For:**
- Feature development in `/app` and `/components`
- UI polish and animations
- Form handling and validation

---

### 2. **Backend & Database Agent**
**Primary Focus:** API routes, database schema, Supabase integration, RLS policies

**Responsibilities:**
- Creating API routes (`/app/api/*`)
- Designing database schemas and migrations
- Writing RLS policies
- Supabase Storage configuration
- Database query optimization

**Skills to Include:**
- Supabase Integration Expert
- Database Schema & Migration
- TypeScript & Type Safety
- Content Moderation & Trust Systems

**Best For:**
- Backend feature development
- Database design and migrations
- API endpoint creation
- Security and access control

---

### 3. **Full-Stack Feature Agent**
**Primary Focus:** End-to-end feature implementation (frontend + backend)

**Responsibilities:**
- Complete feature implementation (e.g., "Add vibe tag filtering to Flow")
- Coordinating frontend and backend changes
- Integration testing
- Feature documentation

**Skills to Include:**
- All skills (comprehensive)
- Next.js App Router Specialist
- Supabase Integration Expert
- TypeScript & Type Safety

**Best For:**
- New feature development from scratch
- Major refactoring across layers
- Complex features requiring coordination

---

### 4. **Testing & QA Agent**
**Primary Focus:** Test writing, test infrastructure, quality assurance

**Responsibilities:**
- Writing unit tests for utilities and hooks
- Creating component tests
- Setting up E2E tests (Playwright)
- Test data factories
- CI/CD test configuration

**Skills to Include:**
- Testing & QA Automation
- TypeScript & Type Safety
- Next.js App Router Specialist (for testing patterns)

**Best For:**
- Adding test coverage
- Debugging test failures
- Setting up test infrastructure
- Quality assurance reviews

---

### 5. **DevOps & Deployment Agent**
**Primary Focus:** Deployment, environment configuration, monitoring, CI/CD

**Responsibilities:**
- Vercel deployment configuration
- Environment variable management
- CI/CD pipeline setup (GitHub Actions)
- Monitoring and error tracking (Sentry)
- Performance optimization

**Skills to Include:**
- Next.js App Router Specialist (deployment patterns)
- Git Workflow & Conventional Commits

**Best For:**
- Deployment setup and troubleshooting
- CI/CD configuration
- Environment management
- Performance monitoring

---

### 6. **Content & Brand Agent**
**Primary Focus:** Copywriting, brand voice, content creation, documentation

**Responsibilities:**
- Writing UI copy (buttons, error messages, success messages)
- Creating seed content (Flow entries, clubhouse stories)
- Blog post writing (MDX)
- Documentation updates
- Brand voice consistency

**Skills to Include:**
- (Content-focused, less technical)

**Best For:**
- Content creation and copywriting
- Brand voice reviews
- Documentation
- User-facing text

---

## Recommended Agent Configurations

### For Daily Development

**Primary Agent: Full-Stack Feature Agent**
- Handles most feature work
- Can coordinate frontend and backend
- Good for iterative development

**Supporting Agents:**
- **Testing & QA Agent**: When adding tests or debugging test failures
- **Backend & Database Agent**: When working on complex database changes
- **Frontend Development Agent**: When focusing on UI/UX polish

### For Specific Tasks

**Database Changes:**
→ Use **Backend & Database Agent** with Supabase Integration Expert + Database Schema skills

**UI Component Creation:**
→ Use **Frontend Development Agent** with Shadcn/UI Component Builder + Framer Motion skills

**Payment Integration:**
→ Use **Backend & Database Agent** with Stripe Payment Integration skill

**Animation Work:**
→ Use **Frontend Development Agent** with Framer Motion Animation skill

**Test Writing:**
→ Use **Testing & QA Agent** with Testing & QA Automation skill

---

## Skill Priority Ranking

### Must-Have (Core Development)
1. **Next.js App Router Specialist** - Essential for all development
2. **TypeScript & Type Safety** - Required for code quality
3. **Supabase Integration Expert** - Core backend platform

### High Priority (Feature Development)
4. **Shadcn/UI Component Builder** - UI consistency
5. **Database Schema & Migration** - Data layer
6. **Content Moderation & Trust Systems** - Flow feature critical

### Medium Priority (Enhancement)
7. **Framer Motion Animation** - Brand experience
8. **Stripe Payment Integration** - Shop feature
9. **Testing & QA Automation** - Quality assurance

### Nice-to-Have (Process)
10. **Git Workflow & Conventional Commits** - Code organization

---

## Implementation Strategy

### Phase 1: Core Setup (Week 1)
- **Primary Agent**: Full-Stack Feature Agent
- **Skills**: Next.js, TypeScript, Supabase, Database Schema
- **Focus**: Project setup, auth, basic routing

### Phase 2: Homepage (Week 2)
- **Primary Agent**: Frontend Development Agent
- **Skills**: Next.js, Framer Motion, Shadcn/UI
- **Focus**: Manifesto scroll experience, hero, footer

### Phase 3: The Flow (Weeks 3-4)
- **Primary Agent**: Full-Stack Feature Agent
- **Supporting**: Backend Agent (moderation), Frontend Agent (UI)
- **Skills**: All core + Content Moderation + Framer Motion
- **Focus**: Submission flow, wall display, real-time updates, moderation

### Phase 4: Clubhouse (Week 5)
- **Primary Agent**: Full-Stack Feature Agent
- **Skills**: All core + Database Schema
- **Focus**: Upload portal, browse sections, admin tools

### Phase 5: Polish & Launch (Week 6)
- **Primary Agent**: Full-Stack Feature Agent
- **Supporting**: Testing Agent, Content Agent
- **Skills**: All + Testing + Stripe (for shop)
- **Focus**: Blog, shop framework, final QA, content seeding

---

## Custom Skill Creation Recommendations

Consider creating project-specific skills for:

1. **RunExpression Brand Voice**
   - Enforces "Sage in the Parking Lot" tone
   - Validates copy against brand guidelines
   - Suggests brand-aligned error messages

2. **Flow Feature Patterns**
   - Vibe tag taxonomy and usage
   - Moderation workflow patterns
   - Real-time subscription patterns

3. **Clubhouse Patterns**
   - Upload portal multi-step flow
   - Media archive lightbox patterns
   - Lore story markdown rendering

4. **Database Naming Conventions**
   - Enforces snake_case for database columns
   - Validates JSONB structure
   - RLS policy naming standards

---

## Notes

- **Start Simple**: Begin with Full-Stack Feature Agent + core skills, add specialized agents as needed
- **Iterate**: Adjust agent configurations based on what works best for your workflow
- **Document**: Keep notes on which agent/skill combinations work best for specific tasks
- **Customize**: Create project-specific skills for patterns you use frequently

---

**Last Updated:** 2025-01-23  
**Maintained By:** Development Team
