import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';
import { createServerClient } from "@supabase/ssr";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST() {
    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
        { cookies: {} } // Provide an empty object for cookies
    );

  // Get the user's session
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Fetch the user's Stripe customer ID from your database
  const { data: user, error } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', session.user.id)
    .single();

  // Log the error for debugging
  if (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'User not found or no Stripe customer ID' }, { status: 404 });
  }

  if (!user?.stripe_customer_id) {
    return NextResponse.json({ error: 'User not found or no Stripe customer ID' }, { status: 404 });
  }

  // Create a Stripe billing portal session
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${process.env.FRONTEND_URL}/dashboard/finance`,
  });

  return NextResponse.json({ url: portalSession.url });
}