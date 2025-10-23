import { NextResponse } from 'next/server';
import { supabase } from 'lib/supabaseClient';

/**
 * Workout Sessions API
 * Handles: GET (list/fetch), POST (create), PUT (mark complete), DELETE (delete)
 * Also supports nested operations: add exercises, log workouts, delete details/logs.
 */

// ==================== GET ====================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const session_id = searchParams.get('session_id');

    if (!user_id && !session_id) {
      return NextResponse.json(
        { error: 'user_id or session_id required.' },
        { status: 400 }
      );
    }

    // Fetch all sessions for a user
    if (user_id) {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user_id)
        .order('scheduled_date', { ascending: false });

      if (error)
        return NextResponse.json({ error: 'Failed to fetch sessions.' }, { status: 500 });

      return NextResponse.json(data, { status: 200 });
    }

    // Fetch full session details
    if (session_id) {
      const { data, error } = await supabase
        .from('session_details')
        .select(`
          session_detail_id,
          exercise_id,
          planned_sets,
          planned_reps,
          exercises(name, category, description)
        `)
        .eq('session_id', session_id);

      if (error)
        return NextResponse.json({ error: 'Failed to fetch session details.' }, { status: 500 });

      return NextResponse.json(data, { status: 200 });
    }
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error occurred while fetching sessions.' },
      { status: 500 }
    );
  }
}

// ==================== POST ====================
// Create a workout session or log exercises
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, scheduled_date, type, notes, session_id, exercises, session_detail_id, log } = body;

    // Create new workout session
    if (user_id && scheduled_date && !session_id) {
      const { data: user } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', user_id)
        .maybeSingle();

      if (!user)
        return NextResponse.json({ error: 'Invalid user_id.' }, { status: 400 });

      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([{ user_id, scheduled_date, type, notes }])
        .select()
        .single();

      if (error)
        return NextResponse.json({ error: 'Failed to create session.' }, { status: 500 });

      return NextResponse.json(
        { session_id: data.session_id, message: 'Session created successfully.' },
        { status: 201 }
      );
    }

    // Add exercises to session
    if (session_id && Array.isArray(exercises)) {
      for (const ex of exercises) {
        if (!ex.exercise_id)
          return NextResponse.json({ error: 'exercise_id missing.' }, { status: 400 });

        const { error } = await supabase
          .from('session_details')
          .insert([
            {
              session_id,
              exercise_id: ex.exercise_id,
              planned_sets: ex.planned_sets,
              planned_reps: ex.planned_reps,
            },
          ]);

        if (error)
          return NextResponse.json(
            { error: 'Failed to add exercises to session.' },
            { status: 500 }
          );
      }

      return NextResponse.json(
        { message: 'Exercises added to session successfully.' },
        { status: 201 }
      );
    }

    // Log actual workout (exercise_logs)
    if (log && session_detail_id) {
      const { actual_sets, actual_reps, weight_kg, duration_seconds, notes } = log;

      if (actual_sets == null || actual_reps == null)
        return NextResponse.json(
          { error: 'actual_sets and actual_reps required.' },
          { status: 400 }
        );

      // Validate FK
      const { data: detail } = await supabase
        .from('session_details')
        .select('session_detail_id')
        .eq('session_detail_id', session_detail_id)
        .maybeSingle();

      if (!detail)
        return NextResponse.json({ error: 'Invalid session_detail_id.' }, { status: 400 });

      const { error } = await supabase.from('exercise_logs').insert([
        {
          session_detail_id,
          actual_sets,
          actual_reps,
          weight_kg,
          duration_seconds,
          notes,
        },
      ]);

      if (error)
        return NextResponse.json({ error: 'Failed to log workout.' }, { status: 500 });

      return NextResponse.json({ message: 'Workout logged successfully.' }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid POST payload.' }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error occurred while processing session POST.' },
      { status: 500 }
    );
  }
}

// ==================== PUT ====================
// Mark session as completed
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { session_id } = body;

    if (!session_id)
      return NextResponse.json({ error: 'session_id required.' }, { status: 400 });

    // Get session details
    const { data: details } = await supabase
      .from('session_details')
      .select('session_detail_id')
      .eq('session_id', session_id);

    if (!details || details.length === 0)
      return NextResponse.json({ error: 'No exercises in this session.' }, { status: 400 });

    // Ensure each detail has logs
    for (const d of details) {
      const { data: logs } = await supabase
        .from('exercise_logs')
        .select('log_id')
        .eq('session_detail_id', d.session_detail_id)
        .limit(1);

      if (!logs || logs.length === 0)
        return NextResponse.json(
          { error: 'All exercises must have at least one log before completion.' },
          { status: 400 }
        );
    }

    const { error } = await supabase
      .from('workout_sessions')
      .update({ completed: true })
      .eq('session_id', session_id);

    if (error)
      return NextResponse.json(
        { error: 'Failed to mark session as completed.' },
        { status: 500 }
      );

    return NextResponse.json(
      { message: 'Session marked as completed successfully.' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error occurred while updating session.' },
      { status: 500 }
    );
  }
}

// ==================== DELETE ====================
// Delete session, session detail, or log
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { session_id, session_detail_id, log_id } = body;

    // Delete entire session
    if (session_id) {
      // delete logs via join (manual)
      const { data: details } = await supabase
        .from('session_details')
        .select('session_detail_id')
        .eq('session_id', session_id);

      if (details?.length) {
        for (const d of details) {
          await supabase.from('exercise_logs').delete().eq('session_detail_id', d.session_detail_id);
        }
        await supabase.from('session_details').delete().eq('session_id', session_id);
      }

      const { error } = await supabase.from('workout_sessions').delete().eq('session_id', session_id);
      if (error)
        return NextResponse.json({ error: 'Failed to delete session.' }, { status: 500 });

      return NextResponse.json({ message: 'Session deleted successfully.' }, { status: 200 });
    }

    // Delete specific session detail
    if (session_detail_id) {
      await supabase.from('exercise_logs').delete().eq('session_detail_id', session_detail_id);
      const { error } = await supabase
        .from('session_details')
        .delete()
        .eq('session_detail_id', session_detail_id);

      if (error)
        return NextResponse.json(
          { error: 'Failed to delete exercise from session.' },
          { status: 500 }
        );

      return NextResponse.json(
        { message: 'Exercise deleted from session successfully.' },
        { status: 200 }
      );
    }

    // Delete specific log
    if (log_id) {
      const { error } = await supabase.from('exercise_logs').delete().eq('log_id', log_id);
      if (error)
        return NextResponse.json({ error: 'Failed to delete log.' }, { status: 500 });

      return NextResponse.json({ message: 'Log deleted successfully.' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid delete parameters.' }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error occurred while deleting data.' },
      { status: 500 }
    );
  }
}
