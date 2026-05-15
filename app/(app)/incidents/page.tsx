'use client'
import { useState } from 'react'
import { useSimulation } from '@/lib/use-simulation'
import { IncidentCard } from '@/components/phase2/IncidentCard'
import { InvestigateDialog } from '@/components/phase2/InvestigateDialog'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import type { Incident } from '@/lib/mock-data/incidents'

export default function IncidentsPage() {
  const { incidents } = useSimulation()
  const [selected, setSelected] = useState<Incident | null>(null)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <MaterialIcon name="emergency" size="md" color="#DC2626" />
          <h1 className="text-2xl font-extrabold">Incident Intelligence</h1>
        </div>
        <p className="text-sm text-on-muted mt-1">
          Cross-source incident detection — access control + camera correlation with AI-powered investigation.
        </p>
      </div>

      <div className="space-y-3">
        {incidents.map((inc) => (
          <IncidentCard key={inc.id} incident={inc} onInvestigate={setSelected} />
        ))}
      </div>

      {selected && (
        <InvestigateDialog incident={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
