import type { PriorityFilter, SortBy, StatusFilter } from '@/components/todo/TodoFilter'

export type QuickFilter = {
  id: string
  label: string
  description: string
  enabled: boolean
  filters: {
    status: StatusFilter
    priority: PriorityFilter
    category: string
    sort: SortBy
  }
}

export type QuickFilterPreset = Omit<QuickFilter, 'enabled'>

const STORAGE_KEY = 'quickFilters'

export const QUICK_FILTER_PRESETS: QuickFilterPreset[] = [
  {
    id: 'high-priority',
    label: 'High Priority',
    description: 'Show tasks with High priority',
    filters: { status: 'all', priority: 'High', category: 'All', sort: 'priority' },
  },
  {
    id: 'overdue',
    label: 'Overdue',
    description: 'Show overdue tasks only',
    filters: { status: 'overdue', priority: 'all', category: 'All', sort: 'deadline' },
  },
  {
    id: 'due-today',
    label: 'Due Today',
    description: "Show today's tasks",
    filters: { status: 'pending', priority: 'all', category: 'All', sort: 'deadline' },
  },
  {
    id: 'due-this-week',
    label: 'Due This Week',
    description: 'Show tasks due this week',
    filters: { status: 'all', priority: 'all', category: 'All', sort: 'deadline' },
  },
  {
    id: 'completed',
    label: 'Completed',
    description: 'Show completed tasks',
    filters: { status: 'completed', priority: 'all', category: 'All', sort: 'none' },
  },
]

function getDefaultFilters(): QuickFilter[] {
  return QUICK_FILTER_PRESETS.map((preset, i) => ({
    ...preset,
    enabled: i < 4,
  }))
}

export function getQuickFilters(): QuickFilter[] {
  if (typeof window === 'undefined') return getDefaultFilters()

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      const defaults = getDefaultFilters()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
      return defaults
    }
    return JSON.parse(stored) as QuickFilter[]
  } catch {
    return getDefaultFilters()
  }
}

export function saveQuickFilters(filters: QuickFilter[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
}

export function toggleQuickFilter(id: string): QuickFilter[] {
  const filters = getQuickFilters()
  const updated = filters.map((f) =>
    f.id === id ? { ...f, enabled: !f.enabled } : f,
  )
  saveQuickFilters(updated)
  return updated
}
