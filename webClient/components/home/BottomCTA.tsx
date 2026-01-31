"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";


// --- Bottom CTA ---
const BottomCTA = () => (
    <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto rounded-[3rem] p-8 md:p-12 relative">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                
                {/* Left: Avatar Stack Image Card */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="relative bg-slate-100 rounded-[2.5rem] p-4 hidden md:block max-w-sm mx-auto shadow-2xl"
                >
                    {/* Main Image */}
                    <div className="rounded-[2rem] overflow-hidden aspect-[4/5] mb-4 relative">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&fit=crop" alt="Fashion" className="w-full h-full object-cover"/>
                    </div>
                    {/* 3 Avatars Row */}
                    <div className="flex justify-center gap-4 pb-2">
                        {[1,2,3].map((i) => (
                            <div key={i} className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                                <img src={`https://images.unsplash.com/photo-${i === 1 ? '1544005313-94ddf0286df2' : i === 2 ? '1506794778202-cad84cf45f1d' : '1507003211169-0a1dd7228f2d'}?w=100&fit=crop`} alt="User" className="w-full h-full object-cover"/>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right: Text Content */}
                <div className="space-y-8 text-left">
                    <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                        Start Building Your <br/> Inspiration Library
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        Join thousands of creators and start saving ideas today.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 h-12 text-base font-semibold shadow-xl shadow-violet-200">Get Started Free</Button>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 h-12 text-base font-semibold shadow-xl shadow-blue-200">View Demo</Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default BottomCTA
