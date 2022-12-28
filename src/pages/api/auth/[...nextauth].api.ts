import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const BASE_GOOGLE_SCOPE = 'https://www.googleapis.com/auth'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: `${BASE_GOOGLE_SCOPE}/userinfo.email ${BASE_GOOGLE_SCOPE}/userinfo.profile ${BASE_GOOGLE_SCOPE}/calendar`,
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      if (!account?.scope?.includes(`${BASE_GOOGLE_SCOPE}/calendar`)) {
        return '/register/connect-calendar/?error=permissions'
      }

      return true
    },
  },
}

export default NextAuth(authOptions)
