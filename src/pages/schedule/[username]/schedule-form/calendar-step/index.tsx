import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

import { api } from '../../../../../lib/axios'

import { Calendar } from '../../../../../components/calendar'

import * as S from './styles'

type Availability = {
  possibleTimes: number[]
  availableTimes: number[]
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [availability, setAvailability] = useState<Availability>()

  const router = useRouter()

  const username = String(router.query.username)
  const isDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  useEffect(() => {
    if (!selectedDate) return

    api
      .get(`/users/${username}/availability`, {
        params: {
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
        },
      })
      .then((response) => setAvailability(response.data))
  }, [selectedDate, username])

  return (
    <S.Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {isDateSelected && (
        <S.TimePicker>
          <S.TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </S.TimePickerHeader>

          <S.TimePickerList>
            {availability?.possibleTimes?.map((hour) => {
              return (
                <S.TimePickerItem
                  key={hour}
                  disabled={!availability.availableTimes.includes(hour)}
                >
                  {String(hour).padStart(2, '0')}:00h
                </S.TimePickerItem>
              )
            })}
          </S.TimePickerList>
        </S.TimePicker>
      )}
    </S.Container>
  )
}
