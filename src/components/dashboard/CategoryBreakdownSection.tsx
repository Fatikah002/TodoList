import { useMemo } from 'react'
import {
  Briefcase,
  User,
  ShoppingBag,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react'
import type { Todo } from '@/lib/types'

type CategoryBreakdownSectionProps = {
  todos: Todo[]
  selectedCategory?: string
  onSelectCategory?: (category: string) => void
  className?: string
}

const MAIN_CATEGORIES = ['Work', 'Personal', 'Shopping'] as const

const CATEGORY_CONFIG: Record<
  string,
  { icon: typeof Briefcase; bgColor: string } | undefined
> = {
  Work: { icon: Briefcase, bgColor: 'bg-blue-500' },
  Personal: { icon: User, bgColor: 'bg-emerald-500' },
  Shopping: { icon: ShoppingBag, bgColor: 'bg-amber-500' },
  Other: { icon: MoreHorizontal, bgColor: 'bg-gray-400' },
}

function resolveCategoryName(name: string): string {
  if (MAIN_CATEGORIES.includes(name as typeof MAIN_CATEGORIES[number])) {
    return name
  }
  return 'Other'
}

function getCategoryMeta(name: string) {
  const normalized = name.trim()
  if (CATEGORY_CONFIG[normalized]) {
    return CATEGORY_CONFIG[normalized]
  }
  return { icon: MoreHorizontal, bgColor: 'bg-gray-400' }
}

export function CategoryBreakdownSection({
  todos,
  selectedCategory = 'All',
  onSelectCategory,
  className,
}: CategoryBreakdownSectionProps) {
  const categoryStats = useMemo(() => {
    const active = todos.filter((t) => !t.archived)
    const map = new Map<string, { total: number; completed: number }>()

    active.forEach((todo) => {
      const cat = resolveCategoryName(todo.category || 'Other')
      const current = map.get(cat) || { total: 0, completed: 0 }
      map.set(cat, {
        total: current.total + 1,
        completed: current.completed + (todo.completed ? 1 : 0),
      })
    })

    return Array.from(map.entries()).map(([name, stat]) => {
      const progress = Math.round((stat.completed / stat.total) * 100)
      const meta = getCategoryMeta(name)
      return {
        name,
        count: stat.total,
        completed: stat.completed,
        progress,
        icon: meta.icon,
        bgColor: meta.bgColor,
      }
    })
  }, [todos])

  return (
    <section className={`hidden lg:flex overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md flex-col ${className ?? ''}`}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
          Categories
        </h2>

        {onSelectCategory && (
          <button
            onClick={() => onSelectCategory('All')}
            className={`text-xs font-semibold transition-colors ${
              selectedCategory === 'All'
                ? 'text-green-600 hover:text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            View All
          </button>
        )}
      </div>

      <div className="space-y-1.5 overflow-y-auto max-h-[320px] pr-1">
        {categoryStats.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-500">
            No categories available
          </p>
        ) : (
          categoryStats.map((item) => {
            const Icon = item.icon
            const isSelected = selectedCategory === item.name

            return (
              <div
                key={item.name}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(isSelected ? 'All' : item.name)
                  }
                }}
                className={`flex items-center justify-between gap-2 p-1.5 px-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-green-50 border border-green-400/60'
                    : 'border border-transparent hover:bg-gray-50'
                }`}
              >
                {/* Category Icon */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-xs ${item.bgColor}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                {/* Info & Progress */}
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-medium text-gray-700 truncate">
                    {item.name}
                  </span>
                  <div className="h-1 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>

                {/* Count & Arrow */}
                <div className="flex items-center gap-1 shrink-0 pl-1">
                  <span className="text-xs font-medium text-gray-600">
                    {item.count}
                  </span>
                  <ChevronRight className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
