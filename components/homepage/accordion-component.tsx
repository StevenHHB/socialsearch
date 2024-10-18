import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export function AccordionComponent() {
    return (
        <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <Badge variant="secondary" className="mx-auto block w-fit px-3 py-1 text-sm font-semibold bg-[#fff0e5] text-[#ff6f2c] border-none mb-4">
                FAQs
            </Badge>
            <h2 className="text-3xl font-bold text-center tracking-tight dark:text-white text-gray-900 mb-8">
                Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger><span className="font-medium">How does SocialTargeter leverage AI for lead generation?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>SocialTargeter uses advanced AI algorithms to analyze social media profiles and discussions on platforms like Reddit, Twitter, and LinkedIn. Our AI-powered tool identifies high-potential leads, generates personalized engagement suggestions, and helps you find relevant conversations for your business. This makes lead generation faster, more efficient, and allows you to tap into discussions where your target audience is actively engaged.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger><span className="font-medium">How can SocialTargeter improve my SEO and visibility in AI-driven search results?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>SocialTargeter helps you strategically place your brand in top Reddit discussions and other social media platforms, which often rank high in Google search results. By engaging in these relevant, high-ranking discussions, you're not only improving your traditional SEO rankings but also increasing your visibility in AI-driven search results like those from ChatGPT and other AI search engines. This dual approach ensures your brand is discoverable through both conventional search engines and next-generation AI-powered platforms.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger><span className="font-medium">What features does SocialTargeter offer for lead generation and engagement?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>SocialTargeter offers a comprehensive suite of features to supercharge your lead generation efforts:
                        <ul className="list-disc pl-5 mt-2">
                            <li>AI-Powered Post Discovery to find the most relevant discussions for your business</li>
                            <li>Smart Engagement Suggestions for natural and effective responses</li>
                            <li>Competitor Monitoring to track and outperform your rivals</li>
                            <li>SEO Impact Tracking to measure your search engine visibility</li>
                            <li>Automated Alerts for real-time notifications on relevant posts and mentions</li>
                            <li>Performance Analytics to track your ROI and optimize your strategy</li>
                        </ul>
                        </p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger><span className="font-medium">What pricing plans does SocialTargeter offer?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>SocialTargeter offers flexible pricing plans to suit businesses of all sizes:
                        <ul className="list-disc pl-5 mt-2">
                            <li>Free Plan: Perfect for trying out with 1 lead generation and 1 smart reply per month</li>
                            <li>Small Plan: Starting at $9.99/month for 1,000 leads and 20 smart replies per month</li>
                            <li>Pro Plan: $39.99/month for 5,000 leads and 100 smart replies, ideal for serious businesses</li>
                            <li>Team Plan: $99.99/month for 15,000 leads and advanced team collaboration tools</li>
                            <li>Enterprise Plan: Custom solutions for large organizations with dedicated support</li>
                        </ul>
                        All paid plans offer significant discounts for yearly subscriptions, saving you up to 40%.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger><span className="font-medium">How does SocialTargeter compare to manual lead generation methods?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>SocialTargeter dramatically reduces the time and effort required for lead generation compared to manual methods. Instead of spending hours daily monitoring social networks, analyzing mentions, and crafting individual responses, SocialTargeter automates these processes. Our AI-powered system can discover relevant posts, generate smart replies, and provide actionable insights in minutes, allowing you to focus on engaging with high-quality leads and growing your business. This efficiency translates to significant time and cost savings while improving the quality and quantity of your leads.</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
