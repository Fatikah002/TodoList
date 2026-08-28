import { Bell } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/ui/user-avatar'

type AppHeaderProps = {
  title?: string
  className?: string
}

export function AppHeader({ title, className }: AppHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur-md px-4 md:h-16 md:px-6 ${className ?? ''}`}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="flex" />

        {title && <h1 className="text-base font-semibold md:text-xl">{title}</h1>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
        </Button>

        <UserAvatar className="h-8 w-8 md:h-9 md:w-9" />
      </div>
    </header>
  )
}
