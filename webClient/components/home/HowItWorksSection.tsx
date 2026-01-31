"use client";

import { motion } from "framer-motion";
import { 
  Upload, 
  Layout, 
  Compass, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp } from "@/utils/animations";

// --- How It Works Section ---
const HowItWorksSection = () => {
    const steps = [
        { id: "1", icon: <Upload className="w-10 h-10"/>, title: "Upload or save ideas", desc: "Add your own media or save from others." },
        { id: "2", icon: <Layout className="w-10 h-10"/>, title: "Organize into boards", desc: "Group content by project, style, or mood." },
        { id: "3", icon: <Compass className="w-10 h-10"/>, title: "Discover trends", desc: "Browse popular styles and current directions." },
    ];

    return (
        <section className="py-24 bg-white" id="how-it-works">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-extrabold text-slate-900">How Boardly Works</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step) => (
                        <motion.div 
                            key={step.id} 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="relative group"
                        >
                            <Card className="h-full border border-slate-100 shadow-sm hover:shadow-xl hover:border-violet-100 transition-all duration-300 rounded-[2rem] bg-white">
                                <CardContent className="p-8 pt-12 text-center relative">
                                    {/* Number in top left */}
                                    <span className="absolute top-6 left-8 text-xl font-medium text-slate-400">
                                        {step.id}
                                    </span>
                                    
                                    <div className="mb-6 flex items-center justify-center text-slate-900">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-lg font-bold mb-3 text-slate-900">{step.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed px-4">{step.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorksSection

