import { CalendarIcon } from "lucide-react"
import { Calendar } from "#/components/ui/calendar.tsx"
import { Popover, PopoverTrigger, PopoverPopup } from "#/components/ui/popover.tsx"
import { Button } from "#/components/ui/button.tsx"
import { formatLocalDate } from "#/lib/date.ts"

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const selectedDate = value ? new Date(value + "T00:00:00") : undefined

  return (
    <Popover>
      <PopoverTrigger render={
        <Button
          variant="outline"
          className="h-9 w-full justify-start gap-2 text-left font-normal"
        >
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          {value || "Pick a date"}
        </Button>
      } />
      <PopoverPopup className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
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
