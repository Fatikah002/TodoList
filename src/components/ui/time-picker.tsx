import { Clock } from 'lucide-react'
import { useState } from 'react'
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

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))

const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = useState(false)

  const selectedHour = value ? value.split(':')[0] : ''
  const selectedMinute = value ? value.split(':')[1] : ''

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
              value
            ) : (
              <span className="text-muted-foreground">Pick time</span>
            )}
            </span>
          </Button>
        }
      />

      <PopoverPopup className="w-64 rounded-2xl p-4" align="start">
        {/* Title */}
        <div className="mb-4 text-center text-base font-semibold">
          Select time
        </div>

        {/* Time Picker */}
        <div className="grid grid-cols-2 gap-2">
          {/* Hour */}
          <div className="scrollbar-hide h-60 overflow-y-auto rounded-xl border">
            {hours.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => onChange(`${hour}:${selectedMinute || '00'}`)}
                className={cn(
                  'w-full py-2.5 text-sm transition-colors',
                  'hover:bg-muted',
                  selectedHour === hour &&
                    'bg-green-100 font-semibold text-green-700',
                )}
              >
                {hour}
              </button>
            ))}
          </div>

          {/* Minute */}
          <div className="scrollbar-hide h-60 overflow-y-auto rounded-xl border">
            {minutes.map((minute) => (
              <button
                key={minute}
                type="button"
                onClick={() => onChange(`${selectedHour || '00'}:${minute}`)}
                className={cn(
                  'w-full py-2.5 text-sm transition-colors',
                  'hover:bg-muted',
                  selectedMinute === minute &&
                    'bg-green-100 font-semibold text-green-700',
                )}
              >
                {minute}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-2 border-t pt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={() => setOpen(false)}
          >
            Save
          </Button>
        </div>
      </PopoverPopup>
    </Popover>
  )
}
