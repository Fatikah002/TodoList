import { CircularProgress } from '@/components/dashboard/CircularProgress'

type WeeklyProgressSectionProps = {
  completed: number
  total: number
  percentage: number
}

export function WeeklyProgressSection({
  completed,
  total,
  percentage,
}: WeeklyProgressSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            This Week
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-500">Tasks completed</p>

      <div className="mt-3 flex items-center gap-3">
        <CircularProgress
          percentage={percentage}
          className="h-14 w-14"
        />

        <div>
          <p className="text-lg font-bold text-gray-900">
            {completed} / {total}
          </p>
        </div>
      </div>
    </section>
  )
}
