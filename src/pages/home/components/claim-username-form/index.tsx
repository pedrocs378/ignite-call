import { useRouter } from 'next/router'
import { Button, Text, TextInput } from '@ignite-ui/react'
import { useForm } from 'react-hook-form'
import { ArrowRight } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import * as S from './styles'

const claimUsernameFormSchema = z.object({
  username: z
    .string({ required_error: 'Username requerido' })
    .min(3, 'Minimo 3 caracteres')
    .regex(/^([a-z\\0-9\\-]+)$/i, 'Permitido apenas letras e hifens')
    .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const router = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }

  return (
    <>
      <S.Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />

        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar <ArrowRight />
        </Button>
      </S.Form>

      <S.FormAnnotation>
        <Text as="span" size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuário'}
        </Text>
      </S.FormAnnotation>
    </>
  )
}
