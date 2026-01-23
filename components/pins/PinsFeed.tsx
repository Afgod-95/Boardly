"use client"
import { useEffect } from "react";
import PinsGrid from "./grid/PinsGrid";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setPins, setSelectedPin, setLoading } from "@/redux/pinSlice";
import { PinItem } from "@/types/pin";

const PinsFeed = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { pins, isLoading } = useSelector((state: RootState) => state.pins);

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
                <PinsGrid
                    variant="feed"
                    items={pins}
                    actions={{
                        onItemClick: (item) => {
                            dispatch(setSelectedPin(item));
                            router.push(`/dashboard/pins/${item.id}`);
                        },
                    }}
                />
            )}
        </>
    );
};

export default PinsFeed;
