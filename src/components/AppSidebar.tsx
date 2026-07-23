import { useLocation, useNavigate } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  Archive,
  Check,
  LayoutDashboard,
  ListTodo,
  MoreVertical,
  Settings,
} from 'lucide-react'

import { SidebarNavItem } from '@/components/SidebarNavItem'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

type NavItem = {
  label: string
  icon: LucideIcon
  active: boolean
  action: () => void
}

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathname = location.pathname
  const searchParams = new URLSearchParams(location.search)

  const view = searchParams.get('view')

  const isDashboardPage =
    pathname === '/dashboard' && view === 'dashboard'

  const isTasksPage = pathname === '/todos'

  const isArchivedPage = pathname === '/archived'

  const mainNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: isDashboardPage,
      action: () =>
        navigate({
          to: '/dashboard',
          search: {
            view: 'dashboard',
          },
        }),
    },
    {
      label: 'Tasks',
      icon: ListTodo,
      active: isTasksPage,
      action: () =>
        navigate({
          to: '/todos',
          search: {
            view: 'all',
          },
        }),
    },
    {
      label: 'Archived',
      icon: Archive,
      active: isArchivedPage,
      action: () =>
        navigate({
          to: '/archived',
        }),
    },
  ]

  const footerNavItems: NavItem[] = [
    {
      label: 'Settings',
      icon: Settings,
      active: false,
      action: () => console.log('Settings'),
    },
  ]

  return (
    <Sidebar collapsible="offcanvas">
      {/* ================= Header ================= */}
    <SidebarHeader className="flex h-14 items-center border-b px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white shadow-sm">
            <Check className="h-5 w-5 stroke-[3]" />
          </div>
          <span className="text-lg font-bold text-slate-900">
            TodoSpace
          </span>
        </div>
      </SidebarHeader>

      {/* ================= Menu ================= */}
      <SidebarContent className="px-3 py-5">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mainNavItems.map((item) => (
                <SidebarNavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  active={item.active}
                  onClick={item.action}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ================= Footer ================= */}
      <SidebarFooter className="mt-auto border-t p-4">
        <SidebarMenu className="space-y-2">
          {footerNavItems.map((item) => (
            <SidebarNavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={item.active}
              onClick={item.action}
            />
          ))}
        </SidebarMenu>

        <div className="mt-4 flex items-center justify-between rounded-2xl border bg-white p-3 shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                alt="Fatikah"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                Fatikah
              </p>
              <p className="truncate text-xs text-slate-500">
                fatikah@email.com
              </p>
            </div>
          </div>

          <Button size="icon" variant="ghost">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
