import { useState } from 'react'
import {
  SlidersHorizontal,
  Clock,
  Flag,
  ArrowUpDown,
  FolderOpen,
  ChevronDown,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
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

type AccordionSectionProps = {
  icon: React.ReactNode
  label: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function AccordionSection({
  icon,
  label,
  isOpen,
  onToggle,
  children,
}: AccordionSectionProps) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      {isOpen && <div className="px-4 pb-3">{children}</div>}
    </div>
  )
}

function RadioOption({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1.5 text-sm text-gray-600 hover:text-gray-900">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-green-600"
      />
      {label}
    </label>
  )
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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const hasActiveFilter =
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    sortBy !== 'none' ||
    selectedCategory !== 'All'

  const handleReset = () => {
    onStatusChange('all')
    onPriorityChange('all')
    onSortChange('none')
    onCategoryChange('All')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={hasActiveFilter ? 'default' : 'outline'}
            className={cn(
              'gap-2',
              hasActiveFilter && 'bg-green-600 hover:bg-green-700',
            )}
          />
        }
      >
        <SlidersHorizontal className="h-4 w-4" />

       
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-0 rounded-2xl">
        <div className="max-h-[70vh] overflow-y-auto scrollbar-hide">
          <AccordionSection
            icon={<Clock className="h-4 w-4 text-gray-500" />}
            label="Status"
            isOpen={!!openSections['status']}
            onToggle={() => toggleSection('status')}
          >
            <div className="flex flex-col">
              <RadioOption
                checked={statusFilter === 'all'}
                onChange={() => onStatusChange('all')}
                label="All"
              />
              <RadioOption
                checked={statusFilter === 'pending'}
                onChange={() => onStatusChange('pending')}
                label="Pending"
              />
              <RadioOption
                checked={statusFilter === 'completed'}
                onChange={() => onStatusChange('completed')}
                label="Completed"
              />
              <RadioOption
                checked={statusFilter === 'overdue'}
                onChange={() => onStatusChange('overdue')}
                label="Overdue"
              />
            </div>
          </AccordionSection>

          <AccordionSection
            icon={<Flag className="h-4 w-4 text-gray-500" />}
            label="Priority"
            isOpen={!!openSections['priority']}
            onToggle={() => toggleSection('priority')}
          >
            <div className="flex flex-col">
              <RadioOption
                checked={priorityFilter === 'all'}
                onChange={() => onPriorityChange('all')}
                label="All"
              />
              <RadioOption
                checked={priorityFilter === 'High'}
                onChange={() => onPriorityChange('High')}
                label="High"
              />
              <RadioOption
                checked={priorityFilter === 'Medium'}
                onChange={() => onPriorityChange('Medium')}
                label="Medium"
              />
              <RadioOption
                checked={priorityFilter === 'Low'}
                onChange={() => onPriorityChange('Low')}
                label="Low"
              />
              <RadioOption
                checked={priorityFilter === 'None'}
                onChange={() => onPriorityChange('None')}
                label="None"
              />
            </div>
          </AccordionSection>

          <AccordionSection
            icon={<ArrowUpDown className="h-4 w-4 text-gray-500" />}
            label="Sort By"
            isOpen={!!openSections['sort']}
            onToggle={() => toggleSection('sort')}
          >
            <div className="flex flex-col">
              <RadioOption
                checked={sortBy === 'none'}
                onChange={() => onSortChange('none')}
                label="None"
              />
              <RadioOption
                checked={sortBy === 'deadline'}
                onChange={() => onSortChange('deadline')}
                label="Deadline (Nearest)"
              />
              <RadioOption
                checked={sortBy === 'priority'}
                onChange={() => onSortChange('priority')}
                label="Priority (High → Low)"
              />
              <RadioOption
                checked={sortBy === 'name'}
                onChange={() => onSortChange('name')}
                label="Name (A → Z)"
              />
            </div>
          </AccordionSection>

          <AccordionSection
            icon={<FolderOpen className="h-4 w-4 text-gray-500" />}
            label="Category"
            isOpen={!!openSections['category']}
            onToggle={() => toggleSection('category')}
          >
            <div className="flex flex-col">
              <RadioOption
                checked={selectedCategory === 'All'}
                onChange={() => onCategoryChange('All')}
                label="All"
              />
              {categories.map((cat) => (
                <RadioOption
                  key={cat}
                  checked={selectedCategory === cat}
                  onChange={() => onCategoryChange(cat)}
                  label={cat}
                />
              ))}
            </div>
          </AccordionSection>

          {hasActiveFilter && (
            <div className="border-t border-gray-100">
              <button
                type="button"
                onClick={handleReset}
                className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
