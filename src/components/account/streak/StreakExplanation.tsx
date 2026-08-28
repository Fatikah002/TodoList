import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function StreakExplanation() {
  const [showExplanation, setShowExplanation] = useState(false)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setShowExplanation(!showExplanation)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="text-sm font-semibold text-gray-900">
          How do streaks work?
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            showExplanation ? 'rotate-180' : ''
          }`}
        />
      </button>

      {showExplanation && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-xs text-gray-500">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
              Complete at least one activity each day to build your streak.
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-500">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
              Each day you do an activity, your streak increases.
            </li>
            <li className="flex items-start gap-2 text-xs text-gray-500">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
              Missing a day will reset your streak to 0.
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
