"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker/persian"
import { cn } from "@/lib/utils"
import { button } from "@/components/Button/Button"

export type JalaliCalendarProps = React.ComponentProps<typeof DayPicker>

function JalaliCalendar({ className, classNames, showOutsideDays = false, fromDate = new Date(), ...props }: JalaliCalendarProps) {
  // Use useEffect to ensure client-side hydration
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Use a placeholder if not mounted yet
  if (!mounted) {
    return <div className="w-fit p-3 min-h-[300px] min-w-[300px] bg-gray-100 animate-pulse rounded" />
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      disabled={{ before: fromDate }}
      className={cn("w-fit", className)}
      classNames={{
        month: "space-y-4",
        months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 relative",
        month_caption: "flex justify-center pt-1 relative items-center",
        month_grid: "w-full border-collapse space-y-1",
        caption_label: "text-sm font-medium",
        nav: "flex row-reverse items-center justify-between absolute inset-x-0",
        button_previous: cn(
          button({ intent: "outline2" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10",
        ),
        button_next: cn(
          button({ intent: "outline2" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10",
        ),
        weeks: "w-full border-collapse space-y-",
        weekdays: "flex bg-slate-50 py-1",
        weekday: "text-muted-foreground w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day_button:
          "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(button({ intent: "ghost" }), "h-9 w-9 p-0 font-normal text-Gray-N600 text-sm"),
        range_end: "day-range-end",
        selected: "",
        today: "bg-accent text-accent-foreground outline outline-1 outline-offset-[-1px] outline-Primary-P300 rounded-md",
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
      }}

      formatters={{
        // Custom formatter for weekday names - using single Persian letters
        formatWeekdayName: (weekday) => {
          const weekdayNames = ["ی", "د", "س", "چ", "پ", "ج", "ش"];
          const day = weekday.getDay();
          return weekdayNames[day] || "";
        }
      }}
      {...props}
    />
  )
}

JalaliCalendar.displayName = "JalaliCalendar"

export { JalaliCalendar }

