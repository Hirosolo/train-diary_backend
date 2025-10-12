import { supabase } from 'lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password_hash } = await req.json()
  const { data, error } = await supabase.from('users').insert({ email, password_hash }).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function GET() {
  const { data, error } = await supabase.from('users').select('user_id, email, created_at')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
