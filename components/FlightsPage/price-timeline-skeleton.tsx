"use client"

import React from "react"

export function TimelineSkeleton() {
  return (
    <div className="relative">
      <div className="bg-Shade-White outline-Gray-N200 flex w-full flex-col items-start justify-center gap-3 overflow-hidden rounded-t-2xl outline-1 outline-offset-[-1px] px-5 py-4 lg:rounded-2xl">
        {/* Skeleton for headline */}
        <div className="flex h-7 w-full flex-col items-start justify-center self-stretch">
          <div className="h-5 w-44 animate-pulse rounded bg-Gray-N100"></div>
        </div>
        
        {/* Skeleton for timeline items */}
        <div className="bg-Shade-White relative inline-flex h-[74px] w-full snap-x snap-mandatory flex-nowrap items-center gap-3 overflow-x-auto py-3 md:h-[85px] lg:rounded-2xl"
          style={{ scrollbarWidth: "none" }}>
          <div className="flex snap-end gap-3 px-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="bg-Gray-N100 inline-flex h-[50px] w-[87px] shrink-0 animate-pulse flex-col items-center justify-center rounded-sm md:h-[57px] md:w-[113px]"
              >
                <div className="mb-1 h-3 w-14 rounded bg-gray-300" />
                <div className="h-4 w-10 rounded bg-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 