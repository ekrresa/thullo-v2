import { useSession } from 'next-auth/react'

import { api } from '@/server/api'
import { useProfileStore } from '../store'

export function ProfileProvider({ children }: React.PropsWithChildren) {
  const { status } = useSession()
  const updateProfile = useProfileStore(state => state.updateProfile)

  api.users.getUserProfile.useQuery(undefined, {
    onSuccess(response) {
      updateProfile(response)
    },
    onError() {
      updateProfile(null)
    },
    retry: 1,
    enabled: ['unauthenticated', 'authenticated'].includes(status),
  })

  return <>{children}</>
}
