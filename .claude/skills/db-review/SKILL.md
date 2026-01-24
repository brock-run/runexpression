---
name: db-review
description: Automated database security and performance review using Supabase advisors - checks RLS policies, indexes, and security vulnerabilities
user-invocable: false
---

# Database Review & Security Audit

## Purpose

Automatically review database changes for security and performance issues using Supabase advisors and custom validation logic. This skill catches common database issues before they reach production:

- **Security**: Missing RLS policies, exposed service role keys, SQL injection vulnerabilities
- **Performance**: Missing indexes on foreign keys, slow query patterns, unoptimized JSONB queries
- **Best Practices**: Naming conventions, data integrity constraints, migration patterns

## When to Invoke

**Claude should automatically invoke this skill when:**

- A migration file is created or modified (`supabase/migrations/*.sql`)
- A PR touches database schema files
- Explicitly requested by user: "review database security" or "check migration"
- During code review of database-related changes
- Before creating a PR with database changes

**Do NOT invoke for:**
- Seed data changes only (no schema changes)
- Documentation updates
- Non-database code changes

## Invocation

This is a **Claude-only** skill (`user-invocable: false`). Users cannot call this directly with `/db-review`. Instead:

**Automatic (via hook):**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "name": "post-migration-review",
        "tool": "Write",
        "pathPattern": "supabase/migrations/*.sql",
        "command": "claude -p 'Use db-review skill to analyze the migration I just created' --allowedTools Skill --headless"
      }
    ]
  }
}
```

**Manual (via Claude):**
```
User: "Can you review the database security?"
Claude: [Automatically invokes db-review skill]
```

## Review Process

### Phase 1: Gather Context

1. **Identify migration files changed**
   - Check git diff for `supabase/migrations/*.sql`
   - Read latest migration content
   - Identify affected tables and columns

2. **Get current schema state**
   - Use `list_tables` to get all tables
   - Use `execute_sql` to check RLS policies
   - Use `execute_sql` to check indexes

3. **Fetch Supabase advisors**
   - Security advisors (RLS, exposed keys, vulnerabilities)
   - Performance advisors (indexes, slow queries)

### Phase 2: Run Security Checks

#### RLS Policy Check

```sql
-- Check if new tables have RLS enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false;

-- Check if RLS-enabled tables have policies
SELECT schemaname, tablename
FROM pg_tables t
WHERE schemaname = 'public'
  AND rowsecurity = true
  AND NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = t.schemaname
      AND p.tablename = t.tablename
  );
```

**Expected:**
- ✅ All tables have `rowsecurity = true`
- ✅ All RLS-enabled tables have at least one policy
- ⚠️  Tables without RLS are flagged (unless explicitly exempt)

#### Service Role Key Check

```bash
# Scan codebase for exposed service role keys
grep -r "SUPABASE_SERVICE_ROLE_KEY" --exclude-dir=node_modules --exclude=*.md
```

**Expected:**
- ✅ Service role key only in `env.ts` and API routes
- ⚠️  Service role key in client components is CRITICAL vulnerability

#### SQL Injection Check

```typescript
// Scan migration for unsafe patterns
const unsafePatterns = [
  /\$\{.*?\}/,  // Template literal interpolation
  /EXECUTE format\(/,  // Dynamic SQL execution
  /pg_read_file\(/,  // File read functions
]

migration.content.match(unsafePatterns)
```

**Expected:**
- ✅ No dynamic SQL interpolation
- ✅ Use parameterized queries or sanitized inputs
- ⚠️  Unsafe patterns are flagged for manual review

### Phase 3: Run Performance Checks

#### Foreign Key Index Check

```sql
-- Find foreign key columns without indexes
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE tablename = tc.table_name
      AND indexdef LIKE '%' || kcu.column_name || '%'
  );
```

**Expected:**
- ✅ All foreign key columns have indexes
- ⚠️  Missing indexes cause slow JOINs

#### JSONB Query Optimization

```sql
-- Check for JSONB columns that might need indexes
SELECT table_name, column_name
FROM information_schema.columns
WHERE data_type = 'jsonb'
  AND table_schema = 'public';
```

**Recommendations:**
- Consider GIN indexes for frequently queried JSONB columns
- Use `jsonb_path_ops` for simple containment queries
- Use expression indexes for specific JSON keys

#### Query Performance

```sql
-- Check for tables with many rows but no indexes (except PK)
SELECT
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND n_live_tup > 10000
  AND (
    SELECT COUNT(*) FROM pg_indexes
    WHERE tablename = pg_stat_user_tables.tablename
  ) <= 1;  -- Only primary key
```

**Expected:**
- ✅ Large tables have appropriate indexes
- ⚠️  Tables with >10k rows should have indexes on query columns

### Phase 4: Best Practices Validation

#### Naming Conventions

```typescript
// Check migration follows conventions
const conventions = {
  tables: /^[a-z][a-z0-9_]*$/,  // snake_case
  columns: /^[a-z][a-z0-9_]*$/,  // snake_case
  indexes: /^idx_[a-z0-9_]+$/,  // idx_ prefix
  constraints: /^[a-z][a-z0-9_]+_fkey|pkey|check$/,
}
```

**Expected:**
- ✅ Tables and columns use snake_case
- ✅ Indexes have `idx_` prefix
- ✅ Foreign keys end with `_fkey`
- ⚠️  Inconsistent naming flagged for manual review

#### Migration Structure

```typescript
// Check migration includes rollback
const hasRollback = migration.content.includes('-- ROLLBACK:')

// Check migration is idempotent
const hasIfNotExists = migration.content.includes('IF NOT EXISTS')
```

**Expected:**
- ✅ Migration includes rollback instructions
- ✅ Migration uses `IF NOT EXISTS` for safety
- ⚠️  Non-idempotent migrations are risky

## MCP Tools Used

### Supabase MCP (`mcp__plugin_supabase_supabase__*`)

```typescript
// Get security advisors
mcp__plugin_supabase_supabase__get_advisors({
  project_id: process.env.SUPABASE_PROJECT_ID,
  type: "security"
})

// Get performance advisors
mcp__plugin_supabase_supabase__get_advisors({
  project_id: process.env.SUPABASE_PROJECT_ID,
  type: "performance"
})

// List all tables
mcp__plugin_supabase_supabase__list_tables({
  project_id: process.env.SUPABASE_PROJECT_ID,
  schemas: ["public"]
})

// Execute validation queries
mcp__plugin_supabase_supabase__execute_sql({
  project_id: process.env.SUPABASE_PROJECT_ID,
  query: "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'"
})

// List migrations
mcp__plugin_supabase_supabase__list_migrations({
  project_id: process.env.SUPABASE_PROJECT_ID
})
```

### Greptile MCP (`mcp__plugin_greptile_greptile__*`)

```typescript
// Search for similar RLS policy patterns
mcp__plugin_greptile_greptile__search_custom_context({
  query: "RLS policy patterns for user-owned content"
})

// Find existing database conventions
mcp__plugin_greptile_greptile__list_custom_context({
  type: "PATTERN",
  limit: 20
})
```

## Output Format

### Review Report Structure

```markdown
# Database Review Report

**Migration:** `20260123120000_add_vibe_tags.sql`
**Reviewed:** 2026-01-23 12:05:00
**Status:** ⚠️ 2 issues found, 3 suggestions

---

## Security Advisors

### 🚨 Critical Issues (0)
*None found*

### ⚠️ Warnings (1)
- **Missing RLS Policy**: Table `vibe_tags` has RLS enabled but no policies defined
  - **Impact**: Table is inaccessible to all users (including authenticated)
  - **Remediation**: [Link to Supabase docs on RLS policies]
  - **Suggested Fix**:
    ```sql
    -- Allow authenticated users to read vibe tags
    CREATE POLICY "vibe_tags_select"
      ON vibe_tags FOR SELECT
      TO authenticated
      USING (true);

    -- Allow users to insert their own vibe tags
    CREATE POLICY "vibe_tags_insert"
      ON vibe_tags FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
    ```

### ✅ Passed Checks (3)
- All tables have RLS enabled
- No exposed service role keys in client code
- No SQL injection vulnerabilities detected

---

## Performance Advisors

### 💡 Suggestions (2)
- **Missing Index**: Foreign key `vibe_tags.user_id` has no index
  - **Impact**: Slow queries when filtering by user_id
  - **Suggested Fix**:
    ```sql
    CREATE INDEX idx_vibe_tags_user_id ON vibe_tags(user_id);
    ```

- **JSONB Optimization**: Column `vibe_tags.metadata` is JSONB but has no index
  - **Impact**: Slow queries if filtering by JSON properties
  - **Suggested Fix** (if frequently queried):
    ```sql
    CREATE INDEX idx_vibe_tags_metadata ON vibe_tags USING GIN(metadata);
    ```

### ✅ Passed Checks (2)
- Primary key index exists
- Table size reasonable for current schema

---

## Best Practices

### ✅ Followed (4)
- Migration uses snake_case naming
- Migration is idempotent (uses IF NOT EXISTS)
- Foreign key constraints defined
- Migration file naming follows convention

### 📋 Recommendations (1)
- Consider adding rollback instructions as SQL comment

---

## Summary

**Review Status:** ⚠️ **Action Required**

**Critical Issues:** 0
**Warnings:** 1 (RLS policy missing)
**Suggestions:** 2 (indexes)

**Next Steps:**
1. Add RLS policies to `vibe_tags` table
2. Add index on `user_id` foreign key
3. Consider JSONB index if metadata frequently queried
4. Re-run review: `claude -p "Review database again"`

**Estimated Fix Time:** 5-10 minutes

---

*Generated by db-review skill • [View documentation](../../docs/11-MCP-INTEGRATION-WORKFLOW.md)*
```

## Issue Severity Levels

### 🚨 Critical (Blocks PR)

**Security:**
- Missing RLS on tables with user data
- Exposed service role key in client code
- SQL injection vulnerability
- Unencrypted sensitive data (passwords, tokens)

**Performance:**
- Table with >100k rows has no indexes
- Cartesian join in migration
- Recursive query without limit

**Action:** MUST be fixed before merge

### ⚠️ Warning (Should Fix)

**Security:**
- Table has RLS but no policies (inaccessible)
- Overly permissive RLS policy (e.g., `USING (true)` for all operations)
- Missing constraints on foreign keys

**Performance:**
- Missing index on foreign key column
- Large JSONB column without GIN index
- N+1 query pattern detected

**Action:** Should be fixed before merge, can be deferred if justified

### 💡 Suggestion (Nice to Have)

**Security:**
- Consider row-level audit logging
- Consider encryption for sensitive JSONB fields

**Performance:**
- Consider partial index for filtered queries
- Consider materialized view for complex aggregations
- Consider archiving old data

**Action:** Optional, can be addressed in future PRs

### ✅ Passed

**All checks passed:**
- RLS policies correctly configured
- Indexes present on foreign keys
- No security vulnerabilities
- Naming conventions followed
- Migration is idempotent

**Action:** None required, proceed with confidence

## Example Reviews

### Example 1: New Table with RLS Issue

**Migration:** `20260123120000_create_flow_posts.sql`

```sql
CREATE TABLE flow_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  vibe_tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE flow_posts ENABLE ROW LEVEL SECURITY;
```

**Review Output:**

```markdown
# Database Review Report

**Migration:** `20260123120000_create_flow_posts.sql`

## Security Advisors

### ⚠️ Warnings (1)
- **Missing RLS Policies**: Table `flow_posts` has RLS enabled but no policies
  - Users cannot read or write to this table
  - **Suggested Fix**:
    ```sql
    -- Public can read all posts
    CREATE POLICY "flow_posts_select"
      ON flow_posts FOR SELECT
      TO public
      USING (true);

    -- Users can insert their own posts
    CREATE POLICY "flow_posts_insert"
      ON flow_posts FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());

    -- Users can update their own posts
    CREATE POLICY "flow_posts_update"
      ON flow_posts FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid());
    ```

## Performance Advisors

### 💡 Suggestions (1)
- **Missing Index**: Foreign key `user_id` has no index
  - **Suggested Fix**:
    ```sql
    CREATE INDEX idx_flow_posts_user_id ON flow_posts(user_id);
    ```

## Summary
⚠️ **Action Required**: Add RLS policies before merge
```

### Example 2: Perfect Migration

**Migration:** `20260123130000_add_vibe_tags_index.sql`

```sql
-- Add index for vibe tag filtering
CREATE INDEX IF NOT EXISTS idx_flow_posts_vibe_tags
  ON flow_posts USING GIN(vibe_tags);

-- ROLLBACK:
-- DROP INDEX IF EXISTS idx_flow_posts_vibe_tags;
```

**Review Output:**

```markdown
# Database Review Report

**Migration:** `20260123130000_add_vibe_tags_index.sql`

## Security Advisors
✅ All checks passed (0 issues)

## Performance Advisors
✅ All checks passed (0 issues)

## Best Practices
✅ All conventions followed (4/4)
- Idempotent migration (IF NOT EXISTS)
- Rollback instructions included
- Naming convention followed
- Appropriate index type for array column

## Summary
✅ **Ready to Merge**: No issues found
```

### Example 3: Critical Security Issue

**Migration:** `20260123140000_add_admin_users.sql`

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  password TEXT NOT NULL,  -- ⚠️ Plain text password!
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Review Output:**

```markdown
# Database Review Report

**Migration:** `20260123140000_add_admin_users.sql`

## Security Advisors

### 🚨 Critical Issues (2)
- **Unencrypted Sensitive Data**: Column `password` stores plain text passwords
  - **Impact**: CRITICAL security vulnerability
  - **Remediation**: Use Supabase Auth or bcrypt hashing
  - **Suggested Fix**:
    ```sql
    -- Option 1: Use Supabase Auth (recommended)
    -- Add admin role to existing users table

    -- Option 2: Hash passwords
    ALTER TABLE admin_users
      ALTER COLUMN password TYPE TEXT;
    -- Store bcrypt hashed passwords only
    ```

- **Missing RLS**: Table `admin_users` has no RLS enabled
  - **Impact**: Anyone can read admin user data
  - **Suggested Fix**:
    ```sql
    ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

    -- Only admins can see admin users
    CREATE POLICY "admin_users_select"
      ON admin_users FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE id = auth.uid()
        )
      );
    ```

## Summary
🚨 **BLOCKED**: Critical security issues must be resolved

**DO NOT MERGE** until these issues are fixed.
```

## Integration with Other Skills

### With `linear-sync`

```bash
# Create issue for database change
/linear-sync start RUN-400

# Create migration
# ... edit supabase/migrations/xxx.sql ...

# db-review automatically runs (via hook)
# Finds 2 issues

# Fix issues, commit
git commit -m "fix(db): Add RLS policies for RUN-400"

# Create PR (includes review results in description)
/linear-sync pr
```

### With `git-workflow-conventional-commits`

```bash
# Migration created
# db-review runs automatically

# If issues found, commit fix:
git commit -m "fix(db): Add missing RLS policies"

# Pre-commit hook validates format
# PostToolUse hook re-runs db-review
```

### With `supabase-integration-expert` skill

```bash
# When creating RLS policies
# db-review validates policy correctness
# supabase-integration-expert provides policy patterns
```

## Configuration

### Environment Variables

Required:
```bash
SUPABASE_PROJECT_ID=xxxxxxxxxxxx
SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxx
```

Optional:
```bash
DB_REVIEW_STRICT_MODE=true  # Treat warnings as errors
DB_REVIEW_AUTO_FIX=false    # Don't auto-apply fixes
```

### Exemptions

Exempt tables from RLS requirement in `.claude/settings.json`:

```json
{
  "skills": {
    "db-review": {
      "rlsExemptions": [
        "audit_logs",
        "system_config"
      ],
      "indexExemptions": [
        "small_lookup_tables"
      ]
    }
  }
}
```

## Troubleshooting

### "SUPABASE_PROJECT_ID not found"

**Solution:**
```bash
# Add to .env.local
echo "SUPABASE_PROJECT_ID=your-project-id" >> .env.local

# Or export in shell
export SUPABASE_PROJECT_ID="your-project-id"
```

### "Failed to connect to Supabase MCP"

**Solution:**
```bash
# Check MCP connection
claude mcp list

# Reconnect if needed
claude mcp remove supabase
claude mcp add supabase
```

### "Permission denied for pg_tables"

**Solution:**
- Verify Supabase access token has correct permissions
- Ensure using project-specific token, not user token

### "Too many false positives"

**Solution:**
- Add exemptions in configuration (see above)
- Use `DB_REVIEW_STRICT_MODE=false` for warnings
- Provide feedback to improve detection logic

## Best Practices

### 1. Run Before Creating PR

```bash
# Manual review before PR
claude -p "Review database security and performance"

# Address issues
# ... fix ...

# Create PR
/linear-sync pr
```

### 2. Include Review in PR Description

```markdown
## Database Review

✅ Security: All checks passed
⚠️ Performance: 1 suggestion (added index)

[Full review report](link)
```

### 3. Don't Skip Critical Issues

```bash
# ❌ Bad: Merge with critical issues
git commit -m "feat(db): Add table (TODO: fix RLS later)"

# ✅ Good: Fix issues first
git commit -m "feat(db): Add table with RLS policies"
```

### 4. Keep Migrations Small

```bash
# ✅ Good: Small, focused migrations
# Migration 1: Create table
# Migration 2: Add RLS policies
# Migration 3: Add indexes

# ❌ Bad: Massive migration
# Migration 1: Create 10 tables + RLS + indexes + seed data
```

## Maintenance

### Updating Review Logic

Review logic should be updated when:
- New security patterns emerge
- Performance best practices change
- Team conventions evolve

Update in this skill file and re-test with existing migrations.

### Monitoring False Positives

Track false positives:
- Log dismissed warnings
- Review monthly for pattern recognition
- Update exemptions or logic as needed

---

**Skill Version:** 1.0
**Last Updated:** 2026-01-23
**Maintainer:** Engineering Team
