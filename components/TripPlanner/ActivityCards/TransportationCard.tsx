"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Airplane } from "iconsax-react"
import Image from "next/image"
import React, { useState } from "react"
import { PiSuitcaseRollingLight } from "react-icons/pi"
import { twMerge } from "tailwind-merge"

import { Button } from "@/components/elements/Button/Button"
import type { Transportation } from "@/app/types/trip"
import { englishToFarsiNumber } from "@/utils/numbers"

// Card wrapper styles with variants
const flightCardVariants = cva(
  "bg-Shade-White rounded-xl outline-1 outline-offset-[-1px] outline-Gray-N200 overflow-hidden",
  {
    variants: {
      intent: {
        default: "",
        highlighted: "outline-Primary-P300 outline-2",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
)

// Badge styles
const badgeStyles = cva(
  "px-1.5 py-1 bg-Gray-N50 rounded-sm outline-[1.18px] outline-offset-[-1.18px] outline-Gray-N100 flex justify-center items-center gap-1.5 overflow-hidden",
  {
    variants: {
      intent: {
        default: "",
        highlighted: "bg-Primary-P50 outline-Primary-P100",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
)

// Common text styles
const textStyles = {
  normal: " font-normal",
  semibold: " font-semibold",
  small: "text-[10px] leading-3",
  medium: "text-[11px] leading-none",
  good: "text-[12px]",
  large: "text-lg leading-loose",
  xl: "text-xl leading-loose",
}

type TransportationCardProps = {
  activity: Transportation
  onFlightClick?: (activity: Transportation) => void
  className?: string
  intent?: VariantProps<typeof flightCardVariants>["intent"]
}

// Format duration for display
const FormatDuration = ({ hours, minutes }: { hours: number; minutes: number }) => (
  <span>
    <span className={`text-Gray-N500 text-[12px] leading-3 font-normal ${textStyles.small} ${textStyles.normal}`}>
      {englishToFarsiNumber(hours)}{" "}
    </span>
    <span className={`text-Gray-N500 text-[12px] font-normal leading-3${textStyles.small} ${textStyles.normal}`}>
      ساعت{" "}
    </span>
    <span className={`text-Gray-N500 text-[12px] leading-3 font-normal ${textStyles.small} ${textStyles.normal}`}>
      {englishToFarsiNumber(minutes)}
    </span>
    <span className={`text-Gray-N500 text-[12px] leading-3 font-normal ${textStyles.small} ${textStyles.normal}`}>
      {" "}
      دقیقه
    </span>
  </span>
)

// Render flight route visualization component
const FlightRouteVisualization = ({ isMobile = true }: { isMobile?: boolean }) => (
  <div className="relative mx-0 flex flex-1 items-center justify-center">
    <div className="border-Gray-N300 size-1.5 rounded-[33px] border" />
    <div className="bg-Gray-N200 relative h-px w-23 flex-1" />
    <div className="bg-Gray-N300 size-1.5 rounded-[2px]" />
    <div
      className="absolute size-3 origin-top-left -rotate-90"
      style={{ left: isMobile ? "33px" : "55px", top: "7px" }}
    >
      <Airplane size="16" color="#748297" variant="Bold" />
    </div>
  </div>
)

// Badge component for flight info items
const InfoBadge = ({ text }: { text: string }) => (
  <div className={badgeStyles()}>
    <div
      className={`text-Gray-N600 justify-center text-right text-[12px] leading-3 font-normal ${textStyles.small} ${textStyles.normal}`}
    >
      {text}
    </div>
  </div>
)

// Badge with icon for baggage
const BaggageBadge = ({ text }: { text: string }) => (
  <div className={badgeStyles()}>
    <PiSuitcaseRollingLight className="text-Gray-N600 h-3 w-3" />
    <div
      className={`text-Gray-N600 inline-flex justify-center gap-1 text-right text-[12px] leading-3 font-normal ${textStyles.small} ${textStyles.normal}`}
    >
      {text} کیلوگرم
    </div>
  </div>
)

// Price Information Component
const PriceInfo = ({
  price,
}: {
  price: { amount: number; formattedAmount: string; agency: string; agencyLogo?: string; label?: string }
}) => (
  <div className="bg-Gray-N50 outline-Gray-N200 relative flex flex-col items-end justify-center gap-3 self-stretch rounded-lg px-3 py-2 outline-1 outline-offset-[-1px]">
    {price.label && (
      <div className="flex w-full items-start gap-1">
        <div
          className={`text-Gray-N500 justify-center self-stretch text-right ${textStyles.good} ${textStyles.normal}`}
        >
          {price.label}
        </div>
        <div className={`text-Gray-N600 justify-start self-stretch text-right ${textStyles.good} ${textStyles.normal}`}>
          در
        </div>
      </div>
    )}
    <div className="inline-flex items-center justify-between self-stretch">
      <div className="flex items-center justify-start gap-1">
        <div className="inline-flex flex-col items-start justify-center gap-1"></div>
        {price.agencyLogo && (
          <div className="outline-Gray-N200 size-6 overflow-hidden rounded-[48px] bg-white outline-1 outline-offset-[-1px]">
            <Image
              src={price.agencyLogo}
              alt={`${price.agency} logo`}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          </div>
        )}

        <div className="inline-flex flex-col items-start justify-center gap-1">
          <div
            className={`text-Gray-N600 justify-start self-stretch text-right text-[15px] ${textStyles.normal} ${textStyles.normal}`}
          >
            {price.agency}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1">
        <div className="text-Gray-N700 justify-start text-right text-base text-[17px] leading-7 font-semibold">
          {englishToFarsiNumber(price.formattedAmount)}
        </div>
        <div className={`text-Gray-N500 justify-start text-right ${textStyles.medium} ${textStyles.normal}`}>تومان</div>
      </div>
    </div>
  </div>
)

export function TransportationCard({ activity, onFlightClick, className, intent = "default" }: TransportationCardProps) {
  const [showComparison, setShowComparison] = useState(false)

  const handleViewAllFlights = () => {
    if (onFlightClick) {
      onFlightClick(activity)
    }
  }

  const handleBookingRedirect = () => {
    if (activity.recommendedFlight) {
      // Placeholder URL - in real implementation, this would be the actual booking URL
      const bookingUrl = `https://example.com/booking?origin=${activity.origin}&destination=${activity.destination}`
      window.open(bookingUrl, "_blank")
    }
  }

  // Only render full flight card for flights with recommended data
  if (activity.mode !== "flight" || !activity.recommendedFlight) {
    return null
  }

  const flight = activity.recommendedFlight
  const departureTime = englishToFarsiNumber(flight.departureTime)
  const arrivalTime = englishToFarsiNumber(flight.arrivalTime)
  
  // Parse duration - use flight.duration if available, otherwise parse activity.duration string
  const duration = flight.duration || (() => {
    const match = activity.duration.match(/(\d+)[^\d]*(\d+)?/)
    const hours = match?.[1] ? parseInt(match[1], 10) : 0
    const minutes = match?.[2] ? parseInt(match[2], 10) : 0
    return { hours, minutes }
  })()
  
  const flightInfo = flight.flightInfo || { baggage: "20", cabinClass: "اقتصادی" }
  
  // Add default label if not provided
  const priceWithLabel = {
    ...flight.price,
    label: flight.price.label || "ارزان‌ترین در",
  }

  return (
    <article className={twMerge(flightCardVariants({ intent, className }))}>
      {/* Mobile/Tablet Layout */}
      <div className="md-lg:hidden flex flex-col lg:hidden">
        <div
          data-layer="Frame 1000002364"
          className="bg-Shade-White outline-Gray-N200 inline-flex flex-col items-center justify-center gap-3 self-stretch overflow-hidden rounded-xl px-4 pt-4 pb-2 outline-1 outline-offset-[-1px]"
        >
          {/* Flight info section */}
          <div
            data-layer="Frame 1000002337"
            className="inline-flex flex-row-reverse items-center justify-center gap-6 self-stretch"
          >
            <div data-layer="Frame 1000002339" className="inline-flex flex-1 flex-col items-end justify-center">
              <div
                data-layer="Frame 1000002403"
                className="inline-flex flex-row-reverse items-center justify-start self-stretch"
              >
                <time className="text-Gray-N800 flex-1 justify-start text-center text-lg leading-loose font-semibold">
                  {arrivalTime}
                </time>

                <FlightRouteVisualization isMobile={true} />

                <time className="text-Gray-N800 flex-1 justify-start text-center text-lg leading-loose font-semibold">
                  {departureTime}
                </time>
              </div>

              <div data-layer="Frame 1000002344" className="flex flex-col items-center justify-end gap-2 self-stretch">
                <div data-layer="Duration" className="justify-start text-center">
                  <FormatDuration hours={duration.hours} minutes={duration.minutes} />
                </div>
              </div>
            </div>

            {/* Airline logo and name */}
            <div data-layer="Frame 1000002402" className="inline-flex flex-col items-center justify-center gap-2">
              <div className="border-Gray-N200 relative size-9 overflow-hidden rounded-[48px] border">
                {flight.airlineLogo ? (
                  <Image src={flight.airlineLogo} alt={`${flight.airline} logo`} fill className="object-contain" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                    {flight.airline.slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="text-Gray-N600 justify-start text-right text-[12px] leading-none font-semibold">
                {flight.airline}
              </div>
            </div>
          </div>

          {/* Flight info badges */}
          <div
            data-layer="Frame 1000002341"
            className="mt-3 inline-flex flex-wrap content-start items-start justify-start gap-1 self-stretch"
          >
            {flightInfo.cabinClass && <InfoBadge text={flightInfo.cabinClass} />}
            {flightInfo.baggage && <BaggageBadge text={englishToFarsiNumber(flightInfo.baggage)} />}
          </div>

          {/* Divider */}
          <div data-layer="Divider" className="bg-Gray-N100 relative my-2 h-px self-stretch" />

          {/* Price and action section */}
          <div data-layer="Frame 1000002366" className="flex flex-col items-start justify-start gap-2 self-stretch">
            <div data-layer="Frame 1000002350" className="flex flex-col items-center justify-center gap-3 self-stretch">
              <div
                data-layer="Frame 1000002406"
                className="bg-Gray-N50 outline-Gray-N200 relative flex flex-col items-end justify-center gap-1 self-stretch rounded-lg px-3 py-2 outline-1 outline-offset-[-1px]"
              >
                {priceWithLabel.label && (
                  <div className="flex w-full items-center justify-start gap-1">
                    <div className="text-Gray-N500 justify-center self-stretch text-right text-[10px] leading-3 font-normal">
                      {priceWithLabel.label}
                    </div>
                    <div className="text-Gray-N600 justify-start self-stretch text-right text-[11px] leading-none font-normal">
                      در
                    </div>
                  </div>
                )}

                <div
                  data-layer="Frame 1000002410"
                  className="mt-1 mb-0.5 inline-flex flex-row-reverse items-center justify-between self-stretch"
                >
                  <div data-layer="Frame 1000002342" className="flex flex-row-reverse items-center justify-end gap-1">
                    <div className="text-Gray-N500 justify-start text-right text-[11px] leading-none font-normal">تومان</div>
                    <div className="text-Gray-N700 justify-start text-right text-base leading-7 font-semibold">
                      {englishToFarsiNumber(priceWithLabel.formattedAmount)}
                    </div>
                  </div>
                  <div data-layer="Frame 1000002408" className="flex flex-row-reverse items-center justify-end gap-2">
                    <div className="inline-flex flex-col items-end justify-center gap-1">
                      <div
                        className={`text-Gray-N600 justify-start self-stretch text-right text-[12px] leading-none font-semibold`}
                      >
                        {priceWithLabel.agency}
                      </div>
                    </div>
                    {priceWithLabel.agencyLogo && (
                      <div className="outline-Gray-N200 flex size-8 items-center justify-center overflow-hidden rounded-[48px] bg-white outline-1 outline-offset-[-1px]">
                        <Image
                          src={priceWithLabel.agencyLogo}
                          alt={`${priceWithLabel.agency} logo`}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}

                    <div className="inline-flex flex-col items-end justify-center gap-1"></div>
                  </div>
                </div>
              </div>

              <div data-layer="Frame 1000002404" className="flex flex-col items-start justify-start gap-2 self-stretch">
                <Button intent="primary" size="small" className="self-stretch px-5 py-3.5" onClick={handleBookingRedirect}>
                  رفتن به {priceWithLabel.agency}
                </Button>

                <Button
                  intent="text"
                  size="small"
                  className="self-stretch px-5 py-3.5"
                  onClick={handleViewAllFlights}
                >
                  مشاهده همه پروازها
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="md-lg:inline-flex hidden w-full items-start justify-between gap-8 self-stretch px-6 pt-4 pb-2 lg:inline-flex">
        {/* Flight details - Right */}
        <div className="inline-flex flex-1 flex-col items-center justify-between self-stretch px-4 py-4">
          <div className="inline-flex items-center justify-end gap-2 self-stretch">
            {/* Airline logo and name */}
            <div className="inline-flex flex-col items-center justify-center gap-2">
              <div className="border-Gray-N200 relative size-11 overflow-hidden rounded-[48px] border">
                {flight.airlineLogo ? (
                  <Image
                    src={flight.airlineLogo}
                    alt={`${flight.airline} logo`}
                    fill
                    className="rounded-[50px] object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                    {flight.airline.slice(0, 2)}
                  </div>
                )}
              </div>
              <div className={`text-Gray-N600 justify-start text-right text-[13px] ${textStyles.semibold}`}>
                {flight.airline}
              </div>
            </div>
            <div className="inline-flex flex-1 flex-col items-start justify-center">
              <div className="inline-flex items-center justify-start self-stretch">
                <time className={`text-Gray-N800 flex-1 justify-start text-center ${textStyles.xl} ${textStyles.semibold}`}>
                  {departureTime}
                </time>
                <FlightRouteVisualization isMobile={false} />
                <time className={`text-Gray-N800 flex-1 justify-start text-center ${textStyles.xl} ${textStyles.semibold}`}>
                  {arrivalTime}
                </time>
              </div>
              <div className="flex flex-col items-center justify-end gap-2 self-stretch">
                <div className="justify-start text-center">
                  <FormatDuration hours={duration.hours} minutes={duration.minutes} />
                </div>
              </div>
            </div>
          </div>

          {/* Flight info badges */}
          <div className="inline-flex flex-wrap content-start items-start justify-start gap-2 self-stretch">
            {flightInfo.cabinClass && <InfoBadge text={flightInfo.cabinClass} />}
            {flightInfo.baggage && <BaggageBadge text={englishToFarsiNumber(flightInfo.baggage)} />}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="bg-Gray-N100 relative h-40 w-[1px]" />

        {/* Price and action section - Left */}
        <div className="-mx-3 inline-flex w-[290px] flex-col items-start justify-start gap-2 px-2 md:w-[300px]">
          <div className="flex flex-col items-center justify-center gap-3 self-stretch">
            <PriceInfo price={priceWithLabel} />

            <div className="flex flex-col items-start justify-start gap-1 self-stretch">
              <Button intent="primary" size="small" className="self-stretch" onClick={handleBookingRedirect}>
                رفتن به {priceWithLabel.agency}
              </Button>

              <Button intent="text" size="small" className="self-stretch" onClick={handleViewAllFlights}>
                مشاهده همه پروازها
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

