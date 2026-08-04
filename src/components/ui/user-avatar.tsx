import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useProfile } from '@/hooks/useProfile'

type UserAvatarProps = {
  className?: string
  src?: string | null
  name?: string
}

export function UserAvatar({ className, src, name }: UserAvatarProps) {
  const { profile } = useProfile()

  const displayName = name ?? profile.name
  const displaySrc = src ?? profile.avatar

  return (
    <Avatar className={className}>
      <AvatarImage src={displaySrc} alt={`${displayName}'s profile`} />
      <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
