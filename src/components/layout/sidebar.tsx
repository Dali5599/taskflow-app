'use client'

import { useTheme } from '@/lib/hooks/use-dark-mode'

export function Sidebar() {
  const { theme } = useTheme()

  const navigation = [
    { id: '/', label: 'Tableau de bord', icon: '📊' },
    { id: '/tasks', label: 'Tâches', icon: '📋' },
    { id: '/calendar', label: 'Calendrier', icon: '📅' },
    { id: '/analytics', label: 'Analytics', icon: '📈' },
    { id: '/settings', label: 'Paramètres', icon: '⚙️' },
  ]

  return (
    <aside
      className={`
        w-64 h-screen fixed left-0 top-0
        bg-white dark:bg-gray-800
        border-r border-gray-200 dark:border-gray-700
        shadow-lg
        ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}
      `}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-600">
          🦞 TaskFlow
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => (
          <a
            key={item.id}
            href={item.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg
              transition-all duration-300
              ${theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Dark Mode Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {/* Will use useTheme hook */}}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300"
        >
          <span className="text-xl">
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>
          <span className="font-medium">
            {theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
          </span>
        </button>
      </div>
    </aside>
  )
}
