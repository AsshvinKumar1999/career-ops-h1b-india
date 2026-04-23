# Career-Ops File Reference

Complete guide to every file in the career-ops directory. Understanding what each file does helps you customize and maintain the system effectively.

---

## Root Directory Files

### Configuration Files

| File | Purpose | User Editable |
|------|---------|---------------|
| `cv.md` | Your CV/resume in markdown format | **Yes** - Main source of truth for your profile |
| `article-digest.md` | Compact proof points from your portfolio/work | Yes - Add achievements, metrics, case studies |
| `portals.yml` | Job portal scanner configuration (companies, queries, filters) | Yes - Customize companies to track |
| `config/profile.yml` | Your personal profile (name, email, target roles, comp) | Yes - Keep updated with current info |
| `modes/_profile.md` | Your customization layer (archetypes, narrative, superpowers) | Yes - Personalization for evaluations |

### Data Files (User Layer)

| File | Purpose |
|------|---------|
| `data/applications.md` | Application tracker - all jobs you've applied to |
| `data/pipeline.md` | Pending URLs inbox - jobs to evaluate |
| `data/scan-history.tsv` | All URLs ever scanned with timestamps |
| `data/follow-ups.md` | Follow-up history tracker |

### Generated Files

| File | Purpose |
|------|---------|
| `reports/*.md` | Evaluation reports (numbered: 001-xxx) |
| `jds/*.md` | Job descriptions saved locally |
| `output/*.pdf` | Generated CV PDFs |
| `data/h1b-categories/*.tsv` | H1B company database by category |
| `data/h1b-batches/*.json` | Batch files for parallel scanning |

---

## Modes Directory (`modes/`)

Modes are instruction files that tell Claude Code how to handle different tasks. Each mode contains detailed workflow instructions.

### Core Modes

| File | Mode Name | Trigger | What It Does |
|------|----------|---------|--------------|
| `auto-pipeline.md` | auto-pipeline | Paste JD/URL | Complete evaluation: score + report + PDF + tracker entry |
| `oferta.md` | oferta | Evaluate offer | A-F scoring (10 weighted dimensions) |
| `ofertas.md` | ofertas | Compare offers | Multi-offer comparison and ranking |
| `contacto.md` | contacto | LinkedIn outreach | Find contacts + draft outreach messages |
| `deep.md` | deep | Company research | Deep research on company, team, tech stack |
| `interview-prep.md` | interview-prep | Interview prep | Company-specific STAR+R stories + intel |
| `pdf.md` | pdf | Generate PDF | ATS-optimized CV PDF generation |
| `training.md` | training | Evaluate course | Course/cert evaluation against your goals |
| `project.md` | project | Evaluate project | Portfolio project idea evaluation |
| `tracker.md` | tracker | Application status | Pipeline overview and statistics |
| `apply.md` | apply | Application form | Live application assistant |
| `scan.md` | scan | Portal scan | Scan portals.yml for new offers |
| `h1b-scan.md` | h1b-scan | H1B scan | Scan H1B company database |
| `pipeline.md` | pipeline | Process URLs | Evaluate pending URLs from inbox |
| `batch.md` | batch | Batch process | Parallel batch evaluation |
| `patterns.md` | patterns | Rejection patterns | Analyze patterns + improve targeting |
| `followup.md` | followup | Follow-up | Follow-up cadence calculator |
| `_shared.md` | (system) | (shared) | System context and shared rules for all modes |
| `_profile.md` | (user) | (shared) | Your personalization (archetypes, narrative) |

### Mode Files Reference

#### `auto-pipeline.md`
**Purpose:** Complete job evaluation workflow
**Triggers:** Paste a job URL or JD
**What it does:**
1. Navigate to URL with Playwright
2. Extract job description
3. Run oferta evaluation (A-F scoring)
4. Generate tailored PDF CV
5. Add to tracker

#### `oferta.md`
**Purpose:** Structured job offer evaluation
**Triggers:** "evaluate offer", "score this job"
**What it does:** 10-dimension A-F scoring:
- Block A: Role summary
- Block B: CV match analysis
- Block C: Level strategy
- Block D: Compensation research
- Block E: Personalization vectors
- Block F: Interview prep (STAR+R)
- Block G: Posting legitimacy

#### `ofertas.md`
**Purpose:** Compare multiple offers
**Triggers:** "compare offers", "rank these jobs"
**What it does:** Side-by-side comparison of multiple offers with scoring

#### `contacto.md`
**Purpose:** LinkedIn outreach automation
**Triggers:** "find contact", "LinkedIn outreach"
**What it does:**
1. Find relevant contacts at target company
2. Research their background
3. Draft personalized outreach message

