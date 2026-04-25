// Library — "My Library" tab
// Saved/bookmarked content clustered by type: Shows & Series, Live Channels,
// Podcasts, Stations, Articles, Clips. Editorial density to match Watch.

function LibraryPage({ accent, onOpenPlayer: onOpenPlayerRaw, onOpenArticle, setTab }) {
  const [filter, setFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('recent');
  const [genre, setGenre] = React.useState('all');
  const [sortOpen, setSortOpen] = React.useState(false);
  const [genreOpen, setGenreOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  // Library launches videos in landscape, matching Watch.
  const onOpenPlayer = (item) => onOpenPlayerRaw && onOpenPlayerRaw({
    ...item, kind: item?.kind || 'VOD', orientation: 'landscape',
  });

  // Curate bookmarked items from existing data so it feels populated
  const allSavedSeries = [TRENDING[0], BECAUSE[0], BECAUSE[1], TRENDING[2], BECAUSE[2], TRENDING[3]];
  const savedLive = LIVE_NOW.slice(0, 3);
  const savedPodcasts = PODCASTS.slice(0, 4);
  const savedStations = STATIONS.slice(0, 3);
  const savedArticles = ARTICLES.slice(0, 2);
  const savedClips = CLIPS.slice(0, 4);

  // Derived genre list from actual saved-series genres
  const GENRES = React.useMemo(() => {
    const set = new Set();
    allSavedSeries.forEach(s => (s.genres || []).forEach(g => set.add(g)));
    return ['All', ...Array.from(set)];
  }, []);

  const SORTS = [
    { k: 'recent',  label: 'Recently added' },
    { k: 'az',      label: 'A – Z' },
    { k: 'year',    label: 'Release year' },
    { k: 'watched', label: 'Most watched' },
  ];

  // Filter by genre, sort by key
  const filterSort = (arr) => {
    let out = arr.filter(s => genre === 'all' || (s.genres || []).includes(genre));
    const cmp = {
      recent:  (a, b) => 0, // input order
      az:      (a, b) => (a.title || '').localeCompare(b.title || ''),
      year:    (a, b) => (b.year || 0) - (a.year || 0),
      watched: (a, b) => ((b.episodes || 1) - (a.episodes || 1)),
    }[sortBy];
    return [...out].sort(cmp);
  };
  const savedSeries = filterSort(allSavedSeries);

  // Recordings — DVR-style list items
  const recordings = [
    { id: 'r1', title: 'Tagesschau',              channel: 'Das Erste',        sub: 'News · 15 min',           when: 'Yesterday · 20:00', img: img('photo-1586339949916-3e9457bef6d3', 400, 225), duration: 15,  new: true,  kind: 'VOD' },
    { id: 'r2', title: 'Bundesliga: BVB vs. FCB', channel: 'Sky Sport Bundesliga', sub: 'Football · Match of the Day', when: 'Sat 19:30',         img: img('photo-1551958219-acbc608c6377', 400, 225), duration: 118, kind: 'VOD' },
    { id: 'r3', title: 'Tatort: Weiches Wasser',  channel: 'SRF 1',            sub: 'Crime drama · 90 min',    when: 'Sun 20:05',         img: img('photo-1509281373149-e957c6296406', 400, 225), duration: 90,  kind: 'VOD' },
    { id: 'r4', title: 'Heute Journal',           channel: 'ZDF',              sub: 'News · 30 min',           when: '3 days ago',        img: img('photo-1504711434969-e33886168f5c', 400, 225), duration: 30,  kind: 'VOD' },
    { id: 'r5', title: 'Wetten, dass..?',         channel: 'ZDF',              sub: 'Entertainment · 180 min', when: 'Last Saturday',     img: img('photo-1514525253161-7a46d19cd819', 400, 225), duration: 180, kind: 'VOD' },
  ];

  const counts = {
    all: savedSeries.length + savedLive.length + recordings.length + savedPodcasts.length + savedStations.length + savedArticles.length + savedClips.length,
    watch: savedSeries.length + savedLive.length + recordings.length + savedClips.length,
    listen: savedPodcasts.length + savedStations.length,
    read: savedArticles.length,
  };

  const show = (type) => filter === 'all' || filter === type;

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'auto',
      background: DARK.bg, color: DARK.text,
      paddingBottom: 100,
    }}>
      {/* Header */}
      <div style={{ padding: '62px 20px 16px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <AvatarButton accent={accent} onClick={() => setMenuOpen(true)} dark/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FONTS.ui, fontSize: 10, letterSpacing: 2.4,
            textTransform: 'uppercase', fontWeight: 700, color: accent.text,
            marginBottom: 8,
          }}>My Library</div>
          <div style={{
            fontFamily: FONTS.display, fontSize: 40, fontWeight: 400,
            letterSpacing: -1.2, lineHeight: 1, color: DARK.text,
          }}>Saved<br/><span style={{ fontStyle: 'italic', opacity: 0.6 }}>for later.</span></div>
          <div style={{
            fontFamily: FONTS.ui, fontSize: 12, color: DARK.textMute,
            marginTop: 12,
          }}>{counts.all} items across {Object.keys(counts).filter(k => k!=='all' && counts[k]>0).length} categories</div>
        </div>
      </div>

      {menuOpen && <AccountMenu accent={accent} onClose={() => setMenuOpen(false)} dark/>}

      {/* Filter chips */}
      <div style={{
        display: 'flex', gap: 8, padding: '8px 20px 20px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {[
          { k: 'all',    label: 'All',    n: counts.all },
          { k: 'watch',  label: 'Watch',  n: counts.watch },
          { k: 'listen', label: 'Listen', n: counts.listen },
          { k: 'read',   label: 'Read',   n: counts.read },
        ].map(c => {
          const active = filter === c.k;
          return (
            <button key={c.k} onClick={() => setFilter(c.k)} style={{
              border: 'none', cursor: 'pointer', flexShrink: 0,
              padding: '8px 14px', borderRadius: 999,
              background: active ? accent.solid : 'rgba(255,255,255,0.06)',
              color: active ? '#0A0A0C' : DARK.textDim,
              fontFamily: FONTS.ui, fontSize: 12, fontWeight: 600,
              letterSpacing: 0.3,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {c.label}
              <span style={{
                fontSize: 10, fontWeight: 700, opacity: 0.7,
                fontVariantNumeric: 'tabular-nums',
              }}>{c.n}</span>
            </button>
          );
        })}
      </div>

      {/* Sort + Genre toolbar — only meaningful for Watch/All filter */}
      {(filter === 'all' || filter === 'watch') && (
        <div style={{
          display: 'flex', gap: 10, padding: '2px 20px 18px',
          alignItems: 'center', flexWrap: 'wrap',
        }}>
          <DropButton
            label="Sort"
            value={SORTS.find(s => s.k === sortBy).label}
            open={sortOpen}
            onToggle={() => { setSortOpen(o => !o); setGenreOpen(false); }}
            accent={accent}
          >
            {SORTS.map(s => (
              <DropItem key={s.k} active={s.k === sortBy} onClick={() => { setSortBy(s.k); setSortOpen(false); }}>
                {s.label}
              </DropItem>
            ))}
          </DropButton>

          <DropButton
            label="Genre"
            value={genre === 'all' ? 'All' : genre}
            open={genreOpen}
            onToggle={() => { setGenreOpen(o => !o); setSortOpen(false); }}
            accent={accent}
          >
            {GENRES.map(g => {
              const key = g === 'All' ? 'all' : g;
              return (
                <DropItem key={g} active={key === genre} onClick={() => { setGenre(key); setGenreOpen(false); }}>
                  {g}
                </DropItem>
              );
            })}
          </DropButton>

          {(sortBy !== 'recent' || genre !== 'all') && (
            <button onClick={() => { setSortBy('recent'); setGenre('all'); }} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: DARK.textMute, fontFamily: FONTS.ui, fontSize: 11,
              letterSpacing: 0.3, padding: '6px 4px',
            }}>Reset</button>
          )}
        </div>
      )}

      {/* Recordings cluster — DVR */}
      {show('watch') && recordings.length > 0 && (
        <Cluster
          label="Recordings"
          count={recordings.length}
          accent={accent}
          trailing={<StorageMeter used={3.2} total={50}/>}
        >
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recordings.map(r => (
              <button key={r.id} onClick={() => onOpenPlayer(r)} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid ' + DARK.hairline,
                borderRadius: 10, padding: 10, cursor: 'pointer',
                display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left',
              }}>
                <div style={{
                  width: 104, height: 64, borderRadius: 4, flexShrink: 0,
                  backgroundImage: `url(${r.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  position: 'relative',
                }}>
                  {/* Red REC dot */}
                  <div style={{
                    position: 'absolute', top: 4, left: 4,
                    display: 'flex', alignItems: 'center', gap: 3,
                    background: 'rgba(0,0,0,0.55)', padding: '2px 5px',
                    borderRadius: 2,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: 5, background: '#E23744' }}/>
                    <span style={{ fontFamily: FONTS.ui, fontSize: 8, fontWeight: 700, color: '#fff', letterSpacing: 0.6 }}>REC</span>
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 4, right: 4,
                    fontFamily: FONTS.mono, fontSize: 9, fontWeight: 600,
                    color: '#fff', background: 'rgba(0,0,0,0.65)',
                    padding: '1px 5px', borderRadius: 2,
                  }}>{r.duration}m</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: FONTS.ui, fontSize: 10, letterSpacing: 1.4,
                    textTransform: 'uppercase', fontWeight: 700, color: accent.text,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {r.channel}
                    {r.new && <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: 1,
                      background: accent.soft, color: accent.solid,
                      padding: '2px 5px', borderRadius: 2,
                    }}>NEW</span>}
                  </div>
                  <div style={{
                    fontFamily: FONTS.ui, fontSize: 14, fontWeight: 600,
                    color: DARK.text, marginTop: 2,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{r.title}</div>
                  <div style={{ fontFamily: FONTS.ui, fontSize: 11, color: DARK.textMute, marginTop: 2 }}>
                    {r.sub} · <span style={{ color: DARK.textDim }}>{r.when}</span>
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M8 6l8 6-8 6" stroke={DARK.textMute} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        </Cluster>
      )}

      {/* Clusters */}
      {show('watch') && (
        <Cluster label="Shows & Series" count={savedSeries.length} accent={accent}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: '0 20px' }}>
            {savedSeries.map(s => (
              <button key={s.id} onClick={() => onOpenPlayer({ ...s, kind: 'vod' })} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, textAlign: 'left',
              }}>
                <div style={{
                  width: '100%', aspectRatio: '2/3', borderRadius: 6,
                  backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 26, height: 26, borderRadius: 13,
                    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{Icon.bookmark(14, true, accent.solid)}</div>
                </div>
                <div style={{ fontFamily: FONTS.ui, fontSize: 13, fontWeight: 600, marginTop: 8, color: DARK.text }}>{s.title}</div>
                <div style={{ fontFamily: FONTS.ui, fontSize: 11, color: DARK.textMute, marginTop: 2 }}>{s.sub}</div>
              </button>
            ))}
          </div>
        </Cluster>
      )}

      {show('watch') && (
        <Cluster label="Live Channels" count={savedLive.length} accent={accent}>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {savedLive.map(l => (
              <button key={l.id} onClick={() => onOpenPlayer({ ...l, kind: 'live' })} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid ' + DARK.hairline,
                borderRadius: 10, padding: 10, cursor: 'pointer',
                display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left',
              }}>
                <div style={{
                  width: 88, height: 56, borderRadius: 4,
                  backgroundImage: `url(${l.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  flexShrink: 0, position: 'relative',
                }}>
                  <div style={{ position: 'absolute', top: 4, left: 4 }}>{Icon.live()}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: FONTS.ui, fontSize: 10, letterSpacing: 1.4,
                    textTransform: 'uppercase', fontWeight: 700, color: accent.text,
                  }}>{l.channel}</div>
                  <div style={{
                    fontFamily: FONTS.ui, fontSize: 14, fontWeight: 600,
                    color: DARK.text, marginTop: 2, whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{l.title}</div>
                  <div style={{ fontFamily: FONTS.ui, fontSize: 11, color: DARK.textMute, marginTop: 2 }}>{l.sub}</div>
                </div>
                {Icon.bookmark(18, true, accent.solid)}
              </button>
            ))}
          </div>
        </Cluster>
      )}

      {show('watch') && (
        <Cluster label="Clips to Watch" count={savedClips.length} accent={accent}>
          <div style={{ display: 'flex', gap: 10, padding: '0 20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {savedClips.map(c => (
              <div key={c.id} style={{
                flexShrink: 0, width: 124, cursor: 'pointer',
              }}>
                <div style={{
                  width: 124, height: 180, borderRadius: 6, overflow: 'hidden',
                  backgroundImage: `url(${c.img || c.poster})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                  }}/>
                  <div style={{ position: 'absolute', top: 6, right: 6 }}>
                    {Icon.bookmark(14, true, accent.solid)}
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 6, left: 6,
                    fontFamily: FONTS.mono, fontSize: 9, fontWeight: 600,
                    color: '#fff', background: 'rgba(0,0,0,0.6)',
                    padding: '2px 5px', borderRadius: 3,
                  }}>{c.duration || '0:30'}</div>
                </div>
                <div style={{ fontFamily: FONTS.ui, fontSize: 11, fontWeight: 600, color: DARK.text, marginTop: 6, lineHeight: 1.3,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{c.title}</div>
              </div>
            ))}
          </div>
        </Cluster>
      )}

      {show('listen') && (
        <Cluster label="Podcasts" count={savedPodcasts.length} accent={accent}>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {savedPodcasts.map(p => (
              <div key={p.id} style={{
                display: 'flex', gap: 12, alignItems: 'center',
                padding: 8, borderRadius: 10,
                background: 'rgba(255,255,255,0.03)', border: '1px solid ' + DARK.hairline,
                cursor: 'pointer',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 6, flexShrink: 0,
                  backgroundImage: `url(${p.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONTS.ui, fontSize: 14, fontWeight: 600, color: DARK.text,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                  <div style={{ fontFamily: FONTS.ui, fontSize: 11, color: DARK.textMute, marginTop: 2 }}>{p.sub}</div>
                  {p.new ? (
                    <div style={{
                      display: 'inline-block', marginTop: 4,
                      fontFamily: FONTS.ui, fontSize: 9, letterSpacing: 1, fontWeight: 700,
                      color: accent.solid, background: accent.soft,
                      padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase',
                    }}>{p.new} new</div>
                  ) : null}
                </div>
                {Icon.bookmark(18, true, accent.solid)}
              </div>
            ))}
          </div>
        </Cluster>
      )}

      {show('listen') && (
        <Cluster label="Radio Stations" count={savedStations.length} accent={accent}>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {savedStations.map(s => (
              <div key={s.id} style={{
                display: 'flex', gap: 12, alignItems: 'center',
                padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)', border: '1px solid ' + DARK.hairline,
                cursor: 'pointer',
              }}>
                <ChannelChip logo={s.title.split(' ')[0].slice(0,3).toUpperCase()} color={s.color} size={36} radius={8}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONTS.ui, fontSize: 14, fontWeight: 600, color: DARK.text }}>{s.title}</div>
                  <div style={{ fontFamily: FONTS.ui, fontSize: 11, color: DARK.textMute, marginTop: 1 }}>
                    <span style={{ color: accent.text }}>●</span> On air · {s.live}
                  </div>
                </div>
                {Icon.bookmark(18, true, accent.solid)}
              </div>
            ))}
          </div>
        </Cluster>
      )}

      {show('read') && (
        <Cluster label="Articles to Read" count={savedArticles.length} accent={accent}>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {savedArticles.map(a => (
              <button key={a.id} onClick={() => { setTab && setTab('read'); onOpenArticle && onOpenArticle(a); }} style={{
                background: PAPER.bg, border: 'none', borderRadius: 10,
                padding: 14, cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: 6,
                position: 'relative',
              }}>
                <div style={{
                  fontFamily: FONTS.editorialSans, fontSize: 10, letterSpacing: 1.6,
                  textTransform: 'uppercase', fontWeight: 700, color: PAPER.inkMute,
                }}>{a.section || a.kicker || 'Feature'}</div>
                <div style={{
                  fontFamily: FONTS.editorial, fontSize: 18, fontWeight: 500,
                  color: PAPER.ink, letterSpacing: -0.2, lineHeight: 1.2,
                  paddingRight: 28,
                }}>{a.title || a.headline}</div>
                {a.byline && (
                  <div style={{ fontFamily: FONTS.editorialSans, fontSize: 11, color: PAPER.inkMute, fontStyle: 'italic' }}>{a.byline}</div>
                )}
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  {Icon.bookmark(16, true, accent.solid)}
                </div>
              </button>
            ))}
          </div>
        </Cluster>
      )}

      <div style={{ height: 20 }}/>
    </div>
  );
}

