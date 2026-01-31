import { timeAgoShort } from "@/lib/timeAgo";
import { useEffect, useState } from "react";

export default function useTimeAgo(date: string | number | Date){
    const [text, setText] = useState<string | number | Date>(() => {
        return timeAgoShort(date)
    })
    useEffect(() => {
        const interval = setInterval(() => {
            setText(timeAgoShort(date))
        }, 60000)

        return () => clearInterval(interval)
    })
    return text
}