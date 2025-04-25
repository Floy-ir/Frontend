"use client"

import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { Button } from "@/components/Button/Button"
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
  large: "text-lg leading-loose",
  xl: "text-xl leading-loose",
}

export interface FlightCardProps extends VariantProps<typeof flightCardVariants> {
  departureTime: string
  arrivalTime: string
  duration: {
    hours: number
    minutes: number
  }
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
  onBuy: () => void
  onViewOtherSellers?: () => void
  otherSellersCount?: number
  className?: string
}

// Format duration for display
const FormatDuration = ({ hours, minutes }: { hours: number; minutes: number }) => (
  <span>
    <span className={`text-Gray-N500 ${textStyles.small} ${textStyles.semibold}`}>{hours} </span>
    <span className={`text-Gray-N500 ${textStyles.small} ${textStyles.normal}`}>ساعت </span>
    <span className={`text-Gray-N500 ${textStyles.small} ${textStyles.semibold}`}>{minutes}</span>
    <span className={`text-Gray-N500 ${textStyles.small} ${textStyles.normal}`}> دقیقه</span>
  </span>
)

// Render flight route visualization component
const FlightRouteVisualization = ({ isMobile = true }: { isMobile?: boolean }) => (
  <div className="relative flex flex-1 items-center justify-center">
    <div className="bg-Gray-N300 size-1.5 rounded-[1px]" />
    <div className="bg-Gray-N200 relative h-px flex-1" />
    <div className="border-Gray-N300 size-1.5 rounded-[33px] border" />
    <div
      className="absolute size-3 origin-top-left -rotate-90"
      style={{ left: isMobile ? "33px" : "44px", top: "9px" }}
    >
      <div className="bg-Gray-N500 absolute h-[9.19px] w-2.5" style={{ left: "1px", top: "1.41px" }} />
    </div>
  </div>
)

// Badge component for flight info items
const InfoBadge = ({ text }: { text: string }) => (
  <div className={badgeStyles()}>
    <div className={`text-Gray-N600 justify-center text-right ${textStyles.small} ${textStyles.normal}`}>
      {text}
    </div>
  </div>
)

// Badge with icon for baggage
const BaggageBadge = ({ text }: { text: string }) => (
  <div className={badgeStyles()}>
    <div className={`text-Gray-N600 justify-center text-right ${textStyles.small} ${textStyles.normal}`}>
      {text}
    </div>
    <div className="relative size-3 overflow-hidden">
      <div className="bg-Gray-N700 absolute top-[1px] left-[2.67px] h-[9.89px] w-[6.45px]" />
      <div className="bg-Gray-N700 absolute top-[3.63px] left-[4.14px] h-[5.25px] w-[3.52px]" />
    </div>
  </div>
)

// Render flight information badges
const FlightInfoBadges = ({ flightInfo }: { flightInfo: FlightCardProps["flightInfo"] }) => (
  <div className="inline-flex flex-wrap content-start items-start justify-start gap-1 self-stretch">
    {flightInfo.cabinClass && <InfoBadge text={flightInfo.cabinClass} />}
    {flightInfo.baggage && <BaggageBadge text={flightInfo.baggage} />}
    {flightInfo.ticketType && <InfoBadge text={flightInfo.ticketType} />}
    {flightInfo.aircraft && <InfoBadge text={flightInfo.aircraft} />}
  </div>
)

