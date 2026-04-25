// Shared primitives: icons, bottom nav, utility components.

// ─────────────── Icons (stroke-based, consistent weight) ───────────────
const Icon = {
  play: (size = 14, fill = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M3 2L10 6L3 10V2Z" fill={fill}/>
    </svg>
  ),
  pause: (size = 14, fill = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <rect x="3" y="2.5" width="2" height="7" rx="0.5" fill={fill}/>
      <rect x="7" y="2.5" width="2" height="7" rx="0.5" fill={fill}/>
    </svg>
  ),
  heart: (size = 22, filled = false, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-4.35-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16.65 12 21 12 21z"/>
    </svg>
  ),
  share: (size = 22, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/>
    </svg>
  ),
  bookmark: (size = 22, filled = false, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v18l-6-4-6 4V3z"/>
    </svg>
  ),
  more: (size = 22, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>
    </svg>
  ),
  search: (size = 22, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>
    </svg>
  ),
  cast: (size = 22, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/>
      <path d="M3 14a5 5 0 0 1 5 5"/><path d="M3 19h.01"/><path d="M3 11a8 8 0 0 1 8 8"/>
    </svg>
  ),
  chevronR: (size = 20, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6"/>
    </svg>
  ),
  chevronL: (size = 20, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6"/>
    </svg>
  ),
  chevronD: (size = 20, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
  close: (size = 22, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18"/>
    </svg>
  ),
  mute: (size = 20, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10v4h3l5 4V6l-5 4H5z"/><path d="M19 8l-4 4-4-4"/><path d="M23 8l-4 4 4 4"/>
    </svg>
  ),
  sound: (size = 20, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10v4h3l5 4V6l-5 4H5z"/><path d="M17 8a5 5 0 0 1 0 8"/>
    </svg>
  ),
  skip: (size = 18, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M5 4l10 8-10 8V4zM17 4h2v16h-2V4z"/>
    </svg>
  ),
  tv: (size = 22, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8M12 18v3"/>
    </svg>
  ),
  headphones: (size = 22, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15v-3a8 8 0 0 1 16 0v3"/><path d="M4 15h3v6H4zM17 15h3v6h-3z"/>
    </svg>
  ),
  book: (size = 22, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17z"/>
      <path d="M8 6h8M8 10h8"/>
    </svg>
  ),
  library: (size = 22, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h6v16H4zM14 4h6v10h-6zM14 16h6v4h-6z"/>
    </svg>
  ),
  lock: (size = 14, color = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>
  ),
  live: (color = '#fff') => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: '#E5173F', color, padding: '2px 6px',
      borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 5, background: '#fff', boxShadow: '0 0 6px rgba(255,255,255,0.8)' }}/>
      LIVE
    </span>
  ),
};

// ─────────────── Bottom Tab Bar ───────────────
function BottomNav({ tab, setTab, accent }) {
  const tabs = [
    { id: 'watch', label: 'Watch', icon: Icon.tv },
    { id: 'listen', label: 'Listen', icon: Icon.headphones },
    { id: 'read', label: 'Read', icon: Icon.book },
    { id: 'library', label: 'Library', icon: Icon.library },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      paddingBottom: 34, paddingTop: 8,
      background: 'linear-gradient(to top, rgba(10,10,12,0.97) 60%, rgba(10,10,12,0))',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 8px' }}>
        {tabs.map(t => {
          const active = t.id === tab;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '6px 10px',
                color: active ? accent.solid : 'rgba(245,244,242,0.5)',
                transition: 'color .18s',
              }}>
              {t.icon(22, 'currentColor')}
              <span style={{
                fontFamily: FONTS.ui, fontSize: 10, fontWeight: 600,
                letterSpacing: 0.4, textTransform: 'uppercase',
              }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Small status-bar overlay (for dark screens) — uses starter IOSStatusBar
function StatusBarOverlay({ dark = true }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 35,
      pointerEvents: 'none',
    }}>
      <IOSStatusBar dark={dark}/>
    </div>
  );
}

// Pill with blur
function GlassPill({ children, dark = true, style = {} }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 10px', borderRadius: 999,
      background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
      backdropFilter: 'blur(18px) saturate(160%)',
      WebkitBackdropFilter: 'blur(18px) saturate(160%)',
      border: dark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,0,0,0.06)',
      color: dark ? '#fff' : '#000',
      fontFamily: FONTS.ui, fontSize: 11, fontWeight: 500,
      letterSpacing: 0.1,
      ...style,
    }}>
      {children}
    </div>
  );
}

