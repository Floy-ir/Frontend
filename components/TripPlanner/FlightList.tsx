"use client"

import { useState } from "react"

import { FlightCard } from "@/components/FlightsPage/FlightCard/flight-card"
import { getMockFlights, type MockFlightData } from "@/services/mockFlightData"
import { englishToFarsiNumber } from "@/utils/numbers"

type FlightListProps = {
  origin: string
  destination: string
  departureDate?: string
  onFlightSelect?: (flight: MockFlightData) => void
}

export function FlightList({ origin, destination, departureDate, onFlightSelect }: FlightListProps) {
  const [flights] = useState<MockFlightData[]>(() => getMockFlights(origin, destination))

  const handleFlightBuy = (flight: MockFlightData) => {
    // Placeholder - could redirect to booking page
    console.log("Redirecting to booking for:", flight)
    // In the future, this could open the booking URL
    window.open(flight.price.base_redirect_url, "_blank")
  }

  const handleFlightSelection = (flight: MockFlightData) => {
    if (onFlightSelect) {
      onFlightSelect(flight)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-anjoman-max text-xl font-bold text-Gray-N800">
          پرواز {origin} به {destination}
        </h1>
        {departureDate && (
          <p className="font-anjoman-max text-sm text-Gray-N600">
            تاریخ پرواز: {departureDate}
          </p>
        )}
        <p className="font-anjoman-max text-sm text-Gray-N600">
          {englishToFarsiNumber(flights.length)} پرواز موجود
        </p>
      </div>

      {/* Flight Results */}
      <div className="flex flex-col gap-4">
        {flights.length > 0 ? (
          flights.map((flight, index) => (
            <div key={index} onClick={() => handleFlightSelection(flight)}>
              <FlightCard
                {...flight}
                onBuy={() => handleFlightBuy(flight)}
                className="transition-shadow hover:shadow-md cursor-default"
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="font-anjoman-max text-lg text-Gray-N600">
              پروازی برای این مسیر یافت نشد
            </p>
            <p className="font-anjoman-max mt-2 text-sm text-Gray-N500">
              لطفاً تاریخ یا مقصد دیگری را انتخاب کنید
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
