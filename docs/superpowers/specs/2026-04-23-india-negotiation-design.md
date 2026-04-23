# Career-Ops India Portal Scraper + Salary Negotiation Mode

## Overview

Two new capability additions to career-ops:

1. **India Portal Scraper** — Scrape H1B India companies + India job boards (Naukri, Instahyre, AmbitionBox, LinkedIn India) for target roles
2. **Salary Negotiation Mode** — Interactive + research-augmented negotiation coaching for offer acceptance

---

## Part 1: India Portal Scraper

### Goal

Build an India-focused job discovery pipeline that:
1. Scrapes 588 H1B India-based companies for open roles
2. Scrapes India job boards (Naukri, Instahyre) for target keywords
3. Adds discovered jobs to `data/pipeline.md`
4. Creates `data/h1b-categories/h1b-india.tsv` with India-specific company data

### India Companies in H1B Database

**588 companies** identified via:
- State code = `IN` (246 companies)
- City names: Mumbai, Bangalore/BLR, Hyderabad/HYD, Pune, Chennai/CHE, Delhi/DEL, Gurgaon/GUR, Ahmedabad, Chandigarh, Kolkata, Jaipur (342 companies)

### Target Roles (Keywords)

**Primary targets:**
- Marketing Operations / Marketing Ops / MarTech
- AI Operations / AI Ops / LLMOps / Agentic
- Revenue Operations / RevOps / SalesOps
- Solutions Engineer / Implementation Engineer

**India-specific variants:**
- Growth Lead, Growth Manager
- Operations Lead, Operations Manager
- Business Development Operations
- Marketing Technology / MarTech
- Automation Engineer (in AI context)

### India Job Boards

| Portal | URL Pattern | Purpose |
|--------|-------------|---------|
| Naukri.com | `https://www.naukri.com/jobs-in-{city}` | Primary India job board |
| Instahyre | `https://www.instahyre.com/jobs/{keyword}` | Premium tech roles |
| AmbitionBox | `https://www.ambitionbox.com/jobs/{company}` | Company reviews + jobs |
| LinkedIn India | `https://www.linkedin.com/jobs/{keyword}-jobs/?location=India` | Cross-posted roles |
| Glassdoor India | `https://www.glassdoor.co.in/Job/jobs-in-{city}.htm` | Company research |

### Architecture

```
data/h1b-categories/h1b-india.tsv  (NEW - 588 India H1B companies)
        ↓
   scan-india.mjs                 (NEW - India-specific scanner)
        ↓
   ┌─────────────────────────────────────┐
   │  1. H1B India companies             │
   │     - Generate careers_url if missing
   │     - Add Naukri/Instahyre search   │
   └─────────────────────────────────────┘
        ↓
   ┌─────────────────────────────────────┐
   │  2. India job board search          │
   │     - Naukri by keyword + location  │
   │     - Instahyre by keyword         │
   │     - Cross-reference companies     │
   └─────────────────────────────────────┘
        ↓
   data/pipeline.md                 (pending URLs)
   data/scan-history.tsv            (dedup tracking)
   data/h1b-india-discovered.tsv    (NEW - companies discovered)
```

### Implementation Tasks

1. Create `data/h1b-categories/h1b-india.tsv` from H1B data (588 companies)
2. Create `scan-india.mjs` — India-specific portal scanner
3. Add India job board API integrations (Naukri, Instahyre)
4. Add keyword variant mapping for India roles
5. Add `india` mode to `modes/india.md`
6. Update `portals.yml` with India-specific companies
7. Write tests + documentation

### New Files

| File | Purpose |
|------|---------|
| `scan-india.mjs` | India portal scanner script |
| `data/h1b-categories/h1b-india.tsv` | India H1B companies |
| `data/h1b-india-discovered.tsv` | Companies found via scraping |
| `modes/india.md` | India scanning mode |
| `data/india-scan-history.tsv` | India scan dedup |

---

## Part 2: Salary Negotiation Mode

### Goal

Help user negotiate offers with confidence using:
1. Research — company-specific negotiation intel
2. Calculation — backup positions and walk-away points
3. Drafting — email/phone scripts customized to situation
4. Coaching — interactive guidance during live negotiations

### Negotiation Flow

