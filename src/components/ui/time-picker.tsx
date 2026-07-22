import { Clock } from 'lucide-react'
import { useState } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverPopup,
} from '#/components/ui/popover.tsx'
import { Button } from '#/components/ui/button.tsx'
import { cn } from '#/lib/utils.ts'

type TimePickerProps = {
  value: string
  onChange: (value: string) => void
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = Array.from({ length: 59 }, (_, i) =>
  String(i + 1).padStart(2, '0'),
)

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
            className="h-9 w-full justify-start gap-2 text-left font-normal"
          >
            <Clock className="h-4 w-4 text-muted-foreground" />
            {value || 'Pick time'}
          </Button>
        }
      />
      <PopoverPopup className="w-56 p-2" align="start">
        <div className="grid grid-cols-2 gap-2">
          <div className="h-60 overflow-y-auto border rounded">
            {hours.map((h) => (
              <button
                key={h}
                onClick={() => onChange(`${h}:${selectedMinute || '00'}`)}
                className={cn(
                  'w-full py-2 text-sm hover:bg-muted',
                  selectedHour === h && 'bg-primary text-primary-foreground',
                )}
              >
                {h}
              </button>
            ))}
          </div>

          <div className="h-60 overflow-y-auto border rounded">
            {minutes.map((m) => (
              <button
                key={m}
                onClick={() => {
                  onChange(`${selectedHour || '00'}:${m}`)
                  setOpen(false)
                }}
                className={cn(
                  'w-full py-2 text-sm hover:bg-muted',
                  selectedMinute === m && 'bg-primary text-primary-foreground',
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </PopoverPopup>
    </Popover>
  )
}
