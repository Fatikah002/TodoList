import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/account/editAccount')({
  component: EditProfilePage,
})

function EditProfilePage() {
  const navigate = useNavigate()

  const [name, setName] = useState('Fatikah')
  const [email, setEmail] = useState('fatikah@email.com')
  const [bio, setBio] = useState('Frontend Developer')
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  )

  useEffect(() => {
    const storedProfile = localStorage.getItem('profile')

    if (!storedProfile) return

    try {
      const profile = JSON.parse(storedProfile)

      setName(profile.name ?? 'Fatikah')
      setEmail(profile.email ?? 'fatikah@email.com')
      setBio(profile.bio ?? 'Frontend Developer')
      setAvatar(
        profile.avatar ??
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      )
    } catch {
      localStorage.removeItem('profile')
    }
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      setAvatar(reader.result as string)
    }

    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    localStorage.setItem(
      'profile',
      JSON.stringify({
        name,
        email,
        bio,
        avatar,
      }),
    )

    navigate({ to: '/account' })
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-center gap-3 md:mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/account' })}
          aria-label="Back to profile"
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
            Edit Profile
          </h1>
        </div>
      </div>

      <Card className="border-white/80 bg-white/90 shadow-lg shadow-emerald-950/5 backdrop-blur">
        <CardContent className="space-y-7 pt-6">
          <div className="flex flex-col gap-5 rounded-2xl  bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                <AvatarImage src={avatar} alt={`${name}'s profile`} />
                <AvatarFallback>
                  {name.charAt(0).toUpperCase() || 'F'}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-semibold text-slate-900">Profile Photo</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Upload a new profile picture.
                </p>

                <p className="text-xs text-slate-400">JPG, PNG or WEBP</p>
              </div>
            </div>

            {/* Right */}
            <label className="cursor-pointer">
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />

              <span className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-green-500 px-4 text-sm font-medium text-green-700 transition-colors hover:bg-green-50">
                <Camera className="h-4 w-4" />
                Change Photo
              </span>
            </label>
          </div>
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="full-name"
                  className="text-sm font-medium text-slate-700"
                >
                  Full Name
                </Label>

                <Input
                  id="full-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email Address
                </Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-sm font-medium text-slate-700"
              >
                Bio
              </Label>

              <Textarea
                id="bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-28 rounded-xl resize-none"
              />
            </div>
          </div>
        </CardContent>

        <div className="mt-7 flex flex-col-reverse gap-3  px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/account' })}
            className="h-10 rounded-xl bg-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="h-10 rounded-xl bg-green-700 px-4 text-white hover:bg-green-700"
          >
            Save changes
          </Button>
        </div>
      </Card>
    </div>
  )
}
