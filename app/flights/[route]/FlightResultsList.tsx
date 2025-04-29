'use client'

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from 'react'
import ComparisonDialog from "@/components/FlightsPage/comparisonPage/page"
import { FlightCard } from '@/components/FlightsPage/FlightCard'
import ExpirationModal from "@/components/FlightsPage/expiration-modal/page"

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
    base_redirect_url: string
    one_adult_redirect_url: string
    two_Adults_redirect_url: string
  }
  otherSellersCount: number
}

type FlightResultsListProps = {
  flights: FlightData[]
}

export function FlightResultsList({ flights }: FlightResultsListProps) {
  // Handle actions

  const router = useRouter();
  const [showComparison, setShowComparison] = useState(false);
  const [showExpirationModal, setShowExpirationModal] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowExpirationModal(true)
    }, 100000)
    // todo: 5min? 10min?

    return () => clearInterval(interval)
  }, [])

 const handleBuy = (_flightId: string, price: FlightData['price']) => {
    const url = new URL(window.location.href)
    const adult = url.searchParams.get("adult") || "1"
    const child = url.searchParams.get("child") || "0"
    const infant = url.searchParams.get("infant") || "0"

    let redirectUrl = ""

    if (adult === "1" && child === "0" && infant === "0") {
      redirectUrl = price.one_adult_redirect_url
    } else if (adult === "2" && child === "0" && infant === "0") {
      redirectUrl = price.two_Adults_redirect_url
    } else {
      redirectUrl = price.base_redirect_url
        .replace("{adult_count}", adult)
        .replace("{child_count}", child)
        .replace("{infant_count}", infant)
    }

    const encodedRedirectUrl = redirectUrl
    const encodedAgency = price.agency

    router.push(`/redirect?redirect_url=${encodedRedirectUrl}&agency=${encodedAgency}`)
  }

  const handleViewSellers = (flightId: string) => {
    console.log(`View sellers for flight ${flightId}`)
    setShowComparison(true)
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4 w-full items-center">
      <div className="w-full max-w-[328px] md-lg:max-w-[700px] sm-md:max-w-[400px] md:max-w-[738px] flex flex-col gap-3  md:gap-4">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            departureTime={flight.departureTime}
            arrivalTime={flight.arrivalTime}
            duration={flight.duration}
            airline={flight.airline}
            flightInfo={flight.flightInfo}
            price={flight.price}
            onBuy={() => handleBuy(flight.id, flight.price)}
            onViewOtherSellers={() => handleViewSellers(flight.id)}
            otherSellersCount={flight.otherSellersCount}
            className="w-full"
          />
        ))}
      </div>
      {showComparison && (
        <ComparisonDialog open={showComparison} onOpenChange={setShowComparison} />
      )}
      {showExpirationModal && (
        <ExpirationModal open={showExpirationModal} onOpenChange={setShowExpirationModal} />
      )}
    </div>
  )
}