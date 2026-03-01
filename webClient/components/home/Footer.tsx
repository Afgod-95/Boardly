"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const links = {
  Product: ["Features", "Explore", "How it Works", "FAQ"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');
      `}</style>

      <footer className="bg-slate-950 text-white overflow-hidden">

        {/* Top section */}
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <div className="grid lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-16">

            {/* Brand column */}
            <div className="space-y-6">
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.02 }}
                className="block"
              >
                <span
                  className="text-3xl font-black text-white tracking-[-0.04em]"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  boardly
                </span>
              </motion.button>

              <p
                className="text-[14px] text-white/40 leading-[1.85] max-w-[220px]"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                A visual platform to discover, save, and organize ideas into boards — beautifully.
              </p>

              {/* Social links */}
              <div className="flex gap-4 pt-2">
                {[
                  { label: "X", href: "https://x.com" },
                  { label: "IG", href: "https://instagram.com" },
                  { label: "LI", href: "https://linkedin.com" },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                    style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', letterSpacing: '0.04em' }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(links).map(([group, items]) => (
              <div key={group} className="space-y-5">
                <p
                  className="text-[10px] uppercase text-white/25"
                  style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.18em' }}
                >
                  {group}
                </p>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[14px] text-white/50 hover:text-white transition-colors duration-200 font-medium"
                        style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-white/5" />
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-[11px] text-white/20"
            style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.08em' }}
          >
            © {new Date().getFullYear()} Boardly. All rights reserved.
          </p>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-[11px] text-white/30 hover:text-white transition-colors duration-200"
            style={{ fontFamily: "'Geist Mono', monospace", letterSpacing: '0.1em' }}
          >
            BACK TO TOP
            <div className="w-6 h-6 rounded-full border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-all duration-200">
              <ArrowUpRight className="w-3 h-3 rotate-[-45deg]" />
            </div>
          </button>
        </div>

        {/* Giant wordmark */}
        <div className="w-full overflow-hidden select-none pointer-events-none" aria-hidden>
          <p
            className="text-[clamp(5rem,18vw,14rem)] font-black text-white/[0.03] leading-none tracking-[-0.05em] px-4 pb-2"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            boardly
          </p>
        </div>

      </footer>
    </>
  );
};

export default Footer;