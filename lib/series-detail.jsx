// Series detail overlay — hero art + metadata + season selector + episode list
// Pattern follows ArticleView / Player: full-screen absolute overlay, dismiss via chevron.

function SeriesDetail({ series, onClose, onOpenPlayer, accent }) {
  const isMovie = series.kind === 'movie';
  const [season, setSeason] = React.useState(1);
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
          </div>
        </div>
      </div>

      {/* Play + actions row */}
      <div style={{ padding: '4px 20px 10px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={playPrimary} style={{
          flex: 1, height: 50, borderRadius: 8, border: 'none', cursor: 'pointer',
          background: DARK.text, color: '#0a0a0a',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: FONTS.ui, fontSize: 15, fontWeight: 700, letterSpacing: 0.2,
        }}>
          <svg width="14" height="14" viewBox="0 0 12 12"><path d="M2 1.5v9l8-4.5z" fill="#0a0a0a"/></svg>
          {isMovie ? 'Play' : 'Continue watching'}
        </button>
        <CircleIconBtn>{Icon.save ? Icon.save(18, DARK.text) : <span style={{ fontSize: 17, color: DARK.text }}>＋</span>}</CircleIconBtn>
        <CircleIconBtn>{Icon.more ? Icon.more(18, DARK.text) : <span style={{ fontSize: 17, color: DARK.text }}>⋯</span>}</CircleIconBtn>
      </div>

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

function CircleIconBtn({ children }) {
  return <button style={{
    width: 50, height: 50, borderRadius: 25,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer', color: DARK.text,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
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
