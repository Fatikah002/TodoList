import { useLocation, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, Settings, ListTodo, Archive, User, UserRound, CircleUserRound } from 'lucide-react'

export function MobileNavbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathname = location.pathname
  const view = new URLSearchParams(location.search).get('view')

  const menus = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
      onClick: () =>
        navigate({
          to: '/dashboard',
          search: { view: 'dashboard' },
        }),
    },
    {
      label: 'Tasks',
      icon: ListTodo,
      active: pathname === '/todos' && view === 'all',
      onClick: () =>
        navigate({
          to: '/todos',
          search: { view: 'all' },
        }),
    },
    {
      label: 'Archive',
      icon: Archive,
      active: pathname === '/archived',
      onClick: () =>
        navigate({
          to: '/archived',
        }),
    },
     {
      label: 'Account',
      icon: UserRound,
      active: pathname === '/account',
      onClick: () =>
        navigate({
          to: '/account',
        }),
    },
  ]

  return (
    <nav
      className=" fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 border-t bg-white/95 px-3 
      backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden" >
      {menus.map((item) => {
        const Icon = item.icon

        return (
          <button
            key={item.label}
            onClick={item.onClick}
            className="
          flex flex-1 flex-col items-center justify-center
          gap-1 transition-all
        "
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                item.active
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Icon size={20} />
            </div>

            <span
              className={`text-[11px] font-medium transition-colors ${
                item.active ? 'text-green-600' : 'text-slate-500'
              }`}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
