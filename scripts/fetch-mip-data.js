#!/usr/bin/env node
// Run: node scripts/fetch-mip-data.js
// Fetches live channel + EPG data from the MIP demo API and writes
// lib/mip-live-data.js — a plain JS file the prototype loads as a <script>.
// Re-run any time to refresh the snapshot.

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const BASE    = 'https://gs-demo.gstr.tv';
const PROJECT = 'ea97ef0e-11a9-4b83-aee3-c934113b8f54';
const TOKEN   = '9009a45d17c269042585446f104cb66f544b4b82';
const __dir   = dirname(fileURLToPath(import.meta.url));
const OUT     = join(__dir, '../lib/mip-live-data.js');

const headers = { 'Authorization': `Bearer ${TOKEN}` };
const now     = Math.floor(Date.now() / 1000);

async function fetchJSON(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

const [channelsResp, guideResp] = await Promise.all([
  fetchJSON(`${BASE}/api/v1/projects/${PROJECT}/channels`),
  fetchJSON(`${BASE}/api/v1/projects/${PROJECT}/guide?start=${now}&duration=14400`),
]);

const channelsSlim = channelsResp.results.map(c => ({
  id:                         c.id,
  name:                       c.name,
  number:                     c.number,
  stream_provider_channel_id: c.stream_provider_channel_id,
  supported_use_cases:        c.supported_use_cases,
}));

const guideSlim = guideResp.results.map(g => ({
  channel_id: g.channel_id,
  start:      g.start,
  duration:   g.duration,
  program: g.program ? {
    image_url:    g.program.image_url,
    kind:         g.program.kind,
    genres:       g.program.genres,
    translations: (g.program.translations || []).map(t => ({
      language:    t.language,
      title:       t.title,
      description: t.description,
      default:     t.default,
    })),
  } : null,
}));

const ts  = new Date().toISOString();
const out = `// AUTO-GENERATED — do not edit. Run: node scripts/fetch-mip-data.js
// Fetched: ${ts}
window.MIP_LIVE_DATA = ${JSON.stringify({ channels: channelsSlim, guide: guideSlim, fetchedAt: now }, null, 2)};
`;

writeFileSync(OUT, out, 'utf8');
console.log(`✓ ${channelsSlim.length} channels + ${guideSlim.length} guide entries → lib/mip-live-data.js`);
