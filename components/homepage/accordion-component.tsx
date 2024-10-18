import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export function AccordionComponent() {
    return (
        <div className="flex flex-col w-full max-w-3xl mx-auto py-2">
            <Badge variant="secondary" className="self-center px-3 py-1 text-sm font-semibold bg-[#fff0e5] text-[#ff6f2c] border-none mb-4">
                FAQs
            </Badge>
            <h2 className="text-3xl font-bold text-center tracking-tight dark:text-white text-gray-900 mb-8">
                Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger><span className="font-medium">How does SocialTargeter leverage AI for lead generation?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>SocialTargeter uses advanced AI algorithms to analyze social media profiles, identify high-potential leads, and generate personalized engagement suggestions. Our AI-powered tool scans platforms like Reddit, Twitter, and LinkedIn to find relevant discussions and opportunities for your business, making lead generation faster and more efficient than ever before.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger><span className="font-medium">Can SocialTargeter help improve my SEO and visibility in AI-driven search results?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Absolutely! SocialTargeter helps you strategically place your brand in top Reddit discussions and other social media platforms. This not only improves your SEO rankings but also increases your visibility in AI-driven search results like those from ChatGPT. By engaging in relevant, high-ranking discussions, you're positioning your brand for both traditional SEO and next-generation AI search discovery.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger><span className="font-medium">How does SocialTargeter's competitor monitoring feature work?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Our competitor monitoring feature allows you to track your competitors' social media activity in real-time. SocialTargeter analyzes their engagement, content strategy, and audience interactions. This insight helps you identify gaps in the market, discover new opportunities, and refine your own social media strategy to stay ahead of the competition.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger><span className="font-medium">What kind of analytics and reporting does SocialTargeter offer?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>SocialTargeter provides comprehensive analytics and reporting features to help you track your social media performance and ROI. Our dashboard offers insights into engagement rates, lead quality, conversion metrics, and more. You can monitor the impact of your Reddit marketing efforts on search engine rankings, track competitor performance, and receive customized reports to help optimize your strategy over time.</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
