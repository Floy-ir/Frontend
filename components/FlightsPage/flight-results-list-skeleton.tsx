"use client"

import React from "react"
import { FlightCardSkeleton } from "./FlightCard/skeleton"

export function FlightResultsListSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-3 md:gap-4">
      <div className="md-lg:max-w-[700px] sm-md:max-w-[400px] flex w-full max-w-[328px] flex-col gap-3 md:max-w-[738px] md:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <FlightCardSkeleton key={index} className="w-full" />
        ))}
      </div>
    </div>
  )
} 