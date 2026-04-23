import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

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
    session_id: randomUUID(),
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
