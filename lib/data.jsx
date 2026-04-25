// Content: clips, carousels, stations, podcasts, articles.
// Imagery comes from Unsplash (signed URLs, small sizes).

const img = (id, w = 800, h = 1200) => {
  const u = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=75`;
  return (typeof window !== 'undefined' && window.__urlMap && window.__urlMap[u]) || u;
};

// Vertical highlight clips — 9:16 content
const CLIPS = [
  {
    id: 'c1',
    kind: 'CLIP',
    channel: 'SRF Dok',
    channelLogo: 'SRF',
    channelColor: '#E30613',
    title: 'Switzerland: The land of pure nature',
    subtitle: 'Dokumentarfilm · 52 Min.',
    img: img('photo-1528164344705-47542687000d', 600, 1066),
    video: window.__resources.vid_switzerland,
    cta: 'Watch full documentary',
    tag: 'Nature',
    duration: '0:28',
    progress: 0,
  },
  {
    id: 'c3',
    kind: 'CLIP',
    channel: 'ProSieben',
    channelLogo: 'P7',
    channelColor: '#E40F0F',
    title: 'Was sind die ältesten Tiere der Welt?',
    subtitle: 'Galileo · Wissensmagazin · 4:18',
    img: img('photo-1441057206919-63d19fac2369', 600, 1066),
    video: window.__resources.vid_galileo,
    cta: 'Watch full episode',
    tag: 'Science',
    duration: '0:27',
    progress: 0.6,
  },
  {
    id: 'c4',
    kind: 'CLIP',
    channel: 'Sky Sport Bundesliga',
    channelLogo: 'SKY',
    channelColor: '#0072CE',
    title: 'Kann ich Serge Gnabry verteidigen?',
    subtitle: 'Bundesliga · Analyse · 1:12',
    img: img('photo-1459865264687-595d652de67e', 600, 1066),
    video: window.__resources.vid_gnabry,
    cta: 'Watch full analysis',
    tag: 'Football',
    duration: '0:30',
    progress: 0.1,
  },
  {
    id: 'c5',
    kind: 'CLIP',
    channel: 'ProSieben',
    channelLogo: 'P7',
    channelColor: '#E40F0F',
    title: 'Lottogesellschaften hassen diesen Trick',
    subtitle: 'Late Night Berlin · gestern · 0:52',
    img: img('photo-1514533212735-5df27d970db0', 600, 1066),
    video: window.__resources.vid_lotto,
    cta: 'Watch full show',
    tag: 'Late Night',
    duration: '0:29',
    progress: 0.22,
  },
  {
    id: 'c6',
    kind: 'CLIP',
    channel: 'Eurosport 1',
    channelLogo: 'ES',
    channelColor: '#FFCC00',
    title: 'Giro d\'Italia · Stage 17 highlights',
    subtitle: 'Bormio → Passo dello Stelvio · 6:24',
    img: img('photo-1517649763962-0c623066013b', 600, 1066),
    video: window.__resources.vid_giro,
    cta: 'Watch full stage',
    tag: 'Cycling',
    duration: '0:25',
    progress: 0,
  },
  {
    id: 'c7',
    kind: 'CLIP',
    channel: 'Eurosport 1',
    channelLogo: 'ES',
    channelColor: '#FFCC00',
    title: 'Teqball World Championships · Hungary vs Thailand',
    subtitle: 'Highlights · Group stage · 2:47',
    img: img('photo-1526232761682-d26e03ac148e', 600, 1066),
    video: window.__resources.vid_teqball,
    cta: 'Watch full match',
    tag: 'Teqball',
    duration: '0:31',
    progress: 0,
  },
];

// 4You carousels — editorial density, fewer rows, bold headers
const CONTINUE = [
  { id: 'cw1', title: 'Dark', sub: 'S3 · E4 · 32 min left', img: img('photo-1478760329108-5c3ed9d495a0', 500, 320), channel: 'Netflix', progress: 0.45 },
  { id: 'cw2', title: 'Tatort: Köln', sub: 'Folge 1234 · 12 min left', img: img('photo-1506905925346-21bda4d32df4', 500, 320), channel: 'ARD', progress: 0.78 },
  { id: 'cw3', title: 'Das Boot', sub: 'S4 · E2 · 48 min left', img: img('photo-1505142468610-359e7d316be0', 500, 320), channel: 'Sky', progress: 0.18 },
  { id: 'cw4', title: 'Babylon Berlin', sub: 'S5 · E7 · 25 min left', img: img('photo-1485579149621-3123dd979885', 500, 320), channel: 'ARD', progress: 0.52 },
];

// MIP Live Data adapter — uses real EPG when window.MIP_LIVE_DATA is present
function _mipFmt(ts) {
  const d = new Date(ts * 1000);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const LIVE_NOW = (() => {
  const fallback = [
    { id: 'ln1', channel: 'Sky Sport Bundesliga', title: 'Bayern vs. Leipzig', sub: 'LIVE · 2nd half · 1 to 1', img: img('photo-1459865264687-595d652de67e', 500, 320), viewers: '82.1k' },
    { id: 'ln2', channel: 'Tagesschau 24', title: 'Mittagsmagazin', sub: 'LIVE · 14:00 to 14:45', img: img('photo-1504711434969-e33886168f5c', 500, 320), viewers: '12.4k' },
    { id: 'ln3', channel: 'arte', title: 'Journal', sub: 'LIVE · 14:30 to 15:00', img: img('photo-1528164344705-47542687000d', 500, 320), viewers: '4.8k' },
    { id: 'ln4', channel: 'Eurosport 1', title: 'Giro d\'Italia · Stage 17', sub: 'LIVE · Bormio climb', img: img('photo-1517649763962-0c623066013b', 500, 320), viewers: '31.7k' },
  ];
  const mip = window.MIP_LIVE_DATA;
  if (!mip || !mip.guide || !mip.guide.length) return fallback;

  const chMap = Object.fromEntries(mip.channels.map(c => [c.id, c]));
  const ref   = mip.fetchedAt;
  const seen  = new Set();
  const items = [];

  for (const g of mip.guide) {
    if (!g.program || seen.has(g.channel_id)) continue;
    if (g.start <= ref && ref < g.start + g.duration) {
      seen.add(g.channel_id);
      const ch    = chMap[g.channel_id] || { name: g.channel_id };
      const trans = g.program.translations?.find(t => t.default) || g.program.translations?.[0] || {};
      const genre = g.program.genres?.[0] || g.program.kind || '';
      items.push({
        id:      `mip_${items.length}`,
        channel: ch.name,
        title:   trans.title || '—',
        sub:     `LIVE · ${_mipFmt(g.start)}–${_mipFmt(g.start + g.duration)}${genre ? ' · ' + genre : ''}`,
        img:     g.program.image_url || img('photo-1459865264687-595d652de67e', 500, 320),
        viewers: null,
      });
      if (items.length >= 6) break;
    }
  }
  return items.length > 0 ? items : fallback;
})();

// Channel logo data-URI SVGs — inline, no external hotlink dependency.
// Each is a square canvas with the channel mark on white.
const _svg = (inner, bg = '#FFFFFF') =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">` +
    `<rect width="120" height="120" fill="${bg}"/>${inner}</svg>`
  );

