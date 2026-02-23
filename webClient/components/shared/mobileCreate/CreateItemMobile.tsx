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


interface MobileCreateProps {
    openSheet?: boolean;
    setOpenSheet: (open: boolean) => void;
    openBoardDialog?: boolean;
    setOpenBoardDialog: (open: boolean) => void
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



const CreateItemMobile = ({ openBoardDialog, setOpenBoardDialog, ...props }: MobileCreateProps) => {



    const handleBoardClick = () => {
        props.setOpenSheet(false);
        setOpenBoardDialog(true);
    };

    return (
        <>

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
                                onClick={() => props.setOpenSheet(false)}
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

        </>
    );
};

export default CreateItemMobile;
