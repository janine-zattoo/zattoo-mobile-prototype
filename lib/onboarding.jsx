// First-time experience, subscription/upgrade flow, personalisation gate,
// data-consent modal, region picker, and the "please subscribe" play-intercept
// bottom sheet. All surfaces are dark-themed and match the rest of the Watch UX.

// ─── Swiss regions ───────────────────────────────────────────────────
const REGIONS = [
{ id: 'zh', label: 'Zürich', sub: 'DE · 1.5M viewers' },
{ id: 'be', label: 'Bern', sub: 'DE · 400k viewers' },
{ id: 'bs', label: 'Basel', sub: 'DE · 200k viewers' },
{ id: 'lu', label: 'Luzern', sub: 'DE · 120k viewers' },
{ id: 'sg', label: 'St. Gallen', sub: 'DE · 110k viewers' },
{ id: 'ge', label: 'Genève', sub: 'FR · 500k viewers' },
{ id: 'vd', label: 'Lausanne', sub: 'FR · 280k viewers' },
{ id: 'ti', label: 'Ticino', sub: 'IT · 160k viewers' },
{ id: 'gr', label: 'Graubünden', sub: 'DE/RM · 90k viewers' },
{ id: 'vs', label: 'Valais', sub: 'DE/FR · 140k viewers' }];


// ─── Subscription plans ──────────────────────────────────────────────
const PLANS = [
{
  id: 'solo',
  name: 'Solo',
  tagline: 'Just you.',
  priceCHF: 9.90,
  priceSubtitle: '1 week free trial',
  streams: 1,
  recordings: 150,
  features: [
  'PIN protection (optional)',
  'Downloads',
  'EU travel access']

},
{
  id: 'duo',
  name: 'Duo',
  tagline: 'Two screens, two tastes.',
  priceCHF: 14.90,
  priceSubtitle: 'Billed monthly',
  streams: 2,
  recordings: 300,
  features: [
  'Profiles + Youth Protection',
  'PIN protection (optional)',
  'Downloads',
  'EU travel access',
  'Profile matching (Netflix, Prime, etc.)'],

  recommended: true
},
{
  id: 'family',
  name: 'Family',
  tagline: 'Everyone at home.',
  priceCHF: 22.90,
  priceSubtitle: 'Billed monthly',
  streams: 6,
  recordings: 600,
  features: [
  'Profiles + Youth Protection',
  'PIN protection (optional)',
  'Downloads',
  'EU travel access',
  'Profile matching for shared viewing']

}];


// ─── Shared shell: dark full-screen overlay with close X ─────────────
function Overlay({ onClose, children, zIndex = 120, padTop = 0 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex, background: DARK.bg,
      color: DARK.text, overflowY: 'auto',
      paddingTop: padTop,
      animation: 'zt-fade-in .22s ease-out'
    }}>
      {onClose &&
      <button onClick={onClose} aria-label="Close" style={{
        position: 'absolute', top: 54, right: 16, width: 36, height: 36, borderRadius: 18,
        background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: DARK.text, zIndex: 2
      }}>{Icon.close(18, DARK.text)}</button>
      }
      {children}
      <style>{`
        @keyframes zt-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes zt-sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>);

}

// ─── Bottom sheet wrapper ───────────────────────────────────────────
function BottomSheet({ onClose, children, maxHeight = '82%' }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 150,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'zt-fade-in .18s ease-out'
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxHeight, background: DARK.bgRaised, color: DARK.text,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        paddingBottom: 40, overflowY: 'auto',
        animation: 'zt-sheet-up .26s cubic-bezier(.2,.8,.2,1)',
        borderTop: `1px solid ${DARK.hairlineStrong}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: DARK.hairlineStrong }} />
        </div>
        {children}
      </div>
    </div>);

}

