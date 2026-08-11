import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Award, ChevronRight, LogOut, Settings, User } from 'lucide-react'
import { UserAvatar } from '@/components/ui/user-avatar'
import { useProfile } from '@/hooks/useProfile'
import { useTodos } from '@/hooks/useTodos'
import { getProgressInfo } from '@/lib/xp'
import { ProgressCard } from '@/components/account/LevelXP'

import { useAchievements } from '@/hooks/useAchievements'

export const Route = createFileRoute('/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { todos } = useTodos()
  const { unlockedIds, unlockedCount, totalCount } = useAchievements()
  const info = getProgressInfo(todos, unlockedIds)

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      {/* Profile Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <UserAvatar className="size-16 border border-gray-200 shadow-sm" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">{profile.name}</h1>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        {/* Level & XP */}
        <div className="mt-5">
          <ProgressCard info={info} />
        </div>
      </div>

      {/* Account Menu */}
      <div>
        <button
          onClick={() => navigate({ to: '/account/editAccount' })}
          className="flex w-full items-center gap-4 rounded-lg px-3 py-4 text-left transition-colors hover:bg-green-50"
        >
          <User className="h-5 w-5 text-green-600" />
          <span className="flex-1 text-sm font-medium text-gray-900">
            Edit Profile
          </span>
          <ChevronRight className="h-5 w-5 text-green-600" />
        </button>

        <hr className="border-gray-200" />

        <button
          onClick={() => navigate({ to: '/account/settings' })}
          className="flex w-full items-center gap-4 rounded-lg px-3 py-4 text-left transition-colors hover:bg-green-50"
        >
          <Settings className="h-5 w-5 text-green-600" />
          <span className="flex-1 text-sm font-medium text-gray-900">
            Settings
          </span>
          <ChevronRight className="h-5 w-5 text-green-600" />
        </button>

        <hr className="border-gray-200" />

        <button
          onClick={() => navigate({ to: '/account/achievements' })}
          className="flex w-full items-center gap-4 rounded-lg px-3 py-4 text-left transition-colors hover:bg-green-50"
        >
          <Award className="h-5 w-5 text-green-600" />
          <span className="flex-1 text-sm font-medium text-gray-900">
            Achievements
          </span>
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
            {unlockedCount}/{totalCount}
          </span>
          <ChevronRight className="h-5 w-5 text-green-600" />
        </button>

        <hr className="border-gray-200" />

        <button
          onClick={() => {}}
          className="flex w-full items-center gap-4 rounded-lg px-3 py-4 text-left transition-colors hover:bg-green-50"
        >
          <LogOut className="h-5 w-5 text-red-500" />
          <span className="flex-1 text-sm font-medium text-red-500">
            Logout
          </span>
          <ChevronRight className="h-5 w-5 text-green-600" />
        </button>
      </div>
    </div>
  )
}
