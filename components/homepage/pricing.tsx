"use client";

import React from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Target, Rocket } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Ensure Stripe is initialized outside of component rendering for performance
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const plans = [
  {
    title: "3X Starter Pack",
    price: 9.99,
    description: "Perfect for small projects",
    features: [
      "3 Project Generations",
      "100-200 Domain Suggestions per Project",
      "Availability Check",
      "Value and Price Analysis",
      "3-5 Best Domain Recommendations"
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_3_GEN,
    actionLabel: "Purchase Now",
    icon: Zap,
  },
  {
    title: "10X Pro Pack",
    price: 24.99,
    description: "Ideal for medium-sized projects",
    features: [
      "10 Project Generations",
      "100-200 Domain Suggestions per Project",
      "Availability Check for each domain",
      "Advanced Value and Price Analysis",
      "5-10 Final Curated Domain Recommendations",
      "Priority Processing"
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_10_GEN,
    actionLabel: "Get Now",
    icon: Target,
    popular: true,
  },
  {
    title: "20X Mega Pack",
    price: 49.99,
    description: "Best for large projects",
    features: [
      "20 Project Generations",
      "100-200 Domain Suggestions per Project",
      "Real-time Availability Check",
      "Premium Value and Price Analysis",
      "Expert Domain Recommendations",
      "Priority Processing",
      "Extended AI-driven Insights"
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_20_GEN,
    actionLabel: "Purchase Now",
    icon: Rocket,
  },
];

export default function PricingCard() {
  const { user } = useUser();
  const router = useRouter();
  
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      toast("Please login or sign up to purchase", {
        description: "You must be logged in to make a purchase",
        action: {
          label: "Sign Up",
          onClick: () => router.push("/sign-up"),
        },
      });
      return;
    }

    const stripe = await stripePromise;
    if (!stripe) {
      toast("Stripe failed to initialize. Please try again.");
      console.error("Stripe failed to initialize.");
      return;
    }

    try {
      const { data } = await axios.post("/api/payments/create-checkout-session", {
        priceId,
        userId: user.id,
        userEmail: user.primaryEmailAddress?.emailAddress || "",
      });

      if (data.sessionId) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error("Error redirecting to checkout:", error);
          toast("There was an error redirecting to the checkout page.");
        }
      } else {
        toast("Failed to create checkout session.");
        console.error("Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast("Error during checkout. Please try again.");
    }
  };

  return (
    <div className="py-24 sm:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Choose Your Domain Generation Pack
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-300">
          Unlock the power of AI-driven domain suggestions with our flexible pack options. Each pack includes comprehensive domain analysis and recommendations.
        </p>
        
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan, planIdx) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: planIdx * 0.1 }}
            >
              <Card className={`relative flex flex-col justify-between h-full ring-1 ring-gray-200 dark:ring-gray-700 ${plan.popular ? 'ring-2 ring-blue-600 dark:ring-blue-400' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 -mr-1 -mt-1 z-10">
                    <Badge variant="secondary" className="bg-blue-600 text-white dark:bg-blue-400 dark:text-gray-900">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-x-4">
                    <plan.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <CardTitle className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">{plan.title}</CardTitle>
                  </div>
                  <CardDescription className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">{plan.description}</CardDescription>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">${plan.price}</span>
                    <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">/pack</span>
                  </p>
                </CardHeader>
                <CardContent>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckCircle2 className="h-6 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-8">
                  <Button
                    onClick={() => handleCheckout(plan.priceId!)}
                    className={`w-full ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-400 dark:text-gray-900 dark:hover:bg-blue-300' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700'}`}
                  >
                    {plan.actionLabel}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}