// ─── 1. Welcome / First-Time Experience ──────────────────────────────
function WelcomeScreen({ accent, onExplore, onStart }) {
  return (
    <Overlay zIndex={200}>
      {/* warm cinematic gradient backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(120% 80% at 20% 10%, ${accent.glow} 0%, transparent 55%),
                     radial-gradient(90% 60% at 90% 90%, ${accent.soft} 0%, transparent 50%),
                     linear-gradient(180deg, #141216 0%, #0A0A0C 100%)`
      }} />
      {/* soft film-grain layer */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.5,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`
      }} />

      <div style={{
        position: 'relative', minHeight: '100%', padding: '54px 24px 24px',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Wordmark */}
        <div style={{
          display: 'flex', alignItems: 'center'
        }}>
          <img src={window.__resources.img_logo} alt="Zattoo" style={{ height: 56, width: 'auto', display: 'block' }} />
        </div>

        {/* centerpiece */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 16 }}>
          <div style={{
            fontSize: 11, letterSpacing: 2.4, textTransform: 'uppercase',
            fontWeight: 700, color: accent.solid, marginBottom: 10
          }}>Willkommen</div>

          <div style={{
            fontFamily: FONTS.display, fontSize: 36, fontWeight: 400,
            lineHeight: 1.02, letterSpacing: -1.2, textWrap: 'balance',
            marginBottom: 12
          }}>
            Watch, listen,<br />read<br />
            <span style={{ color: accent.solid }}>all in one.</span>
          </div>

          <div style={{
            fontSize: 13.5, lineHeight: 1.45, color: DARK.textDim, maxWidth: 320,
            textWrap: 'pretty'
          }}>
            Über 300 Sender, Hunderte von Radios, und Longform vom Feinsten — live, on demand, und jetzt auch zum Lesen.
          </div>

          {/* three quick callouts */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
            { icon: Icon.tv, label: 'Live TV & On Demand', meta: '300+ Sender' },
            { icon: Icon.headphones, label: 'Radio & Podcasts', meta: 'Schweiz · Europa' },
            { icon: Icon.book, label: 'Magazine & Reportagen', meta: 'Neu · diese Woche' }].
            map((c) =>
            <div key={c.label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${DARK.hairline}`
            }}>
                <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: accent.soft, color: accent.solid,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{c.icon(17, accent.solid)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontSize: 10.5, color: DARK.textMute, marginTop: 1 }}>{c.meta}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          <button onClick={onStart} style={{
            width: '100%', height: 46, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: accent.solid, color: accent.onSolid || '#fff',
            fontFamily: FONTS.ui, fontSize: 14, fontWeight: 700, letterSpacing: 0.2,
            boxShadow: `0 10px 30px ${accent.glow}`
          }}>Kostenlos testen · 1 Woche gratis</button>
          <button onClick={onExplore} style={{
            width: '100%', height: 40, borderRadius: 12, cursor: 'pointer',
            background: 'transparent', border: `1px solid ${DARK.hairlineStrong}`,
            color: DARK.text,
            fontFamily: FONTS.ui, fontSize: 13, fontWeight: 600
          }}>Erst mal umschauen</button>
          <div style={{
            textAlign: 'center', fontSize: 10.5, color: DARK.textMute, marginTop: 2,
            lineHeight: 1.4
          }}>Streams benötigen ein aktives Abo. Das Umschauen bleibt immer gratis.
          </div>
        </div>
      </div>
    </Overlay>);

}

// ─── 2. Subscribe sheet ── friendly play-intercept ──────────────────
function SubscribeIntercept({ accent, onClose, onChoose }) {
  return (
    <BottomSheet onClose={onClose} maxHeight="70%">
      <div style={{ padding: '18px 22px 8px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 10px', borderRadius: 999,
          background: accent.soft, color: accent.solid,
          fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase'
        }}>{Icon.lock(12, accent.solid)} Abo erforderlich</div>

        <div style={{
          fontFamily: FONTS.display, fontSize: 28, fontWeight: 400,
          letterSpacing: -0.6, lineHeight: 1.1, marginTop: 14,
          textWrap: 'balance'
        }}>
          Um jetzt zu streamen, wähle einen Plan, der zu dir passt.
        </div>
        <div style={{
          fontSize: 13.5, color: DARK.textDim, marginTop: 10, lineHeight: 1.5,
          textWrap: 'pretty'
        }}>
          Schon ab CHF 9.90 pro Monat — 1 Woche kostenlos testen, jederzeit kündbar.
        </div>

        {/* tiny teaser row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
          {['300+ Sender', 'Keine Werbung', 'EU-Reisefunktion', 'Aufnahmen'].map((t) =>
          <div key={t} style={{
            padding: '6px 10px', borderRadius: 6,
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${DARK.hairline}`,
            fontSize: 11, fontWeight: 500, color: DARK.textDim
          }}>{t}</div>
          )}
        </div>

        <button onClick={onChoose} style={{
          marginTop: 22, width: '100%', height: 52, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: accent.solid, color: accent.onSolid || '#fff',
          fontFamily: FONTS.ui, fontSize: 15, fontWeight: 700, letterSpacing: 0.2,
          boxShadow: `0 8px 24px ${accent.glow}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          Plan auswählen {Icon.chevronR(16, '#fff')}
        </button>
        <button onClick={onClose} style={{
          marginTop: 8, width: '100%', height: 44, borderRadius: 10,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: DARK.textDim, fontSize: 13, fontWeight: 600
        }}>Später vielleicht</button>
      </div>
    </BottomSheet>);

}

// ─── 3. Plan chooser ─────────────────────────────────────────────────
function SubscribeChooser({ accent, onClose, onPick }) {
  const [selected, setSelected] = React.useState('duo');
  return (
    <Overlay onClose={onClose} zIndex={200}>
      <div style={{ padding: '56px 20px 40px', minHeight: '100%' }}>
        <div style={{
          fontSize: 11, letterSpacing: 2.4, textTransform: 'uppercase',
          fontWeight: 700, color: accent.solid, marginTop: 30
        }}>Abo wählen</div>
        <div style={{
          fontFamily: FONTS.display, fontSize: 32, fontWeight: 400,
          letterSpacing: -0.8, lineHeight: 1.05, marginTop: 8,
          textWrap: 'balance'
        }}>Drei Pläne. Eine Plattform.</div>
        <div style={{
          fontSize: 13, color: DARK.textDim, marginTop: 10, lineHeight: 1.5, maxWidth: 320
        }}>Alle Pläne beginnen mit einer einwöchigen Gratisphase. Jederzeit wechselbar oder kündbar.</div>

        {/* plans — stacked cards */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {PLANS.map((p) => {
            const isSel = p.id === selected;
            return (
              <button key={p.id} onClick={() => setSelected(p.id)} style={{
                textAlign: 'left', cursor: 'pointer', padding: 18,
                borderRadius: 14, background: isSel ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: isSel ? `1.5px solid ${accent.solid}` : `1px solid ${DARK.hairlineStrong}`,
                color: DARK.text, position: 'relative',
                transition: 'all .18s'
              }}>
                {p.recommended &&
                <div style={{
                  position: 'absolute', top: -10, left: 16,
                  background: accent.solid, color: accent.onSolid || '#fff',
                  fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase',
                  padding: '4px 10px', borderRadius: 4
                }}>Beliebt</div>
                }
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: DARK.textMute, marginTop: 2 }}>{p.tagline}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500, letterSpacing: -0.3 }}>
                      CHF {p.priceCHF.toFixed(2)}
                    </div>
                    <div style={{ fontSize: 10.5, color: DARK.textMute, marginTop: 2 }}>pro Monat</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex', gap: 16, marginTop: 14, paddingTop: 12,
                  borderTop: `1px solid ${DARK.hairline}`
                }}>
                  <Stat n={p.streams} label={p.streams === 1 ? 'Stream' : 'Streams'} />
                  <Stat n={p.recordings} label="Aufnahmen" />
                  <Stat n={p.priceSubtitle === '1 week free trial' ? '7 d' : '7 d'} label="gratis" />
                </div>

                <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {p.features.map((f) =>
                  <li key={f} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 12.5, color: DARK.textDim
                  }}>
                      <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-6" stroke={accent.solid} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  )}
                </ul>
              </button>);

          })}
        </div>

        <button onClick={() => onPick(PLANS.find((p) => p.id === selected))} style={{
          marginTop: 22, width: '100%', height: 54, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: accent.solid, color: accent.onSolid || '#fff',
          fontFamily: FONTS.ui, fontSize: 15, fontWeight: 700, letterSpacing: 0.2,
          boxShadow: `0 10px 30px ${accent.glow}`
        }}>
          Mit {PLANS.find((p) => p.id === selected).name} fortfahren
        </button>
        <div style={{
          textAlign: 'center', fontSize: 11, color: DARK.textMute, marginTop: 10, lineHeight: 1.5
        }}>
          Keine Vertragsbindung · Zahlung erst nach der Gratisphase
        </div>
      </div>
    </Overlay>);

}

function Stat({ n, label }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 500 }}>{n}</div>
      <div style={{ fontSize: 10, color: DARK.textMute, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>);

}

// ─── 4. Signup (email) ───────────────────────────────────────────────
function SignupScreen({ plan, accent, onClose, onContinue }) {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const valid = email.includes('@') && pw.length >= 6;
  return (
    <Overlay onClose={onClose} zIndex={210}>
      <div style={{ padding: '56px 24px 40px', minHeight: '100%' }}>
        <div style={{ marginTop: 30 }}>
          <div style={{
            fontSize: 11, letterSpacing: 2.4, textTransform: 'uppercase',
            fontWeight: 700, color: accent.solid
          }}>Schritt 1 von 2 · Konto</div>
          <div style={{
            fontFamily: FONTS.display, fontSize: 30, fontWeight: 400,
            letterSpacing: -0.7, lineHeight: 1.08, marginTop: 10,
            textWrap: 'balance'
          }}>Konto für deinen<br />{plan.name}-Plan erstellen.</div>
          <div style={{
            fontSize: 13, color: DARK.textDim, marginTop: 10, lineHeight: 1.5
          }}>Wir schicken dir nur, was du brauchst — keine Spam-Mails, versprochen.</div>
        </div>

        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="E-Mail" value={email} onChange={setEmail} type="email" placeholder="du@beispiel.ch" autoFocus accent={accent} />
          <Field label="Passwort" value={pw} onChange={setPw} type="password" placeholder="mindestens 6 Zeichen" accent={accent} />
        </div>

        <button disabled={!valid} onClick={() => onContinue({ email, pw })} style={{
          marginTop: 28, width: '100%', height: 54, borderRadius: 12, border: 'none',
          cursor: valid ? 'pointer' : 'not-allowed',
          background: valid ? accent.solid : 'rgba(255,255,255,0.08)',
          color: valid ? '#fff' : DARK.textMute,
          fontFamily: FONTS.ui, fontSize: 15, fontWeight: 700, letterSpacing: 0.2,
          boxShadow: valid ? `0 10px 30px ${accent.glow}` : 'none',
          transition: 'all .18s'
        }}>Weiter zur Zahlung</button>

        <div style={{
          marginTop: 24, padding: 14, borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: `1px solid ${DARK.hairline}`,
          fontSize: 12, color: DARK.textDim, lineHeight: 1.5
        }}>
          Mit dem Erstellen stimmst du unseren <span style={{ color: accent.solid, fontWeight: 600 }}>AGB</span> und der <span style={{ color: accent.solid, fontWeight: 600 }}>Datenschutzerklärung</span> zu.
        </div>
      </div>
    </Overlay>);

}

function Field({ label, value, onChange, type = 'text', placeholder, autoFocus, accent }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{
        fontSize: 10.5, letterSpacing: 1.6, textTransform: 'uppercase',
        fontWeight: 700, color: DARK.textMute, marginBottom: 8
      }}>{label}</div>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} autoFocus={autoFocus}
        style={{
          width: '100%', padding: '14px 16px',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${DARK.hairlineStrong}`,
          borderRadius: 10, color: DARK.text,
          fontFamily: FONTS.ui, fontSize: 15, fontWeight: 500,
          outline: 'none'
        }}
        onFocus={(e) => e.target.style.borderColor = accent.solid}
        onBlur={(e) => e.target.style.borderColor = DARK.hairlineStrong} />
      
    </label>);

}

// ─── 5. Checkout ─────────────────────────────────────────────────────
function CheckoutScreen({ plan, accent, onClose, onConfirm }) {
  const [method, setMethod] = React.useState('card');
  return (
    <Overlay onClose={onClose} zIndex={220}>
      <div style={{ padding: '56px 24px 40px', minHeight: '100%' }}>
        <div style={{ marginTop: 30 }}>
          <div style={{
            fontSize: 11, letterSpacing: 2.4, textTransform: 'uppercase',
            fontWeight: 700, color: accent.solid
          }}>Schritt 2 von 2 · Zahlung</div>
          <div style={{
            fontFamily: FONTS.display, fontSize: 30, fontWeight: 400,
            letterSpacing: -0.7, lineHeight: 1.08, marginTop: 10
          }}>Fast geschafft.</div>
        </div>

        {/* plan summary */}
        <div style={{
          marginTop: 20, padding: 16, borderRadius: 12,
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${DARK.hairline}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 10.5, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: 700, color: DARK.textMute }}>Plan</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500, marginTop: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 12, color: DARK.textDim, marginTop: 2 }}>{plan.tagline}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500 }}>CHF {plan.priceCHF.toFixed(2)}</div>
              <div style={{ fontSize: 10.5, color: DARK.textMute, marginTop: 2 }}>pro Monat</div>
            </div>
          </div>
          <div style={{
            marginTop: 14, paddingTop: 12, borderTop: `1px solid ${DARK.hairline}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ fontSize: 12, color: DARK.textDim }}>Heute fällig</div>
            <div style={{
              fontFamily: FONTS.display, fontSize: 18, fontWeight: 600,
              color: accent.solid
            }}>CHF 0.00</div>
          </div>
          <div style={{ fontSize: 11, color: DARK.textMute, marginTop: 6 }}>
            Erste Zahlung nach 7 Tagen — vorher jederzeit kündbar.
          </div>
        </div>

        {/* method selector */}
        <div style={{
          fontSize: 10.5, letterSpacing: 1.6, textTransform: 'uppercase',
          fontWeight: 700, color: DARK.textMute, marginTop: 24, marginBottom: 10
        }}>Zahlungsmethode</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
          { k: 'card', label: 'Karte' },
          { k: 'twint', label: 'TWINT' },
          { k: 'paypal', label: 'PayPal' }].
          map((m) =>
          <button key={m.k} onClick={() => setMethod(m.k)} style={{
            flex: 1, padding: '12px 10px', cursor: 'pointer',
            background: method === m.k ? 'rgba(255,255,255,0.06)' : 'transparent',
            border: method === m.k ? `1.5px solid ${accent.solid}` : `1px solid ${DARK.hairlineStrong}`,
            borderRadius: 10, color: DARK.text,
            fontFamily: FONTS.ui, fontSize: 13, fontWeight: 600
          }}>{m.label}</button>
          )}
        </div>

        {/* card fields (mocked) */}
        {method === 'card' &&
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Kartennummer" value="4242 4242 4242 4242" onChange={() => {}} accent={accent} />
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}><Field label="Gültig bis" value="12 / 29" onChange={() => {}} accent={accent} /></div>
              <div style={{ flex: 1 }}><Field label="CVC" value="123" onChange={() => {}} accent={accent} /></div>
            </div>
          </div>
        }
        {method === 'twint' &&
        <div style={{
          marginTop: 16, padding: 20, borderRadius: 12,
          background: 'rgba(255,255,255,0.04)', border: `1px solid ${DARK.hairline}`,
          textAlign: 'center', fontSize: 13, color: DARK.textDim, lineHeight: 1.5
        }}>Du wirst zur TWINT-App weitergeleitet, sobald du auf „Abo starten" tippst.</div>
        }
        {method === 'paypal' &&
        <div style={{
          marginTop: 16, padding: 20, borderRadius: 12,
          background: 'rgba(255,255,255,0.04)', border: `1px solid ${DARK.hairline}`,
          textAlign: 'center', fontSize: 13, color: DARK.textDim, lineHeight: 1.5
        }}>Du wirst zur PayPal-Anmeldung weitergeleitet.</div>
        }

        <button onClick={onConfirm} style={{
          marginTop: 28, width: '100%', height: 54, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: accent.solid, color: accent.onSolid || '#fff',
          fontFamily: FONTS.ui, fontSize: 15, fontWeight: 700, letterSpacing: 0.2,
          boxShadow: `0 10px 30px ${accent.glow}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          {Icon.lock(13, '#fff')} Abo starten · 1 Woche gratis
        </button>
        <div style={{
          textAlign: 'center', fontSize: 11, color: DARK.textMute, marginTop: 10, lineHeight: 1.5
        }}>Verschlüsselt · SSL · Zattoo AG, Zürich</div>
      </div>
    </Overlay>);

}

// ─── 6. Consent / privacy modal ──────────────────────────────────────
function ConsentModal({ accent, onClose, onAccept }) {
  return (
    <BottomSheet onClose={onClose} maxHeight="88%">
      <div style={{ padding: '14px 22px 8px' }}>
        <div style={{
          fontSize: 11, letterSpacing: 2.4, textTransform: 'uppercase',
          fontWeight: 700, color: accent.solid, marginTop: 6
        }}>Datenschutz</div>
        <div style={{
          fontFamily: FONTS.display, fontSize: 26, fontWeight: 400,
          letterSpacing: -0.5, lineHeight: 1.1, marginTop: 8, textWrap: 'balance'
        }}>Personalisierung aktivieren</div>
        <div style={{
          fontSize: 13, color: DARK.textDim, marginTop: 12, lineHeight: 1.55,
          textWrap: 'pretty'
        }}>
          Um dir Empfehlungen und „Weiterschauen" anzuzeigen, verarbeiten wir folgende Daten — nur intern, nie an Dritte verkauft:
        </div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
          { title: 'Wiedergabeverlauf', body: 'Welche Inhalte du angesehen hast und wie weit du jeweils warst.' },
          { title: 'Favoriten & Bewertungen', body: 'Sender, Serien und Artikel, die du markiert oder geliked hast.' },
          { title: 'Grobe Region', body: 'Für regionale Empfehlungen — kein genaues Tracking.' }].
          map((r) =>
          <div key={r.title} style={{
            padding: 14, borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${DARK.hairline}`
          }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: DARK.textDim, marginTop: 4, lineHeight: 1.5 }}>{r.body}</div>
            </div>
          )}
        </div>

        <div style={{
          marginTop: 16, padding: 14, borderRadius: 10,
          background: accent.soft, color: accent.text,
          fontSize: 12, lineHeight: 1.5
        }}>
          Du kannst die Personalisierung jederzeit in den Einstellungen wieder ausschalten und deine Daten löschen lassen.
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button onClick={onClose} style={{
            flex: 1, height: 48, borderRadius: 12, cursor: 'pointer',
            background: 'transparent', border: `1px solid ${DARK.hairlineStrong}`,
            color: DARK.text, fontFamily: FONTS.ui, fontSize: 14, fontWeight: 600
          }}>Nicht jetzt</button>
          <button onClick={onAccept} style={{
            flex: 1.4, height: 48, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: accent.solid, color: accent.onSolid || '#fff',
            fontFamily: FONTS.ui, fontSize: 14, fontWeight: 700, letterSpacing: 0.2,
            boxShadow: `0 8px 24px ${accent.glow}`
          }}>Aktivieren</button>
        </div>
      </div>
    </BottomSheet>);

}

