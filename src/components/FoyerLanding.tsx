'use client'

import { useState, useEffect, useRef, useCallback } from "react"
import { Kanban, MessageSquare, FileText, Calendar } from "lucide-react"

// ── BRAND TOKENS ─────────────────────────────────────────────────────────────
const C = {
  cream:   "#F4EDE4",
  clem:    "#D97942",
  plum:    "#4A1F3F",
  ink:     "#1F1419",
  oat:     "#E8DFD2",
  mauve:   "#6B5C63",
  border:  "#E8DFD2",
  dim:     "#6B5C63",
  dimmer:  "rgba(107,92,99,0.65)",
  dimmest: "rgba(107,92,99,0.4)",
}

// Light text tokens (dark surfaces)
const P = {
  text:        "#F4EDE4",
  dim:         "rgba(244,237,228,0.60)",
  dimmer:      "rgba(244,237,228,0.38)",
  border:      "rgba(244,237,228,0.08)",
  borderBright:"rgba(244,237,228,0.25)",
}

const fraunces = `'Fraunces', Georgia, serif`
const geist    = `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
const mono     = `'Geist Mono', 'Fira Mono', monospace`

const WIDGET_SNIPPET = `<script src="https://findfoyer.com/widget.js"
  data-venue="YOUR_VENUE_ID"></script>`

const CHIPS = [
  "Clem replied to 3 enquiries",
  "New lead: 40 guests, private dining",
  "Proposal sent · The Ivy Private Room",
]

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  .foyer-root { cursor: none; }
  .foyer-root a, .foyer-root button, .foyer-root input { cursor: none; }

  @keyframes ring-pulse {
    0%   { transform: scale(1);   opacity: 0.45; }
    100% { transform: scale(2.6); opacity: 0; }
  }

  @keyframes ticker-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .ticker-track {
    display: flex;
    animation: ticker-scroll 30s linear infinite;
    width: max-content;
  }
  .ticker-track:hover { animation-play-state: paused; }

  @keyframes shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  .fade-up {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-up.visible { opacity: 1; transform: translateY(0); }

  .f-input::placeholder { color: rgba(107,92,99,0.5); }
  .f-input:focus { outline: none; border-color: #4A1F3F; }
  .f-input-dark::placeholder { color: rgba(244,237,228,0.28); }
  .f-input-dark:focus { outline: none; border-color: rgba(244,237,228,0.32); }

  .btn-primary { transition: opacity 0.15s; }
  .btn-primary:hover { opacity: 0.85; }
  .a-link { transition: opacity 0.15s; }
  .a-link:hover { opacity: 0.7; }

  .dark-feat-card {
    transition: border-color 0.2s, background 0.2s;
    border: 1px solid rgba(244,237,228,0.08);
    border-radius: 4px;
    padding: 24px;
  }
  .dark-feat-card:hover {
    border-color: rgba(244,237,228,0.18);
    background: rgba(244,237,228,0.04);
  }

  .foyer-nav--scrolled {
    background: rgba(31,20,25,0.95) !important;
    backdrop-filter: blur(12px) !important;
  }

  .faq-details + .faq-details {
    border-top: 1px solid rgba(244,237,228,0.08);
  }
  .faq-summary {
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    cursor: none;
  }
  .faq-summary::-webkit-details-marker { display: none; }
  .faq-summary::after {
    content: "+";
    font-size: 20px;
    font-family: system-ui, sans-serif;
    color: rgba(244,237,228,0.38);
    transition: transform 0.2s ease;
    flex-shrink: 0;
    margin-left: 16px;
    line-height: 1;
  }
  details[open] .faq-summary::after { transform: rotate(45deg); }

  .chip-fade {
    transition: opacity 0.4s ease;
  }
`

// ── RESIZE OBSERVER ───────────────────────────────────────────────────────────
function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>): number {
  const [w, setW] = useState(1200)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    setW(el.offsetWidth)
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return w
}

