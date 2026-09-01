import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { ArrowLeft, Camera, Eye, EyeOff, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserAvatar } from '@/components/ui/user-avatar'
import { useProfile, DEFAULT_AVATAR } from '@/hooks/useProfile'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { STORAGE_KEYS } from '@/lib/constants'

function getStoredPassword(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_ACCOUNTS)
    const accounts: { email: string; password: string }[] = raw ? JSON.parse(raw) : []
    const email = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
    return accounts.find((a) => a.email === email)?.password ?? ''
  } catch {
    return ''
  }
}

function setStoredPassword(newPassword: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_ACCOUNTS)
    const accounts: { email: string; password: string; username: string }[] = raw ? JSON.parse(raw) : []
    const email = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
    const updated = accounts.map((a) =>
      a.email === email ? { ...a, password: newPassword } : a,
    )
    localStorage.setItem(STORAGE_KEYS.REGISTERED_ACCOUNTS, JSON.stringify(updated))
  } catch {
    // silently fail
  }
}

export const Route = createFileRoute('/account/editAccount')({
  component: EditProfilePage,
})

function EditProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { profile, updateProfile } = useProfile()

  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const storedPassword = getStoredPassword()
  const [currentPassword, setCurrentPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(profile.avatar)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleChangePhoto = () => {
    fileInputRef.current?.click()
  }

  const handleRemovePhoto = () => {
    setAvatar(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCancelPasswordChange = () => {
    setShowPasswordForm(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowCurrent(false)
    setShowNew(false)
    setShowConfirm(false)
  }

  const handleSave = () => {
    let finalPassword = storedPassword

    if (showPasswordForm) {
      if (!newPassword) {
        toast.error('Please enter a new password')
        return
      }

      if (newPassword !== confirmPassword) {
        toast.error('Password confirmation does not match')
        return
      }

      if (storedPassword && currentPassword !== storedPassword) {
        toast.error('Current password is incorrect')
        return
      }

      finalPassword = newPassword
    }

    const promise = new Promise<void>((resolve) => {
      if (showPasswordForm) {
        setStoredPassword(finalPassword)
      }
      updateProfile({
        name,
        email,
        avatar: avatar ?? DEFAULT_AVATAR,
      })
      setTimeout(resolve, 300)
    })

    toast.promise(promise, {
      loading: 'Saving profile...',
      success: () => {
        navigate({ to: '/account' })
        return 'Profile updated successfully!'
      },
      error: 'Failed to save profile',
    })
  }

  return (
    <div className="flex flex-1 flex-col">
    <div className="mx-auto w-full max-w-6xl px-8 py-8 sm:px-8 sm:py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3 md:mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/account' })}
          aria-label="Back to profile"
          className="rounded-full text-green-600 hover:bg-green-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-gray-900">
          Edit Profile
        </h1>
      </div>

      <div className="space-y-8 md:space-y-10">
        <section className="flex flex-col items-center gap-5  py-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <UserAvatar
              src={avatar}
              name={name}
              className="h-20 w-20 border-1 border-gray shadow-md bg-gray-300"
            />
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-gray-900">Profile Photo</h3>
              <p className="mt-0.5 text-sm text-gray-500">
                Upload a new profile picture.
              </p>
              <p className="text-xs text-gray-500/60">JPG, PNG or WEBP</p>
            </div>
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-7  items-center justify-center gap-2 rounded-lg border border-green-300 bg-white px-4 text-sm font-medium text-green-600 transition-colors hover:bg-green-50">
                <Camera className="h-4 w-4" />
                Edit
              </DropdownMenuTrigger>

              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem onClick={handleChangePhoto}>
                  <Camera className="mr-2 h-4 w-4" />
                  Change Photo
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleRemovePhoto}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Photo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-medium text-gray-900"
            >
              Username
            </Label>
            <Input
              id="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl border-gray-200 focus:border-green-600 focus:ring-green-600/20"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-900"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl border-gray-200 focus:border-green-600 focus:ring-green-600/20"
            />
          </div>
        </section>

        <section className="space-y-3">
          <Label className="text-sm font-medium text-gray-900">Password</Label>

          {showPasswordForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {storedPassword
                    ? 'Update your password.'
                    : 'Set a password for your account.'}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelPasswordChange}
                  aria-label="Cancel password change"
                  className="h-8 gap-1.5 px-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {storedPassword && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 pr-10 focus:border-green-600 focus:ring-green-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
                    >
                      {showCurrent ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  {storedPassword ? 'New Password' : 'Password'}
                </Label>
                <div className="relative">
                  <Input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 pr-10 focus:border-green-600 focus:ring-green-600/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    aria-label={showNew ? 'Hide new password' : 'Show new password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
                  >
                    {showNew ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  {storedPassword ? 'Confirm New Password' : 'Confirm Password'}
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 pr-10 focus:border-green-600 focus:ring-green-600/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(true)}
              className="rounded-lg border border-green-300 bg-white px-4 text-sm font-medium text-green-600 hover:bg-green-50"
            >
              {storedPassword ? 'Change password' : 'Set password'}
            </Button>
          )}
        </section>

        <div className="flex justify-end gap-3  pt-6">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/account' })}
            className="h-12 rounded-xl border border-green-300 bg-white px-5 text-green-600 hover:bg-green-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="h-12 rounded-xl bg-green-600 px-6 text-white shadow-sm transition-colors hover:bg-green-600/90"
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
    </div>
  )
}
