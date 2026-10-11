'use client'

import { useTasks } from '@/lib/hooks/use-tasks'
import { TaskList } from '@/components/tasks/task-list'

export default function TasksPage() {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    reorderTasks,
    exportJSON,
    exportCSV,
    importTasks,
  } = useTasks()

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 mb-2">
          📋 Toutes les Tâches
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez, filtrez, exportez et réorganisez toutes vos tâches en un seul endroit.
        </p>
      </div>

      <TaskList
        tasks={tasks}
        onCreateTask={addTask}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        onUpdateTask={updateTask}
        onReorderTasks={reorderTasks}
        onExportJSON={exportJSON}
        onExportCSV={exportCSV}
        onImportTasks={importTasks}
      />
    </div>
  )
}
