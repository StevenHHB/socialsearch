// File: /app/api/subscription/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        console.log('Fetching subscription for user:', userId);

        // First, get the user's numeric ID from the User table
        const { data: user, error: userError } = await supabase
            .from('User')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (userError) {
            console.error('Error fetching user:', userError);
            return NextResponse.json({ error: 'Failed to fetch user', details: userError.message }, { status: 500 });
        }

        if (!user) {
            console.log('User not found:', userId);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Now use the numeric ID to fetch the subscription
        const { data: subscription, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id.toString())
            .order('created_time', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching subscription:', error);
            return NextResponse.json({ error: 'Failed to fetch subscription', details: error.message }, { status: 500 });
        }

        if (!subscription) {
            console.log('No subscription found for user:', userId);
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }

        console.log('Subscription found:', subscription);

        // Use the plan information from the subscription
        return NextResponse.json({
            plan_name: subscription.plan_name,
            plan_interval: subscription.plan_interval,
            status: subscription.status,
            start_date: subscription.start_date,
            end_date: subscription.end_date,
        });
    } catch (error: any) {
        console.error('Unexpected error in subscription route:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}