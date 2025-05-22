"use client"

import { Suspense } from "react"
import LoadingFlightResults from "./[route]/loading"

export default function FlightsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Main content */}
      <Suspense fallback={<LoadingFlightResults />}>
        {children}
      </Suspense>
    </div>
  )
}
