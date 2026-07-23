import { SidebarTrigger } from '@/components/ui/sidebar'

type AppHeaderProps = {
  title?: string
}

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="hidden md:flex" />
      {title && (
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      )}
    </header>
  )
}
