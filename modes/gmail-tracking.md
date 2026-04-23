# Gmail Tracking Mode — Phase 6

## Overview

Connects to Gmail API, tracks responses from applied companies, and updates the application tracker. Triggered via `/career-ops gmail` or scheduled.

## OAuth Setup (One-time)

On first run, user must authorize:
1. Open browser for Google OAuth consent
2. User grants Gmail read permissions
3. Store tokens securely in `data/gmail-credentials.json`
4. Subsequent runs use stored tokens

**Security:** Credentials file is gitignored. Never commit OAuth tokens.

## Workflow

1. **Connect** to Gmail API using stored credentials from `data/gmail-credentials.json`
2. **Search** for emails from companies listed in `data/applications.md`
3. **Categorize** each response:
   - `INTERVIEW` — Request for interview (keywords: "interview", "phone screen", "video call", "chat", "schedule", "availability")
   - `REJECTION` — Rejection email (keywords: "unfortunately", "not moving forward", "other candidates", "filled", "position")
   - `OFFER` — Offer received (keywords: "offer", "congratulations", "extended an offer", "compensation package")
   - `OTHER` — General response (default categorization)
4. **Update** `data/applications.md` tracker with new status for each company that responded
5. **Update** orchestration state stats

## Categorization Rules

| Category | Detection | Action |
|----------|-----------|--------|
| INTERVIEW | Subject/body contains interview scheduling terms | Update status to `Interview` |
| REJECTION | Subject/body contains rejection phrases | Update status to `Rejected` |
| OFFER | Subject/body contains offer/congratulations | Update status to `Offer` |
| OTHER | No match above | Update status to `Responded` |

**Note:** Some emails may be automated (application received). Only categorize if there's a clear signal.

## State Update

After sync, call `updateStats()` from `scripts/orchestrate-state.mjs`:
```javascript
{
  stats: {
    response_rate: (responded / total_applications).toFixed(2),
    interview_rate: (interview / total_applications).toFixed(2),
    last_gmail_sync: new Date().toISOString()
  }
}
```

## Output Summary

Show user a summary:
```
Gmail Sync Complete:
- Checked X companies
- Y new responses
- Z interviews
- W rejections
- V offers

Updated tracker for: [company list]
```

## Transition

After Gmail sync, go to Phase 7 (Learning) to analyze patterns.
