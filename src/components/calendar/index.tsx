import { useMemo, useState } from 'react'
import { CaretLeft, CaretRight } from 'phosphor-react'
import dayjs from 'dayjs'

import { getWeekDays } from '../../utils/get-week-days'

import * as S from './styles'

type CalendarWeek = {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

type CalendarProps = {
  selectedDate?: Date
  onDateChange?: (date: Date) => void
}

export function Calendar({ selectedDate, onDateChange }: CalendarProps) {
  const [currentDate, setCurrentData] = useState(() => {
    return dayjs().set('date', 1)
  })

  function handlePreviousMonth() {
    const previousMonthData = currentDate.subtract(1, 'month')

    setCurrentData(previousMonthData)
  }

  function handleNextMonth() {
    const previousMonthData = currentDate.add(1, 'month')

    setCurrentData(previousMonthData)
  }

  const shortWeekdays = getWeekDays({ short: true })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, index) => {
      return currentDate.set('date', index + 1)
    })

    const firstWeekDay = currentDate.get('day')

    const previousMonthFillArray = Array.from({ length: firstWeekDay })
      .map((_, index) => {
        return currentDate.subtract(index + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, index) => {
      return lastDayInCurrentMonth.add(index + 1, 'day')
    })

    const calendayDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return { date, disabled: date.endOf('day').isBefore(new Date()) }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    return calendayDays.reduce<CalendarWeeks>((weeks, _, i, original) => {
      const isNewWeek = i % 7 === 0

      if (isNewWeek) {
        weeks.push({
          week: i / 7 + 1,
          days: original.slice(i, i + 7),
        })
      }

      return weeks
    }, [])
  }, [currentDate])

  return (
    <S.CalendarContainer>
      <S.CalendarHeader>
        <S.CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </S.CalendarTitle>

        <S.CalendarActions>
          <button type="button" title="Anterior" onClick={handlePreviousMonth}>
            <CaretLeft />
          </button>
          <button type="button" title="Próximo" onClick={handleNextMonth}>
            <CaretRight />
          </button>
        </S.CalendarActions>
      </S.CalendarHeader>

      <S.CalendarBody>
        <thead>
          <tr>
            {shortWeekdays.map((weekday) => (
              <th key={weekday}>{weekday}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map((day) => {
                  return (
                    <td key={day.date.toString()}>
                      <S.CalendarDay
                        disabled={day.disabled}
                        onClick={() => onDateChange?.(day.date.toDate())}
                      >
                        {day.date.get('date')}
                      </S.CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </S.CalendarBody>
    </S.CalendarContainer>
  )
}
