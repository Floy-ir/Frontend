"use client"

import { ArrowRight, ShoppingCart } from "lucide-react"
import dynamic from "next/dynamic"
import { useCallback, useEffect, useState } from "react"

import type { BasketFlightItem } from "@/app/types/basket"
import type { Transportation, TripPlan } from "@/app/types/trip"
import type { MockFlightData } from "@/services/mockFlightData"
import { englishToFarsiNumber } from "@/utils/numbers"

import { Breadcrumb } from "./Breadcrumb"
import { FlightList } from "./FlightList"
import { ItineraryTimeline } from "./ItineraryTimeline"
import { TravelBasket } from "./TravelBasket"
import { TripOverviewCard } from "./TripOverviewCard"

// Dynamically import TripMap with no SSR to avoid "window is not defined" error
const TripMap = dynamic(() => import("./TripMap").then((mod) => ({ default: mod.TripMap })), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
      <p className="text-Gray-N600 font-anjoman-max text-sm" dir="rtl">
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
  const [isBasketOpen, setIsBasketOpen] = useState(false)
  const [basketItems, setBasketItems] = useState<BasketFlightItem[]>([])

  // Extract recommended flights from trip plan and add to basket
  useEffect(() => {
    if (!tripPlan) return

    const recommendedFlights: BasketFlightItem[] = []

    tripPlan.days.forEach((day) => {
      day.activities.forEach((activity) => {
        if (activity.type === "transportation" && activity.mode === "flight" && activity.recommendedFlight) {
          const flight = activity.recommendedFlight
          const transportation = activity

          // Only add if it has all required data
          if (flight.airlineLogo && flight.duration && flight.flightInfo && flight.price.agencyLogo) {
            recommendedFlights.push({
              id: activity.id,
              departureTime: flight.departureTime,
              arrivalTime: flight.arrivalTime,
              origin: transportation.origin,
              destination: transportation.destination,
              duration: flight.duration,
              airline: {
                name: flight.airline,
                logo: flight.airlineLogo,
              },
              flightInfo: flight.flightInfo,
              price: {
                amount: flight.price.amount,
                formattedAmount: flight.price.formattedAmount,
                agency: flight.price.agency,
                agencyLogo: flight.price.agencyLogo,
                base_redirect_url: flight.base_redirect_url || "#",
              },
            })
          }
        }
      })
    })

    setBasketItems(recommendedFlights)
  }, [tripPlan])

  const handleFlightClick = useCallback((transportation: Transportation) => {
    setSelectedTransportation(transportation)
    setCurrentView("flight-list")
  }, [])

  const handleBackToOverview = useCallback(() => {
    setCurrentView("overview")
    setSelectedTransportation(null)
  }, [])

  // Handler for adding items to basket
  const handleAddToBasket = useCallback((item: BasketFlightItem) => {
    setBasketItems((prev) => {
      // Check if item already exists - if it does, replace it
      const existingIndex = prev.findIndex((existing) => existing.id === item.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = item
        return updated
      }
      return [...prev, item]
    })
  }, [])

  // Handler for when user selects a flight from the list
  const handleFlightListSelection = useCallback(
    (flight: MockFlightData) => {
      if (!selectedTransportation) return

      // Convert the selected flight from FlightList to a BasketFlightItem
      const newItem: BasketFlightItem = {
        id: selectedTransportation.id,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        origin: selectedTransportation.origin,
        destination: selectedTransportation.destination,
        duration: flight.duration || { hours: 0, minutes: 0 },
        airline: {
          name: typeof flight.airline === "object" ? flight.airline?.name || "" : flight.airline || "",
          logo: typeof flight.airline === "object" ? flight.airline?.logo || "" : "",
        },
        flightInfo: flight.flightInfo || { baggage: "20", cabinClass: "اقتصادی" },
        price: {
          amount: flight.price.amount,
          formattedAmount: flight.price.formattedAmount,
          agency: flight.price.agency,
          agencyLogo: flight.price.agencyLogo || "",
          base_redirect_url: flight.price.base_redirect_url || "#",
        },
      }

      // Add to basket
      handleAddToBasket(newItem)

      // Return to overview after selection
      handleBackToOverview()
    },
    [selectedTransportation, handleAddToBasket, handleBackToOverview]
  )

  const handleAddTransportationToBasket = useCallback(
    (transportation: Transportation) => {
      if (transportation.mode !== "flight" || !transportation.recommendedFlight) {
        return
      }

      const flight = transportation.recommendedFlight
      const newItem: BasketFlightItem = {
        id: transportation.id,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        origin: transportation.origin,
        destination: transportation.destination,
        duration: flight.duration || { hours: 0, minutes: 0 },
        airline: {
          name: flight.airline,
          logo: flight.airlineLogo || "",
        },
        flightInfo: flight.flightInfo || { baggage: "20", cabinClass: "اقتصادی" },
        price: {
          amount: flight.price.amount,
          formattedAmount: flight.price.formattedAmount,
          agency: flight.price.agency,
          agencyLogo: flight.price.agencyLogo || "",
          base_redirect_url: flight.base_redirect_url || "#",
        },
      }

      handleAddToBasket(newItem)
    },
    [handleAddToBasket]
  )

  const handleRemoveFromBasket = useCallback((id: string) => {
    setBasketItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const handleRedirect = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }, [])
  if (!tripPlan) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 p-8">
        <div className="text-center">
          <p className="text-Gray-N600 font-anjoman-max text-lg" dir="rtl">
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
              className="text-Gray-N700 focus:ring-Primary-P500main flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 font-anjoman-max text-sm font-medium transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
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
            onFlightSelect={handleFlightListSelection}
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
            <h1 className="text-Gray-N800 font-anjoman-max text-xl font-bold">{tripPlan.title}</h1>
            <div className="text-Gray-N600 mt-2 flex items-center gap-3 text-sm">
              <span>
                {tripPlan.startDate} - {tripPlan.endDate}
              </span>
              <span>•</span>
              <span>{englishToFarsiNumber(tripPlan.travelerCount)} مسافر</span>
            </div>
          </div>
          <button
            onClick={() => setIsBasketOpen(true)}
            className="bg-Primary-P500main focus:ring-Primary-P500main flex items-center gap-2 rounded-lg px-4 py-2 font-anjoman-max text-sm font-medium text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label="سبد سفر"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            <span>سبد سفر</span>
            {basketItems.length > 0 && (
              <span className="text-Primary-P500main flex size-5 items-center justify-center rounded-full bg-white text-xs font-bold">
                {englishToFarsiNumber(basketItems.length)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Timeline Section */}
        <div className="px-2 py-4">
          <h2 className="text-Gray-N800 mb-4 px-4 font-anjoman-max text-lg font-bold" dir="rtl">
            نمای کلی
          </h2>
          <TripOverviewCard tripPlan={tripPlan} />
          <ItineraryTimeline
            days={tripPlan.days}
            onFlightClick={handleFlightClick}
            onAddToBasket={handleAddTransportationToBasket}
            onRemoveFromBasket={handleRemoveFromBasket}
            basketItemIds={basketItems.map((item) => item.id)}
          />
        </div>

        {/* Map Section */}
        <div className="border-t border-gray-200 p-6">
          <TripMap tripPlan={tripPlan} />
        </div>
      </div>

      {/* Travel Basket */}
      <TravelBasket
        isOpen={isBasketOpen}
        onOpenChange={setIsBasketOpen}
        items={basketItems}
        onRemoveItem={handleRemoveFromBasket}
        onRedirect={handleRedirect}
      />
    </div>
  )
}
