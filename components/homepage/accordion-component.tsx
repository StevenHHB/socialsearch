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
                    <AccordionTrigger><span className="font-medium">How does useDotCom help me find the perfect domain?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Finding a .com domain can be a challenge, but with useDotCom, our AI-powered tool does the heavy lifting for you! We generate and search for available .com domains tailored to your product, making your research process faster and more efficient.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger><span className="font-medium">Can I really find unique domains quickly?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Absolutely! useDotCom allows you to explore a multitude of unique .com domain options simultaneously, ensuring you never miss out on the perfect name for your brand.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger><span className="font-medium">Is it easy to use?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Yes! Our user-friendly interface makes it simple for anyone to navigate and find their ideal domain without any hassle.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger><span className="font-medium">What makes useDotCom different from other domain search tools?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Unlike traditional domain search tools, useDotCom leverages advanced AI technology to provide you with a curated list of available .com domains, saving you time and effort while maximizing your options.</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
