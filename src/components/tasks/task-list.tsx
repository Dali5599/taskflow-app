'use client'

import { useState } from 'react'
import { Task } from '@/lib/types'
import { TaskItem } from './task-item'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function TaskList({
  tasks,
  onCreateTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
}: any) {
  const [filter, setFilter] = useState('all')

  const filteredTasks = tasks.filter((task: Task) => {
    if (filter === 'active') return task.status !== 'completed'
    if (filter === 'completed') return task.status === 'completed'
    return true
  })

  const stats = {
    total: tasks.length,
    active: tasks.filter((t: Task) => t.status !== 'completed').length,
    completed: tasks.filter((t: Task) => t.status === 'completed').length,
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">En cours</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Complétées</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`flex-1 px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
        >
          Toutes
        </button>
        <button
          type="button"
          onClick={() => setFilter('active')}
          className={`flex-1 px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-green-800 text-white' : 'bg-gray-200'}`}
        >
          En cours
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`flex-1 px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-blue-800 text-white' : 'bg-gray-200'}`}
        >
          Complétées
        </button>
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={onCreateTask}
        className="w-full"
      >
        + Nouvelle tâche
      </Button>

      <div className="space-y-4">
        {filteredTasks.map((task: Task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
          />
        ))}
      </div>
    </div>
  )
}