// ─── 7. Personalisation gate card (replaces Continue Watching row) ──
function PersonalisationGate({ accent, onEnable }) {
  return (
    <div style={{ padding: '0 16px 4px' }}>
      <div style={{
        padding: '20px 20px 22px', borderRadius: 14,
        background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
        border: `1px dashed ${DARK.hairlineStrong}`,
        position: 'relative', overflow: 'hidden'
      }}>
        {/* soft accent puddle */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 160, height: 160,
          borderRadius: 80, background: accent.soft, filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 10.5, letterSpacing: 1.6, textTransform: 'uppercase',
          fontWeight: 700, color: DARK.textMute, position: 'relative'
        }}>
          {Icon.lock(11, DARK.textMute)} Personalisierung aus
        </div>
        <div style={{
          fontFamily: FONTS.display, fontSize: 19, fontWeight: 500,
          letterSpacing: -0.3, lineHeight: 1.2, marginTop: 8,
          position: 'relative', textWrap: 'balance'
        }}>
          Deine Empfehlungen warten darauf, gefunden zu werden.
        </div>
        <div style={{
          fontSize: 12.5, color: DARK.textDim, marginTop: 8, lineHeight: 1.5,
          position: 'relative', textWrap: 'pretty'
        }}>
          Wir zeigen dir gerade keine personalisierten Empfehlungen oder „Weiterschauen" — weil wir deinen Verlauf noch nicht verwenden dürfen.
        </div>

        <button onClick={onEnable} style={{
          marginTop: 16, padding: '11px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: accent.solid, color: accent.onSolid || '#fff',
          fontFamily: FONTS.ui, fontSize: 13, fontWeight: 700, letterSpacing: 0.2,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: `0 6px 18px ${accent.glow}`,
          position: 'relative'
        }}>
          Personalisierung aktivieren {Icon.chevronR(14, '#fff')}
        </button>
      </div>
    </div>);

}

