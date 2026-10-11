import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return NextResponse.json({
    success: true,
    message: `Détails de la tâche ${id}`,
    id,
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const updates = await request.json()
    return NextResponse.json({
      success: true,
      message: `Tâche ${id} mise à jour avec succès`,
      updates,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Données invalides' }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return NextResponse.json({
    success: true,
    message: `Tâche ${id} supprimée avec succès`,
  })
}
