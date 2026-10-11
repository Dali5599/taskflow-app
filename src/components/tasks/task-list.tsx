'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Task, TaskPriority, TaskCategory } from '@/lib/types'
import { TaskItem } from './task-item'
import { Button } from '@/components/ui/button'

interface TaskListProps {
  tasks: Task[]
  onCreateTask: (task: {
    title: string
    description?: string
    priority?: TaskPriority
    category?: TaskCategory
    dueDate?: string | null
  }) => void
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onReorderTasks?: (tasks: Task[]) => void
  onExportJSON?: () => void
  onExportCSV?: () => void
  onImportTasks?: (tasks: Task[]) => void
}

export function TaskList({
  tasks,
  onCreateTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onReorderTasks,
  onExportJSON,
  onExportCSV,
  onImportTasks,
}: TaskListProps) {
  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)

  // Drag & drop state
  const [draggedId, setDraggedId] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState<{
    title: string
    description: string
    priority: TaskPriority
    category: TaskCategory
    dueDate: string
  }>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'work',
    dueDate: '',
  })

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Keyboard Shortcuts (Phase 2)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        return
      }

      if (e.key === 'Escape') {
        setIsModalOpen(false)
        setIsShortcutsOpen(false)
        return
      }

      if (!isInput) {
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault()
          setIsModalOpen(true)
        } else if (e.key === '?') {
          e.preventDefault()
          setIsShortcutsOpen(prev => !prev)
        } else if (e.key === '/') {
          e.preventDefault()
          searchInputRef.current?.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filtered Tasks Computation (Phase 2 - Recherche avancée)
  const filteredTasks = tasks.filter((task) => {
    // Status Filter
    if (statusFilter === 'active' && task.status === 'completed') return false
    if (statusFilter === 'completed' && task.status !== 'completed') return false

    // Category Filter
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false

    // Priority Filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const titleMatch = task.title?.toLowerCase().includes(q)
      const descMatch = task.description?.toLowerCase().includes(q)
      const catMatch = task.category?.toLowerCase().includes(q)
      const tagsMatch = task.tags?.some(t => t.toLowerCase().includes(q))
      if (!titleMatch && !descMatch && !catMatch && !tagsMatch) return false
    }

    return true
  })

  // Drag and Drop reordering (Phase 2)
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedId(id)
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId || !onReorderTasks) return

    const sourceIndex = tasks.findIndex(t => t.id === draggedId)
    const targetIndex = tasks.findIndex(t => t.id === targetId)

    if (sourceIndex === -1 || targetIndex === -1) return

    const newTasks = [...tasks]
    const [moved] = newTasks.splice(sourceIndex, 1)
    newTasks.splice(targetIndex, 0, moved)

    onReorderTasks(newTasks)
    setDraggedId(null)
  }

  // Handle Form Submit
  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    onCreateTask({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate ? formData.dueDate : null,
    })

    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'work',
      dueDate: '',
    })
    setIsModalOpen(false)
  }

  // Handle Import (Phase 2 - Import JSON / CSV)
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onImportTasks) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content)
          if (Array.isArray(parsed)) {
            onImportTasks(parsed)
            alert(`✅ ${parsed.length} tâches importées avec succès !`)
          }
        } else if (file.name.endsWith('.csv')) {
          // CSV Parser
          const lines = content.split('\n').filter(l => l.trim().length > 0)
          if (lines.length > 1) {
            const importedList: Task[] = []
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(',')
              if (cols.length >= 2) {
                importedList.push({
                  id: cols[0]?.trim() || `${Date.now()}-${i}`,
                  title: (cols[1] || 'Tâche importée').replace(/^"|"$/g, '').trim(),
                  description: (cols[2] || '').replace(/^"|"$/g, '').trim(),
                  status: (cols[3]?.trim() as any) || 'todo',
                  priority: (cols[4]?.trim() as any) || 'medium',
                  category: (cols[5]?.trim() as any) || 'work',
                  tags: [],
                  dueDate: cols[6]?.trim() || null,
                  createdAt: cols[7]?.trim() || new Date().toISOString(),
                  completedAt: cols[8]?.trim() || null,
                  order: i,
                })
              }
            }
            onImportTasks(importedList)
            alert(`✅ ${importedList.length} tâches importées depuis le fichier CSV !`)
          }
        }
      } catch (err) {
        alert('❌ Erreur lors du parsing du fichier importé.')
      }
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  // Stats
  const totalCount = tasks.length
  const activeCount = tasks.filter(t => t.status !== 'completed').length
  const completedCount = tasks.filter(t => t.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{totalCount}</div>
          <div className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mt-1">Total des Tâches</div>
        </div>
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{activeCount}</div>
          <div className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mt-1">En Cours</div>
        </div>
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{completedCount}</div>
          <div className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mt-1">Complétées</div>
        </div>
      </div>

      {/* SEARCH & ACTION TOOLBAR (PHASE 2) */}
      <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              🔍
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une tâche... (Ctrl+K ou /)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons: Import, Export, Shortcuts, Add */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Shortcuts button */}
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm transition"
              title="Raccourcis clavier (?)"
            >
              ⌨️
            </button>

            {/* Export JSON */}
            {onExportJSON && (
              <button
                onClick={onExportJSON}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-medium transition flex items-center gap-1.5"
                title="Exporter les tâches au format JSON"
              >
                📥 Export JSON
              </button>
            )}

            {/* Export CSV */}
            {onExportCSV && (
              <button
                onClick={onExportCSV}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-medium transition flex items-center gap-1.5"
                title="Exporter les tâches au format CSV"
              >
                📊 Export CSV
              </button>
            )}

            {/* Import Button */}
            {onImportTasks && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-medium transition flex items-center gap-1.5"
                  title="Importer un fichier JSON ou CSV"
                >
                  📤 Importer
                </button>
              </>
            )}

            {/* Nouvelle Tâche */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium text-sm hover:shadow-lg transition shadow-purple-500/20 flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Nouvelle Tâche</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] bg-white/20 rounded font-mono">N</kbd>
            </button>
          </div>
        </div>

        {/* ADVANCED FILTERS (STATUS, CATEGORY, PRIORITY) */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700/80 text-xs">
          {/* Status filter buttons */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 p-0.5 bg-gray-50 dark:bg-gray-700/40">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === 'all' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Toutes ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === 'active' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              En cours ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === 'completed' ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Complétées ({completedCount})
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Catégorie :</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2.5 py-1.5 text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              <option value="all">Toutes</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Priority Dropdown Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Priorité :</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2.5 py-1.5 text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              <option value="all">Toutes</option>
              <option value="urgent">Urgente 🔥</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>
          </div>

          {(searchQuery || categoryFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setCategoryFilter('all')
                setPriorityFilter('all')
                setStatusFilter('all')
              }}
              className="text-purple-600 dark:text-purple-400 hover:underline ml-auto"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* TASKS LIST WITH DRAG & DROP (PHASE 2) */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Aucune tâche trouvée</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Modifiez vos critères de recherche ou créez une nouvelle tâche.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
            >
              + Créer une tâche
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onUpdate={onUpdateTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))
        )}
      </div>

      {/* MODAL CRÉATION DE TÂCHE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 mb-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>✨</span>
                <span>Nouvelle Tâche</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1.5">
                  Titre de la tâche *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ex: Implémenter l'authentification OAuth"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Détails, spécifications ou critères d'acceptation..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1.5">
                    Priorité
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="urgent">Urgente 🔥</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1.5">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="shopping">Shopping</option>
                    <option value="health">Health</option>
                    <option value="finance">Finance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1.5">
                    Échéance
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg transition shadow-purple-500/20"
                >
                  Créer la tâche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RACCOURCIS CLAVIER (PHASE 2) */}
      {isShortcutsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>⌨️</span>
                <span>Raccourcis Clavier</span>
              </h3>
              <button
                onClick={() => setIsShortcutsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/60">
                <span className="text-gray-600 dark:text-gray-300">Recherche rapide</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono font-semibold">Ctrl + K ou /</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/60">
                <span className="text-gray-600 dark:text-gray-300">Nouvelle tâche</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono font-semibold">N</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/60">
                <span className="text-gray-600 dark:text-gray-300">Fermer la fenêtre / modal</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono font-semibold">Échap (Esc)</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/60">
                <span className="text-gray-600 dark:text-gray-300">Afficher cette aide</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono font-semibold">?</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-600 dark:text-gray-300">Glisser-déposer (Drag & Drop)</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Clic & Déplacement ⠿</span>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setIsShortcutsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
