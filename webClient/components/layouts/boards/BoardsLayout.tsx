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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { INITIAL_PROFILE } from "@/components/settings/constants/setting.constants"
import CustomButton from "@/components/shared/buttons/CustomButton"

// ── TODO: replace with real user from auth ────────────────────────────────────
const CURRENT_USER = {
  ...INITIAL_PROFILE,
  avatar: "https://github.com/shadcn.png",
  stats: { pins: 348, boards: 24, followers: 1200, following: 89 },
}
// ─────────────────────────────────────────────────────────────────────────────

interface BoardsLayoutProps {
  children: React.ReactNode
}

const BoardsLayout = ({ children }: BoardsLayoutProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const layoutParam = searchParams.get("layout") as "compact" | "standard" | null
  const pinsLayout = layoutParam ?? "compact"

  const isPinsTab = pathname === "/dashboard/boards/pins"
  const isBoardsTab = pathname === "/dashboard/boards"
  const isCollagesTab = pathname === "/dashboard/boards/collages"

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

  const dispatch = useDispatch()
  const pinsFilter = useSelector((state: RootState) => state.boardFilter?.pins?.activeFilter)
  const { activeFilter: boardsFilter, sortBy: boardsSortBy } = useSelector(
    (state: RootState) => state.boardFilter?.boards || { activeFilter: null, sortBy: "A-Z" }
  )
  const collagesFilter = useSelector((state: RootState) => state.boardFilter?.collages?.activeFilter)

  useEffect(() => {
    if (isPinsTab) { dispatch(setBoardsFilter(null)); dispatch(setCollagesFilter(null)) }
    if (isBoardsTab) { dispatch(setPinsFilter(null)); dispatch(setCollagesFilter(null)) }
    if (isCollagesTab) { dispatch(setPinsFilter(null)); dispatch(setBoardsFilter(null)) }
  }, [pathname, dispatch, isPinsTab, isBoardsTab, isCollagesTab])

  const handlePinsFilterChange = (k: string | null) => dispatch(setPinsFilter(k as PinsFilterView))
  const handleBoardsFilterChange = (k: string | null) => dispatch(setBoardsFilter(k as BoardsFilterView))
  const handleCollagesFilterChange = (k: string | null) => dispatch(setCollagesFilter(k as CollagesFilterView))
  const handleBoardsSortFilterChange = (v: BoardsSortBy) => dispatch(setBoardsSortBy(v))

  const handleLayoutChange = (newLayout: "compact" | "standard") => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("compact", newLayout)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const pinsActionButtons = [
    { id: 1, icon: Settings2, onClick: () => console.log("Settings clicked") },
    { id: 2, icon: Star, label: "Favorites", filterKey: "favorites" },
    { id: 3, label: "Created by you", filterKey: "created" },
  ]
  const boardsActionButtons = [
    { id: 1, icon: Settings2, onClick: () => console.log("Settings clicked") },
    { id: 2, label: "Group", filterKey: "group" },
  ]
  const collagesActionButtons = [
    { id: 1, label: "Published", filterKey: "published" },
    { id: 2, label: "Draft", filterKey: "draft" },
  ]

  const { firstName, lastName, displayName, bio, avatar, stats } = CURRENT_USER
  const fullName = `${firstName} ${lastName}`
  const initials = `${firstName[0]}${lastName[0]}`

  return (
    <div>
      <header className="sticky top-0 z-20 bg-background">

        {/* Global search + profile popover */}
        {!isDetailView && <ProfileHeader />}

        {!isDetailView && (
          <div className="max-w-screen-7xl mx-auto px-3 sm:px-5">

            {/* ── Private identity block ──────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 pb-5 border-b border-neutral-100">

              {/* Avatar */}
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 border-2 border-neutral-100 shadow-sm mx-auto sm:mx-0">
                <AvatarImage src={avatar} />
                <AvatarFallback className="text-lg font-bold bg-neutral-100 text-neutral-600">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Name + bio */}
              <div className="flex-1 justify-center text-center sm:text-left min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 truncate">{fullName}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">@{displayName}</p>
                {bio && (
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed line-clamp-2 max-w-full md:max-w-sm">
                    {bio}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-end gap-6 shrink-0">
                {[
                  { label: "Followers", value: formatCount(stats.followers) },
                  { label: "Following", value: formatCount(stats.following) },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-base font-bold text-neutral-900 leading-none">{value}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{label}</p>
                  </div>
                ))}
                <CustomButton text="Share Profile" 
                  className="py-3"
                  onClick={() => {
                    window.navigator.share({
                      title: "Boardly Profile",
                      text: `Check out ${fullName}'s profile on Boardly!`,
                      url: `/dashboard/profile/${fullName}`,
                    })
                  }}
                />
              </div>
            </div>

            {/* ── Tabs + Create ────────────────────────────────────────── */}
            <div className="flex items-center justify-between mt-2">
              <TabNavigation tabs={tabs} />
              <CreateButton />
            </div>

            {/* ── Action / filter bar ──────────────────────────────────── */}
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
                  <BoardsPopoverFilter value={boardsSortBy} onChange={handleBoardsSortFilterChange} />
                </ActionButtons>
              )}
              {isCollagesTab && (
                <ActionButtons
                  buttons={collagesActionButtons}
                  onFilterChange={handleCollagesFilterChange}
                  activeFilterKey={collagesFilter ?? null}
                >
                  <span className="text-xs text-neutral-400 italic">Coming soon</span>
                </ActionButtons>
              )}
            </div>

          </div>
        )}
      </header>

      <main className="py-4">
        {children}
      </main>
    </div>
  )
}

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

export default BoardsLayout