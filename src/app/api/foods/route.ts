import { NextResponse } from 'next/server'
import { supabase } from 'lib/supabaseClient'

/**
 * @swagger
 * /api/foods:
 *   get:
 *     summary: Get all foods
 *     description: Retrieve all food items from the database, ordered by name.
 *     tags:
 *       - Foods
 *     responses:
 *       200:
 *         description: Successfully retrieved list of foods.
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               food_id:
 *                 type: string
 *                 example: "1"
 *               name:
 *                 type: string
 *                 example: "Grilled Chicken Breast"
 *               calories_per_serving:
 *                 type: number
 *                 example: 165
 *               protein_per_serving:
 *                 type: number
 *                 example: 31
 *               carbs_per_serving:
 *                 type: number
 *                 example: 0
 *               fat_per_serving:
 *                 type: number
 *                 example: 3.6
 *               serving_type:
 *                 type: string
 *                 example: "100g"
 *               image:
 *                 type: string
 *                 example: "https://example.com/images/chicken.jpg"
 *       500:
 *         description: Failed to fetch foods.
 *
 *   post:
 *     summary: Add a new food
 *     description: Create a new food record in the database.
 *     tags:
 *       - Foods
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Food data to add.
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - serving_type
 *           properties:
 *             name:
 *               type: string
 *               example: "Oatmeal"
 *             calories_per_serving:
 *               type: number
 *               example: 68
 *             protein_per_serving:
 *               type: number
 *               example: 2.4
 *             carbs_per_serving:
 *               type: number
 *               example: 12
 *             fat_per_serving:
 *               type: number
 *               example: 1.4
 *             serving_type:
 *               type: string
 *               example: "100g"
 *             image:
 *               type: string
 *               example: "https://example.com/images/oatmeal.jpg"
 *     responses:
 *       201:
 *         description: Food successfully added.
 *         schema:
 *           type: object
 *           properties:
 *             food_id:
 *               type: string
 *               example: "2"
 *             message:
 *               type: string
 *               example: "Food added."
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Failed to add food.
 */


// GET all foods
export async function GET() {
  const { data, error } = await supabase
    .from('foods')
    .select('food_id, name, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, serving_type, image')
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ message: 'Failed to fetch foods', error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
}

// POST add new food
export async function POST(req: Request) {
  const { name, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, serving_type, image } = await req.json()

  if (!name || !serving_type) {
    return NextResponse.json({ message: 'Name and serving_type are required.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('foods')
    .insert([{ name, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, serving_type, image }])
    .select('food_id')
    .single()

  if (error) {
    return NextResponse.json({ message: 'Failed to add food.', error: error.message }, { status: 500 })
  }

  return NextResponse.json({ food_id: data.food_id, message: 'Food added.' }, { status: 201 })
}
