import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  SlidersHorizontal,
  Bell,
  Info,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getQuickFilters,
  toggleQuickFilter,
} from '@/lib/presets'
import type { QuickFilter } from '@/lib/presets'
import { AboutContent } from '@/components/settings/AboutContent'

export const Route = createFileRoute('/account/settings')({
  component: RouteComponent,
})

type TabItem = {
  id: string
  label: string
  icon: LucideIcon
}

const TABS: TabItem[] = [
  { id: 'quick-filters', label: 'Quick Filters', icon: SlidersHorizontal },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'about', label: 'About', icon: Info },
]

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

function RouteComponent() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('quick-filters')
  const [filters, setFilters] = useState<QuickFilter[]>(getQuickFilters)

  const enabledCount = filters.filter((f) => f.enabled).length

  function handleToggle(id: string) {
    const updated = toggleQuickFilter(id)
    setFilters(updated)
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/account' })}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">
              Manage your preferences and application settings.
            </p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
          {/* Left tab nav */}
          <nav className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>

          {/* Right content */}
          <div>
            {activeTab === 'quick-filters' && (
              <QuickFiltersContent
                filters={filters}
                enabledCount={enabledCount}
                onToggle={handleToggle}
              />
            )}
            {activeTab === 'about' && <AboutContent />}
            {activeTab !== 'quick-filters' && activeTab !== 'about' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400">
                Coming soon
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function QuickFiltersContent({
  filters,
  onToggle,
}: {
  filters: QuickFilter[]
  enabledCount: number
  onToggle: (id: string) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Quick Filters</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose shortcuts to show on the Tasks page. You can select up to 5
          shortcuts.
        </p>
      </div>

      <Card className="border-gray-200 overflow-hidden">
        <CardContent className="divide-y divide-gray-100 p-0">
          {filters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{filter.label}</p>
                  <p className="text-sm text-gray-500">{filter.description}</p>
                </div>

                <Toggle
                  checked={filter.enabled}
                  onChange={() => onToggle(filter.id)}
                />
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
