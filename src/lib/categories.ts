import {
  Briefcase,
  User,
  GraduationCap,
  Heart,
  Wallet,
  Folder,
  Tag,
  Sparkles,
  Coffee,
  Home,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const categories = [
  'Work',
  'Study',
  'Personal',
  'Health',
  'Finance',
  'Home',
  'Other',
] as const

export type TodoCategory = (typeof categories)[number]

export type CategoryMeta = {
  icon: LucideIcon
  bgColor: string
  textColor: string
  lightBg: string
}

export const CATEGORY_CONFIG: Partial<Record<string, CategoryMeta>> = {
  Work: {
    icon: Briefcase,
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600',
    lightBg: 'bg-blue-50',
  },

  Study: {
    icon: GraduationCap,
    bgColor: 'bg-purple-600',
    textColor: 'text-purple-600',
    lightBg: 'bg-purple-50',
  },

  Personal: {
    icon: User,
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    lightBg: 'bg-emerald-50',
  },

  Health: {
    icon: Heart,
    bgColor: 'bg-rose-400',
    textColor: 'text-rose-600',
    lightBg: 'bg-rose-50',
  },

  Finance: {
    icon: Wallet,
    bgColor: 'bg-indigo-600',
    textColor: 'text-indigo-600',
    lightBg: 'bg-indigo-50',
  },

  Home: {
    icon: Home,
    bgColor: 'bg-lime-600',
    textColor: 'text-lime-700',
    lightBg: 'bg-lime-50',
  },

  Other: {
    icon: Folder,
    bgColor: 'bg-slate-400',
    textColor: 'text-slate-600',
    lightBg: 'bg-slate-50',
  },
}

const FALLBACK_PALETTES: CategoryMeta[] = [
  {
    icon: Tag,
    bgColor: 'bg-violet-500',
    textColor: 'text-violet-600',
    lightBg: 'bg-violet-50',
  },
  {
    icon: Sparkles,
    bgColor: 'bg-pink-500',
    textColor: 'text-pink-600',
    lightBg: 'bg-pink-50',
  },
  {
    icon: Coffee,
    bgColor: 'bg-yellow-600',
    textColor: 'text-yellow-700',
    lightBg: 'bg-yellow-50',
  },
]

export function getCategoryMeta(name: string): CategoryMeta {
  const trimmed = name.trim()

  // Exact match
  const exactMatch = CATEGORY_CONFIG[trimmed]

  if (exactMatch) {
    return exactMatch
  }

  // Case-insensitive match
  const foundKey = Object.keys(CATEGORY_CONFIG).find(
    (key) => key.toLowerCase() === trimmed.toLowerCase(),
  )

  if (foundKey) {
    return CATEGORY_CONFIG[foundKey]!
  }

  // Fallback palette based on category name
  let hash = 0

  for (let i = 0; i < trimmed.length; i++) {
    hash = trimmed.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % FALLBACK_PALETTES.length

  return FALLBACK_PALETTES[index]
}