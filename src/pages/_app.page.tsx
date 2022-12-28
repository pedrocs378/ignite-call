import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Roboto } from '@next/font/google'

import { globalStyles } from '../styles/global'

globalStyles()

const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'] })

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className={roboto.className}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  )
}
