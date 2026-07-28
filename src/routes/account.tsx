import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, LogOut, Settings, User } from 'lucide-react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-md  outline-3 outline-gray-200">
        <Avatar size="lg" className="size-20">
          <AvatarImage
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
            alt="Fatikah"
          />
          <AvatarFallback>F</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900">Fatikah</h1>
          <p className="text-sm text-slate-500">fatikah@email.com</p>
        </div>
      </div>

      {/* Menu Items */}
      <Card className="overflow-hidden ">
        <CardContent className="divide-y p-0">
          <button className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              <User className="h-4 w-4 text-slate-600" />
            </div>
            <span className="flex-1 text-sm font-medium text-slate-900">
              Edit Profile
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>

          <button className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              <Settings className="h-4 w-4 text-slate-600" />
            </div>
            <span className="flex-1 text-sm font-medium text-slate-900">
              Settings
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card>
        <CardContent className="p-0">
          <button className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
              <LogOut className="h-4 w-4 text-red-600" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
