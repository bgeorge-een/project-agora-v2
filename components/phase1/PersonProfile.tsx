'use client'
import { useState } from 'react'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import type { JourneyPerson } from '@/lib/mock-data/journeys'

interface PersonProfileProps {
  person: JourneyPerson
  licensePlate?: string
  entryTime: string
  cameraDetections: number
}

export function PersonProfile({ person, licensePlate, entryTime, cameraDetections }: PersonProfileProps) {
  const [copied, setCopied] = useState(false)

  function copyPlate() {
    if (!licensePlate) return
    navigator.clipboard.writeText(licensePlate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (person.type === 'unknown') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <MaterialIcon name="person_off" size="md" color="#DC2626" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-extrabold text-sec-red text-base">Unknown Individual</h2>
              <span className="text-[10px] font-bold bg-red-100 text-sec-red px-1.5 py-0.5 rounded uppercase tracking-wide">
                No Credentials
              </span>
            </div>
            <p className="text-xs text-red-600 leading-relaxed">
              Not registered as an employee or visitor. Entry via tailgating — no access credentials presented.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/80 rounded-lg p-3">
            <p className="text-on-muted mb-1">Entry Method</p>
            <span className="inline-flex items-center gap-1 font-semibold text-sec-red">
              <MaterialIcon name="warning" size="sm" color="#DC2626" />
              Tailgating
            </span>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <p className="text-on-muted mb-1">First Detected</p>
            <p className="font-semibold text-on-surface">{entryTime}</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <p className="text-on-muted mb-1">Camera Sightings</p>
            <p className="font-semibold text-on-surface">{cameraDetections} locations</p>
          </div>
          {licensePlate ? (
            <div className="bg-white/80 rounded-lg p-3">
              <p className="text-on-muted mb-1">License Plate</p>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold font-mono tracking-[0.12em] text-on-surface">{licensePlate}</span>
                <button onClick={copyPlate} className="text-violet hover:text-violet/80 transition-colors ml-auto">
                  <MaterialIcon name={copied ? 'check' : 'content_copy'} size="sm" color={copied ? '#16A34A' : '#5644D0'} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 rounded-lg p-3">
              <p className="text-on-muted mb-1">License Plate</p>
              <p className="text-on-muted italic">Not captured</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const initials = person.initials ?? (person.name?.split(' ').map((n) => n[0]).join('') ?? '?')

  return (
    <div className="bg-surface-card rounded-xl shadow-card p-5">
      <div className="flex items-start gap-4 mb-4">
        {/* Photo placeholder */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-extrabold shadow-sm"
            style={{ backgroundColor: person.avatarColor ?? '#5644D0' }}
          >
            {initials}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
            person.type === 'employee'
              ? 'bg-violet/10 text-violet'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {person.type}
          </span>
        </div>

        {/* Core identity */}
        <div className="flex-1 min-w-0">
          <h2 className="font-extrabold text-on-surface text-base">{person.name}</h2>
          <p className="text-sm text-on-muted">{person.title}</p>
          <p className="text-xs text-on-muted mt-0.5">
            {person.department ?? person.company}
          </p>
          {person.type === 'visitor' && person.hostName && (
            <p className="text-xs text-on-muted mt-1">
              <span className="text-on-surface/60">Hosted by:</span> {person.hostName}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs border-t border-surface-low pt-4">
        {person.badgeId && (
          <div>
            <p className="text-on-muted uppercase tracking-wide text-[10px] mb-0.5">Badge ID</p>
            <p className="font-semibold font-mono text-on-surface">{person.badgeId}</p>
          </div>
        )}
        {person.badgeIssued && (
          <div>
            <p className="text-on-muted uppercase tracking-wide text-[10px] mb-0.5">Issued</p>
            <p className="font-semibold text-on-surface">{person.badgeIssued}</p>
          </div>
        )}
        {person.accessLevel && (
          <div>
            <p className="text-on-muted uppercase tracking-wide text-[10px] mb-0.5">Access Level</p>
            <p className="font-semibold text-on-surface">{person.accessLevel}</p>
          </div>
        )}
        {person.email && (
          <div>
            <p className="text-on-muted uppercase tracking-wide text-[10px] mb-0.5">Email</p>
            <p className="font-semibold text-on-surface truncate">{person.email}</p>
          </div>
        )}
        {person.phone && (
          <div>
            <p className="text-on-muted uppercase tracking-wide text-[10px] mb-0.5">Phone</p>
            <p className="font-semibold text-on-surface">{person.phone}</p>
          </div>
        )}
        {licensePlate && (
          <div>
            <p className="text-on-muted uppercase tracking-wide text-[10px] mb-0.5">License Plate</p>
            <div className="flex items-center gap-2">
              <span className="font-extrabold font-mono tracking-[0.12em] text-on-surface">{licensePlate}</span>
              <button onClick={copyPlate} className="text-violet hover:text-violet/80 transition-colors">
                <MaterialIcon name={copied ? 'check' : 'content_copy'} size="sm" color={copied ? '#16A34A' : '#5644D0'} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
