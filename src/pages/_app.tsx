import { type AppProps } from 'next/app'
import { Inter as FontSans } from 'next/font/google'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

import { api } from '@/utils/api'
import { type PageWithLayout } from '@/utils/app'
import '@/styles/globals.css'

type AppPropsWithLayout = AppProps<{
  session: Session | null
}> & {
  Component: PageWithLayout
}

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
})

function App({ Component, pageProps }: AppPropsWithLayout) {
  const { session, ...otherPageProps } = pageProps

  const renderLayout = Component.getLayout ?? (page => page)

  return (
    <SessionProvider session={session}>
      {renderLayout(
        <>
          <style jsx global>{`
            html {
              font-family: ${fontSans.style.fontFamily};
            }
          `}</style>

          <Component {...otherPageProps} />
        </>
      )}

      <ReactQueryDevtools initialIsOpen={false} />
    </SessionProvider>
  )
}

export default api.withTRPC(App)
