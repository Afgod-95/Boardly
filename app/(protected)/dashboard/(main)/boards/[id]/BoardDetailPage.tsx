"use client"

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import PinCard from "@/components/pins/card/PinCard";
import usePinsHook from "@/hooks/usePinsHook";
import PageWrapper from "@/components/wrapper/PageWrapper";

export default function BoardDetailPage() {
  const params = useParams();
  const { id } = params;

  const { boards } = useSelector((state: RootState) => state.boards);
  const { pins } = useSelector((state: RootState) => state.pins);

  const board = boards.find(b => b.id === id);

  const { hoveredItem, hoveredIndex } = usePinsHook();

  if (!board) {
    return <p>Board not found</p>;
  }

  // Get the pins for this board
  const boardPins = board.pinIds
    .map(pinId => pins.find(p => p.id === pinId))
    .filter((p): p is typeof pins[number] => !!p); // Type guard

  return (
    <PageWrapper>
      {/* Board title truncated if too long */}
      <h1 className="text-2xl font-semibold truncate max-w-full">
        {board.title}
      </h1>

      <p className="mt-2 mb-3 text-gray-700">{boardPins.length} pins</p>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {boardPins.map((pin, index) => (
          <PinCard
            profileValue={
              board.title.length > 10
                ? board.title.slice(0, 7) + "…" // truncate manually if needed
                : board.title
            }
            showEditButton
            key={pin.id}
            item={pin}
            isHovered={hoveredIndex === index}
            onMouseEnter={() => hoveredItem(index)}
            onMouseLeave={() => hoveredItem(null)}
            showSaveButton
            showProfileButton
            showMetadata
          />
        ))}
      </div>
    </PageWrapper>

  );
}
