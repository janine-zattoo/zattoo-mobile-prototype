// Read — editorial magazine, warm paper bg, serif display, gated teasers

function ReadPage({ subscribed, setSubscribed, onOpenArticle }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const accent = ACCENTS.zattoo; // for avatar ring + menu accent on light bg
  return (
    <div style={{
      position: 'absolute', inset: 0, overflowY: 'auto',
      background: PAPER.bg, color: PAPER.ink,
      fontFamily: FONTS.editorialSans,
    }}>
      {/* masthead */}
      <div style={{ padding: '60px 24px 18px', borderBottom: `1px solid ${PAPER.rule}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
            <AvatarButton accent={accent} onClick={() => setMenuOpen(true)} dark={false}/>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, fontWeight: 700, textTransform: 'uppercase', color: PAPER.inkMute }}>MONDAY · 21 APR 2026</div>
              <div style={{
                fontFamily: '"Times New Roman", "Tiempos Headline", Georgia, serif',
                fontSize: 34, fontWeight: 700, letterSpacing: -1, lineHeight: 1,
                marginTop: 4, fontStyle: 'italic', color: '#D6001C',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                Tages&#8209;Anzeiger
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: PAPER.bgRaised, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {Icon.search(16, PAPER.ink)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 18, fontSize: 11, letterSpacing: 1.2, fontWeight: 600, textTransform: 'uppercase' }}>
          {['Today', 'Culture', 'Travel', 'Society', 'Nature', 'Archive'].map((s, i) => (
            <span key={s} style={{ color: i === 0 ? PAPER.ink : PAPER.inkMute, position: 'relative' }}>
              {s}
              {i === 0 && <div style={{ position: 'absolute', bottom: -18, left: 0, right: 0, height: 2, background: PAPER.ink }}/>}
            </span>
          ))}
        </div>
      </div>

      {menuOpen && <AccountMenu accent={accent} onClose={() => setMenuOpen(false)} dark={false}/>}

      {/* subscription toggle (demo) */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 24px', background: PAPER.bgRaised, borderBottom: `1px solid ${PAPER.rule}`,
      }}>
        <div style={{ fontSize: 11, color: PAPER.inkDim }}>
          {subscribed ? '✓ Full access' : 'Teaser mode — preview only'}
        </div>
        <button onClick={() => setSubscribed(s => !s)} style={{
          background: 'none', border: `1px solid ${PAPER.ink}`, padding: '5px 10px',
          fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
          cursor: 'pointer', color: PAPER.ink,
        }}>
          {subscribed ? 'Switch to teaser' : 'Switch to subscribed'}
        </button>
      </div>

      {/* Lead article — large */}
      <div style={{ padding: '28px 24px 0' }}>
        <div style={{ fontSize: 11, letterSpacing: 2.6, fontWeight: 700, color: PAPER.inkMute, textTransform: 'uppercase' }}>
          {ARTICLES[0].section} · LEAD
        </div>
        <div onClick={() => onOpenArticle(ARTICLES[0])} style={{ marginTop: 14, cursor: 'pointer' }}>
          <div style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', marginBottom: 20, position: 'relative' }}>
            <img src={ARTICLES[0].img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>
          <div style={{ fontSize: 11, fontStyle: 'italic', color: PAPER.inkMute, marginBottom: 8, fontFamily: FONTS.editorial }}>
            {ARTICLES[0].kicker}
          </div>
          <h1 style={{
            fontFamily: FONTS.editorial, fontSize: 34, fontWeight: 400,
            letterSpacing: -0.6, lineHeight: 1.08, margin: 0, textWrap: 'balance',
          }}>{ARTICLES[0].title}</h1>
          <p style={{
            fontFamily: FONTS.editorial, fontSize: 17, lineHeight: 1.45,
            color: PAPER.inkDim, marginTop: 14, marginBottom: 14, fontStyle: 'italic',
          }}>{ARTICLES[0].dek}</p>
          <div style={{ fontSize: 11, color: PAPER.inkMute, letterSpacing: 0.3 }}>
            By <span style={{ fontWeight: 700, color: PAPER.ink }}>{ARTICLES[0].author}</span> · {ARTICLES[0].readTime} read
          </div>
        </div>
      </div>

      {/* Pullquote from the lead */}
      <div style={{ padding: '32px 32px 28px', borderTop: `1px solid ${PAPER.rule}`, borderBottom: `1px solid ${PAPER.rule}`, margin: '36px 0' }}>
        <div style={{
          fontFamily: FONTS.editorial, fontSize: 22, lineHeight: 1.3,
          fontWeight: 400, letterSpacing: -0.2, textWrap: 'balance',
        }}>
          {ARTICLES[0].pullquote}
        </div>
      </div>

      {/* Soft paywall for non-subscribers, placed after the teaser */}
      {!subscribed && <SoftPaywall onSubscribe={() => setSubscribed(true)}/>}

      {/* Secondary articles */}
      <div style={{ padding: '0 24px' }}>
        {ARTICLES.slice(1).map((a, i) => (
          <div key={a.id} onClick={() => onOpenArticle(a)} style={{
            padding: '28px 0', borderTop: `1px solid ${PAPER.rule}`, cursor: 'pointer',
            display: 'flex', gap: 16, alignItems: 'flex-start',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, letterSpacing: 2.6, fontWeight: 700, color: PAPER.inkMute, textTransform: 'uppercase', marginBottom: 8 }}>
                {a.section} · {a.kicker}
              </div>
              <h2 style={{
                fontFamily: FONTS.editorial, fontSize: 21, fontWeight: 400,
                lineHeight: 1.15, letterSpacing: -0.3, margin: 0, textWrap: 'balance',
              }}>{a.title}</h2>
              <div style={{ fontSize: 11, color: PAPER.inkMute, marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                {a.gated && !subscribed && Icon.lock(10, PAPER.inkMute)}
                <span>{a.author} · {a.readTime}</span>
              </div>
            </div>
            <div style={{ width: 92, height: 118, flexShrink: 0, overflow: 'hidden', filter: a.gated && !subscribed ? 'grayscale(0.4)' : 'none' }}>
              <img src={a.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 140 }}/>
    </div>
  );
}

function SoftPaywall({ onSubscribe }) {
  return (
    <div style={{
      margin: '0 24px 32px', padding: '32px 24px',
      background: PAPER.ink, color: PAPER.bg,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 10, letterSpacing: 3, fontWeight: 700, textTransform: 'uppercase', opacity: 0.7 }}>
        Continue reading
      </div>
      <div style={{
        fontFamily: FONTS.editorial, fontSize: 26, fontWeight: 400,
        letterSpacing: -0.4, lineHeight: 1.15, margin: '14px 0 10px',
        fontStyle: 'italic', textWrap: 'balance',
      }}>
        Three stories remain. A subscription unlocks all of them.
      </div>
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 20, lineHeight: 1.5 }}>
        Unlimited access to The Dispatch across Watch, Listen, and Read. Cancel anytime.
      </div>
      <button onClick={onSubscribe} style={{
        width: '100%', padding: '14px', border: 'none', cursor: 'pointer',
        background: PAPER.bg, color: PAPER.ink,
        fontFamily: FONTS.editorialSans, fontSize: 13, fontWeight: 700,
        letterSpacing: 1.4, textTransform: 'uppercase',
      }}>Subscribe · CHF 9 / month</button>
      <div style={{ fontSize: 10, marginTop: 12, opacity: 0.55, letterSpacing: 0.3 }}>
        Already a member? Sign in
      </div>
    </div>
  );
}

// Full article view (subscribed)
function ArticleView({ article, onClose, accent }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PAPER.bg, zIndex: 50, overflowY: 'auto' }}>
      {/* full-bleed hero */}
      <div style={{ position: 'relative', width: '100%', height: 420 }}>
        <img src={article.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.45) 100%)' }}/>
        <button onClick={onClose} style={{
          position: 'absolute', top: 58, left: 16, width: 36, height: 36, borderRadius: 18,
          background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(14px)',
          border: 'none', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icon.chevronL(18, '#fff')}</button>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 24, color: '#fff' }}>
          <div style={{ fontSize: 10, letterSpacing: 3, fontWeight: 700, textTransform: 'uppercase', opacity: 0.85 }}>
            {article.section} · {article.kicker}
          </div>
          <h1 style={{
            fontFamily: FONTS.editorial, fontSize: 32, fontWeight: 400,
            lineHeight: 1.08, letterSpacing: -0.5, margin: '12px 0 0', textWrap: 'balance',
          }}>{article.title}</h1>
        </div>
      </div>

      <div style={{ padding: '28px 24px 140px', color: PAPER.ink, fontFamily: FONTS.editorial }}>
        <div style={{ fontSize: 11, letterSpacing: 1, color: PAPER.inkMute, marginBottom: 20 }}>
          By <strong style={{ color: PAPER.ink }}>{article.author}</strong> · {article.readTime} read · {article.section.toLowerCase()}
        </div>
        <p style={{ fontSize: 19, lineHeight: 1.5, fontWeight: 400, letterSpacing: -0.1, margin: '0 0 20px', fontStyle: 'italic', color: PAPER.inkDim }}>
          {article.dek}
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.6, margin: '0 0 18px' }}>
          <span style={{ fontFamily: FONTS.editorial, fontSize: 56, fontWeight: 400, float: 'left', lineHeight: 0.9, marginRight: 10, marginTop: 4 }}>F</span>
          or three decades, Europe's railways pursued speed with a religious fervour. High-speed corridors were drawn through the continent like ambitious pen strokes on a civic napkin, and the night train — slow, meandering, unfashionable — quietly fell out of favour.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.6, margin: '0 0 18px' }}>
          The service between Zürich and Amsterdam was discontinued. The Paris-to-Venice sleeper ended with a hand-written farewell note pinned to the conductor's carriage. By 2016, the night train appeared to be a victim of its own romance.
        </p>
        {article.pullquote && (
          <div style={{
            borderLeft: `3px solid ${accent.solid}`,
            padding: '6px 0 6px 18px', margin: '28px 0',
            fontSize: 22, lineHeight: 1.35, fontWeight: 400, letterSpacing: -0.2, textWrap: 'balance',
          }}>{article.pullquote}</div>
        )}
        <p style={{ fontSize: 17, lineHeight: 1.6, margin: '0 0 18px' }}>
          And yet: on a Tuesday in March of this year, I boarded the Nightjet 40421 in Zürich at 21:40. By the time I reached Hamburg, I had slept eight full hours, read half a novel, and eaten a breakfast that arrived on a small china plate with a single edelweiss.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { ReadPage, ArticleView });
