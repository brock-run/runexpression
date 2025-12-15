# RunExpression V1: Git Workflow

**Last Updated:** 2025-12-14
**Maintainer:** Engineering Team
**Status:** Living Document

---

## Overview

This document defines Git workflow and version control conventions for RunExpression V1. All contributors should follow these standards to maintain a clean, organized repository.

**Goals:**
- **Clear history:** Commit messages tell the story of the project
- **Safe collaboration:** Branches protect main from breaking changes
- **Easy rollbacks:** Clean commits make reverting changes simple
- **Automated quality:** Hooks enforce standards before commits/pushes

---

## 1. Branch Strategy

### 1.1 Branch Types

**Main branches:**
```
main              # Production-ready code (protected)
develop           # Integration branch for features (if using GitFlow)
```

**Feature branches:**
```
feature/flow-submissions        # New features
feature/clubhouse-upload
feature/ai-coach-waitlist
```

**Fix branches:**
```
fix/login-redirect-bug          # Bug fixes
fix/image-upload-timeout
```

**Chore branches:**
```
chore/update-dependencies       # Maintenance tasks
chore/refactor-api-routes
```

**Documentation branches:**
```
docs/add-api-documentation      # Documentation updates
docs/update-readme
```

### 1.2 Branch Naming

**Use lowercase with hyphens:**
```bash
# ✅ Good
git checkout -b feature/flow-real-time-updates
git checkout -b fix/toast-notification-position

# ❌ Bad
git checkout -b Feature/FlowRealTimeUpdates
git checkout -b fix_toast_notification
```

**Include ticket number if using issue tracker:**
```bash
# ✅ Good (with GitHub issue number)
git checkout -b feature/123-flow-pagination
git checkout -b fix/456-broken-auth-redirect
```

### 1.3 Branch Lifecycle

**Create feature branch from main:**
```bash
# ✅ Good workflow
git checkout main
git pull origin main
git checkout -b feature/flow-real-time-updates

# Work on feature...
git add .
git commit -m "Add real-time subscription to Flow wall"

# Push to remote
git push -u origin feature/flow-real-time-updates

# Create PR when ready
gh pr create --title "Add real-time updates to Flow wall" --body "..."
```

**Delete branch after merge:**
```bash
# After PR is merged
git checkout main
git pull origin main
git branch -d feature/flow-real-time-updates  # Delete local branch
```

---

## 2. Commit Messages

### 2.1 Commit Message Format

**Use conventional commit format:**
```
<type>(<scope>): <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code formatting (no logic change)
refactor: Code restructuring (no behavior change)
test:     Adding or updating tests
chore:    Build process, dependencies, tooling
perf:     Performance improvements
```

**Examples:**
```bash
# ✅ Good (feature)
git commit -m "feat(flow): add real-time subscription to wall"

# ✅ Good (fix with body)
git commit -m "fix(auth): resolve redirect loop on login

Users were stuck in infinite redirect when accessing /dashboard
after login. Changed redirect logic to use absolute URL instead
of relative path.

Closes #123"

# ✅ Good (chore)
git commit -m "chore: update dependencies to latest versions"

# ❌ Bad (vague)
git commit -m "fix stuff"
git commit -m "updates"
git commit -m "WIP"
```

### 2.2 Commit Message Best Practices

**Use imperative mood (not past tense):**
```bash
# ✅ Good (imperative: "do this")
git commit -m "feat(flow): add vibe tag filtering"
git commit -m "fix(auth): handle expired session gracefully"

# ❌ Bad (past tense)
git commit -m "feat(flow): added vibe tag filtering"
git commit -m "fix(auth): handled expired session"
```

**Keep subject line under 72 characters:**
```bash
# ✅ Good
git commit -m "feat(clubhouse): add media upload with drag-and-drop"

# ❌ Bad (too long)
git commit -m "feat(clubhouse): add media upload functionality with drag-and-drop support and progress indicators"
```

**Capitalize subject line:**
```bash
# ✅ Good
git commit -m "feat(flow): Add real-time updates"

# ❌ Bad
git commit -m "feat(flow): add real-time updates"
```

**Don't end subject with period:**
```bash
# ✅ Good
git commit -m "fix(auth): Resolve redirect loop"

# ❌ Bad
git commit -m "fix(auth): Resolve redirect loop."
```

### 2.3 Atomic Commits

**One logical change per commit:**
```bash
# ✅ Good (separate commits for separate changes)
git commit -m "feat(flow): Add vibe tag filtering"
git commit -m "feat(flow): Add vibe tag selection UI"
git commit -m "docs(flow): Document vibe tag API"

# ❌ Bad (multiple unrelated changes)
git commit -m "Add vibe tags, fix login bug, update README"
```

