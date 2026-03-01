"use client"

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { fadeInUp } from "@/utils/animations";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const HeroSection = () => (
  <section className="relative pt-10 md:pt-24 pb-32 px-6 overflow-hidden max-w-7xl mx-auto">
    {/* Subtle grain texture overlay */}
    <div 
      className="pointer-events-none absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }}
    />


    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* Left Text */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="space-y-10 max-w-xl"
      >
        {/* Eyebrow label */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-px bg-slate-900" />
          <span 
            className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500"
            style={{ fontFamily: "'DM Mono', 'Fira Mono', monospace" }}
          >
            Visual Inspiration Platform
          </span>
        </div>

        <h1 
          className="text-[clamp(3rem,6vw,5.5rem)] font-black text-slate-900 leading-[1.05] tracking-[-0.03em]"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
        >
          Collect<br />
          Ideas.<br />
          <span className="italic font-normal text-slate-400">Organize</span><br />
          Inspiration.
        </h1>

        <p 
          className="text-base text-slate-500 leading-[1.8] max-w-sm"
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.01em' }}
        >
          A visual platform to discover, save, and organize ideas into boards — beautifully.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link 
            href={'/dashboard'}
            className="items-center flex group bg-slate-900 hover:bg-slate-700 text-white rounded-full h-14 px-8 text-sm font-semibold tracking-wide uppercase transition-all duration-200"
            style={{ letterSpacing: '0.08em' }}
          >
            Get Started Free
            <ArrowUpRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Button 
            size="lg" 
            variant="outline"
            className="group border text-slate-700 hover:text-slate-900 rounded-full h-14 px-8 text-sm font-semibold tracking-wide uppercase bg-transparent transition-all duration-200"
            style={{ letterSpacing: '0.08em' }}
          >
            View Demo
          </Button>
        </div>

        {/* Stats row */}
        <div className="flex gap-8 pt-4 border-t ">
          {[["12k+", "Boards Created"], ["4.8", "Avg Rating"], ["Free", "To Start"]].map(([val, label]) => (
            <div key={label} className="space-y-1">
              <p 
                className="text-2xl font-black text-slate-900 tracking-tight"
              >
                {val}
              </p>
              <p 
                className="text-xs text-slate-400 uppercase tracking-[0.12em]"
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right Image Collage */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-135 w-full hidden lg:grid grid-cols-3 grid-rows-3 gap-3"
      >
        {/* Large image — top left spanning 2×2 */}
        <div className="col-span-2 row-span-2 rounded-none overflow-hidden relative shadow-[0_32px_64px_-12px_rgba(0,0,0,0.18)]">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
            alt="Hero 1"
            className="object-cover w-full h-full scale-[1.02] hover:scale-100 transition-transform duration-700"
          />
          {/* Inner top-left label */}
          <span 
            className="absolute bottom-4 left-4 text-[10px] text-white/70 uppercase tracking-[0.15em]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Featured
          </span>
        </div>

        {/* Tall right image */}
        <div className="col-span-1 row-span-2 rounded-none overflow-hidden relative mt-10 shadow-[0_24px_48px_-8px_rgba(0,0,0,0.14)]">
          <img
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=600&fit=crop"
            alt="Hero 2"
            className="object-cover w-full h-full scale-[1.02] hover:scale-100 transition-transform duration-700"
          />
        </div>

        {/* Bottom row — 3 small images */}
        {[
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
        ].map((src, i) => (
          <div key={i} className="col-span-1 row-span-1 rounded-none overflow-hidden relative shadow-md">
            <img
              src={src}
              alt={`Hero ${i + 3}`}
              className="object-cover w-full h-full scale-[1.02] hover:scale-100 transition-transform duration-700"
            />
          </div>
        ))}

        {/* Decorative corner bracket */}
        <div className="absolute -bottom-4 -right-4 w-12 h-12  border-b-2 border-r-2 border-slate-900/15 pointer-events-none" />
        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-slate-900/15 pointer-events-none" />
      </motion.div>
    </div>

    {/* Bottom rule */}
    <div className="absolute bottom-0 left-6 right-6 h-px bg-slate-900/10" />
  </section>
);

export default HeroSection;