// Price Information Component
const PriceInfo = ({ price }: { price: FlightCardProps["price"] }) => (
  <div className="bg-Gray-N50 outline-Gray-N200 relative flex flex-col items-end justify-center gap-1 self-stretch rounded-lg px-3 py-2 outline-1 outline-offset-[-1px]">
    {price.label && (
      <div className={`text-Gray-N500 justify-center self-stretch text-right ${textStyles.small} ${textStyles.normal}`}>
        {price.label}
      </div>
    )}
    <div className="inline-flex items-center justify-between self-stretch">
      <div className="flex items-center justify-start gap-1">
        <div className="inline-flex flex-col items-start justify-center gap-1">
          <div className={`text-Gray-N600 justify-start self-stretch text-right ${textStyles.medium} ${textStyles.normal}`}>
            در
          </div>
        </div>
        <div className="outline-Gray-N200 relative size-5 overflow-hidden rounded-[48px] bg-white outline-1 outline-offset-[-1px]">
          {price.agencyLogo && (
            <Image
              src={price.agencyLogo}
              alt={`${price.agency} logo`}
              width={10}
              height={13}
              className="absolute"
              style={{ left: "5.40px", top: "4px" }}
            />
          )}
        </div>
        <div className="inline-flex flex-col items-start justify-center gap-1">
          <div className={`text-Gray-N600 justify-start self-stretch text-right ${textStyles.medium} ${textStyles.semibold}`}>
            {price.agency}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1">
        <div className="text-Gray-N700 justify-start text-right  text-base leading-7 font-semibold">
          {englishToFarsiNumber(price.formattedAmount)}
        </div>
        <div className={`text-Gray-N500 justify-start text-right ${textStyles.medium} ${textStyles.semibold}`}>
          تومان
        </div>
      </div>
    </div>
  </div>
)

