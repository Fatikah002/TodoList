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

  if (!showTotal) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
         <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
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
      {/* <h2 className="mb-3 text-sm font-semibold text-gray-900 sm:text-base">
        Overview
      </h2> */}

      <div className="flex h-10 w-full items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {statItems.map((stat, index) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className={`flex h-full flex-1 items-center justify-center gap-1.5 px-2 sm:gap-2 sm:px-4 ${
                index !== 0 ? 'border-l border-gray-200' : ''
              }`}
            >
              <Icon
                className={`h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${stat.iconColor}`}
              />

              <span className="text-sm font-semibold text-gray-900">
                {stat.value}
              </span>

              <span className="hidden text-xs text-gray-500 sm:inline">
                {stat.label}
              </span>

              <span className="text-[10px] text-gray-500 sm:hidden">
                {stat.label.replace(' Tasks', '')}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

