import { useLocation, useNavigate } from '@tanstack/react-router'

import { SidebarNavItem } from '#/components/layout/SidebarNavItem'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { navigationItems } from '@/lib/navigation'

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathname = location.pathname
  const searchParams = new URLSearchParams(location.search)
  const view = searchParams.get('view')

  function isActive(item: (typeof navigationItems)[number]) {
    if (item.search?.view) {
      return pathname === item.to && view === item.search.view
    }
    return pathname === item.to
  }

  const mainNavItems = navigationItems.filter((item) => item.to !== '/account')

  const accountItem = navigationItems.find((item) => item.to === '/account')!

  return (
    <Sidebar collapsible="offcanvas">
      {/* ================= Header ================= */}
      <SidebarHeader className="flex h-16 items-center border-b px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white shadow-sm">
              <img
                src="/logo.png"
                alt="TodoSpace"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold text-green-600">Todo</span>
            <span className="text-lg font-bold text-slate-900">Space</span>
          </div>
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
                  active={isActive(item)}
                  onClick={() =>
                    navigate({
                      to: item.to,
                      ...(item.search ? 
                        { search: item.search } : {}),
                    })
                  }
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ================= Footer ================= */}
      <SidebarFooter className="mt-auto border-t p-4">
        <SidebarMenu className="space-y-2">
          <SidebarNavItem
            icon={accountItem.icon}
            label={accountItem.label}
            active={isActive(accountItem)}
            onClick={() =>
              navigate({
                to: accountItem.to,
                ...(accountItem.search ? { search: accountItem.search } : {}),
              })
            }
          />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
