"use client"

import PinsGrid from "@/components/pins/grid/PinsGrid"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useRouter, useSearchParams } from "next/navigation"
import { setSelectedPin } from "@/redux/pinSlice"
import { PinItem } from "@/types/pin"

const PinsPage = () => {
  const { pins } = useSelector((state: RootState) => state.pins)
  const dispatch = useDispatch();
  const router = useRouter()
  const searchParams = useSearchParams()
  const layoutParam = searchParams.get("layout") as "compact" | "standard" | null
  const pinsLayout = layoutParam ?? "compact"

  return (
    <PinsGrid
      items={pins}
      variant="pin"
      layout={pinsLayout}
      actions={{
        onItemClick: (item) => {
          dispatch(setSelectedPin(item));
          router.push(`/dashboard/pins/${item.id}`);
        },
      }}
    />
  )
}

export default PinsPage
