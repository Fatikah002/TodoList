import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverPopup,
} from '@/components/ui/popover'
import { ChevronDownIcon, PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type ComboboxOption = string | { value: string; label: string }

type ComboboxProps = {
  value: string
  onChange: (value: string) => void
  options: ComboboxOption[]
  placeholder?: string
  className?: string
  showAddOption?: boolean
}

function normalizeOptions(options: ComboboxOption[]): {
  value: string
  label: string
}[] {
  return options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  )
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className,
  showAddOption = true,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newValue, setNewValue] = useState('')

  const normalized = normalizeOptions(options)
  const selectedLabel = normalized.find((o) => o.value === value)?.label ?? value

  const handleSelect = (selected: string) => {
    onChange(selected)
    setOpen(false)
    setIsAdding(false)
    setNewValue('')
  }

  const handleCreate = () => {
    const trimmed = newValue.trim()
    if (trimmed) {
      onChange(trimmed)
      setOpen(false)
      setIsAdding(false)
      setNewValue('')
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setIsAdding(false)
      setNewValue('')
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'h-10 w-full justify-between gap-1.5 text-left font-normal py-2 px-2.5',
              !value && 'text-muted-foreground',
              className,
            )}
          >
            {selectedLabel || placeholder}
            <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverPopup className="w-[--anchor-width] p-0" align="start">
        <div className="max-h-60 overflow-y-auto p-1">
          {normalized.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                'flex w-full items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                value === option.value && 'bg-accent text-accent-foreground',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {showAddOption && (
          <div className="border-t p-1">
            {isAdding ? (
              <div className="flex items-center gap-1 p-1">
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter category name"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreate()
                    } else if (e.key === 'Escape') {
                      setIsAdding(false)
                      setNewValue('')
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-green-600 hover:text-green-700"
                  onClick={handleCreate}
                >
                  Add
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-green-600 outline-none hover:bg-green-50 hover:text-green-700"
              >
                <PlusIcon className="h-4 w-4 shrink-0" />
                Add new category
              </button>
            )}
          </div>
        )}
      </PopoverPopup>
    </Popover>
  )
}
