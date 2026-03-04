"use client"

import React, { useEffect } from "react"
import ProfileHeader from "@/components/shared/headers/profile/ProfileHeader"
import TabNavigation from "@/components/boards/tabs/TabNavigation"
import { ActionButtons, CreateButton } from "@/components/shared/buttons"
import { PinsPopoverFilter, BoardsPopoverFilter } from "@/components/boards/tabs/tabFilters"
import { Settings2, Star } from "lucide-react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { setPinsFilter, setBoardsFilter, setCollagesFilter, setBoardsSortBy } from "@/redux/boardFilterSlice"
import { BoardsFilterView, PinsFilterView, CollagesFilterView, BoardsSortBy } from "@/types/board"
import Profile from "./Profile"

interface BoardsLayoutProps {
  children: React.ReactNode
}

const BoardsLayout = ({ children }: BoardsLayoutProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const layoutParam = searchParams.get("layout") as "compact" | "standard" | null
  const pinsLayout = layoutParam ?? "compact"

  // ---- Route helpers
  const isPinsTab = pathname === "/dashboard/boards/pins"
  const isBoardsTab = pathname === "/dashboard/boards"
  const isCollagesTab = pathname === "/dashboard/boards/collages"

  // This detects if we are on /dashboard/boards/[id] or deeper
  const isDetailView =
    (pathname.startsWith("/dashboard/boards/") && 
      pathname !== "/dashboard/boards/pins" && 
      pathname !== "/dashboard/boards/collages") ||
      pathname.startsWith("/dashboard/boards/pins/") ||
      pathname.startsWith("/dashboard/boards/collages/")

  const tabs = [
    { id: 1, name: "Pins", href: "/dashboard/boards/pins" },
    { id: 2, name: "Boards", href: "/dashboard/boards" },
    { id: 3, name: "Collages", href: "/dashboard/boards/collages" },
  ]

  // Redux state
  const dispatch = useDispatch()
  const pinsFilter = useSelector((state: RootState) => state.boardFilter?.pins?.activeFilter)
  const { activeFilter: boardsFilter, sortBy: boardsSortBy } = useSelector(
    (state: RootState) => state.boardFilter?.boards || { activeFilter: null, sortBy: "A-Z" }
  )
  const collagesFilter = useSelector((state: RootState) => state.boardFilter?.collages?.activeFilter)

  useEffect(() => {
    if (isPinsTab) {
      dispatch(setBoardsFilter(null))
      dispatch(setCollagesFilter(null))
    }
    if (isBoardsTab) {
      dispatch(setPinsFilter(null))
      dispatch(setCollagesFilter(null))
    }
    if (isCollagesTab) {
      dispatch(setPinsFilter(null))
      dispatch(setBoardsFilter(null))
    }
  }, [pathname, dispatch, isPinsTab, isBoardsTab, isCollagesTab])

  // ---- Filter handlers
  const handlePinsFilterChange = (filterKey: string | null) => {
    dispatch(setPinsFilter(filterKey as PinsFilterView))
  }

  const handleBoardsFilterChange = (filterKey: string | null) => {
    dispatch(setBoardsFilter(filterKey as BoardsFilterView))
  }

  const handleBoardsSortFilterChange = (value: BoardsSortBy) => {
    dispatch(setBoardsSortBy(value))
  }

  const handleCollagesFilterChange = (filterKey: string | null) => {
    dispatch(setCollagesFilter(filterKey as CollagesFilterView))
  }

  // ---- Action buttons config
  const pinsActionButtons = [
    { id: 1, icon: Settings2, onClick: () => console.log("Settings clicked") },
    { id: 2, icon: Star, label: "Favorites", filterKey: "favorites" },
    { id: 3, label: "Created by you", filterKey: "created" },
  ]

  const collagesActionButtons = [
    { id: 1, label: "Published", filterKey: "published" },
    { id: 2, label: "Draft", filterKey: "draft" },
  ]

  const boardsActionButtons = [
    { id: 1, icon: Settings2, onClick: () => console.log("Settings clicked") },
    { id: 2, label: "Group", filterKey: "group" },
  ]

  const handleLayoutChange = (newLayout: "compact" | "standard") => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("compact", newLayout)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <header className="sticky top-0 z-20 bg-background">
      
        {!isDetailView && (
          <div className="">
            <ProfileHeader />
          </div>
        )}

        {!isDetailView && (
          <div className="max-w-screen-6xl mx-auto px-3 sm:px-5">
            <div className='space-y-4 flex justify-center sm:justify-between items-center'>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold pb-4 hidden sm:block">
                Your saved ideas
              </h2>
              <Profile />
            </div>

            <TabNavigation tabs={tabs} />

            {/* Action Bar */}
            <div className="flex items-center justify-between w-full">
              {isPinsTab && (
                <ActionButtons
                  buttons={pinsActionButtons}
                  onFilterChange={handlePinsFilterChange}
                  activeFilterKey={pinsFilter ?? null}
                >
                  <PinsPopoverFilter value={pinsLayout} onChange={handleLayoutChange} />
                </ActionButtons>
              )}

              {isBoardsTab && (
                <ActionButtons
                  buttons={boardsActionButtons}
                  onFilterChange={handleBoardsFilterChange}
                  activeFilterKey={boardsFilter ?? null}
                >
                  <BoardsPopoverFilter
                    value={boardsSortBy}
                    onChange={handleBoardsSortFilterChange}
                  />
                </ActionButtons>
              )}

              {isCollagesTab && (
                <ActionButtons
                  buttons={collagesActionButtons}
                  onFilterChange={handleCollagesFilterChange}
                  activeFilterKey={collagesFilter ?? null}
                >
                  To be implemented
                </ActionButtons>
              )}
              <CreateButton />
            </div>
          </div>
        )}
      </header>

      <main>
        {children}
      </main>
    </div>
  )
}

export default BoardsLayout