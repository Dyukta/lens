interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }

export default function Loader({ size = 'md', label }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`${sizes[size]} rounded-full border-2 animate-spin`}
        style={{
          borderColor: 'var(--color-border-hi)',
          borderTopColor: 'var(--color-accent)',
        }}
      />
      {label && <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{label}</p>}
    </div>
  )
}