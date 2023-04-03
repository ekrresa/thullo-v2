import { useSession } from 'next-auth/react'

interface Props {
  requireAuth: boolean
}
export function useAuth(props?: Props) {
  const { status } = useSession({ required: Boolean(props?.requireAuth) })

  return status === 'authenticated'
}
