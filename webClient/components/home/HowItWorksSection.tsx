"use client";

import { motion } from "framer-motion";
import { Upload, Layout, Compass } from "lucide-react";
import { fadeInUp } from "@/utils/animations/animations";
import SectionWrapper from "./shared/SectionWrapper";

const steps = [
  {
    id: "01",
    icon: <Upload className="w-5 h-5" strokeWidth={1.5} />,
    title: "Upload or save ideas",
    desc: "Add your own media or save from others. Anything that sparks something worth keeping.",
  },
  {
    id: "02",
    icon: <Layout className="w-5 h-5" strokeWidth={1.5} />,
    title: "Organize into boards",
    desc: "Group content by project, style, or mood. Your boards, your structure.",
  },
  {
    id: "03",
    icon: <Compass className="w-5 h-5" strokeWidth={1.5} />,
    title: "Discover trends",
    desc: "Browse popular styles and current directions from a community of curators.",
  },
];

const HowItWorksSection = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');
    `}</style>

    <SectionWrapper id="how-it-works">

        {/* Header — left-right split */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="gap-5 md:gap-12 items-center mb-24"
        >

          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-5 h-px bg-slate-400" />
            <span
              className="uppercase text-slate-400"
              style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', letterSpacing: '0.18em' }}
            >
              The process
            </span>
          </div>
          <h2
            className="text-center text-[clamp(2.4rem,4vw,3.5rem)] font-black text-slate-900 leading-[1.05] tracking-[-0.03em]"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            How Boardly{" "}
            <span
              className="font-normal italic text-slate-400"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              works
            </span>
          </h2>
          <p
            className="text-[15px] text-center mt-5 text-slate-400 leading-[1.85]  lg:ml-auto"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Three simple steps from raw inspiration to a beautifully organized board.
          </p>

        </motion.div>

        {/* Timeline steps */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div
            className="hidden md:block absolute top-7 left-[calc(100%/6)] right-[calc(100%/6)] h-px z-0"
            style={{ background: 'repeating-linear-gradient(90deg, #e2e8f0 0px, #e2e8f0 6px, transparent 6px, transparent 14px)' }}
          />

          <div className="grid md:grid-cols-3 gap-10 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: i * 0.13 }}
                className="flex flex-col gap-7 p-5 border rounded-2xl"
              >
                {/* Icon circle on the timeline */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 shrink-0 rounded-full border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center justify-center text-slate-600">
                    {step.icon}
                  </div>
                  <span
                    className="text-[10px] text-slate-300 tabular-nums"
                    style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.12em' }}
                  >
                    Step {step.id}
                  </span>
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h3
                    className="text-[18px] font-bold text-slate-900 tracking-[-0.02em]"
                    style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-[14px] text-slate-500 leading-[1.8]"
                    style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
    </SectionWrapper>
  </>
);

export default HowItWorksSection;