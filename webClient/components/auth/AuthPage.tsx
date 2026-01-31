"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AuthForm from "./AuthForm";

 

type Mode ='signup' | 'login'

interface Props {
    mode?: Mode
}

export default function AuthPage({ mode = 'signup' } : Props) {

    const [currentMode, setCurrentMode] = useState<Mode>(mode)
 

  return (
    <div className="min-h-screen w-full flex bg-slate-50/50">
      
      {/* LEFT SIDE: Visual Collage (Visible only on Large Screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative items-center justify-center p-12 overflow-hidden border-r border-slate-100">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`}} />
        
        <div className="relative z-10 w-full max-w-lg space-y-8">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center text-sm font-semibold text-violet-600 hover:gap-2 transition-all gap-1 group">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <h1 className="text-6xl font-black text-slate-900 leading-tight tracking-tighter">
              Get your next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">
                great idea.
              </span>
            </h1>
          </div>

          {/* Simple Masonry Visual for Pinterest Feel */}
          <div className="columns-2 gap-4 space-y-4">
            <div className="w-full aspect-[3/4] rounded-[2rem] bg-violet-100 overflow-hidden shadow-sm">
                <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Inspo 1"/>
            </div>
            <div className="w-full aspect-square rounded-[2rem] bg-blue-100 overflow-hidden shadow-sm">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Inspo 2"/>
            </div>
            <div className="w-full aspect-square rounded-[2rem] bg-indigo-100 overflow-hidden shadow-sm">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Inspo 3"/>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form (Mobile Friendly) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative">
        {/* Mobile Logo Link */}
        <div className="absolute top-8 left-8 lg:hidden">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">boardly</span>
        </div>

        <div className="w-full flex flex-col items-center gap-8">
          <AnimatePresence>
            {currentMode === "login" ? (
              <AuthForm key="login" type="login" />
            ) : (
              <AuthForm key="signup" type="signup" />
            )}
          </AnimatePresence>

          {/* Form Switcher Toggle */}
          <motion.div 
            layout
            className="flex items-center gap-2 text-sm text-slate-500 font-medium"
          >
            {currentMode === "signup" ? "Already have an account?" : "Don't have an account yet?"}
            <button 
              onClick={() => setCurrentMode(currentMode === "signup" ? "login" : "signup")}
              className="text-violet-600 font-bold hover:underline underline-offset-4"
            >
              {currentMode === "signup" ? "Log In" : "Sign Up Free"}
            </button>
          </motion.div>
        </div>

        {/* Floating Background Glows */}
        <div className="absolute -z-10 top-1/4 right-1/4 w-64 h-64 bg-violet-200/30 blur-[100px] rounded-full" />
        <div className="absolute -z-10 bottom-1/4 left-1/4 w-64 h-64 bg-indigo-200/30 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}