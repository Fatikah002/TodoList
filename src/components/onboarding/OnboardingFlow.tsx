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

type OnboardingSlide = {
  id: number
  eyebrow: string
  title: string
  description: string
  illustration: React.ReactNode
  buttonText: string
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    eyebrow: 'Organize Your Tasks',
    title: 'Organize Your Tasks',
    description:
      'Keep your tasks organized and easily manage everything in one place.',
    illustration: <Slide1Illustration />,
    buttonText: 'Next',
  },
  {
    id: 2,
    eyebrow: 'Stay Productive',
    title: 'Stay Productive',
    description:
      'Track your progress and stay focused on what matters most.',
    illustration: <Slide2Illustration />,
    buttonText: 'Next',
  },
  {
    id: 3,
    eyebrow: 'Make Every Task Count',
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

    localStorage.setItem('todospace_onboarding_completed', 'true')

    window.setTimeout(() => {
      navigate({
        to: '/dashboard',
        search: { view: 'dashboard' },
        replace: true,
      })
    }, COMPLETION_DELAY_MS)
  }, [isCompleting, navigate])

  const handleNext = useCallback(() => {
    if (!isLastSlide) {
      setCurrentSlideIndex((index) => index + 1)
      return
    }

    handleComplete()
  }, [isLastSlide, handleComplete])

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
      className={`relative flex h-dvh w-full flex-col overflow-hidden bg-white text-slate-900 transition-all duration-500 ease-out select-none ${
        isCompleting ? 'scale-[0.98] opacity-0 pointer-events-none' : ''
      }`}
    >
      {/* Confetti */}
      <Confetti
        ref={confettiRef}
        manualstart
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />

      <section
        className={`mx-auto flex h-dvh w-full max-w-5xl flex-col justify-between px-5 py-6 sm:px-10 sm:py-8 ${
          isCompleting ? 'pointer-events-none' : ''
        }`}
        aria-busy={isCompleting}
      >
        {/* Header */}
        <header className="flex w-full shrink-0 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
              <img
                src="/logo.png"
                alt="TodoSpace"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="leading-tight">
              <div className="flex items-center">
                <span className="text-xl font-extrabold text-green-600">Todo</span>
                <span className="text-xl font-extrabold text-slate-900">Space</span>
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
              className="text-xs sm:text-sm font-semibold text-slate-400 hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
            >
              Skip
            </Button>
          )}
        </header>

        {/* Center Main Content - Scrollable & Well Proportioned */}
        <div
          key={currentSlideIndex}
          className="animate-slide-fade flex flex-1 flex-col items-center justify-center py-6 text-center max-w-4xl mx-auto w-full my-auto"
          aria-live="polite"
        >
          {/* Illustration Container */}
          <div className="w-full max-w-lg mx-auto h-52 sm:h-72 md:h-88 flex items-center justify-center">
            {currentSlide.illustration}
          </div>

          {/* Text Content */}
          <div className="mt-7 max-w-xl mx-auto space-y-2.5 px-4 sm:mt-8">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {currentSlide.title}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-500 leading-relaxed font-medium max-w-lg mx-auto">
              {currentSlide.description}
            </p>
          </div>
        </div>

        {/* Bottom Controls Footer */}
        <footer className="mx-auto w-full max-w-xs sm:max-w-md shrink-0 pb-10 sm:pb-12 pt-4 flex flex-col items-center">
          {/* Pagination Indicators */}
          <div
            className="mb-5 sm:mb-6 flex items-center justify-center gap-2"
            aria-label={`Step ${currentSlide.id} of ${SLIDES.length}`}
          >
            {SLIDES.map((slide, index) => {
              const isActive = index === currentSlideIndex

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(index)}
                  disabled={isCompleting}
                  aria-label={`Go to step ${slide.id}`}
                  aria-current={isActive ? 'step' : undefined}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-6 sm:w-8 bg-green-600'
                      : 'w-2 sm:w-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              )
            })}
          </div>

          {/* Primary Action Button */}
          <Button
            type="button"
            onClick={handleNext}
            disabled={isCompleting}
            size="lg"
            className="h-12 sm:h-13 w-full rounded-xl sm:rounded-2xl bg-green-600 font-bold text-white text-sm sm:text-base shadow-lg shadow-green-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 active:translate-y-0 active:scale-98 cursor-pointer"
          >
            <span>{currentSlide.buttonText}</span>

            {!isLastSlide && <ArrowRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>

          {/* Previous/Back Button */}
          {currentSlideIndex > 0 && (
            <Button
              type="button"
              onClick={handlePrev}
              disabled={isCompleting}
              variant="ghost"
              size="sm"
              className="mt-2 sm:mt-3 font-semibold text-xs sm:text-sm text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Back
            </Button>
          )}
        </footer>
      </section>
    </main>
  )
}
