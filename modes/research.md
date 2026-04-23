# Research Mode — Phase 2

## Overview

Researches market keywords for target roles by analyzing competitor postings. Triggered after onboarding or when `keywords_need_update: true`.

## Workflow

1. Search market for target role keywords from `config/profile.yml` (target_roles)
2. Analyze top 20 job postings in target roles across job boards
3. Identify emerging keywords and variants
4. Update `portals.yml` with optimized keywords

## Keywords to Research

**Primary (from config/profile.yml):**
- Marketing Operations / MarTech / RevOps
- AI Operations / AI Ops / LLMOps / Agentic
- Solutions Engineer / Implementation Engineer

**India variants:**
- Growth Lead, Growth Manager
- Operations Lead, Operations Manager
- Business Development Operations
- Marketing Technology / MarTech
- Automation Engineer (in AI context)

## Data Sources

- `config/profile.yml` — Target roles and cities
- Job boards: Naukri, Instahyre, LinkedIn, Glassdoor
- H1B data: h1b-categories/ companies

## Output

- Updated `portals.yml` with researched keywords in `title_filter.positive`
- Store findings in orchestration state under `learnings.keywords_that_work`
- Suggest updated keywords to user for confirmation

## Transition

After research complete, suggest running `/career-ops scan` to transition to Phase 3.
