import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from 'lib/supabaseClient'

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     description: Create a new user account
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: body
 *         name: user
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - email
 *             - password
 *           properties:
 *             username:
 *               type: string
 *               example: "john_doe"
 *             email:
 *               type: string
 *               format: email
 *               example: "johndoe@gmail.com"
 *             password:
 *               type: string
 *               format: password
 *               example: "t123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully."
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are required."
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already in use."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration failed."
 *                 error:
 *                   type: string
 */

export async function POST(req: Request) {
  const { username, email, password } = await req.json()

  if (!username || !email || !password) {
    return NextResponse.json({ message: 'All fields are required.' }, { status: 400 })
  }

  // Check if email exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
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
