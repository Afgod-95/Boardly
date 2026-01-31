"use client";


import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, Sparkles, } from "lucide-react";
import { cn } from "@/lib/utils";


// --- Custom Icons ---

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// --- Reusable Auth Form Component ---

const AuthForm = ({ type }: { type: "login" | "signup" }) => {
  const isSignUp = type === "signup";

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "flex flex-col w-full max-w-[400px] sm:w-[380px] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/50",
        isSignUp ? "border-2 border-violet-100" : "border border-slate-100"
      )}
    >
      {isSignUp && (
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-8 text-white relative">
          <Sparkles className="absolute top-6 right-6 w-6 h-6 opacity-40 animate-pulse" />
          <h4 className="text-2xl font-bold tracking-tight">Join Boardly</h4>
          <p className="text-violet-100 text-sm mt-1">Discover and save your next big idea.</p>
        </div>
      )}

      <div className="p-8 space-y-6">
        {!isSignUp && (
          <div className="text-center space-y-1 mb-4">
            <h4 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h4>
            <p className="text-slate-500 text-sm">Pick up where you left off</p>
          </div>
        )}

        <div className="space-y-4">
          <Button variant="outline" className="w-full font-semibold border-slate-200 hover:bg-slate-50 rounded-2xl py-7 transition-all active:scale-[0.98]">
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-white px-4 text-slate-400">Or use email</span>
            </div>
          </div>

          <div className="space-y-3">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Username" className="pl-11 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-300 h-14 transition-all" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input type="email" placeholder="Email" className="pl-11 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-300 h-14 transition-all" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input type="password" placeholder="Password" className="pl-11 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-300 h-14 transition-all" />
            </div>
          </div>
        </div>

        <Button className={cn(
          "w-full rounded-2xl py-7 font-bold text-lg shadow-xl transition-all active:scale-[0.97]",
          isSignUp ? "bg-violet-600 hover:bg-violet-700 shadow-violet-200" : "bg-slate-900 hover:bg-slate-800"
        )}>
          {isSignUp ? "Create Account" : "Sign In"}
        </Button>

        <p className="text-center text-xs text-slate-400 leading-relaxed px-2">
          By continuing, you agree to Boardly&apos;s <span className="underline cursor-pointer hover:text-slate-600">Terms</span> & <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>.
        </p>
      </div>
    </motion.div>
  );
};


export default AuthForm