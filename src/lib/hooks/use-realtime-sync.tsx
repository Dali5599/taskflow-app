'use client'

import { useEffect } from 'react'
import { Task } from '@/lib/types'

/**
 * Hook de synchronisation en temps réel multi-onglets / multi-fenêtres
 * Utilise l'API Web BroadcastChannel et les événements Storage.
 */
export function useRealtimeSync(onSync: (tasks: Task[]) => void) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // BroadcastChannel pour communication inter-onglets ultra-rapide
    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel('taskflow_sync_channel')
      channel.onmessage = (event) => {
        if (event.data?.type === 'TASKS_UPDATED' && Array.isArray(event.data.tasks)) {
          onSync(event.data.tasks)
        }
      }
    } catch (e) {
      // BroadcastChannel non supporté sur anciens navigateurs
    }

    // Écouteur de stockage pour synchronisation inter-fenêtres
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tasks' && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue)
          if (Array.isArray(updated)) {
            onSync(updated)
          }
        } catch (err) {
          // Ignore
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      channel?.close()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [onSync])

  const broadcastTasks = (tasks: Task[]) => {
    if (typeof window === 'undefined') return
    try {
      const channel = new BroadcastChannel('taskflow_sync_channel')
      channel.postMessage({ type: 'TASKS_UPDATED', tasks })
      channel.close()
    } catch (e) {
      // Ignore
    }
  }

  return { broadcastTasks }
}
