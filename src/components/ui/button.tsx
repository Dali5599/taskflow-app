export interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  children: React.ReactNode
  className?: string
}

export function Button({
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
  children,
  className = '',
}: ButtonProps) {
  const baseStyles = {
    primary: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-xl active:scale-105 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-105 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl active:scale-105 disabled:opacity-50 disabled:cursor-not-allowed',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-semibold rounded-lg transition-all duration-300
        ${baseStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
