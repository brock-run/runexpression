---
name: git-workflow-conventional-commits
description: Enforces commit message standards, branch strategies, and PR best practices following RunExpression conventions. Use when setting up project Git standards, reviewing commit history, creating PR templates, configuring Husky hooks, writing commit messages, creating branches, or when the user asks about Git workflow, conventional commits, branch naming, or PR guidelines.
---

# Git Workflow & Conventional Commits

## Core Principles

**Clean History**: Commit messages tell the story of the project. Use conventional commit format, keep commits atomic, and maintain clear branch naming.

**Automated Quality**: Husky hooks enforce standards before commits/pushes. Pre-commit runs linting/formatting, commit-msg validates format.

## Commit Message Format

### Conventional Commit Structure

```
<type>(<scope>): <subject>

<body (optional)>

<footer (optional)>
```

### Commit Types

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code formatting (no logic change)
refactor: Code restructuring (no behavior change)
test:     Adding or updating tests
chore:    Build process, dependencies, tooling
perf:     Performance improvements
build:    Build system changes
ci:       CI/CD changes
```

### Examples

```bash
# ✅ Good (feature)
git commit -m "feat(flow): Add real-time subscription to wall"

# ✅ Good (fix with body)
git commit -m "fix(auth): Resolve redirect loop on login

Users were stuck in infinite redirect when accessing /dashboard
after login. Changed redirect logic to use absolute URL instead
of relative path.

Closes #123"

# ✅ Good (chore)
git commit -m "chore: Update dependencies to latest versions"

# ❌ Bad (vague)
git commit -m "fix stuff"
git commit -m "updates"
git commit -m "WIP"
```

### Commit Message Rules

1. **Use imperative mood** (not past tense):
   - ✅ "Add vibe tag filtering"
   - ❌ "Added vibe tag filtering"

2. **Keep subject under 72 characters**

3. **Capitalize subject line**:
   - ✅ "feat(flow): Add real-time updates"
   - ❌ "feat(flow): add real-time updates"

4. **Don't end subject with period**

5. **One logical change per commit** (atomic commits)

## Branch Naming

### Branch Types

```bash
feature/flow-submissions        # New features
fix/login-redirect-bug          # Bug fixes
chore/update-dependencies       # Maintenance tasks
docs/add-api-documentation      # Documentation updates
```

### Naming Rules

- Use lowercase with hyphens
- Include ticket number if using issue tracker: `feature/123-flow-pagination`
- Be descriptive but concise

```bash
# ✅ Good
git checkout -b feature/flow-real-time-updates
git checkout -b fix/toast-notification-position

# ❌ Bad
git checkout -b Feature/FlowRealTimeUpdates
git checkout -b fix_toast_notification
```

## Pull Requests

### PR Title Format

Use same format as commit messages:

```markdown
feat(flow): Add real-time updates to Flow wall
```

### PR Description Template

```markdown
## Summary
- Brief overview of changes

## Changes
- List of specific changes made

## Test Plan
- [ ] Test case 1
- [ ] Test case 2

## Screenshots
[Attach if applicable]
```

### PR Size Guidelines

- ✅ **Good**: 50-300 lines changed (easy to review)
- ⚠️ **OK**: 300-500 lines (larger feature, still reviewable)
- ❌ **Bad**: 500+ lines (too large, split into multiple PRs)

**Break large features into smaller PRs:**

```bash
# ✅ Good (3 small PRs)
PR #1: feat(flow): Add database schema for vibe tags
PR #2: feat(flow): Add vibe tag API endpoints
PR #3: feat(flow): Add vibe tag UI components

# ❌ Bad (1 massive PR)
PR #1: feat(flow): Complete vibe tag feature (800 lines changed)
```

### Merge Strategy

**Prefer squash merge for feature branches:**

```bash
gh pr merge --squash
```

This creates clean main branch history (one commit per feature).

## Git Hooks

### Pre-Commit Hook

Runs linting and formatting before commit:

```bash
# .husky/pre-commit
npx lint-staged
```

**Configured in package.json:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### Commit-msg Hook

Enforces conventional commit format:

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

pattern="^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\(.+\))?: .{1,}"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
    echo "❌ Invalid commit message format"
    echo "   Format: <type>(<scope>): <description>"
    echo "   Types: feat, fix, docs, style, refactor, perf, test, chore, build, ci"
    echo "   Example: feat(auth): add login functionality"
    exit 1
fi
```

## Daily Workflow

### Starting Work

```bash
# Update local main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-feature
```

### Making Changes

```bash
# Stage and commit
git add .
git commit -m "feat(scope): Add feature"

# Push to remote
git push -u origin feature/my-feature

# Create PR
gh pr create --title "feat(scope): Add feature" --body "..."
```

### After PR Merged

```bash
# Update local main
git checkout main
git pull origin main

# Delete local branch
git branch -d feature/my-feature
```

## Common Scenarios

### Fixing Commit Message (Before Push)

```bash
git commit --amend -m "feat(flow): Add real-time updates"
```

### Undoing Last Commit (Keep Changes)

```bash
# Undo commit, keep changes staged
git reset --soft HEAD~1

# Undo commit, keep changes unstaged
git reset HEAD~1
```

### Viewing History

```bash
# View commit history
git log --oneline --graph --all

# View changes in last commit
git show HEAD

# View changes between branches
git diff main..feature/my-feature
```

### Syncing with Main

```bash
# Update feature branch with latest main
git checkout feature/my-feature
git rebase main  # Or: git merge main
```

## Reviewing Commit History

When reviewing commit history, check for:

- ✅ Conventional commit format
- ✅ Descriptive, imperative subject lines
- ✅ Atomic commits (one logical change each)
- ✅ Appropriate scope in parentheses
- ✅ Clear branch names

**Example good history:**
```
feat(flow): Add real-time subscription to wall
fix(auth): Resolve redirect loop on login
docs(api): Document vibe tag endpoints
chore: Update dependencies to latest versions
```

## Setting Up Git Hooks

### Install Husky

```bash
npm install --save-dev husky
npx husky install
```

### Add Pre-Commit Hook

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

### Add Commit-msg Hook

```bash
npx husky add .husky/commit-msg "sh .husky/commit-msg"
```

## PR Template Creation

Create `.github/pull_request_template.md`:

```markdown
## Summary
<!-- Brief overview of changes -->

## Changes
<!-- List of specific changes -->
- Change 1
- Change 2

## Test Plan
<!-- How to test these changes -->
- [ ] Test case 1
- [ ] Test case 2

## Screenshots
<!-- If applicable -->

## Related Issues
<!-- Link to related issues -->
Closes #123
```

## Best Practices Checklist

When working with Git:

- [ ] Use conventional commit format
- [ ] Keep commits atomic (one logical change)
- [ ] Use descriptive branch names (lowercase, hyphens)
- [ ] Keep PRs small (50-300 lines ideal)
- [ ] Write clear PR descriptions
- [ ] Use squash merge for feature branches
- [ ] Sync with main frequently
- [ ] Delete merged branches
- [ ] Never force push to shared branches
- [ ] Run `npm run type-check` before committing

## Additional Resources

For complete Git workflow documentation, see [docs/10-GIT-WORKFLOW.md](../../docs/10-GIT-WORKFLOW.md).

**Key sections:**
- Branch strategy and lifecycle
- Detailed commit message guidelines
- PR review process
- Merging strategies
- Tagging and releases
- Emergency procedures (reverting, hotfixes)
