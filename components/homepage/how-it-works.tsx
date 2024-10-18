import React from 'react';
import { AccordionComponent } from "../../components/homepage/accordion-component";
import MarketingCards from "../../components/homepage/marketing-cards";
import Pricing from "../../components/homepage/pricing";
import SideBySide from "../../components/homepage/side-by-side";
import PageWrapper from "../../components/wrapper/page-wrapper";
import config from "../../config";
import TooltipBanner from "../../components/homepage/tooltip-banner";
import LandingPage from "../../components/homepage/landingPage";
export default function Home() {
  return (
    <PageWrapper>
      <TooltipBanner />
      <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
        <LandingPage />
      </div>
      <div className="flex my-[4rem] w-full justify-center items-center">
        <SideBySide />
      </div>
      <div className="flex flex-col p-2 w-full justify-center items-center">
        <MarketingCards />
      </div>
      {(config.auth.enabled && config.payments.enabled) && <div>
        <Pricing />
      </div>}
      <div className="flex justify-center items-center w-full my-[8rem]">
        <AccordionComponent />
      </div>
    </PageWrapper>
  );
}
