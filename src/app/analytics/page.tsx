'use client'

import { useTasks } from '@/lib/hooks/use-tasks'

export default function AnalyticsPage() {
  const { tasks } = useTasks()

  const completedTasks = tasks.filter(t => t.status === 'completed')
  const activeTasks = tasks.filter(t => t.status !== 'completed')

  const tasksByPriority = {
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  }

  const completionRate = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-600 mb-2">
          📈 Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Analysez votre productivité et vos performances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {tasks.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total des tâches
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {completionRate}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Taux de complétion
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {activeTasks.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            En cours
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {completedTasks.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Complétées
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Tâches par priorité
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Urgent</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{tasksByPriority.urgent}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${tasks.length > 0 ? (tasksByPriority.urgent / tasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{tasksByPriority.high}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${tasks.length > 0 ? (tasksByPriority.high / tasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{tasksByPriority.medium}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${tasks.length > 0 ? (tasksByPriority.medium / tasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{tasksByPriority.low}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gray-500 h-2 rounded-full"
                  style={{ width: `${tasks.length > 0 ? (tasksByPriority.low / tasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Statistiques rapides
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tâches complétées aujourd'hui</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {completedTasks.filter(t => {
                  const today = new Date().toISOString().split('T')[0]
                  return t.completedAt && t.completedAt.startsWith(today)
                }).length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tâches créées aujourd'hui</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {tasks.filter(t => {
                  const today = new Date().toISOString().split('T')[0]
                  return t.createdAt.startsWith(today)
                }).length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tâches urgentes en cours</span>
              <span className="text-lg font-bold text-red-600">
                {tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tâches en retard</span>
              <span className="text-lg font-bold text-orange-600">
                {tasks.filter(t => t.status !== 'completed').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
