"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setPins, setSelectedPin, setLoading } from "@/redux/pinSlice";
import { PinItem } from "@/types/pin";
import { PinCard } from "../card";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/utils/animations";
import clsx from "clsx";
import usePinHook from "../hooks/usePinHook";
import PinsGrid from "../grid/PinsGrid";
//import usePinsHook from "@/hooks/usePinsHook";

const PinsFeed = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { pins, isLoading } = useSelector((state: RootState) => state.pins);

    //local states and actions 
    const { hoveredIndex, hoveredItem } = usePinHook()


    useEffect(() => {
        const fetchPins = async () => {
            try {
                dispatch(setLoading(true));
                const res = await fetch("/api/pins", {
                    next: { revalidate: 60 },
                });

                if (!res.ok) throw new Error("Failed to fetch pins");

                const data: PinItem[] = await res.json();
                dispatch(setPins(data));
            } catch (error) {
                console.error("Error fetching pins:", error);
                dispatch(setLoading(false));
            }
        };

        if (pins.length === 0) {
            fetchPins();
        }
    }, [dispatch, pins.length]);




    return (
        <>
            {isLoading && pins.length === 0 ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700" />
                </div>
            ) : (
                <>
                    <div className="w-full pb-24">
                        <PinsGrid variant = 'feed' items={pins}/>
                    </div>
                </>
            )}
        </>
    );
};

export default PinsFeed;
