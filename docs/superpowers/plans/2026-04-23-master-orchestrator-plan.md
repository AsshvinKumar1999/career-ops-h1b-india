# Master Orchestrator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a persistent job search orchestrator agent that manages the complete job search lifecycle from onboarding to learning.

**Architecture:** Single persistent agent with 8 phases (0-7) coordinated by `modes/orchestrate.md`. State persisted to `data/orchestration-state.json`. Geographic preference determines scan priority order. Each phase is a separate mode file.

**Tech Stack:** Node.js (mjs modules), Claude Code modes, JSON state file

---

## New Files to Create

| File | Purpose |
|------|---------|
| `modes/orchestrate.md` | Master orchestrator (persistent agent) |
| `modes/onboarding.md` | Phase 1 CV + profile collection |
| `modes/research.md` | Phase 2 keyword research |
| `modes/apply-workflow.md` | Phase 4 apply logic |
| `modes/networking.md` | Phase 5 LinkedIn |
| `modes/gmail-tracking.md` | Phase 6 Gmail |
| `modes/learning.md` | Phase 7 learning engine |
| `data/orchestration-state.json` | Persistent state |
| `scripts/orchestrate-state.mjs` | State utilities |

---

## Task 1: Orchestration State Schema + Utilities

**Files:**
- Create: `data/orchestration-state.json`
- Create: `scripts/orchestrate-state.mjs`

- [ ] **Step 1: Create orchestration-state.json with initial empty state**

```json
{
  "session_id": "",
  "created_at": "",
  "phase": 0,
  "preferences": {
    "geography": "BOTH",
    "h1b_priority": true,
    "india_companies": true
  },
  "profile": {
    "name": "",
    "cv_verified": false,
    "target_roles": [],
    "target_cities": [],
    "profile_complete": false
  },
  "learnings": {
    "keywords_that_work": [],
    "keywords_that_dont": [],
    "companies_that_respond": [],
    "companies_that_dont": [],
    "message_templates_that_work": [],
    "response_rate_by_keyword": {},
    "response_rate_by_company": {}
  },
  "stats": {
    "total_scanned": 0,
    "total_evaluated": 0,
    "total_applications": 0,
    "auto_submitted": 0,
    "response_rate": 0,
    "interview_rate": 0,
    "last_updated": ""
  }
}
```

- [ ] **Step 2: Create scripts/orchestrate-state.mjs with utility functions**

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, '..', 'data', 'orchestration-state.json');

export function readState() {
  if (!fs.existsSync(STATE_FILE)) return null;
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
}

export function writeState(state) {
  state.last_updated = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

export function initState() {
  const state = readState();
  if (state) return state;

  const newState = {
    session_id: uuidv4(),
    created_at: new Date().toISOString(),
    phase: 0,
    preferences: { geography: 'BOTH', h1b_priority: true, india_companies: true },
    profile: { name: '', cv_verified: false, target_roles: [], target_cities: [], profile_complete: false },
    learnings: { keywords_that_work: [], keywords_that_dont: [], companies_that_respond: [], companies_that_dont: [], message_templates_that_work: [], response_rate_by_keyword: {}, response_rate_by_company: {} },
    stats: { total_scanned: 0, total_evaluated: 0, total_applications: 0, auto_submitted: 0, response_rate: 0, interview_rate: 0, last_updated: new Date().toISOString() }
  };
  writeState(newState);
  return newState;
}

export function updatePhase(phase) {
  const state = readState();
  state.phase = phase;
  writeState(state);
  return state;
}

export function updatePreferences(prefs) {
  const state = readState();
  state.preferences = { ...state.preferences, ...prefs };
  writeState(state);
  return state;
}

export function updateProfile(profile) {
  const state = readState();
  state.profile = { ...state.profile, ...profile };
  writeState(state);
  return state;
}

export function updateStats(stats) {
  const state = readState();
  state.stats = { ...state.stats, ...stats };
  writeState(state);
  return state;
}

export function updateLearnings(learnings) {
  const state = readState();
  state.learnings = { ...state.learnings, ...learnings };
  writeState(state);
  return state;
}

export function getPhase() {
  const state = readState();
  return state ? state.phase : 0;
}

export function resetState() {
  if (fs.existsSync(STATE_FILE)) {
    fs.unlinkSync(STATE_FILE);
  }
  return initState();
}
```

- [ ] **Step 3: Test the utilities work**

Run: `node -e "import('./scripts/orchestrate-state.mjs').then(m => { const s = m.initState(); console.log('Session:', s.session_id); console.log('Phase:', s.phase); })"`

- [ ] **Step 4: Commit**

```bash
git add data/orchestration-state.json scripts/orchestrate-state.mjs
git commit -m "feat: add orchestration state schema and utilities"
```

---

## Task 2: Master Orchestrator Mode

**Files:**
- Create: `modes/orchestrate.md`

- [ ] **Step 1: Create modes/orchestrate.md**

```markdown
# Orchestrate Mode — Master Job Search Orchestrator

## Overview

Persistent orchestrator that manages the complete job search lifecycle from onboarding to learning. Triggered via `/career-ops start`.

## State

Reads from `data/orchestration-state.json` via `scripts/orchestrate-state.mjs`.

## Phase 0: Geography Selection

**Trigger:** `/career-ops start` or phase === 0

Ask the user:
> "Where do you want to work?"
- A) US only (H1B first → US other)
- B) India only
- C) Both US + India

Set preferences:
- US only: `h1b_priority: true`, `india_companies: false`
- India only: `h1b_priority: false`, `india_companies: true`
- Both: `h1b_priority: true`, `india_companies: true`

Transition to Phase 1.

## Phase 1: Onboarding

**Trigger:** First run or `profile_complete: false`

Delegate to `onboarding.md` mode.

## Phase 2: Research

**Trigger:** After onboarding, or `keywords_need_update: true`

Delegate to `research.md` mode.

## Phase 3: Scan

**Trigger:** `/career-ops scan` or automatic after research

Based on `preferences.geography`:
- **US only:** Scan h1b-categories/ + scan.mjs for non-H1B US
- **India only:** Run scan-india.mjs
- **Both:** H1B → India → US other (combined)

Tag each URL with source: `H1B-US`, `INDIA`, `US-OTHER`.

Add to `data/pipeline.md`.

Update stats.total_scanned.

## Phase 4: Apply

**Trigger:** `/career-ops apply` or pipeline is full

For each role in pipeline:
1. Evaluate via `oferta.md` mode
2. Get score (1-5)
3. **Score >= 4.2:** Auto-generate PDF + auto-submit
4. **Score 4.0-4.2:** Generate PDF, ask for approval
5. **Score < 4.0:** Skip

Update `data/applications.md` tracker.
Update stats.total_applications and stats.auto_submitted.

## Phase 5: Networking

**Trigger:** `/career-ops network` or after applying

Delegate to `networking.md` mode.

## Phase 6: Gmail Tracking

**Trigger:** `/career-ops gmail` or scheduled

Delegate to `gmail-tracking.md` mode.

## Phase 7: Learning Engine

**Trigger:** After each application cycle or `/career-ops learn`

Delegate to `learning.md` mode.

## Commands

| Command | Phase | What it does |
|---------|-------|-------------|
| `/career-ops start` | 0 | Begin, ask geography |
| `/career-ops status` | any | Show state + stats |
| `/career-ops onboard` | 1 | Run onboarding |
| `/career-ops research` | 2 | Research keywords |
| `/career-ops scan` | 3 | Scan portals |
| `/career-ops apply` | 4 | Apply to roles |
| `/career-ops network` | 5 | LinkedIn networking |
| `/career-ops gmail` | 6 | Sync Gmail |
| `/career-ops learn` | 7 | Show learnings |
| `/career-ops continue` | any | Resume workflow |
```

- [ ] **Step 2: Commit**

```bash
git add modes/orchestrate.md
git commit -m "feat: add master orchestrator mode"
```

---

## Task 3: Onboarding Mode

**Files:**
- Create: `modes/onboarding.md`

- [ ] **Step 1: Create modes/onboarding.md**

```markdown
# Onboarding Mode — Phase 1

## Overview

Collects user CV, profile details, target roles, and cities to personalize the job search.

## Collect In Order

### 1. CV

Ask:
> "I need your CV to personalize applications. You can:
> 1. Paste your CV here (markdown)
> 2. Give me your LinkedIn URL
> 3. Tell me about your experience and I'll draft it
>
> Which do you prefer?"

Create/update `cv.md` with the canonical CV.

### 2. Profile Details

Ask:
- Full name and email
- Current location (city, country)
- Target compensation range (USD for US, INR for India)

Update `config/profile.yml`.

### 3. Target Roles

Ask:
> "What roles are you targeting?" (e.g., Marketing Ops, AI Operations, RevOps)

Confirm or add new roles.
Update `config/profile.yml` with `target_roles`.

### 4. Target Cities

Based on geography preference:
- **US:** Ask for US cities (SF, NYC, Austin, Seattle, etc.)
- **India:** Ask for Indian cities (Bangalore, Mumbai, Hyderabad, etc.)
- **Both:** Ask for both

