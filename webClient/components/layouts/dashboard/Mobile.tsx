"use client";

import { usePathname } from 'next/navigation';
import { motion, LayoutGroup } from 'framer-motion';
import { Home, UserCircle, Search, Plus, Settings } from 'lucide-react';
import { RiHome5Fill, RiSearch2Fill, RiUser2Fill, RiSettings2Fill } from 'react-icons/ri';
import Link from 'next/link';
import clsx from 'clsx';
import { useState } from 'react';
import { Pin, LayoutPanelLeft, Layers } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import CreateBoardModal from '@/components/modals/CreateBoardModal';
import BottomSheet from '@/components/ui/BottomSheet';

interface DashboardLink {
  id: number;
  icon: React.ElementType;
  activeIcon: React.ElementType;
  href: string;
}

const createItems = [
  { id: 1, icon: Pin, title: "Pin", description: "Upload photos or videos", href: "/dashboard/create/pin" },
  { id: 2, icon: LayoutPanelLeft, title: "Board", description: "Organize your ideas", href: null },
  { id: 3, icon: Layers, title: "Collage", description: "Create a visual mix", href: "/dashboard/create/collage" },
];

const BottomNavigator = () => {
  const pathname = usePathname();
  const [openSheet, setOpenSheet] = useState(false);
  const [openBoardDialog, setOpenBoardDialog] = useState(false);

  const bottomLinks: DashboardLink[] = [
    { id: 0, icon: Home, activeIcon: RiHome5Fill, href: '/dashboard' },
    { id: 1, icon: Search, activeIcon: RiSearch2Fill, href: '/dashboard/search' },
    { id: 2, icon: UserCircle, activeIcon: RiUser2Fill, href: '/dashboard/boards' },
  ];

  const showBottomBar = ['/dashboard', '/dashboard/search', '/dashboard/boards', '/dashboard/settings'].includes(pathname);

  const handleBoardClick = () => {
    setOpenSheet(false);
    setOpenBoardDialog(true);
  };

  const renderLink = (link: DashboardLink) => {
    const isActive = link.href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(link.href);
    const Icon = isActive ? link.activeIcon : link.icon;

    return (
      <Link
        key={link.id}
        href={link.href}
        className="relative flex items-center justify-center h-12 w-12"
      >
        {isActive && (
          <motion.span
            layoutId="pill"
            className="absolute inset-0 bg-violet-600 rounded-full"
            transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 1 }}
          />
        )}
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
    <>
      {showBottomBar && (
        <>
          {/* Bottom Navigator */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm md:hidden">
            <div className="bg-background/90 backdrop-blur-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-2 flex items-center justify-between relative">

              {/* Left Links */}
              <LayoutGroup>
                <div className="flex items-center gap-4">
                  {bottomLinks.map(renderLink)}
                </div>
              </LayoutGroup>

              {/* Centered Create Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenSheet(true)}
                className="absolute -right-8 -translate-x-1/2 h-16 w-16 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-violet-200/50 active:bg-violet-700 z-10"
              >
                <Plus size={28} strokeWidth={3} />
              </motion.button>
            </div>
          </div>

          {/* Bottom Sheet */}
          <BottomSheet
            isOpen={openSheet}
            onClose={() => setOpenSheet(false)}
            maxHeight="45vh"
          >
            <div className="p-4">
              <h2 className="text-xl text-center font-semibold pb-4">Create</h2>
              <div className="flex flex-col gap-2">
                {createItems.map(item => (
                  <div key={item.id}>
                    {item.id === 2 ? (
                      <button
                        onClick={handleBoardClick}
                        className={clsx(
                          "flex gap-4 items-center rounded-xl p-3 hover:bg-muted transition-colors w-full text-left"
                        )}
                      >
                        <div className="p-4 rounded-xl bg-accent">
                          <item.icon size={22} />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </button>
                    ) : (
                      <Link
                        href={item.href as string}
                        onClick={() => setOpenSheet(false)}
                        className="flex gap-4 items-center rounded-xl p-3 hover:bg-muted transition-colors"
                      >
                        <div className="p-4 rounded-xl bg-accent">
                          <item.icon size={22} />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </BottomSheet>

          {/* Dialog outside of BottomSheet */}
          <Dialog open={openBoardDialog} onOpenChange={setOpenBoardDialog}>
            <CreateBoardModal />
          </Dialog>
        </>
      )}
    </>
  );
};

export default BottomNavigator;