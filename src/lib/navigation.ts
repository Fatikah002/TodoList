import type { LucideIcon } from 'lucide-react'
import { LayoutDashboard, ListTodo, Archive, UserRound } from 'lucide-react'

export type NavigationItem = {
  label: string
  icon: LucideIcon
  to: string
  search?: Record<string, string>
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/dashboard',
    search: { view: 'dashboard' },
  },
  {
    label: 'Tasks',
    icon: ListTodo,
    to: '/todos',
    search: { view: 'today' },
  },
  {
    label: 'Archived',
    icon: Archive,
    to: '/archived',
  },
  {
    label: 'Account',
    icon: UserRound,
    to: '/account',
  },
]
