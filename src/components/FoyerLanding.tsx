'use client'

import { useState, useEffect, useRef, useCallback } from "react"

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
  text:   "#F4EDE4",
  dim:    "rgba(244,237,228,0.65)",
  dimmer: "rgba(244,237,228,0.38)",
  border: "rgba(244,237,228,0.08)",
}

const fraunces = `'Fraunces', Georgia, serif`
const geist    = `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

// Texture loaded from public/brand/ — served by Next.js / Vercel
const TEXTURE_URL = "/brand/foyer-texture.webp"

// ── CSS ───────────────────────────────────────────────────────────────────────
// Fonts are loaded in globals.css — only component-specific styles here
const CSS = `
  .foyer-root { cursor: none; }
  .foyer-root a, .foyer-root button, .foyer-root input { cursor: none; }

  @keyframes shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  .shimmer-text {
    background: linear-gradient(90deg, #D97942 0%, #C06B38 30%, #4A1F3F 50%, #C06B38 70%, #D97942 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
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

  .feat-card {
    transition: border-color 0.2s, background 0.2s;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 24px;
    margin: -24px;
  }
  .feat-card:hover {
    border-color: rgba(217,121,66,0.25);
    background: rgba(217,121,66,0.05);
  }

  .peek-hint { opacity: 1; transition: opacity 0.5s ease; }
  .peek-hint.gone { opacity: 0; }
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
// Bypasses React state entirely — direct DOM writes on every mousemove are
// far cheaper than triggering a React re-render at 60+ fps.
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
        Join waitlist
      </button>
    </form>
  )
}

