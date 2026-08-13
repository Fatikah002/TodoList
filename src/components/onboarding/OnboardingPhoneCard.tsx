import React from 'react'
import { Wifi, Signal } from 'lucide-react'

export type OnboardingStepData = {
  id: number
  title: string
  description: string
  illustration: React.ReactNode
  buttonText: string
}

type OnboardingPhoneCardProps = {
  step: OnboardingStepData
  totalSteps?: number
  currentStep: number
  onNext?: () => void
  onSkip?: () => void
  onSelectStep?: (stepId: number) => void
  isOverviewMode?: boolean
  isActive?: boolean
}

export function OnboardingPhoneCard({
  step,
  totalSteps = 4,
  currentStep,
  onNext,
  onSkip,
  onSelectStep,
  isOverviewMode = false,
  isActive = true,
}: OnboardingPhoneCardProps) {
  const isLast = step.id === totalSteps

  return (
    <div
      onClick={() => isOverviewMode && onSelectStep && onSelectStep(step.id)}
      className={`relative flex flex-col overflow-hidden rounded-[38px] border border-gray-200/90 bg-white/95 backdrop-blur-sm shadow-xl transition-all duration-300 w-full max-w-[320px] min-h-[560px] ${
        isOverviewMode
          ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-400 hover:ring-4 hover:ring-emerald-500/10'
          : ''
      } ${isActive ? 'ring-2 ring-emerald-500/30 shadow-emerald-900/10' : 'opacity-90'}`}
    >
      {/* Phone Notch & Status Bar */}
      <div className="flex h-10 w-full items-center justify-between px-6 pt-3 select-none text-xs font-semibold text-gray-800">
        <span>9:41</span>
        <div className="flex items-center gap-1.5 opacity-80">
          <Signal className="h-3.5 w-3.5" />
          <Wifi className="h-3.5 w-3.5" />
          <div className="h-2.5 w-5 rounded-xs border border-gray-800 p-0.5">
            <div className="h-full w-full bg-gray-800 rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Top Header Row with Skip Button */}
      <div className="flex items-center justify-end px-5 py-1">
        {!isLast && onSkip ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSkip()
            }}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors px-2 py-1 rounded-md hover:bg-emerald-50 cursor-pointer"
          >
            Skip
          </button>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {/* Illustration Area */}
      <div className="px-5 pt-2 pb-4">
        {step.illustration}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between px-6 pb-6 text-center">
        <div>
          {/* Step Number Badge */}
          <div className="mx-auto mb-3 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shadow-xs">
            {step.id}
          </div>

          {/* Step Title */}
          <h3 className="text-xl font-bold tracking-tight text-gray-900 leading-snug">
            {step.title}
          </h3>

          {/* Step Description */}
          <p className="mt-2 text-xs leading-relaxed text-gray-500 font-normal">
            {step.description}
          </p>
        </div>

        {/* Bottom Section: Dots + Button */}
        <div className="mt-6 flex flex-col gap-5">
          {/* Carousel Dots */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const stepIdx = idx + 1
              const isCurrent = stepIdx === currentStep
              return (
                <button
                  key={stepIdx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectStep?.(stepIdx)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'w-6 bg-emerald-600'
                      : 'w-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label={`Go to step ${stepIdx}`}
                />
              )
            })}
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (isOverviewMode && onSelectStep) {
                onSelectStep(step.id)
              } else if (onNext) {
                onNext()
              }
            }}
            className={`w-full rounded-xl py-3 text-xs font-bold text-white shadow-md transition-all duration-200 active:scale-98 cursor-pointer ${
              isLast
                ? 'bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 shadow-emerald-500/25'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
          >
            {step.buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}
