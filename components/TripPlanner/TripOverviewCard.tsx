"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

import type { TripPlan } from "@/app/types/trip"
import { englishToFarsiNumber } from "@/utils/numbers"

type TripOverviewCardProps = {
  tripPlan: TripPlan
}

/**
 * Generates a mock trip overview summary based on trip plan data.
 * TODO: This will be replaced with AI-generated summaries from the server via API endpoint.
 */
function generateTripOverview(tripPlan: TripPlan): string {
  // Count activities by type
  const activityCounts = {
    attractions: 0,
    accommodations: 0,
    transportations: 0,
    destinations: 0,
  }

  tripPlan.days.forEach((day) => {
    day.activities.forEach((activity) => {
      if (activity.type === "attraction") activityCounts.attractions++
      else if (activity.type === "accommodation") activityCounts.accommodations++
      else if (activity.type === "transportation") activityCounts.transportations++
      else if (activity.type === "destination") activityCounts.destinations++
    })
  })

  // Extract unique destinations
  const destinations = new Set<string>()
  tripPlan.days.forEach((day) => {
    day.activities.forEach((activity) => {
      if (activity.type === "destination") {
        destinations.add(activity.name)
      }
      if (activity.type === "transportation") {
        destinations.add(activity.destination)
      }
    })
  })

  const dayCount = tripPlan.days.length
  const destinationsList = Array.from(destinations)

  // Build summary text
  let summary = `این برنامه سفر ${englishToFarsiNumber(dayCount)} روزه به ${destinationsList.join(
    " و "
  )} برای ${englishToFarsiNumber(tripPlan.travelerCount)} ${
    tripPlan.travelerCount === 1 ? "مسافر" : "مسافر"
  } طراحی شده است. `

  if (activityCounts.attractions > 0) {
    summary += `در این سفر ${englishToFarsiNumber(activityCounts.attractions)} ${
      activityCounts.attractions === 1 ? "جاذبه گردشگری" : "جاذبه گردشگری"
    } را بازدید خواهید کرد. `
  }

  if (activityCounts.accommodations > 0) {
    summary += `محل اقامت شما برای ${englishToFarsiNumber(activityCounts.accommodations)} ${
      activityCounts.accommodations === 1 ? "شب" : "شب"
    } در هتل‌های منتخب رزرو شده است. `
  }

  if (activityCounts.transportations > 0) {
    const flightCount = tripPlan.days.reduce((count, day) => {
      return (
        count +
        day.activities.filter((activity) => activity.type === "transportation" && activity.mode === "flight").length
      )
    }, 0)

    if (flightCount > 0) {
      summary += `برنامه شامل ${englishToFarsiNumber(flightCount)} ${flightCount === 1 ? "پرواز" : "پرواز"} می‌شود. `
    }
  }

  summary += "این برنامه با دقت طراحی شده تا بهترین تجربه سفر را برای شما فراهم کند."

  return summary
}

export function TripOverviewCard({ tripPlan }: TripOverviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const overviewText = generateTripOverview(tripPlan)

  return (
    <div className="mx-4 mb-2 overflow-hidden rounded-lg border border-gray-200 bg-white" dir="rtl">
      {/* Header with preview text */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-Gray-N800 flex w-full flex-col items-start gap-2 bg-gray-50 px-4 py-3 text-right font-anjoman-max transition-colors"
        aria-expanded={isExpanded}
        aria-controls="trip-overview-content"
        type="button"
      >
        <div className="flex w-full items-center justify-between">
          <span className="text-base font-semibold">درباره این برنامه سفر</span>
          <span className="text-Gray-N500 transition-transform duration-300" aria-hidden="true">
            {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
          </span>
        </div>
        {!isExpanded && <p className="text-Gray-N600 line-clamp-2 text-sm leading-relaxed">{overviewText}</p>}
      </button>

      {/* Expanded Content */}
      <div
        id="trip-overview-content"
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          overflow: isExpanded ? "visible" : "hidden",
        }}
      >
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-Gray-N600 font-anjoman-max text-sm leading-relaxed">{overviewText}</p>
        </div>
      </div>
    </div>
  )
}
