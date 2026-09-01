import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Award, ArrowLeft } from 'lucide-react'
import { useAchievements } from '@/hooks/useAchievements'
import { AchievementCard } from '@/components/account/AchievementCard'
import type { AchievementFilter } from '@/lib/achievements'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/account/achievements')({
  component: RouteComponent,
})

const filterOptions: AchievementFilter[] = [
  'All',
  'In Progress',
  'Completed',
  'Locked',
]

function RouteComponent() {
  const navigate = useNavigate()
  const {
    achievements,
    unlockedCount,
    totalCount,
    overallPercentage,
    filter,
    setFilter,
  } = useAchievements()

  return (
    <div className="flex flex-1 flex-col">
    <div className="mx-auto w-full max-w-6xl space-y-5 px-8 py-8 sm:px-8 sm:py-8 lg:px-8">
       <div className="mb-6 flex items-center gap-3 md:mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/account' })}
          aria-label="Back to profile"
          className="rounded-full text-green-600 hover:bg-green-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-gray-900">
          Achievements
        </h1>
      </div>

      {/* Header Card */}
      <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50/70 via-white to-emerald-50/30 p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900 sm:text-2xl">
                Achievements
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700">
                <Award size={16} />
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Complete milestones and collect badges.
            </p>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-xs font-bold text-green-700">
              {unlockedCount} of {totalCount} unlocked
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/80">
            <div
              className="h-full rounded-full bg-green-600 transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterOptions.map((option) => {
          const isActive = filter === option
          return (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-green-600 text-white shadow-xs shadow-green-600/20'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>

      {/* Achievement Cards List */}
      <div className="space-y-3">
        {achievements.length > 0 ? (
          achievements.map((item) => (
            <AchievementCard
              key={item.id}
              achievement={item}
              onSelect={() => undefined}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <p className="text-sm font-medium text-gray-500">
              No achievements found in "{filter}".
            </p>
          </div>
        )}
      </div>

    </div>
    </div>
  )
}
