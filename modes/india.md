# Mode: india — India Job Search Scanner

Scans India job boards (Naukri, Instahyre, AmbitionBox, LinkedIn India) for target roles.

## Usage

```
/career-ops india
```

Or trigger phrases:
- "Scan India jobs"
- "Search India job boards"
- "Find India-based companies"
- "India job search"

## What It Does

1. **India Job Boards**
   - Naukri.com — Primary India job board (search by role + city)
   - Instahyre.com — Premium tech/startup roles
   - AmbitionBox — Company reviews + jobs
   - LinkedIn India — Cross-posted roles
   - Glassdoor India — Company research

2. **Target Roles**
   - Marketing Operations, Marketing Ops, MarTech
   - Revenue Operations, RevOps, SalesOps
   - AI Operations, AI Ops, LLMOps, Agentic
   - Solutions Engineer, Implementation Engineer
   - Growth Lead, Operations Lead

3. **India Cities**
   - Bangalore, Mumbai, Hyderabad, Pune, Chennai
   - Delhi, Gurgaon, Noida, Kolkata, Ahmedabad

## Command Line

```bash
# Full scan (generates URLs for all roles × cities)
node scan-india.mjs

# H1B cross-reference only
node scan-india.mjs --h1b-only

# Dry run (preview without writing)
node scan-india.mjs --dry-run

# Limit results
node scan-india.mjs --limit 100
```

## Output

- `data/pipeline.md` — Pending URLs for evaluation
- `data/india-scan-history.tsv` — Duplicate detection

## Target Keywords

| Category | Keywords |
|---------|----------|
| Marketing Ops | Marketing Operations, Marketing Ops, MarTech |
| Revenue Ops | Revenue Operations, RevOps, SalesOps |
| AI Ops | AI Operations, AI Ops, LLMOps, Agentic |
| Engineering | Solutions Engineer, Implementation Engineer |
| Leadership | Growth Lead, Operations Lead |