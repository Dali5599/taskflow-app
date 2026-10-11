'use client'

import { useEffect } from 'react'
import { Task } from '@/lib/types'
import { useTasks } from '@/lib/hooks/use-tasks'
import { TaskList } from '@/components/tasks/task-list'

export default function HomePage() {
  const {
    tasks,
    isLoading,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    reorderTasks,
    exportJSON,
    exportCSV,
    importTasks,
  } = useTasks()

  useEffect(() => {
    if (tasks.length === 0 && !isLoading) {
      const defaultTasks: Task[] = [
        {
          id: '1',
          title: 'Bienvenue sur TaskFlow Pro ! 🦞',
          description: 'Votre gestionnaire de tâches nouvelle génération par Requin & Dali.',
          status: 'completed',
          priority: 'medium',
          category: 'other',
          tags: ['bienvenue', 'guide'],
          dueDate: null,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          order: 1,
        },
        {
          id: '2',
          title: 'Découvrir les raccourcis clavier (Ctrl+K, N, ?)',
          description: 'Gagnez en vitesse de navigation grâce aux raccourcis intégrés.',
          status: 'in-progress',
          priority: 'high',
          category: 'work',
          tags: ['productivité'],
          dueDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          completedAt: null,
          order: 2,
        },
        {
          id: '3',
          title: 'Tester le Drag & Drop et l\'export CSV / JSON',
          description: 'Réorganisez vos tâches par glisser-déposer ou exportez vos flux en 1 clic.',
          status: 'todo',
          priority: 'urgent',
          category: 'work',
          tags: ['phase2'],
          dueDate: null,
          createdAt: new Date().toISOString(),
          completedAt: null,
          order: 3,
        },
      ]

      defaultTasks.forEach(task => addTask(task))
    }
  }, [tasks.length, isLoading, addTask])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 mb-2">
          📋 Tableau de Bord
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez, filtrez, exportez et planifiez vos tâches efficacement avec TaskFlow.
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
