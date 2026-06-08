# Explain This Commit

**Translate any git diff, commit, or pull request into plain English — for founders, PMs, designers, QA, and everyone else.**

---

## What It Does

Paste a git diff. Get back:

- **One-liner summary** — 5-10 words anyone can understand
- **Executive summary** — what changed, why, what users will notice
- **Business impact** — what customers see differently
- **Risk score (0-100)** — with reasoning
- **Multi-role views** — Founder, PM, QA, Developer (each in their language)
- **Testing checklist** — specific test cases for QA
- **Affected areas** — modules likely impacted
- **Changelog entry** — ready for release notes
- **Commit title suggestion** — conventional-commit style

---

## Why

A typical git diff looks like:

```diff
- const user = await getUser(id)
+ const user = await getCachedUser(id)
```

An engineer understands this. A founder, PM, or QA tester may not.

The real change is: *"User data is now retrieved from cache before hitting the database, improving performance and reducing server load."*

Git shows code. People need meaning.

**Core principle: Never explain code. Explain intent.**

---

## Quick Start

```bash
# Clone
git clone https://github.com/your-username/explain-this-commit.git
cd explain-this-commit

# Install
npm install

# Set your Anthropic API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run database migrations
npx prisma migrate dev

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** SQLite (via Prisma 7 + libSQL adapter)
- **AI:** Anthropic Claude Sonnet 4

---

## Features

- Paste any git diff or GitHub PR URL
- Automatic change type classification (bug fix, feature, refactor, etc.)
- Risk assessment with score and reasoning
- Role-specific explanations (Founder, PM, QA, Developer)
- Test case recommendations
- Regression prediction (affected areas)
- Changelog generator
- Commit title generator
- History dashboard of all analyses
- Dark mode support

---

## API

### POST `/api/analyze`

```json
{ "diff": "git diff here..." }
// Returns: { id, title, oneLiner, stats }
```

### POST `/api/fetch-github`

```json
{ "url": "https://github.com/owner/repo/pull/123" }
// Returns: { diff, prNumber, repo }
```

### GET `/api/report?id=xxx`

Returns the full analysis report.

### GET `/api/history`

Returns recent analyses list.

---

## Open Source

MIT License. Self-hostable. No vendor lock-in.

---

## Vision

"Translate software development into plain English."

Support any code change — git diffs, PRs, Claude Code sessions, Cursor edits, patch files. Build for the broader audience beyond developers: founders, PMs, designers, QA teams, technical writers, customer support, and junior engineers.

---

## License

MIT
