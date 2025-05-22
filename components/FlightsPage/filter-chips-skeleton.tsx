"use client"

import React from "react"

export function FilterChipsSkeleton() {
  return (
    <div className="my-4 flex items-center justify-start px-5 lg:hidden">
      <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {/* Sort chip */}
        <div className="bg-Shade-White outline-Gray-N100 inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]">
          <div className="h-4 w-4 animate-pulse rounded bg-Gray-N100"></div>
          <div className="flex items-center justify-center gap-2">
            <div className="h-5 w-20 animate-pulse rounded bg-Gray-N100"></div>
            <div className="h-5 w-24 animate-pulse rounded bg-Gray-N100"></div>
          </div>
        </div>

        {/* Filter chip */}
        <div className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]">
          <div className="h-4 w-4 animate-pulse rounded bg-Gray-N100"></div>
          <div className="flex items-center gap-1">
            <div className="h-5 w-16 animate-pulse rounded bg-Gray-N100"></div>
          </div>
        </div>

        {/* Additional filter chips */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div 
            key={index}
            className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
          >
            <div className="h-5 w-20 animate-pulse rounded bg-Gray-N100"></div>
          </div>
        ))}
      </div>
    </div>
  )
} 