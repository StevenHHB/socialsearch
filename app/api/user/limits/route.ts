import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('remaining_lead_finds, remaining_reply_generations')
      .eq('user_id', userId)
      .single();

    if (userError || !userData) {
      console.error('Supabase error fetching user data:', userError);
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    return NextResponse.json({
      remainingLeadFinds: userData.remaining_lead_finds,
      remainingReplyGenerations: userData.remaining_reply_generations
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching user limits:', error);
    return NextResponse.json({ error: 'Failed to fetch user limits' }, { status: 500 });
  }
}
