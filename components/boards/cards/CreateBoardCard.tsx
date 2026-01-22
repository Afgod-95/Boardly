import Image from "next/image"
import { Plus } from "lucide-react"
import { PinItem } from "@/types/pin"

interface CreateBoardCardProps {
  pin?: PinItem[]
  variant: "create" | "suggestion"
  onClick: () => void
}

const CreateBoardCard = ({
  pin = [],
  variant,
  onClick
}: CreateBoardCardProps) => {
  
    const displayPins = pin.slice(0, 3)

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer w-full"
    >
      <div className="relative rounded-2xl overflow-hidden bg-gray-200 aspect-4/3">
        <div className="relative w-full h-full flex gap-0.5">
          
          {/* LEFT BIG */}
          <div className="relative flex-2 overflow-hidden bg-gray-300">
            {variant === "suggestion" && displayPins[0] && (
              <Image
                src={displayPins[0].img}
                alt={displayPins[0].title}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* RIGHT STACK */}
          <div className="flex-1 flex flex-col gap-1">
            {[1, 2].map((index) => (
              <div
                key={index}
                className="relative flex-1 overflow-hidden bg-gray-300"
              >
                {variant === "suggestion" && displayPins[index] && (
                  <Image
                    src={displayPins[index].img}
                    alt={displayPins[index].title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          {/* ACTION BUTTON (ALWAYS SHOWN) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="
                bg-white flex items-center gap-2
                rounded-full px-5 py-3 shadow-lg
                transition-all duration-200
                group-hover:scale-105 hover:bg-gray-50
              "
            >
              <Plus size={22} />
              <span className="font-semibold">Create </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateBoardCard
