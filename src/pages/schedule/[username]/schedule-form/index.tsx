import { useState } from 'react'

import { CalendarStep } from './calendar-step'
import { ConfirmStep } from './confirm-step'

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date>()

  function handleClearSelectedDateTime() {
    setSelectedDateTime(undefined)
  }

  if (selectedDateTime)
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelConfirmation={handleClearSelectedDateTime}
      />
    )

  return <CalendarStep onSelectDateTime={setSelectedDateTime} />
}
