#!/usr/bin/env node
/**
 * negotiation-calc.mjs — Salary Negotiation Position Calculator
 *
 * Calculates negotiation positions based on:
 * - Your minimum (walk-away point)
 * - Your target salary
 * - Your stretch goal
 * - Offered salary
 *
 * Usage:
 *   node negotiation-calc.mjs --offer 90000 --target 110000 --min 85000
 *   node negotiation-calc.mjs --offer 90000  (uses profile.yml defaults)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// === CORE CALCULATION ===

/**
 * @param {Object} params
 * @param {number} params.minimum - Walk-away minimum
 * @param {number} params.target - Target salary
 * @param {number} params.stretch - Stretch goal
 * @param {number} params.offered - Offered salary
 */
export function calculatePositions(params) {
  const { minimum = 0, target = 0, stretch = 0, offered = 0 } = params;

  const walkAway = minimum;
  const targetSalary = target || (minimum && stretch ? (minimum + stretch) / 2 : minimum);
  const counter = Math.round(targetSalary * 1.12);
  const opening = Math.round(counter * 1.05);
  const stretchSalary = stretch || Math.round(targetSalary * 1.25);
  const gapFromOffer = offered - targetSalary;
  const gapPercent = offered > 0 ? Math.round((gapFromOffer / targetSalary) * 100) : 0;
  const negotiationRoom = counter - offered;
  const roomPercent = offered > 0 ? Math.round((negotiationRoom / offered) * 100) : 0;

  return {
    walkAway,
    target: targetSalary,
    stretch: stretchSalary,
    counter,
    opening,
    offered,
    gapFromOffer,
    gapPercent,
    negotiationRoom,
    roomPercent,
    shouldNegotiate: offered < counter
  };
}

// === CLI ===

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--offer' && args[i + 1]) params.offered = parseInt(args[i + 1]);
    if (args[i] === '--target' && args[i + 1]) params.target = parseInt(args[i + 1]);
    if (args[i] === '--min' && args[i + 1]) params.minimum = parseInt(args[i + 1]);
    if (args[i] === '--stretch' && args[i + 1]) params.stretch = parseInt(args[i + 1]);
  }

  return params;
}

function main() {
  const args = parseArgs();

  // Default values (from user's profile)
  const DEFAULT_OFFER = 0;
  const DEFAULT_TARGET = 110000;
  const DEFAULT_MIN = 85000;
  const DEFAULT_STRETCH = 130000;

  const offered = args.offered || DEFAULT_OFFER;
  const target = args.target || DEFAULT_TARGET;
  const minimum = args.minimum || DEFAULT_MIN;
  const stretch = args.stretch || DEFAULT_STRETCH;

  const positions = calculatePositions({
    minimum,
    target,
    stretch,
    offered
  });

  console.log('\n=== Salary Negotiation Positions ===\n');
  console.log(`Offered:      $${offered.toLocaleString()}`);
  console.log(`Target:       $${positions.target.toLocaleString()}`);
  console.log(`Stretch:      $${positions.stretch.toLocaleString()}`);
  console.log(`Walk-away:   $${positions.walkAway.toLocaleString()}`);
  console.log('\n--- Negotiation Positions ---');
  console.log(`Counter:      $${positions.counter.toLocaleString()} (+${positions.gapPercent}% from offer)`);
  console.log(`Opening:      $${positions.opening.toLocaleString()}`);
  console.log('\n--- Analysis ---');
  console.log(`Gap:          $${Math.abs(positions.gapFromOffer).toLocaleString()} (${positions.gapPercent}%)`);
  console.log(`Room:         $${positions.negotiationRoom.toLocaleString()} (${positions.roomPercent}%)`);
  console.log(`Negotiate:    ${positions.shouldNegotiate ? 'YES - room for improvement' : 'Offer meets or exceeds target'}\n`);
}

main();