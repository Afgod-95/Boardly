import { LucideIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface ActionButton<T extends string> {
  id: number | string
  label?: string
  icon?: LucideIcon
  filterKey?: T
  onClick?: () => void
}


interface ActionButtonsProps {
  buttons: ActionButton<T>[]
  onFilterChange?: (filterKey: string | null) => void
  activeFilterKey?: string | null // NEW: receive active filter from parent
  className?: string
  children: React.ReactNode
}

const ActionButtons = ({
  buttons,
  onFilterChange,
  activeFilterKey,
  children,
  className = '',
}: ActionButtonsProps) => {
  const handleButtonClick = (button: ActionButton<T>) => {
    if (!button.filterKey) {
      button.onClick?.()
      return
    }

    const newFilter =
      activeFilterKey === button.filterKey ? null : button.filterKey

    onFilterChange?.(newFilter)
  }

  return (
    <div className={`flex items-center md:gap-4 gap-3 my-5 ${className}`}>
      {buttons.map((button) => {
        const Icon = button.icon
        const isActive = button.filterKey === activeFilterKey

        const buttonClasses = ` p-3 md:py-3 md:px-5 rounded-xl flex items-center gap-2 transition-all ${
          isActive
            ? 'bg-foreground text-background shadow-md scale-95'
            : 'bg-muted text-foreground hover:bg-secondary'
        }`

        const ButtonInner = (
          <>
            {Icon && <Icon size={20} />}
            {button.label && <span className="text-md font-medium">{button.label}</span>}
          </>
        )

        // Settings / dropdown button
        if (!button.filterKey) {
          return (
            <DropdownMenu key={button.id}>
              <DropdownMenuTrigger asChild>
                <button className={buttonClasses}>{ButtonInner}</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 p-4 rounded-2xl">
                {children}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }

        // Filter button
        return (
          <button
            key={button.id}
            onClick={() => handleButtonClick(button)}
            className={buttonClasses}
          >
            {ButtonInner}
          </button>
        )
      })}
    </div>
  )
}


export default ActionButtons