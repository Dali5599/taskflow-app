'use client'

import React from 'react'
import { Task, TaskPriority, TaskCategory, CATEGORY_COLORS, PRIORITY_COLORS } from '@/lib/types'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate?: (id: string, updates: Partial<Task>) => void
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, id: string) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>, targetId: string) => void
}

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onUpdate,
  onDragStart,
  onDragOver,
  onDrop,
}: TaskItemProps) {
  const isCompleted = task.status === 'completed'

  const priorityStyles: Record<TaskPriority, { bg: string; text: string; label: string }> = {
    urgent: { bg: 'bg-red-500/10 border-red-500/30 text-red-500 dark:text-red-400', text: 'text-red-500', label: 'Urgent 🔥' },
    high: { bg: 'bg-orange-500/10 border-orange-500/30 text-orange-500 dark:text-orange-400', text: 'text-orange-500', label: 'Haute' },
    medium: { bg: 'bg-blue-500/10 border-blue-500/30 text-blue-500 dark:text-blue-400', text: 'text-blue-500', label: 'Moyenne' },
    low: { bg: 'bg-gray-500/10 border-gray-500/30 text-gray-500 dark:text-gray-400', text: 'text-gray-500', label: 'Faible' },
  }

  const pStyle = priorityStyles[task.priority] || priorityStyles.medium

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      onDragOver={(e) => onDragOver && onDragOver(e)}
      onDrop={(e) => onDrop && onDrop(e, task.id)}
      className={`
        group relative p-4 rounded-xl transition-all duration-200 cursor-grab active:cursor-grabbing select-none
        border bg-white dark:bg-gray-800/90
        ${isCompleted 
          ? 'border-gray-200 dark:border-gray-700/60 opacity-60' 
          : 'border-gray-200 dark:border-gray-700 hover:border-purple-500/40 hover:shadow-lg dark:hover:shadow-purple-500/5'
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Drag Handle & Checkbox */}
        <div className="flex items-center gap-2 pt-0.5">
          <span 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-grab text-xs select-none"
            title="Glisser pour réorganiser"
          >
            ⠿
          </span>
          <button
            type="button"
            onClick={() => onToggle(task.id)}
            className={`
              w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
              ${isCompleted 
                ? 'bg-purple-600 border-purple-600 text-white' 
                : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'
              }
            `}
            title={isCompleted ? 'Marquer comme non complétée' : 'Marquer comme terminée'}
          >
            {isCompleted && (
              <span className="text-xs font-bold leading-none">✓</span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className={`text-base font-semibold leading-snug break-words ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-relaxed break-words">
              {task.description}
            </p>
          )}

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Priority */}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${pStyle.bg}`}>
              {pStyle.label}
            </span>

            {/* Category */}
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 capitalize">
              📁 {task.category}
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center gap-1">
                📅 {task.dueDate}
              </span>
            )}

            {/* Status change selector */}
            {onUpdate && (
              <select
                value={task.status}
                onChange={(e) => onUpdate(task.id, { status: e.target.value as any })}
                className="text-xs bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="todo">À faire</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Terminée</option>
              </select>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Supprimer la tâche "${task.title}" ?`)) {
                onDelete(task.id)
              }
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
            title="Supprimer la tâche"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
