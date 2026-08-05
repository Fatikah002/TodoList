import { ListChecks, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

type Stat = {
  label: string
  value: number
  icon: typeof ListChecks
  iconColor: string
}

type StatsGridProps = {
  total: number
  completed: number
  pending: number
  overdue: number
}

export function StatsGrid({
  total,
  completed,
  pending,
  overdue,
}: StatsGridProps) {
  const stats: Stat[] = [
    {
      label: 'Total Tasks',
      value: total,
      icon: ListChecks,
      iconColor: 'text-blue-600',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      iconColor: 'text-green-600',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Overdue',
      value: overdue,
      icon: AlertTriangle,
      iconColor: 'text-red-600',
    },
  ]

  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
        Overview
      </h2>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="flex min-h-[115px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12">
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
              </div>

              <p className="mt-2 text-[10px] text-gray-500 sm:text-xs">
                {stat.label}
              </p>

              <p className="text-lg font-bold text-gray-900 sm:text-xl">
                {stat.value}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
