import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences'
import type { NotificationPreferences } from '@/lib/types'

export const Route = createFileRoute('/account/settings/notifications')({
  component: NotificationsPage,
})

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200',
        checked ? 'bg-green-500' : 'bg-gray-300',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200',
          checked ? 'translate-x-5.5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

type NotificationPreferenceItem = {
  key: keyof NotificationPreferences
  label: string
  description: string
}

const NOTIFICATION_PREFERENCES: NotificationPreferenceItem[] = [
  {
    key: 'taskDeadlineApproaching',
    label: 'Task Deadline',
    description: 'Show a notification when a task is nearing its deadline',
  },
  {
    key: 'taskOverdue',
    label: 'Task Overdue',
    description: 'Show a notification when a task is overdue',
  },
  {
    key: 'achievementUnlocked',
    label: 'Achievement',
    description: 'Show a notification when an achievement is unlocked',
  },
]

function NotificationsPage() {
  const navigate = useNavigate()
  const { preferences, updatePreference } = useNotificationPreferences()

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl  px-8 py-8 sm:px-8 sm:py-8 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/account/settings' })}
            aria-label="Back to settings"
            className="rounded-full text-green-600 hover:bg-green-50 pb-4"

          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">
              Select the notifications you want to receive.{' '}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white divide-y divide-gray-100">
          {NOTIFICATION_PREFERENCES.map((item) => {
            return (
              <div key={item.key} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <Toggle
                  checked={preferences[item.key]}
                  onChange={() =>
                    updatePreference(item.key, !preferences[item.key])
                  }
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
