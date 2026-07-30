import type { LucideIcon } from 'lucide-react'
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type SidebarNavItemProps = {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick: () => void
}

export function SidebarNavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: SidebarNavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={label}
        isActive={active}
        onClick={onClick}
        className={`
          h-11
          rounded-xl
          justify-start
          gap-3
          px-3
          transition-all
          duration-200

          group-data-[collapsible=icon]:justify-center
          group-data-[collapsible=icon]:gap-0
          group-data-[collapsible=icon]:px-0

          ${
            active
              ? 'bg-gradient-to-r from-green-100 to-emerald-50 text-green-700 shadow-sm'
              : 'text-slate-500 hover:bg-slate-100 hover:text-green-600'
          }
        `}
      >
        <Icon className="h-5 w-5 shrink-0" />

        <span className="group-data-[collapsible=icon]:hidden">
          {label}
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}