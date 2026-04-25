// Listen — radio + podcasts, dark, mini-player

function ListenPage({ accent, playing, setPlaying }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', background: DARK.bg, color: DARK.text, fontFamily: FONTS.ui }}>
      {/* header */}
      <div style={{ padding: '62px 16px 10px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <AvatarButton accent={accent} onClick={() => setMenuOpen(true)} dark/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, letterSpacing: 2.2, textTransform: 'uppercase', opacity: 0.55, fontWeight: 600 }}>Listen</div>
          <div style={{ fontFamily: FONTS.display, fontSize: 30, fontWeight: 400, letterSpacing: -0.6, marginTop: 4 }}>Radio & Podcasts</div>
        </div>
      </div>

      {menuOpen && <AccountMenu accent={accent} onClose={() => setMenuOpen(false)} dark/>}

      {/* chips */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 16px 22px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['All', 'Radio', 'Podcasts', 'News', 'Music', 'Culture', 'Sports'].map((c, i) => (
          <div key={c} style={{
            padding: '7px 14px', borderRadius: 999,
            background: i === 0 ? accent.solid : DARK.bgCard,
            color: i === 0 ? '#fff' : DARK.textDim,
            fontSize: 12, fontWeight: 600, flexShrink: 0, cursor: 'pointer',
          }}>{c}</div>
        ))}
      </div>

      {/* Now Playing banner */}
      {playing && (
        <div style={{
          margin: '0 16px 28px', padding: 16, borderRadius: 14,
          background: `linear-gradient(135deg, ${playing.color || accent.solidLo} 0%, rgba(0,0,0,0.4) 120%)`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 68, height: 68, borderRadius: 8,
              background: playing.img ? `url(${playing.img}) center/cover` : playing.color,
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
            }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase', fontWeight: 600, opacity: 0.8 }}>Now playing</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>{playing.title}</div>
              <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>{playing.live || playing.sub}</div>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {Icon.pause(16, '#000')}
            </div>
          </div>
        </div>
      )}

      {/* Radio Stations */}
      <SectionHeader label="Local radio" kicker="Stations · near you" accent={accent}/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
        {STATIONS.map(s => (
          <div key={s.id} onClick={() => setPlaying(s)} style={{
            background: DARK.bgCard, borderRadius: 12, padding: 14, cursor: 'pointer',
            border: `1px solid ${DARK.hairline}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 6, background: s.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 10, letterSpacing: 0.5,
              }}>{s.title.split(' ').map(w => w[0]).join('').slice(0, 3)}</div>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: accent.soft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Icon.play(10, accent.solid)}
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{s.title}</div>
            <div style={{ fontSize: 10.5, color: DARK.textDim, marginTop: 2 }}>{s.sub}</div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: accent.solid, fontWeight: 600 }}>
              <span style={{ width: 5, height: 5, borderRadius: 5, background: accent.solid }}/>
              LIVE · {s.live}
            </div>
          </div>
        ))}
      </div>

      {/* Podcasts — larger cover tiles */}
      <SectionHeader label="Podcasts" kicker="New this week" accent={accent}/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
        {PODCASTS.map(p => (
          <div key={p.id} onClick={() => setPlaying(p)} style={{ cursor: 'pointer' }}>
            <div className="zt-streamable" style={{
              width: '100%', aspectRatio: '1', borderRadius: 10, overflow: 'hidden',
              background: p.color, position: 'relative',
              boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
            }}>
              <img src={p.img} style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'luminosity', opacity: 0.9 }}/>
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, transparent 40%, ${p.color}cc)` }}/>
              <div style={{ position: 'absolute', left: 10, bottom: 10, right: 10, color: '#fff' }}>
                <div style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 500, lineHeight: 1.15, textWrap: 'balance' }}>{p.title}</div>
              </div>
              {p.new && (
                <div style={{ position: 'absolute', top: 8, right: 8, background: accent.solid, color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
                  {p.new} NEW
                </div>
              )}
            </div>
            <div style={{ fontSize: 10.5, color: DARK.textDim, marginTop: 6 }}>{p.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ height: playing ? 200 : 120 }}/>
    </div>
  );
}

// Mini-player bar at the bottom (sits above nav)
function MiniPlayer({ track, onStop, accent }) {
  if (!track) return null;
  return (
    <div style={{
      position: 'absolute', left: 8, right: 8, bottom: 78, zIndex: 35,
      background: 'rgba(24,24,28,0.92)',
      backdropFilter: 'blur(20px) saturate(160%)',
      borderRadius: 14, padding: '10px 12px',
      display: 'flex', alignItems: 'center', gap: 12,
      border: `1px solid ${DARK.hairlineStrong}`,
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 6,
        background: track.img ? `url(${track.img}) center/cover` : track.color || '#333',
        flexShrink: 0,
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONTS.ui, fontSize: 12.5, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
        <div style={{ fontSize: 10, color: DARK.textDim, display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
          <span style={{ width: 5, height: 5, borderRadius: 5, background: accent.solid }}/>
          LIVE
        </div>
      </div>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 4 }}>
        {Icon.pause(14)}
      </button>
      <button onClick={onStop} style={{ background: 'none', border: 'none', cursor: 'pointer', color: DARK.textDim, padding: 4 }}>
        {Icon.close(14)}
      </button>
    </div>
  );
}

Object.assign(window, { ListenPage, MiniPlayer });
