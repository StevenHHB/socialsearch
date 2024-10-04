"use client";
import Link from "next/link";
import * as React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { UserProfile } from "../user-profile";
import ModeToggle from "../mode-toggle";
import { BlocksIcon, SquareDashedMousePointer } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { LuLayoutDashboard } from "react-icons/lu";
import config from "@/config";
import { cn } from "@/lib/utils";

export default function NavBar() {
    let userId = null;
    if (config?.auth?.enabled) {
        const user = useAuth();
        userId = user?.userId;
    }

    return (
        <nav className="flex min-w-full fixed justify-between p-2 border-b z-10 dark:bg-black dark:bg-opacity-50 bg-white">
            <div className="flex items-center">
                {/* Home Button with Link */}
                <Link href="/" className="flex items-center mr-6" aria-label="Home">
                    <SquareDashedMousePointer className="h-6 w-6 mr-2" aria-hidden="true" />
                    <span className="font-semibold text-lg">useDotCom</span>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex space-x-4">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/pricing">Pricing</NavLink>
                    <NavLink href="/blog">Blog</NavLink>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                    {/* Dashboard Button */}
                    <Link href="/dashboard">
                        <Button
                            variant={userId ? "default" : "outline"}
                            className={userId ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                        >
                            <LuLayoutDashboard className="mr-2 h-4 w-4" />
                            {userId ? "Dashboard" : "Sign In to access Dashboard"}
                        </Button>
                    </Link>
                </div>

                <ModeToggle />

                <div className="hidden md:block">
                    {userId && <UserProfile />}
                </div>

                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        {/* Use div to avoid nested button */}
                        <div className="md:hidden">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="w-8 h-8"
                                aria-label="Open menu"
                            >
                                <GiHamburgerMenu />
                            </Button>
                        </div>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col space-y-4 mt-6">
                            <NavLink href="/" mobile>Home</NavLink>
                            <NavLink href="/pricing" mobile>Pricing</NavLink>
                            <NavLink href="/blog" mobile>Blog</NavLink>
                            {userId ? (
                                <Link href="/dashboard">
                                    <Button
                                        variant="default"
                                        className="w-full"
                                    >
                                        <LuLayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/sign-up">
                                    <Button variant="outline" className="w-full">Sign Up</Button>
                                </Link>
                            )}
                            {userId && <UserProfile />}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}

// Navigation Link Component
interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, mobile }) => (
    <Link href={href}>
        <Button
            variant="ghost"
            className={cn(
                "text-base font-medium",
                mobile && "w-full justify-start"
            )}
        >
            {children}
        </Button>
    </Link>
);
