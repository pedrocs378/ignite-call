import Head from 'next/head'
import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'

import { api } from '../../lib/axios'

import * as RegisterStyles from '../styles'
import * as S from './styles'

export default function Register() {
  // async function handleRegister() {}

  return (
    <>
      <Head>
        <title>Conecte sua agenda | Ignite Call</title>
      </Head>

      <RegisterStyles.Container>
        <RegisterStyles.Header>
          <Heading as="strong">Conecte sua agenda!</Heading>
          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>

          <MultiStep size={4} currentStep={2} />
        </RegisterStyles.Header>

        <S.ConnectBox>
          <S.ConnectItem>
            <Text>Google Calendar</Text>

            <Button variant="secondary" size="sm">
              Conectar <ArrowRight />
            </Button>
          </S.ConnectItem>

          <Button type="submit">
            Próximo passo <ArrowRight />
          </Button>
        </S.ConnectBox>
      </RegisterStyles.Container>
    </>
  )
}