// ── PEEKABOO ──────────────────────────────────────────────────────────────────
function Peekaboo({ cw }: { cw: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bubbleRef    = useRef<HTMLDivElement>(null)
  const ax = useRef(0); const ay = useRef(0)
  const tx = useRef(0); const ty = useRef(0)
  const [active, setActive] = useState(false)

  const h   = Math.max(380, Math.round(cw * 0.45))
  const bSz = Math.min(240, Math.max(160, Math.round(cw * 0.18)))

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    let raf: number
    const tick = () => {
      ax.current = lerp(ax.current, tx.current, 0.09)
      ay.current = lerp(ay.current, ty.current, 0.09)
      if (bubbleRef.current) {
        bubbleRef.current.style.transform =
          `translate(calc(-50% + ${ax.current}px), calc(-50% + ${ay.current}px))`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    tx.current = e.clientX - rect.left - rect.width / 2
    ty.current = e.clientY - rect.top  - rect.height / 2
    if (!active) setActive(true)
  }, [active])

  const onLeave = useCallback(() => { tx.current = 0; ty.current = 0 }, [])

  return (
    <div ref={containerRef}
      style={{ position: "relative", height: h, overflow: "hidden", background: C.ink }}
      onMouseMove={onMove} onMouseLeave={onLeave}
    >
      <div ref={bubbleRef} style={{
        position: "absolute", top: "50%", left: "50%",
        width: bSz, height: bSz, borderRadius: "50%",
        overflow: "hidden", border: `3px solid ${C.cream}`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none", willChange: "transform",
      }}>
        <img src={TEXTURE_URL} alt="" aria-hidden
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <span className={`peek-hint${active ? " gone" : ""}`} style={{
        position: "absolute", bottom: 28, left: "50%",
        transform: "translateX(-50%)",
        fontFamily: geist, fontSize: 11, color: P.dimmer,
        letterSpacing: "0.1em", textTransform: "uppercase",
        pointerEvents: "none", whiteSpace: "nowrap",
      }}>
        Move your cursor
      </span>
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function FoyerLanding() {
  const rootRef = useRef<HTMLDivElement>(null)
  const cw = useContainerWidth(rootRef)

  const mob = cw < 640
  const tab = cw < 1024
  const sm  = mob || tab

  const px   = mob ? 24 : tab ? 48 : 80
  const hSz  = mob ? 40 : tab ? 60 : 88
  const h2Sz = mob ? 26 : tab ? 34 : 44
  const bSz  = mob ? 15 : 17
  const cols = mob ? "1fr" : "repeat(3, 1fr)"
  const gap  = mob ? 24 : tab ? 32 : 48

  const divider = <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: 0 }} />

  return (
    <div ref={rootRef} className="foyer-root" style={{ fontFamily: geist, color: C.ink, backgroundColor: C.cream, width: "100%", overflowX: "hidden" }}>
      <style>{CSS}</style>
      <CustomCursor />

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingLeft: px, paddingRight: px,
        background: C.ink,
        borderBottom: `1px solid ${P.border}`,
      }}>
        <img src="/brand/foyer-logo.svg" alt="foyer" style={{ height: 26 }} />
        <button className="btn-primary"
          onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
          style={{ background: C.clem, color: C.ink, border: "none", borderRadius: 4, padding: "7px 18px", fontFamily: geist, fontSize: 13, fontWeight: 600, cursor: "none" }}>
          Join waitlist
        </button>
      </nav>

      {/* ── SECTION 1: HERO ── */}
      <section style={{
        position: "relative",
        paddingLeft: px, paddingRight: px,
        paddingTop: mob ? 72 : 96, paddingBottom: mob ? 72 : 96,
        minHeight: "88vh", display: "flex", flexDirection: "column",
        backgroundImage: `url(${TEXTURE_URL})`,
        backgroundSize: "cover", backgroundPosition: "center",
        backgroundColor: C.cream,
      }}>

        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>

          {/* Venue type chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: mob ? "6px 10px" : "6px 14px", marginBottom: 36 }}>
            {["Restaurants", "Hotels", "Members clubs", "Private hire spaces", "Galleries", "Roof terraces"].map(v => (
              <span key={v} style={{ fontFamily: geist, fontSize: mob ? 11 : 12, color: C.dimmer, letterSpacing: "0.03em", border: `1px solid ${C.border}`, borderRadius: 20, padding: "3px 10px" }}>{v}</span>
            ))}
            <span style={{ fontFamily: geist, fontSize: mob ? 11 : 12, color: C.clem, letterSpacing: "0.03em", border: "1px solid rgba(217,121,66,0.35)", borderRadius: 20, padding: "3px 10px" }}>London</span>
          </div>

          <h1 style={{ fontFamily: geist, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, fontSize: hSz, color: C.ink, marginBottom: 0, maxWidth: 820 }}>
            Stop losing bookings<br />
            <span className="shimmer-text">to whoever replies first.</span>
          </h1>

          <p style={{ fontFamily: geist, fontSize: bSz, color: C.dim, lineHeight: 1.7, maxWidth: 520, marginTop: 28, marginBottom: 40 }}>
            Foyer&apos;s AI reads every private dining and event enquiry, qualifies the lead, and drafts a personalised reply in your voice — in under a minute. For restaurants, hotels, members clubs, and every venue taking private events in London.
          </p>

          <div style={{ maxWidth: mob ? "100%" : 460, marginBottom: 16 }}>
            <EmailForm stack={mob} />
          </div>
          <p style={{ fontFamily: geist, fontSize: 12, color: C.dimmest }}>
            Early access · London venues only · No credit card
          </p>

        </div>
      </section>

      {divider}

      {/* ── SECTION 2: PEEKABOO PREVIEW ── */}
      <section>
        <div style={{ paddingLeft: px, paddingRight: px, paddingTop: mob ? 48 : 64, paddingBottom: mob ? 28 : 36 }}>
          <FadeUp>
            <div style={{ display: "flex", alignItems: sm ? "flex-start" : "flex-end", flexDirection: sm ? "column" : "row", justifyContent: "space-between", gap: 16 }}>
              <h2 style={{ fontFamily: geist, fontSize: h2Sz, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                See what&apos;s running<br />in the background.
              </h2>
              <p style={{ fontFamily: geist, fontSize: 14, color: C.dimmer, maxWidth: 320, lineHeight: 1.65, paddingBottom: 4 }}>
                Move your cursor over the preview to explore the platform. Every lead, conversation, and proposal — in one place.
              </p>
            </div>
          </FadeUp>
        </div>
        <Peekaboo cw={cw} />
      </section>

      {divider}

      {/* ── SECTION 3: WHAT IT DOES ── */}
      <section style={{ paddingLeft: px, paddingRight: px, paddingTop: mob ? 64 : 88, paddingBottom: mob ? 64 : 88 }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <FadeUp>
            <h2 style={{ fontFamily: geist, fontSize: h2Sz, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: mob ? 40 : 60 }}>
              Three things.<br />That&apos;s the whole product.
            </h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: gap }}>

            <FadeUp delay={0}>
              <div className="feat-card">
                <div style={{ fontFamily: geist, fontSize: 12, fontWeight: 700, color: C.clem, marginBottom: 18, letterSpacing: "0.06em", borderTop: `1px solid ${C.clem}`, paddingTop: 14 }}>01</div>
                <h3 style={{ fontFamily: geist, fontSize: 19, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 12 }}>Reads the enquiry</h3>
                <p style={{ fontFamily: geist, fontSize: 14, color: C.dim, lineHeight: 1.75 }}>
                  Date, headcount, event type, budget range — Clem has it all before you&apos;ve even opened the message. You see a brief, not a wall of text from a stranger.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={80}>
              <div className="feat-card">
                <div style={{ fontFamily: geist, fontSize: 12, fontWeight: 700, color: C.clem, marginBottom: 18, letterSpacing: "0.06em", borderTop: `1px solid ${C.clem}`, paddingTop: 14 }}>02</div>
                <h3 style={{ fontFamily: geist, fontSize: 19, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 12 }}>Drafts the reply</h3>
                <p style={{ fontFamily: geist, fontSize: 14, color: C.dim, lineHeight: 1.75 }}>
                  Personalised, in your voice, in under a minute. Not a template that makes you sound like a hotel chain. Written for this person, this booking, this date.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={160}>
              <div className="feat-card">
                <div style={{ fontFamily: geist, fontSize: 12, fontWeight: 700, color: C.clem, marginBottom: 18, letterSpacing: "0.06em", borderTop: `1px solid ${C.clem}`, paddingTop: 14 }}>03</div>
                <h3 style={{ fontFamily: geist, fontSize: 19, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 12 }}>Moves the pipeline</h3>
                <p style={{ fontFamily: geist, fontSize: 14, color: C.dim, lineHeight: 1.75 }}>
                  Knows who to chase and when. Every lead tracked, every follow-up timed — without the spreadsheet you&apos;ll stop updating by Tuesday.
                </p>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="waitlist" style={{
        minHeight: 56, display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap",
        paddingLeft: px, paddingRight: px,
        paddingTop: mob ? 14 : 0, paddingBottom: mob ? 14 : 0,
        gap: 12,
        background: C.ink,
        borderTop: `1px solid ${P.border}`,
      }}>
        <img src="/brand/foyer-logo.svg" alt="foyer" style={{ height: 24 }} />

        <div style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 12 }}>
          {/* Email */}
          <a href="mailto:kha-ai@findfoyer.com" aria-label="Email us" className="a-link"
            style={{ display: "flex", alignItems: "center", color: P.dimmer }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 7 10-7" />
            </svg>
          </a>

          {/* Join waitlist — outlined */}
          <a href="mailto:kha-ai@findfoyer.com?subject=Join%20the%20Foyer%20waitlist" className="a-link"
            style={{
              fontFamily: geist, fontSize: 13, fontWeight: 600,
              color: P.text, border: `1px solid rgba(244,237,228,0.22)`,
              borderRadius: 4, padding: "6px 14px", textDecoration: "none",
              whiteSpace: "nowrap",
            }}>
            Join waitlist
          </a>

          {/* Be a beta tester — primary */}
          <a href="mailto:kha-ai@findfoyer.com?subject=I%20want%20to%20be%20a%20Foyer%20beta%20tester" className="btn-primary"
            style={{
              fontFamily: geist, fontSize: 13, fontWeight: 700,
              color: C.ink, background: C.clem,
              borderRadius: 4, padding: "6px 16px", textDecoration: "none",
              whiteSpace: "nowrap",
            }}>
            Be a beta tester
          </a>
        </div>
      </footer>

    </div>
  )
}
