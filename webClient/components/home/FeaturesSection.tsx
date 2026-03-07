"use client";

import { Upload, Globe, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/utils/animations/animations";
import SectionWrapper from "./shared/SectionWrapper";

const features = [
  {
    icon: <Bookmark className="w-5 h-5" strokeWidth={1.5} />,
    tag: "01",
    title: "Save Ideas",
    desc: "Pin anything that sparks something. Build a personal library of inspiration that's always within reach.",
    stat: "12k+",
    statLabel: "Boards saved",
  },
  {
    icon: <Upload className="w-5 h-5" strokeWidth={1.5} />,
    tag: "02",
    title: "Upload Content",
    desc: "Share your own work and ideas with a community that cares about craft, aesthetics, and originality.",
    stat: "3.4k",
    statLabel: "Daily uploads",
  },
  {
    icon: <Globe className="w-5 h-5" strokeWidth={1.5} />,
    tag: "03",
    title: "Discover Trends",
    desc: "Explore what's moving across categories — from architecture to fashion to product design.",
    stat: "50+",
    statLabel: "Categories",
  },
];

const FeaturesSection = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');
    `}</style>

  <SectionWrapper id="features">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-5 h-px bg-neutral-400" />
            <span
              className="uppercase text-neutral-400"
              style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', letterSpacing: '0.18em' }}
            >
              Features
            </span>
          </div>
          <h2
            className="text-center max-w-2xl text-[clamp(2.4rem,4vw,3.5rem)] font-black  leading-[1.05] tracking-[-0.03em]"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Everything you need to{" "}
            <span
              className="font-normal italic text-neutral-400"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              capture
            </span>{" "}
            inspiration.
          </h2>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className={`group rounded-3xl border p-10 flex flex-col justify-between gap-10 min-h-75 transition-all duration-300 hover:shadow-2xl ${i === 1
                ? "bg-neutral-900 border-neutral-800"
                : "bg-background hover:border-neutral-200"
                }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 ${i === 1
                  ? "bg-white/10 text-white/70 group-hover:bg-white/15"
                  : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
                  }`}>
                  {f.icon}
                </div>
                <span
                  className={`text-[10px] tabular-nums ${i === 1 ? "text-white/20" : "text-neutral-300"}`}
                  style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.1em' }}
                >
                  {f.tag}
                </span>
              </div>

              {/* Text */}
              <div className="space-y-3">
                <h3
                  className={`text-[18px] font-bold tracking-[-0.02em] ${i === 1 ? "text-white" : "text-neutral-900"}`}
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p
                  className={`text-[14px] leading-[1.8] ${i === 1 ? "text-white/40" : "text-neutral-500"}`}
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  {f.desc}
                </p>
              </div>

              {/* Bottom stat */}
              <div className={`pt-4 border-t ${i === 1 ? "border-white/10" : "border-neutral-100"}`}>
                <p
                  className={`text-2xl ${i === 1 ? "text-white/90" : "text-neutral-800"}`}
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {f.stat}
                </p>
                <p
                  className={`text-[10px] mt-1 uppercase ${i === 1 ? "text-white/25" : "text-neutral-400"}`}
                  style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.14em' }}
                >
                  {f.statLabel}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

     </SectionWrapper>
  </>
);

export default FeaturesSection;