"use client"

import React from "react"
import { FilterChipsSkeleton } from "@/components/FlightsPage/filter-chips-skeleton"
import { FlightFilterSkeleton } from "@/components/FlightsPage/flight-filter-skeleton"
import { FlightResultsListSkeleton } from "@/components/FlightsPage/flight-results-list-skeleton"
import { TimelineSkeleton } from "@/components/FlightsPage/price-timeline-skeleton"

export default function LoadingFlightResults() {
  return (
    <div className="bg-Gray/N100 mb-8 flex min-h-screen flex-col">
      {/* Skeleton for search header */}
      <div className="bg-Primary-P500main relative w-full px-5 py-5 lg:px-0">
        <div className="container mx-auto">
          <div className="flex flex-col gap-3">
            <div className="h-8 w-48 animate-pulse rounded bg-Primary-P400"></div>
            <div className="bg-Shade-White flex w-full animate-pulse flex-col gap-4 rounded-2xl p-4 lg:py-5">
              <div className="h-24 w-full animate-pulse rounded-xl bg-gray-100"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-266 p-0 lg:px-4 lg:py-6">
        {/* Skeleton for timeline */}
        <div className="mb-0 lg:mb-8">
          <TimelineSkeleton />
        </div>

        {/* Desktop results counter and sort */}
        <div className="mb-6 hidden flex-row items-start justify-between lg:flex">
          <div className="h-5 w-24 animate-pulse rounded bg-Gray-N100"></div>
          
          <div className="hidden flex-row items-center justify-end gap-3 lg:flex">
            {Array.from({ length: 4 }).map((_, index) => (
              <div 
                key={index} 
                className="h-8 w-24 animate-pulse rounded-2xl bg-Gray-N100"
              ></div>
            ))}
          </div>
        </div>

        {/* Mobile filter chips */}
        <FilterChipsSkeleton />

        <div className="flex flex-row gap-4">
          {/* Flight filters sidebar */}
          <div className="hidden lg:block">
            <FlightFilterSkeleton />
          </div>

          {/* Flight results list */}
          <div className="flex-1">
            <FlightResultsListSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
