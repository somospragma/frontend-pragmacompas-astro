import * as React from "react"
import { X, ChevronDown } from "lucide-react"

import { cn } from "@/shared/utils/style"
import { Badge } from "./badge"

export interface Option {
  value: string
  label: string
}

export interface MultiSelectProps {
  options: Option[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ options, value = [], onValueChange, placeholder, className, disabled }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = (optionValue: string) => {
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue]
      onValueChange?.(newValue)
    }

    const handleRemove = (optionValue: string) => {
      onValueChange?.(value.filter(v => v !== optionValue))
    }

    const selectedOptions = options.filter(option => value.includes(option.value))

    return (
      <div className="relative" ref={ref}>
        <div
          className={cn(
            "flex min-h-9 w-full flex-wrap items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
        >
          <div className="flex flex-wrap items-center gap-1">
            {selectedOptions.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                {option.label}
                {!disabled && (
                  <button
                    type="button"
                    className="ml-1 rounded-full hover:bg-secondary-foreground/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(option.value)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            <input
              type="text"
              placeholder={selectedOptions.length === 0 ? placeholder : ""}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsOpen(true)}
              disabled={disabled}
            />
          </div>
          <button
            type="button"
            className="flex items-center"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </div>

        {isOpen && !disabled && (
          <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            <div className="max-h-60 overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      value.includes(option.value) && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No options found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)
MultiSelect.displayName = "MultiSelect"

export { MultiSelect }
