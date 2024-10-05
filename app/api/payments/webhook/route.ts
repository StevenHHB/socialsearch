import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const cookieStore = cookies();

  const supabase: any = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const reqText = await req.text();
  return webhooksHandler(reqText, req, supabase);
}

async function getCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return (customer as Stripe.Customer).email;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

async function handleSubscriptionEvent(
  event: Stripe.Event,
  type: "created" | "updated" | "deleted",
  supabase: ReturnType<typeof createServerClient>
) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerEmail = await getCustomerEmail(subscription.customer as string);

  if (!customerEmail) {
    return NextResponse.json({
      status: 500,
      error: "Customer email could not be fetched",
    });
  }

  const planDetails = getPlanDetails(subscription.items.data[0]?.price.id);
  if (!planDetails) {
    return NextResponse.json({
      status: 400,
      error: "Invalid subscription plan",
    });
  }

  const subscriptionData: any = {
    subscription_id: subscription.id,
    stripe_user_id: subscription.customer,
    status: subscription.status,
    start_date: new Date(subscription.current_period_start * 1000).toISOString(),
    end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    plan_id: subscription.items.data[0]?.price.id,
    plan_name: planDetails.name,
    plan_interval: planDetails.interval,
    user_id: subscription.metadata?.userId || "",
    email: customerEmail,
  };

  let data, error;
  if (type === "deleted") {
    ({ data, error } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled", email: customerEmail })
      .match({ subscription_id: subscription.id })
      .select());
    if (!error) {
      const { error: userError } = await supabase
        .from("User")
        .update({ subscription: null, remaining_lead_finds: 0, remaining_reply_generations: 0 })
        .eq("email", customerEmail);
      if (userError) {
        console.error("Error updating user subscription status:", userError);
        return NextResponse.json({
          status: 500,
          error: "Error updating user subscription status",
        });
      }
    }
  } else {
    ({ data, error } = await supabase
      .from("subscriptions")
      [type === "created" ? "insert" : "update"](
        type === "created" ? [subscriptionData] : subscriptionData
      )
      .match({ subscription_id: subscription.id })
      .select());

    if (!error) {
      const { error: userError } = await supabase
        .from("User")
        .update({
          subscription: planDetails.name,
          remaining_lead_finds: planDetails.leadFinds,
          remaining_reply_generations: planDetails.replyGens,
        })
        .eq("email", customerEmail);
      if (userError) {
        console.error("Error updating user subscription data:", userError);
        return NextResponse.json({
          status: 500,
          error: "Error updating user subscription data",
        });
      }
    }
  }

  if (error) {
    console.error(`Error during subscription ${type}:`, error);
    return NextResponse.json({
      status: 500,
      error: `Error during subscription ${type}`,
    });
  }

  return NextResponse.json({
    status: 200,
    message: `Subscription ${type} success`,
    data,
  });
}

async function handleInvoiceEvent(
  event: Stripe.Event,
  status: "succeeded" | "failed",
  supabase: ReturnType<typeof createServerClient>
) {
  const invoice = event.data.object as Stripe.Invoice;
  const customerEmail = await getCustomerEmail(invoice.customer as string);

  if (!customerEmail) {
    return NextResponse.json({
      status: 500,
      error: "Customer email could not be fetched",
    });
  }

  const invoiceData = {
    invoice_id: invoice.id,
    subscription_id: invoice.subscription as string,
    amount_paid: status === "succeeded" ? invoice.amount_paid / 100 : undefined,
    amount_due: status === "failed" ? invoice.amount_due / 100 : undefined,
    currency: invoice.currency,
    status,
    user_id: invoice.metadata?.userId,
    email: customerEmail,
  };

  const { data, error } = await supabase.from("invoices").insert([invoiceData]);

  if (error) {
    console.error(`Error inserting invoice (payment ${status}):`, error);
    return NextResponse.json({
      status: 500,
      error: `Error inserting invoice (payment ${status})`,
    });
  }

  return NextResponse.json({
    status: 200,
    message: `Invoice payment ${status}`,
    data,
  });
}

