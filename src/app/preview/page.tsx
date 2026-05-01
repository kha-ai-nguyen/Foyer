"use client"

import { useState } from "react"

// ── TOKENS ────────────────────────────────────────────────────────────────────
const C = {
  cream:        "#F4EDE4",
  clementine:   "#D97942",
  plum:         "#4A1F3F",
  ink:          "#1F1419",
  oat:          "#E8DFD2",
  mauve:        "#6B5C63",
  white:        "#FFFFFF",
  success:      "#2D6A4F",
  successLight: "#D8F3DC",
}
const fr = `'Fraunces', Georgia, serif`
const ge = `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

type View = "pipeline" | "conversations" | "calendar" | "proposals"

// ── SHARED STYLES ─────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400&family=Geist:wght@300;400;500;600;700&display=swap');
  .foy-preview * { box-sizing: border-box; }
  .foy-preview ::-webkit-scrollbar { width: 4px; }
  .foy-preview ::-webkit-scrollbar-thumb { background: ${C.oat}; border-radius: 2px; }
  .foy-preview ::-webkit-scrollbar-track { background: transparent; }
  .nav-btn:hover { background: rgba(255,255,255,0.08) !important; }
  .lead-card:hover { border-color: ${C.clementine}40 !important; }
  .thread-item:hover { background: rgba(232,223,210,0.5) !important; }
  .prop-row:hover { background: rgba(232,223,210,0.35) !important; }
  .ghost-btn:hover { border-color: ${C.mauve} !important; }
  .clem-send:hover { background: #c06a35 !important; }
`

// ── TAG ───────────────────────────────────────────────────────────────────────
const TAG_MAP: Record<string, { bg: string; color: string }> = {
  New:         { bg: "#E8F4FD", color: "#1565C0" },
  Hot:         { bg: "#FFF3E0", color: "#E65100" },
  Warm:        { bg: "#FFF8E1", color: "#F57F17" },
  Waiting:     { bg: "#F3E5F5", color: "#6A1B9A" },
  "Follow up": { bg: "#FCE4EC", color: "#880E4F" },
  Confirmed:   { bg: "#D8F3DC", color: "#2D6A4F" },
  Draft:       { bg: C.oat,     color: C.mauve },
  Sent:        { bg: "#E3F2FD", color: "#1976D2" },
  Accepted:    { bg: "#D8F3DC", color: "#2D6A4F" },
  Expired:     { bg: "#FFEBEE", color: "#C62828" },
}

function Tag({ label, small }: { label: string; small?: boolean }) {
  const s = TAG_MAP[label] ?? { bg: C.oat, color: C.mauve }
  return (
    <span style={{
      background: s.bg, color: s.color,
      borderRadius: 4, padding: small ? "1px 6px" : "2px 8px",
      fontSize: small ? 10 : 11, fontWeight: 600, whiteSpace: "nowrap",
    }}>{label}</span>
  )
}

function ComingSoon() {
  return (
    <span style={{
      background: "rgba(74,31,63,0.08)", color: C.mauve,
      border: "1px solid rgba(74,31,63,0.14)", borderRadius: 20,
      padding: "2px 8px", fontSize: 10, fontWeight: 600, letterSpacing: "0.03em",
    }}>Coming soon</span>
  )
}

