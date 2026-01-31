"use client"

import PinsGrid from "@/components/pins/grid/PinsGrid"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useRouter, useSearchParams } from "next/navigation"
import { setSelectedPin } from "@/redux/pinSlice"
import { useMemo } from "react"

const PinsPageContent = () => {
  const { pins } = useSelector((state: RootState) => state.pins)
  const activeFilter = useSelector((state: RootState) => state?.boardFilter?.pins?.activeFilter)
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const layoutParam = searchParams.get("layout") as "compact" | "standard" | null
  const pinsLayout = layoutParam ?? "compact"

  // Filter pins based on active filter
  const filteredPins = useMemo(() => {
    if (!activeFilter) return pins // Show all pins if no filter

    if (activeFilter === 'favorites') {
      return pins.filter(pin => pin.isFavourite === true)
    }

    if (activeFilter === 'created') {
      return pins.filter(pin => pin.createdByUser === true)
    }

    return pins
  }, [pins, activeFilter])

  return (
    <div className="pb-20">
      {filteredPins.length > 0 ? (
        <PinsGrid
          items={filteredPins}
          variant="pin"
          layout={pinsLayout}
          actions={{
            onItemClick: (item) => {
              dispatch(setSelectedPin(item))
              router.push(`/dashboard/pins/${item.id}`)
            },
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground mb-2">
            {activeFilter === 'favorites' && "No favourite pins yet"}
            {activeFilter === 'created' && "No pins created yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {activeFilter === 'favorites' && "Start favouriting pins to see them here"}
            {activeFilter === 'created' && "Start creating your own pins!"}
          </p>
        </div>
      )}
    </div>
  )
}

export default PinsPageContent