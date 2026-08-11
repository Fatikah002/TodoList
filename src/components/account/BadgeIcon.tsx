import type { AccentColor } from '@/lib/achievements'
import {
  Trophy,
  Flame,
  Hourglass,
  Star,
  Sun,
  Calendar,
  Rocket,
  Crown,
  Lock,
} from 'lucide-react'

type BadgeIconProps = {
  iconType:
    | 'trophy'
    | 'flame'
    | 'hourglass'
    | 'star'
    | 'sun'
    | 'calendar'
    | 'rocket'
    | 'crown'
  accentColor: AccentColor
  isUnlocked: boolean
  size?: 'sm' | 'md' | 'lg'
}

const colorStyles: Record<
  AccentColor,
  {
    bg: string
    ring: string
    icon: string
    glow: string
  }
> = {
  green: {
    bg: 'bg-emerald-500/10 text-emerald-600',
    ring: 'border-emerald-500/30',
    icon: 'text-emerald-600',
    glow: 'shadow-emerald-500/20',
  },
  orange: {
    bg: 'bg-orange-500/10 text-orange-600',
    ring: 'border-orange-500/30',
    icon: 'text-orange-600',
    glow: 'shadow-orange-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10 text-purple-600',
    ring: 'border-purple-500/30',
    icon: 'text-purple-600',
    glow: 'shadow-purple-500/20',
  },
  gold: {
    bg: 'bg-amber-500/10 text-amber-600',
    ring: 'border-amber-500/30',
    icon: 'text-amber-600',
    glow: 'shadow-amber-500/20',
  },
  blue: {
    bg: 'bg-sky-500/10 text-sky-600',
    ring: 'border-sky-500/30',
    icon: 'text-sky-600',
    glow: 'shadow-sky-500/20',
  },
  indigo: {
    bg: 'bg-indigo-500/10 text-indigo-600',
    ring: 'border-indigo-500/30',
    icon: 'text-indigo-600',
    glow: 'shadow-indigo-500/20',
  },
  teal: {
    bg: 'bg-teal-500/10 text-teal-600',
    ring: 'border-teal-500/30',
    icon: 'text-teal-600',
    glow: 'shadow-teal-500/20',
  },
  amber: {
    bg: 'bg-yellow-500/10 text-yellow-600',
    ring: 'border-yellow-500/30',
    icon: 'text-yellow-600',
    glow: 'shadow-yellow-500/20',
  },
}

export function BadgeIcon({
  iconType,
  accentColor,
  isUnlocked,
  size = 'md',
}: BadgeIconProps) {
  const style = colorStyles[accentColor]

  const sizeClasses = {
    sm: 'h-10 w-10 text-base',
    md: 'h-14 w-14 text-xl',
    lg: 'h-24 w-24 text-4xl',
  }[size]

  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 40,
  }[size]

  const renderIcon = () => {
    switch (iconType) {
      case 'trophy':
        return <Trophy size={iconSizes} />
      case 'flame':
        return <Flame size={iconSizes} />
      case 'hourglass':
        return <Hourglass size={iconSizes} />
      case 'star':
        return <Star size={iconSizes} />
      case 'sun':
        return <Sun size={iconSizes} />
      case 'calendar':
        return <Calendar size={iconSizes} />
      case 'rocket':
        return <Rocket size={iconSizes} />
      case 'crown':
        return <Crown size={iconSizes} />
      default:
        return <Trophy size={iconSizes} />
    }
  }

  if (!isUnlocked) {
    return (
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100/80 text-gray-400 shadow-inner transition-all ${sizeClasses}`}
      >
        <div className="opacity-40">{renderIcon()}</div>
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-gray-300 text-gray-600 shadow-xs">
          <Lock size={11} />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-2xl border ${style.ring} ${style.bg} ${style.icon} shadow-sm transition-all hover:scale-105 ${sizeClasses}`}
    >
      {renderIcon()}
    </div>
  )
}
