import { useEffect, useRef } from 'react'
import type { Achievement } from '@/lib/achievements'
import { BadgeIcon } from './BadgeIcon'
import { Lock, LockOpen, X } from 'lucide-react'
import { triggerFireworks } from '@/components/ui/confetti'

type CelebrationModalProps = {
  achievement:
    | (Achievement & {
        isUnlocked?: boolean
        progress?: number
      })
    | null
  isCelebration: boolean
  onClose: () => void
}

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: {
      x: number
      y: number
      size: number
      color: string
      vx: number
      vy: number
      rotation: number
      vRot: number
    }[] = []

    const colors = [
      '#22c55e',
      '#eab308',
      '#f97316',
      '#a855f7',
      '#06b6d4',
      '#3b82f6',
      '#ef4444',
    ]

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 - 50,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 14,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
      })
    }

    let animId: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let activeCount = 0

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.3
        p.rotation += p.vRot

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()

        if (p.y < canvas.height) activeCount++
      }

      if (activeCount > 0) {
        animId = requestAnimationFrame(render)
      }
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-70 h-full w-full"
    />
  )
}

export function CelebrationModal({
  achievement,
  isCelebration,
  onClose,
}: CelebrationModalProps) {
  useEffect(() => {
    if (achievement && isCelebration) {
      triggerFireworks()
    }
  }, [achievement, isCelebration])

  if (!achievement) return null

  const isUnlocked = achievement.isUnlocked ?? true
  const progress = achievement.progress ?? achievement.target
  const percentage = Math.min(
    100,
    Math.round((progress / achievement.target) * 100),
  )

  return (
    <div className="fixed inset-0 z-80 flex items-end justify-center bg-black/50 p-0 backdrop-blur-xs sm:items-center sm:p-4">
      {isCelebration && <ConfettiCanvas />}

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-200 rounded-t-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:rounded-3xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="my-2">
            <BadgeIcon
              iconType={achievement.iconType}
              accentColor={achievement.accentColor}
              isUnlocked={isUnlocked}
              size="lg"
            />
          </div>

          {/* Heading */}
          {isCelebration ? (
            <>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                🎉 Achievement Unlocked!
              </span>
              <h2 className="mt-2 text-xl font-bold text-gray-900">
                {achievement.title}
              </h2>
            </>
          ) : (
            <h2 className="mt-2 text-xl font-bold text-gray-900">
              {achievement.title}
            </h2>
          )}

          {/* Subtitle / Description */}
          <p className="mt-1 text-sm text-gray-500">
            {achievement.description}
          </p>

          {/* Unlocked / Locked Status */}
          <div className="mt-3 flex items-center gap-2">
            {isUnlocked ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                <LockOpen size={14} /> Unlocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                <Lock size={14} /> Locked
              </span>
            )}

            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
              +{achievement.rewardXp} XP Reward
            </span>
          </div>

          {/* Progress Bar (if in detail view) */}
          {!isCelebration && (
            <div className="mt-4 w-full rounded-2xl bg-gray-50 p-4 border border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span>Progress</span>
                <span className="text-green-600">
                  {progress} / {achievement.target}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-6 w-full rounded-2xl bg-green-600 py-3.5 text-center text-sm font-bold text-white shadow-md shadow-green-600/20">
            {isCelebration ? 'Awesome!' : 'Got It'}
          </div>
        </div>
      </div>
    </div>
  )
}
