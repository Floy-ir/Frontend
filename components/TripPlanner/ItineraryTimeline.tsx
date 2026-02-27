"use client"

import { Bus, Car, Hotel, Landmark, MapPin, Plane, Plus, Train } from "lucide-react"
import React, { useCallback, useMemo } from "react"

import type { Activity, Transportation, TripDay } from "@/app/types/trip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { AccommodationCard } from "./ActivityCards/AccommodationCard"
import { AttractionCard } from "./ActivityCards/AttractionCard"
import { DestinationCard } from "./ActivityCards/DestinationCard"
import { TransportationCard } from "./ActivityCards/TransportationCard"

type ItineraryTimelineProps = {
  days: TripDay[]
  onFlightClick?: (transportation: Transportation) => void
  onAddToBasket?: (activity: Transportation) => void
  onRemoveFromBasket?: (activityId: string) => void
  basketItemIds?: string[]
}

export const ItineraryTimeline = React.memo(function ItineraryTimeline({
  days,
  onFlightClick,
  onAddToBasket,
  onRemoveFromBasket,
  basketItemIds = [],
}: ItineraryTimelineProps) {
  const renderActivity = useCallback(
    (activity: Activity) => {
      switch (activity.type) {
        case "transportation":
          return (
            <TransportationCard
              key={activity.id}
              activity={activity}
              onFlightClick={onFlightClick}
              onAddToBasket={onAddToBasket}
              onRemoveFromBasket={onRemoveFromBasket}
              isInBasket={basketItemIds.includes(activity.id)}
            />
          )
        case "destination":
          return <DestinationCard key={activity.id} activity={activity} />
        case "accommodation":
          return <AccommodationCard key={activity.id} activity={activity} />
        case "attraction":
          return <AttractionCard key={activity.id} activity={activity} />
        default:
          return null
      }
    },
    [onFlightClick, onAddToBasket, onRemoveFromBasket, basketItemIds]
  )

  const renderActivityIcon = useCallback((activity: Activity) => {
    switch (activity.type) {
      case "transportation": {
        const transport = activity as Transportation
        const bgColor = "bg-Primary-P100"
        const iconColor = "text-Primary-P500main"
        let Icon = Train

        switch (transport.mode) {
          case "train":
            Icon = Train
            break
          case "flight":
            Icon = Plane
            break
          case "bus":
            Icon = Bus
            break
          case "car":
            Icon = Car
            break
        }

        return (
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${bgColor}`} aria-hidden="true">
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        )
      }
      case "destination":
        return (
          <div className="bg-Primary-P100 flex h-8 w-8 items-center justify-center rounded-full" aria-hidden="true">
            <MapPin className="text-Primary-P500main h-4 w-4" />
          </div>
        )
      case "accommodation":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100" aria-hidden="true">
            <Hotel className="h-4 w-4 text-blue-600" />
          </div>
        )
      case "attraction":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100" aria-hidden="true">
            <Landmark className="h-4 w-4 text-purple-600" />
          </div>
        )
      default:
        return <div className="bg-Primary-P500main h-2 w-2 rounded-full" aria-hidden="true" />
    }
  }, [])

  // Memoize the default open values to prevent recreation on every render
  const defaultOpenDays = useMemo(() => days.map((_, index) => `day-${index}`), [days.length])

  return (
    <div className="px-4 py-6" dir="rtl">
      <Accordion type="multiple" defaultValue={defaultOpenDays} className="space-y-4">
        {days.map((day, index) => (
          <AccordionItem key={index} value={`day-${index}`} className="rounded-lg border border-gray-200 bg-white">
            <AccordionTrigger className="px-4 hover:no-underline">
              <h2 className="text-Gray-N800 font-anjoman-max text-lg font-bold">
                {day.dayName} {day.date}
              </h2>
            </AccordionTrigger>

            <AccordionContent className="px-4">
              {/* Timeline with Activities */}
              <div className="relative">
                {/* Vertical Line - centered through icons, always show to connect to add button */}
                <div
                  className="absolute right-4 w-0.5 bg-gray-200"
                  style={{
                    top: "1rem",
                    height: "calc(100% - 2.5rem)",
                  }}
                  aria-hidden="true"
                />

                {/* Activities */}
                <div className="space-y-4">
                  {day.activities.map((activity) => (
                    <div key={activity.id} className="relative flex gap-4">
                      {/* Timeline Icon */}
                      <div className="relative z-10 shrink-0">{renderActivityIcon(activity)}</div>

                      {/* Activity Card */}
                      <div className="flex-1">{renderActivity(activity)}</div>
                    </div>
                  ))}
                </div>

                {/* Add Button positioned below timeline */}
                <div className="relative mt-4 flex gap-4">
                  <div className="shrink-0">
                    <button
                      className="text-Gray-N600 hover:border-Primary-P500main hover:bg-Primary-P50 hover:text-Primary-P500main focus:ring-Primary-P500main flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                      aria-label={`افزودن فعالیت به ${day.dayName}`}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      <span>افزودن</span>
                    </button>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
})
