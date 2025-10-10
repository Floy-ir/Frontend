"use client"

import dynamic from "next/dynamic"
import { ShoppingCart } from "lucide-react"

import type { TripPlan } from "@/app/types/trip"

import { ItineraryTimeline } from "./ItineraryTimeline"

// Dynamically import TripMap with no SSR to avoid "window is not defined" error
const TripMap = dynamic(() => import("./TripMap").then((mod) => ({ default: mod.TripMap })), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
      <p className="font-anjoman-max text-sm text-Gray-N600" dir="rtl">
        در حال بارگذاری نقشه...
      </p>
    </div>
  ),
})

type TripPlannerPanelProps = {
  tripPlan: TripPlan | null
}

export function TripPlannerPanel({ tripPlan }: TripPlannerPanelProps) {
  if (!tripPlan) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 p-8">
        <div className="text-center">
          <p className="font-anjoman-max text-lg text-Gray-N600" dir="rtl">
            هنوز برنامه سفری ایجاد نشده است
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4" dir="rtl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="font-anjoman-max text-xl font-bold text-Gray-N800">{tripPlan.title}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-Gray-N600">
              <span>
                {tripPlan.startDate} - {tripPlan.endDate}
              </span>
              <span>•</span>
              <span>{tripPlan.travelerCount} مسافر</span>
            </div>
          </div>
          <button
            className="flex items-center gap-2 rounded-lg bg-Primary-P500main px-4 py-2 font-anjoman-max text-sm font-medium text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-Primary-P500main focus:ring-offset-2"
            aria-label="سبد سفر"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            <span>سبد سفر</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Map Section */}
        <div className="p-6">
          <TripMap tripPlan={tripPlan} />
        </div>

        {/* Timeline Section */}
        <div className="border-t border-gray-200">
          <div className="px-2 py-4">
            <h2 className="mb-4 px-4 font-anjoman-max text-lg font-bold text-Gray-N800" dir="rtl">
              نمای کلی
            </h2>
            <ItineraryTimeline days={tripPlan.days} />
          </div>
        </div>
      </div>
    </div>
  )
}

