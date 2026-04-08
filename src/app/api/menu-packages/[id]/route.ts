import { NextRequest, NextResponse } from 'next/server'
import { updateMenuPackage, deleteMenuPackage } from '@/lib/supabase/queries'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  let body: Record<string, unknown>

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  try {
    const pkg = await updateMenuPackage(id, body)
    return NextResponse.json(pkg)
  } catch (err) {
    console.error('update menu package error:', err)
    return NextResponse.json({ error: 'Failed to update menu package' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await deleteMenuPackage(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('delete menu package error:', err)
    return NextResponse.json({ error: 'Failed to delete menu package' }, { status: 500 })
  }
}
