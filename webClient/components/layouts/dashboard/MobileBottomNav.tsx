"use client";

import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import {
  Home,
  UserCircle,
  Search,
  Plus,
  Pin,
  LayoutPanelLeft,
  Layers,
} from "lucide-react";
import {
  RiHome5Fill,
  RiSearch2Fill,
  RiUser2Fill,
} from "react-icons/ri";
import Link from "next/link";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import CreateBoardModal from "@/components/boards/popovers/CreateBoardModal";
import BottomSheet from "@/components/ui/BottomSheet";

interface DashboardLink {
  id: number;
  icon: React.ElementType;
  activeIcon: React.ElementType;
  href: string;
}

const createItems = [
  {
    id: 1,
    icon: Pin,
    title: "Pin",
    description: "Upload photos or videos",
    href: "/dashboard/create/pin",
  },
  {
    id: 2,
    icon: LayoutPanelLeft,
    title: "Board",
    description: "Organize your ideas",
    href: null,
  },
  {
    id: 3,
    icon: Layers,
    title: "Collage",
    description: "Create a visual mix",
    href: "/dashboard/create/collage",
  },
];

const BottomNavigator = () => {
  const pathname = usePathname();

  const [openSheet, setOpenSheet] = useState(false);
  const [openBoardDialog, setOpenBoardDialog] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);

  const bottomLinks: DashboardLink[] = [
    { id: 0, icon: Home, activeIcon: RiHome5Fill, href: "/dashboard" },
    { id: 1, icon: Search, activeIcon: RiSearch2Fill, href: "/dashboard/search" },
    { id: 2, icon: UserCircle, activeIcon: RiUser2Fill, href: "/dashboard/boards" },
  ];

  const showBottomBar = [
    "/dashboard",
    "/dashboard/search",
    "/dashboard/boards",
    "/dashboard/settings",
  ].includes(pathname);

  // SCROLL LOGIC
  useEffect(() => {
    if (!showBottomBar) return;

    const container = document.getElementById("dashboard-scroll");
    if (!container) return;

    const onScroll = () => {
      const currentY = container.scrollTop;
      const delta = currentY - lastScrollY.current;

      // Ignore tiny scrolls
      if (Math.abs(delta) < 5) return;

      if (currentY <= 10) {
        setIsVisible(true);
      } else if (delta > 0) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }

      lastScrollY.current = currentY;
    };

    container.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [showBottomBar]);

  const handleBoardClick = () => {
    setOpenSheet(false);
    setOpenBoardDialog(true);
  };

  const renderLink = (link: DashboardLink) => {
    const isActive =
      link.href === "/dashboard"
        ? pathname === "/dashboard"
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
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
        )}

        <span
          className={clsx(
            "relative z-10 transition-colors duration-300",
            isActive ? "text-white" : "text-slate-500"
          )}
        >
          <Icon size={24} />
        </span>
      </Link>
    );
  };

  if (!showBottomBar) return null;

  return (
    <>
      {/* Bottom Bar */}
      <motion.div
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm"
        animate={{
          y: isVisible ? 0 : 120,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between relative">
          <div className="bg-background/90 backdrop-blur-2xl border shadow-xl rounded-[2.5rem] p-2">
            <LayoutGroup>
              <div className="flex items-center gap-10">
                {bottomLinks.map(renderLink)}
              </div>
            </LayoutGroup>
          </div>

          {/* Create button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenSheet(true)}
            className="absolute -right-8 -translate-x-1/2 h-16 w-16 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-lg"
          >
            <Plus size={28} strokeWidth={3} />
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={openSheet}
        onClose={() => setOpenSheet(false)}
        maxHeight="45vh"
      >
        <div className="p-4">
          <h2 className="text-xl text-center font-semibold pb-4">Create</h2>

          <div className="flex flex-col gap-2">
            {createItems.map((item) =>
              item.id === 2 ? (
                <button
                  key={item.id}
                  onClick={handleBoardClick}
                  className="flex gap-4 items-center rounded-xl p-3 hover:bg-muted w-full text-left"
                >
                  <div className="p-4 rounded-xl bg-accent">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </button>
              ) : (
                <Link
                  key={item.id}
                  href={item.href as string}
                  onClick={() => setOpenSheet(false)}
                  className="flex gap-4 items-center rounded-xl p-3 hover:bg-muted"
                >
                  <div className="p-4 rounded-xl bg-accent">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </BottomSheet>

      <Dialog open={openBoardDialog} onOpenChange={setOpenBoardDialog}>
        <CreateBoardModal />
      </Dialog>
    </>
  );
};

export default BottomNavigator;
