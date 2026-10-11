export interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  animate?: boolean
}

export function Card({
  children,
  className = '',
  hover = false,
  animate = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-xl shadow-lg
        border border-gray-200 dark:border-gray-700
        ${hover ? 'hover:shadow-xl hover:-translate-y-[-4px] transition-all duration-300' : ''}
        ${animate ? 'animate-fade-in' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
