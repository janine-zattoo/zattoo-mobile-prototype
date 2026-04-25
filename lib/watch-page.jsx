// Watch — 4You page
// Editorial density: mini clip-hero + bold themed carousels.

function WatchPage({ accent, onOpenFeed, onOpenPlayer: onOpenPlayerRaw, onOpenSeries }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  // Every playable item from Watch launches horizontally (landscape).
  // Only the clip-feed hero (Today's Highlights) stays portrait.
  const onOpenPlayer = (item) => onOpenPlayerRaw && onOpenPlayerRaw({
    ...item, kind: item?.kind || 'VOD', orientation: 'landscape',
  });
  return (
    <div style={{
      position: 'absolute', inset: 0, overflowY: 'auto',
      background: DARK.bg, color: DARK.text,
      fontFamily: FONTS.ui,
    }}>
      {/* Top hero strip: Clip feed preview card — tap to enter full feed */}
      <div style={{ padding: '62px 16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <AvatarButton accent={accent} onClick={() => setMenuOpen(true)} dark={true}/>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: 2.2, textTransform: 'uppercase', opacity: 0.55, fontWeight: 600 }}>Monday · 14:32</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 400, letterSpacing: -0.6, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Guten Tag, Lena.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: DARK.bgCard, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Icon.search(18, DARK.textDim)}
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: DARK.bgCard, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Icon.cast(18, DARK.textDim)}
          </div>
        </div>
      </div>

      {menuOpen && <AccountMenu accent={accent} onClose={() => setMenuOpen(false)}/>}

      {/* Clip Feed Hero — big tappable entry */}
      <div onClick={onOpenFeed} className="zt-streamable" style={{
        marginBottom: 20, aspectRatio: '1 / 1', overflow: 'hidden',
        position: 'relative', cursor: 'pointer', background: '#000',
      }}>
        <img src={CLIPS[0].img} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.75) 100%)' }}/>
        <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6 }}>
          {Icon.live()}
          <GlassPill dark>48.2k watching</GlassPill>
        </div>
        <div style={{ position: 'absolute', top: 14, right: 14 }}>
          <div style={{
            padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.14)',
            backdropFilter: 'blur(12px)', fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase',
          }}>▶ Clip feed · 6 new</div>
        </div>
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.3, marginBottom: 8, textWrap: 'balance' }}>
            Swipe to explore today's highlights
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: i === 0 ? accent.solid : 'rgba(255,255,255,0.22)' }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Live channel stories — Instagram-style ring row */}
      <div style={{
        display: 'flex', gap: 14, overflowX: 'auto',
        padding: '4px 16px 20px', scrollbarWidth: 'none',
      }}>
        {LIVE_NOW.concat([
          { id: 'st5', channel: 'SRF 1',      channelLogo: 'SRF', channelColor: '#E30613' },
          { id: 'st6', channel: 'ProSieben',  channelLogo: 'P7',  channelColor: '#E40F0F' },
          { id: 'st7', channel: 'ZDF',        channelLogo: 'ZDF', channelColor: '#FA7D19' },
          { id: 'st8', channel: 'RTL',        channelLogo: 'RTL', channelColor: '#E2001A' },
        ]).map((s, i) => {
          const color = s.channelColor || accent.solid;
          const isLive = i < LIVE_NOW.length;
          const logoUrl = CHANNEL_LOGOS[s.channel];
          return (
            <div key={s.id} onClick={() => onOpenPlayer && onOpenPlayer({ ...s, kind: 'LIVE', fullscreen: true, orientation: 'landscape' })} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 6, flexShrink: 0, width: 68, cursor: 'pointer',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 32, padding: 2.5,
                background: '#FFFFFF',
                border: `1px solid ${DARK.hairline}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {logoUrl ? (
                    <img src={logoUrl} alt={s.channel} style={{
                      width: '72%', height: '72%', objectFit: 'contain',
                    }}/>
                  ) : (
                    <div style={{
                      fontFamily: FONTS.ui, fontWeight: 800, fontSize: 12,
                      color, letterSpacing: 0.3,
                    }}>{s.channelLogo || s.channel}</div>
                  )}
                </div>
              </div>
              <div style={{
                fontSize: 10.5, color: DARK.textDim, fontWeight: 500,
                maxWidth: 68, overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', textAlign: 'center',
              }}>{s.channel}</div>
            </div>
          );
        })}
      </div>

      {/* Section: Continue Watching — landscape tiles with progress */}
      <SectionHeader label="Continue" kicker="Pick up where you left" accent={accent}/>
      <HScroll>
        {CONTINUE.map(it => (
          <div key={it.id} onClick={() => onOpenPlayer(it)} style={{
            width: 260, flexShrink: 0, cursor: 'pointer',
          }}>
            <div className="zt-streamable" style={{ position: 'relative', height: 150, borderRadius: 10, overflow: 'hidden', background: DARK.bgCard }}>
              <img src={it.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent 50%)' }}/>
              <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
                <div style={{ height: 2, background: 'rgba(255,255,255,0.22)', borderRadius: 2, marginBottom: 8 }}>
                  <div style={{ width: `${it.progress * 100}%`, height: '100%', background: accent.solid, borderRadius: 2 }}/>
                </div>
              </div>
              <div style={{ position: 'absolute', top: 10, left: 10 }}>
                <GlassPill dark>{it.channel}</GlassPill>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600 }}>{it.title}</div>
            <div style={{ fontSize: 11, color: DARK.textDim, marginTop: 2 }}>{it.sub}</div>
          </div>
        ))}
      </HScroll>

      {/* Section: Live now */}
      <SectionHeader label="Live now" kicker="Across your region" accent={accent}/>
      <HScroll>
        {LIVE_NOW.map(it => (
          <div key={it.id} onClick={() => onOpenPlayer(it)} style={{
            width: 220, flexShrink: 0, cursor: 'pointer',
          }}>
            <div className="zt-streamable" style={{ position: 'relative', height: 130, borderRadius: 10, overflow: 'hidden' }}>
              <img src={it.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent 45%)' }}/>
              <div style={{ position: 'absolute', top: 8, left: 8 }}>{Icon.live()}</div>
              <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, color: '#fff' }}>
                <div style={{ fontSize: 10, opacity: 0.85, fontWeight: 600 }}>{it.channel}</div>
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600 }}>{it.title}</div>
            <div style={{ fontSize: 10.5, color: DARK.textDim, marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
              <span>{it.sub}</span>
              <span>· {it.viewers}</span>
            </div>
          </div>
        ))}
      </HScroll>

      {/* Section: Themed Collections — editorial stack of curated theme cards */}
      <SectionHeader label="Kollektionen" kicker="Kuratiert · diese Woche" accent={accent}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {THEMES.map(t => (
          <ThemeCard key={t.id} theme={t} accent={accent} onOpenPlayer={onOpenPlayer}/>
        ))}
      </div>

      {/* Section: Trending — cinema-poster treatment with ranks */}
      <SectionHeader label="Trending" kicker="In der Schweiz · diese Woche" accent={accent}/>
      <HScroll>
        {TRENDING.map((it, i) => (
          <div key={it.id} onClick={() => onOpenSeries ? onOpenSeries(it) : onOpenPlayer(it)} style={{
            width: 188, flexShrink: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'flex-end', gap: 0,
          }}>
            {/* Huge outlined numeric rank, Netflix Top 10 style */}
            <div style={{
              fontFamily: FONTS.display,
              fontSize: 120, lineHeight: 0.78, fontWeight: 900,
              letterSpacing: -6, marginRight: -14, marginLeft: -4,
              color: 'transparent',
              WebkitTextStroke: `1.5px ${DARK.text}`,
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              userSelect: 'none', flexShrink: 0,
            }}>{i + 1}</div>
            {/* 2:3 cinema poster */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="zt-streamable" style={{
                width: '100%', aspectRatio: '2 / 3', borderRadius: 6,
                overflow: 'hidden', background: DARK.bgCard,
                boxShadow: '0 18px 40px -12px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)',
                position: 'relative',
              }}>
                <img src={it.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                {/* subtle bottom vignette for legibility if title overlays later */}
                <div style={{
                  position: 'absolute', inset: 'auto 0 0 0', height: '40%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
                  pointerEvents: 'none',
                }}/>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, lineHeight: 1.25, color: DARK.text }}>{it.title}</div>
              <div style={{ fontSize: 10.5, color: DARK.textDim, marginTop: 2 }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </HScroll>

      {/* Section: Because you watched — with context */}
      <SectionHeader label="Because you watched" kicker="Deutschland 83" accent={accent} last/>
      <HScroll>
        {BECAUSE.map(it => (
          <div key={it.id} onClick={() => onOpenSeries ? onOpenSeries(it) : onOpenPlayer(it)} style={{ width: 150, flexShrink: 0, cursor: 'pointer' }}>
            <div className="zt-streamable" style={{ width: 150, height: 150, borderRadius: 10, overflow: 'hidden', background: DARK.bgCard }}>
              <img src={it.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, lineHeight: 1.25 }}>{it.title}</div>
            <div style={{ fontSize: 10.5, color: DARK.textDim, marginTop: 2 }}>{it.sub}</div>
          </div>
        ))}
      </HScroll>

      {/* bottom padding for nav */}
      <div style={{ height: 120 }}/>
    </div>
  );
}

function SectionHeader({ label, kicker, accent, last }) {
  return (
    <div style={{ padding: '8px 16px 14px', marginTop: 10 }}>
      <div style={{
        fontSize: 10, letterSpacing: 2.4, textTransform: 'uppercase',
        fontWeight: 600, color: accent.solid, marginBottom: 4,
      }}>{kicker}</div>
      <div style={{
        fontFamily: FONTS.display, fontSize: 24, fontWeight: 400,
        letterSpacing: -0.4, color: DARK.text,
      }}>{label}</div>
    </div>
  );
}

function HScroll({ children }) {
  return (
    <div style={{
      display: 'flex', gap: 12, overflowX: 'auto', padding: '0 16px 4px',
      scrollbarWidth: 'none',
    }}>{children}</div>
  );
}

// ─── Themed Collection card ──────────────────────────────────────────
// Editorial hero (image + kicker + headline + blurb), then a 2-up row of
// related picks below. Each card is a single contained unit with its own
// tint; rhythm comes from the stack rather than per-card chrome.
function ThemeCard({ theme, accent, onOpenPlayer }) {
  return (
    <div style={{
      overflow: 'hidden',
      background: theme.tint, color: '#fff',
    }}>
      {/* hero — full-bleed edge-to-edge */}
      <div className="zt-streamable" style={{
        position: 'relative', aspectRatio: '4/3', overflow: 'hidden',
      }}>
        <img src={theme.hero} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, transparent 0%, transparent 45%, ${theme.tint}e8 92%, ${theme.tint} 100%)`,
        }}/>
      </div>

      {/* copy */}
      <div style={{ padding: '0 16px 16px', marginTop: -4 }}>
        <div style={{
          fontFamily: FONTS.ui, fontSize: 10, letterSpacing: 2,
          textTransform: 'uppercase', fontWeight: 700,
          color: theme.accent, marginBottom: 6, opacity: 0.9,
        }}>{theme.kicker}</div>
        <div style={{
          fontFamily: FONTS.display, fontSize: 24, fontWeight: 500,
          letterSpacing: -0.4, lineHeight: 1.1, marginBottom: 8,
          textWrap: 'balance',
        }}>{theme.title}</div>
        <div style={{
          fontFamily: FONTS.ui, fontSize: 12.5, lineHeight: 1.45,
          color: 'rgba(255,255,255,0.78)', marginBottom: 14,
          textWrap: 'pretty',
        }}>{theme.blurb}</div>

        {/* picks — horizontal swipe row, peek of next tile hints at more */}
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto',
          scrollbarWidth: 'none', scrollSnapType: 'x mandatory',
          margin: '0 -16px', padding: '0 16px 2px',
        }}>
          {theme.picks.map(p => {
            if (p.kind === 'brand') {
              return (
                <div key={p.id} style={{
                  width: 178, aspectRatio: '1.35/1', flexShrink: 0,
                  borderRadius: 8, background: p.blurbBg, color: p.blurbFg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONTS.display, fontSize: 40, fontWeight: 700,
                  letterSpacing: -1.5, cursor: 'default',
                  scrollSnapAlign: 'start',
                }}>
                  <span style={{ color: p.blurbFg }}>♥</span>
                  <span style={{ marginLeft: 2 }}>{p.label}</span>
                </div>
              );
            }
            return (
              <button key={p.id} onClick={() => onOpenPlayer && onOpenPlayer(p)} className="zt-streamable" style={{
                position: 'relative', width: 178, aspectRatio: '1.35/1', flexShrink: 0,
                borderRadius: 8, overflow: 'hidden',
                border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
                background: '#000', scrollSnapAlign: 'start',
              }}>
                <img src={p.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 35%, rgba(0,0,0,0.75) 100%)',
                }}/>
                {p.duration && (
                  <div style={{
                    position: 'absolute', top: 8, right: 10,
                    fontFamily: FONTS.ui, fontSize: 10, fontWeight: 600,
                    color: 'rgba(255,255,255,0.95)',
                  }}>{p.duration}</div>
                )}
                {p.title && (
                  <div style={{
                    position: 'absolute', left: 10, right: 10, bottom: 10,
                    fontFamily: FONTS.ui, fontSize: 11, fontWeight: 800,
                    letterSpacing: 0.4, textTransform: 'uppercase',
                    color: '#fff', lineHeight: 1.2, textWrap: 'balance',
                  }}>{p.title}</div>
                )}
              </button>
            );
          })}
          {/* trailing "more" affordance */}
          <div style={{
            width: 100, aspectRatio: '1.35/1', flexShrink: 0,
            borderRadius: 8, border: `1px dashed ${theme.accent}40`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            color: theme.accent, opacity: 0.85,
            fontFamily: FONTS.ui, fontSize: 10, letterSpacing: 1.4, fontWeight: 700, textTransform: 'uppercase',
            scrollSnapAlign: 'end',
          }}>
            <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 400, lineHeight: 1 }}>→</div>
            Alle ansehen
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Side sheet: Account menu now lives in lib/primitives.jsx as shared ───

Object.assign(window, { WatchPage });