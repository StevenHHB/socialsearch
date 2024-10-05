"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Target, Users, Building } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";

const plans = [
  {
    title: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Try it out for free",
    features: [
      "1 Lead Find per month",
      "1 Reply Generation per month",
      "Basic Analytics",
      "Email Support"
    ],
    actionLabel: "Start for Free",
    icon: Zap,
  },
  {
    title: "Small",
    monthlyPrice: 9.99,
    yearlyPrice: 71.99,
    description: "Perfect for small projects",
    features: [
      "20 Lead Finds per month",
      "20 Reply Generations per month",
      "Basic Analytics",
      "Email Support"
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SMALL_MONTHLY,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SMALL_YEARLY,
    actionLabel: "Get Started",
    icon: Zap,
  },
  {
    title: "Pro",
    monthlyPrice: 39.99,
    yearlyPrice: 287.99,
    description: "Ideal for growing businesses",
    features: [
      "100 Lead Finds per month",
      "100 Reply Generations per month",
      "Advanced Analytics",
      "Priority Support"
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY,
    actionLabel: "Go Pro",
    icon: Target,
    popular: true,
  },
  {
    title: "Team",
    monthlyPrice: 99.99,
    yearlyPrice: 719.99,
    description: "Best for small teams",
    features: [
      "300 Lead Finds per month",
      "300 Reply Generations per month",
      "Team Collaboration Tools",
      "24/7 Support"
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_MONTHLY,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_YEARLY,
    actionLabel: "Upgrade to Team",
    icon: Users,
  },
  {
    title: "Enterprise",
    monthlyPrice: 199.99,
    yearlyPrice: 1439.99,
    description: "For large organizations",
    features: [
      "1000 Lead Finds per month",
      "1000 Reply Generations per month",
      "Custom Integrations",
      "Dedicated Account Manager"
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_MONTHLY,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_YEARLY,
    actionLabel: "Upgrade to Enterprise",
    icon: Building,
  },
];

interface PricingCardProps {
  hideFreePlan?: boolean;
  currentPlan?: string;
}

export default function PricingCard({ hideFreePlan = false, currentPlan }: PricingCardProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);

  const filteredPlans = hideFreePlan ? plans.filter(plan => plan.title !== "Free") : plans;
  const gridCols = filteredPlans.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-5';

  const handlePlanSelection = (planTitle: string) => {
    // Here you would implement the logic to update the user's subscription
    console.log(`Selected plan: ${planTitle}`);
    // You might want to redirect to a confirmation page or show a modal
  };

  const getButtonText = (planTitle: string) => {
    if (!user || !currentPlan) return planTitle === "Free" ? "Start for Free" : `Get ${planTitle}`;
    
    const currentPlanIndex = plans.findIndex(plan => plan.title === currentPlan);
    const thisPlanIndex = plans.findIndex(plan => plan.title === planTitle);
    
    if (planTitle === currentPlan) return "Current Plan";
    if (thisPlanIndex < currentPlanIndex) return `Downgrade to ${planTitle}`;
    return `Upgrade to ${planTitle}`;
  };

  return (
    <div className="py-24 sm:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Choose Your Plan
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-300">
          Unlock the power of AI-driven lead generation with our flexible plan options.
        </p>
        
        <div className="mt-8 flex justify-center items-center space-x-4">
          <span className="text-sm font-medium text-gray-900 dark:text-white">Monthly</span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="bg-blue-600 dark:bg-blue-400"
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Yearly (Save 40%)</span>
        </div>

        <div className={`isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none md:grid-cols-2 ${gridCols}`}>
          {filteredPlans.map((plan, planIdx) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: planIdx * 0.1 }}
              className="flex"
            >
              <Card className={`relative flex flex-col justify-between h-full ring-1 ring-gray-200 dark:ring-gray-700 ${plan.popular ? 'ring-2 ring-blue-600 dark:ring-blue-400' : ''} ${currentPlan === plan.title ? 'bg-blue-50 dark:bg-blue-900' : ''}`}>
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
                    <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">
                      /{isYearly ? 'year' : 'month'}
                    </span>
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
                <CardFooter>
                  <Button
                    onClick={() => handlePlanSelection(plan.title)}
                    className={`mt-8 block w-full ${currentPlan === plan.title ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    disabled={currentPlan === plan.title}
                  >
                    {getButtonText(plan.title)}
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