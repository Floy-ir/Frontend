"use client"

import React, { useEffect, useRef, useState } from "react"
import { EXPIRATION_MODAL_SETTINGS } from "@/app/config/settings"
import ExpirationModal from "@/components/FlightsPage/expiration-modal/page"
import { FlightCard } from "@/components/FlightsPage/FlightCard"
import { isRunningInMiniApp, openMiniAppExternalLink } from "@/utils/miniapp"

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
    agency_eng: string
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

  const [showExpirationModal, setShowExpirationModal] = useState(false)
  const expirationTimerIdRef = useRef<number | null>(null)

  const startExpirationTimer = () => {
    if (expirationTimerIdRef.current !== null) return
    const id = window.setTimeout(() => {
      setShowExpirationModal(true)
    }, EXPIRATION_MODAL_SETTINGS.SHOW_AFTER_MS)
    expirationTimerIdRef.current = id
  }

  useEffect(() => {
    const start = () => {
      startExpirationTimer()
    }

    const win = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    const idle = win.requestIdleCallback
    const cancelIdle = win.cancelIdleCallback
    let idleId: number | undefined
    let fallbackTimeout: number | undefined

    if (idle) {
      idleId = idle(start, { timeout: 2000 })
    } else {
      fallbackTimeout = window.setTimeout(start, 800)
    }

    window.addEventListener("pointerdown", start, { once: true })
    window.addEventListener("keydown", start, { once: true })

    return () => {
      if (idleId != null && cancelIdle) {
        cancelIdle(idleId)
      }
      if (fallbackTimeout != null) {
        window.clearTimeout(fallbackTimeout)
      }
      if (expirationTimerIdRef.current !== null) {
        window.clearTimeout(expirationTimerIdRef.current)
      }
      window.removeEventListener("pointerdown", start)
      window.removeEventListener("keydown", start)
    }
  }, [])

  const handleBuy = (_flightId: string, price: FlightData["price"]) => {
    const url = new URL(window.location.href)
    const adult = url.searchParams.get("adult") || "1"
    const child = url.searchParams.get("child") || "0"
    const infant = url.searchParams.get("infant") || "0"

    let redirectUrl = ""

    // if (adult === "1" && child === "0" && infant === "0") {
    //   redirectUrl = price.one_adult_redirect_url ?? ""
    // } else if (adult === "2" && child === "0" && infant === "0") {
    //   redirectUrl = price.two_adults_redirect_url ?? ""
    // } else {
    //   redirectUrl = price.base_redirect_url
    //     .replace("${adult_len}", adult)
    //     .replace("${child_len}", child)
    //     .replace("${infant_len}", infant)
    // }
    redirectUrl = price.base_redirect_url
      .replace("${adult_len}", adult)
      .replace("${child_len}", child)
      .replace("${infant_len}", infant)

    const finalRedirectUrl = `/redirect?redirect_url=${redirectUrl}&agency=${price.agency}&agency_eng=${price.agency_eng}`
    // const finalRedirectUrl = `/redirect?redirect_url=${encodeURIComponent(
    //         redirectUrl
    //       )}&agency=${encodeURIComponent(price.agency)}&agency_eng=${encodeURIComponent(price.agency_eng)}`

    console.log("redirectUrl", price.base_redirect_url)
    console.log("finalRedirectUrl", finalRedirectUrl)
    // Use mini app link handling when embedded, otherwise use regular window.open
    if (isRunningInMiniApp()) {
      openMiniAppExternalLink(finalRedirectUrl)
    } else {
      window.open(finalRedirectUrl, "_blank")
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-3 md:gap-4">
      <div className="sm-md:max-w-[400px] md-lg:max-w-[700px] flex w-full max-w-[328px] flex-col gap-3 md:max-w-[738px] md:gap-4">
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
