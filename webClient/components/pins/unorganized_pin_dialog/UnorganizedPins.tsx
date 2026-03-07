"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ChevronRight, Search, X, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { PinItem } from "@/types/pin";
import { BoardItem } from "@/types/board";
import { RootState, AppDispatch } from "@/redux/store";
import { organizePins } from "@/redux/boardSlice";
import { updatePin } from "@/redux/pinSlice";

// ── Replace these with your real selectors & thunk ──────────────────────────
// import { selectUnorganizedPins, organizePins } from "@/redux/pinSlice";
// import { selectAllBoards } from "@/redux/boardSlice";

interface UnorganizedPinsProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

type Step = "select-pins" | "select-board";

// ─── Pin Thumbnail ─────────────────────────────────────────────────────────────

function PinThumbnail({
  pin,
  isSelected,
  onToggle,
}: {
  pin: PinItem;
  isSelected: boolean;
  onToggle: (id: string | number) => void;
}) {
  return (
    <motion.button
      onClick={() => onToggle(pin.id!)}
      whileTap={{ scale: 0.94 }}
      className="relative w-full rounded-2xl overflow-hidden group focus:outline-none cursor-pointer break-inside-avoid block"
    >
      <Image
        src={pin.img}
        alt={pin.title ?? "Pin"}
        width={200}
        height={0}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 33vw, 160px"
      />

      {/* Hover / selected overlay */}
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-200",
          isSelected ? "bg-black/25" : "bg-transparent group-hover:bg-black/10"
        )}
      />

      {/* Checkmark */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center"
          >
            <Check size={11} strokeWidth={3.5} className="text-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection ring */}
      <motion.div
        animate={{ opacity: isSelected ? 1 : 0 }}
        className="absolute inset-0 rounded-2xl border-[2.5px] border-gray-900 pointer-events-none z-10"
      />
    </motion.button>
  );
}

// ─── Board Row ─────────────────────────────────────────────────────────────────

