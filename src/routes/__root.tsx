import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import appCss from '../styles.css?url'
import { MobileNavbar } from '@/components/MobileNavbar'
import { AppHeader } from '@/components/AppHeader'

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
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />

            <SidebarInset className="flex min-h-screen flex-col">
              <AppHeader title={pageTitle} />
              <main className="flex-1 pb-24 md:pb-0">{children}</main>
              <MobileNavbar />
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
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
        <Scripts />
      </body>
    </html>
  )
}
