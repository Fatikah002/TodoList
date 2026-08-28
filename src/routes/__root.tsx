import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import appCss from '../styles.css?url'
import { MobileNavbar } from '@/components/layout/MobileNavbar'
import { AppHeader } from '@/components/layout/AppHeader'
import { TodosProvider } from '@/hooks/useTodos'
import { ProfileProvider } from '@/hooks/useProfile'
import { NotificationPreferencesProvider } from '@/hooks/useNotificationPreferences'
import { Toaster } from '@/components/ui/sonner'
import { GlobalAchievementNotifier } from '@/components/GlobalAchievementNotifier'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TodoSpace',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const pageTitle =
    pathname === '/dashboard' ? 'Dashboard'
    : pathname === '/onboarding' ? 'Welcome Tour'
    : pathname === '/login' ? 'Login'
    : pathname === '/todos' ? 'Tasks'
    : pathname === '/archived' ? 'Archived'
    : pathname.startsWith('/account/achievements') ? 'Achievements'
    : pathname.startsWith('/account/streak') ? 'Streak'
    : pathname.startsWith('/account/settings/quick-filters') ? 'Quick Filters'
    : pathname.startsWith('/account/settings/notifications') ? 'Notifications'
    : pathname.startsWith('/account/settings/about') ? 'About'
    : pathname.startsWith('/account/settings') ? 'Settings'
    : pathname.startsWith('/account/edit') ? 'Edit Profile'
    : pathname.startsWith('/account') ? 'Account'
    : ''

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ProfileProvider>
          <NotificationPreferencesProvider>
            <TodosProvider>
              <GlobalAchievementNotifier />
            <TooltipProvider>
              {pathname === '/onboarding' || pathname === '/login' ? (
                <main className="min-h-screen w-full transition-opacity duration-300 ease-in-out">{children}</main>
              ) : (
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset className="flex min-h-screen flex-col transition-all duration-300 ease-in-out animate-in fade-in-50">
                    <AppHeader title={pageTitle} className="hidden md:flex" />
                    <main className="flex-1 pb-24 md:pb-0">{children}</main>
                    <MobileNavbar />
                  </SidebarInset>
                </SidebarProvider>
              )}
            </TooltipProvider>
          </TodosProvider>
        </NotificationPreferencesProvider>
      </ProfileProvider>
        <Toaster richColors position="top-center" />
        <Scripts />
      </body>
    </html>
  )
}
