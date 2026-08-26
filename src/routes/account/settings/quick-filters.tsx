import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getQuickFilters, toggleQuickFilter } from '@/lib/presets'
import type { QuickFilter } from '@/lib/presets'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/account/settings/quick-filters')({
  component: QuickFiltersPage,
})

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200',
        checked ? 'bg-green-500' : 'bg-gray-300',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200',
          checked ? 'translate-x-5.5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

function QuickFiltersPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<QuickFilter[]>(getQuickFilters)

  function handleToggle(id: string) {
    const updated = toggleQuickFilter(id)
    setFilters(updated)
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        <div className= "flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/account/settings' })}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quick Filters</h1>
            <p className="text-sm text-gray-500">
              Choose shortcuts to show on the Tasks page.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white divide-y divide-gray-100">
          {filters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{filter.label}</p>
                <p className="text-sm text-gray-500">{filter.description}</p>
              </div>
              <Toggle
                checked={filter.enabled}
                onChange={() => handleToggle(filter.id)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
