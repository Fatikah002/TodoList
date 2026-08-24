import type { LucideIcon } from 'lucide-react'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

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
          h-12
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
              ? 'bg-green-50 text-green-600 shadow-sm'
              : 'text-gray-500 hover:bg-gray-100 hover:text-green-600'
          }
        `}
      >
        <Icon className="h-5 w-5 shrink-0" />

        <span className="group-data-[collapsible=icon]:hidden">{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
