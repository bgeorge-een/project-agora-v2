'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Incident } from './mock-data/incidents'
import type { Violation } from './mock-data/violations'
import type { ContextFeedItem } from './mock-data/context-feeds'
import type { Journey } from './mock-data/journeys'
import { MOCK_INCIDENTS } from './mock-data/incidents'
import { MOCK_VIOLATIONS } from './mock-data/violations'
import { MOCK_CONTEXT_FEEDS } from './mock-data/context-feeds'
import { MOCK_JOURNEYS } from './mock-data/journeys'

export interface SimulationState {
  incidents: Incident[]
  violations: Violation[]
  contextFeeds: ContextFeedItem[]
  journeys: Journey[]
  lastEvent: string | null
}

const SIM_INCIDENTS: Array<Omit<Incident, 'ts' | 'description'>> = [
  { id: 'inc-sim-1', title: 'Propped door alert — East Exit E3', severity: 'medium', status: 'open', location: 'East Exit E3', sources: ['Door Sensor E3'] },
  { id: 'inc-sim-2', title: 'Camera offline — Parking Level 2', severity: 'medium', status: 'open', location: 'Parking Level 2', sources: ['Camera Health Monitor'] },
]

const SIM_VIOLATIONS: Array<Omit<Violation, 'ts' | 'id'>> = [
  { type: 'ppe', description: 'Face shield not worn during welding operation.', location: 'Workshop Bay 3', cameraId: 'cam-wb-003', status: 'open', severity: 'high' },
]

export function useSimulation(enabled = true): SimulationState {
  const [state, setState] = useState<SimulationState>({
    incidents: MOCK_INCIDENTS,
    violations: MOCK_VIOLATIONS,
    contextFeeds: MOCK_CONTEXT_FEEDS,
    journeys: MOCK_JOURNEYS,
    lastEvent: null,
  })

  const tick = useCallback(() => {
    const roll = Math.random()
    const now = new Date().toISOString()

    if (roll < 0.35) {
      const template = SIM_INCIDENTS[Math.floor(Math.random() * SIM_INCIDENTS.length)]
      const newIncident: Incident = {
        ...template,
        id: `${template.id}-${Date.now()}`,
        ts: now,
        description: `Auto-detected at ${new Date().toLocaleTimeString()}`,
      }
      setState((s) => ({
        ...s,
        incidents: [newIncident, ...s.incidents],
        lastEvent: `New incident: ${newIncident.title}`,
      }))
    } else if (roll < 0.6) {
      const template = SIM_VIOLATIONS[Math.floor(Math.random() * SIM_VIOLATIONS.length)]
      const newViolation: Violation = {
        ...template,
        id: `vio-sim-${Date.now()}`,
        ts: now,
      }
      setState((s) => ({
        ...s,
        violations: [newViolation, ...s.violations],
        lastEvent: `New violation: ${newViolation.description.slice(0, 55)}`,
      }))
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    const interval = setInterval(tick, 8000)
    return () => clearInterval(interval)
  }, [enabled, tick])

  return state
}
