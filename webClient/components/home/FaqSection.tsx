"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import SectionWrapper from "./shared/SectionWrapper";

const faqs = [
  {
    q: "Is Boardly free to use?",
    a: "Yes — Boardly is completely free to get started. You can create boards, save ideas, and explore trending content without paying anything. We offer optional pro features for power users.",
  },
  {
    q: "Do I need an account to browse?",
    a: "No account needed to explore. You can browse trending ideas and public boards freely. To save ideas or create your own boards, a quick sign-up is all it takes.",
  },
  {
    q: "How do I organize my saved ideas?",
    a: "You create boards — think of them as folders with a visual twist. Drag ideas in, name your boards, and group them by project, mood, aesthetic, or anything you like.",
  },
  {
    q: "Can I upload my own content?",
    a: "Absolutely. Upload images, screenshots, or links and they'll live on your board alongside anything you've saved from the community.",
  },
  {
    q: "Is my content private by default?",
    a: "You control visibility. Boards are private by default — you choose when (and if) to make them public or share them with collaborators.",
  },
  {
    q: "What makes Boardly different from Pinterest?",
    a: "Boardly is built for intentional curation, not endless scrolling. We focus on clean organization, distraction-free saving, and a community of people who care about craft and ideas.",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');
      `}</style>

      <SectionWrapper id="faqs">
              <div className="w-full grid lg:grid-cols-[1fr_1.6fr] gap-20 items-center md:items-start justify-start">

            {/* Left — sticky header */}
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="flex items-center gap-3 md:justify-none justify-center md:justify-start">
                <div className="w-5 h-px bg-slate-400" />
                <span
                  className="uppercase text-slate-400"
                  style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', letterSpacing: '0.18em' }}
                >
                  FAQ
                </span>
              </div>

              <h2
                className="md:text-start text-center text-[clamp(2.6rem,4vw,3.8rem)] font-black text-slate-900 leading-none tracking-[-0.03em]"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                Questions,{" "}
                <br />
                <span
                  className="font-normal italic text-slate-400"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  answered.
                </span>
              </h2>

              <p
                className="text-center md:text-start text-[15px] text-slate-500 leading-[1.8] max-w-65 mx-auto md:mx-0"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                Still curious? Reach us anytime at{" "}
                <span className="text-slate-800 font-semibold">hello@boardly.io</span>
              </p>

              {/* Decorative count */}
              <p
                className="text-[11px] text-slate-300 pt-4"
                style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.12em' }}
              >
                {faqs.length} questions
              </p>
            </div>

            {/* Right — accordion */}
            <div className="divide-y divide-slate-100 w-full">
              {faqs.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-6 py-7 text-left group"
                    >
                      <div className="flex items-center gap-5">
                        <span
                          className="text-[10px] text-slate-300 mt-1 tabular-nums shrink-0"
                          style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.1em' }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className="text-[17px] font-bold text-slate-900 group-hover:text-slate-600 transition-colors duration-200 leading-snug"
                          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                        >
                          {faq.q}
                        </span>
                      </div>

                      {/* Plus / minus icon */}
                      <div className="shrink-0 mt-0.5 w-7 h-7 rounded-full border group-hover:border-slate-400 flex items-center justify-center transition-all duration-200">
                        <motion.div
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Plus className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
                        </motion.div>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden w-full"
                        >
                          <p
                            className="pl-9 pb-7 text-[15px] text-slate-500 leading-[1.85] max-w-lg"
                            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                          >
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

          </div>
      </SectionWrapper>
    </>
  );
};

export default FAQSection;