function Cluster({ label, count, accent, children, trailing }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        padding: '0 20px 12px', gap: 10,
      }}>
        <div style={{
          fontFamily: FONTS.display, fontSize: 22, fontWeight: 400,
          letterSpacing: -0.4, color: DARK.text,
        }}>{label}</div>
        {trailing ? trailing : (
          <div style={{
            fontFamily: FONTS.ui, fontSize: 10, letterSpacing: 1.4,
            fontWeight: 700, color: DARK.textMute, textTransform: 'uppercase',
            fontVariantNumeric: 'tabular-nums',
          }}>{count} saved</div>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Sort / Genre dropdown ─────────────────────────────────────

function DropButton({ label, value, open, onToggle, accent, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={onToggle} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 12px', borderRadius: 999,
        background: open ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
        border: '1px solid ' + (open ? 'rgba(255,255,255,0.18)' : DARK.hairline),
        color: DARK.text, fontFamily: FONTS.ui, fontSize: 12, fontWeight: 500,
        cursor: 'pointer', letterSpacing: 0.1,
      }}>
        <span style={{ color: DARK.textMute }}>{label}:</span>
        <span style={{ fontWeight: 600 }}>{value}</span>
        <svg width="10" height="10" viewBox="0 0 12 12" style={{ opacity: 0.6 }}>
          <path d={open ? 'M2 7.5l4-4 4 4' : 'M2 4.5l4 4 4-4'} stroke={DARK.text} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 38, left: 0, zIndex: 10, minWidth: 180,
          background: '#161616', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, padding: 4, overflow: 'hidden',
          boxShadow: '0 18px 40px rgba(0,0,0,0.55)',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

function DropItem({ active, onClick, children }) {
  return (
    <div onClick={onClick} style={{
      padding: '9px 12px', borderRadius: 5, cursor: 'pointer',
      fontFamily: FONTS.ui, fontSize: 13,
      color: active ? DARK.text : 'rgba(255,255,255,0.82)',
      background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
      fontWeight: active ? 600 : 400,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {children}
      {active && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>✓</span>}
    </div>
  );
}

function StorageMeter({ used, total }) {
  const pct = Math.min(1, used / total);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 60, height: 4, borderRadius: 2,
        background: 'rgba(255,255,255,0.1)', overflow: 'hidden',
      }}>
        <div style={{ width: `${pct * 100}%`, height: '100%', background: DARK.text, opacity: 0.85 }}/>
      </div>
      <div style={{
        fontFamily: FONTS.ui, fontSize: 10, letterSpacing: 0.4,
        fontWeight: 600, color: DARK.textMute,
        fontVariantNumeric: 'tabular-nums',
      }}>{used} / {total} GB</div>
    </div>
  );
}

Object.assign(window, { LibraryPage });
