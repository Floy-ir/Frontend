"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Airplane } from "iconsax-react"
import Image from "next/image"
import React from "react"
import { PiSuitcaseRollingLight } from "react-icons/pi"
import { twMerge } from "tailwind-merge"

import type { Transportation } from "@/app/types/trip"
import { Button } from "@/components/elements/Button/Button"
import { englishToFarsiNumber } from "@/utils/numbers"
import { Plus, Trash2 } from "lucide-react"

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
  "px-1 py-0.5 bg-Gray-N50 rounded-sm outline-[1.18px] outline-offset-[-1.18px] outline-Gray-N100 flex justify-center items-center gap-1 overflow-hidden lg:px-1.5 lg:py-1 lg:gap-1.5 2xl:px-1.5 2xl:py-1",
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

type TransportationCardProps = {
  activity: Transportation
  onFlightClick?: (activity: Transportation) => void
  onAddToBasket?: (activity: Transportation) => void
  onRemoveFromBasket?: (activityId: string) => void
  isInBasket?: boolean
  className?: string
  intent?: VariantProps<typeof flightCardVariants>["intent"]
}

// Format duration for display
const FormatDuration = ({ hours, minutes }: { hours: number; minutes: number }) => (
  <span>
    <span className="text-Gray-N500 text-[10px] leading-3 font-normal md-lg:text-[12px] lg:text-[12px]">
      {englishToFarsiNumber(hours)}{" "}
    </span>
    <span className="text-Gray-N500 text-[10px] leading-3 font-normal md-lg:text-[12px] lg:text-[12px]">
      ساعت{" "}
    </span>
    <span className="text-Gray-N500 text-[10px] leading-3 font-normal md-lg:text-[12px] lg:text-[12px]">
      {englishToFarsiNumber(minutes)}
    </span>
    <span className="text-Gray-N500 text-[10px] leading-3 font-normal md-lg:text-[12px] lg:text-[12px]">
      {" "}
      دقیقه
    </span>
  </span>
)

// Render flight route visualization component
const FlightRouteVisualization = ({ isMobile = true }: { isMobile?: boolean }) => (
  <div className="relative mx-0 flex flex-1 items-center justify-center">
    <div className="border-Gray-N300 size-1 rounded-[33px] border lg:size-1.5 2xl:size-1.5" />
    <div className="bg-Gray-N200 relative h-px w-23 flex-1" />
    <div className="bg-Gray-N300 size-1 rounded-[2px] lg:size-1.5 2xl:size-1.5" />
    <div
      className="absolute size-2.5 origin-top-left -rotate-90 lg:size-3 2xl:size-3"
      style={{ left: isMobile ? "33px" : "40px", top: "7px" }}
    >
      <Airplane size="12" color="#748297" variant="Bold" className="lg:size-4 2xl:size-4" />
    </div>
  </div>
)

// Badge component for flight info items
const InfoBadge = ({ text }: { text: string }) => (
  <div className={badgeStyles()}>
    <div className="text-Gray-N600 justify-center text-right text-[10px] leading-3 font-normal md-lg:text-[12px] lg:text-[12px]">
      {text}
    </div>
  </div>
)

