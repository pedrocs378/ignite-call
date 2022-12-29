import { NextApiRequest, NextApiResponse } from 'next'
import { Adapter } from 'next-auth/adapters'
import { parseCookies, destroyCookie } from 'nookies'

import { prisma } from '../prisma'

export function PrismaAdapter(
  req: NextApiRequest,
  res: NextApiResponse,
): Adapter {
  return {
    async createUser(user) {
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req })

      if (!userIdOnCookies) {
        throw new Error('User ID not found on cookies')
      }

      const prismaUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.image,
        },
      })

      destroyCookie({ res }, '@ignitecall:userId', {
        path: '/',
      })

      return {
        id: prismaUser.id,
        email: prismaUser.email!,
        name: prismaUser.name,
        avatar_url: prismaUser.avatar_url!,
        username: prismaUser.username,
        emailVerified: null,
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) return null

      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        avatar_url: user.avatar_url!,
        username: user.username,
        emailVerified: null,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) return null

      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        avatar_url: user.avatar_url!,
        username: user.username,
        emailVerified: null,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account) return null

      const { user } = account

      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        avatar_url: user.avatar_url!,
        username: user.username,
        emailVerified: null,
      }
    },

    async updateUser(user) {
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      return {
        id: updatedUser.id,
        email: updatedUser.email!,
        name: updatedUser.name,
        avatar_url: updatedUser.avatar_url!,
        username: updatedUser.username,
        emailVerified: null,
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          user_id: userId,
          expires,
          session_token: sessionToken,
        },
      })

      return {
        userId,
        expires,
        sessionToken,
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken,
        },
      })
    },

    async getSessionAndUser(sessionToken) {
      const prismaSession = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!prismaSession) return null

      const { user, ...session } = prismaSession

      return {
        session: {
          expires: session.expires,
          userId: session.user_id,
          sessionToken: session.session_token,
        },
        user: {
          id: user.id,
          email: user.email!,
          name: user.name,
          avatar_url: user.avatar_url!,
          username: user.username,
          emailVerified: null,
        },
      }
    },

    async updateSession({ sessionToken, expires, userId }) {
      const updatedSession = await prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        data: {
          expires,
          user_id: userId,
        },
      })

      return {
        sessionToken: updatedSession.session_token,
        userId: updatedSession.user_id,
        expires: updatedSession.expires,
      }
    },
  }
}
