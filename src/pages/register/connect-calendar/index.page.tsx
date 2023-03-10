import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { ArrowRight, Check } from 'phosphor-react'

import * as RegisterStyles from '../styles'
import * as S from './styles'

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const isSignedIn = session.status === 'authenticated'
  const hasAuthError = !!router.query.error && !isSignedIn

  async function handleConnectCalendar() {
    await signIn('google')
  }

  async function handleNavigateToTimeIntervals() {
    await router.push('/register/time-intervals')
  }

  return (
    <>
      <NextSeo title="Conecte sua agenda do Google | Ignite Call" noindex />

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

            {isSignedIn ? (
              <Button variant="secondary" size="sm" disabled>
                Conectado
                <Check />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleConnectCalendar}
              >
                Conectar <ArrowRight />
              </Button>
            )}
          </S.ConnectItem>

          {hasAuthError && (
            <S.AuthError size="xs">
              Falha ao se conectar ao Google, verifique se você habilitou as
              permissões de acesso ao Google Calendar
            </S.AuthError>
          )}

          <Button
            type="submit"
            disabled={!isSignedIn}
            onClick={handleNavigateToTimeIntervals}
          >
            Próximo passo <ArrowRight />
          </Button>
        </S.ConnectBox>
      </RegisterStyles.Container>
    </>
  )
}