async function handleCheckoutSessionCompleted(
  event: Stripe.Event,
  supabase: ReturnType<typeof createServerClient>
) {
  const session = event.data.object as Stripe.Checkout.Session;
  const metadata: any = session?.metadata;

  if (metadata?.subscription === "true") {
    // This is for subscription payments
    const subscriptionId = session.subscription;
    try {
      await stripe.subscriptions.update(subscriptionId as string, { metadata });

      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({ user_id: metadata?.userId })
        .eq("email", metadata?.email);
      if (invoiceError) throw new Error("Error updating invoice");

      const { error: userError } = await supabase
        .from("User")
        .update({ subscription: session.id })
        .eq("user_id", metadata?.userId);
      if (userError) throw new Error("Error updating user subscription");

      return NextResponse.json({
        status: 200,
        message: "Subscription metadata updated successfully",
      });
    } catch (error) {
      console.error("Error updating subscription metadata:", error);
      return NextResponse.json({
        status: 500,
        error: "Error updating subscription metadata",
      });
    }
  } else {
    // This is for one-time payments
    const dateTime = new Date(session.created * 1000).toISOString();
    try {
      const paymentData = {
        user_id: metadata?.userId,
        stripe_id: session.id,
        email: metadata?.email,
        amount: session.amount_total! / 100,
        customer_details: JSON.stringify(session.customer_details),
        payment_intent: session.payment_intent,
        payment_time: dateTime,
        currency: session.currency,
      };

      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .insert([paymentData]);
      if (paymentsError) throw new Error("Error inserting payment");

      return NextResponse.json({
        status: 200,
        message: "Payment updated successfully",
      });
    } catch (error) {
      console.error("Error handling checkout session:", error);
      return NextResponse.json({
        status: 500,
        error,
      });
    }
  }
}

async function webhooksHandler(
  reqText: string,
  request: NextRequest,
  supabase: ReturnType<typeof createServerClient>
): Promise<NextResponse> {
  const sig = request.headers.get("Stripe-Signature");

  try {
    const event = await stripe.webhooks.constructEventAsync(
      reqText,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "customer.subscription.created":
        return handleSubscriptionEvent(event, "created", supabase);
      case "customer.subscription.updated":
        return handleSubscriptionEvent(event, "updated", supabase);
      case "customer.subscription.deleted":
        return handleSubscriptionEvent(event, "deleted", supabase);
      case "invoice.payment_succeeded":
        return handleInvoiceEvent(event, "succeeded", supabase);
      case "invoice.payment_failed":
        return handleInvoiceEvent(event, "failed", supabase);
      case "checkout.session.completed":
        return handleCheckoutSessionCompleted(event, supabase);
      default:
        return NextResponse.json({
          status: 400,
          error: "Unhandled event type",
        });
    }
  } catch (err) {
    console.error("Error constructing Stripe event:", err);
    return NextResponse.json({
      status: 500,
      error: "Webhook Error: Invalid Signature",
    });
  }
}

function getPlanDetails(priceId: string) {
  const plans = {
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SMALL_MONTHLY!]: { name: 'Small', interval: 'month', leadFinds: 20, replyGens: 20 },
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SMALL_YEARLY!]: { name: 'Small', interval: 'year', leadFinds: 20, replyGens: 20 },
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY!]: { name: 'Pro', interval: 'month', leadFinds: 100, replyGens: 100 },
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY!]: { name: 'Pro', interval: 'year', leadFinds: 100, replyGens: 100 },
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_MONTHLY!]: { name: 'Team', interval: 'month', leadFinds: 300, replyGens: 300 },
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_YEARLY!]: { name: 'Team', interval: 'year', leadFinds: 300, replyGens: 300 },
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_MONTHLY!]: { name: 'Enterprise', interval: 'month', leadFinds: 1000, replyGens: 1000 },
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_YEARLY!]: { name: 'Enterprise', interval: 'year', leadFinds: 1000, replyGens: 1000 },
  };
  return plans[priceId] || null;
}