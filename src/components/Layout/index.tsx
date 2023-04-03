import * as React from 'react'

import { Footer } from './Footer'
import { Header } from './Header'

export function Layout({ children }: React.PropsWithChildren<unknown>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <section className="flex-1 bg-white px-4">
        <div className="mx-auto w-full max-w-screen-2xl">{children}</div>
      </section>

      <Footer />
    </div>
  )
}
