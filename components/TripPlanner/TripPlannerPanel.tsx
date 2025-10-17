"use client"

import { ArrowRight, ShoppingCart } from "lucide-react"
import dynamic from "next/dynamic"
import { useCallback, useState } from "react"

import type { Transportation, TripPlan } from "@/app/types/trip"
import { englishToFarsiNumber } from "@/utils/numbers"

import { Breadcrumb } from "./Breadcrumb"
import { FlightList } from "./FlightList"
import { ItineraryTimeline } from "./ItineraryTimeline"

// Dynamically import TripMap with no SSR to avoid "window is not defined" error
const TripMap = dynamic(() => import("./TripMap").then((mod) => ({ default: mod.TripMap })), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
      <p className="font-anjoman-max text-Gray-N600 text-sm" dir="rtl">
        در حال بارگذاری نقشه...
      </p>
    </div>
  ),
})

type ViewMode = "overview" | "flight-list"

type TripPlannerPanelProps = {
  tripPlan: TripPlan | null
}

export function TripPlannerPanel({ tripPlan }: TripPlannerPanelProps) {
  const [currentView, setCurrentView] = useState<ViewMode>("overview")
  const [selectedTransportation, setSelectedTransportation] = useState<Transportation | null>(null)

  const handleFlightClick = useCallback((transportation: Transportation) => {
    setSelectedTransportation(transportation)
    setCurrentView("flight-list")
  }, [])

  const handleBackToOverview = useCallback(() => {
    setCurrentView("overview")
    setSelectedTransportation(null)
  }, [])
  if (!tripPlan) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 p-8">
        <div className="text-center">
          <p className="font-anjoman-max text-Gray-N600 text-lg" dir="rtl">
            هنوز برنامه سفری ایجاد نشده است
          </p>
        </div>
      </div>
    )
  }

  if (currentView === "flight-list" && selectedTransportation) {
    return (
      <div className="flex h-screen flex-col bg-white">
        {/* Header with Back Navigation */}
        <div className="border-b border-gray-200 bg-white px-6 py-4" dir="rtl">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToOverview}
              className="font-anjoman-max text-Gray-N700 focus:ring-Primary-P500main flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              aria-label="بازگشت به برنامه سفر"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span>بازگشت</span>
            </button>

            <Breadcrumb
              items={[
                {
                  label: "برنامه سفر",
                  onClick: handleBackToOverview,
                },
                {
                  label: `پرواز ${selectedTransportation.origin} به ${selectedTransportation.destination}`,
                },
              ]}
            />
          </div>
        </div>

        {/* Flight List Content */}
        <div className="flex-1 overflow-y-auto">
          <FlightList
            origin={selectedTransportation.origin}
            destination={selectedTransportation.destination}
            departureDate={selectedTransportation.departureTime}
          />
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
            <h1 className="font-anjoman-max text-Gray-N800 text-xl font-bold">{tripPlan.title}</h1>
            <div className="text-Gray-N600 mt-2 flex items-center gap-3 text-sm">
              <span>
                {tripPlan.startDate} - {tripPlan.endDate}
              </span>
              <span>•</span>
              <span>{englishToFarsiNumber(tripPlan.travelerCount)} مسافر</span>
            </div>
          </div>
          <button
            className="bg-Primary-P500main font-anjoman-max hover:bg-primary-600 focus:ring-Primary-P500main flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-label="سبد سفر"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            <span>سبد سفر</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Timeline Section */}
        <div className="px-2 py-4">
          <h2 className="font-anjoman-max text-Gray-N800 mb-4 px-4 text-lg font-bold" dir="rtl">
            نمای کلی
          </h2>
          <ItineraryTimeline days={tripPlan.days} onFlightClick={handleFlightClick} />
        </div>

        {/* Map Section */}
        <div className="border-t border-gray-200 p-6">
          <TripMap tripPlan={tripPlan} />
        </div>
      </div>
    </div>
  )
}
