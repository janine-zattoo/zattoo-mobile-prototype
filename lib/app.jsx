// Main app shell — tabs, global state, prototype entry

const flowBtn = {
  width: '100%', padding: '7px 10px', textAlign: 'left',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 6, cursor: 'pointer', color: '#F3EFE7', fontSize: 11.5, fontWeight: 500,
};

function App() {
  const [tab, setTab] = React.useState('watch');
  const [accentKey, setAccentKey] = React.useState('zattoo');
  const [clipVariant, setClipVariant] = React.useState('overlay');
  const [feedOpen, setFeedOpen] = React.useState(false);
  const [playerItem, setPlayerItem] = React.useState(null);
  const [track, setTrack] = React.useState(null);
  const [subscribed, setSubscribed] = React.useState(false);
  const [article, setArticle] = React.useState(null);
  const [seriesItem, setSeriesItem] = React.useState(null);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  // ── FTE, subscription flow, personalisation, region ─────────────
  const [fteOpen, setFteOpen] = React.useState(true);
  const [subIntercept, setSubIntercept] = React.useState(false);
  const [subChooser, setSubChooser] = React.useState(false);
  const [signupPlan, setSignupPlan] = React.useState(null);
  const [checkoutPlan, setCheckoutPlan] = React.useState(null);
  const [personalised, setPersonalised] = React.useState(false);
  const [consentOpen, setConsentOpen] = React.useState(false);
  const [region, setRegion] = React.useState(REGIONS[0]);
  const [regionOpen, setRegionOpen] = React.useState(false);
  const [confirmMsg, setConfirmMsg] = React.useState(null);

  const accent = ACCENTS[accentKey];

  // Guarded play-opener: if not subscribed, show subscribe sheet instead of opening player.
  const guardedOpenPlayer = (item) => {
    if (!subscribed) { setSubIntercept(true); return; }
    setPlayerItem(item);
  };
  const guardedSetTrack = (t) => {
    if (!subscribed) { setSubIntercept(true); return; }
    setTrack(t);
  };
  const guardedOpenSeries = (s) => setSeriesItem(s); // browsing detail stays free

  // Edit-mode protocol
  React.useEffect(() => {
    const handler = (e) => {
      if (!e.data) return;
      if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const persistEdit = (edits) => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  };

  const onOpenPlayer = guardedOpenPlayer;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#e8e4db', padding: 24, gap: 40 }}>
      <IOSDevice width={390} height={844} dark>
        <div style={{ position: 'absolute', inset: 0, background: DARK.bg }}>
          {/* main tab content */}
          {tab === 'watch' && !feedOpen && (
            <WatchPage
              accent={accent}
              subscribed={subscribed}
              onOpenFeed={() => setFeedOpen(true)}
              onOpenPlayer={onOpenPlayer}
              onOpenSeries={guardedOpenSeries}
              personalised={personalised}
              onEnablePersonalisation={() => setConsentOpen(true)}
              region={region}
              onOpenRegion={() => setRegionOpen(true)}
            />
          )}
          {tab === 'watch' && feedOpen && (
            <>
              <ClipFeed accent={accent} variant={clipVariant} onOpenPlayer={onOpenPlayer}/>
              <button onClick={() => setFeedOpen(false)} style={{
                position: 'absolute', top: 56, left: 16, width: 36, height: 36, borderRadius: 18,
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: 'none', zIndex: 32,
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{Icon.chevronD(20, '#fff')}</button>
            </>
          )}
          {tab === 'listen' && (
            <ListenPage accent={accent} playing={track} setPlaying={guardedSetTrack}/>
          )}
          {tab === 'read' && (
            <ReadPage subscribed={subscribed} setSubscribed={setSubscribed} onOpenArticle={setArticle}/>
          )}
          {tab === 'library' && (
            <LibraryPage accent={accent} onOpenPlayer={onOpenPlayer} onOpenArticle={setArticle} setTab={setTab}/>
          )}

          {/* Status bar */}
          {!feedOpen && !playerItem && !article && !seriesItem && !fteOpen && !subChooser && !signupPlan && !checkoutPlan && (
            <StatusBarOverlay dark={tab !== 'read'}/>
          )}

          {/* Mini player */}
          {tab === 'listen' && track && <MiniPlayer track={track} onStop={() => setTrack(null)} accent={accent}/>}

          {/* Bottom nav — hide during player, feed, article, series, or any onboarding overlay */}
          {!playerItem && !article && !feedOpen && !seriesItem && !fteOpen && !subChooser && !signupPlan && !checkoutPlan && <BottomNav tab={tab} setTab={(t)=>{ setTab(t); if(t!=='watch') setFeedOpen(false);}} accent={accent}/>}

          {/* Full-screen overlays */}
          {playerItem && <Player item={playerItem} onClose={() => setPlayerItem(null)} accent={accent}/>}
          {article && <ArticleView article={article} onClose={() => setArticle(null)} accent={accent}/>}
          {seriesItem && !playerItem && <SeriesDetail series={seriesItem} onClose={() => setSeriesItem(null)} onOpenPlayer={onOpenPlayer} accent={accent}/>}

          {/* ── Onboarding, subscription, consent, region overlays ── */}
          {fteOpen && (
            <WelcomeScreen
              accent={accent}
              onExplore={() => setFteOpen(false)}
              onStart={() => { setFteOpen(false); setSubChooser(true); }}
            />
          )}
          {subIntercept && (
            <SubscribeIntercept
              accent={accent}
              onClose={() => setSubIntercept(false)}
              onChoose={() => { setSubIntercept(false); setSubChooser(true); }}
            />
          )}
          {subChooser && (
            <SubscribeChooser
              accent={accent}
              onClose={() => setSubChooser(false)}
              onPick={(plan) => { setSubChooser(false); setSignupPlan(plan); }}
            />
          )}
          {signupPlan && (
            <SignupScreen
              plan={signupPlan}
              accent={accent}
              onClose={() => setSignupPlan(null)}
              onContinue={() => { setCheckoutPlan(signupPlan); setSignupPlan(null); }}
            />
          )}
          {checkoutPlan && (
            <CheckoutScreen
              plan={checkoutPlan}
              accent={accent}
              onClose={() => setCheckoutPlan(null)}
              onConfirm={() => {
                setSubscribed(true);
                setConfirmMsg(`${checkoutPlan.name} aktiv — 7 Tage gratis. Los geht's!`);
                setCheckoutPlan(null);
              }}
            />
          )}
          {consentOpen && (
            <ConsentModal
              accent={accent}
              onClose={() => setConsentOpen(false)}
              onAccept={() => { setPersonalised(true); setConsentOpen(false); setConfirmMsg('Personalisierung aktiviert. Empfehlungen werden geladen.'); }}
            />
          )}
          {regionOpen && (
            <RegionSheet
              current={region}
              accent={accent}
              onClose={() => setRegionOpen(false)}
              onPick={(r) => { setRegion(r); setRegionOpen(false); }}
            />
          )}
          {confirmMsg && (
            <ConfirmBanner accent={accent} message={confirmMsg} onDismiss={() => setConfirmMsg(null)}/>
          )}
        </div>
      </IOSDevice>

      {/* Side hint */}
      <div style={{ maxWidth: 240, color: '#3a322a', fontFamily: FONTS.ui, fontSize: 13, lineHeight: 1.5 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase', opacity: 0.6 }}>Zattoo mobile · prototype</div>
        <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 400, letterSpacing: -0.4, margin: '8px 0 14px' }}>
          Tap through the flow.
        </div>
        <ul style={{ paddingLeft: 16, margin: 0, opacity: 0.75 }}>
          <li>Welcome screen on first load — explore freely</li>
          <li>Tap any play / stream → friendly subscribe sheet</li>
          <li>Home: enable personalisation to show Continue Watching</li>
          <li>Tap the region chip to switch Swiss regions</li>
        </ul>
        <a href="Zattoo Canvas.html" style={{
          display: 'inline-block', marginTop: 20, padding: '8px 14px',
          background: '#1A1612', color: '#F3EFE7',
          fontSize: 11, letterSpacing: 1.4, fontWeight: 700, textTransform: 'uppercase',
          textDecoration: 'none', borderRadius: 2,
        }}>View design canvas →</a>
      </div>

      {/* Tweaks panel */}
      {tweaksOpen && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: '#1A1612', color: '#F3EFE7', padding: 20,
          borderRadius: 14, fontFamily: FONTS.ui, width: 260,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase' }}>Tweaks</div>
            <button onClick={() => setTweaksOpen(false)} style={{ background: 'none', border: 'none', color: '#F3EFE7', cursor: 'pointer' }}>
              {Icon.close(16, '#F3EFE7')}
            </button>
          </div>

          <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 8, fontWeight: 600, letterSpacing: 1 }}>ACCENT COLOR</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {Object.entries(ACCENTS).map(([k, v]) => (
              <div key={k} onClick={() => { setAccentKey(k); persistEdit({ accent: k }); }} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px',
                background: accentKey === k ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderRadius: 6, cursor: 'pointer',
              }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: v.solid, border: '1px solid rgba(255,255,255,0.15)' }}/>
                <div style={{ fontSize: 12, flex: 1 }}>{v.name}</div>
                {accentKey === k && <div style={{ fontSize: 11, opacity: 0.6 }}>✓</div>}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 8, fontWeight: 600, letterSpacing: 1 }}>CLIP FEED LAYOUT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { k: 'overlay', label: 'A · Overlay CTA' },
              { k: 'docked', label: 'B · Docked CTA' },
              { k: 'full-bleed', label: 'C · Full-bleed poster' },
            ].map(o => (
              <div key={o.k} onClick={() => { setClipVariant(o.k); persistEdit({ clipVariant: o.k }); }} style={{
                padding: '6px 8px', background: clipVariant === o.k ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderRadius: 6, cursor: 'pointer', fontSize: 12,
              }}>{o.label} {clipVariant === o.k && <span style={{ opacity: 0.6 }}>  ✓</span>}</div>
            ))}
          </div>

          <div style={{ marginTop: 14, fontSize: 10, opacity: 0.5, lineHeight: 1.4 }}>
            Toggle Tweaks in the toolbar to hide.
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '16px 0 14px' }}/>
          <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 8, fontWeight: 600, letterSpacing: 1 }}>FLOW STATE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button onClick={() => { setFteOpen(true); setSubscribed(false); setPersonalised(false); }} style={flowBtn}>Replay welcome (FTE)</button>
            <button onClick={() => setSubChooser(true)} style={flowBtn}>Open plan chooser</button>
            <button onClick={() => setSubscribed(s => !s)} style={flowBtn}>Subscribed: {subscribed ? 'ON' : 'OFF'}</button>
            <button onClick={() => setPersonalised(p => !p)} style={flowBtn}>Personalised: {personalised ? 'ON' : 'OFF'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Bootstrap with defaults read from the TWEAK_DEFAULTS block
const ROOT = document.getElementById('root');
ReactDOM.createRoot(ROOT).render(<App/>);