// ─── 8. Region picker (chip + bottom sheet) ──────────────────────────
function RegionChip({ region, onClick, accent }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px 5px 12px', borderRadius: 999,
      background: 'rgba(255,255,255,0.06)',
      border: `1px solid ${DARK.hairlineStrong}`,
      color: DARK.text, cursor: 'pointer',
      fontFamily: FONTS.ui, fontSize: 11.5, fontWeight: 600,
      letterSpacing: 0.2, marginLeft: 10,
      verticalAlign: 'middle'
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 3, background: accent.solid,
        boxShadow: `0 0 6px ${accent.glow}`
      }} />
      {region.label}
      {Icon.chevronD(12, DARK.textDim)}
    </button>);

}

function RegionSheet({ current, onClose, onPick, accent }) {
  return (
    <BottomSheet onClose={onClose} maxHeight="78%">
      <div style={{ padding: '14px 22px 8px' }}>
        <div style={{
          fontSize: 11, letterSpacing: 2.4, textTransform: 'uppercase',
          fontWeight: 700, color: accent.solid, marginTop: 6
        }}>Region wechseln</div>
        <div style={{
          fontFamily: FONTS.display, fontSize: 24, fontWeight: 400,
          letterSpacing: -0.4, lineHeight: 1.1, marginTop: 6
        }}>Live across your region.</div>
        <div style={{ fontSize: 12.5, color: DARK.textDim, marginTop: 6, lineHeight: 1.5 }}>
          Regionalsender, Verkehr, Wetter — passend zum Ort, an dem du gerade bist.
        </div>
      </div>

      <div style={{ padding: '14px 12px 0', display: 'flex', flexDirection: 'column' }}>
        {REGIONS.map((r) => {
          const isSel = r.id === current.id;
          return (
            <button key={r.id} onClick={() => onPick(r)} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 12px', borderRadius: 10,
              background: isSel ? 'rgba(255,255,255,0.06)' : 'transparent',
              border: 'none', cursor: 'pointer',
              textAlign: 'left', color: DARK.text
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: isSel ? accent.solid : 'rgba(255,255,255,0.05)',
                color: isSel ? '#fff' : DARK.textDim,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase',
                flexShrink: 0
              }}>{r.id}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: DARK.textMute, marginTop: 1 }}>{r.sub}</div>
              </div>
              {isSel &&
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9l3.5 3.5L14 6" stroke={accent.solid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            </button>);

        })}
      </div>
    </BottomSheet>);

}

// ─── 9. Confirm banner (subscription activated) ──────────────────────
function ConfirmBanner({ accent, message, onDismiss }) {
  React.useEffect(() => {
    const t = setTimeout(onDismiss, 3800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: 'absolute', top: 100, left: 16, right: 16, zIndex: 250,
      padding: '12px 16px', borderRadius: 12,
      background: DARK.bgRaised, border: `1px solid ${accent.solid}`,
      color: DARK.text, boxShadow: `0 14px 40px rgba(0,0,0,0.5), 0 0 0 3px ${accent.soft}`,
      animation: 'zt-fade-in .3s ease-out',
      display: 'flex', alignItems: 'center', gap: 12
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 15, background: accent.solid,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ flex: 1, fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>{message}</div>
    </div>);

}

Object.assign(window, {
  REGIONS, PLANS,
  WelcomeScreen, SubscribeIntercept, SubscribeChooser,
  SignupScreen, CheckoutScreen, ConsentModal,
  PersonalisationGate, RegionChip, RegionSheet, ConfirmBanner
});