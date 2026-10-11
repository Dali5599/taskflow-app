'use client'

import { useEffect } from 'react'
import { Task } from '@/lib/types'
import { useTasks } from '@/lib/hooks/use-tasks'
import { TaskList } from '@/components/tasks/task-list'

export default function HomePage() {
  const { tasks, isLoading, addTask, toggleTask, deleteTask, updateTask } = useTasks()

  useEffect(() => {
    if (tasks.length === 0 && !isLoading) {
      const defaultTasks: Task[] = [
        {
          id: '1',
          title: 'Bienvenue sur TaskFlow !',
          description: 'Ceci est une tâche par défaut.',
          status: 'completed',
          priority: 'medium',
          category: 'other',
          tags: ['bienvenue'],
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          order: 1,
        },
        {
          id: '2',
          title: 'Créer une nouvelle tâche',
          description: 'Cliquez sur le bouton ci-dessous.',
          status: 'todo',
          priority: 'high',
          category: 'work',
          tags: ['guide'],
          createdAt: new Date().toISOString(),
          completedAt: null,
          order: 2,
        },
      ]

      defaultTasks.forEach(task => addTask(task))
    }
  }, [tasks.length, isLoading])

  const handleCreateTask = () => {
    const title = prompt('Titre de la tâche:')
    if (title) {
      addTask({
        title,
        description: '',
        status: 'todo',
        priority: 'medium',
        category: 'other',
        tags: ['nouveau'],
        createdAt: new Date().toISOString(),
        completedAt: null,
        order: tasks.length + 1,
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-600 mb-2">
          📋 Tableau de Bord
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Gérez vos tâches efficacement avec TaskFlow.
        </p>
      </div>

      <TaskList
        tasks={tasks}
        onCreateTask={handleCreateTask}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        onUpdateTask={updateTask}
      />
    </div>
  )
}
