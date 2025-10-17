"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { DayPicker } from "react-day-picker/persian"
import { button } from "@/components/elements/Button/Button"
import { cn } from "@/lib/utils"

export type JalaliCalendarProps = React.ComponentProps<typeof DayPicker>

function JalaliCalendar({
  className,
  classNames,
  showOutsideDays = false,
  fromDate = new Date(),
  ...props
}: JalaliCalendarProps) {
  // Use useEffect to ensure client-side hydration
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Use a placeholder if not mounted yet
  if (!mounted) {
    return <div className="min-h-[300px] w-full animate-pulse rounded bg-gray-100 p-3" />
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      disabled={{ before: fromDate }}
      className={cn(className || "")}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 relative w-full",
        month: "space-y-4 w-full",
        month_caption: "flex justify-center pt-1 relative items-center",
        month_grid: "w-full border-collapse space-y-1",
        caption_label: "text-sm font-medium",
        nav: "flex row-reverse items-center justify-between absolute inset-x-0",
        button_previous: cn(
          button({ intent: "outline2" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10"
        ),
        button_next: cn(button({ intent: "outline2" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10"),
        weeks: "w-full border-collapse space-y-",
        weekdays: "flex bg-slate-50 py-1",
        weekday: "text-muted-foreground w-10 font-normal text-[0.8rem] text-center",
        week: "flex w-full mt-2",
        day_button: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(button({ intent: "ghost" }), "h-9 w-9 p-0 font-normal text-Gray-N600 text-sm"),
        range_end: "day-range-end",
        selected: "bg-Primary-P300 text-white font-bold hover:bg-Primary-P300",
        today:
          "bg-accent text-accent-foreground outline outline-1 outline-offset-[-1px] outline-Primary-P300 rounded-md",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "!text-Gray-N300 opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) =>
          props.orientation === "left" ? (
            <ChevronRight {...props} className="h-4 w-4" />
          ) : (
            <ChevronLeft {...props} className="h-4 w-4" />
          ),
        Day: ({ children, ...rest }: { date?: Date; children: React.ReactNode; [key: string]: unknown }) => (
          <button {...rest} className={`${rest.className} flex flex-col items-center justify-center`}>
            {children}
            {/* <span className="mb-2 text-[10px] text-red-500">تست</span>  */}
          </button>
        ),
      }}
      formatters={{
        // Custom formatter for weekday names - using single Persian letters
        formatWeekdayName: (weekday) => {
          const weekdayNames = ["ی", "د", "س", "چ", "پ", "ج", "ش"]
          const day = weekday.getDay()
          return weekdayNames[day] || ""
        },
      }}
      {...props}
    />
  )
}

JalaliCalendar.displayName = "JalaliCalendar"

export { JalaliCalendar }
