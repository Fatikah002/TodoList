import { Clock } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverPopup,
} from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils.ts'

type TimePickerProps = {
  value: string
  onChange: (value: string) => void
}

function to12Hour(time24: string): {
  hour12: number
  minute: string
  period: 'AM' | 'PM'
} {
  if (!time24) return { hour12: 8, minute: '00', period: 'AM' }
  const [h, m] = time24.split(':').map(Number)
  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return { hour12, minute: String(m).padStart(2, '0'), period }
}

function to24Hour(hour12: number, minute: string, period: 'AM' | 'PM'): string {
  let h = hour12
  if (period === 'AM' && hour12 === 12) h = 0
  else if (period === 'PM' && hour12 !== 12) h = hour12 + 12
  return `${String(h).padStart(2, '0')}:${minute}`
}

const MINUTES = [
  '00',
  '05',
  '10',
  '15',
  '20',
  '25',
  '30',
  '35',
  '40',
  '45',
  '50',
  '55',
]

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const { hour12, minute, period } = to12Hour(value)

  useEffect(() => {
    if (open && listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]')
      if (selected) {
        selected.scrollIntoView({ block: 'center' })
      }
    }
  }, [open, hour12, minute])

  function handlePeriodChange(newPeriod: 'AM' | 'PM') {
    onChange(to24Hour(hour12, minute, newPeriod))
  }

  function handleTimeClick(h: number, m: string) {
    onChange(to24Hour(h, m, period))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="h-10 w-full justify-start gap-2 text-left font-normal"
          >
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={value ? '' : 'text-muted-foreground'}>
              {value ? (
                `${hour12}:${minute} ${period}`
              ) : (
                <span className="text-muted-foreground">Pick time</span>
              )}
            </span>
          </Button>
        }
      />

      <PopoverPopup className="w-auto rounded-2xl p-0" align="start">
        <div className="flex">
          {/* Hours */}
          <div className="scrollbar-hide h-64 w-16 overflow-y-auto py-1">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
              const isSelected = hour12 === h

              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleTimeClick(h, minute)}
                  className={cn(
                    'w-full px-3 py-2 text-center text-sm transition-colors',
                    isSelected
                      ? 'bg-gray-100 font-semibold text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50',
                  )}
                >
                  {h}
                </button>
              )
            })}
          </div>

          {/* Minutes */}
          <div className="scrollbar-hide h-64 w-16 overflow-y-auto border-l border-gray-100 py-1">
            {MINUTES.map((m) => {
              const isSelected = minute === m

              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleTimeClick(hour12, m)}
                  className={cn(
                    'w-full px-3 py-2 text-center text-sm transition-colors',
                    isSelected
                      ? 'bg-gray-100 font-semibold text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50',
                  )}
                >
                  {m}
                </button>
              )
            })}
          </div>

          {/* AM/PM */}
          <div className="flex flex-col border-l border-gray-100">
            {(['AM', 'PM'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePeriodChange(p)}
                className={cn(
                  'h-12 w-16 text-sm font-medium transition-colors',
                  period === p
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'text-gray-500 hover:bg-gray-50',
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </PopoverPopup>
    </Popover>
  )
}
