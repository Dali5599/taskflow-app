import { NextResponse } from 'next/server'
import { Task } from '@/lib/types'

// In-memory store for server route handler (fallback if no external DB connected)
let memoryTasks: Task[] = [
  {
    id: 'api-1',
    title: 'Explorer l\'API REST TaskFlow',
    description: 'Endpoint REST Next.js 15 opérationnel (GET /api/tasks, POST /api/tasks)',
    status: 'completed',
    priority: 'high',
    category: 'work',
    tags: ['api', 'rest'],
    dueDate: null,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    order: 1,
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    count: memoryTasks.length,
    data: memoryTasks,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Titre requis' }, { status: 400 })
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || '',
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      category: body.category || 'work',
      tags: body.tags || [],
      dueDate: body.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      order: memoryTasks.length + 1,
    }

    memoryTasks.push(newTask)
    return NextResponse.json({ success: true, data: newTask }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Payload JSON invalide' }, { status: 400 })
  }
}
