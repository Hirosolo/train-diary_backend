import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from 'lib/supabaseClient'

const JWT_SECRET = process.env.JWT_SECRET || '123123'

export async function OPTIONS() {
 
  
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Access-Control-Allow-Credentials',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    
    const message = "Email and password required."
    return NextResponse.json({ message }, { status: 400 })
  }

  // Get user from Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    const message = "User not found. "
    return NextResponse.json({ message }, { status: 401 })
  }
 
  // Check password
  const match = await bcrypt.compare(password, user.password_hash)
  if (!match) {
    const message = 'Wrong password.'
    return NextResponse.json({ message }, { status: 401 })
  }

  // Create JWT token
  const token = jwt.sign(
    { user_id: user.user_id, username: user.username, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  const response = NextResponse.json({
    token,
    user: { user_id: user.user_id, username: user.username, email }
  })

  
  
  return response
}
