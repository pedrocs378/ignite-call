import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'

import { prisma } from '../../../lib/prisma'

import { ScheduleForm } from './schedule-form'

import * as S from './styles'

type ScheduleProps = {
  user: {
    name: string
    bio: string
    avatarUrl?: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <>
      <Head>
        <title>
          {!user ? 'Carregando...' : `Agenda de ${user.name} | Ignite Call`}{' '}
        </title>
      </Head>

      <S.Container>
        <S.UserHeader>
          <Avatar src={user.avatarUrl} alt={user.name} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </S.UserHeader>

        <ScheduleForm />
      </S.Container>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: 'blocking',
    paths: [],
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    revalidate: 60 * 60 * 24, // 1 day
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
  }
}