function BoardRow({
  board,
  coverPin,
  selectedCount,
  onSelect,
}: {
  board: BoardItem;
  coverPin?: PinItem;
  selectedCount: number;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.button
      onClick={() => onSelect(board.id)}
      whileTap={{ scale: 0.985 }}
      className="w-full flex items-center gap-3.5 px-2 py-2.5 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors group text-left"
    >
      {/* Cover image — uses coverPinId resolved to a PinItem, falling back to placeholder */}
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
        {coverPin?.img ? (
          <Image
            src={coverPin.img}
            alt={board.title}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <LayoutGrid size={18} className="text-gray-300" />
          </div>
        )}
      </div>

      {/* Title + pin count */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate leading-tight">
          {board.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {board.pinIds.length} {board.pinIds.length === 1 ? "pin" : "pins"}
          {selectedCount > 0 && (
            <span className="text-gray-700 font-medium"> · +{selectedCount} adding</span>
          )}
        </p>
      </div>

      <ChevronRight
        size={15}
        className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 mr-1"
      />
    </motion.button>
  );
}

// ─── Main Dialog ───────────────────────────────────────────────────────────────

export default function UnorganizedPins({ isOpen, setIsOpen }: UnorganizedPinsProps) {
  const dispatch = useDispatch<AppDispatch>();

  // Saved pins with no boardId = unorganized (mirrors BoardsPage savedPins filter)
  const allPins: PinItem[] = useSelector((state: RootState) =>
    state.pins.pins.filter((p) => p.isSaved === true && !p.boardId)
  );

  const allBoards: BoardItem[] = useSelector(
    (state: RootState) => state.boards.boards
  );

  // Map of pinId -> PinItem for resolving board cover images
  const pinMap: Record<string, PinItem> = useSelector((state: RootState) =>
    state.pins.pins.reduce(
      (acc: Record<string, PinItem>, p: PinItem) => {
        acc[String(p.id)] = p;
        return acc;
      },
      {}
    )
  );

  const [step, setStep] = useState<Step>("select-pins");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [boardSearch, setBoardSearch] = useState("");

  const togglePin = useCallback((id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const allSelected = allPins.length > 0 && selectedIds.size === allPins.length;
  const noneSelected = selectedIds.size === 0;

  const handleSelectAll = () =>
    allSelected
      ? setSelectedIds(new Set())
      : setSelectedIds(new Set(allPins.map((p) => p.id!)));

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep("select-pins");
      setSelectedIds(new Set());
      setBoardSearch("");
    }, 300);
  };

  const handleBoardSelect = (boardId: string) => {
    const pinIdArray = Array.from(selectedIds)

    // 1. Update boardSlice: add all pinIds to the board's pinIds array
    dispatch(organizePins({ pinIds: pinIdArray, boardId }))

    // 2. Update pinSlice: stamp boardId onto each pin so they're no longer "unorganized"
    pinIdArray.forEach((pinId) => {
      const pin = allPins.find((p) => String(p.id) === String(pinId))
      if (pin) dispatch(updatePin({ ...pin, boardId }))
    })

    handleClose();
  };

  const filteredBoards = allBoards.filter((b) =>
    b.title.toLowerCase().includes(boardSearch.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={cn(
          "p-0 gap-0 overflow-hidden",
          "rounded-3xl border-none shadow-2xl bg-white",
          "w-[calc(100vw-1.5rem)] max-w-md",
          "h-[88dvh] flex flex-col",
          "[&>button:last-child]:hidden" // hide default shadcn X
        )}
      >
        <AnimatePresence mode="wait" initial={false}>

          {/* ══════════ STEP 1 — SELECT PINS ══════════ */}
          {step === "select-pins" && (
            <motion.div
              key="pins"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: [0.32, 0, 0.67, 0] }}
              className="flex flex-col min-h-0"
            >
              {/* Header */}
              <div className="px-5 pt-5 pb-2 flex items-start justify-between flex-shrink-0">
                <div>
                  <DialogTitle className="text-lg font-bold text-gray-900 tracking-tight">
                    Organize pins
                  </DialogTitle>
                  <p className="text-[13px] text-gray-400 mt-0.5">
                    Pick the pins you want to move to a board
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={15} className="text-gray-500" />
                </button>
              </div>

              {/* Select all / count row */}
              <div className="px-5 py-2 flex items-center justify-between flex-shrink-0">
                <button
                  onClick={handleSelectAll}
                  className="text-[13px] font-semibold text-gray-900 hover:text-gray-500 transition-colors"
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
                <AnimatePresence>
                  {!noneSelected && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-[13px] text-gray-400"
                    >
                      {selectedIds.size} selected
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Pin grid */}
              <div className="flex-1 overflow-y-auto px-4 pb-3 min-h-0">
                {allPins.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <LayoutGrid size={32} className="text-gray-200 mb-3" />
                    <p className="text-sm font-medium text-gray-400">No unorganized pins</p>
                    <p className="text-xs text-gray-300 mt-1">
                      All your pins are already saved to boards
                    </p>
                  </div>
                ) : (
                  <div className="columns-3 gap-2 space-y-2">
                    {allPins.map((pin) => (
                      <PinThumbnail
                        key={pin.id}
                        pin={pin}
                        isSelected={selectedIds.has(pin.id!)}
                        onToggle={togglePin}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="px-4 pt-2 pb-5 flex-shrink-0">
                <motion.button
                  onClick={() => setStep("select-board")}
                  disabled={noneSelected}
                  whileTap={noneSelected ? {} : { scale: 0.97 }}
                  className={cn(
                    "w-full py-3 rounded-2xl text-sm font-bold tracking-wide transition-all duration-200",
                    noneSelected
                      ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-black shadow-sm"
                  )}
                >
                  {noneSelected
                    ? "Select pins to continue"
                    : `Save ${selectedIds.size} pin${selectedIds.size !== 1 ? "s" : ""} to a board →`}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ══════════ STEP 2 — SELECT BOARD ══════════ */}
          {step === "select-board" && (
            <motion.div
              key="boards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, ease: [0.32, 0, 0.67, 0] }}
              className="flex flex-col min-h-0"
            >
              {/* Header */}
              <div className="px-4 pt-5 pb-3 flex items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={() => setStep("select-pins")}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <ArrowLeft size={15} className="text-gray-600" />
                </button>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-lg font-bold text-gray-900 tracking-tight">
                    Save to board
                  </DialogTitle>
                  <p className="text-[13px] text-gray-400 truncate">
                    {selectedIds.size} pin{selectedIds.size !== 1 ? "s" : ""} selected
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X size={15} className="text-gray-500" />
                </button>
              </div>

              {/* Search */}
              <div className="px-4 pb-3 flex-shrink-0">
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={boardSearch}
                    onChange={(e) => setBoardSearch(e.target.value)}
                    placeholder="Search your boards…"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm bg-gray-100 outline-none placeholder:text-gray-400 text-gray-800 focus:ring-2 focus:ring-gray-200 transition-shadow"
                  />
                </div>
              </div>

              {/* Board list */}
              <div className="flex-1 overflow-y-auto px-3 pb-5 min-h-0">
                {filteredBoards.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-10">
                    {boardSearch ? `No boards matching "${boardSearch}"` : "No boards yet"}
                  </p>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    {filteredBoards.map((board) => (
                      <BoardRow
                        key={board.id}
                        board={board}
                        coverPin={
                          board.coverPinId ? pinMap[String(board.coverPinId)] : undefined
                        }
                        selectedCount={selectedIds.size}
                        onSelect={handleBoardSelect}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}