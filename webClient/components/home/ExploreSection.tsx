"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/utils/animations/animations";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomButton from "../shared/buttons/CustomButton";

const images = [
  { src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&fit=crop", label: "Interior" },
  { src: "https://images.unsplash.com/photo-1505968409348-bd000797c92e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500&fit=crop", label: "Minimal" },
  { src: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D?w=500&fit=crop", label: "Beauty" },
  { src: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&fit=crop", label: "Design" },
];

const tags = ["Architecture", "Fashion", "Product Design", "Typography", "Photography", "Branding", "Nature"];

const ExploreSection = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');
    `}</style>

    <section className="py-10 md:py-28 overflow-hidden" id="explore">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col  gap-8 lg:gap-12 items-center mb-10 md:mb-16"
        >
          <div>
            <div className="flex items-center justify-center gap-3 mb-4 md:mb-5">
              <div className="w-5 h-px bg-slate-400" />
              <span
                className="uppercase text-slate-400"
                style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', letterSpacing: '0.18em' }}
              >
                Explore
              </span>
            </div>
            <h2
              className="text-[clamp(2rem,5vw,3.5rem)] font-black text-slate-900 leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              Explore ideas{" "}
              <span
                className="font-normal italic text-slate-400"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                right now.
              </span>
            </h2>
          </div>

          <div className="space-y-5">
            <p
              className="text-[15px] text-slate-500 leading-[1.85] max-w-sm text-center"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              Browse trending ideas even without signing up. No account needed to get inspired.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <CustomButton
                text="Browse Feed"
                icon={<ArrowUpRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                className="group bg-slate-900 hover:bg-slate-700 text-white rounded-full h-11 md:h-12 px-6 md:px-7 text-sm font-semibold tracking-wide uppercase transition-all duration-200"
                style={{ letterSpacing: '0.08em' }}
              />

              <CustomButton
                text="Sign up to save"
                className="border border-slate-200 hover:border-slate-400 text-slate-600 hover:text-slate-900 rounded-full h-11 md:h-12 px-6 md:px-7 text-[13px] font-semibold bg-transparent transition-all duration-200"
                style={{ letterSpacing: '0.08em' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Image strip — 2x2 grid on mobile, horizontal strip on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          {/* Mobile: 2x2 grid */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative h-44 rounded-2xl overflow-hidden shadow-md"
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover scale-[1.02] group-hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/40 to-transparent">
                  <span
                    className="text-[9px] text-white/80 uppercase"
                    style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.14em' }}
                  >
                    {img.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tablet: equal height row */}
          <div className="hidden md:flex lg:hidden gap-3 items-stretch">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="group relative flex-1 h-56 rounded-2xl overflow-hidden shadow-md"
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover scale-[1.02] group-hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span
                    className="text-[9px] text-white/80 uppercase"
                    style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.14em' }}
                  >
                    {img.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: staggered heights */}
          <div className="hidden lg:flex gap-4 items-end">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className={`group relative flex-1 rounded-3xl overflow-hidden shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12)] ${i % 2 === 0 ? "h-72" : "h-52"
                  }`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover scale-[1.02] group-hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span
                    className="text-[10px] text-white/80 uppercase"
                    style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.14em' }}
                  >
                    {img.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tag row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mt-5 md:mt-6"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="h-8 px-3 md:px-4 rounded-full border border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600 cursor-pointer transition-all duration-200 flex items-center"
              style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', letterSpacing: '0.1em' }}
            >
              {tag}
            </span>
          ))}
          <span
            className="h-8 px-3 md:px-4 rounded-full border border-slate-100 text-slate-300 flex items-center"
            style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', letterSpacing: '0.1em' }}
          >
            +40 more
          </span>
        </motion.div>

      </div>
    </section>
  </>
);

export default ExploreSection;