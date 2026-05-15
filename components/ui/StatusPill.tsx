type StatusVariant = 'active' | 'resolved' | 'open' | 'warning' | 'info'

const variants: Record<StatusVariant, string> = {
  active: 'bg-red-100 text-red-700',
  resolved: 'bg-green-100 text-green-700',
  open: 'bg-violet/10 text-violet',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-700',
}

interface StatusPillProps {
  label: string
  variant: StatusVariant
}

export function StatusPill({ label, variant }: StatusPillProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize ${variants[variant]}`}>
      {label}
    </span>
  )
}
