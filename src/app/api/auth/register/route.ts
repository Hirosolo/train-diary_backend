import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from 'lib/supabaseClient'

export async function POST(req: Request) {
  const { username, email, password } = await req.json()

  if (!username || !email || !password) {
    return NextResponse.json({ message: 'All fields are required.' }, { status: 400 })
  }

  // Check if email exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    return NextResponse.json({ message: 'Email already in use.' }, { status: 409 })
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, 10)

  // Insert new user
  const { error: insertError } = await supabase
    .from('users')
    .insert({ username, email, password_hash })

  if (insertError) {
    return NextResponse.json(
      { message: 'Registration failed.', error: insertError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 })
}
