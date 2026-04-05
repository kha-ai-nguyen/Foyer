import VenueDashboard from '@/components/_phase2/VenueDashboard'
import { mockEnquiries, mockProposals, mockTimeSaved } from '@/data/mock-dashboard'

export default function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-display font-extrabold text-4xl md:text-5xl uppercase text-dark">
          Venue Dashboard
        </h1>
        <p className="text-text-muted font-medium mt-2">
          Manage your enquiries, proposals, and performance
        </p>
      </header>
      <VenueDashboard
        enquiries={mockEnquiries}
        proposals={mockProposals}
        timeSaved={mockTimeSaved}
      />
    </main>
  )
}
