'use client'

type Props = {
  activeRole: 'booker' | 'venue'
  onSwitch: (role: 'booker' | 'venue') => void
}

export default function RoleToggle({ activeRole, onSwitch }: Props) {
  return (
    <div className="relative bg-base-deep border-2 border-dark rounded-xl p-1 flex">
      {/* Sliding indicator */}
      <div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-dark rounded-lg transition-all duration-200 ease-in-out"
        style={{ left: activeRole === 'booker' ? '4px' : 'calc(50%)' }}
      />

      {/* Booker label */}
      <button
        onClick={() => onSwitch('booker')}
        className={`relative z-10 flex-1 py-2 text-sm font-bold uppercase tracking-wider text-center rounded-lg transition-colors duration-200 ${
          activeRole === 'booker'
            ? 'text-primary'
            : 'text-dark hover:text-dark/70'
        }`}
      >
        Booker
      </button>

      {/* Venue label */}
      <button
        onClick={() => onSwitch('venue')}
        className={`relative z-10 flex-1 py-2 text-sm font-bold uppercase tracking-wider text-center rounded-lg transition-colors duration-200 ${
          activeRole === 'venue'
            ? 'text-primary'
            : 'text-dark hover:text-dark/70'
        }`}
      >
        Venue
      </button>
    </div>
  )
}
