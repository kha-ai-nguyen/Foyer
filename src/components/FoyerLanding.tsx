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

// Plum-surface tokens (nav + footer)
const P = {
  text:   "#F4EDE4",
  dim:    "rgba(244,237,228,0.65)",
  dimmer: "rgba(244,237,228,0.38)",
  border: "rgba(244,237,228,0.12)",
}

const fraunces = `'Fraunces', Georgia, serif`
const geist    = `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

// Texture loaded from public/brand/ — served by Next.js / Vercel
const TEXTURE_URL = "/brand/foyer-texture.png"

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
function CustomCursor() {
  const [pos, setPos]   = useState({ x: -200, y: -200 })
  const [vis, setVis]   = useState(false)
  const [down, setDown] = useState(false)

  useEffect(() => {
    const mv = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVis(true) }
    const ml = () => setVis(false)
    const md = () => setDown(true)
    const mu = () => setDown(false)
    document.addEventListener("mousemove", mv)
    document.addEventListener("mouseleave", ml)
    document.addEventListener("mousedown", md)
    document.addEventListener("mouseup", mu)
    return () => {
      document.removeEventListener("mousemove", mv)
      document.removeEventListener("mouseleave", ml)
      document.removeEventListener("mousedown", md)
      document.removeEventListener("mouseup", mu)
    }
  }, [])

  if (!vis) return null
  const sz = down ? 22 : 28
  return (
    <div style={{ position: "fixed", left: pos.x - sz / 2, top: pos.y - sz / 2, zIndex: 9999, pointerEvents: "none", mixBlendMode: "difference", transition: "left 0.04s, top 0.04s" }}>
      <svg width={sz} height={sz} viewBox="0 0 360 360" fill="none">
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

// ── MINI DASHBOARD (peekaboo content) ────────────────────────────────────────
const MINI_COLS = [
  { label: "Enquiry", color: "#6B5C63", cards: [
    { name: "Sophie & James", sub: "Wedding Dinner · 60", date: "14 Jun", val: "£4,200", tag: "New",     tagBg: "#E8F4FD", tagC: "#1565C0" },
    { name: "Condé Nast",     sub: "Brand Launch · 80",  date: "22 Jun", val: "£6,800", tag: "New",     tagBg: "#E8F4FD", tagC: "#1565C0" },
    { name: "Margot Tavern",  sub: "Private Hire · 35",  date: "1 Jul",  val: "£2,100", tag: "Waiting", tagBg: "#F3E5F5", tagC: "#6A1B9A" },
  ]},
  { label: "Qualified", color: "#D97942", cards: [
    { name: "Deloitte UK",    sub: "Team Dinner · 45", date: "18 Jun", val: "£5,500", tag: "Hot",  tagBg: "#FFF3E0", tagC: "#E65100" },
    { name: "The Hendersons", sub: "Birthday · 24",    date: "28 Jun", val: "£1,800", tag: "Warm", tagBg: "#FFF8E1", tagC: "#F57F17" },
  ]},
  { label: "Proposal Sent", color: "#7B61A0", cards: [
    { name: "Goldman Sachs", sub: "Client Dinner · 20", date: "5 Jul", val: "£9,200", tag: "Follow up", tagBg: "#FCE4EC", tagC: "#880E4F" },
  ]},
  { label: "Confirmed", color: "#2D6A4F", cards: [
    { name: "Google DeepMind", sub: "Offsite · 55",     date: "10 Jun", val: "£7,400", tag: "Confirmed", tagBg: "#D8F3DC", tagC: "#2D6A4F" },
    { name: "Rachel & Tom",    sub: "Anniversary · 18", date: "12 Jun", val: "£1,400", tag: "Confirmed", tagBg: "#D8F3DC", tagC: "#2D6A4F" },
  ]},
]

function MiniDashboard() {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", fontFamily: geist, userSelect: "none" }}>
      <div style={{ width: 200, background: "#4A1F3F", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 20px 28px", fontFamily: fraunces, fontSize: 20, fontWeight: 600, color: "#F4EDE4" }}>Foyer</div>
        {[["Conversations", false], ["Pipeline", true], ["Calendar", false], ["Proposals", false]].map(([l, a]) => (
          <div key={l as string} style={{ padding: "10px 20px", background: a ? "rgba(255,255,255,0.12)" : "transparent", borderLeft: a ? "3px solid #D97942" : "3px solid transparent" }}>
            <span style={{ fontSize: 13, fontWeight: a ? 600 : 400, color: a ? "#F4EDE4" : "rgba(244,237,228,0.5)" }}>{l as string}</span>
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: "0 16px" }}>
          <div style={{ background: "rgba(217,121,66,0.15)", border: "1px solid rgba(217,121,66,0.3)", borderRadius: 7, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#D97942", marginBottom: 4, letterSpacing: "0.05em" }}>CLEM</div>
            <div style={{ fontSize: 11, color: "rgba(244,237,228,0.65)", lineHeight: 1.5 }}>3 enquiries need a reply today.</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F4EDE4" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #E8DFD2", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: fraunces, fontSize: 20, fontWeight: 600, color: "#1F1419" }}>Pipeline</div>
            <div style={{ fontSize: 12, color: "#6B5C63", marginTop: 2 }}>Thursday, 1 May 2026</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ border: "1px solid #E8DFD2", borderRadius: 6, padding: "6px 14px", fontSize: 12, color: "#1F1419" }}>Filter</div>
            <div style={{ background: "#D97942", borderRadius: 6, padding: "6px 16px", fontSize: 12, fontWeight: 600, color: "#fff" }}>+ Add lead</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, padding: "16px 20px", flex: 1, overflow: "hidden" }}>
          {MINI_COLS.map(col => (
            <div key={col.label} style={{ flex: 1, background: "#E8DFD2", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, flexShrink: 0 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: col.color, flexShrink: 0 }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: "#1F1419", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{col.label}</div>
                <div style={{ fontSize: 10, color: "#6B5C63", background: "#F4EDE4", borderRadius: 3, padding: "1px 5px", flexShrink: 0 }}>{col.cards.length}</div>
              </div>
              {col.cards.map((card, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 7, padding: "10px 11px", marginBottom: 6, boxShadow: "0 1px 3px rgba(31,20,25,0.06)", flexShrink: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#1F1419", flex: 1, paddingRight: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.name}</div>
                    <span style={{ background: card.tagBg, color: card.tagC, borderRadius: 3, padding: "1px 5px", fontSize: 9, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}>{card.tag}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#6B5C63", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.sub}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 10, color: "#6B5C63" }}>{card.date}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#1F1419" }}>{card.val}</div>
                  </div>
                </div>
              ))}
              <div style={{ border: "1.5px dashed rgba(107,92,99,0.22)", borderRadius: 7, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: "rgba(107,92,99,0.38)" }}>+ Drop here</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── PEEKABOO ──────────────────────────────────────────────────────────────────
function Peekaboo({ cw }: { cw: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)
  const animX = useRef(-999); const animY = useRef(-999)
  const tX = useRef(-999);    const tY = useRef(-999)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    let raf: number
    const tick = () => {
      animX.current = lerp(animX.current, tX.current, 0.13)
      animY.current = lerp(animY.current, tY.current, 0.13)
      if (overlayRef.current) {
        const m = `radial-gradient(circle 230px at ${animX.current}px ${animY.current}px, transparent 0%, black 100%)`
        overlayRef.current.style.webkitMaskImage = m
        overlayRef.current.style.maskImage = m
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    tX.current = e.clientX - rect.left
    tY.current = e.clientY - rect.top
    if (!touched) setTouched(true)
  }, [touched])

  const onLeave = useCallback(() => { tX.current = -999; tY.current = -999 }, [])

  const h = Math.max(380, Math.round(cw * 0.45))

  return (
    <div ref={containerRef} style={{ position: "relative", height: h, overflow: "hidden", background: C.ink }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <div style={{ position: "absolute", inset: 0 }}>
        <MiniDashboard />
      </div>
      <div ref={overlayRef} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(18,13,9,0.96)", pointerEvents: "none" }} />
      <div className={`peek-hint${touched ? " gone" : ""}`}
        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" opacity={0.22}>
          <circle cx="10" cy="10" r="9" stroke="#F4EDE4" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="3" fill="#F4EDE4" />
        </svg>
        <span style={{ fontFamily: geist, fontSize: 11, color: "rgba(244,237,228,0.22)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Move your cursor to peek inside
        </span>
      </div>
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
        background: C.plum,
        borderBottom: `1px solid ${P.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FoyerMark size={22} color={C.cream} />
          <span style={{ fontFamily: fraunces, fontSize: 18, fontWeight: 500, color: C.cream, letterSpacing: "-0.01em" }}>foyer</span>
        </div>
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
      }}>
        {/* Texture overlay */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `url(${TEXTURE_URL})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.08,
        }} />

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

      {divider}

      {/* ── FOOTER: CTA + LINKS ── */}
      <footer id="waitlist" style={{ paddingLeft: px, paddingRight: px, paddingTop: mob ? 64 : 88, paddingBottom: mob ? 48 : 64, background: C.plum }}>
        <FadeUp>
          <div style={{ maxWidth: 540, marginBottom: mob ? 48 : 64 }}>
            <h2 style={{ fontFamily: geist, fontSize: mob ? 32 : 46, fontWeight: 800, color: P.text, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 16 }}>
              Don&apos;t be the venue<br />that replied on Tuesday.
            </h2>
            <p style={{ fontFamily: geist, fontSize: bSz, color: P.dim, lineHeight: 1.65, marginBottom: 28 }}>
              Join the waitlist. Design partners get free access, forever — and a direct line to the product.
            </p>
            <EmailForm stack={mob} dark />
            <p style={{ fontFamily: geist, fontSize: 12, color: P.dimmer, marginTop: 14 }}>
              Invite-only · London venues only · No credit card
            </p>
          </div>
        </FadeUp>

        <div style={{ borderTop: `1px solid ${P.border}`, paddingTop: 28, display: "flex", flexDirection: mob ? "column" : "row", justifyContent: "space-between", alignItems: mob ? "flex-start" : "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FoyerMark size={18} color={P.dimmer} />
            <span style={{ fontFamily: fraunces, fontSize: 15, fontWeight: 500, color: P.dim }}>foyer</span>
            <span style={{ fontFamily: geist, fontSize: 12, color: P.dimmer, marginLeft: 8 }}>· findfoyer.com · London</span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <a className="a-link" href="#your-linkedin-url" target="_blank" rel="noreferrer"
              style={{ fontFamily: geist, fontSize: 13, color: P.dimmer, textDecoration: "none" }}>
              About the founder ↗
            </a>
            <a className="a-link" href="#your-calendly-url" target="_blank" rel="noreferrer"
              style={{ fontFamily: geist, fontSize: 13, color: C.clem, textDecoration: "none", fontWeight: 500 }}>
              Book a user interview →
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}
