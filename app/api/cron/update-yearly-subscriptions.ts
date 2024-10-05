import { createServerClient } from "@supabase/ssr";
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { cookies: {} }
  );

  try {
    const { data: users, error } = await supabase
      .from('User')
      .select('*')
      .eq('subscription_status', 'active')
      .ilike('subscription_price_id', '%yearly%');

    if (error) throw error;

    for (const user of users) {
      const updateData = getYearlySubscriptionUpdateData(user.subscription_price_id);
      
      const { error: updateError } = await supabase
        .from('User')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) {
        console.error(`Error updating user ${user.id}:`, updateError);
      }
    }

    return NextResponse.json({ message: 'Yearly subscriptions updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating yearly subscriptions:', error);
    return NextResponse.json({ error: 'Failed to update yearly subscriptions' }, { status: 500 });
  }
}

function getYearlySubscriptionUpdateData(priceId: string) {
  switch (priceId) {
    case process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SMALL_YEARLY:
      return { remaining_lead_finds: 20, remaining_reply_generations: 20 };
    case process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY:
      return { remaining_lead_finds: 100, remaining_reply_generations: 100 };
    case process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_YEARLY:
      return { remaining_lead_finds: 300, remaining_reply_generations: 300 };
    case process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_YEARLY:
      return { remaining_lead_finds: 1000, remaining_reply_generations: 1000 };
    default:
      return {};
  }
}