const CHANNEL_LOGOS = {
  // Sky Sport — dark blue Sky wordmark on white
  'Sky Sport Bundesliga': _svg(
    `<text x="60" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="34" fill="#0072CE" letter-spacing="-1">Sky</text>` +
    `<text x="60" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="16" fill="#111">Sport</text>`
  ),
  // Tagesschau 24 — navy square with white text
  'Tagesschau 24': _svg(
    `<rect x="10" y="30" width="100" height="60" fill="#003F7C"/>` +
    `<text x="60" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#FFF">tagesschau</text>` +
    `<text x="60" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="22" fill="#FFF">24</text>`
  ),
  // arte — black lowercase mark
  'arte': _svg(
    `<text x="60" y="75" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="44" fill="#111" letter-spacing="-2">arte</text>`
  ),
  // Eurosport 1 — yellow circle with black numeral
  'Eurosport 1': _svg(
    `<text x="60" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="16" fill="#111" letter-spacing="-0.5">EUROSPORT</text>` +
    `<circle cx="60" cy="80" r="18" fill="#FFCC00"/>` +
    `<text x="60" y="87" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="22" fill="#111">1</text>`
  ),
  // SRF 1 — red pill with "SRF 1" in white, Swiss corporate style
  'SRF 1': _svg(
    `<rect x="18" y="40" width="84" height="40" rx="4" fill="#000"/>` +
    `<text x="60" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#FFF">SRF 1</text>`
  ),
  // ProSieben — red "7" inside circle
  'ProSieben': _svg(
    `<circle cx="60" cy="60" r="40" fill="#E40F0F"/>` +
    `<text x="60" y="78" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="900" font-size="52" fill="#FFF">7</text>`
  ),
  // ZDF — orange sans wordmark
  'ZDF': _svg(
    `<text x="60" y="78" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="38" fill="#FA7D19" letter-spacing="1">ZDF</text>`
  ),
  // RTL — three color blocks (red / white / blue) with white letters
  'RTL': _svg(
    `<rect x="15" y="40" width="30" height="40" fill="#E2001A"/>` +
    `<rect x="45" y="40" width="30" height="40" fill="#FFF" stroke="#DDD"/>` +
    `<rect x="75" y="40" width="30" height="40" fill="#003DA5"/>` +
    `<text x="30" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#FFF">R</text>` +
    `<text x="60" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#111">T</text>` +
    `<text x="90" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#FFF">L</text>`
  ),
};

