import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'

export function useGuestUserSignup(callbackUrl: string) {
  const router = useRouter()

  const { mutate, isLoading } = useMutation(
    async () => {
      return await signIn('credentials', {
        redirect: false,
      })
    },
    {
      onSuccess(response) {
        if (!response?.ok) {
          toast.error(
            'We were unable to create a guest account for you. Please try again!'
          )
          return
        }

        setTimeout(() => {
          router.replace(callbackUrl)
        }, 1000)

        toast.success('Login was successful! Redirecting...')
      },
    }
  )

  return {
    createGuest: mutate,
    creatingGuest: isLoading,
  }
}
