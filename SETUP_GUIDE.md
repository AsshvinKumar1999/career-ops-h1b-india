# Career-Ops Setup & Command Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Initial Setup](#initial-setup)
4. [Core Commands](#core-commands)
5. [H1B Scanner Commands](#h1b-scanner-commands)
6. [Skill Modes Reference](#skill-modes-reference)
7. [Pipeline Workflow](#pipeline-workflow)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** 18+ (for running scripts)
- **npm** (comes with Node.js)
- **Claude Code CLI** ([Install guide](https://docs.anthropic.com/en/docs/claude-code))
- **Playwright** (for PDF generation and browser automation)
- **Git** (for version control)

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/AsshvinKumar1999/career-ops.git
cd career-ops
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Install Playwright (Required for PDF Generation)

```bash
npx playwright install chromium
```

### Step 4: Run Health Check

```bash
npm run doctor
```

Expected output:
```
Career-Ops Health Check
✓ Node.js version OK
✓ npm packages installed
✓ Playwright available
✓ Required files present
```

---

## Initial Setup

### Step 1: Configure Your Profile

```bash
cp config/profile.example.yml config/profile.yml
```

Edit `config/profile.yml` with your details:
- Full name and email
- Location and timezone
- Target roles
- Salary expectations
- LinkedIn, portfolio, GitHub URLs

### Step 2: Add Your CV

Create `cv.md` in the project root:

```markdown
# Your Name
Email: you@example.com | Phone: (555) 123-4567
Location: City, State

## Summary
Brief professional summary...

## Experience
### Job Title @ Company | Start - End
- Achievement 1
- Achievement 2

## Skills
- Skill 1
- Skill 2

## Education
- Degree, University, Year
```

### Step 3: Set Up Job Portals

```bash
cp templates/portals.example.yml portals.yml
```

Edit `portals.yml` to customize:
- Companies to track
- Search queries for job boards
- Title filter keywords

### Step 4: Personalize the System

Open Claude Code in the project:

```bash
claude
```

Tell Claude about yourself:
- "My superpower is..."
- "I'm targeting [role type] roles"
- "My best achievement is..."
- "Deal breakers: ..."

### Step 5: Verify Setup

```bash
npm run verify
```

---

## Core Commands

### Health & Verification

```bash
# Run health check
npm run doctor

# Verify pipeline integrity
npm run verify

# Normalize application statuses
npm run normalize

# Deduplicate tracker
npm run dedup

# Merge tracker additions
npm run merge
```

### CV & PDF

```bash
# Generate ATS-optimized PDF CV
npm run pdf

# Check CV sync status
node cv-sync-check.mjs
```

### Updates

```bash
# Check for career-ops updates
npm run update:check

# Apply updates
npm run update

# Rollback to previous version
npm run rollback
```

### Job Scanning

```bash
# Scan all configured portals
npm run scan

# Scan with dry-run (preview only)
node scan.mjs --dry-run

# Scan specific company
node scan.mjs --company Cohere
```

### Liveness Check

```bash
# Check if job postings are still active
npm run liveness
```

---

## H1B Scanner Commands

The H1B database contains 28,061 companies that sponsor H1B visas. Use this to scan companies by category.

### List Available Categories

```bash
node scan-h1b.mjs --list
```

Output:
```
Available H1B categories:

  agriculture          (168 companies)
  all-companies        (28,062 companies)
  construction         (626 companies)
  education            (1,604 companies)
  energy               (188 companies)
  financial            (1,866 companies)
  healthcare           (2,457 companies)
  hospitality          (214 companies)
  manufacturing        (3,125 companies)
  media                (90 companies)
  professional         (12,867 companies)
  realestate           (274 companies)
  retail               (706 companies)
  tech                 (1,655 companies)
  transportation       (259 companies)
  uncategorized        (1,207 companies)
  wholesale            (771 companies)
```

### Quick Scan (Single Category)

```bash
# Scan tech companies (1,655 companies)
node scan-h1b.mjs --category tech

# Scan manufacturing companies
node scan-h1b.mjs --category manufacturing

# Scan all 28K+ companies
node scan-h1b.mjs --category all-companies
```

### Search Specific Company

```bash
# Search for a specific company
node scan-h1b.mjs --company "Google"

# Search and dispatch to parallel agents
node scan-h1b.mjs --company "Microsoft" --dispatch
```

### Search by Keyword

```bash
# Find companies with "cloud" in name
node scan-h1b.mjs --search "cloud"

# Find companies with "automation"
node scan-h1b.mjs --search "automation"

# Dispatch to parallel agents
node scan-h1b.mjs --search "data" --dispatch
```

### Test Mode (Limited Companies)

```bash
# Scan only first 100 companies
node scan-h1b.mjs --category tech --limit 100

# Preview without saving
node scan-h1b.mjs --category tech --dry-run
```

### Parallel Scanning (Recommended for Large Scans)

**Step 1: Create Batches**

```bash
# Create batches for tech category (17 batches of 100)
node scan-h1b-parallel.mjs --category tech

# Create batches for all companies (281 batches)
node scan-h1b-parallel.mjs --category all
```

**Step 2: Dispatch Parallel Agents**

```bash
# Scan all batches with 10 parallel agents
node scan-h1b-parallel.mjs --dispatch

# This processes 10 batches at a time
# Full 28K scan completes in ~15-20 minutes
```

**Step 3: Process Single Batch (for testing)**

```bash
# Process specific batch
node scan-h1b-parallel.mjs --batch 0

# Batch 0 = first 100 companies
# Batch 1 = next 100 companies
# etc.
```

---

## Skill Modes Reference

Skill modes are triggered when you describe what you want to do. Claude Code reads `modes/*.md` files to understand how to respond.

### Mode Quick Reference

| Mode | Trigger Phrase | What It Does |
|------|----------------|--------------|
| `auto-pipeline` | "Evaluate this job URL" | Full evaluation + PDF + tracker |
| `oferta` | "Evaluate this offer" | A-F scoring (10 dimensions) |
| `ofertas` | "Compare offers" | Rank multiple offers |
| `contacto` | "Find LinkedIn contact" | LinkedIn outreach |
| `deep` | "Research this company" | Deep company research |
| `interview-prep` | "Prepare for interview" | Company-specific intel |
| `pdf` | "Generate CV PDF" | ATS-optimized PDF |
| `training` | "Evaluate this course" | Course/cert evaluation |
| `project` | "Evaluate this project idea" | Portfolio project review |
| `tracker` | "Show my applications" | Pipeline overview |
| `apply` | "Help me apply" | Live application assistant |
| `scan` | "Scan for jobs" | Scan portals.yml companies |
| `h1b-scan` | "Scan H1B companies" | Scan H1B database |
| `pipeline` | "Process pending URLs" | Evaluate pending |
| `batch` | "Batch evaluate" | Parallel batch processing |
| `patterns` | "Analyze rejection patterns" | Pattern analysis |
| `followup` | "Follow up" | Follow-up cadence |

### How to Use Modes

1. **Open Claude Code** in the career-ops directory:
   ```bash
   claude
   ```

2. **Tell Claude what you want** in natural language:
   ```
   "Evaluate this job: https://jobs.ashbyhq.com/anthropic/..."
   ```

3. **Claude reads the mode file** and follows the instructions

---

## Pipeline Workflow

### Typical Job Search Session

```
┌─────────────────────────────────────────────────────────────┐
│  1. SCAN for new offers                                      │
│     npm run scan                                             │
│     or                                                       │
│     node scan-h1b-parallel.mjs --category tech --dispatch    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. PROCESS pipeline (evaluate pending URLs)                │
│     /career-ops pipeline                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. GENERATE PDF for promising roles                        │
│     /career-ops pdf                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. REVIEW and apply manually                                │
│     (system never submits - you always review first)         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  5. UPDATE tracker status                                   │
│     npm run merge                                           │
└─────────────────────────────────────────────────────────────┘
```

### Files in the Pipeline

| File | Purpose |
|------|---------|
| `data/pipeline.md` | Pending URLs to evaluate |
| `data/applications.md` | Your application tracker |
| `data/scan-history.tsv` | All URLs ever scanned |
| `reports/*.md` | Evaluation reports |

### Processing Pipeline

```bash
# Normal flow:
npm run scan           # Find new jobs
npm run verify         # Check integrity
npm run dedup          # Remove duplicates
npm run merge          # Merge tracker additions
npm run normalize     # Normalize statuses
```

---

## Troubleshooting

### Common Issues

**"portals.yml not found"**
```bash
cp templates/portals.example.yml portals.yml
```

**"Playwright not installed"**
```bash
npx playwright install chromium
```

**"No CV found"**
- Create `cv.md` in the project root
- Use markdown format with sections: Summary, Experience, Skills, Education

**"Permission denied" when running scripts**
```bash
chmod +x *.mjs
```

**"Module not found" errors**
```bash
npm install
```

### Health Check Commands

```bash
# Full system check
npm run doctor

# Pipeline integrity
npm run verify

# CV sync status
node cv-sync-check.mjs
```

### Reset Commands

```bash
# Clear scan history (start fresh)
rm data/scan-history.tsv

# Clear pipeline (start fresh)
echo "# Pipeline" > data/pipeline.md
echo "## Pendientes" >> data/pipeline.md
echo "## Procesadas" >> data/pipeline.md
```

### Getting Help

- Run `npm run doctor` for system diagnostics
- Check `docs/SETUP.md` for detailed setup
- Run `npm run update:check` to verify installation

---

## Examples

### Example 1: First Time Setup

```bash
# 1. Clone and install
git clone https://github.com/AsshvinKumar1999/career-ops.git
cd career-ops
npm install
npx playwright install chromium

# 2. Configure
cp config/profile.example.yml config/profile.yml
# Edit config/profile.yml with your details

# 3. Add CV
# Create cv.md with your resume

# 4. Health check
npm run doctor

# 5. Open Claude and personalize
claude
# "Help me set up my job search targeting Marketing Ops roles"
```

### Example 2: Weekly Job Scan

```bash
# 1. Scan for new jobs
node scan-h1b-parallel.mjs --category tech --dispatch

# 2. Verify pipeline
npm run verify

# 3. Open Claude to evaluate
claude
# "Process my pipeline"
```

### Example 3: Research Specific Company

```bash
claude
# "Deep research on Anthropic"
```

### Example 4: Evaluate Job Offer

```bash
claude
# Paste job description or URL
# "Evaluate this offer"
```

### Example 5: Generate Tailored CV

```bash
claude
# "Generate PDF for this [job url]"
```

---

## Next Steps

1. Run `npm run doctor` to verify your setup
2. Create your `config/profile.yml`
3. Add your CV to `cv.md`
4. Run `npm run verify` to check integrity
5. Open Claude Code (`claude`) and start your job search!

---

## Quick Command Cheatsheet

```bash
# Setup
npm install && npx playwright install chromium
npm run doctor

# Scan
npm run scan
node scan-h1b.mjs --category tech
node scan-h1b-parallel.mjs --category all --dispatch

# Evaluate
claude  # Then say "process my pipeline"

# Tracker
npm run verify && npm run dedup && npm run merge && npm run normalize

# Update
npm run update:check
npm run update
```
