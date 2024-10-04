import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client
const supabase = createServerClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    cookies: {
      get(name: string) {
        // Ensure this is called within a request context
        return cookies().get(name)?.value;
      },
    },
  }
);

// Helper function to get customer email from Stripe
async function getCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return (customer as Stripe.Customer).email;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

// Webhook Handler
async function webhooksHandler(
  reqText: string,
  request: NextRequest
): Promise<NextResponse> {
  const sig = request.headers.get("Stripe-Signature");

  try {
    const event = await stripe.webhooks.constructEventAsync(
      reqText,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Logging the event type for debugging purposes
    console.log(`Handling event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed":
        return handleCheckoutSessionCompleted(event);
      default:
        return NextResponse.json({
          error: "Unhandled event type",
        }, { status: 400 });
    }
  } catch (err: unknown) { // Specify the type of err
    if (err instanceof Error) { // Check if err is an instance of Error
      console.error("Error constructing Stripe event:", err.message);
    } else {
      console.error("Error constructing Stripe event:", err);
    }
    return NextResponse.json({
      error: "Webhook Error: Invalid Signature",
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const reqText = await req.text();
  
  // Create a new Supabase client for this request
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
      },
    }
  );

  return webhooksHandler(reqText, req);
}

// Helper function to handle completed checkout session
async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = session?.metadata as Record<string, string>;

  // Fallback to get email from customer details if metadata doesn't contain the email
  const customerEmail = metadata?.email || session.customer_details?.email;

  if (!customerEmail) {
    console.error("Error: Email not found in metadata or session.customer_details.");
    return NextResponse.json({
      error: "Customer email could not be fetched",
    }, { status: 500 });
  }

  // Use session created time as the payment date
  const dateTime = new Date(session.created * 1000).toISOString();
  const paymentDate = new Date().toISOString(); // Set the current date as payment_date

  try {
    // Fetch user from Supabase using user_id from metadata
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", metadata?.userId)
      .single();

    if (userError) throw new Error(`Error fetching user: ${userError.message}`);

    // Define generations to add based on payment amount
    const generationsToAdd = calculateGenerationsFromAmount(session.amount_total ?? 0);

    // Calculate new remaining generations
    const remainingGenerations = (user?.remaining_generations as number) || 0;
    const updatedGenerations = remainingGenerations + generationsToAdd;

    // Prepare payment data to insert
    const paymentData = {
      user_id: metadata?.userId,
      stripe_id: session.id,
      email: customerEmail, // Use the customerEmail which has fallback
      amount: (session.amount_total ?? 0) / 100, // Ensure it's properly calculated
      customer_details: JSON.stringify(session.customer_details),
      payment_intent: session.payment_intent,
      payment_time: dateTime, // This is the session's created time
      payment_date: paymentDate, // Set the current date for payment_date
      currency: session.currency,
    };

    // Insert payment into "payments" table
    const { error: paymentsError } = await supabase
      .from("payments")
      .insert([paymentData]);

    if (paymentsError) throw new Error(`Error inserting payment: ${paymentsError.message}`);

    // Update user's remaining generations
    const { data: updatedUser, error: userUpdateError } = await supabase
      .from("user")
      .update({ remaining_generations: updatedGenerations })
      .eq("user_id", metadata?.userId)
      .select()
      .single();

    if (userUpdateError) throw new Error(`Error updating user generations: ${userUpdateError.message}`);

    return NextResponse.json({
      message: "Payment processed and generations updated successfully",
      updatedUser,
    }, { status: 200 });

  } catch (error: unknown) { // Specify the type of error
    if (error instanceof Error) { // Check if error is an instance of Error
      console.error("Error handling checkout session:", error.message);
    } else {
      console.error("Error handling checkout session:", error);
    }
    return NextResponse.json({
      error: "Error processing payment and updating generations",
    }, { status: 500 });
  }
}



// Helper function to calculate generations based on payment amount
function calculateGenerationsFromAmount(amount: number): number {
  // Adjust this logic based on your business rules
  if (amount == 999) return 3; // Example for 100 generations for $100.00
  if (amount == 2499) return 10; // Example for 40 generations for $50.00
  if (amount == 4999) return 20; // Example for 15 generations for $20.00
  return Math.floor(amount / 100); // Default 1 generation per dollar
}
