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
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeButtonId, setActiveButtonId] = useState<string | number | null>(null);

  const handleButtonClick = (button: ActionButton) => {
    // Toggle active background for ANY button
    setActiveButtonId((prev) => (prev === button.id ? null : button.id));

    if (button.filterKey) {
      const newFilter = activeFilter === button.filterKey ? null : button.filterKey;
      setActiveFilter(newFilter);
      onFilterChange?.(newFilter);
    }

    button.onClick?.();
  };

  return (
    <div className={`flex items-center gap-4 my-5 ${className}`}>
      {buttons.map((button) => {
        const Icon = button.icon;
        const isActive =
          (button.filterKey && activeFilter === button.filterKey) ||
          activeButtonId === button.id;

        // Shared Button Style logic
        const buttonClasses = `p-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
          isActive
            ? 'bg-foreground text-background shadow-md scale-95' // High contrast active state
            : 'bg-muted text-foreground hover:bg-secondary'
        }`;

        const ButtonInner = (
          <>
            {Icon && <Icon size={20} />}
            {button.label && (
              <span className="text-md font-medium">
                {button.label}
              </span>
            )}
          </>
        );

        return (
          <React.Fragment key={button.id}>
            {!button.filterKey ? (
              <DropdownMenu onOpenChange={(open) => !open && setActiveButtonId(null)}>
                <DropdownMenuTrigger asChild>
                  <button onClick={() => handleButtonClick(button)} className={buttonClasses}>
                    {ButtonInner}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="start"
                  className="space-y-2 w-48 bg-background p-4 rounded-2xl shadow-xl z-50 border border-border"
                >
                  {children}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button onClick={() => handleButtonClick(button)} className={buttonClasses}>
                {ButtonInner}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ActionButtons
