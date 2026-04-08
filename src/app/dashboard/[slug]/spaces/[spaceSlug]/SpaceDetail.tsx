'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Space, MenuPackage } from '@/types'
import { SPACE_AMENITIES } from '@/types'

type Venue = { id: string; name: string; slug: string; neighbourhood: string }

// ── Section wrapper ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border-2 border-dark rounded-2xl p-6">
      <h3 className="font-display font-bold text-lg uppercase text-dark mb-4">{title}</h3>
      {children}
    </div>
  )
}

// ── Inline calendar (per-space) ─────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function SpaceCalendar({ spaceId, initialBlocked }: { spaceId: string; initialBlocked: string[] }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [blocked, setBlocked] = useState<Set<string>>(new Set(initialBlocked))
  const [loadingDate, setLoadingDate] = useState<string | null>(null)

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  async function toggleDate(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setLoadingDate(dateStr)

    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ space_id: spaceId, date: dateStr }),
    })
    const json = await res.json()

    setBlocked((prev) => {
      const next = new Set(prev)
      if (json.blocked) next.add(dateStr)
      else next.delete(dateStr)
      return next
    })
    setLoadingDate(null)
  }

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <button onClick={prevMonth} className="w-9 h-9 border-2 border-dark rounded-lg font-bold hover:bg-base-deep transition-colors">‹</button>
        <span className="font-display font-bold text-lg uppercase flex-1 text-center">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="w-9 h-9 border-2 border-dark rounded-lg font-bold hover:bg-base-deep transition-colors">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-text-muted py-1">{d}</div>
        ))}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isBlocked = blocked.has(dateStr)
          const isLoading = loadingDate === dateStr
          const isPast = new Date(dateStr) < new Date(today.toDateString())

          return (
            <button
              key={day}
              onClick={() => !isPast && toggleDate(day)}
              disabled={isPast || isLoading}
              className={`aspect-square rounded-lg border-2 text-sm font-medium transition-colors ${
                isLoading ? 'border-dark/30 bg-base-deep animate-pulse'
                : isBlocked ? 'border-dark bg-dark text-white hover:bg-secondary hover:border-secondary'
                : isPast ? 'border-dark/20 text-dark/30 cursor-not-allowed'
                : 'border-dark/30 bg-white hover:bg-primary hover:border-primary'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-text-muted mt-3">Dark = blocked. Click to toggle. Changes save immediately.</p>
    </div>
  )
}

// ── Menu package row ────────────────────────────────────────────────────────

function MenuPackageRow({
  pkg,
  onUpdate,
  onDelete,
}: {
  pkg: MenuPackage
  onUpdate: (id: string, data: Partial<MenuPackage>) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: pkg.name,
    description: pkg.description ?? '',
    price_per_head: pkg.price_per_head ? String(pkg.price_per_head) : '',
    file_url: pkg.file_url ?? '',
  })

  function handleSave() {
    onUpdate(pkg.id, {
      name: form.name,
      description: form.description || null,
      price_per_head: form.price_per_head ? parseInt(form.price_per_head) : null,
      file_url: form.file_url || null,
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="border-2 border-dark/20 rounded-xl p-4 space-y-3">
        <input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Package name"
          className="w-full border-2 border-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="Description (optional)"
          rows={2}
          className="w-full border-2 border-dark rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={form.price_per_head}
            onChange={(e) => setForm((p) => ({ ...p, price_per_head: e.target.value }))}
            placeholder="Price/head (£)"
            className="w-full border-2 border-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            value={form.file_url}
            onChange={(e) => setForm((p) => ({ ...p, file_url: e.target.value }))}
            placeholder="PDF or menu link"
            className="w-full border-2 border-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-dark text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-secondary transition-colors">Save</button>
          <button onClick={() => setEditing(false)} className="text-sm font-semibold px-4 py-2 rounded-lg border-2 border-dark hover:bg-base-deep transition-colors">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="border-2 border-dark/20 rounded-xl p-4 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-dark">{pkg.name}</p>
        {pkg.description && <p className="text-xs text-text-muted mt-0.5">{pkg.description}</p>}
        <div className="flex gap-3 mt-1 text-xs text-text-muted">
          {pkg.price_per_head && <span>£{pkg.price_per_head}/head</span>}
          {pkg.file_url && (
            <a href={pkg.file_url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
              View menu →
            </a>
          )}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => setEditing(true)} className="px-2.5 py-1 border-2 border-dark rounded-lg text-xs font-medium hover:bg-primary transition-colors">Edit</button>
        <button onClick={() => onDelete(pkg.id)} className="px-2.5 py-1 border-2 border-dark rounded-lg text-xs font-medium hover:bg-secondary hover:text-white hover:border-secondary transition-colors">Delete</button>
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function SpaceDetail({
  venue,
  space: initialSpace,
  initialMenuPackages,
  initialBlockedDates,
}: {
  venue: Venue
  space: Space
  initialMenuPackages: MenuPackage[]
  initialBlockedDates: string[]
}) {
  const [space, setSpace] = useState(initialSpace)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [menuPackages, setMenuPackages] = useState(initialMenuPackages)
  const [addingMenu, setAddingMenu] = useState(false)
  const [newMenu, setNewMenu] = useState({ name: '', description: '', price_per_head: '', file_url: '' })

  // Form state mirrors space fields
  const [form, setForm] = useState({
    name: space.name,
    capacity: String(space.capacity),
    base_price: String(space.base_price),
    description: space.description ?? '',
    photos: space.photos.join(', '),
    payment_deposit_pct: space.payment_deposit_pct ? String(space.payment_deposit_pct) : '',
    payment_min_spend: space.payment_min_spend ? String(space.payment_min_spend) : '',
    payment_pay_ahead: space.payment_pay_ahead,
    amenities: { ...space.amenities } as Record<string, boolean>,
  })

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function toggleAmenity(key: string) {
    setForm((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: !prev.amenities[key] },
    }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    const photos = form.photos
      ? form.photos.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    const payload = {
      name: form.name,
      capacity: parseInt(form.capacity) || 0,
      base_price: parseInt(form.base_price) || 0,
      description: form.description || null,
      photos,
      amenities: form.amenities,
      payment_deposit_pct: form.payment_deposit_pct ? parseInt(form.payment_deposit_pct) : null,
      payment_min_spend: form.payment_min_spend ? parseInt(form.payment_min_spend) : null,
      payment_pay_ahead: form.payment_pay_ahead,
    }

    const res = await fetch(`/api/spaces/${space.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const updated = await res.json()
      setSpace(updated)
      setSaved(true)
    }
    setSaving(false)
  }

  async function handleAddMenu() {
    if (!newMenu.name) return
    const res = await fetch('/api/menu-packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        space_id: space.id,
        name: newMenu.name,
        description: newMenu.description || null,
        price_per_head: newMenu.price_per_head ? parseInt(newMenu.price_per_head) : null,
        file_url: newMenu.file_url || null,
      }),
    })
    if (res.ok) {
      const pkg = await res.json()
      setMenuPackages((prev) => [...prev, pkg])
      setNewMenu({ name: '', description: '', price_per_head: '', file_url: '' })
      setAddingMenu(false)
    }
  }

  async function handleUpdateMenu(id: string, data: Partial<MenuPackage>) {
    const res = await fetch(`/api/menu-packages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const updated = await res.json()
      setMenuPackages((prev) => prev.map((p) => (p.id === id ? updated : p)))
    }
  }

  async function handleDeleteMenu(id: string) {
    if (!confirm('Delete this menu package?')) return
    const res = await fetch(`/api/menu-packages/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMenuPackages((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="px-8 py-8 max-w-3xl space-y-6">
      {/* Back link + header */}
      <div>
        <Link
          href={`/dashboard/${venue.slug}/spaces`}
          className="text-sm font-semibold text-text-muted hover:text-dark transition-colors"
        >
          ← Back to spaces
        </Link>
        <div className="flex items-center gap-3 mt-3">
          {space.photos.length > 0 && (
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-dark shrink-0">
              <img src={space.photos[0]} alt={space.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{venue.neighbourhood}</p>
            <h1 className="font-display font-extrabold text-3xl uppercase text-dark">{space.name}</h1>
          </div>
        </div>
      </div>

      {/* Details */}
      <Section title="Details">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Space name</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full border-2 border-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Capacity</label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => set('capacity', e.target.value)}
                placeholder="e.g. 60"
                className="w-full border-2 border-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Price/head (£)</label>
              <input
                type="number"
                value={form.base_price}
                onChange={(e) => set('base_price', e.target.value)}
                placeholder="e.g. 75"
                className="w-full border-2 border-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe this space — what makes it special?"
              rows={3}
              className="w-full border-2 border-dark rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm leading-relaxed"
            />
          </div>
        </div>
      </Section>

      {/* Photos */}
      <Section title="Photos">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Photo URLs <span className="font-normal text-text-muted">(comma-separated)</span>
          </label>
          <textarea
            value={form.photos}
            onChange={(e) => set('photos', e.target.value)}
            placeholder="https://example.com/photo1.jpg, https://…"
            rows={2}
            className="w-full border-2 border-dark rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          {space.photos.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {space.photos.map((url, i) => (
                <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-dark shrink-0">
                  <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Payment Terms */}
      <Section title="Payment Terms">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-text-muted mb-1">Deposit %</label>
              <input
                type="number"
                value={form.payment_deposit_pct}
                onChange={(e) => set('payment_deposit_pct', e.target.value)}
                placeholder="e.g. 25"
                className="w-full border-2 border-dark rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Min spend (£)</label>
              <input
                type="number"
                value={form.payment_min_spend}
                onChange={(e) => set('payment_min_spend', e.target.value)}
                placeholder="e.g. 2000"
                className="w-full border-2 border-dark rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.payment_pay_ahead}
              onChange={(e) => set('payment_pay_ahead', e.target.checked)}
              className="w-4 h-4 accent-dark"
            />
            <span className="text-sm font-medium">Full payment required upfront</span>
          </label>
        </div>
      </Section>

      {/* Amenities */}
      <Section title="Amenities">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SPACE_AMENITIES.map(({ key, label }) => (
            <label
              key={key}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${
                form.amenities[key]
                  ? 'border-dark bg-primary/20'
                  : 'border-dark/20 hover:border-dark/40'
              }`}
            >
              <input
                type="checkbox"
                checked={!!form.amenities[key]}
                onChange={() => toggleAmenity(key)}
                className="w-4 h-4 accent-dark"
              />
              <span className="text-sm font-medium">{label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Menu Packages */}
      <Section title="Menu Packages">
        <div className="space-y-3">
          {menuPackages.map((pkg) => (
            <MenuPackageRow
              key={pkg.id}
              pkg={pkg}
              onUpdate={handleUpdateMenu}
              onDelete={handleDeleteMenu}
            />
          ))}

          {menuPackages.length === 0 && !addingMenu && (
            <p className="text-sm text-text-muted">No menu packages yet.</p>
          )}

          {addingMenu ? (
            <div className="border-2 border-dark/20 rounded-xl p-4 space-y-3">
              <input
                value={newMenu.name}
                onChange={(e) => setNewMenu((p) => ({ ...p, name: e.target.value }))}
                placeholder="Package name (e.g. Three Course Dinner)"
                className="w-full border-2 border-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                value={newMenu.description}
                onChange={(e) => setNewMenu((p) => ({ ...p, description: e.target.value }))}
                placeholder="Description (optional)"
                rows={2}
                className="w-full border-2 border-dark rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={newMenu.price_per_head}
                  onChange={(e) => setNewMenu((p) => ({ ...p, price_per_head: e.target.value }))}
                  placeholder="Price/head (£)"
                  className="w-full border-2 border-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  value={newMenu.file_url}
                  onChange={(e) => setNewMenu((p) => ({ ...p, file_url: e.target.value }))}
                  placeholder="PDF or menu link"
                  className="w-full border-2 border-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddMenu} className="bg-dark text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-secondary transition-colors">Add</button>
                <button onClick={() => setAddingMenu(false)} className="text-sm font-semibold px-4 py-2 rounded-lg border-2 border-dark hover:bg-base-deep transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingMenu(true)}
              className="text-sm font-semibold text-dark border-2 border-dark/30 rounded-xl px-4 py-2.5 hover:border-dark hover:bg-primary transition-colors"
            >
              + Add menu package
            </button>
          )}
        </div>
      </Section>

      {/* Calendar */}
      <Section title="Calendar">
        <SpaceCalendar spaceId={space.id} initialBlocked={initialBlockedDates} />
      </Section>

      {/* Save button (sticky) */}
      <div className="sticky bottom-6 flex items-center gap-4 bg-base border-2 border-dark rounded-xl px-6 py-4 shadow-[4px_4px_0_#1A1A1A]">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-dark text-white font-display font-bold uppercase px-8 py-3 rounded-xl border-2 border-dark hover:bg-secondary hover:border-secondary transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && (
          <span className="text-sm font-semibold text-dark bg-primary px-3 py-1.5 rounded-lg border-2 border-dark">
            Saved ✓
          </span>
        )}
      </div>
    </div>
  )
}