// Channel logo chip
function ChannelChip({ logo, color, size = 28, radius = 6 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.ui, fontWeight: 800, fontSize: size < 30 ? 9 : 10,
      letterSpacing: 0.3, flexShrink: 0,
      boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
    }}>{logo}</div>
  );
}

// ─── Avatar button + Account side menu ──────────────────────────────
// Lives in Watch/Listen/Read/Library headers.
const AVATAR_IMG_URL = `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80`;
const AVATAR_IMG = (typeof window !== 'undefined' && window.__urlMap && window.__urlMap[AVATAR_IMG_URL]) || AVATAR_IMG_URL;

function AvatarButton({ accent, onClick, dark = true, size = 40 }) {
  const ringBg = dark ? DARK.bg : PAPER.bg;
  return (
    <button onClick={onClick} aria-label="Open account menu" style={{
      width: size, height: size, borderRadius: size/2, padding: 0, border: 'none', cursor: 'pointer',
      backgroundImage: `url(${AVATAR_IMG})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      boxShadow: `0 0 0 2px ${ringBg}, 0 0 0 3.5px ${accent.solid}`,
      flexShrink: 0,
    }}/>
  );
}

function AccountMenu({ accent, onClose, dark = true }) {
  const items = [
    { label: 'Subscription',   meta: 'Family · renews 12 May',  icon: (s,c)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 5 5.6.8-4 4 1 5.7L12 15l-5 2.5 1-5.7-4-4 5.6-.8z"/></svg>) },
    { label: 'Video Settings', meta: 'HD · Auto',                 icon: (s,c)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="15" height="12" rx="2"/><path d="M17 10l5-3v10l-5-3z"/></svg>) },
    { label: 'Notifications',  meta: '3 unread',                  icon: (s,c)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>) },
    { label: 'Support',        meta: 'Help & FAQs',               icon: (s,c)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><circle cx="12" cy="17" r="0.6" fill={c}/></svg>) },
    { label: 'Data Privacy',   meta: 'Permissions & downloads',   icon: (s,c)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/></svg>) },
  ];

  const c = dark
    ? { bg: DARK.bgRaised, text: DARK.text, mute: DARK.textMute, faint: DARK.textFaint, dim: DARK.textDim, card: DARK.bgCard, hair: DARK.hairline }
    : { bg: '#FFFFFF', text: PAPER.ink, mute: PAPER.inkMute, faint: PAPER.inkFaint, dim: PAPER.inkDim, card: PAPER.bgRaised, hair: PAPER.rule };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 90 }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}/>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: 320,
        background: c.bg, color: c.text,
        borderRight: `1px solid ${c.hair}`,
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column',
        animation: 'zt-slide-in .24s ease-out',
      }}>
        <div style={{ padding: '56px 20px 20px', borderBottom: `1px solid ${c.hair}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 28,
              backgroundImage: `url(${AVATAR_IMG})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              boxShadow: `0 0 0 2px ${c.bg}, 0 0 0 3.5px ${accent.solid}`,
            }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500, letterSpacing: -0.3 }}>Lena Steiner</div>
              <div style={{ fontSize: 12, color: c.mute, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>lena.steiner@proton.me</div>
            </div>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: c.dim, padding: 4,
            }}>{Icon.close(20, c.dim)}</button>
          </div>
          <div style={{
            marginTop: 16, padding: '10px 12px', borderRadius: 10,
            background: accent.soft, color: accent.text,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 11.5, fontWeight: 600,
          }}>
            <span style={{ letterSpacing: 0.4 }}>FAMILY · active</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', opacity: 0.9 }}>Renews 12 May</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {items.map(it => (
            <button key={it.label} style={{
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14,
              color: c.text, textAlign: 'left',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: c.card, border: `1px solid ${c.hair}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{it.icon(17, c.dim)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{it.label}</div>
                <div style={{ fontSize: 11, color: c.mute, marginTop: 1 }}>{it.meta}</div>
              </div>
              {Icon.chevronR(18, c.mute)}
            </button>
          ))}

          <div style={{ height: 1, background: c.hair, margin: '8px 20px' }}/>

          <button style={{
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14,
            color: c.dim, textAlign: 'left', fontSize: 13.5,
          }}>Sign out</button>
        </div>

        <div style={{
          padding: '14px 20px', borderTop: `1px solid ${c.hair}`,
          fontSize: 10.5, color: c.faint, letterSpacing: 0.3,
        }}>Zattoo · v5.18.2 · Zürich</div>
      </div>

      <style>{`@keyframes zt-slide-in { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}

Object.assign(window, { Icon, BottomNav, StatusBarOverlay, GlassPill, ChannelChip, AvatarButton, AccountMenu });
