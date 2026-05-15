'use client'
import { useState } from 'react'
import { MaterialIcon } from '@/components/ui/MaterialIcon'
import type { TimelineEvent, SceneType } from '@/lib/mock-data/journeys'

type EventType = TimelineEvent['type']

interface ImportEventModalProps {
  journeyDate: string
  operator: string
  onImport: (event: TimelineEvent, reason: string) => void
  onClose: () => void
}

const eventTypes: { value: EventType; label: string; icon: string }[] = [
  { value: 'access',   label: 'Access Control',   icon: 'key' },
  { value: 'camera',   label: 'Camera Detection',  icon: 'videocam' },
  { value: 'elevator', label: 'Elevator',           icon: 'elevator' },
  { value: 'parking',  label: 'Parking',            icon: 'local_parking' },
  { value: 'tailgate', label: 'Tailgate Alert',     icon: 'warning' },
]

const sceneTypes: { value: SceneType; label: string }[] = [
  { value: 'lobby',      label: 'Lobby' },
  { value: 'hallway',    label: 'Hallway' },
  { value: 'parking',    label: 'Parking' },
  { value: 'elevator',   label: 'Elevator' },
  { value: 'restricted', label: 'Restricted Area' },
  { value: 'exterior',   label: 'Exterior' },
]

export function ImportEventModal({ journeyDate, operator, onImport, onClose }: ImportEventModalProps) {
  const [type, setType]           = useState<EventType>('camera')
  const [date, setDate]           = useState(journeyDate)
  const [time, setTime]           = useState('')
  const [location, setLocation]   = useState('')
  const [detail, setDetail]       = useState('')
  const [reason, setReason]       = useState('')
  const [channel, setChannel]     = useState('')
  const [sceneType, setSceneType] = useState<SceneType>('lobby')
  const [errors, setErrors]       = useState<string[]>([])

  function validate(): boolean {
    const errs: string[] = []
    if (!time.match(/^\d{2}:\d{2}(:\d{2})?$/)) errs.push('Time must be in HH:MM or HH:MM:SS format')
    if (!location.trim()) errs.push('Location is required')
    if (!detail.trim()) errs.push('Description is required')
    if (!reason.trim()) errs.push('Reason for import is required')
    setErrors(errs)
    return errs.length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const ts = time.includes(':') && time.split(':').length === 2 ? `${time}:00` : time
    const event: TimelineEvent = {
      id: `injected-${Date.now()}`,
      ts,
      type,
      location: location.trim(),
      detail: detail.trim(),
      injected: true,
      injectedBy: operator,
      injectedReason: reason.trim(),
      ...(type === 'camera' && channel.trim()
        ? { cameraPreview: { channel: channel.trim(), sceneType } }
        : {}),
    }
    onImport(event, reason.trim())
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-low">
          <div className="flex items-center gap-2">
            <MaterialIcon name="add_circle" size="sm" color="#D97706" />
            <span className="font-bold text-sm">Import Event into Timeline</span>
          </div>
          <button onClick={onClose} className="text-on-muted hover:text-on-surface transition-colors p-1">
            <MaterialIcon name="close" size="sm" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Reason — first, most important */}
          <div>
            <label className="form-label">
              Reason for import <span className="text-sec-red">*</span>
            </label>
            <textarea
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this event being added? (e.g. 'Missed by correlation engine — camera 7 on secondary DVR system')"
              className="form-input resize-none"
              rows={2}
            />
          </div>

          {/* Event type */}
          <div>
            <label className="form-label">Event Type <span className="text-sec-red">*</span></label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {eventTypes.map((et) => (
                <button
                  key={et.value}
                  onClick={() => setType(et.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold border transition-colors ${
                    type === et.value
                      ? 'bg-violet/10 border-violet text-violet'
                      : 'border-surface-low text-on-muted hover:border-violet/40 hover:text-violet'
                  }`}
                >
                  <MaterialIcon name={et.icon} size="sm" />
                  {et.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Date <span className="text-sec-red">*</span></label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Time (HH:MM:SS) <span className="text-sec-red">*</span></label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:42:15"
                className="form-input font-mono"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="form-label">Location <span className="text-sec-red">*</span></label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Parking Lot A — Camera 7"
              className="form-input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description <span className="text-sec-red">*</span></label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Describe what occurred at this event…"
              className="form-input resize-none"
              rows={2}
            />
          </div>

          {/* Camera-specific fields */}
          {type === 'camera' && (
            <div className="bg-surface-low rounded-lg p-3 space-y-3">
              <p className="text-[11px] font-semibold text-on-muted uppercase tracking-wide">Camera Details (optional)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Channel ID</label>
                  <input
                    type="text"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    placeholder="e.g. CH-07"
                    className="form-input font-mono"
                  />
                </div>
                <div>
                  <label className="form-label">Scene Type</label>
                  <select
                    value={sceneType}
                    onChange={(e) => setSceneType(e.target.value as SceneType)}
                    className="form-input"
                  >
                    {sceneTypes.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 space-y-1">
              {errors.map((e, i) => (
                <p key={i} className="text-xs text-sec-red flex items-center gap-1.5">
                  <MaterialIcon name="error_outline" size="sm" color="#DC2626" />
                  {e}
                </p>
              ))}
            </div>
          )}

          {/* Attribution */}
          <p className="text-[11px] text-on-muted bg-surface-low rounded px-3 py-2">
            This event will be attributed to <span className="font-semibold text-on-surface">{operator}</span> and marked as operator-added in the timeline and any generated court reports.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-surface-low">
          <button onClick={onClose} className="text-sm text-on-muted hover:text-on-surface px-3 py-1.5 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 bg-amber-500 text-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-amber-600 transition-colors"
          >
            <MaterialIcon name="add_circle" size="sm" />
            Add to Timeline
          </button>
        </div>
      </div>
    </div>
  )
}
