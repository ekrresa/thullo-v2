import { type ReactElement, type ReactNode } from 'react'
import { type NextPage } from 'next'

export type PageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