// ── PIPELINE ──────────────────────────────────────────────────────────────────
const PIPELINE = [
  { stage: "Enquiry", color: C.mauve, leads: [
    { name: "Sophie & James", event: "Wedding Dinner",  guests: 60, date: "14 Jun", value: "£4,200", tag: "New",       ai: true },
    { name: "Condé Nast",     event: "Brand Launch",   guests: 80, date: "22 Jun", value: "£6,800", tag: "New" },
    { name: "Margot Tavern",  event: "Private Hire",   guests: 35, date: "1 Jul",  value: "£2,100", tag: "Waiting" },
  ]},
  { stage: "Qualified", color: C.clementine, leads: [
    { name: "Deloitte UK",    event: "Team Dinner",    guests: 45, date: "18 Jun", value: "£5,500", tag: "Hot" },
    { name: "The Hendersons", event: "Birthday",       guests: 24, date: "28 Jun", value: "£1,800", tag: "Warm" },
  ]},
  { stage: "Proposal Sent", color: "#7B61A0", leads: [
    { name: "Goldman Sachs",  event: "Client Dinner",  guests: 20, date: "5 Jul",  value: "£9,200", tag: "Follow up" },
  ]},
  { stage: "Confirmed", color: C.success, leads: [
    { name: "Google DeepMind", event: "Offsite Dinner", guests: 55, date: "10 Jun", value: "£7,400", tag: "Confirmed" },
    { name: "Rachel & Tom",    event: "Anniversary",    guests: 18, date: "12 Jun", value: "£1,400", tag: "Confirmed" },
  ]},
]

