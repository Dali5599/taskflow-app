'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    soundEffects: true,
    autoSave: true,
    darkMode: false,
  })

  const [profile, setProfile] = useState({
    name: 'Dali',
    email: 'dali@example.com',
    timezone: 'Europe/Zurich',
    language: 'Français',
  })

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  const updateProfile = (key: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-600 mb-2">
          ⚙️ Paramètres
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Personnalisez votre expérience TaskFlow.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Profil
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile('email', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fuseau horaire
              </label>
              <select
                value={profile.timezone}
                onChange={(e) => updateProfile('timezone', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="Europe/Zurich">Europe/Zurich (GMT+1)</option>
                <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                <option value="Europe/London">Europe/London (GMT+0)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (GMT-8)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Langue
              </label>
              <select
                value={profile.language}
                onChange={(e) => updateProfile('language', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="Français">Français</option>
                <option value="English">English</option>
                <option value="Deutsch">Deutsch</option>
                <option value="Español">Español</option>
                <option value="Italiano">Italiano</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Notifications push
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Recevez des notifications pour les tâches importantes
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('notifications')}
                className={`
                  w-12 h-6 rounded-full transition-colors duration-300
                  ${settings.notifications ? 'bg-purple-500' : 'bg-gray-300'}
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300
                    ${settings.notifications ? 'translate-x-6' : 'translate-x-0.5'}
                  `}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Notifications email
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Recevez un résumé quotidien par email
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('emailNotifications')}
                className={`
                  w-12 h-6 rounded-full transition-colors duration-300
                  ${settings.emailNotifications ? 'bg-purple-500' : 'bg-gray-300'}
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300
                    ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'}
                  `}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Effets sonores
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sons lors de la complétion de tâches
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('soundEffects')}
                className={`
                  w-12 h-6 rounded-full transition-colors duration-300
                  ${settings.soundEffects ? 'bg-purple-500' : 'bg-gray-300'}
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300
                    ${settings.soundEffects ? 'translate-x-6' : 'translate-x-0.5'}
                  `}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Sauvegarde automatique
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sauvegarde automatique des modifications
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('autoSave')}
                className={`
                  w-12 h-6 rounded-full transition-colors duration-300
                  ${settings.autoSave ? 'bg-purple-500' : 'bg-gray-300'}
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300
                    ${settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-red-200 dark:border-red-700">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-6">
            Zone de danger
          </h2>

          <div className="space-y-4">
            <button
              type="button"
              className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              Supprimer toutes les tâches
            </button>

            <button
              type="button"
              className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              Réinitialiser tous les paramètres
            </button>

            <button
              type="button"
              className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              Supprimer le compte
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