Update `config/profile.yml` with `target_cities`.

## State Update

After onboarding complete:
```javascript
{
  phase: 1,
  profile: {
    name: "...",
    cv_verified: true,
    target_roles: [...],
    target_cities: [...],
    profile_complete: true
  }
}
```

Transition to Phase 2 (Research).
```

- [ ] **Step 2: Commit**

```bash
git add modes/onboarding.md
git commit -m "feat: add onboarding mode"
```

---

## Task 4: Research Mode

**Files:**
- Create: `modes/research.md`

- [ ] **Step 1: Create modes/research.md**

```markdown
# Research Mode — Phase 2

## Overview

Researches market keywords for target roles by analyzing competitor postings.

## Workflow

1. Search market for target role keywords
2. Analyze top 20 job postings in target roles
3. Identify emerging keywords and variants
4. Update `portals.yml` with optimized keywords

## Keywords to Research

**Primary:**
- Marketing Operations / MarTech / RevOps
- AI Operations / AI Ops / LLMOps / Agentic
- Solutions Engineer / Implementation Engineer

**India variants:**
- Growth Lead, Growth Manager
- Operations Lead, Operations Manager
- Business Development Operations
- Marketing Technology / MarTech

## Output

- Updated `portals.yml` with researched keywords
- Learn which keywords resonate in market
- Store findings in `learnings.keywords_that_work`

## Transition

After research, transition to Phase 3 (Scan).
```

- [ ] **Step 2: Commit**

```bash
git add modes/research.md
git commit -m "feat: add research mode"
```

---

## Task 5: Apply Workflow Mode

**Files:**
- Create: `modes/apply-workflow.md`

- [ ] **Step 1: Create modes/apply-workflow.md**

```markdown
# Apply Workflow Mode — Phase 4

## Overview

Evaluates roles in pipeline and handles CV generation + submission based on score.

## Workflow

For each role in `data/pipeline.md`:
1. Run `oferta.md` evaluation
2. Get score (1-5)

### Score Thresholds

