"use client"

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AuthForm from "./AuthForm";

type Mode = 'signup' | 'login'

interface Props {
  mode?: Mode
}

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.12,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const formVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir * 24,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -24,
    filter: "blur(4px)",
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  }),
};

const collageImages = [
  { src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&auto=format&fit=crop", aspect: "aspect-[3/4]", alt: "Inspo 1" },
  { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop", aspect: "aspect-square", alt: "Inspo 2" },
  { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop", aspect: "aspect-square", alt: "Inspo 3" },
];

export default function AuthPage({ mode = 'signup' }: Props) {
  const [currentMode, setCurrentMode] = useState<Mode>(mode);
  const [direction, setDirection] = useState(1);

  const switchMode = (next: Mode) => {
    setDirection(next === 'login' ? 1 : -1);
    setCurrentMode(next);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');
      `}</style>

      <div className="min-h-screen w-full flex bg-white">

        {/* LEFT SIDE: Visual Collage */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex lg:w-1/2 bg-neutral-50 relative items-center justify-center p-12 overflow-hidden border-r border-neutral-100"
        >
          {/* Subtle grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '128px',
            }}
          />

          <div className="relative z-10 w-full max-w-md space-y-10">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors duration-200 group"
                style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.08em' }}
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                BACK TO HOME
              </Link>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-1"
            >
              <h1
                className="text-[clamp(2.8rem,4vw,4rem)] font-black text-neutral-900 leading-[1.0] tracking-[-0.04em]"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                Get your next
              </h1>
              <h1
                className="text-[clamp(2.8rem,4vw,4rem)] font-normal italic text-neutral-400 leading-[1.0] tracking-[-0.02em]"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                great idea.
              </h1>
            </motion.div>

            {/* Masonry collage */}
            <div className="columns-2 gap-3">
              {collageImages.map((img, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`w-full ${img.aspect} rounded-2xl overflow-hidden mb-3 shadow-sm`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-[1.02] hover:scale-100"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE: Auth Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative overflow-hidden"
        >
          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-8 left-8 lg:hidden"
          >
            <span
              className="text-2xl font-black text-neutral-900 tracking-[-0.04em]"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              boardly
            </span>
          </motion.div>

          <div className="w-full max-w-sm flex flex-col items-center gap-8">
            {/* Animated form swap */}
            <div className="w-full relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentMode}
                  custom={direction}
                  variants={formVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full"
                >
                  <AuthForm type={currentMode} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mode switcher */}
            <motion.div
              layout
              className="flex items-center gap-2"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              <span className="text-[14px] text-neutral-400">
                {currentMode === "signup" ? "Already have an account?" : "Don't have an account?"}
              </span>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => switchMode(currentMode === "signup" ? "login" : "signup")}
                className="text-[14px] font-bold text-neutral-900 hover:text-neutral-600 transition-colors duration-200 underline underline-offset-4 decoration-neutral-200 hover:decoration-neutral-400"
              >
                {currentMode === "signup" ? "Log In" : "Sign Up Free"}
              </motion.button>
            </motion.div>
          </div>

          {/* Soft background blobs — muted, no color */}
          <div className="absolute -z-10 top-1/4 right-0 w-72 h-72 bg-neutral-100 blur-[120px] rounded-full opacity-60" />
          <div className="absolute -z-10 bottom-1/4 left-0 w-72 h-72 bg-neutral-100 blur-[120px] rounded-full opacity-60" />
        </motion.div>

      </div>
    </>
  );
}