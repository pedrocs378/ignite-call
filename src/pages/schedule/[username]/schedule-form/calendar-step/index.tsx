import { Calendar } from '../../../../../components/calendar'

import * as S from './styles'

export function CalendarStep() {
  const isDateSelected = true

  return (
    <S.Container isTimePickerOpen={isDateSelected}>
      <Calendar />

      {isDateSelected && (
        <S.TimePicker>
          <S.TimePickerHeader>
            terça-feira <span>20 de setembro</span>
          </S.TimePickerHeader>

          <S.TimePickerList>
            <S.TimePickerItem>08:00</S.TimePickerItem>
            <S.TimePickerItem>09:00</S.TimePickerItem>
            <S.TimePickerItem>10:00</S.TimePickerItem>
            <S.TimePickerItem>11:00</S.TimePickerItem>
            <S.TimePickerItem>12:00</S.TimePickerItem>
            <S.TimePickerItem>13:00</S.TimePickerItem>
            <S.TimePickerItem>14:00</S.TimePickerItem>
            <S.TimePickerItem>15:00</S.TimePickerItem>
            <S.TimePickerItem>16:00</S.TimePickerItem>
            <S.TimePickerItem>17:00</S.TimePickerItem>
            <S.TimePickerItem>18:00</S.TimePickerItem>
          </S.TimePickerList>
        </S.TimePicker>
      )}
    </S.Container>
  )
}