// Flight Details Section (Right Section in Desktop)
const FlightDetailsSection = ({
  departureTime,
  arrivalTime,
  duration,
  airline,
  flightInfo,
  isMobile = false,
}: Omit<FlightCardProps, "price" | "onBuy" | "onViewOtherSellers" | "otherSellersCount" | "className" | "intent"> & {
  isMobile?: boolean
}) => {
  const durationText = <FormatDuration hours={duration.hours} minutes={duration.minutes} />

  if (isMobile) {
    return (
      <div className="inline-flex items-center justify-center gap-6">
        <div className="inline-flex flex-1 flex-col items-start justify-center">
          <div className="inline-flex items-center justify-start self-stretch">
            <time className={`text-Gray-N800 flex-1 justify-start text-center ${textStyles.large} ${textStyles.semibold}`}>
              {departureTime}
            </time>
            <FlightRouteVisualization isMobile={true} />
            <time className={`text-Gray-N800 flex-1 justify-start text-center ${textStyles.large} ${textStyles.semibold}`}>
              {arrivalTime}
            </time>
          </div>
          <div className="flex flex-col items-center justify-end gap-2 self-stretch">
            <div className="justify-start text-center">{durationText}</div>
          </div>
        </div>

        {/* Airline logo and name */}
        <div className="inline-flex flex-col items-center justify-center gap-2">
          <div className="border-Gray-N200 relative size-9 overflow-hidden rounded-[48px] border">
            <Image src={airline.logo} alt={`${airline.name} logo`} fill className="object-contain" />
          </div>
          <div className={`text-Gray-N600 justify-start text-right ${textStyles.medium} ${textStyles.semibold}`}>
            {airline.name}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="inline-flex flex-1 flex-col items-center justify-between self-stretch px-4 py-4">
      <div className="inline-flex items-center justify-end gap-9 self-stretch py-1">
        {/* Airline logo and name */}
        <div className="inline-flex flex-col items-center justify-center gap-2">
          <div className="border-Gray-N200 relative size-11 overflow-hidden rounded-[48px] border">
            <Image src={airline.logo} alt={`${airline.name} logo`} fill className="object-contain" />
          </div>
          <div className={`text-Gray-N600 justify-start text-right ${textStyles.medium} ${textStyles.semibold}`}>
            {airline.name}
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
            <div className="justify-start text-center">{durationText}</div>
          </div>
        </div>
      </div>

      {/* Flight info badges */}
      <FlightInfoBadges flightInfo={flightInfo} />
    </div>
  )
}

// Price and Action Section (Left Section in Desktop)
const PriceActionSection = ({
  price,
  onBuy,
  onViewOtherSellers,
  otherSellersCount = 0,
  isMobile = false,
}: Pick<FlightCardProps, "price" | "onBuy" | "onViewOtherSellers" | "otherSellersCount"> & {
  isMobile?: boolean
}) => {
  if (isMobile) {
    return (
      <div className="flex flex-col items-start justify-start gap-2 self-stretch">
        <div className="flex flex-col items-center justify-center gap-3 self-stretch">
          <PriceInfo price={price} />

          <div className="flex flex-col items-start justify-start gap-2 self-stretch">
            <Button intent="primary" size="small" className="self-stretch" onClick={onBuy}>
              خرید
            </Button>
            {otherSellersCount > 0 && (
              <Button intent="text" size="small" className="self-stretch" onClick={onViewOtherSellers}>
                مشاهده {englishToFarsiNumber(otherSellersCount)} فروشنده
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="inline-flex w-[272px] flex-col items-start justify-start gap-2 px-2">
      <div className="flex flex-col items-center justify-center gap-3 self-stretch">
        <PriceInfo price={price} />

        <div className="flex flex-col items-start justify-start gap-1 self-stretch">
          <Button intent="primary" size="small" className="self-stretch" onClick={onBuy}>
            خرید
          </Button>
          {otherSellersCount > 0 && (
            <Button intent="text" size="small" className="self-stretch" onClick={onViewOtherSellers}>
              مشاهده {englishToFarsiNumber(otherSellersCount)} فروشنده
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function FlightCard({
  departureTime,
  arrivalTime,
  duration,
  airline,
  flightInfo,
  price,
  intent,
  onBuy,
  onViewOtherSellers,
  otherSellersCount = 0,
  className,
}: FlightCardProps) {
  return (
    <article className={twMerge(flightCardVariants({ intent, className }))}>
      {/* Mobile/Tablet Layout */}
      <div className="flex flex-col md:hidden">
        <div data-layer="Frame 1000002364" className="self-stretch px-4 pt-4 pb-2 bg-Shade-White rounded-xl outline-1 outline-offset-[-1px] outline-Gray-N200 inline-flex flex-col justify-center items-center gap-3 overflow-hidden">
          {/* Flight info section */}
          <div data-layer="Frame 1000002337" className="self-stretch inline-flex flex-row-reverse justify-center items-center gap-6">
            <div data-layer="Frame 1000002339" className="flex-1 inline-flex flex-col justify-center items-end">
              <div data-layer="Frame 1000002403" className="self-stretch inline-flex flex-row-reverse justify-start items-center">
                <time className="flex-1 text-center justify-start text-Gray-N800 text-lg font-semibold leading-loose">
                  {departureTime}
                </time>
                <div data-layer="Frame 1000002345" className="flex-1 relative flex justify-center items-center">
                  <div data-layer="Rectangle 1" className="size-1.5 bg-Gray-N300 rounded-[1px]" />
                  <div data-layer="Divider" data-bg="White" data-size="Thin" data-type="Horizontal" className="flex-1 h-px relative bg-Gray-N200" />
                  <div data-layer="Rectangle 2" className="size-1.5 rounded-[33px] border border-Gray-N300" />
                  <div data-layer="vuesax/bold/airplane" className="size-3 left-[33px] top-[9px] absolute origin-top-left -rotate-90">
                    <div data-layer="Vector" className="w-2.5 h-[9.19px] left-[1px] top-[1.41px] absolute bg-Gray-N500" />
                    <div data-layer="Vector" className="size-3 left-[12px] top-[12px] absolute origin-top-left -rotate-180 opacity-0 bg-Gray-N500" />
                  </div>
                </div>
                <time className="flex-1 text-center justify-start text-Gray-N800 text-lg font-semibold leading-loose">
                  {arrivalTime}
                </time>
              </div>
              <div data-layer="Frame 1000002344" className="self-stretch flex flex-col justify-end items-center gap-2">
                <div data-layer="Duration" className="text-center justify-start">
                  <FormatDuration hours={duration.hours} minutes={duration.minutes} />
                </div>
              </div>
            </div>

            {/* Airline logo and name */}
            <div data-layer="Frame 1000002402" className="inline-flex flex-col justify-center items-center gap-2">
              <div className="size-9 relative rounded-[48px] border border-Gray-N200 overflow-hidden">
                <Image src={airline.logo} alt={`${airline.name} logo`} fill className="object-contain" />
              </div>
              <div className="text-right justify-start text-Gray-N600 text-[11px] font-semibold leading-none">
                {airline.name}
              </div>
            </div>
          </div>

          {/* Flight info badges */}
          <div data-layer="Frame 1000002341" className="self-stretch inline-flex justify-start items-start gap-1 flex-wrap content-start">
            {flightInfo.cabinClass && <InfoBadge text={flightInfo.cabinClass} />}
            {flightInfo.baggage && <BaggageBadge text={flightInfo.baggage} />}
            {flightInfo.ticketType && <InfoBadge text={flightInfo.ticketType} />}
            {flightInfo.aircraft && <InfoBadge text={flightInfo.aircraft} />}
          </div>

          {/* Divider */}
          <div data-layer="Divider" className="self-stretch h-px relative bg-Gray-N100" />

          {/* Price and action section */}
          <div data-layer="Frame 1000002366" className="self-stretch flex flex-col justify-start items-start gap-2">
            <div data-layer="Frame 1000002350" className="self-stretch flex flex-col justify-center items-center gap-3">
              <div data-layer="Frame 1000002406" className="self-stretch px-3 py-2 relative bg-Gray-N50 rounded-lg outline outline-1 outline-offset-[-1px] outline-Gray-N200 flex flex-col justify-center items-end gap-1">
                {price.label && (
                  <div className="self-stretch text-right justify-center text-Gray-N500 text-[10px] font-normal leading-3">
                    {price.label}
                  </div>
                )}
                <div data-layer="Frame 1000002410" className="self-stretch inline-flex flex-row-reverse justify-between items-center">
                  <div data-layer="Frame 1000002342" className="flex flex-row-reverse justify-end items-center gap-1">
                    <div className="text-right justify-start text-Gray-N500 text-[11px] font-semibold leading-none">
                      تومان
                    </div>
                    <div className="text-right justify-start text-Gray-N700 text-base font-semibold leading-7">
                      {englishToFarsiNumber(price.formattedAmount)}
                    </div>
                  </div>
                  <div data-layer="Frame 1000002408" className="flex flex-row-reverse justify-end items-center gap-1">
                    <div className="inline-flex flex-col justify-center items-end gap-1">
                      <div className="self-stretch text-right justify-start text-Gray-N600 text-[11px] font-semibold leading-none">
                        {price.agency}
                      </div>
                    </div>
                    <div className="size-5 relative bg-white rounded-[48px] outline outline-1 outline-offset-[-1px] outline-Gray-N200 overflow-hidden">
                      {price.agencyLogo && (
                        <Image
                          src={price.agencyLogo}
                          alt={`${price.agency} logo`}
                          width={10}
                          height={13}
                          className="absolute"
                          style={{ left: "5.40px", top: "4px" }}
                        />
                      )}
                    </div>
                    <div className="inline-flex flex-col justify-center items-end gap-1">
                      <div className="self-stretch text-right justify-start text-Gray-N600 text-[11px] font-normal leading-none">
                        در
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div data-layer="Frame 1000002404" className="self-stretch flex flex-col justify-start items-start gap-2">
                <Button intent="primary" size="small" className="self-stretch px-5 py-3.5" onClick={onBuy}>
                  خرید
                </Button>
                {otherSellersCount > 0 && (
                  <Button intent="text" size="small" className="self-stretch px-5 py-3.5" onClick={onViewOtherSellers}>
                    مشاهده {englishToFarsiNumber(otherSellersCount)} فروشنده
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden w-full items-start justify-between gap-8 self-stretch px-6 pt-4 pb-2 md:inline-flex">
        {/* Flight details - Right */}
        <FlightDetailsSection
          departureTime={departureTime}
          arrivalTime={arrivalTime}
          duration={duration}
          airline={airline}
          flightInfo={flightInfo}
        />

        {/* Vertical divider */}
        <div className="bg-Gray-N100 relative mx-2 h-40 w-[1px]" />

        {/* Price and action section - Left */}
        <PriceActionSection
          price={price}
          onBuy={onBuy}
          onViewOtherSellers={onViewOtherSellers}
          otherSellersCount={otherSellersCount}
        />
      </div>
    </article>
  )
}
