import { LucideIcon } from 'lucide-react'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface ActionButton {
  id: number | string
  icon?: LucideIcon
  label?: string
  filterKey?: string
  onClick?: () => void
}

interface ActionButtonsProps {
  buttons: ActionButton[]
  onFilterChange?: (filterKey: string | null) => void
  className?: string
  children: React.ReactNode
}

const ActionButtons = ({
  buttons,
  onFilterChange,
  children,
  className = '',
}: ActionButtonsProps) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [activeButtonId, setActiveButtonId] = useState<string | number | null>(
    null
  )

  const handleButtonClick = (button: ActionButton) => {
    // Toggle active background for ANY button
    setActiveButtonId((prev) => (prev === button.id ? null : button.id))

    // Toggle filter if button has filterKey
    if (button.filterKey) {
      const newFilter =
        activeFilter === button.filterKey ? null : button.filterKey

      setActiveFilter(newFilter)
      onFilterChange?.(newFilter)
    }

    // Custom onClick
    button.onClick?.()
  }

  return (
    <div className={`flex items-center gap-4 my-5 ${className}`}>
      {buttons.map((button) => {
        const Icon = button.icon

        const isActive =
          (button.filterKey && activeFilter === button.filterKey) ||
          activeButtonId === button.id

        return (
          <React.Fragment key={button.id}>
            {/* Dropdown Button (no filterKey) */}
            {!button.filterKey ? (
              <DropdownMenu
                onOpenChange={(open) => {
                  // Optional: remove highlight when dropdown closes
                  if (!open) setActiveButtonId(null)
                }}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={() => handleButtonClick(button)}
                    className={`p-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                      isActive
                        ? 'bg-accent'
                        : 'bg-muted hover:bg-accent'
                    }`}
                  >
                    {Icon && <Icon size={24} />}
                    {button.label && (
                      <span className="text-lg text-foreground font-normal">
                        {button.label}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="bottom"
                  align="start"
                  className="space-y-2 w-48 bg-background p-4 rounded-2xl shadow-xl z-50"
                >
                  {children}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Normal Filter Button */
              <button
                onClick={() => handleButtonClick(button)}
                className={`p-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  isActive
                    ? 'bg-accent'
                    : 'bg-muted hover:bg-accent'
                }`}
              >
                {Icon && <Icon size={24} />}
                {button.label && (
                  <span className="text-lg text-foreground font-normal">
                    {button.label}
                  </span>
                )}
              </button>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default ActionButtons
