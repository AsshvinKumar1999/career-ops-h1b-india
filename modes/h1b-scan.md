# Mode: h1b-scan -- H1B Company Scanner

Scans the complete H1B company database (28,061 companies) by category, using parallel agents for maximum throughput.

## H1B Database

**Location:** `data/h1b-categories/`

| File | Companies | Description |
|------|-----------|-------------|
| `h1b-all-companies.tsv` | 28,061 | All H1B sponsors |
| `h1b-tech.tsv` | 1,655 | Technology companies |
| `h1b-manufacturing.tsv` | 3,125 | Manufacturing companies |
| `h1b-healthcare.tsv` | 2,457 | Healthcare companies |
| `h1b-financial.tsv` | 1,866 | Financial services |
| `h1b-professional.tsv` | 12,867 | Professional services |
| `h1b-retail.tsv` | 706 | Retail & E-commerce |
| `h1b-media.tsv` | 89 | Media & Entertainment |
| `h1b-transportation.tsv` | 259 | Transportation & Logistics |
| `h1b-energy.tsv` | 188 | Energy companies |
| `h1b-realestate.tsv` | 273 | Real Estate |
| `h1b-education.tsv` | 1,603 | Education |
| `h1b-agriculture.tsv` | 168 | Agriculture |
| `h1b-construction.tsv` | 625 | Construction |
| `h1b-hospitality.tsv` | 213 | Hospitality |
| `h1b-wholesale.tsv` | 771 | Wholesale Trade |

**Format:** `employer \t state \t city \t naics \t category \t careers_url`

## Recommended Execution

Run as a subagent for large scans (all categories):

```
Agent(
    subagent_type="general-purpose",
    prompt="Scan H1B tech companies using scan-h1b-parallel.mjs",
    run_in_background=True
)
```

## Workflow

### Quick Scan (Single Category)

```bash
# Create batches and dispatch parallel agents
node scan-h1b-parallel.mjs --category tech --dispatch

# Scan specific category
node scan-h1b-parallel.mjs --category manufacturing --dispatch

# Scan all H1B companies (28K companies, 281 batches)
node scan-h1b-parallel.mjs --category all --dispatch
```

### Scanning Options

```bash
# By category
node scan-h1b-parallel.mjs --category tech          # 1,655 companies → 17 batches
node scan-h1b-parallel.mjs --category manufacturing # 3,125 companies → 32 batches
node scan-h1b-parallel.mjs --category healthcare   # 2,457 companies → 25 batches
node scan-h1b-parallel.mjs --category all          # 28,061 companies → 281 batches

# By company name search
node scan-h1b-parallel.mjs --company "Google"      # search for specific company

# By keyword (searches all categories)
node scan-h1b-parallel.mjs --search "cloud"        # companies with "cloud" in name
node scan-h1b-parallel.mjs --search "automation"    # companies with "automation"

# Test mode (limited companies)
node scan-h1b-parallel.mjs --category tech --limit 100

# Preview only (no results saved)
node scan-h1b-parallel.mjs --category tech --dry-run
```

### Dispatching Parallel Agents

The `--dispatch` flag launches up to 10 parallel agents at a time:

```bash
# Dispatch all batches in parallel (recommended for full scan)
node scan-h1b-parallel.mjs --dispatch --category all

# Each batch = 100 companies, 10 parallel = 1,000 companies/min
# Full 28K scan completes in ~28 rounds = ~3-5 minutes
```

### Processing Individual Batches

```bash
# Create batches first (without scanning)
node scan-h1b-parallel.mjs --category tech

# Process specific batch
node scan-h1b-parallel.mjs --batch 0

# Process batch 0-9 sequentially
for i in $(seq 0 9); do node scan-h1b-parallel.mjs --batch $i; done
```

## Batch Management

**Batch storage:** `data/h1b-batches/`
- `batch-000.json` - First 100 companies
- `batch-001.json` - Next 100 companies
- etc.

**View batches:**
```bash
ls data/h1b-batches/ | wc -l  # count batches
cat data/h1b-batches/batch-000.json | head  # inspect batch
```

**Clear batches:**
```bash
rm -rf data/h1b-batches/
```

## Title Filter

Jobs are filtered by these keywords (from `TITLE_FILTER` in scan-h1b-parallel.mjs):

**Positive matches:**
- Marketing Operations, Marketing Ops, MarTech, RevOps, SalesOps
- AI Operations, AI Ops, LLMOps, Agentic, Workflow Automation
- Solutions Engineer, Solutions Architect, Customer Engineer
- Product Manager, Technical PM, Implementation Engineer
- CRM, HubSpot, Salesforce, Marketing Cloud
- AI, LLM, GenAI, Generative AI, Conversational AI

**Negative filters (excluded):**
- Senior, Director, VP, Chief, Head of, Lead, Principal, Staff
- Intern, Junior, Entry Level
- Developer, Software Engineer, Data Scientist, Data Analyst

## Output

New offers are added to:
- `data/pipeline.md` - Pending URLs for evaluation
- `data/scan-history.tsv` - Scan tracking

## Using with Claude Code Agents

For maximum parallelization, dispatch multiple agents:

```javascript
// In Claude Code
Agent("node scan-h1b-parallel.mjs --batch 0")
Agent("node scan-h1b-parallel.mjs --batch 1")
Agent("node scan-h1b-parallel.mjs --batch 2")
// ... run 10 in parallel, then next 10
```

Or use the integrated dispatch:

```bash
# This script handles parallel dispatch internally
node scan-h1b-parallel.mjs --category tech --dispatch
```

## Examples

**Scan tech companies (fastest):**
```
node scan-h1b-parallel.mjs --category tech --dispatch
```
→ 1,655 companies, 17 batches, ~2 minutes

**Scan all H1B companies (comprehensive):**
```
node scan-h1b-parallel.mjs --category all --dispatch
```
→ 28,061 companies, 281 batches, ~15-20 minutes

**Search for specific company:**
```
node scan-h1b-parallel.mjs --company "Microsoft"
node scan-h1b-parallel.mjs --company "Amazon" --dispatch
```

**Search by keyword across all categories:**
```
node scan-h1b-parallel.mjs --search "data"
node scan-h1b-parallel.mjs --search "ai" --dispatch
```

## India Focus

For India-based H1B companies, the scanner automatically adds:
- Naukri.com job board
- Instahyre.com
- AmbitionBox
- Glassdoor India

Companies with state codes: AZ, BLR, CHE, HYD, MUM, PUNE, DEL, GUR are flagged as India.