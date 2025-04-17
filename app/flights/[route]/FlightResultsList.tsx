'use client'

import React from 'react'
import { FlightCard } from '@/components/FlightCard'

// Type for sample flight data
type FlightData = {
  id: string
  departureTime: string
  arrivalTime: string
  duration: { hours: number; minutes: number }
  airline: {
    name: string
    logo: string
  }
  flightInfo: {
    aircraft: string
    baggage: string
    ticketType: string
    cabinClass: string
  }
  price: {
    amount: number
    formattedAmount: string
    agency: string
    agencyLogo: string
    label?: string
  }
  otherSellersCount: number
}

type FlightResultsListProps = {
  flights: FlightData[]
}

export function FlightResultsList({ flights }: FlightResultsListProps) {
  // Handle actions
  const handleBuy = (flightId: string) => {
    console.log(`Buy flight ${flightId}`)
    // Navigate to booking page or open modal
  }

  const handleViewSellers = (flightId: string) => {
    console.log(`View sellers for flight ${flightId}`)
    // Show other sellers modal or expand card
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <FlightCard
          key={flight.id}
          departureTime={flight.departureTime}
          arrivalTime={flight.arrivalTime}
          duration={flight.duration}
          airline={flight.airline}
          flightInfo={flight.flightInfo}
          price={flight.price}
        //   intent={flight.id === '1' ? 'highlighted' : 'default'}
          onBuy={() => handleBuy(flight.id)}
          onViewOtherSellers={() => handleViewSellers(flight.id)}
          otherSellersCount={flight.otherSellersCount}
          className="max-h-[188px] md:max-h-full max-w-[738px]"
        />
      ))}
    </div>
  )
} 