import { Bell } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type AppHeaderProps = {
  title?: string
}

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="hidden md:flex" />

        {title && (
          <h1 className="text-xl font-semibold">
            {title}
          </h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
        >
          <Bell className="h-5 w-5" />

          {/* Badge */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>FS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}