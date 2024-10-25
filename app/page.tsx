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
  keywords: [
    'social media lead generation',
    'AI-powered leads',
    'Reddit marketing',
    'social media automation',
    'AI-powered social media marketing',
    'lead generation tools',
    'social media analytics',
    'influencer marketing',
    'content marketing',
    'digital marketing automation',
    'social media management',
    'online lead generation',
    'AI marketing solutions',
    'social media optimization',
    'digital lead generation',
    'AI-powered marketing automation',
    'social media advertising',
    'lead generation strategies',
    'AI marketing tools',
    'social media engagement',
    'online marketing automation',
    'AI-powered lead generation',
    'social media marketing automation',
    'digital marketing strategies',
    'AI marketing automation tools',
    'social media lead generation tools',
    'AI-powered social media automation',
    'online marketing strategies',
    'AI marketing solutions for social media',
    'digital marketing automation tools',
    'AI-powered digital marketing',
    'social media marketing strategies',
    'AI marketing automation for social media',
    'online lead generation strategies',
    'AI-powered online marketing',
    'social media automation tools',
    'AI marketing automation for digital marketing',
    'digital marketing strategies for social media',
    'AI-powered marketing solutions for digital marketing',
    'online marketing automation tools',
    'AI-powered digital marketing automation',
    'social media marketing automation tools',
    'AI marketing automation for online marketing',
    'digital marketing automation strategies',
    'AI-powered marketing automation for digital marketing',
    'online marketing strategies for social media',
    'AI-powered online marketing automation',
    'social media automation strategies',
    'AI marketing automation strategies for social media',
    'digital marketing automation strategies for social media',
    'AI-powered marketing automation strategies for digital marketing',
    'online marketing automation strategies for social media',
    'AI-powered online marketing automation strategies',
    'social media automation strategies for digital marketing',
    'AI marketing automation strategies for digital marketing',
    'digital marketing automation strategies for digital marketing',
    'AI-powered marketing automation strategies for online marketing',
    'online marketing automation strategies for digital marketing',
    'AI-powered online marketing automation strategies for social media',
    'social media automation strategies for online marketing',
    'AI marketing automation strategies for online marketing',
    'digital marketing automation strategies for online marketing',
    'AI-powered marketing automation strategies for online marketing',
    'online marketing automation strategies for online marketing',
    'AI-powered online marketing automation strategies for digital marketing',
    'social media automation strategies for digital marketing',
    'AI marketing automation strategies for digital marketing',
    'digital marketing automation strategies for digital marketing',
    'AI-powered marketing automation strategies for digital marketing',
    'online marketing automation strategies for digital marketing',
    'AI-powered online marketing automation strategies for digital marketing',
    'social media automation strategies for digital marketing',
    'AI marketing automation strategies for digital marketing',
    'digital marketing automation strategies for digital marketing',
    'AI-powered marketing automation strategies for digital marketing',
    'online marketing automation strategies for digital marketing',
    'AI-powered online marketing automation strategies for digital marketing',
    'social media automation strategies for digital marketing',
    'AI marketing automation strategies for digital marketing',
    'digital marketing automation strategies for digital marketing',
    'AI-powered marketing automation strategies for digital marketing',
    'online marketing automation strategies for digital marketing',
    'AI-powered online marketing automation strategies for digital marketing',
    'social media automation strategies for digital marketing',
    'AI marketing automation strategies for digital marketing',
    'digital marketing automation strategies for digital marketing',
    'AI-powered marketing automation strategies for digital marketing',
    'online marketing automation strategies for digital marketing',
    'AI-powered online marketing automation strategies for digital marketing',
    'social media automation strategies for digital marketing',
    'AI marketing automation strategies for digital marketing',
    'digital marketing automation strategies for digital marketing',
    'AI-powered marketing automation strategies for digital marketing',
    'online marketing automation strategies for digital marketing',
    'AI-powered online marketing automation strategies for digital marketing',
    'social media automation strategies for digital marketing',
    'AI marketing automation strategies for digital marketing',
    'digital marketing automation strategies for digital marketing',
    'AI-powered marketing automation strategies for digital marketing',
    'online marketing automation strategies for digital marketing',
    'AI-powered online marketing automation strategies for digital marketing',
    'social media automation strategies for digital marketing',
    'AI marketing automation strategies for digital marketing',
    'digital marketing automation strategies for digital marketing',
    'AI-powered marketing automation strategies for digital marketing',
    'online marketing automation strategies for digital marketing',
    'AI-powered online marketing automation strategies for digital marketing',
    'social media automation strategies for digital marketing',
    'AI marketing automation strategies for digital marketing',
    'digital marketing automation strategies for digital marketing',
    'AI-powered marketing automation strategies for digital marketing',
    'online marketing automation strategies for digital marketing',
    'AI-powered online marketing automation strategies for digital marketing',
    'social media automation strategies for digital marketing',
    'AI marketing automation strategies for digital marketing',
    'digital marketing automation strategies for digital marketing',
    'AI-powered marketing automation strategies for digital marketing',
    'online marketing automation strategies for digital marketing',
    'AI-powered online marketing automation strategies for digital marketing',
    'social media automation strategies for digital marketing',
    'AI marketing automation strategies for digital marketing',
    'digital marketing automation strategies for digital marketing',
    'AI-powered marketing automation strategies for digital marketing',
    'online marketing automation strategies for digital marketing',
    'AI-powered online marketing automation strategies for digital marketing',
    'social media automation strategies for digital marketing',
    'AI marketing automation strategies for digital marketing',
    'digital marketing automation strategies for digital marketing'],
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
  twitter: {
    card: 'summary_large_image',
    site: 'https://socialtargeter.com',
    creator: '@social_targeter',
  },
};

export default function Home() {
  return (
    <PageWrapper>
      <main className="flex flex-col justify-center items-center w-full">
        <LandingPage />
        {(config.auth.enabled && config.payments.enabled) && (
          <section id="pricing">
            <Pricing />
          </section>
        )}
        <section id="faq" className="w-full my-12 md:my-20">
          <AccordionComponent />
        </section>
        <section id="blog">
          <BlogSection />
        </section>
      </main>
    </PageWrapper>
  );
}
