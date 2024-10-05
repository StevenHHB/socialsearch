import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { TITLE_TAILWIND_CLASS } from "@/utils/constants"

export function AccordionComponent() {
    return (
        <div className="flex flex-col w-[70%] lg:w-[50%]">
            <h2 className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold text-center tracking-tight dark:text-white text-gray-900`}>
                Frequently Asked Questions (FAQs)
            </h2>
            <Accordion type="single" collapsible className="w-full mt-2">
                <AccordionItem value="item-1">
                    <AccordionTrigger><span className="font-medium">How does SocialTargeter help me find leads on social media?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Finding potential leads on social media can be challenging, but with SocialTargeter, our AI-powered tool does the heavy lifting for you! We analyze social media profiles, identify potential leads, and generate personalized responses, making your lead generation process faster and more efficient.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger><span className="font-medium">Can I really find quality leads quickly?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Absolutely! SocialTargeter allows you to discover and analyze potential leads across multiple social media platforms simultaneously, ensuring you never miss out on valuable opportunities for your business.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger><span className="font-medium">Is it easy to use?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Yes! Our user-friendly interface makes it simple for anyone to navigate, find potential leads, and engage with them effectively without any hassle.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger><span className="font-medium">What makes SocialTargeter different from other lead generation tools?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Unlike traditional lead generation tools, SocialTargeter leverages advanced AI technology to provide you with a curated list of potential leads from various social media platforms, along with personalized engagement suggestions, saving you time and effort while maximizing your conversion rates.</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}