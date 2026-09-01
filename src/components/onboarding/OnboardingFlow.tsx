import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/ui/confetti'
import type { ConfettiRef } from '@/components/ui/confetti'
import {
  Slide1Illustration,
  Slide2Illustration,
  Slide3Illustration,
} from './OnboardingIllustrations'
import { STORAGE_KEYS } from '@/lib/constants'

type OnboardingSlide = {
  id: number
  title: string
  description: string
  illustration: React.ReactNode
  buttonText: string
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Organize Your Tasks',
    description:
      'Keep your tasks organized and easily manage everything in one place.',
    illustration: <Slide1Illustration />,
    buttonText: 'Next',
  },
  {
    id: 2,
    title: 'Stay Productive',
    description: 'Track your progress and stay focused on what matters most.',
    illustration: <Slide2Illustration />,
    buttonText: 'Next',
  },
  {
    id: 3,
    title: 'Make Every Task Count',
    description:
      'Complete tasks, build your streak, and reach your daily goals.',
    illustration: <Slide3Illustration />,
    buttonText: 'Get Started',
  },
]

const COMPLETION_DELAY_MS = 650

export function OnboardingFlow() {
  const navigate = useNavigate()
  const confettiRef = useRef<ConfettiRef>(null)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)

  const currentSlide = SLIDES[currentSlideIndex]
  const isLastSlide = currentSlideIndex === SLIDES.length - 1

  const handleComplete = useCallback(() => {
    if (isCompleting) return

    setIsCompleting(true)

    void confettiRef.current?.fire({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      ticks: 180,
      colors: ['#16a34a', '#22c55e', '#4ade80'],
    })

    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true')
    } catch {
      // ignore storage errors
    }

    window.setTimeout(() => {
      navigate({
        to: '/login',
        replace: true,
      })
    }, COMPLETION_DELAY_MS)
  }, [isCompleting, navigate])

  const handleNext = useCallback(() => {
    if (isCompleting) return

    if (!isLastSlide) {
      setCurrentSlideIndex((index) => index + 1)
      return
    }

    handleComplete()
  }, [isCompleting, isLastSlide, handleComplete])

  const handlePrev = useCallback(() => {
    if (isCompleting) return

    setCurrentSlideIndex((index) => Math.max(0, index - 1))
  }, [isCompleting])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') {
        handleNext()
      }

      if (event.key === 'ArrowLeft') {
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleNext, handlePrev])

  return (
    <main
      className={`relative min-h-dvh w-full overflow-hidden bg-[#f6fbf7]  px-8 py-8 text-slate-900 transition-all duration-500 ease-out ${
        isCompleting ? 'pointer-events-none scale-[0.98] opacity-0' : ''
      }`}
    >
      {/* Background decorations */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-green-200/40 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-emerald-100 blur-3xl sm:h-[30rem] sm:w-[30rem]" />

        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-3xl" />
      </div>

      {/* Confetti */}
      <Confetti
        ref={confettiRef}
        manualstart
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />

      <section
        className={`relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-8 ${
          isCompleting ? 'pointer-events-none' : ''
        }`}
        aria-busy={isCompleting}
      >
        {/* Header */}
        <header className="flex w-full shrink-0 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm sm:h-10 sm:w-10">
              <img
                src="/logo.png"
                alt="TodoSpace"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="leading-tight">
              <div className="flex items-center">
                <span className="text-lg font-extrabold text-green-600 sm:text-xl">
                  Todo
                </span>

                <span className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  Space
                </span>
              </div>
            </div>
          </div>

          {/* Skip */}
          {!isLastSlide && (
            <Button
              type="button"
              onClick={handleComplete}
              disabled={isCompleting}
              variant="ghost"
              size="sm"
              className="min-h-10 px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-green-50 hover:text-green-600 sm:text-sm"
            >
              Skip
            </Button>
          )}
        </header>

        {/* Main content */}
        <div
          key={currentSlideIndex}
          className="animate-slide-fade mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center text-center"
          aria-live="polite"
        >
          {/* Illustration */}
          <div className="flex h-48 w-full max-w-sm items-center justify-center sm:h-60 sm:max-w-md md:h-64 lg:h-72 lg:max-w-lg">
            {currentSlide.illustration}
          </div>

          {/* Content */}
          <div className="mt-5 max-w-2xl space-y-2 px-2 sm:mt-7 sm:space-y-3">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] text-green-600 uppercase sm:text-xs">
              Step {currentSlide.id} of {SLIDES.length}
            </p>

            <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.7rem]">
              {currentSlide.title}
            </h1>

            <p className="mx-auto max-w-xl text-sm leading-relaxed font-medium text-slate-500 sm:text-base lg:text-lg">
              {currentSlide.description}
            </p>
          </div>
        </div>

        {/* Controls */}
        <footer className="mx-auto flex w-full max-w-sm shrink-0 flex-col items-center pb-2 sm:max-w-md lg:pb-0">
          {/* Pagination */}
          <div
            className="mb-4 flex items-center justify-center gap-2 sm:mb-5"
            aria-label={`Step ${currentSlide.id} of ${SLIDES.length}`}
          >
            {SLIDES.map((slide, index) => {
              const isActive = index === currentSlideIndex

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    if (!isCompleting) {
                      setCurrentSlideIndex(index)
                    }
                  }}
                  disabled={isCompleting}
                  aria-label={`Go to step ${slide.id}`}
                  aria-current={isActive ? 'step' : undefined}
                  className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-600 ${
                    isActive
                      ? 'w-6 bg-green-600 sm:w-8'
                      : 'w-2 bg-slate-200 hover:bg-slate-300 sm:w-2.5'
                  }`}
                />
              )
            })}
          </div>

          {/* Primary action */}
          <Button
            type="button"
            onClick={handleNext}
            disabled={isCompleting}
            size="lg"
            className="h-12 w-full rounded-xl bg-green-600 text-sm font-bold text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700  sm:h-13 sm:rounded-2xl sm:text-base"
          >
            <span>{currentSlide.buttonText}</span>

            {!isLastSlide && (
              <ArrowRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>

          {/* Back */}
          <Button
            type="button"
            onClick={handlePrev}
            disabled={isCompleting || currentSlideIndex === 0}
            variant="ghost"
            size="sm"
            className={`mt-1 h-12 w-full text-xs font-semibold sm:mt-2 sm:text-sm ${
              currentSlideIndex === 0
                ? 'invisible'
                : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
            }`}
          >
            Back
          </Button>
        </footer>
      </section>
    </main>
  )
}
