"use client"

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { fadeInUp } from "@/utils/animations";

const HeroSection = () => (
  <section className="relative pt-16 pb-24 px-6 overflow-hidden max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left Text */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="space-y-8 max-w-xl"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
          Collect Ideas. <br />
          Organize Inspiration
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-md">
          A visual platform to discover, save, and organize ideas into boards.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white rounded-full h-14 px-8 text-base font-semibold shadow-xl shadow-violet-200">
            Get Started Free
          </Button>
          <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-14 px-8 text-base font-semibold shadow-xl shadow-blue-200">
            View Demo
          </Button>
        </div>
      </motion.div>

      {/* Right Image Collage (Mosaic) */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-[500px] w-full hidden lg:grid grid-cols-3 grid-rows-3 gap-4"
      >
        {/* Man with coffee (Top Right) */}
        <div className="col-span-2 row-span-2 rounded-[2rem] overflow-hidden relative shadow-2xl">
             <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop" alt="Hero 1" className="object-cover w-full h-full" />
        </div>

        {/* Nature (Vertical Top Left - shifted down) */}
        <div className="col-span-1 row-span-2 rounded-[2rem] overflow-hidden relative mt-12 shadow-xl">
             <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=600&fit=crop" alt="Hero 2" className="object-cover w-full h-full" />
        </div>

        {/* Small Images Row Bottom */}
        <div className="col-span-1 row-span-1 rounded-[2rem] overflow-hidden relative shadow-lg">
             <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop" alt="Hero 3" className="object-cover w-full h-full" />
        </div>
        <div className="col-span-1 row-span-1 rounded-[2rem] overflow-hidden relative shadow-lg">
             <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" alt="Hero 4" className="object-cover w-full h-full" />
        </div>
        <div className="col-span-1 row-span-1 rounded-[2rem] overflow-hidden relative shadow-lg">
             <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop" alt="Hero 5" className="object-cover w-full h-full" />
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection