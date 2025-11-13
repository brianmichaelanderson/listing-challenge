import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

/**
 * GET /api/progress
 *
 * Fetch listing progress for the authenticated user
 * (Already implemented as reference)
 */
export async function GET(request) {
  try {
    // Get token from Authorization header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    // Verify token and get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Fetch progress
    const { data: progress, error: dbError } = await supabase
      .from('listing_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (dbError) {
      console.error('[DB Error]:', dbError);
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      progress: progress || null,
    });
  } catch (error) {
    console.error('[Server Error]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/progress
 *
 * Update listing progress for the authenticated user
 *
 * TODO: IMPLEMENT THIS ENDPOINT
 *
 * Expected Request Body:
 * {
 *   "currentStep": "step-2",
 *   "progressData": {
 *     "completedSteps": ["step-1", "step-2"],
 *     "step2": {
 *       "confirmedSqft": 2500,
 *       "confirmedBedrooms": 3,
 *       "confirmedBathrooms": 2
 *     }
 *   }
 * }
 *
 * Requirements:
 * 1. Extract and verify Bearer token (same as GET above)
 * 2. Get userId from verified token (NOT from request body)
 * 3. Validate request body (currentStep and progressData required)
 * 4. Update listing_progress table with new data
 * 5. Return updated progress object
 *
 * Security Checklist:
 * - [ ] Verify authentication token
 * - [ ] Use userId from token, not request
 * - [ ] Validate request body format
 * - [ ] Handle errors gracefully
 */
export async function PUT(request) {
  // TODO: Implement this endpoint
  // Follow the security pattern from GET above
  // See /api/listing/properties/route.js for reference
  try {
    //STEP 1: Get token
    const token = request.headers.get('authorization')?.replace('Bearer ', ''); // dieu's note: wonder if this works

    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    //STEP 2: Verify token & get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('[Auth Error]:', authError?.message || 'No user found');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    //STEP 3: User obtained & db verified user.id
    const userId = user.id;
    console.log(`[API]' Fetching progress for user: ${userId}`); // dieu

    //STEP 4: Parse new progress data from request body
    const { currentStep, progressData } = await request.json();

    //STEP 4.5: Validate request body
    if(!currentStep || !progressData) {
      return NextResponse.json(
        { error: 'Missing required fields: currentStep and progressData' },
        { status: 400 }
      );
    }

    if(typeof currentStep !== 'string' || typeof progressData !== 'object') {
      return NextResponse.json(
        { error: 'Invalid data types: currentStep must be a string and progressData must be an object' },
        { status: 400 }
      )
    }

    //STEP 5: Fetch existing progress data from DB
    const { data: existingProgress } = await supabase
      .from('listing_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    //STEP 6: Merge previous w/ new data. Safer for production to merge here vs in DB
    //sending entire entity
    const updatedProgressData = {
      ...existingProgress?.progress_data,
      ...progressData,
    };

    //STEP 7: Update DB w/ updated/merged progress data & return it
    const { data: updatedProgress } = await supabase
      .from('listing_progress')
      .update({
        current_step: currentStep,
        progress_data: updatedProgressData,
      })
      .eq('user_id', userId)
      .select()
      .single();

    return NextResponse.json({
      success: true,
      progress: updatedProgress
    })

  } catch (error) {
    console.error('[Server Error]:', error)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
