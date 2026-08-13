import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import type { Todo } from '@/lib/types'
import { getCategoryMeta } from '@/lib/categories'

type CategoryBreakdownSectionProps = {
  todos: Todo[]
  selectedCategory?: string
  onSelectCategory?: (category: string) => void
  className?: string
}

export function CategoryBreakdownSection({
  todos,
  selectedCategory = 'All',
  onSelectCategory,
  className,
}: CategoryBreakdownSectionProps) {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)

  const activeTodos = useMemo(() => todos.filter((t) => !t.archived), [todos])
  const totalTasks = activeTodos.length

  const categoryStats = useMemo(() => {
    if (!isExpanded) {
      // Collapsed mode: Work, Other, Personal
      const map = new Map<string, number>()
      map.set('Work', 0)
      map.set('Other', 0)
      map.set('Personal', 0)

      activeTodos.forEach((todo) => {
        const cat = (todo.category || 'Other').trim()
        if (cat === 'Work' || cat === 'Personal') {
          const current = map.get(cat) ?? 0
          map.set(cat, current + 1)
        } else {
          const current = map.get('Other') ?? 0
          map.set('Other', current + 1)
        }
      })

      const order = ['Work', 'Other', 'Personal']
      return order
        .map((name) => {
          const count = map.get(name) ?? 0
          const progress =
            totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0
          const meta = getCategoryMeta(name)
          return {
            name,
            count,
            progress,
            icon: meta.icon,
            bgColor: meta.bgColor,
          }
        })
        .filter((item) => item.count > 0 || item.name !== 'Other')
    }

    // Expanded mode: All actual individual categories (NO 'Other'!)
    const map = new Map<string, number>()
    activeTodos.forEach((todo) => {
      const cat = (todo.category || 'Uncategorized').trim()
      const current = map.get(cat) ?? 0
      map.set(cat, current + 1)
    })

    return Array.from(map.entries())
      .map(([name, count]) => {
        const progress =
          totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0
        const meta = getCategoryMeta(name)
        return {
          name,
          count,
          progress,
          icon: meta.icon,
          bgColor: meta.bgColor,
        }
      })
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [activeTodos, totalTasks, isExpanded])

  return (
    <section
      className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition-all duration-300 hover:shadow-xs flex flex-col ${
        className ? className : ''
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
          Categories
        </h2>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsExpanded((prev) => !prev)
          }}
          className="relative z-10 text-xs font-semibold text-green-600 hover:text-green-700 active:text-green-800 transition-colors flex items-center gap-1 cursor-pointer select-none py-1 px-1.5 -mr-1.5 rounded-md hover:bg-green-50"
        >
          <span>{isExpanded ? 'View Less' : 'View All'}</span>
          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-1.5 transition-all duration-300">
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
                  } else {
                    navigate({
                      to: '/todos',
                      search: {
                        view: 'all',
                        category: item.name,
                        status: 'all',
                        priority: 'all',
                        sort: 'none',
                      },
                    })
                  }
                }}
                className={`flex items-center justify-between gap-2.5 p-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-green-50 border border-green-400/60'
                    : 'border border-transparent hover:bg-gray-50'
                }`}
              >
                {/* Circle Icon */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-2xs ${item.bgColor}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                {/* Category Name & Progress Bar */}
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <span className="text-xs font-semibold text-gray-800 truncate">
                    {item.name}
                  </span>
                  <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>

                {/* Task Count & Chevron Right */}
                <div className="flex items-center gap-1.5 shrink-0 pl-1">
                  <span className="text-xs font-medium text-gray-600">
                    {item.count}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
