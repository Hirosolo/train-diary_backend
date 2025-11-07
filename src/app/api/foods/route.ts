import { NextResponse } from 'next/server';
import { supabase } from 'lib/supabaseClient';

/** ---------- Type Definitions ---------- **/

export interface Food {
  food_id: number;
  name: string;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  serving_type: string;
  image?: string | null;
}

export interface CreateFoodRequest {
  name: string;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  serving_type: string;
  image?: string;
}

export interface UpdateFoodRequest {
  food_id: number;
  name?: string;
  calories_per_serving?: number;
  protein_per_serving?: number;
  carbs_per_serving?: number;
  fat_per_serving?: number;
  serving_type?: string;
  image?: string;
}

export interface DeleteFoodRequest {
  food_id: number;
}


// fetch all foods or one by ?food_id
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const foodId = searchParams.get('food_id');

    let query = supabase.from('foods').select('*');
    if (foodId) query = query.eq('food_id', foodId);

    const { data, error } = await query
      .order('name', { ascending: true })
      .returns<Food[]>();

    if (error)
      return NextResponse.json({ error: 'Failed to fetch foods.' }, { status: 500 });

    if (foodId && (!data || data.length === 0))
      return NextResponse.json({ error: 'Food not found.' }, { status: 404 });

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error occurred while fetching foods.' },
      { status: 500 }
    );
  }
}

// create a new food
export async function POST(req: Request) {
  try {
    const body: CreateFoodRequest = await req.json();
    const {
      name,
      calories_per_serving,
      protein_per_serving,
      carbs_per_serving,
      fat_per_serving,
      serving_type,
      image,
    } = body;

    if (!name || !serving_type) {
      return NextResponse.json(
        { error: 'Missing required fields: name or serving_type.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('foods')
      .insert([
        {
          name,
          calories_per_serving,
          protein_per_serving,
          carbs_per_serving,
          fat_per_serving,
          serving_type,
          image,
        },
      ])
      .select()
      .returns<Food[]>();

    if (error)
      return NextResponse.json({ error: 'Failed to add food.' }, { status: 500 });

    const food = data?.[0];
    return NextResponse.json(
      {
        food_id: food.food_id,
        message: 'Food added successfully.',
        data: food,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error occurred while adding food.' },
      { status: 500 }
    );
  }
}

// PUT: update existing food
export async function PUT(req: Request) {
  try {
    const body: UpdateFoodRequest = await req.json();
    const { food_id, ...updates } = body;

    if (!food_id)
      return NextResponse.json(
        { error: 'Missing food_id for update.' },
        { status: 400 }
      );

    const { data, error } = await supabase
      .from('foods')
      .update(updates)
      .eq('food_id', food_id)
      .select()
      .returns<Food[]>();

    if (error)
      return NextResponse.json({ error: 'Failed to update food.' }, { status: 500 });

    if (!data || data.length === 0)
      return NextResponse.json({ error: 'Food not found.' }, { status: 404 });

    return NextResponse.json(
      {
        message: 'Food updated successfully.',
        data: data[0],
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error occurred while updating food.' },
      { status: 500 }
    );
  }
}

// DELETE: remove a food
export async function DELETE(req: Request) {
  try {
    const body: DeleteFoodRequest = await req.json();
    const { food_id } = body;

    if (!food_id)
      return NextResponse.json(
        { error: 'Missing food_id for delete.' },
        { status: 400 }
      );

    const { data: existing } = await supabase
      .from('foods')
      .select('food_id')
      .eq('food_id', food_id)
      .maybeSingle();

    if (!existing)
      return NextResponse.json({ error: 'Food not found.' }, { status: 404 });

    const { error } = await supabase.from('foods').delete().eq('food_id', food_id);

    if (error)
      return NextResponse.json({ error: 'Failed to delete food.' }, { status: 500 });

    return NextResponse.json(
      { message: 'Food deleted successfully.' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error occurred while deleting food.' },
      { status: 500 }
    );
  }
}