// ── CUSTOM CURSOR ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let lx = 0, ly = 0, pressed = false

    const place = (x: number, y: number) => {
      el.style.transform = `translate(${x - 14}px, ${y - 14}px) scale(${pressed ? 0.79 : 1})`
    }
    const onMove  = (e: MouseEvent) => { lx = e.clientX; ly = e.clientY; el.style.opacity = "1"; place(lx, ly) }
    const onLeave = () => { el.style.opacity = "0" }
    const onDown  = () => { pressed = true;  place(lx, ly) }
    const onUp    = () => { pressed = false; place(lx, ly) }

    document.addEventListener("mousemove",  onMove,  { passive: true })
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mousedown",  onDown)
    document.addEventListener("mouseup",    onUp)
    return () => {
      document.removeEventListener("mousemove",  onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mousedown",  onDown)
      document.removeEventListener("mouseup",    onUp)
    }
  }, [])

  return (
    <div ref={ref} style={{
      position: "fixed", top: 0, left: 0, width: 28, height: 28,
      zIndex: 9999, pointerEvents: "none", mixBlendMode: "difference",
      opacity: 0, willChange: "transform",
    }}>
      <svg width="28" height="28" viewBox="0 0 360 360" fill="none">
        <rect x="103" y="47"  width="32"  height="267" rx="16" fill="#F4EDE4" />
        <rect x="103" y="47"  width="139" height="77"  rx="18" fill="#F4EDE4" />
        <rect x="154" y="157" width="103" height="57"  rx="18" fill="#F4EDE4" />
      </svg>
    </div>
  )
}

