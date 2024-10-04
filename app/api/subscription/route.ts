// File: /app/api/subscription/route.ts

import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest
import { getAuth } from '@clerk/nextjs/server'; // Import Clerk for authentication
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
    const { userId } = getAuth(request); // Get userId from Clerk

    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
        { cookies: {} }
    );

    // Fetch the user's subscription
    const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('status, start_date, remaining_lead_finds, remaining_reply_generations')
        .eq('user_id', userId)
        .single();

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }

    if (!subscription) {
        return NextResponse.json({ status: 'inactive', remaining_lead_finds: 0, remaining_reply_generations: 0 });
    }

    // Calculate next renewal date
    const startDate = new Date(subscription.start_date);
    const nextRenewalDate = new Date(startDate);
    nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);

    return NextResponse.json({
        status: subscription.status,
        startDate: subscription.start_date,
        nextRenewalDate: nextRenewalDate.toISOString(),
        remaining_lead_finds: subscription.remaining_lead_finds,
        remaining_reply_generations: subscription.remaining_reply_generations,
    });
}