import * as React from "react"
import { Check } from "lucide-react"
import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"

type PinsLayout = "compact" | "standard"

interface PinsDropdownFilterProps {
  value: PinsLayout
  onChange: (layout: PinsLayout) => void
}

const PinsDropdownFilter: React.FC<PinsDropdownFilterProps> = ({ value, onChange }) => {
  return (
    <>
      <DropdownMenuCheckboxItem
        checked={value === "compact"}
        onCheckedChange={() => onChange("compact")}
        className={clsx(
          "flex border-none py-2 px-5 items-center justify-between",
          "rounded-2xl hover:bg-accent transition-all",
          value === "compact" && "bg-accent"
        )}
      >
        Compact
        {value === "compact" && <Check className="w-4 h-4" />}
      </DropdownMenuCheckboxItem>

      <DropdownMenuCheckboxItem
        checked={value === "standard"}
        onCheckedChange={() => onChange("standard")}
        className={clsx(
          "flex border-none py-2 px-5 items-center justify-between",
          "rounded-2xl hover:bg-accent transition-all",
          value === "standard" && "bg-accent"
        )}
      >
        Standard
        {value === "standard" && <Check className="w-4 h-4" />}
      </DropdownMenuCheckboxItem>
    </>
  )
}

export default PinsDropdownFilter
