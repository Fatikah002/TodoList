import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X, SquareCheckBig } from 'lucide-react'
import { TodoFilter } from '@/components/todo/TodoFilter'
import type {
  SortBy,
  StatusFilter,
  PriorityFilter,
} from '@/components/todo/TodoFilter'

type TodosSearchBarProps = {
  search: string
  onSearchChange: (value: string) => void
  selectMode: boolean
  onCancelSelect: () => void
  onEnterSelectMode: () => void
  selectedCount: number
  onDeleteSelected: () => void
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

export function TodosSearchBar({
  search,
  onSearchChange,
  selectMode,
  onCancelSelect,
  onEnterSelectMode,
  selectedCount,
  onDeleteSelected,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: TodosSearchBarProps) {
  if (selectMode) {
    return (
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onCancelSelect}>
          Cancel
        </Button>

        <p className="text-sm font-medium text-muted-foreground">
          {selectedCount} item selected
        </p>

        <Button
          variant="destructive"
          disabled={selectedCount === 0}
          onClick={onDeleteSelected}
        >
          Delete
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search todo..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search todos"
          className="h-12 rounded-xl pl-10 pr-10"
        />

        {search && (
          <button
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <TodoFilter
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        priorityFilter={priorityFilter}
        onPriorityChange={onPriorityChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        categories={categories}
      />

      <Button
        variant="outline"
        onClick={onEnterSelectMode}
        aria-label="Enter select mode"
        className="h-12 gap-1.5 rounded-xl px-3"
      >
        <SquareCheckBig size={16} />
      </Button>
    </div>
  )
}
