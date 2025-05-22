"use client"

import React from "react"

export function FlightFilterSkeleton() {
  return (
    <div className="bg-Shade-White outline-Gray-N200 sticky top-8 flex h-auto w-[270px] flex-col items-start justify-start gap-6 self-start rounded-2xl outline-1 outline-offset-[-1px] p-5">
      {/* Header with filter count */}
      <div className="flex w-full items-center justify-between self-stretch">
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 animate-pulse rounded bg-Gray-N100"></div>
        </div>
        <div className="h-5 w-24 animate-pulse rounded bg-Gray-N100"></div>
      </div>

      {/* Filter sections */}
      {Array.from({ length: 4 }).map((_, sectionIndex) => (
        <React.Fragment key={sectionIndex}>
          <div className="flex flex-col items-start justify-start gap-4 self-stretch">
            {/* Section header */}
            <div className="flex items-center justify-between gap-[7px] self-stretch">
              <div className="h-5 w-32 animate-pulse rounded bg-Gray-N100"></div>
              <div className="h-5 w-5 animate-pulse rounded-full bg-Gray-N100"></div>
            </div>

            {/* Filter items */}
            {Array.from({ length: 3 }).map((_, itemIndex) => (
              <div key={itemIndex} className="inline-flex items-center justify-end gap-2 self-stretch py-1">
                <div className="flex items-center justify-center gap-2 p-[3px]">
                  <div className="relative flex size-[18px] items-center justify-center overflow-hidden rounded-sm outline-Gray-N300 outline-1 outline-offset-[-1px] animate-pulse bg-Gray-N100"></div>
                </div>
                
                <div className="inline-flex flex-1 flex-col items-end justify-start gap-1">
                  <div className="h-5 w-full animate-pulse rounded bg-Gray-N100"></div>
                </div>
              </div>
            ))}
          </div>
          {sectionIndex < 3 && <div className="bg-Gray-N100 h-px self-stretch" />}
        </React.Fragment>
      ))}

      {/* Range sliders */}
      <div className="flex flex-col items-start justify-start gap-4 self-stretch">
        <div className="flex items-center justify-between gap-[7px] self-stretch">
          <div className="h-5 w-32 animate-pulse rounded bg-Gray-N100"></div>
        </div>
        <div className="h-8 w-full animate-pulse rounded bg-Gray-N100"></div>
        <div className="flex w-full justify-between">
          <div className="h-4 w-16 animate-pulse rounded bg-Gray-N100"></div>
          <div className="h-4 w-16 animate-pulse rounded bg-Gray-N100"></div>
        </div>
      </div>

      <div className="bg-Gray-N100 h-px self-stretch" />

      <div className="flex flex-col items-start justify-start gap-4 self-stretch">
        <div className="flex items-center justify-between gap-[7px] self-stretch">
          <div className="h-5 w-40 animate-pulse rounded bg-Gray-N100"></div>
        </div>
        <div className="h-8 w-full animate-pulse rounded bg-Gray-N100"></div>
        <div className="flex w-full justify-between">
          <div className="h-4 w-20 animate-pulse rounded bg-Gray-N100"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-Gray-N100"></div>
        </div>
      </div>
    </div>
  )
} 