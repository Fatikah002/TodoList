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
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
          Weekly Progress
        </h2>
      </div>

      <div className="flex items-center gap-5">
        <CircularProgress
          percentage={percentage}
          className="h-20 w-20 sm:h-24 sm:w-24"
        />

        <div className="flex-1">
          <p className="text-xl font-bold text-gray-900">
            {completed} / {total}
          </p>

          <p className="mt-1 text-xs text-gray-500">Tasks Completed</p>

          <div className="mt-4 h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-green-600 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
