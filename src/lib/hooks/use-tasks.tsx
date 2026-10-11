'use client'

import { useState, useEffect } from 'react'
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
  const saveTasks = (newTasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks))
    setTasks(newTasks)
  }

  const addTask = (task: Task) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    saveTasks([...tasks, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    )
    saveTasks(newTasks)
  }

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter(task => task.id !== id)
    saveTasks(newTasks)
  }

  const toggleTask = (id: string) => {
    const newTasks = tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: task.status === 'completed' ? 'todo' : 'completed',
          completedAt: task.status === 'completed' ? null : new Date().toISOString(),
        }
      }
      return task
    })
    saveTasks(newTasks)
  }

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  }
}
