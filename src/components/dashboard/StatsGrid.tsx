import { ListChecks, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

export type TodoStats = {
  total: number
  completed: number
  pending: number
  overdue: number
}

type Stat = {
  label: string
  value: number
  icon: typeof ListChecks
  iconBackground: string
  iconColor: string
}

type StatsGridProps = {
  stats: TodoStats
  showTotal?: boolean
}

export function StatsGrid({ stats, showTotal = true }: StatsGridProps) {
  const statItems: Stat[] = [
    ...(showTotal
      ? [
          {
            label: 'Total Tasks',
            value: stats.total,
            icon: ListChecks,
            iconBackground: 'bg-blue-50',
            iconColor: 'text-blue-600',
          },
        ]
      : []),
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      iconBackground: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      iconBackground: 'bg-amber-50',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      iconBackground: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ]

  const gridCols = showTotal ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'

  if (!showTotal) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">
          Daily Summary
        </h2>

        <div className="grid grid-cols-3 gap-1">
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-0.5 rounded-xl p-1"
            >
              <p className={`text-lg font-bold leading-tight ${stat.iconColor}`}>
                {stat.value}
              </p>
              <p className="text-[10px] text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
        Overview
      </h2>

      <div className={`mt-3 grid ${gridCols} gap-2.5 sm:gap-3`}>
        {statItems.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="flex min-h-[105px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-2.5 sm:p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-full sm:h-12 sm:w-12 ${stat.iconBackground}`}>
                <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.iconColor}`} />
              </div>

              <p className="mt-1.5 text-[10px] text-gray-500 sm:text-xs text-center">
                {stat.label}
              </p>

              <p className="text-base font-bold text-gray-900 sm:text-xl">
                {stat.value}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}


