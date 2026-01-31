"use client";

import React, { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import AuthForm from "../auth/AuthForm";



// --- Navbar with Scroll Logic ---

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        if (!activeSection) return;

        const element = document.getElementById(activeSection);
        element?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }, [activeSection]);



    const triggerScroll = (name: string) => {
        setIsOpen(false);
        setActiveSection(name.toLowerCase().replace(/\s+/g, '-'));
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100"
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span
                        className="text-2xl font-bold tracking-tight text-slate-900 cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        boardly
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    {["Features", "Explore", "How it Works"].map((item) => (
                        <span
                            key={item}
                            onClick={() => triggerScroll(item)}
                            className="cursor-pointer hover:text-violet-600 transition-colors relative group py-2"
                        >
                            {item}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 transition-all group-hover:w-full" />
                        </span>
                    ))}

                    <Popover>
                        <PopoverTrigger asChild>
                            <span className="cursor-pointer hover:text-violet-600 transition-colors font-semibold">Login</span>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-none mt-4" align="end">
                            <AuthForm type="login" />
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-7 h-11 font-bold shadow-xl shadow-violet-100 transition-all hover:-translate-y-0.5 active:scale-95">
                                Sign Up
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-none mt-4" align="end">
                            <AuthForm type="signup" />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Animated Hamburger Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden z-50 flex flex-col gap-1.5 p-2"
                >
                    <motion.div
                        animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-6 h-0.5 bg-slate-900 rounded-full"
                    />
                    <motion.div
                        animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                        className="w-6 h-0.5 bg-slate-900 rounded-full"
                    />
                    <motion.div
                        animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-6 h-0.5 bg-slate-900 rounded-full"
                    />
                </button>
            </div>

            {/* Mobile Sidebar/Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full h-screen max-w-sm bg-background shadow-2xl md:hidden z-40 p-8 flex flex-col"
                    >
                        <div className="mt-16 flex flex-col gap-8">
                            {["Features", "Explore", "How it Works"].map((item) => (
                                <span
                                    key={item}
                                    onClick={() => triggerScroll(item)}
                                    className="text-2xl font-bold text-slate-900"
                                >
                                    {item}
                                </span>
                            ))}
                            <div className="h-px bg-slate-100 my-4" />
                            <div className="flex flex-col gap-4">
                                <Button variant="outline" 
                                    className="rounded-2xl h-14 font-bold text-lg border-slate-200"
                                    onClick={() => router.push('/auth/login')}
                                >Log In</Button>
                                <Button className="bg-violet-600 text-white rounded-2xl h-14 font-bold text-lg"
                                    onClick={() => router.push('/auth/signup')}
                                >Sign Up Free</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;