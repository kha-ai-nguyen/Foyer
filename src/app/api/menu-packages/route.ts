import { NextRequest, NextResponse } from 'next/server'
import { createMenuPackage, getMenuPackagesBySpace } from '@/lib/supabase/queries'

export async function GET(req: NextRequest) {
  const spaceId = req.nextUrl.searchParams.get('space_id')
  if (!spaceId) {
    return NextResponse.json({ error: 'space_id required' }, { status: 400 })
  }

  try {
    const packages = await getMenuPackagesBySpace(spaceId)
    return NextResponse.json(packages)
  } catch (err) {
    console.error('get menu packages error:', err)
    return NextResponse.json({ error: 'Failed to get menu packages' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: {
    space_id?: string
    name?: string
    description?: string | null
    price_per_head?: number | null
    file_url?: string | null
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!body.space_id || !body.name) {
    return NextResponse.json({ error: 'space_id and name required' }, { status: 400 })
  }

  try {
    const pkg = await createMenuPackage({
      space_id: body.space_id,
      name: body.name,
      description: body.description ?? null,
      price_per_head: body.price_per_head ?? null,
      file_url: body.file_url ?? null,
    })
    return NextResponse.json(pkg)
  } catch (err) {
    console.error('create menu package error:', err)
    return NextResponse.json({ error: 'Failed to create menu package' }, { status: 500 })
  }
}
