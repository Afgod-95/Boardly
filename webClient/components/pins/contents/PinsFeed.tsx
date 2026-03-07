"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setPins, setLoading } from "@/redux/pinSlice";
import { PinItem } from "@/types/pin";
import SmartPinsGrid from "@/components/shared/grid/SmartPinsGrid";

const PinsFeed = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { pins, isLoading } = useSelector((state: RootState) => state.pins);

    const fetchPins = async () => {
        try {
            dispatch(setLoading(true));
            const res = await fetch("/api/pins", {
                next: { revalidate: 60 },
                cache: 'force-cache'
            });

            if (!res.ok) throw new Error("Failed to fetch pins");

            const data: PinItem[] = await res.json();
            dispatch(setPins(data));
        } catch (error) {
            console.error("Error fetching pins:", error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        // Only fetch if we have no pins yet — avoids re-fetching on every mount
        // and wiping any isSaved/boardId state the user has set this session
        if (pins.length === 0) {
            fetchPins();
        }
    }, []);  // empty deps — run once on mount only

    if (pins.length === 0 && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-semibold mb-4">No Pins Found</h2>
                <p className="text-gray-500">Try creating a new pin or check back later.</p>
            </div>
        );
    }

    return (
        <div className="w-full pt-5 pb-24">
            <SmartPinsGrid
                variant="feed"
                isLoading={isLoading}
                items={pins}
                showMetadata={true}
            />
        </div>
    );
};

export default PinsFeed;