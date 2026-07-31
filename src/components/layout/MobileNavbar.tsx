import { useLocation, useNavigate } from '@tanstack/react-router'
import { navigationItems } from '@/lib/navigation'

export function MobileNavbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathname = location.pathname
  const searchParams = new URLSearchParams(location.search)
  const view = searchParams.get('view')

  function isActive(item: (typeof navigationItems)[number]) {
    if (item.search?.view) {
      return pathname === item.to && view === item.search.view
    }
    return pathname === item.to
  }

  return (
    <nav
      className=" fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 border-t bg-white px-3 
      backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden" >
      {navigationItems.map((item) => {
        const Icon = item.icon

        return (
          <button
            key={item.label}
            onClick={() =>
              navigate({
                to: item.to,
                ...(item.search ? { search: item.search } : {}),
              })
            }
            className="
          flex flex-1 flex-col items-center justify-center
          gap-1 transition-all
        "
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                isActive(item)
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
            </div>

            <span
              className={`text-[11px] font-medium transition-colors ${
                isActive(item) ? 'text-green-600' : 'text-gray-500'
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
