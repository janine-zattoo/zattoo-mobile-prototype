// Clip Feed — vertical snap-swipe feed (TikTok/Reels-like)
// Three variants: overlay-cta (default), docked-cta, full-bleed

function ClipFeed({ accent, variant = 'overlay', onOpenPlayer }) {
  const [idx, setIdx] = React.useState(0);
  const [muted, setMuted] = React.useState(true);
  const [liked, setLiked] = React.useState({});
  const [progress, setProgress] = React.useState(0);
  const scrollRef = React.useRef(null);
  const clipDurationMs = 8000; // simulated auto-advance

  // snap-detection via scroll position
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const h = el.clientHeight;
    const next = Math.round(el.scrollTop / h);
    if (next !== idx) {
      setIdx(next);
      setProgress(0);
    }
  };

  // progress + auto-advance
  React.useEffect(() => {
    setProgress(0);
    const started = Date.now();
    const tick = setInterval(() => {
      const t = (Date.now() - started) / clipDurationMs;
      if (t >= 1) {
        // advance
        const el = scrollRef.current;
        if (el) el.scrollTo({ top: (idx + 1) * el.clientHeight, behavior: 'smooth' });
      } else {
        setProgress(t);
      }
    }, 60);
    return () => clearInterval(tick);
  }, [idx]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' }}>
      {/* progress dots on the LEFT EDGE — slender vertical stack */}
      <div style={{
        position: 'absolute', top: 62, left: 10, zIndex: 30,
        display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center',
      }}>
        {CLIPS.map((_, i) => (
          <div key={i} style={{
            width: 2.5, height: i === idx ? 22 : 10, borderRadius: 2,
            background: i === idx ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.22)',
            overflow: 'hidden', position: 'relative',
          }}>
            {i === idx && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: `${progress * 100}%`,
                background: accent.solid,
              }}/>
            )}
            {i < idx && (
              <div style={{ position: 'absolute', inset: 0, background: accent.solid, opacity: 0.8 }}/>
            )}
          </div>
        ))}
      </div>

      {/* top bar: For You | Following (center) + mute / search (right) */}
      <div style={{
        position: 'absolute', top: 58, left: 0, right: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26,
        color: '#fff', fontFamily: FONTS.ui,
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, opacity: 0.5 }}>Following</span>
        <span style={{ fontSize: 15, fontWeight: 700, position: 'relative' }}>
          For You
          <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 18, height: 2, borderRadius: 2, background: accent.solid }}/>
        </span>
      </div>
      <button onClick={() => setMuted(m => !m)} style={{
        position: 'absolute', top: 56, right: 16, zIndex: 30,
        width: 36, height: 36, borderRadius: 18, border: 'none',
        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)',
        color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {muted ? Icon.mute(18, '#fff') : Icon.sound(18, '#fff')}
      </button>

      {/* snap scroll container */}
      <div ref={scrollRef} onScroll={onScroll} style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto', scrollSnapType: 'y mandatory',
        scrollbarWidth: 'none',
      }}>
        {CLIPS.map((clip, i) => (
          <ClipSlide
            key={clip.id}
            clip={clip}
            accent={accent}
            variant={variant}
            active={i === idx}
            liked={!!liked[clip.id]}
            onLike={() => setLiked(l => ({ ...l, [clip.id]: !l[clip.id] }))}
            onOpenPlayer={() => onOpenPlayer(clip)}
          />
        ))}
      </div>
    </div>
  );
}

function ClipSlide({ clip, accent, variant, active, liked, onLike, onOpenPlayer }) {
  const isLive = clip.kind === 'LIVE';

  // variant layouts
  const ctaDocked = variant === 'docked';
  const fullBleed = variant === 'full-bleed';

  return (
    <div style={{
      height: '100%', width: '100%', scrollSnapAlign: 'start',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* media */}
      <img src={clip.img} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', transform: active ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 8s linear',
      }}/>

      {/* gradients */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 180,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)',
      }}/>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: ctaDocked ? 320 : 420,
        background: ctaDocked
          ? 'linear-gradient(to top, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0) 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.88) 20%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0) 100%)',
      }}/>

      {/* right rail — like / share / save / more */}
      <div style={{
        position: 'absolute', right: 14, bottom: ctaDocked ? 200 : 160, zIndex: 20,
        display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center',
        color: '#fff',
      }}>
        <ActionBtn icon={Icon.heart(26, liked, liked ? accent.solid : '#fff')} label="12.4k" onClick={onLike}/>
        <ActionBtn icon={Icon.share(26, '#fff')} label="Share"/>
        <ActionBtn icon={Icon.bookmark(26, false, '#fff')} label="Save"/>
        <ActionBtn icon={Icon.more(26, '#fff')} label=""/>
      </div>

      {/* channel + title + cta */}
      {fullBleed ? (
        <FullBleedMeta clip={clip} accent={accent} onOpenPlayer={onOpenPlayer}/>
      ) : ctaDocked ? (
        <DockedMeta clip={clip} accent={accent} onOpenPlayer={onOpenPlayer}/>
      ) : (
        <OverlayMeta clip={clip} accent={accent} onOpenPlayer={onOpenPlayer}/>
      )}
    </div>
  );
}

function ActionBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', cursor: 'pointer', color: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      textShadow: '0 1px 3px rgba(0,0,0,0.4)',
    }}>
      {icon}
      {label && <span style={{ fontFamily: FONTS.ui, fontSize: 10, fontWeight: 600 }}>{label}</span>}
    </button>
  );
}

// Default — overlay CTA floats over bottom meta
function OverlayMeta({ clip, accent, onOpenPlayer }) {
  const isLive = clip.kind === 'LIVE';
  return (
    <div style={{
      position: 'absolute', left: 16, right: 72, bottom: 110, zIndex: 20,
      color: '#fff', fontFamily: FONTS.ui,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <ChannelChip logo={clip.channelLogo} color={clip.channelColor} size={26} radius={5}/>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{clip.channel}</span>
        {isLive && Icon.live()}
      </div>
      <div style={{
        fontSize: 17, fontWeight: 600, lineHeight: 1.3, marginBottom: 6,
        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        textWrap: 'pretty',
      }}>{clip.title}</div>
      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 14 }}>{clip.subtitle}</div>

      <button onClick={onOpenPlayer} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: accent.solid, color: '#fff', border: 'none', cursor: 'pointer',
        padding: '12px 18px', borderRadius: 10,
        fontFamily: FONTS.ui, fontSize: 14, fontWeight: 600, letterSpacing: 0.1,
        boxShadow: `0 6px 20px ${accent.glow}, 0 1px 0 rgba(255,255,255,0.2) inset`,
      }}>
        {Icon.play(11, '#fff')}
        {clip.cta}
        <div style={{ marginLeft: 4, opacity: 0.8 }}>{Icon.chevronR(15, '#fff')}</div>
      </button>
    </div>
  );
}

// Docked — CTA in a dark bar at the bottom, full-width
function DockedMeta({ clip, accent, onOpenPlayer }) {
  const isLive = clip.kind === 'LIVE';
  return (
    <>
      <div style={{
        position: 'absolute', left: 16, right: 72, bottom: 148, zIndex: 20,
        color: '#fff', fontFamily: FONTS.ui,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <ChannelChip logo={clip.channelLogo} color={clip.channelColor} size={26} radius={5}/>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{clip.channel}</span>
          {isLive && Icon.live()}
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.3, marginBottom: 4, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{clip.title}</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>{clip.subtitle}</div>
      </div>
      <div style={{
        position: 'absolute', left: 12, right: 12, bottom: 96, zIndex: 20,
      }}>
        <button onClick={onOpenPlayer} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: accent.solid, color: '#fff', border: 'none', cursor: 'pointer',
          padding: '14px 20px', borderRadius: 12,
          fontFamily: FONTS.ui, fontSize: 15, fontWeight: 600, letterSpacing: 0.1,
          boxShadow: `0 8px 24px ${accent.glow}`,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {Icon.play(12, '#fff')}
            {clip.cta}
          </span>
          {isLive && clip.viewers ? (
            <span style={{ fontSize: 11, opacity: 0.9, fontWeight: 500 }}>{clip.viewers}</span>
          ) : Icon.chevronR(16, '#fff')}
        </button>
      </div>
    </>
  );
}

// Full-bleed — minimal overlay, poster-like
function FullBleedMeta({ clip, accent, onOpenPlayer }) {
  const isLive = clip.kind === 'LIVE';
  return (
    <>
      {/* top-left channel */}
      <div style={{
        position: 'absolute', top: 100, left: 16, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: 8, color: '#fff',
      }}>
        <ChannelChip logo={clip.channelLogo} color={clip.channelColor} size={24} radius={5}/>
        <span style={{ fontFamily: FONTS.ui, fontSize: 12, fontWeight: 600 }}>{clip.channel}</span>
        {isLive && Icon.live()}
      </div>
      {/* center title */}
      <div style={{
        position: 'absolute', left: 20, right: 20, bottom: 180, zIndex: 20,
        color: '#fff', fontFamily: FONTS.display,
      }}>
        <div style={{
          fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
          fontFamily: FONTS.ui, fontWeight: 600, opacity: 0.7, marginBottom: 10,
        }}>{clip.tag}</div>
        <div style={{
          fontSize: 32, fontWeight: 400, lineHeight: 1.08, letterSpacing: -0.5,
          textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          textWrap: 'balance',
        }}>{clip.title}</div>
        <div style={{
          fontFamily: FONTS.ui, fontSize: 12, opacity: 0.75, marginTop: 10,
        }}>{clip.subtitle}</div>
      </div>
      {/* bottom CTA — thin underline button */}
      <button onClick={onOpenPlayer} style={{
        position: 'absolute', left: 16, bottom: 108, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: '#fff', fontFamily: FONTS.ui, fontSize: 14, fontWeight: 600,
        padding: '8px 0',
        borderBottom: `2px solid ${accent.solid}`,
      }}>
        {Icon.play(11, '#fff')}
        {clip.cta}
        <span style={{ marginLeft: 4 }}>{Icon.chevronR(15, '#fff')}</span>
      </button>
    </>
  );
}

Object.assign(window, { ClipFeed });
