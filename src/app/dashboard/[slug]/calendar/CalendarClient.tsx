'use client'

import { useState } from 'react'
import type { Space } from '@/types'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// Distinct colors for up to 8 spaces
const SPACE_COLORS = [
  '#34D399', // green
  '#FF6B6B', // red
  '#60A5FA', // blue
  '#FB923C', // orange
  '#A78BFA', // purple
  '#CDEA2D', // yellow
  '#FF2D9B', // pink
  '#14B8A6', // teal
]

type Block = { space_id: string; blocked_date: string }

export default function CalendarClient({
  spaces,
  initialBlocks,
}: {
  spaces: Space[]
  initialBlocks: Block[]
}) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedSpaces, setSelectedSpaces] = useState<Set<string>>(
    new Set(spaces.map((s) => s.id))
  )

  // Build lookup: date -> set of space IDs
  const blocksByDate = new Map<string, Set<string>>()
  for (const b of initialBlocks) {
    if (!blocksByDate.has(b.blocked_date)) {
      blocksByDate.set(b.blocked_date, new Set())
    }
    blocksByDate.get(b.blocked_date)!.add(b.space_id)
  }

  // Space color lookup
  const spaceColorMap = new Map<string, string>()
  spaces.forEach((s, i) => {
    spaceColorMap.set(s.id, SPACE_COLORS[i % SPACE_COLORS.length])
  })

  function toggleSpaceFilter(spaceId: string) {
    setSelectedSpaces((prev) => {
      const next = new Set(prev)
      if (next.has(spaceId)) next.delete(spaceId)
      else next.add(spaceId)
      return next
    })
  }

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  if (spaces.length === 0) {
    return (
      <div className="bg-white border-2 border-dark rounded-2xl p-8 text-center">
        <p className="font-display font-bold text-xl uppercase text-dark mb-2">No spaces yet</p>
        <p className="text-text-muted text-sm">Add spaces first, then view their availability here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Space filter (multi-select) */}
      {spaces.length > 1 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">
            Filter by space
          </label>
          <div className="flex flex-wrap gap-2">
            {spaces.map((s) => {
              const color = spaceColorMap.get(s.id)!
              const active = selectedSpaces.has(s.id)
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSpaceFilter(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-colors ${
                    active
                      ? 'border-dark bg-white'
                      : 'border-dark/20 bg-white/50 opacity-50'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-dark/30 shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {s.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-dark rounded-2xl p-6">
        {/* Month nav */}
        <div className="flex items-center gap-4 mb-4">
          <button onClick={prevMonth} className="w-9 h-9 border-2 border-dark rounded-lg font-bold hover:bg-base-deep transition-colors">‹</button>
          <span className="font-display font-bold text-lg uppercase flex-1 text-center">{MONTHS[month]} {year}</span>
          <button onClick={nextMonth} className="w-9 h-9 border-2 border-dark rounded-lg font-bold hover:bg-base-deep transition-colors">›</button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-text-muted py-1">{d}</div>
          ))}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isPast = new Date(dateStr) < new Date(today.toDateString())
            const blockedSpaceIds = blocksByDate.get(dateStr)

            // Get blocked spaces that are currently visible
            const visibleBlocked = blockedSpaceIds
              ? [...blockedSpaceIds].filter((id) => selectedSpaces.has(id))
              : []

            return (
              <div
                key={day}
                className={`aspect-square rounded-lg border-2 text-sm font-medium flex flex-col items-center justify-center gap-0.5 ${
                  isPast
                    ? 'border-dark/20 text-dark/30'
                    : visibleBlocked.length > 0
                    ? 'border-dark bg-dark/5'
                    : 'border-dark/30 bg-white'
                }`}
              >
                <span>{day}</span>
                {visibleBlocked.length > 0 && (
                  <div className="flex gap-0.5">
                    {visibleBlocked.map((spaceId) => (
                      <span
                        key={spaceId}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: spaceColorMap.get(spaceId) }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-xs text-text-muted mt-4">
          Coloured dots show blocked dates per space. Edit individual calendars from the space detail page.
        </p>
      </div>

      {/* Legend */}
      {spaces.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {spaces.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5 text-xs text-text-muted">
              <span
                className="w-3 h-3 rounded-full border border-dark/30"
                style={{ backgroundColor: spaceColorMap.get(s.id) }}
              />
              {s.name}
            </div>
          ))}
        </div>
      )}

      {/* Google Calendar CTA (placeholder) */}
      <div className="bg-white border-2 border-dark/30 rounded-2xl p-5 flex items-center gap-3 opacity-60">
        <span className="text-2xl">📅</span>
        <div>
          <p className="font-semibold text-sm text-dark">Sync Google Calendar</p>
          <p className="text-xs text-text-muted">Connect your calendar to auto-block busy dates. Coming in Phase 2.</p>
        </div>
        <span className="ml-auto text-xs font-bold uppercase tracking-widest text-text-muted bg-base px-3 py-1.5 rounded-lg border border-dark/20">
          Soon
        </span>
      </div>
    </div>
  )
}
