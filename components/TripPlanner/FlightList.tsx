"use client"

import { ShoppingCart } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/elements/Button/Button"
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
  const [selectedFlightIndex, setSelectedFlightIndex] = useState<number | null>(null)

  const handleFlightBuy = (flight: MockFlightData) => {
    // Placeholder - could redirect to booking page
    // console.log("Redirecting to booking for:", flight)
    // In the future, this could open the booking URL
    window.open(flight.price.base_redirect_url, "_blank")
  }

  const handleFlightSelection = (flight: MockFlightData, index: number) => {
    setSelectedFlightIndex(index)
    if (onFlightSelect) {
      onFlightSelect(flight)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-anjoman-max text-Gray-N800 text-xl font-bold">
          پرواز {origin} به {destination}
        </h1>
        {departureDate && <p className="font-anjoman-max text-Gray-N600 text-sm">تاریخ پرواز: {departureDate}</p>}
        <p className="font-anjoman-max text-Gray-N600 text-sm">{englishToFarsiNumber(flights.length)} پرواز موجود</p>
      </div>

      {/* Flight Results */}
      <div className="flex flex-col gap-4">
        {flights.length > 0 ? (
          flights.map((flight, index) => (
            <div
              key={index}
              className={`relative rounded-lg transition-all ${
                selectedFlightIndex === index ? "ring-Primary-P500main ring-2 ring-offset-2" : ""
              }`}
              onClick={() => handleFlightSelection(flight, index)}
            >
              <FlightCard {...flight} onBuy={() => handleFlightBuy(flight)} className="cursor-pointer" />

              {/* Add to Basket Button - Floating in bottom-right corner */}
              <Button
                intent="ghost"
                size="custom"
                customSize="absolute bottom-3 left-3 z-10 size-10 rounded-full p-0 bg-white shadow-md hover:shadow-lg hover:bg-Primary-P50 border border-Gray-N200 hover:border-Primary-P300 transition-all"
                onClick={(e) => {
                  e.stopPropagation()
                  handleFlightSelection(flight, index)
                }}
                aria-label="افزودن به سبد سفر"
                title="افزودن به سبد سفر"
              >
                <ShoppingCart size={18} className="text-Primary-P500main shrink-0" />
              </Button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="font-anjoman-max text-Gray-N600 text-lg">پروازی برای این مسیر یافت نشد</p>
            <p className="font-anjoman-max text-Gray-N500 mt-2 text-sm">لطفاً تاریخ یا مقصد دیگری را انتخاب کنید</p>
          </div>
        )}
      </div>
    </div>
  )
}
