import {
  Outlet,
  createFileRoute,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import {
  ArrowLeft,
  SlidersHorizontal,
  Bell,
  Info,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getQuickFilters } from '@/lib/presets'

export const Route = createFileRoute('/account/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isIndex = pathname === '/account/settings'

  const filters = getQuickFilters()
  const enabledCount = filters.filter((f) => f.enabled).length

  const MENU_ITEMS = [
    {
      label: 'Quick Filters',
      description: `${enabledCount} of ${filters.length} active`,
      icon: SlidersHorizontal,
      to: '/account/settings/quick-filters' as const,
    },
    {
      label: 'Notifications',
      description: 'Manage notification preferences',
      icon: Bell,
      to: '/account/settings/notifications' as const,
    },
    {
      label: 'About',
      description: 'App info and resources',
      icon: Info,
      to: '/account/settings/about' as const,
    },
  ]

  if (!isIndex) {
    return <Outlet />
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        <div className="mb-5 flex items-center gap-3">
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

        <div className="rounded-2xl bg-white border border-gray-200 ">
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon
            const isFirst = index === 0
            const isLast = index === MENU_ITEMS.length - 1
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate({ to: item.to })}
                className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 border-b border-gray-200 ${
                  isFirst ? 'rounded-t-2xl' : ''
                } ${isLast ? 'rounded-b-2xl' : ''}`}
              >
                <Icon className="h-5 w-5 text-green-600 " />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
