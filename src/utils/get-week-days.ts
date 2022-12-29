export function getWeekDays() {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => {
      return formatter.format(new Date(Date.UTC(2021, 5, day)))
    })
    .map((weekDay) => {
      const firstLetter = weekDay[0]

      return `${firstLetter.toUpperCase()}${weekDay.substring(1)}`
    })
}
