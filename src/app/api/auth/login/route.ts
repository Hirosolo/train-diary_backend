import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from 'lib/supabaseClient'

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return a JWT token.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: body
 *         name: credentials
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: "testuser@gmail.com"
 *             password:
 *               type: string
 *               format: password
 *               example: "t123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "123"
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *                     email:
 *                       type: string
 *                       example: "testuser@gmail.com"
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials or user not found
 */

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
    { user_id: user.id, username: user.username, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  return NextResponse.json({
    token,
    user: { user_id: user.id, username: user.username, email }
  })
}
