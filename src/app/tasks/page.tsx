'use client'

import { useTasks } from '@/lib/hooks/use-tasks'
import { TaskList } from '@/components/tasks/task-list'

export default function TasksPage() {
  const { tasks, isLoading, addTask, toggleTask, deleteTask, updateTask } = useTasks()

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
          📋 Toutes les Tâches
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Gérez toutes vos tâches en un seul endroit.
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
