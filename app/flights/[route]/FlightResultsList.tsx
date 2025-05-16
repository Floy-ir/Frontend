"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { EXPIRATION_MODAL_SETTINGS } from "@/app/config/settings"
import ExpirationModal from "@/components/FlightsPage/expiration-modal/page"
import { FlightCard } from "@/components/FlightsPage/FlightCard"

type FlightData = {
  id: string
  departureTime: string
  arrivalTime: string
  origin: string
  destination: string
  duration: { hours: number; minutes: number }
  airline: {
    name: string
    logo: string
  }
  flightInfo: {
    baggage: string
    // ticketType: string
    cabinClass: string
  }
  otherSellersCount: number
  price: {
    amount: number
    formattedAmount: string
    agency: string
    agencyLogo: string
    label: string
    base_redirect_url: string
    one_adult_redirect_url: string | null
    two_adults_redirect_url: string | null
  }
  websites: {
    adult_price: number
    base_redirect_url: string
    child_price: number | null
    detail: {
      uid: string
      name: string
      name_fa: string
      image: string | null
    }
    infant_price: number | null
    one_adult_redirect_url: string
    remaining_seat: number
    two_adult_redirect_url: string
  }[]
}

type FlightResultsListProps = {
  flights: FlightData[]
  onRefresh: () => void
}

export function FlightResultsList({ flights, onRefresh }: FlightResultsListProps) {
  // Handle actions

  const router = useRouter()
  const [showExpirationModal, setShowExpirationModal] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowExpirationModal(true)
    }, EXPIRATION_MODAL_SETTINGS.SHOW_AFTER_MS)

    return () => clearInterval(interval)
  }, [])

  const handleBuy = (_flightId: string, price: FlightData["price"]) => {
    const url = new URL(window.location.href)
    const adult = url.searchParams.get("adult") || "1"
    const child = url.searchParams.get("child") || "0"
    const infant = url.searchParams.get("infant") || "0"

    let redirectUrl = ""

    if (adult === "1" && child === "0" && infant === "0") {
      redirectUrl = price.one_adult_redirect_url ?? ""
    } else if (adult === "2" && child === "0" && infant === "0") {
      redirectUrl = price.two_adults_redirect_url ?? ""
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

  return (
    <div className="flex w-full flex-col items-center gap-3 md:gap-4">
      <div className="md-lg:max-w-[700px] sm-md:max-w-[400px] flex w-full max-w-[328px] flex-col gap-3 md:max-w-[738px] md:gap-4">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            departureTime={flight.departureTime}
            arrivalTime={flight.arrivalTime}
            duration={flight.duration}
            airline={flight.airline}
            destination={flight.destination}
            origin={flight.origin}
            flightInfo={flight.flightInfo}
            price={flight.price}
            websites={flight.websites}
            onBuy={() => handleBuy(flight.id, flight.price)}
            otherSellersCount={flight.otherSellersCount}
            className="w-full"
          />
        ))}
      </div>

      {showExpirationModal && (
        <ExpirationModal open={showExpirationModal} onOpenChange={setShowExpirationModal} onRefresh={onRefresh} />
      )}
    </div>
  )
}
