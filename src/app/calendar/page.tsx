'use client'

import React, { useState } from 'react'
import { useTasks } from '@/lib/hooks/use-tasks'
import { Task, TaskPriority } from '@/lib/types'

export default function CalendarPage() {
  const { tasks, toggleTask, addTask } = useTasks()

  // Current viewed month & year
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() // 0-indexed

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Days computation
  // Day of week of 1st day of month: 0=Sun, 1=Mon, ..., 6=Sat
  const firstDayOfMonth = new Date(year, month, 1)
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1 // Monday = 0
  if (startingDayOfWeek === -1) startingDayOfWeek = 6 // Sunday is 6 in European format

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Generate calendar grid cells (42 cells: 6 rows of 7)
  const calendarCells = []

  // Prev month padding
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const prevDateStr = new Date(year, month - 1, d).toISOString().split('T')[0]
    calendarCells.push({
      day: d,
      dateStr: prevDateStr,
      isCurrentMonth: false,
    })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    // Format YYYY-MM-DD
    const mStr = String(month + 1).padStart(2, '0')
    const dStr = String(d).padStart(2, '0')
    const dateStr = `${year}-${mStr}-${dStr}`
    calendarCells.push({
      day: d,
      dateStr,
      isCurrentMonth: true,
    })
  }

  // Next month padding to complete 42 or 35 cells
  const remaining = (7 - (calendarCells.length % 7)) % 7
  for (let d = 1; d <= remaining; d++) {
    const nextDateStr = new Date(year, month + 1, d).toISOString().split('T')[0]
    calendarCells.push({
      day: d,
      dateStr: nextDateStr,
      isCurrentMonth: false,
    })
  }

  const todayStr = new Date().toISOString().split('T')[0]

  // Filter tasks by dateStr
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter((t) => {
      if (t.dueDate === dateStr) return true
      if (t.createdAt && t.createdAt.startsWith(dateStr) && !t.dueDate) return true
      return false
    })
  }

  const selectedDayTasks = selectedDay ? getTasksForDate(selectedDay) : []

  const handleAddDayTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || !selectedDay) return

    addTask({
      title: newTaskTitle.trim(),
      dueDate: selectedDay,
      status: 'todo',
      priority: 'medium',
      category: 'work',
    })
    setNewTaskTitle('')
  }

  const getPriorityDot = (p: TaskPriority) => {
    switch (p) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-blue-500'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600">
            📅 Calendrier Interactif
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visualisez et planifiez vos tâches dans le temps.
          </p>
        </div>

        {/* MONTH CONTROLS */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
            title="Mois précédent"
          >
            ◀
          </button>
          <div className="px-4 py-1 font-bold text-base text-gray-900 dark:text-white min-w-[150px] text-center">
            {monthNames[month]} {year}
          </div>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
            title="Mois suivant"
          >
            ▶
          </button>
          <button
            onClick={goToToday}
            className="ml-2 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-medium text-xs hover:bg-purple-100 transition"
          >
            Aujourd'hui
          </button>
        </div>
      </div>

      {/* CALENDAR & DAY SIDEBAR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* MAIN CALENDAR GRID (3 COLS) */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* DAY NAMES HEADER */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-center py-3">
            {dayNames.map((name) => (
              <div key={name} className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {name}
              </div>
            ))}
          </div>

          {/* CELLS GRID */}
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 dark:divide-gray-700/60">
            {calendarCells.map((cell, index) => {
              const cellTasks = getTasksForDate(cell.dateStr)
              const isToday = cell.dateStr === todayStr
              const isSelected = cell.dateStr === selectedDay

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDay(cell.dateStr)}
                  className={`
                    min-h-[105px] p-2 transition-all cursor-pointer relative flex flex-col justify-between
                    ${cell.isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-900/30 opacity-40'}
                    ${isSelected ? 'ring-2 ring-purple-500 bg-purple-50/20 dark:bg-purple-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`
                        text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center
                        ${isToday ? 'bg-purple-600 text-white font-bold' : 'text-gray-700 dark:text-gray-300'}
                      `}
                    >
                      {cell.day}
                    </span>
                    {cellTasks.length > 0 && (
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                        {cellTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Tasks preview in cell */}
                  <div className="space-y-1 flex-1 overflow-hidden">
                    {cellTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`
                          text-[10px] px-1.5 py-0.5 rounded truncate flex items-center gap-1
                          ${t.status === 'completed' ? 'line-through opacity-50 bg-gray-100 dark:bg-gray-700 text-gray-500' : 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200'}
                        `}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getPriorityDot(t.priority)}`}></span>
                        <span className="truncate">{t.title}</span>
                      </div>
                    ))}
                    {cellTasks.length > 2 && (
                      <div className="text-[9px] text-gray-400 font-medium pl-1">
                        +{cellTasks.length - 2} autre{cellTasks.length - 2 > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* SIDEBAR: SELECTED DAY DETAILS & QUICK ADD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 mb-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>📋</span>
                <span>{selectedDay ? `Tâches du ${selectedDay}` : "Sélectionnez un jour"}</span>
              </h2>
            </div>

            {selectedDay ? (
              <div className="space-y-4">
                {/* Tasks of the selected day */}
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {selectedDayTasks.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic py-4 text-center">
                      Aucune tâche prévue pour ce jour.
                    </p>
                  ) : (
                    selectedDayTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 flex items-start justify-between gap-2"
                      >
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleTask(t.id)}
                            className="mt-0.5 text-xs text-gray-500 hover:text-purple-600"
                          >
                            {t.status === 'completed' ? '✅' : '⚪'}
                          </button>
                          <div className="min-w-0">
                            <p className={`text-xs font-medium leading-snug break-words ${t.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                              {t.title}
                            </p>
                            <span className="text-[10px] text-gray-500 capitalize">
                              {t.priority} • {t.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Quick Add for Selected Day */}
                <form onSubmit={handleAddDayTask} className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Ajouter une tâche le {selectedDay}
                  </label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Titre de la tâche..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded-lg transition"
                  >
                    + Ajouter à cette date
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">
                Cliquez sur n'importe quel jour du calendrier pour consulter ou ajouter des tâches planifiées.
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700/80 mt-6 text-xs text-gray-500">
            <div className="flex justify-between py-1">
              <span>Total tâches planifiées :</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {tasks.filter(t => t.dueDate).length}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Aujourd'hui ({todayStr}) :</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {getTasksForDate(todayStr).length}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
