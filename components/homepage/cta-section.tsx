import React from 'react';
import { Button } from "../../components/ui/button";
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-[#fff0e5] text-gray-800 py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to dominate Social Media and <span className="text-[#ff6f2c]">boost your business</span>?
          </h2>
          <p className="max-w-[600px] text-gray-600 md:text-lg/relaxed lg:text-xl/relaxed">
            Join thousands of businesses already leveraging the power of Reddit, X, and LinkedIn with SocialTargeter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/sign-up" passHref>
              <Button size="lg" className="bg-[#ff6f2c] text-white hover:bg-[#ff6f2c]/90">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing" passHref>
              <Button size="lg" variant="outline" className="border-[#ff6f2c] text-[#ff6f2c] hover:bg-[#ff6f2c] hover:text-white">
                View Pricing
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-4">
            <img src="/images/avatar1.svg" alt="User avatar" className="w-10 h-10 rounded-full" />
            <img src="/images/avatar2.svg" alt="User avatar" className="w-10 h-10 rounded-full" />
            <img src="/images/avatar3.svg" alt="User avatar" className="w-10 h-10 rounded-full" />
            <p className="text-sm text-gray-600">Trusted by 100+ businesses worldwide</p>
          </div>
        </div>
      </div>
    </section>
  );
}
