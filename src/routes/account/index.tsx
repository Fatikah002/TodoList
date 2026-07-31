import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ChevronRight, LogOut, Settings, User } from 'lucide-react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/account/')({
  component: RouteComponent,
})

const defaultProfile = {
  name: 'Fatikah',
  email: 'fatikah@email.com',
  bio: 'Frontend Developer',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
}

function RouteComponent() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(defaultProfile)

  useEffect(() => {
    const storedProfile = localStorage.getItem('profile')
    if (!storedProfile) return

    try {
      setProfile({ ...defaultProfile, ...JSON.parse(storedProfile) })
    } catch {
      localStorage.removeItem('profile')
    }
  }, [])

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200  p-6 shadow-md backdrop-blur">
        <Avatar size="lg" className="size-20 border-2 border-white shadow-md">
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback>{profile.name.charAt(0).toUpperCase() || 'F'}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">
            {profile.name}
          </h1>
          <p className="text-sm text-gray-500">
            {profile.email}
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <Card className="overflow-hidden border-gray-200 bg-white shadow-md backdrop-blur">
        <CardContent className="divide-y divide-gray-200 p-0">
          <button
            onClick={() => navigate({ to: '/account/editAccount' })}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-100"
          >
            <div className="flex h-9 w-9 items-center justify-center">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <span className="flex-1 text-sm font-medium ">
              Edit Profile
            </span>
            <ChevronRight className="h-4 w-4 text-green-600" />
          </button>

          <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-100">
            <div className="flex h-9 w-9 items-center justify-center">
              <Settings className="h-5 w-5 text-green-600" />
            </div>
            <span className="flex-1 text-sm font-medium">
              Settings
            </span>
            <ChevronRight className="h-4 w-4 " />
          </button>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-gray-200 bg-white shadow-md backdrop-blur">
        <CardContent className="p-0">
          <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-red-50/80">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
              <LogOut className="h-4 w-4 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600">Logout</span>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
