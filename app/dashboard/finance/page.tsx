"use client"

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Calendar, Package, RefreshCw } from 'lucide-react';
import PricingCard from "@/components/homepage/pricing";

export default function Finance() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

  // Assuming the subscription information is stored in a public metadata field
  const subscription = user?.publicMetadata?.subscription as string | undefined;
  const isSubscribed = subscription !== undefined && subscription !== 'Free';
  const isEnterprise = subscription === 'Enterprise';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isSubscribed ? 'Your Subscription' : 'Upgrade Now'}
      </motion.h1>

      {isSubscribed ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-700 text-white p-6">
                <CardTitle className="text-2xl font-bold">Current Plan</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-6 h-6 mr-2 text-blue-500" />
                  <span className="text-xl font-semibold">{subscription}</span>
                </div>
                <p className="text-gray-600 mb-2">Status: <span className="font-semibold capitalize">Active</span></p>
                {/* Add more subscription details here if available */}
              </CardContent>
            </Card>
          </div>
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Upgrade Your Plan</h2>
            <PricingCard hideFreePlan={true} currentPlan={subscription} />
          </div>
        </>
      ) : (
        <div>
          <PricingCard hideFreePlan={true} />
        </div>
      )}
    </div>
  );
}