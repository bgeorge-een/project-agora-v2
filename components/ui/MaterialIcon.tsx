interface MaterialIconProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

const sizes: Record<NonNullable<MaterialIconProps['size']>, string> = {
  sm: 'text-base',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export function MaterialIcon({ name, size = 'md', color, className = '' }: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none leading-none ${sizes[size]} ${className}`}
      style={color ? { color } : undefined}
    >
      {name}
    </span>
  )
}