// Badge with icon for baggage
const BaggageBadge = ({ text }: { text: string }) => (
  <div className={badgeStyles()}>
    <PiSuitcaseRollingLight className="text-Gray-N600 h-2.5 w-2.5 md-lg:h-3 md-lg:w-3 lg:h-3 lg:w-3" />
    <div className="text-Gray-N600 inline-flex justify-center gap-0.5 text-right text-[10px] leading-3 font-normal md-lg:gap-1 md-lg:text-[12px] lg:gap-1 lg:text-[12px]">
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
  <div className="bg-Gray-N50 outline-Gray-N200 relative flex flex-col items-end justify-center gap-1.5 self-stretch rounded-lg px-2 py-1.5 outline-1 outline-offset-[-1px] md-lg:gap-3 md-lg:px-3 md-lg:py-2 lg:gap-3 lg:px-3 lg:py-2">
    {price.label && (
      <div className="flex w-full items-start gap-0.5 md-lg:gap-1 lg:gap-1">
        <div className="text-Gray-N500 justify-center self-stretch text-right text-[10px] font-normal md-lg:text-[12px] lg:text-[12px]">
          {price.label}
        </div>
        <div className="text-Gray-N600 justify-start self-stretch text-right text-[10px] font-normal md-lg:text-[12px] lg:text-[12px]">
          در
        </div>
      </div>
    )}
    <div className="inline-flex items-center justify-between self-stretch">
      <div className="flex items-center justify-start gap-0.5 md-lg:gap-1 lg:gap-1">
        {price.agencyLogo && (
          <div className="outline-Gray-N200 size-4 overflow-hidden rounded-[48px] bg-white outline-1 outline-offset-[-1px] md-lg:size-6 lg:size-6">
            <Image
              src={price.agencyLogo}
              alt={`${price.agency} logo`}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          </div>
        )}

        <div className="inline-flex flex-col items-start justify-center">
          <div className="text-Gray-N600 justify-start text-right text-[11px] font-normal md-lg:text-[15px] lg:text-[15px]">
            {price.agency}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-0.5 md-lg:gap-1 lg:gap-1">
        <div className="text-Gray-N700 justify-start text-right text-xs leading-6 font-semibold md-lg:text-base md-lg:leading-7 lg:text-base lg:leading-7">
          {englishToFarsiNumber(price.formattedAmount)}
        </div>
        <div className="text-Gray-N500 justify-start text-right text-[9px] leading-none font-normal md-lg:text-[11px] lg:text-[11px]">
          تومان
        </div>
      </div>
    </div>
  </div>
)

