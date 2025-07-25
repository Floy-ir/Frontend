"use client"

import { CalendarSearch, FilterSearch } from "iconsax-react"
import React from "react"

type NoTicketFoundProps = {
  type?: "filter" | "noFlights"
  onClearFilters?: () => void
  onChangeSearch?: () => void
}

export default function NoTicketFound({ type = "noFlights", onClearFilters, onChangeSearch }: NoTicketFoundProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-8 text-center">
      {type === "filter" ? (
        // No flights due to filters
        <>
          <div className="text-Gray-N400 mb-4">
            <FilterSearch size="100" color="#5A28EE" />
          </div>
          <h3 className="text-Gray-N800 mb-2 text-lg font-semibold" aria-live="assertive" role="status">
            هیچ پروازی با فیلترهای انتخابی شما یافت نشد!
          </h3>
          <p className="text-Gray-N600 mb-6 max-w-md text-sm">
            لطفا فیلترهای خود را تغییر دهید تا نتایج بیشتری مشاهده کنید.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="bg-Primary-P50 text-Primary-P500main hover:bg-Primary-P100 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 font-medium transition-colors"
              aria-label="حذف همه فیلترها"
            >
              <span>تغییر فیلترها</span>
            </button>
          )}
        </>
      ) : (
        // No flights for this day
        <>
          <div className="text-Gray-N400 mb-4">
            <CalendarSearch size="100" color="#5A28EE" />
          </div>
          <h3 className="text-Gray-N800 mb-2 text-lg font-semibold" aria-live="assertive" role="status">
            برای این تاریخ پروازی پیدا نکردیم!
          </h3>
          <p className="text-Gray-N600 mb-4 max-w-md text-sm">
            لطفا تاریخ دیگری را انتخاب کنید.
          </p>
          {onChangeSearch && (
            <button
              onClick={onChangeSearch}
              className="bg-Primary-P50 text-Primary-P500main hover:bg-Primary-P100 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 font-medium transition-colors"
              aria-label="تغییر تاریخ یا مقصد"
              aria-haspopup="dialog"
            >
              <span> تغییر تاریخ  </span>
            </button>
          )}
        </>
      )}
    </div>
  )
}