// Auto-generate SVG badge logos for MIP channels not already hand-crafted above
if (window.MIP_LIVE_DATA) {
  const _mipPalette = ['#C8102E','#003087','#F58220','#006341','#00539F','#8B0000','#4B0082','#1D6F42','#E30613','#003F7C'];
  const _mipHash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return Math.abs(h); };
  window.MIP_LIVE_DATA.channels.forEach(ch => {
    if (CHANNEL_LOGOS[ch.name]) return;
    const color  = _mipPalette[_mipHash(ch.stream_provider_channel_id) % _mipPalette.length];
    const abbr   = ch.name
      .replace(/\s+(Germany|Austria|Switzerland|UK|France|Italy|FR)\s*$/, '')
      .split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 3);
    const fs = abbr.length > 2 ? 28 : 36;
    const ty = abbr.length > 2 ? 68 : 74;
    CHANNEL_LOGOS[ch.name] = _svg(
      `<rect x="8" y="8" width="104" height="104" rx="10" fill="${color}"/>` +
      `<text x="60" y="${ty}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="${fs}" fill="#FFF">${abbr}</text>`
    );
  });
}

const _p = (path) => (typeof window !== 'undefined' && window.__urlMap && window.__urlMap[path]) || path;

const TRENDING = [
  { id: 't1', title: '10,000 BC',       sub: 'Film · Epic adventure',       img: window.__resources.pos_10000bc,        kind: 'movie', year: 2008, rating: 'FSK 12', genres: ['Adventure', 'Action'],    duration: 109 },
  { id: 't2', title: '12 Jours',        sub: 'Film · Documentary',          img: window.__resources.pos_12jours,       kind: 'movie', year: 2017, rating: 'FSK 12', genres: ['Documentary', 'French'],  duration: 87  },
  { id: 't3', title: '12 Years a Slave',sub: 'Film · Historical drama',     img: window.__resources.pos_12years, kind: 'movie', year: 2013, rating: 'FSK 16', genres: ['Drama', 'Biography'],    duration: 134 },
  { id: 't4', title: '127 Hours',       sub: 'Film · Survival drama',       img: window.__resources.pos_127hours,      kind: 'movie', year: 2010, rating: 'FSK 12', genres: ['Survival', 'Drama'],      duration: 94  },
  { id: 't5', title: 'À la vie',        sub: 'Film · French drama',         img: window.__resources.pos_alavie,       kind: 'movie', year: 2014, rating: 'FSK 6',  genres: ['Drama', 'French'],        duration: 104 },
];

