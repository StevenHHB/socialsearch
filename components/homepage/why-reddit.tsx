import React from 'react';
import { Badge } from "../../components/ui/badge"; // Changed import path
import { Search, TrendingUp, Zap, MessageSquare } from 'lucide-react';

export default function WhyReddit() {
  return (
    <section id="why-reddit" className="w-full py-12 md:py-24 lg:py-32 bg-[#fffaf5]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold bg-[#fff0e5] text-[#ff6f2c] border-none">
            Why Reddit?
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Reddit can be a <span className="text-primary">goldmine</span> <br /> for your business.
          </h2>
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-lg text-gray-600 mb-6">
              Top Google rankings are now flooded with Reddit posts and
              AIs like ChatGPT are using these posts to influence product
              recommendations. By strategically placing your brand in top
              Reddit discussions, you're not just winning at SEO but
              also positioning for AI-driven search discovery like ChatGPT.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Ignoring Reddit now is like turning your back on SEO a
              decade ago – a missed opportunity you shouldn't afford.
            </p>
            <div className="space-y-4">
              {[
                { icon: Search, text: "Get exposure for competitive terms, skip costly ads" },
                { icon: TrendingUp, text: "Minimal investment, high organic traffic from comments" },
                { icon: Zap, text: "Secretly sneak into competitors search results" },
                { icon: MessageSquare, text: "Be included in AI Search responses like ChatGPT" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-[#fff0e5] rounded-full p-2">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-lg font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="/placeholder.svg"
              alt="Reddit prominence in search results"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute bottom-4 left-4 bg-white rounded-md shadow-md p-3">
              <p className="text-xs text-gray-500">Source: Glenn Allsop (Detailed)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
