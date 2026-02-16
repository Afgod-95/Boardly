"use client";

import React from "react";
import {
    Download,
    Flag,
    Link2,
    EyeOff,
    Info,
    ChevronRight,
    Check
} from "lucide-react";
import { motion } from "framer-motion";
import { PinItem } from "@/types/pin";
import { useState } from "react";

interface MoreOptionsPopoverContentProps {
    pin: PinItem;
}

const MoreOptionsPopoverContent = ({ pin }: MoreOptionsPopoverContentProps) => {
    const [copied, setCopied] = useState(false);
    const tapEffect = { scale: 0.98 };

    // Helper to handle downloading
    const handleDownload = async () => {
        try {
            const imageUrl = pin.video || pin.img;
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            // Extract filename or use title
            link.download = `${pin.title?.replace(/\s+/g, "-").toLowerCase() || "download"}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Failed to download resource", err);
        }
    };

    const handleCopyLink = () => {
        // Replace with your actual route logic
        const pinUrl = `${window.location.origin}/pin/${pin.id}`;
        navigator.clipboard.writeText(pinUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isVideo = !!pin.video;

    return (
        <div className="mx-auto bg-background overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Options
                </span>
            </div>

            <div className="flex flex-col gap-1 p-1">
                {/* DYNAMIC DOWNLOAD ACTION */}
                <motion.button
                    whileTap={tapEffect}
                    onClick={handleDownload}
                    className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full group-hover:bg-background transition-colors">
                            <Download size={18} className="text-foreground" />
                        </div>
                        <span className="text-sm font-semibold">
                            Download {isVideo ? "video" : "image"}
                        </span>
                    </div>
                </motion.button>

                {/* COPY LINK ACTION */}
                <motion.button
                    whileTap={tapEffect}
                    onClick={handleCopyLink}
                    className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full group-hover:bg-background transition-colors">
                            {copied ? (
                                <Check size={18} className="text-green-600" />
                            ) : (
                                <Link2 size={18} className="text-foreground" />
                            )}
                        </div>
                        <span className="text-sm font-semibold">
                            {copied ? "Link copied!" : "Copy link"}
                        </span>
                    </div>
                </motion.button>

                {/* HIDE ACTION */}
                <motion.button
                    whileTap={tapEffect}
                    className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full group-hover:bg-background transition-colors">
                            <EyeOff size={18} className="text-foreground" />
                        </div>
                        <span className="text-sm font-semibold">Hide Pin</span>
                    </div>
                </motion.button>
            </div>

            {/* SEPARATOR */}
            <div className="h-[1px] bg-border my-2 mx-4" />

            <div className="flex flex-col gap-1 p-1 pb-2">
                {/* REPORT ACTION */}
                <motion.button
                    whileTap={tapEffect}
                    className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-destructive/10 transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-destructive/5 rounded-full group-hover:bg-background transition-colors">
                            <Flag size={18} className="text-destructive" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold text-destructive">Report Pin</span>
                            <span className="text-[10px] text-muted-foreground leading-none mt-1">
                                Against community guidelines
                            </span>
                        </div>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground" />
                </motion.button>
            </div>

            {/* FOOTER INFO */}
            <div className="px-4 py-3 bg-muted/30 flex items-start gap-2 border-t">
                <Info size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-[11px] text-muted-foreground leading-tight">
                    This Pin is inspired by {pin.title || "your recent activity"}
                </span>
            </div>
        </div>
    );
};

export default MoreOptionsPopoverContent;