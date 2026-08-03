import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '#/components/layout/AppSidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import appCss from '../styles.css?url'
import { MobileNavbar } from '#/components/layout/MobileNavbar'
import { AppHeader } from '#/components/layout/AppHeader'
import { TodosProvider } from '@/hooks/useTodos'
import { Toaster } from '@/components/ui/sonner'

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
    {
      '/dashboard': 'Dashboard',
      '/todos': 'Tasks',
      '/archived': 'Archived',
    }[pathname] ?? ''
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TodosProvider>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="flex min-h-screen flex-col">
                <AppHeader title={pageTitle} className="hidden md:flex" />
                <main className="flex-1 pb-24 md:pb-0">{children}</main>
                <MobileNavbar />
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </TodosProvider>
        {/* <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        /> */}
        <Toaster richColors position="top-center" />
        <Scripts />
      </body>
    </html>
  )
}
