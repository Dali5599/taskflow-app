export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea'
  placeholder?: string
  value?: string | number
  onChange?: (value: string | number) => void
  disabled?: boolean
  label?: string
  error?: string
  className?: string
}

export function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  label,
  error,
  className = '',
}: InputProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`
          px-4 py-2 rounded-lg border-2
          border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-600
          focus:ring-2 focus:ring-purple-500 focus:border-purple-500
          focus:outline-none
          transition-all duration-300
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  )
}
