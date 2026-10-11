'use client'

import { useState } from 'react'
import { Task, TaskPriority, TaskCategory } from '@/lib/types'
import { Button } from '@/components/ui/button'

export function TaskItem({ task, onToggle, onDelete }: any) {
  const isCompleted = task.status === 'completed'

  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${isCompleted ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button
            type="button"
            onClick={() => onToggle(task.id)}
            className="w-6 h-6 rounded-lg border-2 flex items-center justify-center"
          >
            {isCompleted ? '✓' : ''}
          </button>
          <div className="flex-1">
            <h3 className="font-semibold">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded text-xs ${
                task.priority === 'urgent' ? 'bg-red-500 text-white' :
                task.priority === 'high' ? 'bg-orange-500 text-white' :
                task.priority === 'medium' ? 'bg-blue-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {task.priority}
              </span>
              {task.category && (
                <span className="text-xs text-gray-600">{task.category}</span>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="text-red-600"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
