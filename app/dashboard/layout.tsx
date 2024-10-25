import { useState, useEffect } from 'react'
import NotAuthorized from "@/components/not-authorized"
import { isAuthorized } from "@/utils/data/user/isAuthorized"
import { currentUser } from "@clerk/nextjs/server"
import { ReactNode } from "react"
import DashboardSideBar from "./_components/dashboard-side-bar"
import DashboardTopNav from "./_components/dashbord-top-nav"
import config from "@/config"
import { redirect } from 'next/navigation'; // Add this import
import prisma from "@/lib/prisma"; 
import { Skeleton } from "@/components/ui/skeleton"; // Add this import
import { Analytics } from "@vercel/analytics/react"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await currentUser()
  let authorized = false;
  let message = "";
  let remainingLeadFinds = 0;
  let remainingReplyGenerations = 0;

  if (user) {
    const result = await isAuthorized(user.id);
    authorized = result.authorized;
    message = result.message;

    if (authorized) {
      const dbUser = await prisma.user.findUnique({
        where: { user_id: user.id },
        select: { 
          remaining_lead_finds: true,
          remaining_reply_generations: true
        }
      });

      if (dbUser) {
        remainingLeadFinds = dbUser.remaining_lead_finds;
        remainingReplyGenerations = dbUser.remaining_reply_generations;
      }
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSideBar 
        remainingLeadFinds={remainingLeadFinds} 
        remainingReplyGenerations={remainingReplyGenerations} 
      />
      <div className="flex-1 overflow-auto">
        <DashboardTopNav>
          <main className="flex flex-col gap-4 p-4 lg:gap-6">
            {authorized ? (
              children
            ) : (
              <NotAuthorized message={message} />
            )}
          </main>
        </DashboardTopNav>
      </div>
      <Analytics />
    </div>
  )
}