**Use `git add -p` for partial staging:**
```bash
# ✅ Good (stage only related changes)
git add -p app/flow/page.tsx  # Stage only vibe tag changes
git commit -m "feat(flow): Add vibe tag filtering"

git add -p app/auth/login/page.tsx  # Stage login fix separately
git commit -m "fix(auth): Resolve redirect loop"
```

---

## 3. Pull Requests

### 3.1 PR Title and Description

**Use same format as commit messages:**
```markdown
# ✅ Good PR title
feat(flow): Add real-time updates to Flow wall

# PR body
## Summary
- Adds Supabase Realtime subscription to Flow wall
- New posts appear automatically without page refresh
- Users see live updates from other runners

## Changes
- Add `useFlowRealtime` hook for subscription management
- Update `FlowWall` component to handle real-time inserts
- Add connection status indicator

## Test Plan
- [x] New posts appear on wall without refresh
- [x] Multiple users see updates simultaneously
- [x] Connection status updates correctly
- [x] Subscription cleans up on unmount

## Screenshots
[Attach screenshot of live update in action]
```

### 3.2 PR Size Guidelines

**Keep PRs small and focused:**
```
✅ Good:  50-300 lines changed (easy to review)
⚠️ OK:    300-500 lines (larger feature, but still reviewable)
❌ Bad:   500+ lines (too large, split into multiple PRs)
```

**Break large features into smaller PRs:**
```bash
# ✅ Good (3 small PRs)
PR #1: feat(flow): Add database schema for vibe tags
PR #2: feat(flow): Add vibe tag API endpoints
PR #3: feat(flow): Add vibe tag UI components

# ❌ Bad (1 massive PR)
PR #1: feat(flow): Complete vibe tag feature (800 lines changed)
```

### 3.3 PR Review Process

**Request reviews before merging:**
```bash
# ✅ Good (create PR and request review)
gh pr create --title "feat(flow): Add real-time updates" \
  --body "See description above" \
  --reviewer teammate-username

# Wait for approval before merging
gh pr merge --squash  # After approval
```

**Address review comments:**
```bash
# Make requested changes
git add .
git commit -m "refactor(flow): Extract realtime logic to hook"
git push

# PR updates automatically
```

---

## 4. Git Hooks

### 4.1 Pre-Commit Hook

**Run linting and formatting before commit:**
```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run Prettier
npm run format

# Run ESLint
npm run lint

# Run TypeScript type checking
npm run type-check
```

**Install Husky for hooks:**
```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run lint-staged"
```

**Configure lint-staged:**
```json
// package.json
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

### 4.2 Commit-msg Hook

**Enforce conventional commit format:**
```bash
# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate commit message format
npx --no -- commitlint --edit $1
```

**Configure commitlint:**
```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf']
    ],
    'subject-case': [2, 'always', 'sentence-case']
  }
}
```

### 4.3 Pre-Push Hook

**Run tests before pushing:**
```bash
# .husky/pre-push
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run unit tests
npm run test

# Run build to ensure no errors
npm run build
```

---

## 5. Merging Strategies

### 5.1 Squash and Merge (Preferred)

**Use squash merge for feature branches:**
```bash
# ✅ Good (squash multiple commits into one)
gh pr merge --squash

# Result: Clean main branch history
# main: feat(flow): Add real-time updates
#       fix(auth): Resolve redirect loop
#       feat(clubhouse): Add media upload
```

**Why squash?**
- Clean main branch history (one commit per feature)
- Easier to revert entire features
- Removes WIP commits and fixes from history

### 5.2 Merge Commit (For Releases)

**Use merge commit for release branches:**
```bash
# ✅ Good (preserve release history)
git checkout main
git merge --no-ff release/v1.0.0

# Result: Merge commit preserves release branch
```

### 5.3 Rebase (Never on Shared Branches)

**Only rebase local, unpushed commits:**
```bash
# ✅ Good (rebasing local feature branch)
git checkout feature/my-feature
git rebase main  # Update feature branch with latest main

# ❌ Bad (rebasing pushed commits)
git checkout feature/shared-feature  # Other devs working on this
git rebase main
git push --force  # ❌ BREAKS OTHER DEVELOPERS' WORK
```

---

## 6. Tagging and Releases

### 6.1 Version Tagging

**Use semantic versioning:**
```
v1.0.0    # Major.Minor.Patch
v1.1.0    # Minor version (new features)
v1.1.1    # Patch version (bug fixes)
```

**Create annotated tags:**
```bash
# ✅ Good (annotated tag with message)
git tag -a v1.0.0 -m "Release V1: Homepage, Flow, Clubhouse"
git push origin v1.0.0

# ❌ Bad (lightweight tag, no message)
git tag v1.0.0
git push origin v1.0.0
```

### 6.2 GitHub Releases

**Create release from tag:**
```bash
# ✅ Good (create release with notes)
gh release create v1.0.0 \
  --title "RunExpression V1.0.0" \
  --notes "## Features
