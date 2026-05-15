interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-surface-card rounded shadow-card p-5 ${className}`}>
      {children}
    </div>
  )
}