// Per-title series detail overrides. Anything missing falls back to generated defaults.
const SERIES_META = {
  t1: {
    synopsis: 'A prehistoric epic that follows a young mammoth hunter\'s journey through uncharted lands when his beloved is kidnapped by warlords. He crosses deserts, mountains, and oceans to rescue her.',
    cast: ['Steven Strait', 'Camilla Belle', 'Cliff Curtis', 'Joel Virgel'],
    creator: 'Roland Emmerich',
  },
  t2: {
    synopsis: 'Twelve days. That is the maximum time allowed in France before a psychiatric patient admitted without consent appears before a judge. Depardon films the hearings that decide their fate.',
    cast: ['Raymond Depardon (director)'],
    creator: 'Raymond Depardon',
  },
  t3: {
    synopsis: 'In the antebellum United States, Solomon Northup, a free black man from upstate New York, is abducted and sold into slavery. An unflinching portrait of survival, dignity, and hope.',
    cast: ['Chiwetel Ejiofor', 'Michael Fassbender', 'Lupita Nyong\'o', 'Benedict Cumberbatch'],
    creator: 'Steve McQueen',
  },
  t4: {
    synopsis: 'A mountain climber becomes trapped under a boulder while canyoneering alone near Moab, Utah, and resorts to desperate measures in order to survive.',
    cast: ['James Franco', 'Amber Tamblyn', 'Kate Mara'],
    creator: 'Danny Boyle',
  },
  t5: {
    synopsis: 'Three childhood friends, survivors of Auschwitz, reunite on a French seaside holiday in 1962. Sun, laughter, and memories long buried — a tender ode to friendship and life.',
    cast: ['Julie Depardieu', 'Johanna ter Steege', 'Suzanne Clément', 'Hippolyte Girardot'],
    creator: 'Jean-Jacques Zilbermann',
  },
  b1: {
    synopsis: 'A junior analyst is recruited into a powerful investment bank, where ambition, betrayal and billions collide. Frankfurt at its coldest — and its most addictive.',
    cast: ['Paula Beer', 'Barry Atsma', 'Désirée Nosbusch', 'Tobias Moretti'],
    creator: 'Oliver Kienle',
  },
  b2: {
    synopsis: 'Berlin, 1989. As the Wall cracks open, former East German agent Martin Rauch is pulled back into the field for one last mission — this time against the very state that trained him.',
    cast: ['Jonas Nay', 'Maria Schrader', 'Sonja Gerhardt', 'Florence Kasumba'],
    creator: 'Anna Winger & Jörg Winger',
  },
  b3: {
    synopsis: 'Munich, 1900. A brewer from Nürnberg arrives with a plan to reinvent Oktoberfest — and collides with the dynasties who have run it for generations.',
    cast: ['Misel Maticevic', 'Martina Gedeck', 'Mercedes Müller'],
    creator: 'Ronny Schalk',
  },
  b4: {
    synopsis: 'A young Hasidic woman flees her arranged marriage in Brooklyn for Berlin, where she finds both the freedom she craves and the past she cannot outrun.',
    cast: ['Shira Haas', 'Amit Rahav', 'Jeff Wilbusch'],
    creator: 'Anna Winger & Alexa Karolinski',
  },
};

// Generate fake-but-plausible episodes for a series.
function buildEpisodes(series, season = 1) {
  const titles = {
    t1: ['Lazarus', 'Depths', 'Glow', 'The Swarm', 'Origin', 'Awakening', 'Fracture', 'Ascent'],
    t2: ['Elif', 'Nenad', 'Stefan', 'Tanja', 'Pantry', 'Pass'],
    t3: ['Red Hand', 'Cassettes', 'Berlin 1990', 'Mallorca', 'Majakowski', 'Sovereignty', 'Chile', 'Pyongyang'],
    t4: ['The Line', 'Salt', 'The Pass', 'Meridian', 'Thaw', 'Blood Moon', 'Echoes', 'Avalanche'],
    t5: ['The Ship', 'The Boy', 'The Fog', 'The Four-Leaf Clover', 'The Calling', 'The Pyramid', 'The Storm', 'The Key'],
    b1: ['Cold Open', 'Leverage', 'Margin Call', 'Short Position', 'Audit', 'Collapse'],
    b2: ['Item 17', 'Able Archer', 'Matchbox', 'Gegenschlag', 'Deadline', 'Jackpot', 'Sierra Foxtrot', 'Sturmvogel'],
    b3: ['The Arrival', 'Brauerei', 'Wiesn', 'Betrayal', 'Flames', 'The Deal'],
    b4: ['Part 1', 'Part 2', 'Part 3', 'Part 4'],
  }[series.id] || ['Pilot', 'Crossroads', 'Fallout', 'Rise', 'Storm', 'Reckoning', 'Truth', 'Finale'];
  const n = Math.min(titles.length, series.episodes || 8);
  return Array.from({ length: n }, (_, i) => ({
    id: `${series.id}-s${season}-e${i + 1}`,
    num: i + 1,
    title: titles[i] || `Episode ${i + 1}`,
    duration: 44 + (i % 3) * 4,           // 44–52 min
    watched: i === 0 ? 1 : 0,             // first episode marked as watched
    progress: i === 1 ? 0.32 : 0,         // second in-progress
    img: series.img,                      // reuse hero for thumbs
    synopsis: 'Preview ·',
  }));
}

const BECAUSE = [
  { id: 'b1', title: 'Bad Banks',       sub: 'Financial thriller',    img: img('photo-1486406146926-c627a92ad1ab', 500, 720), kind: 'series', year: 2018, rating: 'FSK 12', genres: ['Thriller', 'Drama'],     seasons: 2, episodes: 6 },
  { id: 'b2', title: 'Deutschland 89',  sub: 'Espionage · 8 episodes', img: img('photo-1519389950473-47ba0277781c', 500, 720), kind: 'series', year: 2020, rating: 'FSK 12', genres: ['Espionage', 'Period'],  seasons: 1, episodes: 8 },
  { id: 'b3', title: 'Oktoberfest 1900',sub: 'Historical drama',       img: img('photo-1551836022-deb4988cc6c0', 500, 720), kind: 'series', year: 2020, rating: 'FSK 16', genres: ['Historical', 'Drama'],   seasons: 1, episodes: 6 },
  { id: 'b4', title: 'Unorthodox',      sub: 'Miniseries',             img: img('photo-1478760329108-5c3ed9d495a0', 500, 720), kind: 'series', year: 2020, rating: 'FSK 12', genres: ['Drama', 'Biography'],    seasons: 1, episodes: 4 },
];

// Listen
const STATIONS = [
  { id: 'r1', title: 'SRF 3', sub: 'Pop · Zürich', color: '#E30613', type: 'radio', live: 'Morgenshow' },
  { id: 'r2', title: 'Radio Energy', sub: 'Hits · Berlin', color: '#E40F0F', type: 'radio', live: 'The Drive' },
  { id: 'r3', title: 'Deutschlandfunk', sub: 'News · national', color: '#0066A3', type: 'radio', live: 'Informationen am Morgen' },
  { id: 'r4', title: 'BBC Radio 6', sub: 'Alternative · UK', color: '#D31333', type: 'radio', live: 'Lauren Laverne' },
  { id: 'r5', title: 'France Inter', sub: 'Talk · Paris', color: '#E3242B', type: 'radio', live: 'Le 7/9' },
  { id: 'r6', title: 'Radio Swiss Jazz', sub: 'Jazz · curated', color: '#0F3D5C', type: 'radio', live: 'Late Set' },
];