- Homepage with scroll-driven manifesto
- The Flow (community expression wall)
- DWTC Clubhouse (member archive)
- Shop framework with Stripe integration

## Bug Fixes
- Fixed login redirect loop
- Resolved image upload timeouts"
```

---

## 7. Common Git Commands

### 7.1 Daily Workflow

```bash
# Start work day: Update local main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-feature

# Work and commit
git add .
git commit -m "feat(scope): Add feature"

# Push to remote
git push -u origin feature/my-feature

# Create PR
gh pr create --title "feat(scope): Add feature" --body "..."

# After PR approved and merged
git checkout main
git pull origin main
git branch -d feature/my-feature
```

### 7.2 Fixing Mistakes

**Amend last commit (before push):**
```bash
# ✅ Good (fix last commit message)
git commit --amend -m "feat(flow): Add real-time updates"

# ✅ Good (add forgotten file to last commit)
git add forgotten-file.ts
git commit --amend --no-edit
```

**Undo last commit (keep changes):**
```bash
# ✅ Good (undo commit, keep changes staged)
git reset --soft HEAD~1

# ✅ Good (undo commit, keep changes unstaged)
git reset HEAD~1
```

**Discard local changes:**
```bash
# ✅ Good (discard changes in specific file)
git checkout -- path/to/file.ts

# ✅ Good (discard all local changes)
git reset --hard HEAD
```

### 7.3 Viewing History

```bash
# View commit history
git log --oneline --graph --all

# View changes in last commit
git show HEAD

# View changes between commits
git diff main..feature/my-feature

# View who changed a line
git blame path/to/file.ts
```

---

## 8. .gitignore Best Practices

### 8.1 What to Ignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/
build/

# Environment variables
.env*.local
.env.production

# Testing
coverage/
.nyc_output

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Supabase
.supabase/

# ✅ DO commit:
.env.example       # Template for environment variables
.vscode/settings.json  # Shared VS Code settings (if desired)
```

### 8.2 Never Commit Secrets

```bash
# ❌ Bad (secrets committed)
git add .env.local
git commit -m "Add environment variables"

# ✅ Good (secrets ignored, template committed)
# .gitignore contains: .env*.local
git add .env.example
git commit -m "docs: Add environment variable template"
```

**If secrets accidentally committed:**
```bash
# Remove secret from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (coordinate with team first!)
git push origin --force --all

# Rotate compromised secrets immediately!
```

---

## 9. Collaboration Best Practices

### 9.1 Sync Frequently

```bash
# ✅ Good (sync with main daily)
git checkout main
git pull origin main
git checkout feature/my-feature
git rebase main  # Or merge main into feature branch
```

### 9.2 Communicate Changes

**Use PR descriptions to explain context:**
```markdown
## Why this change?
Users were experiencing timeout errors when uploading large images (>5MB).

## What changed?
- Add client-side image compression using compressorjs
- Compress to max 1920px width, 0.8 quality
- Show upload progress indicator

## How to test?
1. Upload image >5MB
2. Verify it compresses to <500KB
3. Check upload completes without timeout
```

### 9.3 Review Others' Code

**Provide constructive feedback:**
```markdown
# ✅ Good review comments
"This looks great! One suggestion: could we extract this validation logic into a reusable function?"

"I'm concerned about performance here. What if we memoize this computation?"

"Approved! Love the clean separation of concerns."

# ❌ Bad review comments
"This is wrong."
"Why did you do it this way?"
```

---

## 10. Emergency Procedures

### 10.1 Reverting a Bad Merge

```bash
# ✅ Good (revert merge commit)
git revert -m 1 <merge-commit-hash>
git push origin main
```

### 10.2 Hotfix Workflow

```bash
# Critical bug in production
git checkout main
git pull origin main
git checkout -b hotfix/critical-login-bug

# Fix bug
git add .
git commit -m "fix(auth): Resolve critical login bug"

# Push and create PR
git push -u origin hotfix/critical-login-bug
gh pr create --title "HOTFIX: Resolve critical login bug" --body "..."

# Fast-track review and merge
gh pr merge --squash

# Tag hotfix release
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Hotfix: Critical login bug"
git push origin v1.0.1
```

---

## Change Log

| Date       | Changes                                      | Author           |
|------------|----------------------------------------------|------------------|
| 2025-12-14 | Initial Git workflow document created        | Engineering Team |

---

## References

- **Conventional Commits:** https://www.conventionalcommits.org/
- **Git Documentation:** https://git-scm.com/doc
- **GitHub Flow:** https://docs.github.com/en/get-started/quickstart/github-flow
- **Semantic Versioning:** https://semver.org/
- **Husky:** https://typicode.github.io/husky/
- **Related Docs:** [07-CODING-STANDARDS.md](./07-CODING-STANDARDS.md), [05-IMPLEMENTATION-PLAN.md](./05-IMPLEMENTATION-PLAN.md)
