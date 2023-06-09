import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { type User } from './model'

interface ProfileState {
  info: User | null
  updateProfile: (user: User | null) => void
}

export const useProfileStore = create<ProfileState>()(
  devtools(set => ({
    info: null,
    updateProfile: user => {
      set({ info: user })
    },
  }))
)