// ── FADE UP ───────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVis(true); io.disconnect() }
    }, { threshold: 0.08 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`fade-up${vis ? " visible" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// ── FOYER MARK ────────────────────────────────────────────────────────────────
function FoyerMark({ size = 28, color = C.clem }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 360 360" fill="none" aria-hidden>
      <rect x="103" y="47"  width="32"  height="267" rx="16" fill={color} />
      <rect x="103" y="47"  width="139" height="77"  rx="18" fill={color} />
      <rect x="154" y="157" width="103" height="57"  rx="18" fill={color} />
    </svg>
  )
}

// ── EMAIL FORM ────────────────────────────────────────────────────────────────
function EmailForm({ stack, compact, dark }: { stack?: boolean; compact?: boolean; dark?: boolean }) {
  const [email, setEmail] = useState("")
  const [done, setDone]   = useState(false)

  if (done) {
    return (
      <p style={{ fontFamily: geist, fontSize: compact ? 15 : 17, fontWeight: 500, color: dark ? P.text : C.ink, padding: "12px 0" }}>
        Got it. You&apos;ll hear from us first.
      </p>
    )
  }

  const py = compact ? 11 : 13
  const fs = compact ? 14 : 15

  return (
    <form
      onSubmit={e => { e.preventDefault(); if (email) setDone(true) }}
      style={{ display: "flex", flexDirection: stack ? "column" : "row", gap: 8, width: "100%" }}
    >
      <input
        className={dark ? "f-input-dark" : "f-input"}
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{
          flex: stack ? "unset" : "1 1 0",
          width: stack ? "100%" : undefined,
          minWidth: 0,
          background: dark ? "rgba(244,237,228,0.06)" : "#FFFFFF",
          border: dark ? "1px solid rgba(244,237,228,0.14)" : `1px solid ${C.oat}`,
          borderRadius: 4,
          padding: `${py}px 16px`,
          color: dark ? C.cream : C.ink,
          fontFamily: geist,
          fontSize: fs,
        }}
      />
      <button
        type="submit"
        className="btn-primary"
        style={{ background: C.clem, color: C.ink, border: "none", borderRadius: 4, padding: `${py}px 24px`, fontFamily: geist, fontSize: fs, fontWeight: 700, whiteSpace: "nowrap", width: stack ? "100%" : undefined }}
      >
        Get early access
      </button>
    </form>
  )
}

// ── SKELETON ──────────────────────────────────────────────────────────────────
function Skel({ w, h, r = 4 }: { w: string; h: number; r?: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: r, background: "rgba(244,237,228,0.08)", marginBottom: 8, flexShrink: 0 }} />
  )
}

// ── EYEBROW ───────────────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: geist, fontSize: 11, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: P.dimmer, marginBottom: 16 }}>
      {children}
    </div>
  )
}

// ── SECTION HEADING ───────────────────────────────────────────────────────────
function SectionHead({ eyebrow, headline, lede, mob, tab }: {
  eyebrow: string
  headline: React.ReactNode
  lede?: React.ReactNode
  mob: boolean
  tab: boolean
}) {
  const h2Sz = mob ? 28 : tab ? 36 : 44
  return (
    <FadeUp>
      <Eyebrow>[ {eyebrow} ]</Eyebrow>
      <h2 style={{ fontFamily: geist, fontSize: h2Sz, fontWeight: 700, color: P.text, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: lede ? 16 : 0 }}>
        {headline}
      </h2>
      {lede && (
        <p style={{ fontFamily: geist, fontSize: 16, color: P.dim, lineHeight: 1.7, maxWidth: 560, marginTop: 16 }}>
          {lede}
        </p>
      )}
    </FadeUp>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function FoyerLanding() {
  const rootRef  = useRef<HTMLDivElement>(null)
  const heroRef  = useRef<HTMLElement>(null)
  const navRef   = useRef<HTMLElement>(null)
  const cw = useContainerWidth(rootRef)

  const mob = cw < 640
  const tab = cw < 1024
  const sm  = mob || tab

  const px   = mob ? 24 : tab ? 48 : 80
  const hSz  = mob ? 44 : tab ? 68 : 96
  const bSz  = mob ? 15 : 17
  const gap  = mob ? 24 : tab ? 32 : 48

  const [chipIdx,      setChipIdx]      = useState(0)
  const [chipVisible,  setChipVisible]  = useState(true)
  const [navDark,      setNavDark]      = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [copied,       setCopied]       = useState(false)
  const [floatVisible, setFloatVisible] = useState(false)

  // Chip cycling
  useEffect(() => {
    const id = setInterval(() => {
      setChipVisible(false)
      setTimeout(() => {
        setChipIdx(i => (i + 1) % CHIPS.length)
        setChipVisible(true)
      }, 400)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  // Nav darkens on scroll
  useEffect(() => {
    const onScroll = () => setNavDark(window.scrollY > 80)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Float pill appears when hero leaves viewport
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      setFloatVisible(!entry.isIntersecting)
    }, { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(WIDGET_SNIPPET).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  const secPad = { paddingLeft: px, paddingRight: px, paddingTop: mob ? 64 : 96, paddingBottom: mob ? 64 : 96 }

  return (
    <div ref={rootRef} className="foyer-root" style={{ fontFamily: geist, color: P.text, backgroundColor: C.ink, width: "100%", overflowX: "hidden" }}>
      <style>{CSS}</style>
      <CustomCursor />

      {/* ── NAV ── */}
      <nav ref={navRef} className={navDark ? "foyer-nav--scrolled" : ""}
        style={{
          position: "sticky", top: 0, zIndex: 200,
          height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingLeft: px, paddingRight: px,
          background: C.ink,
          borderBottom: `1px solid ${P.border}`,
          transition: "background 0.3s",
        }}>
        <img src="/brand/foyer-logo.svg" alt="foyer" style={{ height: 26 }} />

        {/* Desktop links */}
        {!mob && (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <button onClick={() => scrollTo("how")} className="a-link"
              style={{ background: "none", border: "none", fontFamily: geist, fontSize: 14, color: P.dim, fontWeight: 500 }}>
              How it works
            </button>
            <button onClick={() => scrollTo("pricing")} className="a-link"
              style={{ background: "none", border: "none", fontFamily: geist, fontSize: 14, color: P.dim, fontWeight: 500 }}>
              Pricing
            </button>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn-primary" onClick={() => scrollTo("final-cta")}
            style={{ background: C.clem, color: C.ink, border: "none", borderRadius: 4, padding: "7px 18px", fontFamily: geist, fontSize: 13, fontWeight: 600 }}>
            Get early access
          </button>
          {mob && (
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ background: "none", border: "none", display: "flex", flexDirection: "column", gap: 5, padding: 4 }}
              aria-label="Menu">
              {[0,1,2].map(i => (
                <span key={i} style={{ display: "block", width: 22, height: 1.5, background: P.text, borderRadius: 1 }} />
              ))}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mob && menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 500,
          background: C.ink, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 40,
        }}>
          <button onClick={() => setMenuOpen(false)}
            style={{ position: "absolute", top: 16, right: 24, background: "none", border: "none", color: P.text, fontSize: 24 }}>
            ✕
          </button>
          {["How it works|how", "Pricing|pricing", "Get early access|final-cta"].map(item => {
            const [label, id] = item.split("|")
            return (
              <button key={id} onClick={() => scrollTo(id)}
                style={{ background: "none", border: "none", fontFamily: geist, fontSize: 22, fontWeight: 600, color: P.text }}>
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", textAlign: "center",
        paddingLeft: px, paddingRight: px,
        paddingTop: 80, paddingBottom: 80,
        background: C.ink,
        position: "relative",
      }}>
        {/* Pulse ring container */}
        <div style={{ position: "relative", width: 160, height: 160, marginBottom: 40 }}>
          {[0, 0.8, 1.6].map((delay, i) => (
            <span key={i} style={{
              position: "absolute", inset: 0,
              borderRadius: "50%",
              border: `1px solid rgba(217,121,66,${0.4 - i * 0.12})`,
              animation: `ring-pulse 2.4s ease-out ${delay}s infinite`,
              pointerEvents: "none",
            }} />
          ))}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            border: "1px solid rgba(244,237,228,0.10)",
            background: "rgba(217,121,66,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FoyerMark size={72} color={C.clem} />
          </div>
        </div>

        {/* Status chip */}
        <div className="chip-fade" style={{
          opacity: chipVisible ? 1 : 0,
          fontFamily: geist, fontSize: 13, color: P.dim,
          border: `1px solid ${P.border}`,
          borderRadius: 999, padding: "5px 14px",
          marginBottom: 28,
        }}>
          {CHIPS[chipIdx]}
        </div>

        <h1 style={{
          fontFamily: geist, fontWeight: 800,
          fontSize: `clamp(44px, 8vw, ${hSz}px)`,
          letterSpacing: "-0.04em", lineHeight: 1.0,
          color: P.text, maxWidth: 800,
          marginBottom: 20,
        }}>
          Private events deserve<br />better software.
        </h1>

        <p style={{
          fontFamily: geist, fontSize: mob ? 16 : 19,
          color: P.dim, lineHeight: 1.65,
          maxWidth: 500, marginBottom: 40,
        }}>
          Stop losing bookings to whoever replies first.
        </p>

        <button className="btn-primary" onClick={() => scrollTo("final-cta")}
          style={{
            background: C.clem, color: C.ink, border: "none",
            borderRadius: 4, padding: "14px 32px",
            fontFamily: geist, fontSize: 16, fontWeight: 700,
            marginBottom: 20,
          }}>
          Get early access
        </button>

        <p style={{ fontFamily: geist, fontSize: 12, color: P.dimmer }}>
          Early access · London venues only · No credit card
        </p>
      </section>

      {/* ── TICKER ── */}
      <div style={{
        borderTop: `1px solid ${P.border}`,
        borderBottom: `1px solid ${P.border}`,
        paddingTop: 14, paddingBottom: 14,
        overflow: "hidden",
        background: "rgba(244,237,228,0.02)",
      }}>
        <div className="ticker-track">
          {[0, 1].map(copy => (
            <span key={copy} style={{ display: "flex", alignItems: "center", gap: 0, whiteSpace: "nowrap" }}>
              {["Restaurants", "Hotels", "Members clubs", "Private dining rooms", "Galleries", "Roof terraces", "Boutique hotels", "Event spaces", "London venues"].map((v, i) => (
                <span key={i}>
                  <span style={{ fontFamily: geist, fontSize: 12, fontWeight: 600, color: P.dimmer, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {v}
                  </span>
                  <span style={{ color: P.border, margin: "0 20px", fontSize: 12 }}>·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── PROBLEM ── */}
      <section id="problem" style={secPad}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <SectionHead
            eyebrow="The Problem"
            headline={<>An enquiry came in at 8pm.<br />You were in service.</>}
            mob={mob} tab={tab}
          />
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(2, 1fr)", gap: mob ? 32 : 64, marginTop: mob ? 40 : 56 }}>
            <FadeUp delay={80}>
              <p style={{ fontFamily: geist, fontSize: bSz, color: P.dim, lineHeight: 1.8 }}>
                An enquiry comes in. You&apos;re mid-service. By the time you reply — an hour later, maybe the next morning — the booker has confirmed somewhere else. Not because your venue wasn&apos;t right. Because you weren&apos;t first.
              </p>
              <p style={{ fontFamily: geist, fontSize: bSz, color: P.dim, lineHeight: 1.8, marginTop: 20 }}>
                This plays out hundreds of times a year across London&apos;s private dining rooms, hotel event spaces, and members clubs. Not a pipeline problem. A speed problem. One the whole industry shares.
              </p>
            </FadeUp>
            <FadeUp delay={160}>
              <p style={{ fontFamily: geist, fontSize: bSz, color: P.text, lineHeight: 1.8 }}>
                <strong style={{ color: P.text }}>Foyer&apos;s AI, Clem, reads every enquiry the moment it lands.</strong> Budget confirmed, headcount noted, event type matched — before you&apos;ve even opened the message. Clem drafts a reply in your voice. You review and send in one click. Or let Clem send automatically.
              </p>
              <p style={{ fontFamily: geist, fontSize: bSz, color: P.dim, lineHeight: 1.8, marginTop: 20 }}>
                Venues using Foyer reply in under a minute. Even when they&apos;re in the middle of service.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── PRODUCT ── */}
      <section id="product" style={{ ...secPad, borderTop: `1px solid ${P.border}` }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <SectionHead
            eyebrow="The Product"
            headline={<>Three things.<br />That&apos;s the whole product.</>}
            mob={mob} tab={tab}
          />
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: gap, marginTop: mob ? 40 : 56 }}>
            {[
              {
                n: "01", title: "Reads the enquiry",
                body: "Date, headcount, event type, budget range. Clem has it all before you've opened the message. You see a brief, not a wall of text from a stranger.",
              },
              {
                n: "02", title: "Drafts the reply",
                body: "Personalised, in your voice, in under a minute. Not a template that makes you sound like a hotel chain. Written for this person, this booking, this date.",
              },
              {
                n: "03", title: "Moves the pipeline",
                body: "Knows who to chase and when. Every lead tracked, every follow-up timed — without the spreadsheet you'll stop updating by Tuesday.",
              },
            ].map((item, i) => (
              <FadeUp key={item.n} delay={i * 80}>
                <div className="dark-feat-card">
                  <div style={{ fontFamily: geist, fontSize: 12, fontWeight: 700, color: C.clem, marginBottom: 18, letterSpacing: "0.06em", borderTop: `1px solid ${C.clem}`, paddingTop: 14 }}>
                    {item.n}
                  </div>
                  <h3 style={{ fontFamily: geist, fontSize: 19, fontWeight: 700, color: P.text, letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 12 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: geist, fontSize: 14, color: P.dim, lineHeight: 1.75 }}>
                    {item.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ ...secPad, borderTop: `1px solid ${P.border}` }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <SectionHead
            eyebrow="How It Works"
            headline="Set up in an afternoon. Running by evening."
            mob={mob} tab={tab}
          />
          <div style={{ marginTop: mob ? 40 : 56, display: "flex", flexDirection: "column", gap: mob ? 48 : 64 }}>

            {/* Step 01 */}
            <FadeUp delay={0}>
              <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: gap, alignItems: "start" }}>
                <div>
                  <div style={{ fontFamily: geist, fontSize: 12, fontWeight: 700, color: C.clem, letterSpacing: "0.06em", borderTop: `1px solid ${C.clem}`, paddingTop: 14, marginBottom: 14 }}>01</div>
                  <h3 style={{ fontFamily: geist, fontSize: 22, fontWeight: 700, color: P.text, letterSpacing: "-0.02em", marginBottom: 12 }}>Drop the snippet</h3>
                  <p style={{ fontFamily: geist, fontSize: bSz, color: P.dim, lineHeight: 1.75 }}>
                    One line of code on your website. Every enquiry from that page lands directly in Foyer.
                  </p>
                </div>
                <div>
                  <div style={{
                    background: "rgba(244,237,228,0.04)",
                    border: `1px solid ${P.border}`,
                    borderRadius: 4,
                    padding: "16px 20px",
                    position: "relative",
                  }}>
                    <pre style={{ fontFamily: mono, fontSize: mob ? 11 : 13, color: P.dim, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.6 }}>
                      {WIDGET_SNIPPET}
                    </pre>
                    <button onClick={handleCopy} className="btn-primary"
                      style={{
                        position: "absolute", top: 12, right: 12,
                        background: copied ? "rgba(244,237,228,0.12)" : "rgba(244,237,228,0.06)",
                        border: `1px solid ${P.border}`,
                        borderRadius: 4, padding: "4px 10px",
                        fontFamily: geist, fontSize: 12, color: P.dim,
                      }}>
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Step 02 */}
            <FadeUp delay={0}>
              <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: gap, alignItems: "start" }}>
                <div>
                  <div style={{ fontFamily: geist, fontSize: 12, fontWeight: 700, color: C.clem, letterSpacing: "0.06em", borderTop: `1px solid ${C.clem}`, paddingTop: 14, marginBottom: 14 }}>02</div>
                  <h3 style={{ fontFamily: geist, fontSize: 22, fontWeight: 700, color: P.text, letterSpacing: "-0.02em", marginBottom: 12 }}>Clem reads it first</h3>
                  <p style={{ fontFamily: geist, fontSize: bSz, color: P.dim, lineHeight: 1.75 }}>
                    Before you see the message, Clem has it qualified. Budget confirmed, headcount noted, event type matched. You get the brief, not the noise.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: mob ? "flex-start" : "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 12px" }}>
                      {[0, 0.6].map((delay, i) => (
                        <span key={i} style={{
                          position: "absolute", inset: 0, borderRadius: "50%",
                          border: `1px solid rgba(217,121,66,${0.35 - i * 0.12})`,
                          animation: `ring-pulse 2.4s ease-out ${delay}s infinite`,
                        }} />
                      ))}
                      <div style={{
                        position: "absolute", inset: 0, borderRadius: "50%",
                        background: C.clem,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <FoyerMark size={32} color={C.cream} />
                      </div>
                    </div>
                    <p style={{ fontFamily: geist, fontSize: 12, color: P.dimmer, letterSpacing: "0.04em" }}>
                      The enquiry form, live on any site
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Step 03 */}
            <FadeUp delay={0}>
              <div>
                <div style={{ fontFamily: geist, fontSize: 12, fontWeight: 700, color: C.clem, letterSpacing: "0.06em", borderTop: `1px solid ${C.clem}`, paddingTop: 14, marginBottom: 14 }}>03</div>
                <h3 style={{ fontFamily: geist, fontSize: 22, fontWeight: 700, color: P.text, letterSpacing: "-0.02em", marginBottom: 12 }}>You review and send</h3>
                <p style={{ fontFamily: geist, fontSize: bSz, color: P.dim, lineHeight: 1.75, maxWidth: 500 }}>
                  See Clem&apos;s draft, edit or approve, and send in one click. Every conversation threaded, every lead tracked.
                </p>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── BROWSER MOCKUP ── */}
      <section id="mockup" style={{ ...secPad, borderTop: `1px solid ${P.border}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <FadeUp>
            <div style={{ border: `1px solid ${P.border}`, borderRadius: 8, overflow: "hidden" }}>
              {/* Chrome bar */}
              <div style={{
                height: 36, background: "rgba(244,237,228,0.06)",
                display: "flex", alignItems: "center",
                paddingLeft: 14, gap: 8,
                borderBottom: `1px solid ${P.border}`,
              }}>
                {["#A94A3A","#D97942","#7A8A6F"].map((c, i) => (
                  <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
                ))}
                <div style={{
                  flex: 1, margin: "0 16px", height: 22,
                  background: "rgba(244,237,228,0.05)",
                  borderRadius: 4, border: `1px solid ${P.border}`,
                  display: "flex", alignItems: "center", paddingLeft: 10,
                }}>
                  <span style={{ fontFamily: mono, fontSize: 11, color: P.dimmer }}>app.findfoyer.com</span>
                </div>
              </div>

              {/* App interior */}
              <div style={{ display: "flex", minHeight: mob ? 260 : 380, background: C.ink, position: "relative" }}>
                {!mob && (
                  <div style={{
                    width: 180, flexShrink: 0, borderRight: `1px solid ${P.border}`,
                    padding: "20px 16px", display: "flex", flexDirection: "column", gap: 8,
                  }}>
                    <Skel w="60%" h={16} />
                    {[70, 90, 80, 75, 85, 65].map((w, i) => (
                      <Skel key={i} w={`${w}%`} h={14} />
                    ))}
                  </div>
                )}

                <div style={{ flex: 1, padding: "20px", display: "flex", gap: 12, overflowX: "auto" }}>
                  {["New", "Qualified", "Proposal Sent", "Confirmed"].map((col, ci) => (
                    <div key={col} style={{ minWidth: mob ? 120 : 160, flexShrink: 0 }}>
                      <div style={{ marginBottom: 10 }}>
                        <Skel w="70%" h={13} />
                      </div>
                      {[0, 1, ci === 0 ? 2 : -1].filter(x => x >= 0).map((_, ki) => (
                        <div key={ki} style={{
                          background: "rgba(244,237,228,0.04)",
                          border: `1px solid ${P.border}`,
                          borderRadius: 4, padding: 10, marginBottom: 8,
                        }}>
                          <Skel w="85%" h={12} />
                          <Skel w="60%" h={10} />
                          <Skel w="40%" h={10} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div style={{
                  position: "absolute", bottom: 16, right: 16,
                  display: "flex", alignItems: "flex-end", gap: 8,
                }}>
                  <div style={{
                    background: "rgba(31,20,25,0.9)",
                    border: `1px solid ${P.border}`,
                    borderRadius: 6, padding: "8px 12px",
                    maxWidth: 200,
                  }}>
                    <p style={{ fontFamily: geist, fontSize: 11, color: P.text, margin: 0, lineHeight: 1.5 }}>
                      Clem replied to 3 enquiries while you were away
                    </p>
                  </div>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: C.clem, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <FoyerMark size={16} color={C.cream} />
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <section id="dashboard" style={{ ...secPad, borderTop: `1px solid ${P.border}` }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <SectionHead
            eyebrow="The Dashboard"
            headline="Everything in one place."
            mob={mob} tab={tab}
          />
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(2, 1fr)", gap: gap, marginTop: mob ? 40 : 56 }}>
            {[
              { Icon: Kanban, title: "Pipeline", body: "Every lead through every stage. New, Qualified, Proposal Sent, Confirmed. Nothing slips." },
              { Icon: MessageSquare, title: "AI-suggested replies", body: "Clem drafts the response. Review and send in one click. Or let Clem send automatically — your call." },
              { Icon: FileText, title: "Proposals", body: "Structured, comparable, out in minutes. Not a PDF attachment from 2019." },
              { Icon: Calendar, title: "Calendar sync", body: "Your availability, always current. No double-bookings, no back-and-forth on dates that are already gone." },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 60}>
                <div className="dark-feat-card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    <item.Icon size={20} color={C.clem} aria-hidden />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: geist, fontSize: 17, fontWeight: 700, color: P.text, letterSpacing: "-0.02em", marginBottom: 8 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontFamily: geist, fontSize: 14, color: P.dim, lineHeight: 1.7 }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ ...secPad, borderTop: `1px solid ${P.border}` }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <SectionHead
            eyebrow="Pricing"
            headline="Simple, London-first pricing."
            mob={mob} tab={tab}
          />
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: gap, marginTop: mob ? 40 : 56, alignItems: "start" }}>
            {[
              {
                name: "Early Access", price: "£0", per: "/mo", featured: false,
                features: ["50 enquiries/month", "1 inbox", "Clem AI replies"],
                cta: "Join waitlist", muted: true,
              },
              {
                name: "Growth", price: "£49", per: "/mo", featured: true, popular: true,
                features: ["200 enquiries/month", "Gmail integration", "Full pipeline", "Proposals"],
                cta: "Get early access", muted: false,
              },
              {
                name: "Scale", price: "£149", per: "/mo", featured: false,
                features: ["Unlimited enquiries", "Multiple inboxes", "Custom AI voice", "Dedicated setup"],
                cta: "Join waitlist", muted: true,
              },
            ].map((plan, i) => (
              <FadeUp key={plan.name} delay={i * 80}>
                <div style={{
                  border: `1px solid ${plan.featured ? P.borderBright : P.border}`,
                  background: plan.featured ? "rgba(244,237,228,0.03)" : "transparent",
                  borderRadius: 8, padding: 28, position: "relative",
                }}>
                  {plan.popular && (
                    <div style={{
                      position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                      background: C.clem, color: C.ink,
                      fontFamily: geist, fontSize: 11, fontWeight: 700,
                      borderRadius: 999, padding: "3px 12px", whiteSpace: "nowrap",
                    }}>
                      ★ Most popular
                    </div>
                  )}
                  <div style={{ fontFamily: geist, fontSize: 13, fontWeight: 600, color: P.dim, marginBottom: 12 }}>{plan.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                    <span style={{ fontFamily: geist, fontSize: 36, fontWeight: 800, color: P.text, letterSpacing: "-0.03em" }}>{plan.price}</span>
                    <span style={{ fontFamily: geist, fontSize: 13, color: P.dimmer }}>{plan.per}</span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ fontFamily: geist, fontSize: 14, color: P.dim, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: C.clem, fontSize: 16, lineHeight: 1 }}>—</span>{f}
                      </li>
                    ))}
                  </ul>
                  <button className="btn-primary" onClick={() => scrollTo("final-cta")}
                    style={{
                      width: "100%", background: plan.muted ? "transparent" : C.clem,
                      color: plan.muted ? P.dim : C.ink,
                      border: `1px solid ${plan.muted ? P.border : C.clem}`,
                      borderRadius: 4, padding: "11px 0",
                      fontFamily: geist, fontSize: 14, fontWeight: 600,
                    }}>
                    {plan.cta}
                  </button>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={100}>
            <p style={{ fontFamily: geist, fontSize: 13, color: P.dimmer, marginTop: 24, textAlign: "center" }}>
              Add-on: additional inboxes £15/mo each. All plans include unlimited venues.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ ...secPad, borderTop: `1px solid ${P.border}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <SectionHead
            eyebrow="FAQ"
            headline="Straight answers."
            lede="Things venue managers ask before signing up."
            mob={mob} tab={tab}
          />
          <div style={{ marginTop: mob ? 40 : 56, borderTop: `1px solid ${P.border}` }}>
            {[
              { q: "How does Clem know my venue?", a: "You give Clem your menus, capacity, pricing, and availability. They learn the rest from every enquiry they handle." },
              { q: "Does this replace my email inbox?", a: "No. Enquiries still land in your email. Foyer runs alongside it — Clem just handles them before you've had a chance to open them." },
              { q: "What kind of venues can use Foyer?", a: "Any space taking private events for 20–150 guests. Restaurants with private dining rooms, hotels, members clubs, galleries, and private hire spaces." },
              { q: "Is Foyer only for London?", a: "For now. We're starting in London and expanding in late 2026." },
              { q: "How much does it actually cost?", a: "Free during early access. Paid plans from £49/month launch later this year. No credit card to join the waitlist." },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 40}>
                <details className="faq-details">
                  <summary className="faq-summary">
                    <span style={{ fontFamily: geist, fontSize: mob ? 15 : 17, fontWeight: 600, color: P.text, lineHeight: 1.4 }}>
                      {item.q}
                    </span>
                  </summary>
                  <p style={{ fontFamily: geist, fontSize: 15, color: P.dim, lineHeight: 1.75, paddingBottom: 20, marginTop: 0 }}>
                    {item.a}
                  </p>
                </details>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section id="final-cta" style={{ ...secPad, paddingTop: mob ? 96 : 160, paddingBottom: mob ? 96 : 160, borderTop: `1px solid ${P.border}`, textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <FadeUp>
            <Eyebrow>[ Get Started ]</Eyebrow>
            <h2 style={{ fontFamily: geist, fontSize: mob ? 32 : 48, fontWeight: 800, color: P.text, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Stop losing bookings{mob ? " " : <br />}to whoever replies first.
            </h2>
            <p style={{ fontFamily: geist, fontSize: bSz, color: P.dim, lineHeight: 1.7, marginBottom: 36 }}>
              Join the waitlist and be in the first group of London venues to use Foyer.
            </p>
            <div style={{ maxWidth: 460, margin: "0 auto 20px" }}>
              <EmailForm stack={mob} dark />
            </div>
            <p style={{ fontFamily: geist, fontSize: 12, color: P.dimmer }}>
              Early access · London venues only · No credit card
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${P.border}`, paddingLeft: px, paddingRight: px, paddingTop: mob ? 48 : 64, paddingBottom: mob ? 32 : 48 }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "2fr 1fr 1fr", gap: mob ? 40 : gap }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <FoyerMark size={28} color={C.clem} />
                <span style={{ fontFamily: fraunces, fontSize: 18, fontWeight: 500, color: P.text, letterSpacing: "-0.01em" }}>foyer</span>
              </div>
              <p style={{ fontFamily: geist, fontSize: 14, color: P.dim, lineHeight: 1.65, maxWidth: 280, marginBottom: 12 }}>
                The private events platform for London venues.
              </p>
              <a href="mailto:kha-ai@findfoyer.com" className="a-link" style={{ fontFamily: geist, fontSize: 13, color: P.dimmer, textDecoration: "none" }}>
                kha-ai@findfoyer.com
              </a>
            </div>
            <div>
              <div style={{ fontFamily: geist, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: P.dimmer, marginBottom: 16 }}>Product</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[["How it works", "how"], ["Pricing", "pricing"], ["Create account", "final-cta"], ["Sign in", "final-cta"]].map(([label, id]) => (
                  <button key={label} onClick={() => scrollTo(id)} className="a-link"
                    style={{ background: "none", border: "none", textAlign: "left", fontFamily: geist, fontSize: 14, color: P.dim }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: geist, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: P.dimmer, marginBottom: 16 }}>Connect</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a href="https://findfoyer.com" className="a-link" style={{ fontFamily: geist, fontSize: 14, color: P.dim, textDecoration: "none" }}>App</a>
                <a href="mailto:kha-ai@findfoyer.com" className="a-link" style={{ fontFamily: geist, fontSize: 14, color: P.dim, textDecoration: "none" }}>Email us</a>
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="a-link"
                  style={{ background: "none", border: "none", textAlign: "left", fontFamily: geist, fontSize: 14, color: P.dim }}>
                  Back to top
                </button>
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${P.border}`, marginTop: mob ? 40 : 56, paddingTop: 24 }}>
            <p style={{ fontFamily: geist, fontSize: 12, color: P.dimmer, margin: 0 }}>© 2026 Foyer · findfoyer.com</p>
          </div>
        </div>
      </footer>

      {/* ── FLOATING PILL ── */}
      <div style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 400,
        opacity: floatVisible ? 1 : 0,
        transform: floatVisible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: floatVisible ? "auto" : "none",
      }}>
        <button className="btn-primary" onClick={() => scrollTo("final-cta")}
          style={{
            background: C.clem, color: C.ink, border: "none",
            borderRadius: 999, padding: "12px 24px",
            fontFamily: geist, fontSize: 14, fontWeight: 700,
            boxShadow: "0 8px 32px rgba(217,121,66,0.25)",
          }}>
          Get early access →
        </button>
      </div>

    </div>
  )
}
