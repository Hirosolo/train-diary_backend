import { NextResponse } from 'next/server';
import { supabase } from 'lib/supabaseClient';

/** ---------- Type Definitions ---------- **/

interface Food {
  food_id: number;
  name: string;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  serving_type: string;
  image?: string;
}

interface FoodInput {
  food_id: number;
  amount_grams: number;
}

interface FoodDetail {
  meal_detail_id: number;
  amount_grams: number;
  foods: {
    food_id?: number;
    name: string;
    calories_per_serving: number;
    protein_per_serving: number;
    carbs_per_serving: number;
    fat_per_serving: number;
  };
}

interface UserMeal {
  meal_id: number;
  user_id: number;
  meal_type: string;
  log_date: string;
  user_meal_details: FoodDetail[];
}

// Type for Supabase response (foods comes as array from relation)
interface SupabaseFoodResponse {
  food_id: number;
  name: string;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
}

interface SupabaseFoodDetailResponse {
  meal_detail_id: number;
  amount_grams: number;
  foods: SupabaseFoodResponse[];
}

interface SupabaseUserMealResponse {
  meal_id: number;
  user_id: number;
  meal_type: string;
  log_date: string;
  user_meal_details: SupabaseFoodDetailResponse[];
}

interface CreateMealRequest {
  user_id: number;
  meal_type: string;
  log_date: string;
  foods: FoodInput[];
}

interface UpdateMealRequest {
  meal_id: number;
  meal_type?: string;
  log_date?: string;
  foods?: FoodInput[];
}

interface DeleteMealRequest {
  meal_id: number;
}

/** ---------- GET: Fetch all food-logs or specific food ---------- **/

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");
    const mealId = searchParams.get("meal_id");

    const selectQuery = `
      meal_id,
      user_id,
      meal_type,
      log_date,
      user_meal_details(
        meal_detail_id,
        amount_grams,
        foods(
          food_id,
          name,
          calories_per_serving,
          protein_per_serving,
          carbs_per_serving,
          fat_per_serving
        )
      )
    `;

    let query = supabase
      .from("user_meals")
      .select(selectQuery)
      .order("log_date", { ascending: false });

    if (userId) query = query.eq("user_id", userId);
    if (mealId) query = query.eq("meal_id", mealId);

    // Avoid type mismatch issue: use `overrideTypes` (new API) or just let it infer as `any`
    const { data, error } = await query;

    if (error) {
      console.error("Supabase error fetching meals:", error.message);
      return NextResponse.json({ error: "Failed to fetch meals." }, { status: 500 });
    }

    if (!data || !Array.isArray(data)) {
      return NextResponse.json([], { status: 200 });
    }

    const rows: UserMeal[] = (data as SupabaseUserMealResponse[]).map((row) => {
      const details: FoodDetail[] = (row.user_meal_details || []).map((d) => {
        // Supabase returns foods as an array, but we expect a single object
        const food = d.foods && d.foods.length > 0 ? d.foods[0] : null;
        
        return {
          meal_detail_id: d.meal_detail_id,
          amount_grams: d.amount_grams,
          foods: {
            food_id: food?.food_id,
            name: food?.name || "",
            calories_per_serving: food?.calories_per_serving || 0,
            protein_per_serving: food?.protein_per_serving || 0,
            carbs_per_serving: food?.carbs_per_serving || 0,
            fat_per_serving: food?.fat_per_serving || 0,
          },
        };
      });

      return {
        meal_id: row.meal_id,
        user_id: row.user_id,
        meal_type: row.meal_type || "unknown",
        log_date: row.log_date,
        user_meal_details: details,
      };
    });

    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("Unexpected error fetching meals:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred while fetching meals." },
      { status: 500 }
    );
  }
}


/** ---------- POST: Create new meal log ---------- **/

export async function POST(req: Request) {
  try {
    const body: CreateMealRequest = await req.json();
    const { user_id, meal_type, log_date, foods } = body;

    if (!user_id || !meal_type || !log_date || !foods?.length) {
      return NextResponse.json(
        { error: "Missing required fields: user_id, meal_type, log_date, or foods." },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_id", user_id)
      .maybeSingle();

    if (!existingUser)
      return NextResponse.json(
        { error: `User with ID ${user_id} does not exist.` },
        { status: 400 }
      );

    const { data: meal, error: mealErr } = await supabase
      .from("user_meals")
      .insert([{ user_id, meal_type, log_date }])
      .select()
      .single();

    if (mealErr)
      return NextResponse.json({ error: "Failed to create meal log." }, { status: 500 });

    const details = foods.map((f) => ({
      meal_id: meal.meal_id,
      food_id: f.food_id,
      amount_grams: f.amount_grams,
    }));

    const { error: detailsErr } = await supabase.from("user_meal_details").insert(details);
    if (detailsErr)
      return NextResponse.json({ error: "Failed to add food details." }, { status: 500 });

    return NextResponse.json(
      { message: "Food log created successfully.", data: meal },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /food-logs error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred while creating food log." },
      { status: 500 }
    );
  }
}

/** ---------- PUT: Update existing meal log ---------- **/

export async function PUT(req: Request) {
  try {
    const body: UpdateMealRequest = await req.json();
    const { meal_id, meal_type, log_date, foods } = body;

    if (!meal_id)
      return NextResponse.json({ error: "Missing meal_id for update." }, { status: 400 });

    const { data: existingMeal } = await supabase
      .from("user_meals")
      .select("meal_id")
      .eq("meal_id", meal_id)
      .maybeSingle();

    if (!existingMeal)
      return NextResponse.json({ error: "Meal not found." }, { status: 404 });

    const { error: mealErr } = await supabase
      .from("user_meals")
      .update({ meal_type, log_date })
      .eq("meal_id", meal_id);

    if (mealErr)
      return NextResponse.json({ error: "Failed to update meal log." }, { status: 500 });

    if (foods?.length) {
      await supabase.from("user_meal_details").delete().eq("meal_id", meal_id);

      const newDetails = foods.map((f) => ({
        meal_id,
        food_id: f.food_id,
        amount_grams: f.amount_grams,
      }));

      const { error: detailsErr } = await supabase
        .from("user_meal_details")
        .insert(newDetails);

      if (detailsErr)
        return NextResponse.json({ error: "Failed to update food details." }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Food log updated successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /food-logs error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred while updating food log." },
      { status: 500 }
    );
  }
}

/** ---------- DELETE: Delete meal log ---------- **/

export async function DELETE(req: Request) {
  try {
    const body: DeleteMealRequest = await req.json();
    const { meal_id } = body;

    if (!meal_id)
      return NextResponse.json({ error: "Missing meal_id for delete." }, { status: 400 });

    const { data: existingMeal } = await supabase
      .from("user_meals")
      .select("meal_id")
      .eq("meal_id", meal_id)
      .maybeSingle();

    if (!existingMeal)
      return NextResponse.json({ error: "Meal not found." }, { status: 404 });

    await supabase.from("user_meal_details").delete().eq("meal_id", meal_id);
    const { error } = await supabase.from("user_meals").delete().eq("meal_id", meal_id);

    if (error)
      return NextResponse.json({ error: "Failed to delete meal log." }, { status: 500 });

    return NextResponse.json(
      { message: "Food log deleted successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /food-logs error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred while deleting food log." },
      { status: 500 }
    );
  }
}
