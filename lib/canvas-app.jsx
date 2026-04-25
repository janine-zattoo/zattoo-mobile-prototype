// Canvas app — renders each screen as a DCArtboard inside DCSections.

function CanvasApp() {
  const accent = ACCENTS.zattoo;
  const mini = (inner) => (
    <div style={{ width: 390, height: 844, background: DARK.bg, position: 'relative', overflow: 'hidden' }}>
      {inner}
    </div>
  );

  return (
    <DesignCanvas>
      {/* ROW 1 — Core flow */}
      <DCSection id="core" title="Core flow" subtitle="Clip-feed hook → 4You → full player">
        <DCArtboard id="feed-overlay" label="01 · Clip Feed · Overlay CTA (default)" width={390} height={844}>
          {mini(<ClipFeedStaticA accent={accent}/>)}
        </DCArtboard>
        <DCArtboard id="watch" label="02 · Watch · 4You" width={390} height={844}>
          {mini(<><WatchPage accent={accent} onOpenFeed={() => {}} onOpenPlayer={() => {}}/><StatusBarOverlay dark/><BottomNavStatic tab="watch" accent={accent}/></>)}
        </DCArtboard>
        <DCArtboard id="player-live" label="03 · Player · Live" width={390} height={844}>
          {mini(<PlayerStatic item={{ ...CLIPS[0], kind: 'LIVE' }} accent={accent} isLive/>)}
        </DCArtboard>
        <DCArtboard id="player-vod" label="04 · Player · VOD + chapters" width={390} height={844}>
          {mini(<PlayerStatic item={{ ...CONTINUE[0], channel: 'Netflix', channelLogo: 'NFX', channelColor: '#E50914', subtitle: CONTINUE[0].sub }} accent={accent}/>)}
        </DCArtboard>
      </DCSection>

      {/* ROW 2 — Listen + Read */}
      <DCSection id="other-tabs" title="Listen & Read" subtitle="Secondary tabs">
        <DCArtboard id="listen" label="05 · Listen · dark grid + mini-player" width={390} height={844}>
          {mini(<>
            <ListenPage accent={accent} playing={PODCASTS[1]} setPlaying={() => {}}/>
            <StatusBarOverlay dark/>
            <MiniPlayer track={PODCASTS[1]} accent={accent} onStop={() => {}}/>
            <BottomNavStatic tab="listen" accent={accent}/>
          </>)}
        </DCArtboard>
        <DCArtboard id="read-teaser" label="06 · Read · Teaser (unsubscribed)" width={390} height={844}>
          {mini(<>
            <ReadPage subscribed={false} setSubscribed={() => {}} onOpenArticle={() => {}}/>
            <StatusBarOverlay dark={false}/>
            <BottomNavStatic tab="read" accent={accent}/>
          </>)}
        </DCArtboard>
        <DCArtboard id="read-article" label="07 · Read · Article (subscribed)" width={390} height={844}>
          {mini(<ArticleView article={ARTICLES[0]} onClose={() => {}} accent={accent}/>)}
        </DCArtboard>
      </DCSection>

      {/* ROW 3 — Clip Feed variants */}
      <DCSection id="clip-variants" title="Clip Feed — variants of the hook" subtitle="Three treatments for the persistent CTA">
        <DCArtboard id="v-overlay" label="A · Overlay CTA · default" width={390} height={844}>
          {mini(<ClipFeedStaticA accent={accent}/>)}
        </DCArtboard>
        <DCArtboard id="v-docked" label="B · Docked CTA · full-width bar" width={390} height={844}>
          {mini(<ClipFeedStaticB accent={accent}/>)}
        </DCArtboard>
        <DCArtboard id="v-bleed" label="C · Full-bleed · poster" width={390} height={844}>
          {mini(<ClipFeedStaticC accent={accent}/>)}
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

// Static (non-scrolling) single-clip renders for the canvas.
// Re-uses ClipSlide so they look identical to the prototype.
function ClipFeedStaticA({ accent }) {
  return <ClipFeedShell accent={accent} variant="overlay" clip={CLIPS[0]}/>;
}
function ClipFeedStaticB({ accent }) {
  return <ClipFeedShell accent={accent} variant="docked" clip={CLIPS[1]}/>;
}
function ClipFeedStaticC({ accent }) {
  return <ClipFeedShell accent={accent} variant="full-bleed" clip={CLIPS[3]}/>;
}

function ClipFeedShell({ accent, variant, clip }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
      <StatusBarOverlay dark/>
      {/* Progress dots */}
      <div style={{ position: 'absolute', top: 62, left: 10, zIndex: 30, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {CLIPS.map((_, i) => (
          <div key={i} style={{
            width: 2.5, height: i === 0 ? 22 : 10, borderRadius: 2, background: 'rgba(255,255,255,0.22)',
            position: 'relative', overflow: 'hidden',
          }}>
            {i === 0 && <div style={{ position: 'absolute', inset: 0, top: '50%', background: accent.solid }}/>}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 58, left: 0, right: 0, zIndex: 30, display: 'flex', justifyContent: 'center', gap: 26, color: '#fff', fontFamily: FONTS.ui }}>
        <span style={{ fontSize: 15, fontWeight: 600, opacity: 0.5 }}>Following</span>
        <span style={{ fontSize: 15, fontWeight: 700, position: 'relative' }}>
          For You
          <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 18, height: 2, borderRadius: 2, background: accent.solid }}/>
        </span>
      </div>
      {/* Single slide */}
      <ClipSlide clip={clip} accent={accent} variant={variant} active liked={false} onLike={() => {}} onOpenPlayer={() => {}}/>
    </div>
  );
}

// Static Player — reuse Player but in a frame (no auto-hide). Since Player
// hides chrome after 4.5s we render a simplified static version instead.
function PlayerStatic({ item, accent, isLive }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
      <img src={item.img} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }}/>
      <StatusBarOverlay dark/>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '56px 16px 18px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.chevronD(22, '#fff')}</div>
        <div style={{ flex: 1, textAlign: 'center', color: '#fff', fontFamily: FONTS.ui }}>
          <div style={{ fontSize: 10, letterSpacing: 1.4, opacity: 0.7, fontWeight: 600 }}>{isLive ? 'STREAMING · LIVE' : 'STREAMING'}</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{item.channel || item.title}</div>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.cast(18, '#fff')}</div>
      </div>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 44 }}>
        {!isLive && <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" opacity="0.85"><path d="M11 4L3 12l8 8V4zM20 4h-2v16h2V4z"/></svg>}
        <div style={{ width: 76, height: 76, borderRadius: 38, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)' }}>{Icon.pause(28, '#fff')}</div>
        {!isLive && <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" opacity="0.85"><path d="M13 4l8 8-8 8V4zM4 4h2v16H4V4z"/></svg>}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '48px 16px 40px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: '#fff', fontFamily: FONTS.ui }}>
        <div style={{ marginBottom: 18, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              {item.channelLogo && <ChannelChip logo={item.channelLogo} color={item.channelColor} size={24} radius={5}/>}
              {isLive && Icon.live()}
              <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 600 }}>{item.channel}</div>
            </div>
            <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.3 }}>{item.title}</div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>{item.subtitle || item.sub}</div>
          </div>
        </div>
        {isLive ? (
          <>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.22)', borderRadius: 3, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '28%', background: accent.solid, borderRadius: 3 }}/>
              <div style={{ position: 'absolute', left: '28%', top: '50%', transform: 'translate(-50%, -50%)', width: 12, height: 12, borderRadius: 6, background: accent.solid, boxShadow: `0 0 0 4px ${accent.glow}` }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginTop: 6, opacity: 0.7, fontFamily: FONTS.mono }}>
              <span>-32 min from live</span><span>LIVE</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
              {[0.22, 0.18, 0.24, 0.36].map((w, i) => (
                <div key={i} style={{ flex: w, height: 3, background: i < 2 ? accent.solid : 'rgba(255,255,255,0.22)', borderRadius: 2 }}/>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginTop: 6, opacity: 0.7, fontFamily: FONTS.mono }}>
              <span>12:34</span><span style={{ opacity: 0.6 }}>Chapter 2 · The harbour</span><span>48:15</span>
            </div>
          </>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 0' }}>
          {['Channels', isLive ? 'Restart' : 'Chapters', 'Subs · DE', 'HD', 'More'].map((l, i) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 58 }}>
              <div style={{ width: 16, height: 16, background: 'rgba(255,255,255,0.5)', borderRadius: 2 }}/>
              <span style={{ fontSize: 10, opacity: 0.85 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Static BottomNav for canvas (BottomNav works too; this avoids the fixed positioning edge cases)
function BottomNavStatic({ tab, accent }) {
  return <BottomNav tab={tab} setTab={() => {}} accent={accent}/>;
}

const CROOT = document.getElementById('root');
ReactDOM.createRoot(CROOT).render(<CanvasApp/>);
