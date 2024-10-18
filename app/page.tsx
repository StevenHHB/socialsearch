import { AccordionComponent } from "@/components/homepage/accordion-component";
import Pricing from "@/components/homepage/pricing";
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";
import LandingPage from "@/components/homepage/landingPage";
import { Metadata } from "next";
import BlogSection from "@/components/homepage/BlogSection";

export const metadata: Metadata = {
  title: 'SocialTargeter - AI-Powered Social Media Lead Generation',
  description: 'Discover and engage potential leads on social media with SocialTargeter. Our AI-powered platform streamlines your lead generation process.',
  keywords: ['social media lead generation', 'AI-powered leads', 'Reddit marketing', 'social media automation',],
  openGraph: {
    title: 'SocialTargeter - AI-Powered Social Media Lead Generation',
    description: 'Discover and engage potential leads on social media with SocialTargeter. Our AI-powered platform streamlines your lead generation process.',
    url: 'https://socialtargeter.com',
    siteName: 'SocialTargeter',
    images: [
      {
        url: 'https://socialtargeter.com/images/og.png',
        width: 1200,
        height: 630,
        alt: 'SocialTargeter - AI-Powered Social Media Lead Generation',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Home() {
  return (
    <PageWrapper>
      <div className="flex flex-col justify-center items-center w-full">
        <LandingPage />
      </div>
      {(config.auth.enabled && config.payments.enabled) && <div>
        <Pricing />
      </div>}
      <div className="flex justify-center items-center w-full my-[3rem]">
        <AccordionComponent />
      </div>
      <BlogSection />
    </PageWrapper>
  );
}
