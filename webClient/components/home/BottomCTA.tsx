"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import CustomButton from "../shared/buttons/CustomButton";
import SectionWrapper from "./shared/SectionWrapper";

const BottomCTA = () => (
    <>
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');
    `}</style>

        <SectionWrapper >
            {/* Outer card — dark background for contrast */}
            <div className="relative rounded-3xl bg-slate-950 overflow-hidden">

                {/* Subtle grid texture */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v1H0zm0 20h40v1H0zM0 0v40h1V0zm20 0v40h1V0z' fill='%23ffffff'/%3E%3C/svg%3E")`,
                    }}
                />

                <div className="grid md:grid-cols-2 gap-0 items-stretch">

                    {/* Left: Image card */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden md:flex flex-col p-8 border-r border-white/5"
                    >
                        {/* Main image */}
                        <div className="rounded-2xl overflow-hidden flex-1 relative mb-4">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&fit=crop"
                                alt="Fashion"
                                className="w-full h-full object-cover"
                                style={{ minHeight: '320px' }}
                            />
                            {/* Overlay label */}
                            <div className="absolute bottom-4 left-4">
                                <span
                                    className="text-[9px] uppercase text-white/50"
                                    style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.16em' }}
                                >
                                    Inspiration Board
                                </span>
                            </div>
                        </div>

                        {/* Avatar row */}
                        <div className="flex items-center gap-3 pt-2">
                            <div className="flex -space-x-2">
                                {[
                                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop',
                                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&fit=crop',
                                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop',
                                ].map((src, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-950 ring-1 ring-white/10">
                                        <img src={src} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p
                                className="text-[11px] text-white/40"
                                style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.04em' }}
                            >
                                12,000+ creators joined
                            </p>
                        </div>
                    </motion.div>

                    {/* Right: Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col justify-center p-10 md:p-14 space-y-8"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-px bg-white/20" />
                            <span
                                className="uppercase text-white/30"
                                style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', letterSpacing: '0.18em' }}
                            >
                                Get started today
                            </span>
                        </div>

                        <h2
                            className="text-[clamp(2.2rem,3.5vw,3.2rem)] font-black text-white leading-[1.05] tracking-[-0.03em]"
                            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                        >
                            Start building your{" "}
                            <span
                                className="font-normal italic text-white/50"
                                style={{ fontFamily: "'Instrument Serif', serif" }}
                            >
                                inspiration
                            </span>{" "}
                            library.
                        </h2>

                        <p
                            className="text-[15px] text-white/40 leading-[1.8] max-w-xs"
                            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                        >
                            Join thousands of creators and start saving ideas today. It's free.
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <CustomButton
                                text="Get Started Free"
                                icon={<ArrowUpRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                                className="group bg-white hover:bg-slate-100 text-slate-900 rounded-full w-full sm:w-fit h-12 px-7 text-[13px] font-bold transition-all duration-200"
                                style={{ letterSpacing: '0.08em' }}
                            />


                            <CustomButton
                                text="View Demo"
                                className="text-white/50 w-full sm:w-fit hover:text-white hover:bg-white/5 rounded-full h-12 px-7 text-[13px] font-semibold transition-all duration-200"
                                style={{ fontFamily: "'Cabinet Grotesk', sans-serif", letterSpacing: '0.02em' }}
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </SectionWrapper>
    </>
);

export default BottomCTA;