#### `deep.md`
**Purpose:** Deep company research
**Triggers:** "research company", "deep dive"
**What it does:**
1. Company overview (size, funding, stage)
2. Tech stack analysis
3. Team structure
4. Recent news/press
5. Glassdoor/company culture

#### `interview-prep.md`
**Purpose:** Interview preparation
**Triggers:** "prepare for interview", "interview prep"
**What it does:**
1. Pull company-specific intel
2. Generate STAR+R stories
3. Anticipate questions
4. Prepare questions to ask

#### `pdf.md`
**Purpose:** CV PDF generation
**Triggers:** "generate PDF", "create CV"
**What it does:**
1. Read cv.md + job description
2. Inject keywords for ATS
3. Generate HTML → PDF via Playwright

#### `training.md`
**Purpose:** Evaluate courses/certs
**Triggers:** "evaluate course", "is this worth it"
**What it does:** Assess course value against career goals

#### `project.md`
**Purpose:** Portfolio project evaluation
**Triggers:** "evaluate project", "should I build this"
**What it does:** Evaluate project ideas against market needs

#### `tracker.md`
**Purpose:** Application status overview
**Triggers:** "show applications", "tracker status"
**What it does:** Display pipeline statistics and status

#### `apply.md`
**Purpose:** Application form assistant
**Triggers:** "help me apply", "fill form"
**What it does:** Walk through application forms interactively

#### `scan.md`
**Purpose:** Portal scanning
**Triggers:** "scan portals", "find jobs"
**What it does:**
1. Read portals.yml configuration
2. Navigate to career pages
3. Extract job listings
4. Filter by title keywords
5. Add to pipeline

#### `h1b-scan.md`
**Purpose:** H1B company database scanning
**Triggers:** "scan H1B", "h1b companies"
**What it does:**
1. Read H1B company TSV files
2. Generate career URLs
3. Scan by category
4. Parallel processing support

#### `pipeline.md`
**Purpose:** Process pending URLs
**Triggers:** "process pipeline", "evaluate pending"
**What it does:**
1. Read pipeline.md pending URLs
2. Navigate each URL
3. Generate evaluation
4. Update tracker

#### `batch.md`
**Purpose:** Batch processing
**Triggers:** "batch evaluate", "process batch"
**What it does:** Parallel evaluation with Claude Code agents

#### `patterns.md`
**Purpose:** Rejection pattern analysis
**Triggers:** "analyze patterns", "why rejected"
**What it does:**
1. Analyze rejection patterns
2. Identify gaps
3. Suggest targeting improvements

#### `followup.md`
**Purpose:** Follow-up cadence
**Triggers:** "follow up", "application cadence"
**What it does:** Calculate optimal follow-up timing

#### `_shared.md`
**Purpose:** System-wide shared context
**What it does:** Contains shared rules, scoring definitions, state machine for all modes

#### `_profile.md`
**Purpose:** User personalization layer
**What it does:** Your archetypes, narrative, superpowers, proof points

---

## Scripts Directory (`*.mjs`)

Executable Node.js scripts for automation.

| Script | Purpose | Usage |
|--------|---------|-------|
| `doctor.mjs` | System health check | `node doctor.mjs` |
| `verify-pipeline.mjs` | Verify pipeline integrity | `node verify-pipeline.mjs` |
| `normalize-statuses.mjs` | Normalize application statuses | `node normalize-statuses.mjs` |
| `dedup-tracker.mjs` | Deduplicate applications | `node dedup-tracker.mjs` |
| `merge-tracker.mjs` | Merge tracker additions | `node merge-tracker.mjs` |
| `generate-pdf.mjs` | Generate CV PDF | `node generate-pdf.mjs` |
| `cv-sync-check.mjs` | Check CV alignment | `node cv-sync-check.mjs` |
| `update-system.mjs` | System update management | `node update-system.mjs check/apply/rollback` |
| `check-liveness.mjs` | Job posting liveness check | `node check-liveness.mjs` |
| `scan.mjs` | Portal scanner (portals.yml) | `node scan.mjs` |
| `scan-h1b.mjs` | H1B scanner (basic) | `node scan-h1b.mjs --category tech` |
| `scan-h1b-parallel.mjs` | H1B parallel scanner | `node scan-h1b-parallel.mjs --dispatch` |
| `analyze-patterns.mjs` | Pattern analysis | `node analyze-patterns.mjs` |
| `followup-cadence.mjs` | Follow-up calculator | `node followup-cadence.mjs` |
| `extract-jds.mjs` | Extract job descriptions | `node extract-jds.mjs` |

---

## Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation |
| `SETUP_GUIDE.md` | Step-by-step setup and command reference |
| `CLAUDE.md` | Claude Code instructions and skill modes |
| `AGENTS.md` | Agent configuration |
| `DATA_CONTRACT.md` | User layer vs system layer definitions |
| `CHANGELOG.md` | Version history |
| `CODE_OF_CONDUCT.md` | Community guidelines |
| `CONTRIBUTING.md` | How to contribute |
| `GOVERNANCE.md` | Project governance |
| `LEGAL_DISCLAIMER.md` | Legal disclaimers |
| `SECURITY.md` | Security policy |
| `SUPPORT.md` | How to get help |

---

## Directories Reference

### `config/`
```
config/
└── profile.yml          # Your personal configuration
```

### `modes/`
```
modes/
├── _shared.md           # Shared system context
├── _profile.md          # Your personalization
├── _profile.template.md # Template for new users
├── oferta.md            # Job evaluation mode
├── ofertas.md           # Multi-offer comparison
├── auto-pipeline.md     # Complete evaluation flow
├── apply.md             # Application assistant
├── batch.md             # Batch processing
├── contacto.md         # LinkedIn outreach
├── deep.md              # Company research
├── followup.md          # Follow-up tracker
├── h1b-scan.md         # H1B database scanning
├── interview-prep.md    # Interview preparation
├── patterns.md         # Rejection analysis
├── pdf.md               # PDF generation
├── pipeline.md         # URL processing
├── project.md          # Project evaluation
├── scan.md              # Portal scanning
├── tracker.md           # Application tracker
└── training.md          # Course evaluation
```

### `data/`
```
data/
├── applications.md       # Application tracker table
├── pipeline.md          # Pending URLs inbox
├── scan-history.tsv     # All scanned URLs
├── follow-ups.md        # Follow-up history
├── h1b-categories/     # H1B company database
│   ├── h1b-all-companies.tsv
│   ├── h1b-tech.tsv
│   ├── h1b-manufacturing.tsv
│   └── ... (16 categories)
├── h1b-batches/        # Batch files for parallel scanning
│   ├── batch-000.json
│   ├── batch-001.json
│   └── ...
└── (other data files)
```

### `reports/`
```
reports/
├── 001-celonis-2026-04-13.md
├── 002-spotify-2026-04-14.md
└── ...
```
Numbered evaluation reports with format: `{###}-{company-slug}-{YYYY-MM-DD}.md`

### `templates/`
```
templates/
├── cv-template.html     # HTML template for CVs
└── states.yml           # Canonical application states
```

### `batch/`
```
batch/
├── README.md
├── batch-prompt.md
├── tracker-additions/   # Batch evaluation results
└── ...
```

### `docs/`
```
docs/
├── ARCHITECTURE.md      # System architecture
├── CODEX.md            # Codex integration
├── CUSTOMIZATION.md    # Customization guide
├── SCRIPTS.md          # Script documentation
└── SETUP.md            # Setup documentation
```

### `examples/`
```
examples/
├── README.md
├── article-digest-example.md
├── ats-normalization-test.md
├── cv-example.md
├── sample-report.md
└── dual-track-engineer-instructor/
```

### `dashboard/`
Terminal UI dashboard for browsing pipeline.

### `node_modules/`
npm dependencies (do not edit).

---

## Data Flow

```
portals.yml / scan-h1b.mjs
        ↓
   scan.mjs / scan-h1b-parallel.mjs
        ↓
   data/pipeline.md (pending URLs)
        ↓
   Claude Code evaluates (modes/)
        ↓
   reports/*.md (evaluation)
        ↓
   generate-pdf.mjs (CV PDF)
        ↓
   data/applications.md (tracker)
```

---

## File Priority (What to Edit)

### For Personalization (User Layer)
| File | What to Customize |
|------|-------------------|
| `cv.md` | Your resume content |
| `config/profile.yml` | Your profile info |
| `modes/_profile.md` | Your archetypes, narrative |
| `portals.yml` | Companies to track |
| `article-digest.md` | Your proof points |
| `data/applications.md` | Your application status |

### For System Updates (Auto-updatable)
| File | Do NOT Edit Directly |
|------|---------------------|
| `modes/*.md` (except _profile.md) | System modes |
| `*.mjs` scripts | Core scripts |
| `templates/*` | Templates |
| `batch/*` | Batch processing |
| `CLAUDE.md` | System instructions |
| `docs/*` | Documentation |

---

## Canonical Statuses

Defined in `templates/states.yml`:

| Status | When to Use |
|--------|-------------|
| `Evaluated` | Report completed, pending decision |
| `Applied` | Application sent |
| `Responded` | Company responded |
| `Interview` | In interview process |
| `Offer` | Offer received |
| `Rejected` | Rejected by company |
| `Discarded` | Discarded by you or offer closed |
| `SKIP` | Doesn't fit, don't apply |
