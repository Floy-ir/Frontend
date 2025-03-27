"use client"

import * as React from "react"
import { JalaliCalendar } from "@/registry/new-york/jalali-calendar/jalali-calendar"

export default function JalaliCalendarExample() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">انتخاب تاریخ</h2>
      
      <div >
        <JalaliCalendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
        />
      </div>
      
      <div className="mt-4">
        <p>تاریخ انتخاب شده: {selectedDate ? selectedDate.toLocaleDateString('fa-IR') : 'هیچ تاریخی انتخاب نشده است'}</p>
      </div>
    </div>
  )
}