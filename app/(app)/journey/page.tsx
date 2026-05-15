'use client'
import { useSimulation } from '@/lib/use-simulation'
import { JourneyCard } from '@/components/phase1/JourneyCard'
import { MaterialIcon } from '@/components/ui/MaterialIcon'

export default function JourneyListPage() {
  const { journeys } = useSimulation()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <MaterialIcon name="route" size="md" color="#DC2626" />
          <h1 className="text-2xl font-extrabold">Person Journey Reconstruction</h1>
        </div>
        <p className="text-sm text-on-muted mt-1">
          Correlates access control events, camera detections, and environmental signals into a complete physical journey.
        </p>
      </div>

      <div className="space-y-3">
        {journeys.map((j) => (
          <JourneyCard key={j.id} journey={j} />
        ))}
      </div>
    </div>
  )
}
