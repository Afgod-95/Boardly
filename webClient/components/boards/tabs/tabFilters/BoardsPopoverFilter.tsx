import * as React from "react"
import { Check } from "lucide-react"
import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import { BoardsSortBy } from "@/types/board"

interface BoardsPopoverFilterProps {
  value: BoardsSortBy;
  onChange: (value: BoardsSortBy) => void;
}

const BoardsPopoverFilter = ({
  value,
  onChange,
}: BoardsPopoverFilterProps) => {
  return (
    <div className="space-y-2">
      {/* A - Z */}
      <DropdownMenuCheckboxItem
        checked={value === "A-Z"}
        onCheckedChange={() => onChange("A-Z")}
        className={clsx(
          "flex border-none py-2 px-5 items-center justify-between",
          "rounded-2xl hover:bg-accent transition-all",
          value === "A-Z" && "bg-accent"
        )}
      >
        A - Z
        {value === "A-Z" && <Check className="w-4 h-4" />}
      </DropdownMenuCheckboxItem>

      {/* Custom */}
      <DropdownMenuCheckboxItem
        checked={value === "CUSTOM"}
        onCheckedChange={() => onChange("CUSTOM")}
        className={clsx(
          "flex border-none py-2 px-5 items-center justify-between",
          "rounded-2xl hover:bg-accent transition-all",
          value === "CUSTOM" && "bg-accent"
        )}
      >
        Custom
        {value === "CUSTOM" && <Check className="w-4 h-4" />}
      </DropdownMenuCheckboxItem>

      {/* Last Added */}
      <DropdownMenuCheckboxItem
        checked={value === "LAST_ADDED"}
        onCheckedChange={() => onChange("LAST_ADDED")}
        className={clsx(
          "flex border-none py-2 px-5 items-center justify-between",
          "rounded-2xl hover:bg-accent transition-all",
          value === "LAST_ADDED" && "bg-accent"
        )}
      >
        Last Added
        {value === "LAST_ADDED" && <Check className="w-4 h-4" />}
      </DropdownMenuCheckboxItem>
    </div>
  );
};

export default BoardsPopoverFilter