const PODCASTS = [
  { id: 'p1', title: 'Lage der Nation', sub: 'Philip Banse & Ulf Buermeyer', color: '#1a3a5c', img: img('photo-1478737270239-2f02b77fc618', 400, 400), new: 3 },
  { id: 'p2', title: 'Fest & Flauschig', sub: 'Jan Böhmermann & Olli Schulz', color: '#6a2a5c', img: img('photo-1485579149621-3123dd979885', 400, 400), new: 1 },
  { id: 'p3', title: 'Alles gesagt?', sub: 'ZEIT · marathon interviews', color: '#2a4a2c', img: img('photo-1589903308904-1010c2294adc', 400, 400) },
  { id: 'p4', title: 'Zeit Verbrechen', sub: 'True crime · ZEIT', color: '#3a1a1a', img: img('photo-1478737270239-2f02b77fc618', 400, 400), new: 2 },
  { id: 'p5', title: 'NDR Info · Coronavirus Update', sub: 'Weekly science debrief', color: '#0a3a4a', img: img('photo-1532012197267-da84d127e765', 400, 400) },
  { id: 'p6', title: 'Hotel Matze', sub: 'Matze Hielscher', color: '#4a3a1a', img: img('photo-1507003211169-0a1dd7228f2d', 400, 400), new: 1 },
];

// Read — editorial articles
const ARTICLES = [
  {
    id: 'a1',
    kicker: 'Essay',
    title: 'The Quiet Return of the Night Train',
    dek: 'A decade after nearly vanishing from European rails, sleeper trains are running again — and this time, they mean it.',
    author: 'Helena Voss',
    readTime: '14 min',
    img: img('photo-1474487548417-781cb71495f3', 900, 1100),
    section: 'TRAVEL',
    pullquote: '"We are finally learning to measure distance in hours of sleep rather than hours of impatience."',
    gated: true,
  },
  {
    id: 'a2',
    kicker: 'Profile',
    title: 'The Last Glassblower of Murano',
    dek: 'Giovanni Toffolo is 74. The furnace that has burned in his family for four generations will not outlive him.',
    author: 'Marco Ferretti',
    readTime: '22 min',
    img: img('photo-1528459801416-a9e53bbf4e17', 900, 1100),
    section: 'CULTURE',
    gated: true,
  },
  {
    id: 'a3',
    kicker: 'Reportage',
    title: 'Inside the Zürich Apartment That Lost Its Tenant to a Rounding Error',
    dek: 'How a three-character typo in a housing database displaced a family of four, and what it reveals about the governance of homes.',
    author: 'Adrien Baumann',
    readTime: '18 min',
    img: img('photo-1504711434969-e33886168f5c', 900, 1100),
    section: 'SOCIETY',
    gated: true,
  },
  {
    id: 'a4',
    kicker: 'Field notes',
    title: 'Forty-Eight Hours of Silence in Valle Verzasca',
    dek: 'A writer retreats from the noise and finds, eventually, that silence is not the absence of sound.',
    author: 'Nora Lehmann',
    readTime: '9 min',
    img: img('photo-1464822759023-fed622ff2c3b', 900, 1100),
    section: 'NATURE',
    gated: false,
  },
];

