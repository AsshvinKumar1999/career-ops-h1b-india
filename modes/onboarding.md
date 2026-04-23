# Onboarding Mode — Phase 1

## Overview

Collects user CV, profile details, target roles, and cities to personalize the job search. Triggered when `profile_complete: false` or first run.

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

Based on geography preference from `preferences.geography`:
- **US:** Ask for US cities (SF, NYC, Austin, Seattle, etc.)
- **India:** Ask for Indian cities (Bangalore, Mumbai, Hyderabad, etc.)
- **Both:** Ask for both US and Indian cities

Update `config/profile.yml` with `target_cities`.

## State Update

After onboarding complete, call `updateProfile()` from `scripts/orchestrate-state.mjs`:
```javascript
{
  phase: 1,
  profile: {
    name: "User's name",
    cv_verified: true,
    target_roles: ["Marketing Ops", "AI Operations"],
    target_cities: ["Bangalore", "Mumbai", "Hyderabad"],
    profile_complete: true
  }
}
```

Also call `updatePhase(1)`.

## Transition

After onboarding complete, suggest running `/career-ops research` to transition to Phase 2.
