import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type TodoFilterProps = {
  value: string
  onChange: (value: string) => void
  categories: readonly string[]
}

export function TodoFilter({ value, onChange, categories }: TodoFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Label>Filter :</Label>
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue ?? 'All')}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
