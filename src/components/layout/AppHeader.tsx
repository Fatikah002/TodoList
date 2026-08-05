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
      className={`hidden md:flex h-14 items-center justify-between border-b bg-background px-4 md:h-16 md:px-6 ${className ?? ''}`}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="hidden md:flex" />

        {title && <h1 className="text-xl font-semibold">{title}</h1>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />

          {/* Badge */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <UserAvatar className="h-9 w-9" />
      </div>
    </header>
  )
}
