// Full-screen player — rich chrome, context-aware for Live vs VOD

function Player({ item, onClose, accent }) {
  const [showChrome, setShowChrome] = React.useState(true);
  const [playing, setPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0.28);
  const [showChannels, setShowChannels] = React.useState(false);
  const [showEPG, setShowEPG] = React.useState(false);
  const isLive = item?.kind === 'LIVE' || item?.viewers;
  const videoRef = React.useRef(null);
  const hlsRef   = React.useRef(null);

  // Set up HLS stream when item has a streamUrl
  React.useEffect(() => {
    const video = videoRef.current;
    const url   = item?.streamUrl;
    if (!video || !url) return;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play().catch(() => {});
    } else if (window.Hls?.isSupported()) {
      const hls = new window.Hls({ startLevel: -1, debug: false });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
    }
    return () => {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
      if (video) { video.pause(); video.src = ''; }
    };
  }, [item?.streamUrl]);

  // Sync play/pause state to video element
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || !item?.streamUrl) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing]);

  React.useEffect(() => {
    if (!showChrome) return;
    const t = setTimeout(() => setShowChrome(false), 4500);
    return () => clearTimeout(t);
  }, [showChrome]);

  if (!item) return null;

  const landscape = item?.orientation === 'landscape';
  // Device viewport inside the phone frame (iOS 390x844). When landscape, we
  // render at 844x390 and rotate 90deg so the player sits horizontally.
  const landscapeStyle = landscape ? {
    position: 'absolute', top: '50%', left: '50%',
    width: 844, height: 390,
    transform: 'translate(-50%, -50%) rotate(90deg)',
    transformOrigin: 'center center',
  } : { position: 'absolute', inset: 0 };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#000', zIndex: 80, overflow: 'hidden',
    }}>
    <div onClick={() => setShowChrome(s => !s)} style={{
      ...landscapeStyle, background: '#000', overflow: 'hidden',
    }}>
      {/* media */}
      {item.streamUrl ? (
        <video ref={videoRef} playsInline poster={item.img} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          filter: showChrome ? 'brightness(0.75)' : 'brightness(1)',
          transition: 'filter .3s',
        }}/>
      ) : (
        <img src={item.img} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          filter: showChrome ? 'brightness(0.75)' : 'brightness(1)',
          transition: 'filter .3s',
        }}/>
      )}

      {/* TOP */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '56px 16px 18px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
        opacity: showChrome ? 1 : 0, transition: 'opacity .25s',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{
          width: 38, height: 38, borderRadius: 19, border: 'none',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
          color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icon.chevronD(22, '#fff')}</button>
        <div style={{ flex: 1, textAlign: 'center', color: '#fff', fontFamily: FONTS.ui }}>
          <div style={{ fontSize: 10, letterSpacing: 1.4, opacity: 0.7, fontWeight: 600 }}>
            {isLive ? 'STREAMING · LIVE' : 'STREAMING'}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{item.channel || item.title}</div>
        </div>
        <button style={{
          width: 38, height: 38, borderRadius: 19, border: 'none',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
          color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icon.cast(18, '#fff')}</button>
      </div>

      {/* CENTER play/pause + skip */}
      {showChrome && (
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 44,
        }}>
          {!isLive && (
            <button onClick={(e) => e.stopPropagation()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', opacity: 0.85 }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M11 4L3 12l8 8V4zM20 4h-2v16h2V4z"/></svg>
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); setPlaying(p => !p); }} style={{
            width: 76, height: 76, borderRadius: 38, border: 'none',
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
          }}>
            {playing ? Icon.pause(28, '#fff') : Icon.play(28, '#fff')}
          </button>
          {!isLive && (
            <button onClick={(e) => e.stopPropagation()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', opacity: 0.85 }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M13 4l8 8-8 8V4zM4 4h2v16H4V4z"/></svg>
            </button>
          )}
        </div>
      )}

      {/* BOTTOM */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '48px 16px 40px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
        opacity: showChrome ? 1 : 0, transition: 'opacity .25s',
        color: '#fff', fontFamily: FONTS.ui,
      }} onClick={(e) => e.stopPropagation()}>

        {/* Title block */}
        <div style={{ marginBottom: 18, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              {item.channelLogo && <ChannelChip logo={item.channelLogo} color={item.channelColor} size={24} radius={5}/>}
              {isLive && Icon.live()}
              <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 600 }}>{item.channel || item.sub}</div>
            </div>
            <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.3, textWrap: 'balance' }}>
              {item.title}
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>{item.subtitle || item.sub}</div>
          </div>
          <button style={{
            background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
            color: '#fff', padding: '8px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>{Icon.heart(14, false, '#fff')} Save</button>
        </div>

        {/* Scrub */}
        <div style={{ marginBottom: 14 }}>
          {isLive ? (
            <div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.22)', borderRadius: 3, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, background: accent.solid, borderRadius: 3 }}/>
                <div style={{
                  position: 'absolute', left: `${progress * 100}%`, top: '50%', transform: 'translate(-50%, -50%)',
                  width: 12, height: 12, borderRadius: 6, background: accent.solid,
                  boxShadow: `0 0 0 4px ${accent.glow}`,
                }}/>
                <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 4, height: 12, background: '#fff', opacity: 0.5 }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginTop: 6, opacity: 0.7, fontFamily: FONTS.mono }}>
                <span>-{Math.round((1-progress) * 45)} min from live</span>
                <span>LIVE</span>
              </div>
            </div>
          ) : (
            <div>
              {/* chapters */}
              <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                {[0.22, 0.18, 0.24, 0.36].map((w, i) => {
                  const start = [0.22, 0.18, 0.24, 0.36].slice(0, i).reduce((a, b) => a + b, 0);
                  const end = start + w;
                  return (
                    <div key={i} style={{ flex: w, height: 3, background: 'rgba(255,255,255,0.22)', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                      {progress >= start && (
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(100, (progress - start) / w * 100)}%`, background: accent.solid }}/>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginTop: 6, opacity: 0.7, fontFamily: FONTS.mono }}>
                <span>12:34</span>
                <span style={{ opacity: 0.6 }}>Chapter 2 · The harbour</span>
                <span>48:15</span>
              </div>
            </div>
          )}
        </div>

        {/* Control row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
          <PlayerControl label="Channels" icon={Icon.tv(16, '#fff')} onClick={() => setShowChannels(true)}/>
          <PlayerControl label="EPG" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="15" rx="2"/>
              <path d="M3 10h18"/>
              <path d="M8 10v10"/>
              <path d="M14 10v10"/>
            </svg>
          } onClick={() => setShowEPG(true)}/>
          <PlayerControl label="Subs · DE" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 14h3M13 14h4"/></svg>
          }/>
          <PlayerControl label="HD" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6z"/></svg>
          }/>
          <PlayerControl label="More" icon={Icon.more(18, '#fff')}/>
        </div>
      </div>

      {/* Channel switcher drawer */}
      {showChannels && <ChannelDrawer onClose={() => setShowChannels(false)} accent={accent}/>}

      {/* EPG (electronic programme guide) */}
      {showEPG && <EPGDrawer onClose={() => setShowEPG(false)} accent={accent} onPickChannel={(ch) => { setShowEPG(false); }}/>}
    </div>
    </div>
  );
}

// Categories assigned to our LIVE_NOW items — infer from channel name
const CHANNEL_CATEGORIES = {
  'Sky Sport Bundesliga': 'Sports',
  'Tagesschau 24': 'News',
  'arte': 'Culture',
  'Eurosport 1': 'Sports',
};
// Extra channels so search/filter feel real
const EXTRA_CHANNELS = [
  { id: 'k1', channel: 'KiKA', title: 'Sendung mit der Maus', sub: 'LIVE · 14:00 to 14:30', viewers: '8.4k', cat: 'Kids', color: '#E30613' },
  { id: 'k2', channel: 'Nick Jr.', title: 'Paw Patrol', sub: 'LIVE · 14:15 to 14:45', viewers: '5.1k', cat: 'Kids', color: '#FFD200' },
  { id: 'n1', channel: 'n-tv', title: 'Nachrichten', sub: 'LIVE · 14:00 to 14:30', viewers: '9.8k', cat: 'News', color: '#E40F0F' },
  { id: 's1', channel: 'DAZN 1', title: 'Champions League Preview', sub: 'LIVE · until 15:00', viewers: '22.4k', cat: 'Sports', color: '#F8F32B' },
  { id: 'c1', channel: '3sat', title: 'Kulturzeit', sub: 'LIVE · 14:30 to 15:00', viewers: '3.2k', cat: 'Culture', color: '#CC0000' },
  { id: 'm1', channel: 'MTV', title: 'Top 20 Europe', sub: 'LIVE · until 16:00', viewers: '6.7k', cat: 'Music', color: '#FF6600' },
];

const CHANNEL_CATS = ['All', 'News', 'Sports', 'Kids', 'Culture', 'Music'];

function ChannelDrawer({ onClose, accent }) {
  const [query, setQuery] = React.useState('');
  const [cat, setCat] = React.useState('All');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const searchRef = React.useRef(null);

  React.useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const allChannels = React.useMemo(() => [
    ...LIVE_NOW.map(l => ({ ...l, cat: CHANNEL_CATEGORIES[l.channel] || 'General' })),
    ...EXTRA_CHANNELS,
  ], []);

  const filtered = allChannels.filter(c => {
    if (cat !== 'All' && c.cat !== cat) return false;
    if (query) {
      const q = query.toLowerCase();
      return c.channel.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.5)',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'rgba(18,18,22,0.96)', backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        maxHeight: '78%', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* STICKY HEADER */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 2,
          background: 'rgba(18,18,22,0.98)',
          backdropFilter: 'blur(30px)',
          padding: '10px 16px 12px',
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
        }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.22)', margin: '0 auto 12px' }}/>

          {/* Top row: title + search + filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 36 }}>
            {searchOpen ? (
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 12px',
                border: `1px solid rgba(255,255,255,0.08)`,
              }}>
                {Icon.search(16, 'rgba(255,255,255,0.55)')}
                <input
                  ref={searchRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search channels or shows"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: '#fff', fontFamily: FONTS.ui, fontSize: 14, fontWeight: 500,
                    minWidth: 0,
                  }}
                />
                <button onClick={() => { setQuery(''); setSearchOpen(false); }} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 0,
                  fontSize: 12, fontWeight: 600, fontFamily: FONTS.ui,
                }}>Cancel</button>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, color: '#fff', fontFamily: FONTS.display, fontSize: 20, letterSpacing: -0.3 }}>
                  Switch channel
                </div>
                <button onClick={() => setSearchOpen(true)} style={{
                  width: 36, height: 36, borderRadius: 18, border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.08)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }} aria-label="Search">
                  {Icon.search(17, '#fff')}
                </button>
                <button onClick={() => setFilterOpen(o => !o)} style={{
                  height: 36, padding: cat === 'All' ? '0 10px' : '0 12px', borderRadius: 18,
                  border: 'none', cursor: 'pointer',
                  background: cat === 'All' ? 'rgba(255,255,255,0.08)' : accent.solid,
                  color: '#fff', display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: FONTS.ui, fontSize: 12, fontWeight: 600,
                }} aria-label="Filter">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M6 12h12M10 18h4"/>
                  </svg>
                  {cat !== 'All' && <span>{cat}</span>}
                </button>
              </>
            )}
          </div>

          {/* Filter chips row */}
          {(filterOpen || cat !== 'All') && (
            <div style={{
              display: 'flex', gap: 6, overflowX: 'auto', marginTop: 10,
              scrollbarWidth: 'none', paddingBottom: 2,
            }}>
              {CHANNEL_CATS.map(c => (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: '6px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: cat === c ? accent.solid : 'rgba(255,255,255,0.08)',
                  color: cat === c ? '#fff' : 'rgba(255,255,255,0.8)',
                  fontFamily: FONTS.ui, fontSize: 11.5, fontWeight: 600, letterSpacing: 0.2,
                  flexShrink: 0,
                }}>{c}</button>
              ))}
            </div>
          )}
        </div>

        {/* SCROLLABLE LIST */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 16px 40px' }}>
          {filtered.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: 'rgba(255,255,255,0.5)', fontFamily: FONTS.ui, fontSize: 13,
            }}>
              No channels match "{query}"{cat !== 'All' ? ` in ${cat}` : ''}.
            </div>
          )}
          {filtered.map((l, i) => (
            <div key={l.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderBottom: i === filtered.length - 1 ? 'none' : `1px solid rgba(255,255,255,0.08)`,
              cursor: 'pointer',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 6, overflow: 'hidden', flexShrink: 0,
                background: l.color || '#1a1a20',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {l.img ? (
                  <img src={l.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                ) : (
                  <span style={{ color: '#fff', fontFamily: FONTS.ui, fontSize: 11, fontWeight: 800, letterSpacing: 0.4 }}>
                    {l.channel.split(' ').map(w => w[0]).join('').slice(0, 3)}
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0, color: '#fff' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 10, letterSpacing: 0.6, opacity: 0.7, fontWeight: 600 }}>{l.channel}</span>
                  <span style={{
                    fontSize: 9, letterSpacing: 0.4, fontWeight: 700,
                    padding: '1px 5px', borderRadius: 3,
                    background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
                  }}>{l.cat}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
                <div style={{ fontSize: 10.5, opacity: 0.6 }}>{l.sub}</div>
              </div>
              {Icon.live()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerControl({ label, icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', cursor: 'pointer', color: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      minWidth: 58,
    }}>
      {icon}
      <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.85 }}>{label}</span>
    </button>
  );
}

// ──────────────────────────────────────────────────────────────
// EPG — Electronic Programme Guide
// ──────────────────────────────────────────────────────────────

// 30-minute slot width, in px. Grid spans 13:00 → 00:00 = 22 slots.
const EPG_SLOT = 110;
const EPG_SLOT_MIN = 30;
const EPG_START_HOUR = 13;   // 13:00
const EPG_HOURS = 11;         // through 00:00
const EPG_ROW_H = 68;

// Synthetic programs per channel. Durations in 30-min slots.
// Programs are scheduled sequentially from 13:00.
const EPG_SCHEDULES = {
  'Sky Sport Bundesliga': [
    { t: 'Bundesliga Vorbericht',       d: 2, g: 'Sports' },
    { t: 'Bayern vs. Leipzig',          d: 4, g: 'Sports', live: true },
    { t: 'Analyse & Highlights',        d: 2, g: 'Sports' },
    { t: 'Dortmund vs. Leverkusen',     d: 4, g: 'Sports' },
    { t: 'Bundesliga Aktuell',          d: 2, g: 'News' },
    { t: 'Wiederholung',                d: 8, g: 'Sports' },
  ],
  'Tagesschau 24': [
    { t: 'Tagesschau',                  d: 1, g: 'News' },
    { t: 'Mittagsmagazin',              d: 2, g: 'News', live: true },
    { t: 'Wirtschaft',                  d: 1, g: 'News' },
    { t: 'Europa im Brennpunkt',        d: 2, g: 'Documentary' },
    { t: 'Tagesschau',                  d: 1, g: 'News' },
    { t: 'Tagesthemen',                 d: 2, g: 'News' },
    { t: 'Nachtmagazin',                d: 1, g: 'News' },
    { t: 'Weltspiegel',                 d: 2, g: 'Documentary' },
    { t: 'Phoenix Runde',               d: 2, g: 'Politics' },
    { t: 'Tagesschau Update',           d: 8, g: 'News' },
  ],
  'arte': [
    { t: 'Stadt Land Kunst',            d: 1, g: 'Culture' },
    { t: 'Re: Frankreich am Limit',     d: 2, g: 'Documentary' },
    { t: 'Mit offenen Karten',          d: 1, g: 'Politics' },
    { t: 'Das Leben der Oktopusse',     d: 2, g: 'Nature' },
    { t: 'Xenius',                      d: 1, g: 'Science' },
    { t: 'Arte Journal',                d: 1, g: 'News' },
    { t: 'Im Schatten des Vulkans',     d: 3, g: 'Documentary' },
    { t: 'Kurzschluss',                 d: 2, g: 'Culture' },
    { t: 'Tracks East',                 d: 2, g: 'Culture' },
    { t: '28 Minuten',                  d: 7, g: 'Politics' },
  ],
  'Eurosport 1': [
    { t: 'Snooker: World Open',         d: 4, g: 'Sports' },
    { t: 'Tennis: ATP Masters',         d: 4, g: 'Sports', live: true },
    { t: 'Radsport: Paris-Nice',        d: 3, g: 'Sports' },
    { t: 'Ski Alpin: Weltcup',          d: 2, g: 'Sports' },
    { t: 'Eurosport News',              d: 1, g: 'News' },
    { t: 'Motorsports Weekly',          d: 2, g: 'Sports' },
    { t: 'Highlights des Tages',        d: 6, g: 'Sports' },
  ],
  'SRF 1': [
    { t: '10 vor 10',                   d: 1, g: 'News' },
    { t: 'DOK: Schweizer Alpen',        d: 2, g: 'Documentary', live: true },
    { t: 'Tagesschau',                  d: 1, g: 'News' },
    { t: 'Meteo',                       d: 1, g: 'Weather' },
    { t: 'Tatort: Weiches Wasser',      d: 4, g: 'Crime' },
    { t: 'Schawinski',                  d: 2, g: 'Talk' },
    { t: 'Club',                        d: 3, g: 'Talk' },
    { t: 'SRF bi de Lüt',               d: 2, g: 'Documentary' },
    { t: 'Nachtclub',                   d: 6, g: 'Music' },
  ],
  'ProSieben': [
    { t: 'Galileo',                     d: 2, g: 'Entertainment' },
    { t: 'The Big Bang Theory',         d: 1, g: 'Comedy' },
    { t: 'Young Sheldon',               d: 1, g: 'Comedy', live: true },
    { t: 'Newstime',                    d: 1, g: 'News' },
    { t: 'Germany\'s Next Topmodel',    d: 4, g: 'Entertainment' },
    { t: 'Das Duell um die Welt',       d: 3, g: 'Entertainment' },
    { t: 'TV Total',                    d: 2, g: 'Comedy' },
    { t: 'Late Night Berlin',           d: 2, g: 'Talk' },
    { t: 'Nachtprogramm',               d: 6, g: 'Entertainment' },
  ],
  'ZDF': [
    { t: 'Heute Xpress',                d: 1, g: 'News' },
    { t: 'Die Rosenheim-Cops',          d: 2, g: 'Crime' },
    { t: 'Bares für Rares',             d: 3, g: 'Entertainment', live: true },
    { t: 'Wiso',                        d: 1, g: 'Consumer' },
    { t: 'heute',                       d: 1, g: 'News' },
    { t: 'Der Bergdoktor',              d: 3, g: 'Drama' },
    { t: 'heute journal',               d: 1, g: 'News' },
    { t: 'Markus Lanz',                 d: 3, g: 'Talk' },
    { t: 'heute nacht',                 d: 7, g: 'News' },
  ],
  'RTL': [
    { t: 'Punkt 12',                    d: 2, g: 'News' },
    { t: 'Alles was zählt',             d: 1, g: 'Drama' },
    { t: 'Gute Zeiten, schlechte Zeiten', d: 1, g: 'Drama' },
    { t: 'Das Supertalent',             d: 4, g: 'Entertainment', live: true },
    { t: 'RTL Aktuell',                 d: 1, g: 'News' },
    { t: 'Wer wird Millionär?',         d: 2, g: 'Entertainment' },
    { t: 'Stern TV',                    d: 2, g: 'News' },
    { t: 'RTL Nachtjournal',            d: 1, g: 'News' },
    { t: 'Nachtprogramm',               d: 8, g: 'Entertainment' },
  ],
};

function EPGDrawer({ onClose, accent, onPickChannel }) {
  // Current time mocked at 15:37 for a nice visible "now" line
  const nowMinutes = (15 - EPG_START_HOUR) * 60 + 37;
  const nowX = (nowMinutes / EPG_SLOT_MIN) * EPG_SLOT;

  const channels = Object.keys(EPG_SCHEDULES);
  const [selectedProgram, setSelectedProgram] = React.useState(null);

  // Scroll to keep "now" in view on open
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = Math.max(0, nowX - 260);
    }
  }, []);

  const fmtHour = (slotIdx) => {
    const mins = slotIdx * EPG_SLOT_MIN + EPG_START_HOUR * 60;
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const totalSlots = EPG_HOURS * 2;
  const timelineWidth = totalSlots * EPG_SLOT;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 5,
      background: 'rgba(10,10,12,0.96)', backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', color: '#fff',
      fontFamily: FONTS.ui,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px 10px', flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 2, fontWeight: 700, color: accent.text, opacity: 0.9 }}>
            ELECTRONIC PROGRAMME GUIDE
          </div>
          <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 400, letterSpacing: -0.4, marginTop: 2 }}>
            TV Guide <span style={{ fontStyle: 'italic', opacity: 0.55 }}>— today</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff', padding: '6px 12px', borderRadius: 999, fontSize: 11,
            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><rect x="1" y="2" width="10" height="9" rx="1" stroke="#fff" strokeWidth="1.2"/><path d="M1 5h10M4 1v2M8 1v2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Today
            <svg width="9" height="9" viewBox="0 0 12 12" style={{ opacity: 0.7 }}><path d="M2 4.5l4 4 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 17,
            background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div ref={scrollRef} style={{
        flex: 1, overflow: 'auto', position: 'relative',
        background: 'linear-gradient(180deg, #0a0a0c, #121214)',
      }}>
        <div style={{ position: 'relative', width: 120 + timelineWidth, minHeight: '100%' }}>
          {/* Sticky time ruler */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 3,
            display: 'flex', height: 34,
            background: 'rgba(12,12,14,0.95)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              position: 'sticky', left: 0, width: 120,
              background: 'rgba(12,12,14,0.98)',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              zIndex: 2,
            }}/>
            {Array.from({ length: totalSlots + 1 }, (_, i) => (
              <div key={i} style={{
                width: i === totalSlots ? 0 : EPG_SLOT, flexShrink: 0,
                fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.55)',
                padding: '10px 8px', borderLeft: i === 0 ? 'none' : '1px dashed rgba(255,255,255,0.06)',
                letterSpacing: 0.4,
              }}>
                {i < totalSlots && fmtHour(i)}
              </div>
            ))}
          </div>

          {/* Now indicator line */}
          <div style={{
            position: 'absolute', top: 34, left: 120 + nowX, width: 1, bottom: 0,
            background: accent.solid, zIndex: 2, pointerEvents: 'none',
            boxShadow: `0 0 8px ${accent.solid}`,
          }}>
            <div style={{
              position: 'absolute', top: -7, left: -17, height: 18,
              background: accent.solid, color: '#0a0a0c',
              fontSize: 9, fontWeight: 700, letterSpacing: 0.6,
              padding: '3px 6px', borderRadius: 3,
            }}>NOW · 15:37</div>
          </div>

          {/* Rows */}
          {channels.map(ch => {
            const programs = EPG_SCHEDULES[ch];
            let cursor = 0;
            return (
              <div key={ch} style={{
                display: 'flex', height: EPG_ROW_H,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                {/* Channel column (sticky left) */}
                <div style={{
                  position: 'sticky', left: 0, zIndex: 2, width: 120, flexShrink: 0,
                  background: 'rgba(12,12,14,0.98)',
                  borderRight: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '0 10px',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 6,
                    background: '#fff', flexShrink: 0, overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <img src={CHANNEL_LOGOS[ch]} alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.92)',
                    lineHeight: 1.2,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>{ch}</div>
                </div>
                {/* Timeline programs */}
                <div style={{ position: 'relative', flex: 1, height: '100%' }}>
                  {programs.map((p, idx) => {
                    const left = cursor * EPG_SLOT;
                    const width = p.d * EPG_SLOT;
                    cursor += p.d;
                    if (left > timelineWidth) return null;
                    const startMin = (left / EPG_SLOT) * EPG_SLOT_MIN;
                    const endMin = startMin + p.d * EPG_SLOT_MIN;
                    const isNow = nowMinutes >= startMin && nowMinutes < endMin;
                    const isPast = endMin <= nowMinutes;
                    return (
                      <div key={idx} onClick={() => setSelectedProgram({ ...p, channel: ch, startMin, endMin })}
                        style={{
                          position: 'absolute', top: 4, bottom: 4, left: left + 2, width: width - 4,
                          borderRadius: 4, padding: '6px 10px',
                          background: isNow ? `${accent.solid}22` : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isNow ? accent.solid + '88' : 'rgba(255,255,255,0.06)'}`,
                          cursor: 'pointer', overflow: 'hidden',
                          opacity: isPast ? 0.45 : 1,
                          display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        }}>
                        <div style={{
                          fontSize: 11.5, fontWeight: 600, color: '#fff',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{p.t}</div>
                        <div style={{
                          fontSize: 9.5, letterSpacing: 0.3, marginTop: 2,
                          color: isNow ? accent.solid : 'rgba(255,255,255,0.55)',
                          display: 'flex', alignItems: 'center', gap: 5,
                          textTransform: 'uppercase', fontWeight: 600,
                        }}>
                          {isNow && (
                            <span style={{
                              width: 5, height: 5, borderRadius: 5,
                              background: accent.solid,
                              boxShadow: `0 0 4px ${accent.solid}`,
                            }}/>
                          )}
                          {p.g}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected-program drawer */}
      {selectedProgram && (
        <ProgramSheet program={selectedProgram} accent={accent} onClose={() => setSelectedProgram(null)}/>
      )}
    </div>
  );
}

function ProgramSheet({ program, accent, onClose }) {
  const h = (m) => `${String(Math.floor(m / 60) + EPG_START_HOUR).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
      zIndex: 4, display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', background: '#1b1b1e', borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '18px 22px 20px', color: '#fff', fontFamily: FONTS.ui,
      }}>
        <div style={{
          fontSize: 10, letterSpacing: 1.6, fontWeight: 700,
          color: accent.text, textTransform: 'uppercase',
        }}>{program.channel} · {program.g}</div>
        <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 400, letterSpacing: -0.4, marginTop: 6 }}>
          {program.t}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
          {h(program.startMin)} – {h(program.endMin)} · {(program.endMin - program.startMin)} min
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={onClose} style={{
            flex: 1, height: 44, borderRadius: 8, border: 'none', cursor: 'pointer',
            background: '#fff', color: '#0a0a0c', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 1.5v9l8-4.5z" fill="#0a0a0c"/></svg>
            {program.live ? 'Watch live' : 'Tune in'}
          </button>
          <button style={{
            height: 44, padding: '0 16px', borderRadius: 8,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#fff" strokeWidth="1.2"/><path d="M6 3.5v2.5l1.6 1" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Remind me
          </button>
          <button style={{
            width: 44, height: 44, borderRadius: 8,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: '#E23744' }}/>
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Player });
