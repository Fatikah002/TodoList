import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const loginSchema = z.object({
  email: z.string().email('Email tidak valid').min(1, 'Email wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
})

function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  if (isAuthenticated) {
    navigate({ to: '/todos' })
    return null
  }

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setError('')
      const result = loginSchema.safeParse(value)
      if (!result.success) {
        setError(result.error.errors[0].message)
        return
      }
      const success = await login(value.email, value.password)
      if (success) {
        navigate({ to: '/todos' })
      } else {
        setError('Email atau password salah')
      }
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl border-0 shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Masuk ke akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form.Field
              name="email"
              validators={{
                onChange: ({ value: val }) => {
                  const result = loginSchema.shape.email.safeParse(val)
                  if (!result.success) return result.error.errors[0].message
                  return undefined
                },
              }}
            >
              {(field) => {
                const showError =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0

                return (
                  <div className="flex flex-col gap-1">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Masukkan email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={
                        showError
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : ''
                      }
                    />
                    {showError && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )
              }}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value: val }) => {
                  const result = loginSchema.shape.password.safeParse(val)
                  if (!result.success) return result.error.errors[0].message
                  return undefined
                },
              }}
            >
              {(field) => {
                const showError =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0

                return (
                  <div className="flex flex-col gap-1">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Masukkan password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={
                        showError
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : ''
                      }
                    />
                    {showError && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )
              }}
            </form.Field>

            <Button
              type="submit"
              className="mt-2 w-full bg-green-500 text-white hover:bg-green-600"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
