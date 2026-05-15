'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import type { Journey } from '@/lib/mock-data/journeys'
import type { AnnotationMap } from '@/lib/annotations'
import { sha256, nowString, type AuditEntry, type Classification } from '@/lib/report-types'

interface Props {
  journey: Journey
  annotations: AnnotationMap
  operator: string
  onClose: () => void
}

const classificationStyle: Record<Classification, string> = {
  'CONFIDENTIAL': 'bg-red-600 text-white',
  'INTERNAL USE ONLY': 'bg-amber-500 text-white',
  'RESTRICTED — LAW ENFORCEMENT': 'bg-gray-900 text-white',
}

const auditIcon: Record<AuditEntry['action'], string> = {
  generated:   'auto_awesome',
  regenerated: 'refresh',
  modified:    'edit',
  exported:    'download',
}
const auditColor: Record<AuditEntry['action'], string> = {
  generated:   '#5644D0',
  regenerated: '#2563EB',
  modified:    '#D97706',
  exported:    '#16A34A',
}

function duration(entry: string, exit: string): string {
  if (exit === '—') return 'Ongoing'
  const [eh, em] = entry.split(':').map(Number)
  const [xh, xm] = exit.split(':').map(Number)
  const mins = (xh * 60 + xm) - (eh * 60 + em)
  return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export function NarrativeReport({ journey, annotations, operator, onClose }: Props) {
  const reportId = `RPT-${journey.date.replace(/-/g, '').slice(2)}-${journey.id.toUpperCase()}`
  const generatedAt = useRef(nowString())

  const [classification, setClassification] = useState<Classification>('CONFIDENTIAL')
  const [narrative, setNarrative] = useState('')
  const [generating, setGenerating] = useState(false)
  const [editedNarrative, setEditedNarrative] = useState<string | null>(null)
  const [certification, setCertification] = useState(
    `I, ${operator}, hereby certify that this report accurately reflects the physical security system records as documented above on ${journey.date}. The event data has been retrieved from tamper-evident security infrastructure and is presented without modification to the underlying source records.`
  )
  const [editingSection, setEditingSection] = useState<null | 'narrative' | 'certification'>(null)
  const [draft, setDraft] = useState('')
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
  const [showAudit, setShowAudit] = useState(false)
  const [originalHash, setOriginalHash] = useState<string | null>(null)
  const [exportHash, setExportHash] = useState<string | null>(null)

  const allAnnotations = Object.entries(annotations).flatMap(([eventId, anns]) =>
    anns.map((a) => ({ ...a, eventId }))
  )

  function addAudit(action: AuditEntry['action'], detail: string, hash?: string) {
    setAuditLog((prev) => [{ id: Date.now().toString(), action, actor: operator, timestamp: nowString(), detail, hash }, ...prev])
  }

  const runGenerate = useCallback(async (isRegen = false) => {
    setGenerating(true)
    setNarrative('')
    setEditedNarrative(null)
    setOriginalHash(null)
    setExportHash(null)
    try {
      const res = await fetch('/api/journey-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journey }),
      })
      if (!res.body) return
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        full += chunk
        setNarrative((p) => p + chunk)
      }
      const hash = await sha256(reportId + full + certification)
      setOriginalHash(hash)
      addAudit(isRegen ? 'regenerated' : 'generated', `Narrative ${isRegen ? 'regenerated' : 'generated'} for ${journey.personLabel}`, hash)
    } finally {
      setGenerating(false)
    }
  }, [journey, reportId, certification])

  useEffect(() => { runGenerate() }, [])

  function startEdit(section: 'narrative' | 'certification') {
    setEditingSection(section)
    setDraft(section === 'narrative' ? (editedNarrative ?? narrative) : certification)
  }

  function saveEdit() {
    if (!editingSection) return
    if (editingSection === 'narrative') setEditedNarrative(draft)
    if (editingSection === 'certification') setCertification(draft)
    const label = editingSection === 'narrative' ? 'Incident Narrative' : 'Certification'
    addAudit('modified', `"${label}" section modified`)
    setEditingSection(null)
  }

  async function handleExport() {
    const finalNarrative = editedNarrative ?? narrative
    const hash = await sha256(reportId + finalNarrative + certification)
    setExportHash(hash)
    addAudit('exported', 'Document exported as PDF', hash)
    setTimeout(() => window.print(), 150)
  }

  const displayNarrative = editedNarrative ?? narrative
  const modCount = auditLog.filter((e) => e.action === 'modified').length
  const hashMatch = exportHash && originalHash ? exportHash === originalHash : null
  const zones = new Set(journey.events.map((e) => e.location)).size
  const denied = journey.events.filter((e) => e.detail.toLowerCase().includes('denied')).length
  const cameras = journey.events.filter((e) => e.type === 'camera' || e.type === 'tailgate').length

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:block">
      <div className="w-full max-w-3xl print:max-w-none print:shadow-none">

        {/* Toolbar — hidden on print */}
        <div className="flex items-center justify-between mb-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => runGenerate(true)}
              disabled={generating}
              className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors disabled:opacity-40"
            >
              <MaterialIcon name="refresh" size="sm" />
              Regenerate
            </button>
            <button
              onClick={handleExport}
              disabled={generating || !narrative}
              className="flex items-center gap-1.5 text-xs bg-comp-green text-white px-3 py-1.5 rounded hover:bg-comp-green/90 transition-colors disabled:opacity-40"
            >
              <MaterialIcon name="picture_as_pdf" size="sm" />
              Export PDF
            </button>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1">
            <MaterialIcon name="close" size="sm" />
          </button>
        </div>

        {/* Report document */}
        <div id="narrative-report" className="bg-white rounded-xl shadow-2xl overflow-hidden print:rounded-none print:shadow-none">

          {/* Classification banner */}
          <div className={`${classificationStyle[classification]} text-center py-1.5 text-[11px] font-extrabold tracking-[0.2em] print:py-1`}>
            {classification}
          </div>

          <div className="p-8 print:p-6 space-y-6">

            {/* Document header */}
            <div className="text-center border-b border-gray-200 pb-5">
              <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">Physical Security Incident Report</p>
              <h1 className="text-xl font-extrabold text-gray-900">{reportId}</h1>
              <div className="flex justify-center gap-6 mt-3 text-xs text-gray-500">
                <span><span className="font-semibold">Generated:</span> {generatedAt.current}</span>
                <span><span className="font-semibold">By:</span> {operator}</span>
                <span className="print:hidden">
                  <select
                    value={classification}
                    onChange={(e) => setClassification(e.target.value as Classification)}
                    className="text-xs border border-gray-200 rounded px-1.5 py-0.5 text-gray-600"
                  >
                    <option>CONFIDENTIAL</option>
                    <option>INTERNAL USE ONLY</option>
                    <option>RESTRICTED — LAW ENFORCEMENT</option>
                  </select>
                </span>
                <span className="hidden print:inline"><span className="font-semibold">Classification:</span> {classification}</span>
              </div>
            </div>

            {/* Section 1: Subject */}
            <section>
              <h2 className="report-section-heading">1. Subject Information</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm mt-3">
                <ReportField label="Name / Identifier" value={journey.person?.name ?? journey.personLabel} />
                <ReportField label="Subject Type" value={journey.person?.type?.toUpperCase() ?? 'UNKNOWN'} alert={journey.person?.type === 'unknown'} />
                {journey.person?.type !== 'unknown' && <>
                  <ReportField label="Title" value={journey.person?.title ?? '—'} />
                  <ReportField label="Department" value={journey.person?.department ?? journey.person?.company ?? '—'} />
                  <ReportField label="Badge / Credential ID" value={journey.person?.badgeId ?? '—'} />
                  <ReportField label="Access Level" value={journey.person?.accessLevel ?? '—'} />
                </>}
                {journey.person?.type === 'unknown' && <>
                  <ReportField label="Entry Method" value="Tailgating — no credential presented" alert />
                  <ReportField label="License Plate" value={journey.licensePlate ?? 'Not captured'} />
                </>}
                <ReportField label="Date of Record" value={journey.date} />
                <ReportField label="Facility Entry" value={journey.entryTime} />
                <ReportField label="Facility Exit" value={journey.exitTime} />
                <ReportField label="Duration on Premises" value={duration(journey.entryTime, journey.exitTime)} />
              </div>
            </section>

            {/* Section 2: Incident Narrative — AI generated, editable */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="report-section-heading">2. Incident Narrative</h2>
                {!generating && narrative && editingSection !== 'narrative' && (
                  <button onClick={() => startEdit('narrative')} className="flex items-center gap-1 text-[11px] text-violet hover:text-violet/80 transition-colors print:hidden">
                    <MaterialIcon name="edit" size="sm" />
                    {editedNarrative ? 'Edit again' : 'Edit'}
                  </button>
                )}
              </div>
              {editedNarrative && (
                <div className="flex items-center gap-1.5 mt-1 mb-2 print:hidden">
                  <MaterialIcon name="edit_note" size="sm" color="#D97706" />
                  <span className="text-[10px] text-amber-600 font-semibold">Modified by {operator}</span>
                </div>
              )}
              {editingSection === 'narrative' ? (
                <div className="mt-3">
                  <textarea
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="w-full text-sm text-gray-800 leading-relaxed border border-violet/40 rounded-lg p-4 resize-none outline-none focus:ring-2 focus:ring-violet/30 font-serif"
                    rows={12}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={saveEdit} className="text-xs font-semibold px-3 py-1.5 bg-violet text-white rounded hover:bg-violet/90 transition-colors">Save changes</button>
                    <button onClick={() => setEditingSection(null)} className="text-xs text-gray-500 hover:text-gray-700 px-2">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  {generating ? (
                    <div className="text-sm text-gray-700 leading-relaxed font-serif">
                      {displayNarrative}<span className="animate-pulse text-violet">▍</span>
                    </div>
                  ) : displayNarrative ? (
                    <p className="text-sm text-gray-700 leading-relaxed font-serif whitespace-pre-wrap">{displayNarrative}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Generating narrative…</p>
                  )}
                </div>
              )}
            </section>

            {/* Section 3: Chronological event log — locked */}
            <section>
              <h2 className="report-section-heading">3. Chronological Event Log</h2>
              <table className="w-full mt-3 text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase tracking-wide">
                    <th className="text-left px-3 py-2 font-semibold rounded-tl">Timestamp</th>
                    <th className="text-left px-3 py-2 font-semibold">Type</th>
                    <th className="text-left px-3 py-2 font-semibold">Location</th>
                    <th className="text-left px-3 py-2 font-semibold rounded-tr">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {journey.events.map((event, i) => {
                    const isDenied = event.detail.toLowerCase().includes('denied')
                    const isTailgate = event.type === 'tailgate'
                    return (
                      <tr key={event.id} className={`border-t border-gray-100 ${isDenied || isTailgate ? 'bg-red-50' : i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                        <td className="px-3 py-2 font-mono tabular-nums text-gray-600 whitespace-nowrap">{journey.date} {event.ts}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${isDenied || isTailgate ? 'bg-red-100 text-red-700' : event.injected ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                            {isTailgate ? 'TAILGATE' : event.injected ? 'ADDED*' : event.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-700">{event.location}</td>
                        <td className="px-3 py-2 text-gray-600 leading-snug">{event.detail}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </section>

            {journey.events.some((e) => e.injected) && (
              <p className="text-[10px] text-gray-400 mt-2 italic">
                * {journey.events.filter((e) => e.injected).length} event(s) manually added by operator and not sourced from the automated security system.
              </p>
            )}

            {/* Section 4: Physical Access Summary */}
            <section>
              <h2 className="report-section-heading">4. Physical Access Summary</h2>
              <div className="grid grid-cols-4 gap-3 mt-3">
                {[
                  { label: 'Total Events', value: String(journey.events.length) },
                  { label: 'Zones Accessed', value: String(zones) },
                  { label: 'Camera Detections', value: String(cameras) },
                  { label: 'Denied Attempts', value: String(denied), alert: denied > 0 },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-lg p-3 text-center ${stat.alert ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                    <p className={`text-lg font-extrabold ${stat.alert ? 'text-red-600' : 'text-gray-900'}`}>{stat.value}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5: Operator Notes — from annotations */}
            {allAnnotations.length > 0 && (
              <section>
                <h2 className="report-section-heading">5. Operator Field Notes</h2>
                <div className="mt-3 space-y-2">
                  {allAnnotations.map((ann, i) => (
                    <div key={i} className="flex gap-3 text-xs border-l-2 border-amber-300 pl-3 py-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-gray-800">{ann.author}</span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-500 tabular-nums">{ann.addedAt}</span>
                        </div>
                        <p className="text-gray-700 leading-snug">{ann.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 6: Certification — editable */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="report-section-heading">{allAnnotations.length > 0 ? '6' : '5'}. Certification & Attestation</h2>
                {editingSection !== 'certification' && (
                  <button onClick={() => startEdit('certification')} className="flex items-center gap-1 text-[11px] text-violet hover:text-violet/80 transition-colors print:hidden">
                    <MaterialIcon name="edit" size="sm" />
                    Edit
                  </button>
                )}
              </div>
              {editingSection === 'certification' ? (
                <div className="mt-3">
                  <textarea
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="w-full text-sm text-gray-700 border border-violet/40 rounded-lg p-3 resize-none outline-none focus:ring-2 focus:ring-violet/30"
                    rows={4}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={saveEdit} className="text-xs font-semibold px-3 py-1.5 bg-violet text-white rounded hover:bg-violet/90 transition-colors">Save</button>
                    <button onClick={() => setEditingSection(null)} className="text-xs text-gray-500 hover:text-gray-700 px-2">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700 italic mt-3 leading-relaxed border-l-4 border-gray-200 pl-4">{certification}</p>
              )}
              <div className="mt-4 grid grid-cols-2 gap-8">
                <div className="border-t border-gray-300 pt-2">
                  <p className="text-xs text-gray-500">Signature</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1 print:invisible">{operator}</p>
                </div>
                <div className="border-t border-gray-300 pt-2">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{generatedAt.current}</p>
                </div>
              </div>
            </section>

            {/* Section 7: Chain of Custody — locked */}
            <section className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <MaterialIcon name="verified_user" size="sm" color="#5644D0" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Chain of Custody</h2>
                <span className="ml-auto text-[10px] text-gray-400 print:hidden">System-managed · not editable</span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                <ReportField label="Document ID" value={reportId} mono />
                <ReportField label="Generated" value={generatedAt.current} />
                <ReportField label="Generated by" value={operator} />
                <ReportField label="Modifications" value={modCount === 0 ? 'None' : `${modCount} section${modCount > 1 ? 's' : ''} edited`} alert={modCount > 0} />
                {originalHash && (
                  <div className="col-span-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Original Document Hash (SHA-256)</p>
                    <p className="font-mono text-[10px] text-gray-600 break-all">{originalHash}</p>
                  </div>
                )}
                {exportHash && (
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Export Hash (SHA-256)</p>
                      {hashMatch !== null && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${hashMatch ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          <MaterialIcon name={hashMatch ? 'check_circle' : 'warning'} size="sm" color={hashMatch ? '#16A34A' : '#D97706'} />
                          {hashMatch ? 'Unmodified — matches original' : 'Modified since generation'}
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-gray-600 break-all">{exportHash}</p>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Classification banner (bottom) */}
          <div className={`${classificationStyle[classification]} text-center py-1.5 text-[11px] font-extrabold tracking-[0.2em]`}>
            {classification}
          </div>
        </div>

        {/* Audit Log */}
        <div className="mt-3 bg-white/5 rounded-xl overflow-hidden print:hidden">
          <button
            onClick={() => setShowAudit(!showAudit)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-white/70 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <MaterialIcon name="history" size="sm" />
              <span className="font-semibold">Audit Log</span>
              <span className="bg-white/10 text-white/60 text-[11px] px-2 py-0.5 rounded-full">{auditLog.length} entries</span>
            </div>
            <MaterialIcon name={showAudit ? 'expand_less' : 'expand_more'} size="sm" />
          </button>

          {showAudit && (
            <div className="px-4 pb-4 space-y-2">
              {auditLog.length === 0 ? (
                <p className="text-xs text-white/40 italic">No entries yet.</p>
              ) : (
                auditLog.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 bg-white/5 rounded-lg px-3 py-2.5">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MaterialIcon name={auditIcon[entry.action]} size="sm" color={auditColor[entry.action]} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white/90">{entry.actor}</span>
                        <span className="text-[10px] text-white/40 tabular-nums ml-auto">{entry.timestamp}</span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">{entry.detail}</p>
                      {entry.hash && (
                        <p className="text-[9px] font-mono text-white/25 mt-1 truncate">sha256: {entry.hash.slice(0, 32)}…</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function ReportField({ label, value, alert = false, mono = false }: { label: string; value: string; alert?: boolean; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`mt-0.5 font-semibold ${alert ? 'text-red-600' : 'text-gray-800'} ${mono ? 'font-mono text-xs' : 'text-sm'}`}>{value}</p>
    </div>
  )
}
