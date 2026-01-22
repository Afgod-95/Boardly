"use client"

import React from "react"
import ProfileHeader from "../headers/profile/ProfileHeader"
import TabNavigation from "../boards/tabs/TabNavigation"
import { ActionButtons, CreateButton } from "../buttons"
import { PinsDropdownFilter, BoardsPopoverFilter } from "../boards/tabFilters"
import { Settings2, Star, FolderOpen } from "lucide-react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"

interface BoardsLayoutProps {
  children: React.ReactNode
  onFilterChange?: (filterKey: string | null) => void
}

const BoardsLayout = ({ children, onFilterChange }: BoardsLayoutProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const layoutParam = searchParams.get("layout") as "compact" | "standard" | null
  const pinsLayout = layoutParam ?? "compact"

  // ---- Route helpers
  const isPinsTab = pathname === "/dashboard/boards/pins"
  const isBoardsTab = pathname === "/dashboard/boards"
  const isCollagesTab = pathname === "/dashboard/boards/collages"

  // Check if we are in a detail view (e.g., /dashboard/boards/123)
  // This checks if the pathname has more segments than the base tabs
  const isDetailView =
    (pathname.startsWith("/dashboard/boards/") && pathname !== "/dashboard/boards/pins" && pathname !== "/dashboard/boards/collages")
    // This part specifically catches /dashboard/boards/[id]
    || pathname.startsWith("/dashboard/boards/pins/")
    || pathname.startsWith("/dashboard/boards/collages/")

  const tabs = [
    { id: 1, name: "Pins", href: "/dashboard/boards/pins" },
    { id: 2, name: "Boards", href: "/dashboard/boards" },
    { id: 3, name: "Collages", href: "/dashboard/boards/collages" },
  ]

  // ---- Action buttons

  const pinsActionButtons = [
    { id: 1, icon: Settings2, onClick: () => console.log("Settings clicked") },
    { id: 2, icon: Star, label: "Favorites", filterKey: "favorites" },
    { id: 3, label: "Created by you", filterKey: "created" },

  ]

  //------------Collages Action Buttons 
  const collagesActionButtons = [
    { id: 1, label: "Published", onClick: () => console.log("Settings clicked") },
    { id: 2, label: "Draft", onClick: () => console.log("Group clicked") },
  ]


  //------------Boards Action Buttons 
  const boardsActionButtons = [
    { id: 1, icon: Settings2, onClick: () => console.log("Settings clicked") },
    { id: 2, icon: FolderOpen, label: "Group", onClick: () => console.log("Group clicked") },
  ]



  const handleLayoutChange = (newLayout: "compact" | "standard") => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("layout", newLayout)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <header className="sticky top-0 z-50 bg-background hidden md:block">
        <ProfileHeader />
        {!isDetailView && (
          <>
            <TabNavigation tabs={tabs} />

            {/* Action Bar */}
            <div className="flex items-center justify-between w-full">
              {isPinsTab && (
                <ActionButtons buttons={pinsActionButtons} onFilterChange={onFilterChange}>
                  <PinsDropdownFilter value={pinsLayout} onChange={handleLayoutChange} />
                </ActionButtons>
              )}

              {isBoardsTab && (
                <ActionButtons buttons={boardsActionButtons} onFilterChange={onFilterChange}>
                  <BoardsPopoverFilter />
                </ActionButtons>
              )}

              {isCollagesTab && (
                <ActionButtons buttons={collagesActionButtons}>
                  To be implemented
                </ActionButtons>
              )}

              <CreateButton />
            </div>
          </>

        )}
      </header>


      <main className={isDetailView ? "" : "pt-2"}>
        {children}
      </main>
    </div>
  )
}

export default BoardsLayout