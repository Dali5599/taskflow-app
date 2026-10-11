'use client'

import { useState } from 'react'

export function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <span>🏠</span>
          <span className="text-gray-900 dark:text-white font-semibold">
            Tableau de bord
          </span>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="text-xl">🔍</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300"
            >
              <span className="text-2xl">👤</span>
              <span className="font-semibold">Dali</span>
              <span className="text-white/80">{userMenuOpen ? '↑' : '↓'}</span>
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 animate-fade-in">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Connecté en tant que
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Dali
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    dali@example.com
                  </p>
                </div>

                <ul className="p-2 space-y-1">
                  <li>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white transition-colors">
                      👤 Mon Profil
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white transition-colors">
                      ⚙️ Paramètres
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors">
                      🚪 Déconnexion
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
