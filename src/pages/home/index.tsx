import Head from 'next/head'
import Image from 'next/image'
import { Heading, Text } from '@ignite-ui/react'

import { ClaimUsernameForm } from './components/claim-username-form'

import previewImg from '../../assets/app-preview.png'

import * as S from './styles'

export default function Home() {
  return (
    <>
      <Head>
        <title>Ignite Call</title>
      </Head>

      <S.Container>
        <S.Hero>
          <Heading size="4xl">Agendamento descomplicado</Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>

          <ClaimUsernameForm />
        </S.Hero>

        <S.Preview>
          <Image
            src={previewImg}
            alt="Calendário simbolizando aplicação em funcionamento"
            height={400}
            quality={100}
            priority
          />
        </S.Preview>
      </S.Container>
    </>
  )
}
