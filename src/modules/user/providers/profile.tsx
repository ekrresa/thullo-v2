import * as React from 'react'
import { useSession } from 'next-auth/react'

import { api } from '@/utils/api'
import { useProfileStore } from '../store'

export function ProfileProvider({ children }: React.PropsWithChildren) {
  const { status } = useSession()
  const { refetch } = api.users.getUserProfile.useQuery(undefined, {
    onSuccess(response) {
      updateProfile(response)
    },
    onError() {
      updateProfile(null)
    },
    retry: 1,
  })

  const updateProfile = useProfileStore(state => state.updateProfile)

  React.useEffect(() => {
    if (status === 'authenticated') {
      refetch()
    }

    if (status === 'unauthenticated') {
      updateProfile(null)
    }
  }, [refetch, status, updateProfile])

  return <>{children}</>
}
