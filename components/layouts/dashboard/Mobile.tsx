"use client";

import { usePathname } from 'next/navigation';
import { motion, LayoutGroup } from 'framer-motion';
import { Home, UserCircle, Search, Plus, LucideIcon, Settings } from 'lucide-react';
import { RiHome5Fill, RiSearch2Fill, RiSettings2Fill, RiUser2Fill } from 'react-icons/ri';
import Link from 'next/link';
import clsx from 'clsx';
import { useRef, useState } from 'react';

interface DashboardLink {
  id: number;
  icon: LucideIcon;
  activeIcon: React.ElementType;
  href: string;
}

const BottomNavigator = () => {
  const pathname = usePathname();

  const bottomLinks: DashboardLink[] = [
    { id: 0, icon: Home, activeIcon: RiHome5Fill, href: '/dashboard' },
    { id: 1, icon: Search, activeIcon: RiSearch2Fill, href: '/dashboard/search' },
    { id: 2, icon: UserCircle, activeIcon: RiUser2Fill, href: '/dashboard/boards' },
  ];

  const renderLink = (link: DashboardLink) => {
    // FIX: Check if current path starts with link.href to handle sub-routes
    // Special case for dashboard root so it doesn't match everything
    const isActive = link.href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(link.href);

    const Icon = isActive ? link.activeIcon : link.icon;

    return (
      <Link
        key={link.id}
        href={link.href}
        className="relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 group"
      >
        {/* The Animated Pill Background */}
        {isActive && (
          <motion.span
            layoutId='tween'
            className="absolute inset-0 bg-slate-900 rounded-full"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 1
            }}
          />
        )}

        {/* The Icon */}
        <span className={clsx(
          "relative z-10 transition-colors duration-300",
          isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900"
        )}>
          <Icon size={24} />
        </span>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm md:hidden">
      <div className="bg-background/90 backdrop-blur-2xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-2 flex items-center justify-between">

        {/* Navigation Group with LayoutGroup for better animation sync */}
        <LayoutGroup>
          <div className="flex items-center gap-1">
            {bottomLinks.map(renderLink)}
          </div>
        </LayoutGroup>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-200 mx-2" />

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-12 w-12 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-violet-200/50 active:bg-violet-700"
        >
          <Plus size={24} strokeWidth={3} />
        </motion.button>

      </div>
    </div>
  );
};

export default BottomNavigator;