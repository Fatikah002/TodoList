import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  HardDrive,
  Github,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/account/settings/about')({
  component: AboutPage,
})

const FEATURES = [
  'Calendar',
  'Categories',
  'Priorities',
  'Archive',
  'Local Storage',
]

const BUILT_WITH = [
  'React',
  'TypeScript',
  'TanStack Start',
  'Tailwind CSS',
  'shadcn/ui',
]

function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/account/settings' })}
            aria-label="Back to settings"
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">About</h1>
          </div>
        </div>

        <div className="rounded-2xl bg-white divide-y divide-gray-100">
          {/* App Info */}
          <div className="px-5 py-5">
            <h3 className="text-lg font-bold text-gray-900">TodoSpace</h3>
            <p className="text-sm text-gray-500">Version 1.0.0</p>
            <p className="mt-2 text-sm text-gray-600">
              A lightweight task management application built with React and
              TanStack Start.
            </p>
          </div>

          {/* Features */}
          <div className="px-5 py-5">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              Features
            </h4>
            <div className="space-y-2">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Built With */}
          <div className="px-5 py-5">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              Built With
            </h4>
            <div className="space-y-2">
              {BUILT_WITH.map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Storage */}
          <div className="px-5 py-5">
            <div className="flex items-center gap-3">
              <HardDrive className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Storage</h4>
                <p className="text-sm text-gray-500">
                  Your data is stored locally on this device.
                </p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-gray-50"
            >
              <Github className="h-5 w-5 text-gray-400" />
              <span className="flex-1 text-sm font-medium text-gray-900">
                GitHub Repository
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </a>
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-gray-50"
            >
              <BookOpen className="h-5 w-5 text-gray-400" />
              <span className="flex-1 text-sm font-medium text-gray-900">
                Documentation
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
