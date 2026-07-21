import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type SortBy = 'deadline' | 'priority' | 'name' | 'none'
export type StatusFilter = 'all' | 'completed' | 'pending' | 'overdue'
export type PriorityFilter = 'all' | 'High' | 'Medium' | 'Low' | 'None'

type TodoFilterProps = {
  statusFilter: StatusFilter
  onStatusChange: (value: StatusFilter) => void
  priorityFilter: PriorityFilter
  onPriorityChange: (value: PriorityFilter) => void
  sortBy: SortBy
  onSortChange: (value: SortBy) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: string[]
}

export function TodoFilter({
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: TodoFilterProps) {
  const hasActiveFilter =
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    sortBy !== 'none' ||
    selectedCategory !== 'All'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          className={`h-9 gap-1.5 rounded-full px-3 ${
            hasActiveFilter ? 'border-green-500 bg-green-50 text-green-700' : ''
          }`}
        >
          <Filter size={16} />
          <span className="text-sm">Filter</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Status</DropdownMenuLabel>

          <DropdownMenuRadioGroup
            value={statusFilter}
            onValueChange={(v) => onStatusChange(v as StatusFilter)}
          >
            <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="pending">
              Pending
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="completed">
              Completed
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="overdue">
              Overdue
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Priority</DropdownMenuLabel>

          <DropdownMenuRadioGroup
            value={priorityFilter}
            onValueChange={(v) => onPriorityChange(v as PriorityFilter)}
          >
            <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="High">High</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Medium">Medium</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Low">Low</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="None">None</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>

          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={(value) => onSortChange(value as SortBy)}
          >
            <DropdownMenuRadioItem value="deadline">
              Deadline (Nearest)
            </DropdownMenuRadioItem>

            <DropdownMenuRadioItem value="priority">
              Priority (High → Low)
            </DropdownMenuRadioItem>

            <DropdownMenuRadioItem value="name">
              Name (A → Z){' '}
            </DropdownMenuRadioItem>

            <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Category</DropdownMenuLabel>

          <DropdownMenuRadioGroup
            value={selectedCategory}
            onValueChange={onCategoryChange}
          >
            <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>

            {categories.map((cat) => (
              <DropdownMenuRadioItem key={cat} value={cat}>
                {cat}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator>
          <DropdownMenuItem
            onClick={() => {
              onStatusChange('all')
              onPriorityChange('all')
              onSortChange('none')
              onCategoryChange('All')
            }}
          >
            Reset Filter
          </DropdownMenuItem>
        </DropdownMenuSeparator>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
