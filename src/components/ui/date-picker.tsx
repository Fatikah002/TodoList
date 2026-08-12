import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverPopup } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { formatLocalDate } from '@/lib/date'

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
}

function getToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const selectedDate = value ? new Date(value + 'T00:00:00') : undefined

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="h-10 w-full justify-start gap-2 text-left font-normal"
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            {value ? (
              value
            ) : (
              <span className="text-muted-foreground">Pick a date</span>
            )}
          </Button>
        }
      />
      <PopoverPopup className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          disabled={(date) => date < getToday()}
          onSelect={(date: Date | undefined) => {
            if (date) {
              onChange(formatLocalDate(date))
            }
          }}
        />
      </PopoverPopup>
    </Popover>
  )
}
