import { getQuickFilters } from '@/lib/presets'
import type {  QuickFilter } from '@/lib/presets'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { StatusFilter, PriorityFilter, SortBy } from '@/components/todo/TodoFilter'

type QuickFilterBarProps = {
  activeStatus: StatusFilter
  activePriority: PriorityFilter
  activeSort: SortBy
  onSelect: (filter: QuickFilter) => void
}

export function QuickFilterBar({
  activeStatus,
  activePriority,
  activeSort,
  onSelect,
}: QuickFilterBarProps) {
  const [filters, setFilters] = useState<QuickFilter[]>([])

  useEffect(() => {
    setFilters(getQuickFilters())
  }, [])

  const enabled = filters.filter((f) => f.enabled)
  if (enabled.length === 0) return null

  function isActive(f: QuickFilter): boolean {
    return (
      f.filters.status === activeStatus &&
      f.filters.priority === activePriority &&
      f.filters.sort === activeSort
    )
  }

  function handleClick(f: QuickFilter) {
    onSelect(f)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {enabled.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => handleClick(f)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            isActive(f)
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
