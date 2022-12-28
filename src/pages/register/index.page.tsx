import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowRight } from 'phosphor-react'
import { AxiosError } from 'axios'
import { z } from 'zod'

import { api } from '../../lib/axios'

import * as S from './styles'

const registerFormSchema = z.object({
  username: z
    .string({ required_error: 'Username requerido' })
    .min(3, 'Minimo 3 caracteres')
    .regex(/^([a-z\\0-9\\-]+)$/i, 'Permitido apenas letras e hifens')
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, 'Minimo 3 caracteres'),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query?.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (err) {
      if (err instanceof AxiosError) {
        return alert(err.response?.data?.message ?? err.message)
      }

      console.log(err)
    }
  }

  return (
    <>
      <Head>
        <title>Registrar | Ignite Call</title>
      </Head>

      <S.Container>
        <S.Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </S.Header>

        <S.Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="ignite.com/"
              placeholder="seu-usuario"
              {...register('username')}
            />

            {errors.username && (
              <S.FormError size="sm">{errors.username.message}</S.FormError>
            )}
          </label>
          <label>
            <Text size="sm">Nome completo</Text>
            <TextInput placeholder="Seu nome" {...register('name')} />

            {errors.name && (
              <S.FormError size="sm">{errors.name.message}</S.FormError>
            )}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo <ArrowRight />
          </Button>
        </S.Form>
      </S.Container>
    </>
  )
}
