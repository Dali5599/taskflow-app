export default function CalendarPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-600 mb-2">
          📅 Calendrier
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Planifiez et visualisez vos tâches dans le temps.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Calendrier en cours de développement
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Bientôt disponible : Visualisez vos tâches sur un calendrier mensuel.
          </p>
        </div>
      </div>
    </div>
  )
}