function LeadCard({ lead }: { lead: (typeof PIPELINE)[0]["leads"][0] }) {
  const [open, setOpen] = useState(false)
  const hasAI = (lead as { ai?: boolean }).ai

  return (
    <div
      className="lead-card"
      onClick={() => hasAI && setOpen(!open)}
      style={{
        background: C.white, borderRadius: 10, padding: "14px 16px", marginBottom: 8,
        cursor: hasAI ? "pointer" : "default",
        border: `1px solid ${open ? C.clementine : "transparent"}`,
        boxShadow: "0 1px 3px rgba(31,20,25,0.06)", transition: "border-color 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
        <span style={{ fontFamily: ge, fontSize: 13, fontWeight: 600, color: C.ink }}>{lead.name}</span>
        <Tag label={lead.tag} />
      </div>
      <div style={{ fontFamily: ge, fontSize: 12, color: C.mauve, marginBottom: 4 }}>
        {lead.event} · {lead.guests} guests
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: ge, fontSize: 12, color: C.mauve }}>{lead.date}</span>
        <span style={{ fontFamily: ge, fontSize: 13, fontWeight: 600, color: C.ink }}>{lead.value}</span>
      </div>
      {hasAI && (
        <div style={{ marginTop: 8 }}>
          <span style={{ background: "#F3EDFA", color: "#6A1B9A", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4 }}>
            Clem has a suggestion
          </span>
        </div>
      )}
      {hasAI && open && (
        <div style={{ marginTop: 10, background: C.cream, borderRadius: 8, padding: "12px 14px", borderLeft: `3px solid ${C.clementine}` }}>
          <div style={{ fontFamily: ge, fontSize: 10, fontWeight: 700, color: C.clementine, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Clem&apos;s suggested reply
          </div>
          <div style={{ fontFamily: ge, fontSize: 12, color: C.ink, lineHeight: 1.6 }}>
            Hi Sophie, thanks so much for your enquiry — a wedding dinner for 60 sounds like a beautiful evening. I&apos;d love to walk you through what we can offer. Are you free for a quick call this week?
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="clem-send" style={{ background: C.clementine, color: C.white, border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, fontFamily: ge, cursor: "pointer" }}>Send</button>
            <button className="ghost-btn" style={{ background: "transparent", color: C.mauve, border: `1px solid ${C.oat}`, borderRadius: 6, padding: "6px 12px", fontSize: 12, fontFamily: ge, cursor: "pointer" }}>Edit</button>
          </div>
        </div>
      )}
    </div>
  )
}

function PipelineView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "20px 28px", borderBottom: `1px solid ${C.oat}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.cream, flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: fr, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em" }}>Pipeline</div>
          <div style={{ fontFamily: ge, fontSize: 13, color: C.mauve, marginTop: 2 }}>Thursday, 1 May 2026</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ghost-btn" style={{ background: "transparent", border: `1px solid ${C.oat}`, borderRadius: 7, padding: "7px 14px", fontSize: 13, color: C.ink, fontFamily: ge, cursor: "pointer" }}>Filter</button>
          <button className="clem-send" style={{ background: C.clementine, border: "none", borderRadius: 7, padding: "7px 16px", fontSize: 13, fontWeight: 600, color: C.white, fontFamily: ge, cursor: "pointer" }}>+ Add lead</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, padding: "20px 24px", flex: 1, overflow: "hidden" }}>
        {PIPELINE.map(col => (
          <div key={col.stage} style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: C.oat, borderRadius: 12, padding: 14, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
              <div style={{ fontFamily: ge, fontSize: 13, fontWeight: 600, color: C.ink, flex: 1 }}>{col.stage}</div>
              <div style={{ fontFamily: ge, fontSize: 12, color: C.mauve, background: C.cream, borderRadius: 4, padding: "2px 7px" }}>{col.leads.length}</div>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {col.leads.map((lead, i) => <LeadCard key={i} lead={lead} />)}
              <div style={{ border: `1.5px dashed ${C.mauve}40`, borderRadius: 8, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, color: `${C.mauve}60`, fontFamily: ge }}>+ Drop here</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── CONVERSATIONS ─────────────────────────────────────────────────────────────
const CONVOS = [
  {
    id: 1, name: "Sophie & James", initials: "SJ",
    event: "Wedding Dinner · 60 guests · 14 Jun",
    preview: "That's wonderful — we'd love somewhere with a private entrance...",
    time: "2m", unread: true,
    msgs: [
      { side: "in",  text: "Hi, we're looking for a private dining space for our wedding dinner in June. Do you have anything available for 60 guests?", t: "10:32" },
      { side: "out", clem: true, text: "Hi Sophie — congratulations on the upcoming wedding. A dinner for 60 is something we can help with. I've pulled three spaces that match your date. Anything specific I should know about the group?", t: "10:32" },
      { side: "in",  text: "That's wonderful — we'd love somewhere with a private entrance if possible, and ideally a room we can decorate ourselves.", t: "10:45" },
    ],
    suggestion: "Of course — private entrance and decoration access are both available in our Lower Ground Room. I'll send the full details and proposed menu options. Are you free for a quick call this week?",
  },
  {
    id: 2, name: "Deloitte UK", initials: "DE",
    event: "Team Dinner · 45 guests · 18 Jun",
    preview: "We're organising a team dinner for around 45 people...",
    time: "1h", unread: true,
    msgs: [
      { side: "in",  text: "We're organising a team dinner for around 45 people. Looking for a private space with AV capability.", t: "09:14" },
      { side: "out", clem: true, text: "Hi — thanks for reaching out. 45 guests with AV is a great fit for our main private dining room. Happy to share availability and pricing. Do you have a budget range in mind?", t: "09:15" },
    ],
    suggestion: "Based on your headcount and AV requirements, I'd suggest our Main Room at £5,500 all-in including equipment setup. Want me to put together a formal proposal?",
  },
  {
    id: 3, name: "Goldman Sachs", initials: "GS",
    event: "Client Dinner · 20 guests · 5 Jul",
    preview: "Following up on the proposal you sent last week...",
    time: "3h", unread: false,
    msgs: [
      { side: "in", text: "Following up on the proposal you sent last week. Our team has reviewed and we have a few questions about the menu options.", t: "Yesterday" },
    ],
    suggestion: null,
  },
  {
    id: 4, name: "Margot Tavern", initials: "MT",
    event: "Private Hire · 35 guests · 1 Jul",
    preview: "Could you let us know if the date is still available?",
    time: "Yesterday", unread: false,
    msgs: [
      { side: "in", text: "Could you let us know if the date is still available? We haven't heard back.", t: "Yesterday" },
    ],
    suggestion: "Sorry for the delay — the date is still available. I'll send across an updated availability note and revised proposal shortly.",
  },
]

function ConversationsView() {
  const [sel, setSel] = useState(0)
  const convo = CONVOS[sel]

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Thread list */}
      <div style={{ width: 300, borderRight: `1px solid ${C.oat}`, display: "flex", flexDirection: "column", flexShrink: 0, background: C.cream }}>
        <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${C.oat}`, flexShrink: 0 }}>
          <div style={{ fontFamily: fr, fontSize: 20, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em", marginBottom: 12 }}>Conversations</div>
          <div style={{ background: C.oat, borderRadius: 7, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.mauve} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span style={{ fontFamily: ge, fontSize: 13, color: C.mauve }}>Search</span>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {CONVOS.map((c, i) => (
            <div key={c.id} className="thread-item"
              onClick={() => setSel(i)}
              style={{ padding: "14px 20px", borderBottom: `1px solid ${C.oat}`, cursor: "pointer", background: i === sel ? C.oat : "transparent", transition: "background 0.1s" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.plum, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: ge, fontSize: 12, fontWeight: 700, color: C.cream }}>{c.initials}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontFamily: ge, fontSize: 13, fontWeight: c.unread ? 700 : 500, color: C.ink }}>{c.name}</span>
                    <span style={{ fontFamily: ge, fontSize: 11, color: C.mauve, flexShrink: 0 }}>{c.time}</span>
                  </div>
                  <div style={{ fontFamily: ge, fontSize: 11, color: C.mauve, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.event}</div>
                  <div style={{ fontFamily: ge, fontSize: 12, color: c.unread ? C.ink : C.mauve, fontWeight: c.unread ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.preview}</div>
                </div>
                {c.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.clementine, flexShrink: 0, marginTop: 4 }} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thread detail */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#FDFAF7" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.oat}`, flexShrink: 0, background: C.cream, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: ge, fontSize: 15, fontWeight: 600, color: C.ink }}>{convo.name}</div>
            <div style={{ fontFamily: ge, fontSize: 12, color: C.mauve, marginTop: 1 }}>{convo.event}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="ghost-btn" style={{ background: "transparent", border: `1px solid ${C.oat}`, borderRadius: 6, padding: "6px 12px", fontSize: 12, color: C.mauve, fontFamily: ge, cursor: "pointer" }}>View lead</button>
            <button className="ghost-btn" style={{ background: "transparent", border: `1px solid ${C.oat}`, borderRadius: 6, padding: "6px 12px", fontSize: 12, color: C.mauve, fontFamily: ge, cursor: "pointer" }}>Send proposal</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          {convo.msgs.map((msg, i) => (
            <div key={i} style={{ display: "flex", flexDirection: msg.side === "out" ? "row-reverse" : "row", gap: 10, alignItems: "flex-end" }}>
              {msg.side === "out" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.clementine, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: fr, fontStyle: "italic", fontSize: 13, color: C.white, fontWeight: 700 }}>C</span>
                </div>
              )}
              <div style={{ maxWidth: "65%", display: "flex", flexDirection: "column", alignItems: msg.side === "out" ? "flex-end" : "flex-start", gap: 4 }}>
                {(msg as { clem?: boolean }).clem && (
                  <div style={{ fontFamily: ge, fontSize: 10, fontWeight: 700, color: C.clementine, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>Clem</div>
                )}
                <div style={{
                  background: msg.side === "out" ? C.plum : C.white,
                  color: msg.side === "out" ? C.cream : C.ink,
                  borderRadius: msg.side === "out" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                  padding: "11px 14px", fontFamily: ge, fontSize: 13, lineHeight: 1.6,
                  boxShadow: "0 1px 3px rgba(31,20,25,0.06)",
                  border: msg.side === "in" ? `1px solid ${C.oat}` : "none",
                }}>
                  {msg.text}
                </div>
                <div style={{ fontFamily: ge, fontSize: 10, color: C.mauve }}>{msg.t}</div>
              </div>
            </div>
          ))}
        </div>

        {convo.suggestion ? (
          <div style={{ flexShrink: 0, borderTop: `1px solid ${C.oat}`, background: C.cream }}>
            <div style={{ padding: "12px 24px 0" }}>
              <span style={{ background: "#F3EDFA", color: "#6A1B9A", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 4, letterSpacing: "0.04em" }}>Clem suggests</span>
            </div>
            <div style={{ padding: "10px 24px 16px" }}>
              <div style={{ background: "rgba(217,121,66,0.06)", border: "1px solid rgba(217,121,66,0.15)", borderRadius: 8, padding: "12px 14px", marginBottom: 10, fontFamily: ge, fontSize: 13, color: C.ink, lineHeight: 1.6 }}>
                {convo.suggestion}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="clem-send" style={{ background: C.clementine, color: C.white, border: "none", borderRadius: 6, padding: "8px 18px", fontSize: 13, fontWeight: 600, fontFamily: ge, cursor: "pointer" }}>Send</button>
                <button className="ghost-btn" style={{ background: "transparent", color: C.mauve, border: `1px solid ${C.oat}`, borderRadius: 6, padding: "8px 14px", fontSize: 13, fontFamily: ge, cursor: "pointer" }}>Edit</button>
                <button className="ghost-btn" style={{ background: "transparent", color: C.mauve, border: `1px solid ${C.oat}`, borderRadius: 6, padding: "8px 14px", fontSize: 13, fontFamily: ge, cursor: "pointer" }}>Dismiss</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flexShrink: 0, borderTop: `1px solid ${C.oat}`, padding: "16px 24px", background: C.cream, display: "flex", gap: 10 }}>
            <input type="text" placeholder="Write a reply..."
              style={{ flex: 1, background: C.oat, border: "none", borderRadius: 8, padding: "10px 14px", fontFamily: ge, fontSize: 13, color: C.ink, outline: "none" }} />
            <button className="clem-send" style={{ background: C.clementine, color: C.white, border: "none", borderRadius: 7, padding: "10px 18px", fontSize: 13, fontWeight: 600, fontFamily: ge, cursor: "pointer" }}>Send</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── CALENDAR ──────────────────────────────────────────────────────────────────
const CAL_EVENTS: Record<number, { label: string; color: string }[]> = {
  10: [{ label: "Google DeepMind", color: C.success }],
  12: [{ label: "Rachel & Tom",    color: C.success }],
  14: [{ label: "Sophie & James",  color: C.mauve }],
  18: [{ label: "Deloitte UK",     color: C.clementine }],
  22: [{ label: "Condé Nast",      color: C.mauve }],
  28: [{ label: "The Hendersons",  color: C.clementine }],
}

function CalendarView() {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  // May 2026: starts Thursday (index 3), 31 days
  const cells: (number | null)[] = [null, null, null]
  for (let d = 1; d <= 31; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "20px 28px", borderBottom: `1px solid ${C.oat}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.cream, flexShrink: 0 }}>
        <div style={{ fontFamily: fr, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em" }}>May 2026</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ghost-btn" style={{ background: "transparent", border: `1px solid ${C.oat}`, borderRadius: 6, padding: "6px 12px", fontSize: 13, color: C.mauve, fontFamily: ge, cursor: "pointer" }}>Today</button>
          <button className="ghost-btn" style={{ background: "transparent", border: `1px solid ${C.oat}`, borderRadius: 6, padding: "6px 10px", fontSize: 13, color: C.mauve, fontFamily: ge, cursor: "pointer" }}>‹</button>
          <button className="ghost-btn" style={{ background: "transparent", border: `1px solid ${C.oat}`, borderRadius: 6, padding: "6px 10px", fontSize: 13, color: C.mauve, fontFamily: ge, cursor: "pointer" }}>›</button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: C.cream, borderBottom: `1px solid ${C.oat}` }}>
          {DAYS.map(d => (
            <div key={d} style={{ padding: "10px 0", textAlign: "center", fontFamily: ge, fontSize: 12, fontWeight: 600, color: C.mauve, letterSpacing: "0.04em" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {cells.map((day, i) => {
            const isToday = day === 1
            const events = day ? (CAL_EVENTS[day] ?? []) : []
            return (
              <div key={i} style={{ minHeight: 100, border: `1px solid ${C.oat}`, padding: "8px 10px", background: isToday ? "rgba(217,121,66,0.04)" : C.cream, marginTop: -1, marginLeft: -1 }}>
                {day && (
                  <>
                    <div style={{
                      fontFamily: ge, fontSize: 13, fontWeight: isToday ? 700 : 400,
                      color: isToday ? C.clementine : C.ink,
                      width: 26, height: 26, borderRadius: "50%",
                      background: isToday ? "rgba(217,121,66,0.12)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6,
                    }}>{day}</div>
                    {events.map((ev, j) => (
                      <div key={j} style={{
                        background: `${ev.color}18`, color: ev.color,
                        borderRadius: 4, padding: "3px 7px", fontFamily: ge, fontSize: 11, fontWeight: 500,
                        marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        borderLeft: `3px solid ${ev.color}`,
                      }}>{ev.label}</div>
                    ))}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── PROPOSALS ─────────────────────────────────────────────────────────────────
const PROPOSALS = [
  { id: "P-004", name: "Goldman Sachs",   event: "Client Dinner",  date: "5 Jul",  value: "£9,200", status: "Sent",     updated: "5 days ago" },
  { id: "P-003", name: "Deloitte UK",     event: "Team Dinner",    date: "18 Jun", value: "£5,500", status: "Draft",    updated: "Today" },
  { id: "P-002", name: "Sophie & James",  event: "Wedding Dinner", date: "14 Jun", value: "£4,200", status: "Draft",    updated: "Today" },
  { id: "P-001", name: "Google DeepMind", event: "Offsite Dinner", date: "10 Jun", value: "£7,400", status: "Accepted", updated: "3 days ago" },
  { id: "P-000", name: "Rachel & Tom",    event: "Anniversary",    date: "12 Jun", value: "£1,400", status: "Accepted", updated: "4 days ago" },
]

function ProposalsView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "20px 28px", borderBottom: `1px solid ${C.oat}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.cream, flexShrink: 0 }}>
        <div style={{ fontFamily: fr, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em" }}>Proposals</div>
        <button className="clem-send" style={{ background: C.clementine, border: "none", borderRadius: 7, padding: "7px 16px", fontSize: 13, fontWeight: 600, color: C.white, fontFamily: ge, cursor: "pointer" }}>+ New proposal</button>
      </div>

      <div style={{ display: "flex", borderBottom: `1px solid ${C.oat}`, background: C.cream, flexShrink: 0 }}>
        {[{ label: "Total sent", value: "£29,600" }, { label: "Accepted", value: "£8,800" }, { label: "Pending", value: "£9,200" }, { label: "Conversion", value: "40%" }].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "14px 28px", borderRight: i < 3 ? `1px solid ${C.oat}` : "none" }}>
            <div style={{ fontFamily: ge, fontSize: 11, color: C.mauve, marginBottom: 4, letterSpacing: "0.04em" }}>{s.label}</div>
            <div style={{ fontFamily: fr, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: "-0.02em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: ge }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.oat}`, background: C.cream }}>
              {["ID", "Client", "Event", "Date", "Value", "Status", "Updated", ""].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: C.mauve, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROPOSALS.map((p, i) => (
              <tr key={i} className="prop-row" style={{ borderBottom: `1px solid ${C.oat}`, transition: "background 0.1s", cursor: "pointer" }}>
                <td style={{ padding: "14px 20px", fontSize: 12, color: C.mauve, fontFamily: "monospace" }}>{p.id}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: C.ink }}>{p.name}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: C.mauve }}>{p.event}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: C.mauve, whiteSpace: "nowrap" }}>{p.date}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: C.ink }}>{p.value}</td>
                <td style={{ padding: "14px 20px" }}><Tag label={p.status} small /></td>
                <td style={{ padding: "14px 20px", fontSize: 12, color: C.mauve }}>{p.updated}</td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="ghost-btn" style={{ background: "transparent", border: `1px solid ${C.oat}`, borderRadius: 5, padding: "5px 10px", fontSize: 12, color: C.mauve, fontFamily: ge, cursor: "pointer" }}>View</button>
                    {p.status === "Draft" && (
                      <button className="clem-send" style={{ background: C.clementine, border: "none", borderRadius: 5, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: C.white, fontFamily: ge, cursor: "pointer" }}>Send</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── NAV ITEMS ─────────────────────────────────────────────────────────────────
const NAV: { id: View; label: string; badge?: number }[] = [
  { id: "conversations", label: "Conversations", badge: 2 },
  { id: "pipeline",      label: "Pipeline" },
  { id: "calendar",      label: "Calendar" },
  { id: "proposals",     label: "Proposals" },
]

// ── PREVIEW BANNER ────────────────────────────────────────────────────────────
function PreviewBanner() {
  return (
    <div style={{
      background: C.cream, borderBottom: `1px solid ${C.oat}`,
      padding: "0 28px", display: "flex", alignItems: "center",
      justifyContent: "space-between", height: 52, flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: fr, fontSize: 19, fontWeight: 500, color: C.ink, letterSpacing: "-0.025em" }}>foyer</span>
        <span style={{
          background: "rgba(74,31,63,0.07)", color: C.mauve,
          border: "1px solid rgba(74,31,63,0.14)", borderRadius: 20,
          padding: "2px 10px", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
        }}>Preview</span>
      </div>
      <div style={{ fontFamily: ge, fontSize: 13, color: C.mauve, textAlign: "center", maxWidth: 480 }}>
        A venue CRM for London's private dining rooms. Pipeline, conversations, and AI-assisted follow-ups.
      </div>
      <a href="https://findfoyer.com" target="_blank" rel="noreferrer" style={{
        fontFamily: ge, fontSize: 12, color: C.mauve, textDecoration: "none",
        opacity: 0.7, letterSpacing: "0.01em",
      }}>findfoyer.com ↗</a>
    </div>
  )
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard() {
  const [view, setView] = useState<View>("conversations")

  return (
    <div className="foy-preview" style={{ display: "flex", height: "100%", fontFamily: ge, background: C.cream, overflow: "hidden" }}>

      {/* Sidebar */}
      <div style={{ width: 220, background: C.plum, display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 }}>
        <div style={{ fontFamily: fr, fontSize: 22, fontWeight: 600, color: C.cream, padding: "0 20px 28px", letterSpacing: "-0.02em" }}>Foyer</div>

        <nav>
          {NAV.map(item => (
            <button key={item.id} className="nav-btn"
              onClick={() => setView(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 20px", background: view === item.id ? "rgba(255,255,255,0.12)" : "transparent",
                borderLeft: view === item.id ? `3px solid ${C.clementine}` : "3px solid transparent",
                border: "none", borderTop: "none", borderBottom: "none", borderRight: "none",
                cursor: "pointer", transition: "background 0.15s", textAlign: "left",
              }}
            >
              <span style={{ fontFamily: ge, fontSize: 14, fontWeight: view === item.id ? 600 : 400, color: view === item.id ? C.cream : "rgba(244,237,228,0.6)" }}>
                {item.label}
              </span>
              {item.badge && (
                <span style={{ background: C.clementine, color: C.white, borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Clem nudge */}
        <div style={{ marginTop: "auto", padding: "0 16px 12px" }}>
          <div style={{ background: "rgba(217,121,66,0.15)", border: "1px solid rgba(217,121,66,0.3)", borderRadius: 8, padding: "10px 12px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.clementine, marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>Clem</div>
            <div style={{ fontSize: 12, color: "rgba(244,237,228,0.7)", lineHeight: 1.5 }}>3 enquiries need a reply today.</div>
          </div>

          {/* Coming soon integrations */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
            {["Gmail sync", "Google Calendar", "Enquiry widget"].map(label => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 4px", opacity: 0.55 }}>
                <span style={{ fontFamily: ge, fontSize: 12, color: "rgba(244,237,228,0.5)" }}>{label}</span>
                <ComingSoon />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {view === "pipeline"      && <PipelineView />}
        {view === "conversations" && <ConversationsView />}
        {view === "calendar"      && <CalendarView />}
        {view === "proposals"     && <ProposalsView />}
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <style>{CSS}</style>
      <PreviewBanner />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Dashboard />
      </div>
    </div>
  )
}
