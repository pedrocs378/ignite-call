import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import { PrismaAdapter } from '../../../lib/auth/prisma-adapter'

const BASE_GOOGLE_SCOPE = 'https://www.googleapis.com/auth'

export const buildNextAuthOptions = (
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions => ({
  adapter: PrismaAdapter(req, res),

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

    async session({ session, user }) {
      return {
        ...session,
        user,
      }
    },
  },
})

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}