export function TransportationCard({
  activity,
  onFlightClick,
  onAddToBasket,
  onRemoveFromBasket,
  isInBasket = false,
  className,
  intent = "default",
}: TransportationCardProps) {
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

  const handleAddToBasket = () => {
    if (onAddToBasket) {
      onAddToBasket(activity)
    }
  }

  const handleRemoveFromBasket = () => {
    if (onRemoveFromBasket) {
      onRemoveFromBasket(activity.id)
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
  const duration =
    flight.duration ||
    (() => {
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
    <article className={twMerge(flightCardVariants({ intent }), className)}>
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
                    <div className="text-Gray-N500 justify-start text-right text-[11px] leading-none font-normal">
                      تومان
                    </div>
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
                <div className="flex w-full gap-2">
                  <Button
                    intent="primary"
                    size="small"
                    className="flex-1 px-5 py-3.5"
                    onClick={handleBookingRedirect}
                  >
                    رفتن به {priceWithLabel.agency}
                  </Button>
                  
                  {isInBasket ? (
                    <button
                      onClick={handleRemoveFromBasket}
                      className="bg-Error-E50 text-Error-E500main hover:bg-Error-E100 focus:ring-Error-E500main flex items-center justify-center rounded-lg px-3 py-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                      aria-label="حذف از سبد"
                    >
                      <Trash2 size={20} className="shrink-0" />
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToBasket}
                      className="bg-Primary-P50 text-Primary-P500main hover:bg-Primary-P100 focus:ring-Primary-P500main flex items-center justify-center rounded-lg px-3 py-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                      aria-label="افزودن به سبد"
                    >
                      <Plus size={20} className="shrink-0" />
                    </button>
                  )}
                </div>

                <Button intent="text" size="small" className="w-full self-stretch px-5 py-3.5" onClick={handleViewAllFlights}>
                  مشاهده همه پروازها
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="md-lg:inline-flex hidden w-full items-start justify-between gap-2 self-stretch px-3 pt-4 pb-2 lg:inline-flex lg:gap-4 xl:gap-6 2xl:gap-8 2xl:px-6">
        {/* Flight details - Right */}
        <div className="inline-flex flex-1 flex-col items-center justify-between self-stretch px-1 py-3 lg:px-2 xl:px-3 xl:py-4 2xl:px-4">
          <div className="inline-flex items-center justify-end gap-0.5 self-stretch lg:gap-1 xl:gap-1.5 2xl:gap-2">
            {/* Airline logo and name */}
            <div className="inline-flex flex-col items-center justify-center gap-0.5 lg:gap-1 xl:gap-1.5 2xl:gap-2">
              <div className="border-Gray-N200 relative size-10 overflow-hidden rounded-[48px] border lg:size-10 xl:size-11 2xl:size-11">
                {flight.airlineLogo ? (
                  <Image
                    src={flight.airlineLogo}
                    alt={`${flight.airline} logo`}
                    fill
                    className="rounded-[50px] object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400 lg:text-sm xl:text-base">
                    {flight.airline.slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="text-Gray-N600 justify-start text-right text-[13px] font-semibold">
                {flight.airline}
              </div>
            </div>
            <div className="inline-flex flex-1 flex-col items-start justify-center">
              <div className="inline-flex items-center justify-start self-stretch">
                <time className="text-Gray-N800 flex-1 justify-start text-center text-lg leading-loose font-semibold lg:text-xl 2xl:text-xl">
                  {departureTime}
                </time>
                <FlightRouteVisualization isMobile={false} />
                <time className="text-Gray-N800 flex-1 justify-start text-center text-lg leading-loose font-semibold lg:text-xl 2xl:text-xl">
                  {arrivalTime}
                </time>
              </div>
              <div className="flex flex-col items-center justify-end gap-1 self-stretch lg:gap-2">
                <div className="justify-start text-center">
                  <FormatDuration hours={duration.hours} minutes={duration.minutes} />
                </div>
              </div>
            </div>
          </div>

          {/* Flight info badges */}
          <div className="inline-flex flex-wrap content-start items-start justify-start gap-0.5 self-stretch lg:gap-1 xl:gap-1.5 2xl:gap-2">
            {flightInfo.cabinClass && <InfoBadge text={flightInfo.cabinClass} />}
            {flightInfo.baggage && <BaggageBadge text={englishToFarsiNumber(flightInfo.baggage)} />}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="bg-Gray-N100 relative h-32 w-[1px] self-stretch lg:h-36 xl:h-40" />

        {/* Price and action section - Left */}
        <div className="inline-flex w-full max-w-[220px] flex-col items-start justify-start gap-2 px-1 lg:max-w-[240px] lg:px-2 xl:max-w-[260px] xl:px-2 2xl:max-w-[300px]">
          <div className="flex flex-col items-center justify-center gap-2 self-stretch xl:gap-2.5 2xl:gap-3">
            <PriceInfo price={priceWithLabel} />

            <div className="flex flex-col items-start justify-start gap-0.5 self-stretch lg:gap-1">
              <div className="flex w-full gap-1">
                <Button
                  intent="primary"
                  size="small"
                  className="flex-1"
                  onClick={handleBookingRedirect}
                >
                  رفتن به {priceWithLabel.agency}
                </Button>

                {isInBasket ? (
                  <button
                    onClick={handleRemoveFromBasket}
                    className="bg-Error-E50 text-Error-E500main hover:bg-Error-E100 focus:ring-Error-E500main flex items-center justify-center rounded-lg px-2 py-1.5 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none lg:px-2.5 xl:px-3"
                    aria-label="حذف از سبد"
                  >
                    <Trash2 size={18} className="shrink-0" />
                  </button>
                ) : (
                  <button
                    onClick={handleAddToBasket}
                    className="bg-Primary-P50 text-Primary-P500main hover:bg-Primary-P100 focus:ring-Primary-P500main flex items-center justify-center rounded-lg px-2 py-1.5 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none lg:px-2.5 xl:px-3"
                    aria-label="افزودن به سبد"
                  >
                    <Plus size={18} className="shrink-0" />
                  </button>
                )}
              </div>

              <Button
                intent="text"
                size="small"
                className="w-full"
                onClick={handleViewAllFlights}
              >
                مشاهده همه پروازها
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
