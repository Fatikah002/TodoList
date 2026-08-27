import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Award,
  ChevronRight,
  Flame,
  LogOut,
  Settings,
  Trash2,
  User,
} from 'lucide-react'
import { UserAvatar } from '@/components/ui/user-avatar'
import { useProfile } from '@/hooks/useProfile'
import { useTodos } from '@/hooks/useTodos'
import { getProgressInfo } from '@/lib/xp'
import { ProgressCard } from '@/components/account/LevelXP'
import { useAchievements } from '@/hooks/useAchievements'
import { calculateStreak } from '@/lib/streak'
import { STORAGE_KEYS } from '@/lib/constants'

export const Route = createFileRoute('/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { todos } = useTodos()
  const { unlockedIds, unlockedCount, totalCount } = useAchievements()
  const streak = calculateStreak(todos)
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
      <div className="rounded-2xl bg-white ">
        <button
          onClick={() => navigate({ to: '/account/editAccount' })}
          className="flex w-full items-center gap-4 rounded-t-2xl px-5 py-4 text-left transition-colors hover:bg-gray-50"
        >
          <User className="h-5 w-5 text-green-600" />
          <span className="flex-1 text-sm font-medium text-gray-900">
            Edit Profile
          </span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <hr className="border-gray-100" />

        <button
          onClick={() => navigate({ to: '/account/settings' })}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50"
        >
          <Settings className="h-5 w-5 text-green-600" />
          <span className="flex-1 text-sm font-medium text-gray-900">
            Settings
          </span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <hr className="border-gray-100" />

        <button
          onClick={() => navigate({ to: '/account/achievements' })}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50"
        >
          <Award className="h-5 w-5 text-green-600" />
          <span className="flex-1 text-sm font-medium text-gray-900">
            Achievements
          </span>
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
            {unlockedCount}/{totalCount}
          </span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <hr className="border-gray-100" />

        <button
          onClick={() => navigate({ to: '/account/streak' })}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50"
        >
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="flex-1 text-sm font-medium text-gray-900">
            Streaks
          </span>
          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-600">
            {streak} days
          </span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <hr className="border-gray-100" />

        <button
          onClick={() => {
            localStorage.removeItem(STORAGE_KEYS.LOGGED_IN)
            localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)
            navigate({ to: '/login', replace: true })
          }}
          className="flex w-full items-center gap-4 rounded-b-2xl px-5 py-4 text-left transition-colors hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 text-red-500" />
          <span className="flex-1 text-sm font-medium text-red-500">
            Logout
          </span>
        </button>
      </div>

      {/* Delete Account Button */}
      <button
        type="button"
        onClick={() => navigate({ to: '/account/deleteAccount' })}
        className="flex  w-full items-center justify-center gap-2 rounded-2xl border border-red-300 bg-white px-5 py-3.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
      >
        <Trash2 className="h-4 w-4" />
        Delete Account
      </button>
    </div>
  )
}
