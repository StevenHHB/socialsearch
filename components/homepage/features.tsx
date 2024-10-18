import React from 'react';
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Search, TrendingUp, MessageSquare, Zap, Bell, BarChart } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: "AI-Powered Post Discovery",
      description: "Our advanced AI algorithms scan Reddit to find the most relevant and high-potential posts for your business.",
      icon: Search
    },
    {
      title: "Competitor Monitoring",
      description: "Keep an eye on your competitors' Reddit activity and find opportunities to outshine them.",
      icon: TrendingUp
    },
    {
      title: "Smart Engagement Suggestions",
      description: "Get AI-generated response suggestions to help you engage naturally and effectively in Reddit discussions.",
      icon: MessageSquare
    },
    {
      title: "SEO Impact Tracking",
      description: "Monitor how your Reddit engagement affects your search engine rankings and visibility.",
      icon: Zap
    },
    {
      title: "Automated Alerts",
      description: "Receive real-time notifications for new relevant posts and mentions of your brand or competitors.",
      icon: Bell
    },
    {
      title: "Performance Analytics",
      description: "Comprehensive dashboards and reports to track your Reddit marketing performance and ROI.",
      icon: BarChart
    }
  ];

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold bg-[#fff0e5] text-[#ff6f2c] border-none">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Everything you need to <span className="text-primary">dominate Reddit</span>
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6">
              <div className="mb-4 p-3 bg-[#fff0e5] rounded-full">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
