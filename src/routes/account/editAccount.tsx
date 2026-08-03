import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Camera, Eye, EyeOff, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/account/editAccount')({
  component: EditProfilePage,
})

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'

function EditProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('Fatikah')
  const [email, setEmail] = useState('fatikah@email.com')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [storedPassword, setStoredPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)

  useEffect(() => {
    const storedProfile = localStorage.getItem('profile')
    if (!storedProfile) return

    try {
      const profile = JSON.parse(storedProfile)
      setName(profile.name ?? 'Fatikah')
      setEmail(profile.email ?? 'fatikah@email.com')
      setStoredPassword(profile.password ?? '')
      setAvatar(profile.avatar ?? DEFAULT_AVATAR)
    } catch {
      localStorage.removeItem('profile')
    }
  }, [])

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
      localStorage.setItem(
        'profile',
        JSON.stringify({
          name,
          email,
          password: finalPassword,
          avatar,
        }),
      )
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
    <div className="mx-auto w-full max-w-2xl px-4 py-6 md:px-6 md:py-8">
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
              <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                <AvatarImage
                  src={avatar ?? undefined}
                  alt={`${name}'s profile`}
                />
                <AvatarFallback>
                  {name.charAt(0).toUpperCase() || 'F'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-gray-900">Profile Photo</h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  Upload a new profile picture.
                </p>
                <p className="text-xs text-gray-500/60">
                  JPG, PNG or WEBP
                </p>
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
                htmlFor="full-name"
                className="text-sm font-medium text-gray-900"
              >
                Full Name
              </Label>
              <Input
                id="full-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl border-gray-200 focus:border-green-600 focus:ring-green-600/20"
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
                className="h-11 rounded-xl border-gray-200 focus:border-green-600 focus:ring-green-600/20"
              />
            </div>
        </section>

        <section className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">Password</Label>

            {showPasswordForm ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {storedPassword ? 'Update your password.' : 'Set a password for your account.'}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelPasswordChange}
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
                        className="h-11 rounded-xl border-gray-200 pr-10 focus:border-green-600 focus:ring-green-600/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
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
                      className="h-11 rounded-xl border-gray-200 pr-10 focus:border-green-600 focus:ring-green-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
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
                    {storedPassword
                      ? 'Confirm New Password'
                      : 'Confirm Password'}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 rounded-xl border-gray-200 pr-10 focus:border-green-600 focus:ring-green-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
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
            className="h-11 rounded-xl border border-green-300 bg-white px-5 text-green-600 hover:bg-green-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="h-11 rounded-xl bg-green-600 px-6 text-white shadow-sm transition-colors hover:bg-green-600/90"
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}
