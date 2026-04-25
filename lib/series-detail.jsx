// Series detail overlay — hero art + metadata + season selector + episode list
// Pattern follows ArticleView / Player: full-screen absolute overlay, dismiss via chevron.

function SeriesDetail({ series, onClose, onOpenPlayer, accent }) {
  const isMovie = series.kind === 'movie';
  const isLive = series.kind === 'live' || series.kind === 'LIVE' || series.kind === 'broadcast';
  const [season, setSeason] = React.useState(1);
  const [saved, setSaved] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [download, setDownload] = React.useState({ state: 'idle', progress: 0 }); // idle | downloading | done
  const [shareOpen, setShareOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Download simulation — ramps 0 → 100 over ~2.4s, then holds at 'done'
  React.useEffect(() => {
    if (download.state !== 'downloading') return;
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + 4 + Math.random() * 6);
      setDownload({ state: 'downloading', progress: p });
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => setDownload({ state: 'done', progress: 100 }), 250);
      }
    }, 90);
    return () => clearInterval(id);
  }, [download.state]);

  const startDownload = () => {
    if (download.state === 'downloading') return;
    setDownload({ state: 'downloading', progress: 0 });
  };
  const saveAction = isLive ? 'recording' : 'watchlist';
  const handleSave = () => {
    setSaved(s => !s);
    const verb = saved ? 'Removed from' : 'Added to';
    const label = saveAction === 'recording' ? 'recordings' : 'watchlist';
    setToast(`${verb} ${label}`);
    setTimeout(() => setToast(null), 1800);
  };
  const meta = (SERIES_META && SERIES_META[series.id]) || {};
  const episodes = isMovie ? [] : buildEpisodes(series, season);
  const seasonCount = series.seasons || 1;

  // Scroll-linked hero parallax/fade
  const [scrollY, setScrollY] = React.useState(0);
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const h = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', h, { passive: true });
    return () => el.removeEventListener('scroll', h);
  }, []);

  const heroFade = Math.min(1, scrollY / 260);

  const playPrimary = () => {
    if (isMovie) {
      onOpenPlayer({ ...series, orientation: 'landscape', kind: 'VOD' });
      return;
    }
    const next = episodes.find(e => !e.watched) || episodes[0];
    onOpenPlayer({ ...next, title: `${series.title} — E${next.num}: ${next.title}`, orientation: 'landscape', kind: 'VOD' });
  };

  return (
    <div ref={scrollRef} style={{
      position: 'absolute', inset: 0, background: DARK.bg, zIndex: 50,
      overflowY: 'auto', color: DARK.text, fontFamily: FONTS.ui,
    }}>
      <style>{`
        @keyframes zt-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes zt-dl-bounce { 0%,100% { transform: translateY(0); opacity: 0.65; } 50% { transform: translateY(2px); opacity: 1; } }
        @keyframes zt-dl-pop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes zt-sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .zt-more-menu > button:last-child { border-bottom: none; }
      `}</style>
      {/* Hero — 2:3 poster cropped wide with gradient blend to bg */}
      <div style={{ position: 'relative', width: '100%', height: 460 }}>
        <img src={series.img} alt=""
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: `translateY(${scrollY * -0.3}px) scale(${1 + scrollY * 0.0006})`,
            transformOrigin: 'center top',
            filter: `brightness(${1 - heroFade * 0.4}) saturate(${1 - heroFade * 0.25})`,
          }}/>
        {/* Dark gradient scrim for legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom,
            rgba(10,10,10,0.35) 0%,
            rgba(10,10,10,0) 28%,
            rgba(10,10,10,0) 45%,
            ${DARK.bg} 96%)`,
          pointerEvents: 'none',
        }}/>
        {/* Close chevron */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 54, left: 16, width: 36, height: 36, borderRadius: 18,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(14px)',
          border: 'none', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3,
        }}>{Icon.chevronD(20, '#fff')}</button>
        {/* Share + save */}
        <div style={{ position: 'absolute', top: 54, right: 16, display: 'flex', gap: 8, zIndex: 3 }}>
          <HeaderIconBtn>{Icon.save ? Icon.save(18, '#fff') : <span style={{ fontSize: 16, color: '#fff' }}>＋</span>}</HeaderIconBtn>
          <HeaderIconBtn>{Icon.share ? Icon.share(18, '#fff') : <span style={{ fontSize: 16, color: '#fff' }}>↗</span>}</HeaderIconBtn>
        </div>

        {/* Title block, anchored to bottom of hero */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 22, padding: '0 20px',
        }}>
          <div style={{
            fontSize: 10, letterSpacing: 2.4, fontWeight: 700,
            textTransform: 'uppercase', color: accent.solid, marginBottom: 8,
          }}>{series.sub}</div>
          <div style={{
            fontFamily: FONTS.display, fontSize: 40, fontWeight: 400,
            letterSpacing: -0.8, lineHeight: 1.02, color: DARK.text,
            textShadow: '0 2px 24px rgba(0,0,0,0.5)',
          }}>{series.title}</div>
          <div style={{
            display: 'flex', gap: 8, marginTop: 10, fontSize: 11,
            color: 'rgba(255,255,255,0.85)', flexWrap: 'wrap',
          }}>
            <MetaChip>{series.year}</MetaChip>
            <MetaChip>{series.rating}</MetaChip>
            {isMovie
              ? series.duration && <MetaChip>{Math.floor(series.duration / 60)}h {series.duration % 60}m</MetaChip>
              : <MetaChip>{seasonCount === 1 ? '1 Season' : `${seasonCount} Seasons`}</MetaChip>}
            {(series.genres || []).slice(0, 2).map(g => <MetaChip key={g}>{g}</MetaChip>)}
            {download.state === 'done' && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 8px 3px 6px', borderRadius: 999,
                background: 'rgba(34,197,94,0.18)',
                border: '1px solid rgba(34,197,94,0.45)',
                color: '#4ade80', fontSize: 10.5, fontWeight: 600,
                letterSpacing: 0.1,
                animation: 'zt-fade-in .24s ease-out',
              }}>
                <svg width="11" height="11" viewBox="0 0 16 16">
                  <path d="M3.5 8.5l3 3 6-6" stroke="#4ade80" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Downloaded
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Play + actions row */}
      <div style={{ padding: '4px 20px 10px', display: 'flex', gap: 10, alignItems: 'center', position: 'relative' }}>
        <button onClick={playPrimary} style={{
          flex: 1, height: 50, borderRadius: 8, border: 'none', cursor: 'pointer',
          background: DARK.text, color: '#0a0a0a',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: FONTS.ui, fontSize: 15, fontWeight: 700, letterSpacing: 0.2,
        }}>
          <svg width="14" height="14" viewBox="0 0 12 12"><path d="M2 1.5v9l8-4.5z" fill="#0a0a0a"/></svg>
          {isMovie ? 'Play' : 'Continue watching'}
        </button>
        <CircleIconBtn onClick={handleSave} active={saved} accent={accent}>
          {saveAction === 'recording'
            ? <span style={{
                width: 14, height: 14, borderRadius: 7,
                background: saved ? accent.solid : '#ff3b30',
                boxShadow: saved ? `0 0 0 2px ${accent.solid}33` : 'none',
              }}/>
            : (Icon.bookmark
              ? Icon.bookmark(18, saved, saved ? accent.solid : DARK.text)
              : <span style={{ fontSize: 17, color: saved ? accent.solid : DARK.text }}>{saved ? '✓' : '＋'}</span>)
          }
        </CircleIconBtn>
        <CircleIconBtn onClick={() => setMoreOpen(o => !o)} active={moreOpen} accent={accent}>{Icon.more ? Icon.more(18, DARK.text) : <span style={{ fontSize: 17, color: DARK.text }}>⋯</span>}</CircleIconBtn>
        {moreOpen && (
          <>
            {/* backdrop to dismiss */}
            <div onClick={() => setMoreOpen(false)} style={{
              position: 'fixed', inset: 0, zIndex: 40,
            }}/>
            <div style={{
              position: 'absolute', top: 58, right: 20, zIndex: 41,
              minWidth: 180, background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, overflow: 'hidden',
              boxShadow: '0 14px 34px rgba(0,0,0,0.55)',
              animation: 'zt-fade-in .14s ease-out',
              fontFamily: FONTS.ui,
            }} className="zt-more-menu">
              <MoreMenuItem
                label="Download"
                icon={(
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 13h10" stroke={DARK.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                onClick={() => {
                  setMoreOpen(false);
                  startDownload();
                }}
              />
              <MoreMenuItem
                label="Share"
                icon={(
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v8m0-8l-3 3m3-3l3 3M3 10v3h10v-3" stroke={DARK.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                onClick={() => {
                  setMoreOpen(false);
                  setShareOpen(true);
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute', left: '50%', bottom: 110, transform: 'translateX(-50%)',
          background: 'rgba(20,20,20,0.95)', color: DARK.text,
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '10px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500,
          zIndex: 100, animation: 'zt-fade-in .2s ease-out',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: 3, background: accent.solid,
          }}/>
          {toast}
        </div>
      )}

      {/* Download progress banner — only while downloading; vanishes on complete (checkmark moves to metadata) */}
      {download.state === 'downloading' && (
        <div style={{
          position: 'absolute', left: 16, right: 16, bottom: 24,
          background: 'rgba(20,20,20,0.96)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12, padding: '12px 14px',
          zIndex: 60, fontFamily: FONTS.ui,
          boxShadow: '0 12px 34px rgba(0,0,0,0.55)',
          animation: 'zt-fade-in .2s ease-out',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 30, height: 30, flexShrink: 0, position: 'relative' }}>
            <svg width="30" height="30" viewBox="0 0 30 30" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="15" cy="15" r="12" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" fill="none"/>
              <circle cx="15" cy="15" r="12" stroke={accent.solid} strokeWidth="2.5" fill="none"
                strokeDasharray={2 * Math.PI * 12}
                strokeDashoffset={2 * Math.PI * 12 * (1 - download.progress / 100)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset .15s linear' }}/>
            </svg>
            <svg width="14" height="14" viewBox="0 0 14 14"
              style={{
                position: 'absolute', top: 8, left: 8,
                animation: 'zt-dl-bounce 0.9s ease-in-out infinite',
              }}>
              <path d="M7 2v7m0 0l-2.5-2.5M7 9l2.5-2.5M2.5 12h9"
                stroke={accent.solid} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: DARK.text,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              Downloading<span style={{ color: DARK.textDim, fontWeight: 500 }}>· {Math.round(download.progress)}%</span>
            </div>
            <div style={{ fontSize: 11, color: DARK.textDim, marginTop: 2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {series.title}
            </div>
          </div>
        </div>
      )}

      {/* Share bottom sheet */}
      {shareOpen && (
        <>
          <div onClick={() => setShareOpen(false)} style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)',
            zIndex: 110, animation: 'zt-fade-in .18s ease-out',
          }}/>
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 111,
            background: '#151515', borderTopLeftRadius: 20, borderTopRightRadius: 20,
            paddingBottom: 40, color: DARK.text, fontFamily: FONTS.ui,
            animation: 'zt-sheet-up .26s cubic-bezier(.2,.8,.2,1)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }}/>
            </div>
            {/* Title */}
            <div style={{ padding: '10px 20px 6px' }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 400, letterSpacing: -0.3 }}>Share</div>
              <div style={{ fontSize: 12, color: DARK.textDim, marginTop: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{series.title}</div>
            </div>
            {/* App row */}
            <div style={{
              display: 'flex', gap: 16, overflowX: 'auto', padding: '16px 20px 8px',
              scrollbarWidth: 'none',
            }}>
              {[
                { id: 'wa', label: 'WhatsApp', bg: '#25D366', fg: '#fff',
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M20.5 3.5A10.4 10.4 0 0012 .3C6.2.3 1.6 5 1.6 10.7c0 1.8.5 3.6 1.4 5.2L1.5 22l6.3-1.6a10.4 10.4 0 004.2.9c5.8 0 10.4-4.7 10.4-10.5 0-2.8-1.1-5.4-3-7.3zM12 19.3a8.6 8.6 0 01-4.4-1.2l-.3-.2-3.7 1 1-3.6-.2-.3a8.6 8.6 0 0113.5-10.6 8.4 8.4 0 012.5 6 8.5 8.5 0 01-8.4 8.5zm4.8-6.4c-.2-.1-1.5-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.7.9-.8 1-.2.2-.3.2-.5.1a7 7 0 01-3.6-3.2c-.3-.5.3-.4.7-1.4 0-.2 0-.4-.1-.5l-.9-2c-.2-.5-.4-.5-.6-.5h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2c0 1.3 1 2.6 1.1 2.8.1.2 1.9 3 4.7 4.2.7.3 1.2.5 1.6.6a4 4 0 001.7.1c.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.2-.3-.3-.5-.4z"/></svg> },
                { id: 'sg', label: 'Signal', bg: '#3A76F0', fg: '#fff',
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 00-8.6 15l-.8 3.4 3.4-.8A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.3.5.5-2.3-.2-.3A8 8 0 1112 20zm3-5h-6a.5.5 0 01-.5-.5V11a.5.5 0 01.5-.5h6a.5.5 0 01.5.5v3.5a.5.5 0 01-.5.5z"/></svg> },
                { id: 'sl', label: 'Slack', bg: '#4A154B', fg: '#fff',
                  icon: <svg width="22" height="22" viewBox="0 0 24 24"><path fill="#E01E5A" d="M6 15a2 2 0 110-4h2v2a2 2 0 01-2 2zm1-2v-2a2 2 0 114 0v5a2 2 0 11-4 0v-3z"/><path fill="#36C5F0" d="M9 6a2 2 0 11-4 0v-.5a2 2 0 014 0V6zm-.5 1h5a2 2 0 110 4h-5a2 2 0 010-4z" transform="translate(0 -.5)"/><path fill="#2EB67D" d="M18 9a2 2 0 110 4h-2v-2a2 2 0 012-2zm-1 2v2a2 2 0 11-4 0v-5a2 2 0 114 0v3z"/><path fill="#ECB22E" d="M15 18a2 2 0 114 0v.5a2 2 0 01-4 0V18zm.5-1h-5a2 2 0 110-4h5a2 2 0 010 4z" transform="translate(0 .5)"/></svg> },
                { id: 'em', label: 'Email', bg: '#2a2a2a', fg: DARK.text,
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={DARK.text} strokeWidth="1.8"/><path d="M3.5 6.5l8.5 6 8.5-6" stroke={DARK.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              ].map(app => (
                <button key={app.id} onClick={() => {
                  setShareOpen(false);
                  setToast(`Shared via ${app.label}`);
                  setTimeout(() => setToast(null), 1800);
                }} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  flexShrink: 0, padding: 0,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: app.bg, color: app.fg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>{app.icon}</div>
                  <div style={{ fontSize: 11, color: DARK.textDim }}>{app.label}</div>
                </button>
              ))}
            </div>
            {/* Copy Link row */}
            <div style={{ padding: '12px 20px 4px' }}>
              <button onClick={() => {
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                  setShareOpen(false);
                  setToast('Link copied');
                  setTimeout(() => setToast(null), 1800);
                }, 700);
              }} style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '14px 14px',
                color: DARK.text, cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: copied ? '#22c55e' : 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background .15s ease',
                }}>
                  {copied ? (
                    <svg width="18" height="18" viewBox="0 0 16 16">
                      <path d="M3.5 8.5l3 3 6-6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 15l6-6M8.5 13.5L7 15a3.5 3.5 0 01-5-5l3-3a3.5 3.5 0 015 0M15.5 10.5L17 9a3.5 3.5 0 015 5l-3 3a3.5 3.5 0 01-5 0" stroke={DARK.text} strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{copied ? 'Copied!' : 'Copy link'}</div>
                  <div style={{ fontSize: 11, color: DARK.textDim, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    zattoo.com/watch/{series.id}
                  </div>
                </div>
              </button>
            </div>
            {/* Cancel */}
            <button onClick={() => setShareOpen(false)} style={{
              display: 'block', margin: '12px 20px 0', width: 'calc(100% - 40px)',
              background: 'none', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '12px 0',
              color: DARK.text, fontSize: 14, fontWeight: 500, cursor: 'pointer',
              fontFamily: FONTS.ui,
            }}>Cancel</button>
          </div>
        </>
      )}

      {/* Synopsis */}
      <div style={{ padding: '10px 20px 4px' }}>
        <p style={{
          margin: 0, fontSize: 14, lineHeight: 1.55,
          color: 'rgba(255,255,255,0.82)',
          textWrap: 'pretty',
        }}>{meta.synopsis || 'A gripping new series. Watch the full season now on Zattoo.'}</p>
        {meta.creator && (
          <div style={{ fontSize: 11.5, color: DARK.textDim, marginTop: 10 }}>
            <span style={{ opacity: 0.6 }}>{isMovie ? 'Directed by' : 'Created by'}</span> <span style={{ color: DARK.text }}>{meta.creator}</span>
          </div>
        )}
        {meta.cast && (
          <div style={{ fontSize: 11.5, color: DARK.textDim, marginTop: 4 }}>
            <span style={{ opacity: 0.6 }}>Cast</span> <span style={{ color: DARK.text }}>{meta.cast.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Season selector + episode list — series only */}
      {!isMovie && (
        <>
          <div style={{ padding: '22px 20px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <SeasonPicker seasonCount={seasonCount} season={season} setSeason={setSeason}/>
            <div style={{ fontSize: 11, color: DARK.textDim }}>{episodes.length} episodes</div>
          </div>
          <div style={{ padding: '4px 0 16px' }}>
            {episodes.map((ep) => (
              <EpisodeRow
                key={ep.id}
                episode={ep}
                accent={accent}
                seriesTitle={series.title}
                onOpen={() => onOpenPlayer({
                  ...ep,
                  title: `${series.title} — E${ep.num}: ${ep.title}`,
                  orientation: 'landscape',
                  kind: 'VOD',
                })}
              />
            ))}
          </div>
        </>
      )}

      {/* Spacer for movies so "More like this" has breathing room */}
      {isMovie && <div style={{ height: 28 }}/>}

      {/* More like this */}
      <div style={{ padding: '10px 20px 0' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 400, letterSpacing: -0.3, marginBottom: 12 }}>More like this</div>
      </div>
      <div style={{
        padding: '0 20px 40px', display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
      }}>
        {TRENDING.filter(t => t.id !== series.id).slice(0, 6).map(t => (
          <div key={t.id} onClick={() => onOpenPlayer({ ...t, orientation: 'landscape', kind: 'VOD' })}
            style={{
              aspectRatio: '2 / 3', borderRadius: 6, overflow: 'hidden',
              background: DARK.bgCard, cursor: 'pointer',
              boxShadow: '0 10px 24px -10px rgba(0,0,0,0.6)',
            }}>
            <img src={t.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>
        ))}
      </div>
      <div style={{ height: 40 }}/>
    </div>
  );
}

// ── Subcomponents ──────────────────────────────────────────────

function MetaChip({ children }) {
  return <span style={{
    padding: '3px 8px', borderRadius: 3, fontSize: 10.5,
    background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
    letterSpacing: 0.3, fontWeight: 600,
  }}>{children}</span>;
}

function HeaderIconBtn({ children }) {
  return <button style={{
    width: 36, height: 36, borderRadius: 18,
    background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(14px)',
    border: 'none', color: '#fff', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>{children}</button>;
}

function MoreMenuItem({ label, icon, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: '12px 14px',
        background: hover ? 'rgba(255,255,255,0.06)' : 'transparent',
        border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)',
        color: DARK.text, fontSize: 14, fontWeight: 500,
        cursor: 'pointer', textAlign: 'left',
        transition: 'background .12s ease',
      }}>
      <span style={{ display: 'flex', width: 18, justifyContent: 'center' }}>{icon}</span>
      {label}
    </button>
  );
}

function CircleIconBtn({ children, onClick, active, accent }) {
  return <button onClick={onClick} style={{
    width: 50, height: 50, borderRadius: 25,
    background: active && accent ? `${accent.solid}22` : 'rgba(255,255,255,0.08)',
    border: '1px solid ' + (active && accent ? `${accent.solid}66` : 'rgba(255,255,255,0.1)'),
    cursor: 'pointer', color: DARK.text,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background .15s ease, border-color .15s ease',
  }}>{children}</button>;
}

function SeasonPicker({ seasonCount, season, setSeason }) {
  const [open, setOpen] = React.useState(false);
  if (seasonCount <= 1) {
    return <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 400, letterSpacing: -0.3 }}>Season 1</div>;
  }
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        color: DARK.text, fontFamily: FONTS.display, fontSize: 22, fontWeight: 400,
        letterSpacing: -0.3, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        Season {season}
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ opacity: 0.6 }}>
          <path d={open ? 'M2 7.5l4-4 4 4' : 'M2 4.5l4 4 4-4'} stroke={DARK.text} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 32, left: 0, zIndex: 5,
          background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 6, minWidth: 140, overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
        }}>
          {Array.from({ length: seasonCount }, (_, i) => i + 1).map(s => (
            <div key={s} onClick={() => { setSeason(s); setOpen(false); }} style={{
              padding: '10px 14px', cursor: 'pointer', fontSize: 13.5,
              background: s === season ? 'rgba(255,255,255,0.06)' : 'transparent',
              fontWeight: s === season ? 600 : 400,
            }}>Season {s}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function EpisodeRow({ episode, accent, onOpen }) {
  const watched = episode.watched;
  const inProgress = episode.progress > 0;
  return (
    <div onClick={onOpen} style={{
      display: 'flex', gap: 12, padding: '12px 20px', cursor: 'pointer',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Thumb 16:9 */}
      <div style={{
        width: 132, height: 74, flexShrink: 0, borderRadius: 4,
        overflow: 'hidden', position: 'relative', background: DARK.bgCard,
      }}>
        <img src={episode.img} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: watched ? 0.55 : 1 }}/>
        {/* Play overlay */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.18)',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="9" height="9" viewBox="0 0 12 12"><path d="M2.5 1.5v9l7.5-4.5z" fill="#fff"/></svg>
          </div>
        </div>
        {/* Progress bar */}
        {inProgress && (
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: 3,
            background: 'rgba(255,255,255,0.25)',
          }}>
            <div style={{ width: `${episode.progress * 100}%`, height: '100%', background: accent.solid }}/>
          </div>
        )}
      </div>
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          gap: 8, marginBottom: 3,
        }}>
          <div style={{
            fontSize: 13.5, fontWeight: 600, letterSpacing: -0.1,
            color: watched ? DARK.textDim : DARK.text,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{episode.num}. {episode.title}</div>
          <div style={{
            fontSize: 11, color: DARK.textDim, flexShrink: 0,
            fontVariantNumeric: 'tabular-nums',
          }}>{episode.duration} min</div>
        </div>
        <div style={{ fontSize: 11.5, color: DARK.textDim, lineHeight: 1.35,
          overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {inProgress
            ? `${Math.round(episode.progress * 100)}% watched · ${Math.round(episode.duration * (1 - episode.progress))} min left`
            : watched
              ? 'Watched'
              : 'Stream now on Zattoo.'
          }
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SeriesDetail });
