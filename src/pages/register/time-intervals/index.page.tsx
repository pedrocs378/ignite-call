import Head from 'next/head'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ArrowRight } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'

import { api } from '../../../lib/axios'

import { getWeekDays } from '../../../utils/get-week-days'
import { convertTimeStringToMinutes } from '../../../utils/convert-time-string-to-minutes'

import * as RegisterStyles from '../styles'
import * as S from './styles'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine(
      (intervals) => intervals.length >= 1,
      'Necessário selecionar no minimo 1 dia da semana',
    )
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every((interval) => {
          return interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        })
      },
      {
        message:
          'O horário de termino deve ser pelo menos 1h distate do início',
      },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  const { fields } = useFieldArray({ control, name: 'intervals' })

  async function handleSetTimeIntervals(data: TimeIntervalsFormOutput) {
    console.log(data)

    await api.post('/users/time-intervals', {
      intervals: data.intervals,
    })
  }

  const weekdays = getWeekDays()
  const intervals = watch('intervals')

  return (
    <>
      <Head>
        <title>Defina seus horários | Ignite Call</title>
      </Head>

      <RegisterStyles.Container>
        <RegisterStyles.Header>
          <Heading as="strong">Quase lá</Heading>
          <Text>
            Defina o intervalo de horários que você está disponível em cada dia
            da semana.
          </Text>

          <MultiStep size={4} currentStep={3} />
        </RegisterStyles.Header>

        <S.IntervalBox
          as="form"
          onSubmit={handleSubmit((data) =>
            handleSetTimeIntervals(data as unknown as TimeIntervalsFormOutput),
          )}
        >
          <S.IntervalsContainer>
            {fields.map((interval, index) => {
              return (
                <S.IntervalItem key={interval.id}>
                  <Controller
                    control={control}
                    name={`intervals.${index}.enabled`}
                    render={({ field }) => (
                      <S.IntervalDay as="label">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Text>{weekdays[interval.weekDay]}</Text>
                      </S.IntervalDay>
                    )}
                  />

                  <S.IntervalInputs>
                    <TextInput
                      type="time"
                      size="sm"
                      step={60}
                      disabled={!intervals[index].enabled}
                      {...register(`intervals.${index}.startTime`)}
                    />
                    <TextInput
                      type="time"
                      size="sm"
                      step={60}
                      disabled={!intervals[index].enabled}
                      {...register(`intervals.${index}.endTime`)}
                    />
                  </S.IntervalInputs>
                </S.IntervalItem>
              )
            })}
          </S.IntervalsContainer>

          {!!errors.intervals && (
            <S.FormError size="sm">{errors.intervals.message}</S.FormError>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo <ArrowRight />
          </Button>
        </S.IntervalBox>
      </RegisterStyles.Container>
    </>
  )
}
