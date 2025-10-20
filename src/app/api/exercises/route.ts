import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Get all exercises
 *     description: Retrieve all exercises from the database.
 *     tags:
 *       - Exercises
 *     responses:
 *       200:
 *         description: Successfully retrieved list of exercises.
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               exercise_id:
 *                 type: string
 *                 example: "1"
 *               name:
 *                 type: string
 *                 example: "Bench Press"
 *               category:
 *                 type: string
 *                 example: "Chest"
 *               default_sets:
 *                 type: integer
 *                 example: 3
 *               default_reps:
 *                 type: integer
 *                 example: 10
 *               description:
 *                 type: string
 *                 example: "A compound exercise targeting the chest and triceps."
 *       500:
 *         description: Failed to fetch exercises.
 *
 *   post:
 *     summary: Add a new exercise
 *     description: Create a new exercise record in the database.
 *     tags:
 *       - Exercises
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Exercise data to add.
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *           properties:
 *             name:
 *               type: string
 *               example: "Squat"
 *             category:
 *               type: string
 *               example: "Legs"
 *             default_sets:
 *               type: integer
 *               example: 4
 *             default_reps:
 *               type: integer
 *               example: 12
 *             description:
 *               type: string
 *               example: "A compound lower body exercise targeting the quads and glutes."
 *     responses:
 *       201:
 *         description: Exercise successfully added.
 *         schema:
 *           type: object
 *           properties:
 *             exercise_id:
 *               type: string
 *               example: "2"
 *             message:
 *               type: string
 *               example: "Exercise added."
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Failed to add exercise.
 *
 *   delete:
 *     summary: Delete an exercise
 *     description: Remove an exercise by ID from the database.
 *     tags:
 *       - Exercises
 *     parameters:
 *       - in: body
 *         name: exercise_id
 *         description: ID of the exercise to delete.
 *         required: true
 *         type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Exercise successfully deleted.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Exercise deleted."
 *       400:
 *         description: Missing or invalid exercise ID.
 *       500:
 *         description: Failed to delete exercise.
 */

// get all exercises
export async function GET() {
  const { data, error } = await supabase.from('exercises').select('*')

  if (error) {
    return NextResponse.json(
      { message: 'Failed to fetch exercises.', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 200 })
}

// add exercise
export async function POST(req: Request) {
  const { name, category, default_sets, default_reps, description } = await req.json()

  if (!name) {
    return NextResponse.json({ message: 'Exercise name is required.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('exercises')
    .insert([
      {
        name,
        category: category || null,
        default_sets: default_sets || null,
        default_reps: default_reps || null,
        description: description || null,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { message: 'Failed to add exercise.', error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ exercise_id: data.exercise_id, message: 'Exercise added.' }, { status: 201 })
}

// remove exercise by id
export async function DELETE(req: Request) {
  const exercise_id = await req.json();
  if (!exercise_id) {
    return NextResponse.json({ message: 'Exercise ID is required.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('exercises')
    .delete()
    .eq('exercise_id', exercise_id)
  if (error) {
    return NextResponse.json(
      { message: 'Failed to delete exercise.', error: error.message },
      { status: 500 }
    )
  }
  return NextResponse.json({ message: 'Exercise deleted.' }, { status: 200 })
}