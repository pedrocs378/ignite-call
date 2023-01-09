import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Roboto } from '@next/font/google'
import { QueryClientProvider } from '@tanstack/react-query'

import '../lib/dayjs'
import { queryClient } from '../lib/react-query'

import { globalStyles } from '../styles/global'
import { DefaultSeo } from 'next-seo'

globalStyles()

const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'] })

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <div className={roboto.className}>
          <DefaultSeo
            openGraph={{
              type: 'website',
              locale: 'pt_BR',
              url: 'https://ignite-call.rocketseat.com.br',
              siteName: 'Ignite Call',
            }}
          />

          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  )
}
