import { useTheme } from "next-themes"
import { Toaster as Sonner} from "sonner"
import type {ToasterProps as SonnerToasterProps} from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: SonnerToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as SonnerToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      toastOptions={{
        classNames: {
          success: "!bg-green-50 !text-green-700 !border-green-200",
          error: "!bg-red-50 !text-red-700 !border-red-200",
          warning: "!bg-amber-50 !text-amber-700 !border-amber-200",
          info: "!bg-blue-50 !text-blue-700 !border-blue-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
