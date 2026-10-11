'use client'

import { useState, useEffect, useCallback } from 'react'
import { Task } from '@/lib/types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tasks')
    if (stored) {
      try {
        setTasks(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading tasks:', error)
        setTasks([])
      }
    }
    setIsLoading(false)
  }, [])

  // Save tasks to localStorage whenever they change
  const saveTasks = useCallback((newTasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks))
    setTasks(newTasks)
  }, [])

  const addTask = useCallback((task: Partial<Task> & { title: string }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: task.title,
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      category: task.category || 'work',
      tags: task.tags || [],
      dueDate: task.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      order: tasks.length + 1,
    }
    saveTasks([...tasks, newTask])
    return newTask
  }, [tasks, saveTasks])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    )
    saveTasks(newTasks)
  }, [tasks, saveTasks])

  const deleteTask = useCallback((id: string) => {
    const newTasks = tasks.filter(task => task.id !== id)
    saveTasks(newTasks)
  }, [tasks, saveTasks])

  const toggleTask = useCallback((id: string) => {
    const newTasks = tasks.map(task => {
      if (task.id === id) {
        const isDone = task.status === 'completed'
        return {
          ...task,
          status: isDone ? ('todo' as const) : ('completed' as const),
          completedAt: isDone ? null : new Date().toISOString(),
        }
      }
      return task
    })
    saveTasks(newTasks)
  }, [tasks, saveTasks])

  const reorderTasks = useCallback((newTasks: Task[]) => {
    const ordered = newTasks.map((t, index) => ({ ...t, order: index + 1 }))
    saveTasks(ordered)
  }, [saveTasks])

  const importTasks = useCallback((imported: Task[]) => {
    // Avoid duplicate IDs
    const existingIds = new Set(tasks.map(t => t.id))
    const validImported = imported.map((item, idx) => ({
      id: existingIds.has(item.id) || !item.id ? `${Date.now()}-${idx}` : item.id,
      title: item.title || 'Tâche sans titre',
      description: item.description || '',
      status: item.status || 'todo',
      priority: item.priority || 'medium',
      category: item.category || 'work',
      tags: Array.isArray(item.tags) ? item.tags : [],
      dueDate: item.dueDate || null,
      createdAt: item.createdAt || new Date().toISOString(),
      completedAt: item.completedAt || null,
      order: tasks.length + idx + 1,
    }))
    saveTasks([...tasks, ...validImported])
    return validImported.length
  }, [tasks, saveTasks])

  const exportJSON = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `taskflow-export-${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }, [tasks])

  const exportCSV = useCallback(() => {
    const headers = ['id', 'title', 'description', 'status', 'priority', 'category', 'dueDate', 'createdAt', 'completedAt']
    const rows = tasks.map(t => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.status,
      t.priority,
      t.category,
      t.dueDate || '',
      t.createdAt || '',
      t.completedAt || '',
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `taskflow-export-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }, [tasks])

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorderTasks,
    importTasks,
    exportJSON,
    exportCSV,
  }
}
