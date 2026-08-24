import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/ui/user-avatar'
import { useProfile } from '@/hooks/useProfile'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const Route = createFileRoute('/account/deleteAccount')({
  component: DeleteAccountPage,
})

const REASONS = [
  'I have a privacy concern',
  "I'm not using this service anymore",
  'I found a better alternative',
  'Too many notifications',
  'Other',
]

function DeleteAccountPage() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const [reason, setReason] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  function handleDeleteAccount() {
    setShowConfirmDialog(false)
    setShowSuccessDialog(true)
  }

  function handleCloseSuccess() {
    localStorage.clear()
    navigate({ to: '/login', replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 md:mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/account' })}
          aria-label="Back to account"
          className="rounded-full text-green-600 hover:bg-green-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-gray-900">
          Delete Account
        </h1>
      </div>

      <div className="space-y-6">
        {/* User Info */}
        <div className="flex flex-col items-center gap-3 py-4">
          <UserAvatar className="h-20 w-20 border-2 border-gray-200 shadow-md" />
          <h2 className="text-lg font-semibold text-gray-900">
            {profile.name}
          </h2>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">
            Tell us the reason for closing your account:
          </p>
          <Select
            value={reason}
            onValueChange={(value) => setReason(value ?? '')}
          >
            <SelectTrigger className="!h-12 w-full rounded-xl border-gray-200 bg-white px-4 py-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>

            <SelectContent>
              {REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Consequences */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-900">
            Things to check when deleting your account:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
              You can't log in to application with this account after deleting
              it.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
              You can't register a new account using the email address linked to
              this account.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
              Your posts on this application will be deleted.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
              Comments, likes, and collections will be removed.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
              Your account will be permanently deleted in 14 days. You may
              reactivate it at anytime within this period.
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => setShowConfirmDialog(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-3.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Delete My Account
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader className="items-center">
            <AlertDialogTitle className="text-center text-lg">
              Are you sure you want to delete your account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              By deleting your account you will lose all your data. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="h-12 w-full sm:flex-none">
              Back
            </AlertDialogCancel>
            <Button
              onClick={handleDeleteAccount}
              className=" h-12 w-full bg-red-600 text-white hover:bg-red-700 sm:flex-none"
            >
              Delete Account
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader className="items-center">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
              Success!
            </span>
            <AlertDialogTitle className="text-center text-lg">
              Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Your account has been successfully deleted. We're sorry to see you
              go.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={handleCloseSuccess}
              className="w-full bg-green-600 text-white hover:bg-green-700"
            >
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