```
Offer received (from oferta.md evaluation)
        ↓
┌─────────────────────────────────────┐
│  Salary Negotiation Mode Activated   │
└─────────────────────────────────────┘
        ↓
   ┌─────────────────────────────────────┐
   │  Phase 1: Research                   │
   │  - Glassdoor negotiation patterns    │
   │  - LinkedIn comp ranges for role    │
   │  - Blind / Fishbowl salary data     │
   │  - Company-specific negotiation    │
   │    history from Blind             │
   └─────────────────────────────────────┘
        ↓
   ┌─────────────────────────────────────┐
   │  Phase 2: Position Calculation       │
   │  - Your target: $90K-130K          │
   │  - Your minimum: $85K              │
   │  - Offer received: $X              │
   │  - Gap analysis                    │
   │  - Counter target (target + 10%)   │
   │  - Walk-away point                 │
   └─────────────────────────────────────┘
        ↓
   ┌─────────────────────────────────────┐
   │  Phase 3: Drafting                  │
   │  - Initial acknowledgment email    │
   │  - Counter offer email              │
   │  - Phone talking points             │
   │  - Follow-up cadence               │
   │  - Walk-away script                │
   └─────────────────────────────────────┘
        ↓
   ┌─────────────────────────────────────┐
   │  Phase 4: Coaching (Optional)       │
   │  - Real-time negotiation coaching   │
   │  - Scenario simulation             │
   │  - Objection handling              │
   └─────────────────────────────────────┘
```

### Position Calculation Matrix

| Position | Calculation | Your Values |
|----------|-------------|-------------|
| Walk-away | Minimum acceptable | $85K |
| Target | Goal for negotiation | $90K-130K |
| Stretch | Maximum reasonable | $150K+ (for right role) |
| Counter | Target + 10-15% | $110K-140K |
| Opening | Stretch + 5% | $115K-155K |

### Draft Templates

**Email 1: Acknowledgment + Request Time**
```
Subject: Re: [Company] Offer — [Role Title]

Hi [Recruiter Name],

Thank you for the offer. I'm excited about the opportunity to join [Company] as [Role Title].

I'm currently reviewing the details and will get back to you by [date + 2-3 business days]. Would that work for you?

Looking forward to discussing the next steps.

Best,
[Your Name]
```

**Email 2: Counter Offer**
```
Subject: Re: [Company] Offer — [Role Title]

Hi [Recruiter Name],

Thank you for the offer. After careful consideration, I'm genuinely enthusiastic about [Company] and the [Role Title] role.

However, the offered compensation is below my target range. Based on my experience and the scope of this role, I'd like to propose [Counter = Offer + 12%].

I'm also open to discussing [non-salary benefits: equity, bonus, PTO, signing bonus] if base salary has constraints.

Would you be able to connect to discuss this further?

Best,
[Your Name]
```

**Phone Talking Points**
- Lead with enthusiasm (not demands)
- State your number clearly
- Anchor to your research ("Based on market data for this role...")
- Have benefits ready as alternatives if base is capped
- Know your walk-away point before the call
- Silence is okay — don't rush to fill gaps

### Implementation Tasks

1. Create `modes/negotiation.md` — negotiation mode
2. Add negotiation phase to `oferta.md` (Block G → H for Negotiation)
3. Create `negotiation-templates/` directory with email/phone templates
4. Add `negotiation.mjs` helper script for position calculations
5. Add company research to `deep.md` to capture negotiation intel
6. Write documentation

### New Files

| File | Purpose |
|------|---------|
| `modes/negotiation.md` | Negotiation mode |
| `scripts/negotiation-calc.mjs` | Position calculator |
| `templates/negotiation/` | Email + phone templates |
| `modes/deep.md` (updated) | Add negotiation intel section |

---

## Shared Dependencies

- Uses existing `scan.mjs` infrastructure
- Uses existing `portals.yml` configuration
- Uses existing `generate-pdf.mjs` infrastructure
- Reads from `config/profile.yml` for compensation data

---

## Success Criteria

### India Portal Scraper
- [ ] 588 India H1B companies organized in `h1b-india.tsv`
- [ ] Can scrape Naukri by keyword + location
- [ ] Can scrape Instahyre by keyword
- [ ] Jobs added to `data/pipeline.md`
- [ ] Duplicate detection via scan-history
- [ ] Mode accessible via `/career-ops india`

### Salary Negotiation Mode
- [ ] Research phase finds company-specific negotiation intel
- [ ] Position calculator outputs all 5 positions with reasoning
- [ ] Email drafts are role and company-specific
- [ ] Phone talking points are customized to the offer
- [ ] Walk-away guidance based on minimum from profile
- [ ] Mode accessible via `/career-ops negotiation`

---

## Priority

1. **India Portal Scraper** (Phase 1: H1B India only)
2. **Salary Negotiation** (Phase 1: Position calc + email drafts)
