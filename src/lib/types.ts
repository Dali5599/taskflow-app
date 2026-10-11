/**
 * Task Priority Levels
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

/**
 * Task Status
 */
export type TaskStatus = 'todo' | 'in-progress' | 'completed'

/**
 * Task Category
 */
export type TaskCategory = 'work' | 'personal' | 'shopping' | 'health' | 'finance' | 'other'

/**
 * Task Tag
 */
export type TaskTag = {
  id: string
  name: string
  color: string
}

/**
 * Task Interface
 * Represents a single task in the application
 */
export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  tags: string[] // Tag IDs
  dueDate: string | null // ISO date string
  createdAt: string // ISO date string
  completedAt: string | null // ISO date string
  order: number // For drag & drop ordering
}

/**
 * Category Color Mapping
 */
export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  work: 'bg-blue-500',
  personal: 'bg-purple-500',
  shopping: 'bg-green-500',
  health: 'bg-red-500',
  finance: 'bg-yellow-500',
  other: 'bg-gray-500',
}

/**
 * Priority Color Mapping
 */
export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-gray-400',
  medium: 'bg-blue-400',
  high: 'bg-orange-400',
  urgent: 'bg-red-500',
}

/**
 * Theme Mode
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Keyboard Shortcut Action
 */
export type KeyboardShortcutAction =
  | 'create-task'
  | 'toggle-dark-mode'
  | 'focus-search'
  | 'delete-focused'
  | 'mark-complete'

/**
 * Keyboard Shortcut
 */
export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: KeyboardShortcutAction
  description: string
}