| Score | Action |
|-------|--------|
| >= 4.2 | Auto-generate PDF + auto-submit |
| 4.0-4.2 | Generate PDF, ask for approval before submit |
| < 4.0 | Skip (don't apply) |

### Auto-Submit Threshold: 4.2/5

## Output

- PDF generated to `output/`
- Tracker updated (`data/applications.md`)
- State stats updated:
  - `stats.total_applications++`
  - `stats.auto_submitted++` (if auto-submitted)

## Pipeline Entry Format

Tags in pipeline:
```
- [ ] https://jobs.url (H1B-US - CompanyName)
- [ ] https://jobs.url (INDIA - CompanyName)
- [ ] https://jobs.url (US-OTHER - CompanyName)
```

## Transition

After applying, user can go to Phase 5 (Networking) or Phase 6 (Gmail).
```

- [ ] **Step 2: Commit**

```bash
git add modes/apply-workflow.md
git commit -m "feat: add apply workflow mode"
```

---

## Task 6: Networking Mode

**Files:**
- Create: `modes/networking.md`

- [ ] **Step 1: Create modes/networking.md**

```markdown
# Networking Mode — Phase 5

## Overview

Find LinkedIn contacts at target companies and draft personalized connection messages.

## Workflow

For each company user has applied to or is interested in:
1. Find LinkedIn contacts (2nd/3rd degree connections)
2. Research contact background
3. Draft personalized connection message

## Message Template Variables

| Variable | Description |
|----------|-------------|
| `{{contact_name}}` | First name |
| `{{company_name}}` | Company they're at |
| `{{shared_connection}}` | Mutual connection (if any) |
| `{{your_achievement}}` | Relevant proof point |
| `{{role_target}}` | Role you're targeting |

## Approval Flow

1. Present draft messages for user approval
2. User reviews and approves
3. Send after approval (NEVER auto-send)

## Message Templates

**Short template (50 words):**
```
Hi {{contact_name}}, I noticed you work at {{company_name}} and share interest in AI operations. I'm targeting {{role_target}} roles and have experience building automation that delivered {{your_achievement}}. Would love to connect and learn more about your team.
```

**With mutual connection:**
```
Hi {{contact_name}}, {{shared_connection}} suggested I reach out. I'm a Marketing Ops professional focused on AI Operations, targeting roles at {{company_name}}. My background includes {{your_achievement}}. Would appreciate connecting to learn more about opportunities there.
```

## Transition

After networking, go to Phase 6 (Gmail) or Phase 7 (Learning).
```

- [ ] **Step 2: Commit**

```bash
git add modes/networking.md
git commit -m "feat: add networking mode"
```

---

## Task 7: Gmail Tracking Mode

**Files:**
- Create: `modes/gmail-tracking.md`

- [ ] **Step 1: Create modes/gmail-tracking.md**

```markdown
# Gmail Tracking Mode — Phase 6

## Overview

Connects to Gmail API, tracks responses from applied companies, and updates the application tracker.

## OAuth Setup (One-time)

1. User authorizes via Google OAuth
2. Credentials stored securely in `data/gmail-credentials.json`
3. Subsequent runs use stored tokens

## Workflow

1. Connect to Gmail API using stored credentials
2. Search for emails from companies in `data/applications.md`
3. Categorize responses:
   - `INTERVIEW` — Request for interview
   - `REJECTION` — Rejection email
   - `OFFER` — Offer received
   - `OTHER` — General response
4. Update tracker statuses automatically

## Categorization Keywords

**INTERVIEW:** "interview", "phone screen", "video call", "chat", "schedule", "availability"
**REJECTION:** "unfortunately", "not moving forward", "other candidates", "filled"
**OFFER:** "offer", "congratulations", "extended an offer", "compensation"
**OTHER:** everything else

## State Update

```json
{
  "stats": {
    "response_rate": 0.23,
    "interview_rate": 0.08,
    "last_gmail_sync": "ISO date"
  }
}
```

## Transition

After Gmail sync, go to Phase 7 (Learning).
```

- [ ] **Step 2: Commit**

```bash
git add modes/gmail-tracking.md
git commit -m "feat: add gmail tracking mode"
```

---

## Task 8: Learning Mode

**Files:**
- Create: `modes/learning.md`

- [ ] **Step 1: Create modes/learning.md**

```markdown
# Learning Mode — Phase 7

## Overview

Analyzes patterns from application history to improve future targeting and messaging.

## What Gets Learned

| Category | Tracking |
|----------|----------|
| Keywords | Which CV keywords get responses |
| Companies | Which companies reply vs ignore |
| Messages | Which LinkedIn templates get accepted |
| Timing | When you get fastest responses |
| Compensation | Which offers are negotiable |

## Data Sources

- `data/applications.md` — Application history
- `data/pipeline.md` — Pipeline history
- Gmail sync data — Response patterns

## Learnings Output

```json
{
  "learnings": {
    "keywords_that_work": ["AI Operations", "RevOps"],
    "keywords_that_dont": ["Marketing Operations"],
    "companies_that_respond": ["Stripe", "Razorpay", "Coinbase"],
    "companies_that_dont": ["Amazon", "Google"],
    "best_message_templates": ["Short (50 words) + specific metric"],
    "response_rate_by_keyword": {
      "AI Operations": 0.31,
      "RevOps": 0.27
    }
  }
}
```

## Storage

Updates `modes/_profile.md` with learnings section at the bottom:
```markdown
## Learnings

### Keywords That Work
- AI Operations (31% response rate)
- RevOps (27% response rate)

### Keywords That Don't
- Marketing Operations

### Companies That Respond
- Stripe, Razorpay, Coinbase

### Companies That Don't
- Amazon, Google

### Best Message Templates
- Short (50 words) + specific metric
```

## Transition

After learning, cycle back to Phase 3 (Scan) for next iteration.
```

- [ ] **Step 2: Commit**

```bash
git add modes/learning.md
git commit -m "feat: add learning mode"
```

---

## Task 9: Update CLAUDE.md with Orchestrator Commands

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add orchestrator commands to CLAUDE.md skill modes table**

Add to the skill modes table:
```
| Starts orchestrator | `orchestrate` |
```

Add orchestrator-specific commands to the OpenCode Commands table:
```
| `/career-ops-start` | `/career-ops start` | Begin orchestrator, ask geography |
| `/career-ops-status` | `/career-ops status` | Show state + stats |
| `/career-ops-onboard` | `/career-ops onboard` | Run onboarding |
| `/career-ops-research` | `/career-ops research` | Research keywords |
| `/career-ops-scan` | `/career-ops scan` | Scan portals |
| `/career-ops-apply` | `/career-ops apply` | Apply to roles |
| `/career-ops-network` | `/career-ops network` | LinkedIn networking |
| `/career-ops-gmail` | `/career-ops gmail` | Sync Gmail |
| `/career-ops-learn` | `/career-ops learn` | Show learnings |
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add orchestrator commands to CLAUDE.md"
```

---

## Execution Summary

After all tasks complete:
1. Push to `feat/india-negotiation`
2. Create PR to `main`
3. Use finishing-a-development-branch skill for cleanup
