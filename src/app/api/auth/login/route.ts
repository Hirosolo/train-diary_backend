import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password required.' }, { status: 400 })
  }

  // Get user from Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('id, username, email, password_hash')
    .eq('email', email)
    .single()

  if (error || !user) {
    return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 })
  }

  // Check password
  const match = await bcrypt.compare(password, user.password_hash)
  if (!match) {
    return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 })
  }

  // Create JWT token
  const token = jwt.sign(
    { user_id: user.id, username: user.username, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  return NextResponse.json({
    token,
    user: { user_id: user.id, username: user.username, email }
  })
}