// Curated themes — editorial collections, each has a hero + related picks
const THEMES = [
  {
    id: 'th1',
    kicker: 'Some guys recommendation',
    title: 'Love it!',
    blurb: 'Some guyi\'s Streaming-Tipps für dich: Ihre eigene Dokuserie "Mai time is now" und die Serien "School of Champions" und „Schwarzes Gold".',
    hero: img('photo-1488161628813-04466f872be2', 900, 700),
    tint: '#0F6B6E',
    accent: '#C6E83C',
    picks: [
      { id: 'tp1', title: 'Schwarzes Gold', duration: '48 Min.', img: img('photo-1509316975850-ff9c5deb0cd9', 500, 320) },
      { id: 'tp2', kind: 'brand', label: 'it.', blurbBg: '#C6E83C', blurbFg: '#E5173F' },
      { id: 'tp1b', title: 'Mai time is now', duration: '36 Min.', img: img('photo-1516280440614-37939bbacd81', 500, 320) },
      { id: 'tp1c', title: 'School of Champions', duration: '42 Min.', img: img('photo-1517649763962-0c623066013b', 500, 320) },
      { id: 'tp1d', title: 'Backstage: Die Tour', duration: '25 Min.', img: img('photo-1470229722913-7c0e2dbbafd3', 500, 320) },
      { id: 'tp1e', title: 'Kurzinterview', duration: '8 Min.', img: img('photo-1524504388940-b1c1722653e1', 500, 320) },
    ],
  },
  {
    id: 'th2',
    kicker: 'Tierische Stadtbewohner',
    title: 'Taube, Fuchs & Co',
    blurb: 'Füchse, Waschbären, Tauben — faszinierend, niedlich, nervig? Diese Dokus zeigen, wie unsere tierischen Nachbarn durchs Stadtleben stromern und flattern.',
    hero: img('photo-1425082661705-1834bfd09dca', 900, 700),
    tint: '#111418',
    accent: '#F5F4F2',
    picks: [
      { id: 'tp3', title: 'Wüste, wilde Waschbär-Partys', duration: '28 Min.', img: img('photo-1497206365907-f5e630693df0', 500, 320) },
      { id: 'tp4', title: 'Entenglück auf Balkonien', duration: '43 Min.', img: img('photo-1551085254-e96b210db58a', 500, 320) },
      { id: 'tp4b', title: 'Füchse im Vorgarten', duration: '32 Min.', img: img('photo-1474511320723-9a56873867b5', 500, 320) },
      { id: 'tp4c', title: 'Taubenschlag Berlin', duration: '19 Min.', img: img('photo-1552728089-57bdde30beb3', 500, 320) },
      { id: 'tp4d', title: 'Krähen — die Genies', duration: '38 Min.', img: img('photo-1486365227551-f3f90034a57c', 500, 320) },
      { id: 'tp4e', title: 'Igel bei Nacht', duration: '24 Min.', img: img('photo-1444464666168-49d633b86797', 500, 320) },
    ],
  },
  {
    id: 'th3',
    kicker: 'Reise-Tricks für kleines Budget',
    title: 'Günstig unterwegs',
    blurb: 'Preiswert eine Reise planen? Die besten Tipps & Tricks für jede Urlaubsart. Außerdem coole Reiseziele für jedes Budget — von Städtetrip bis Campingplatz.',
    hero: img('photo-1502224562085-639556652f33', 900, 700),
    tint: '#1A2B3E',
    accent: '#F5F4F2',
    picks: [
      { id: 'tp5', title: 'Italien mit Interrail', duration: '30 Min.', img: img('photo-1528181304800-259b08848526', 500, 320) },
      { id: 'tp6', title: 'Bordeaux für unter 300 Euro', duration: '29 Min.', img: img('photo-1491557345352-5929e343eb89', 500, 320) },
      { id: 'tp6b', title: 'Campingplätze in Kroatien', duration: '34 Min.', img: img('photo-1504280390367-361c6d9f38f4', 500, 320) },
      { id: 'tp6c', title: 'Lissabon zu Fuß', duration: '26 Min.', img: img('photo-1555881400-74d7acaacd8b', 500, 320) },
      { id: 'tp6d', title: 'Budapest & Bäder', duration: '31 Min.', img: img('photo-1541849546-216549ae216d', 500, 320) },
      { id: 'tp6e', title: 'Slowenien mit dem Rad', duration: '40 Min.', img: img('photo-1464822759023-fed622ff2c3b', 500, 320) },
    ],
  },
];

Object.assign(window, { CLIPS, CONTINUE, LIVE_NOW, TRENDING, BECAUSE, STATIONS, PODCASTS, ARTICLES, THEMES, CHANNEL_LOGOS, SERIES_META, buildEpisodes, img });
