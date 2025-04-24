"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Airplane } from "iconsax-react"
import Image from "next/image"
import { PiSuitcaseRollingLight } from "react-icons/pi";
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
  good:"text-[12px]",
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
    <span className={`text-Gray-N500 text-[12px] font-normal leading-3 ${textStyles.small} ${textStyles.normal}`}>{englishToFarsiNumber(hours)} </span>
    <span className={`text-Gray-N500 text-[12px] font-normal leading-3${textStyles.small} ${textStyles.normal}`}>ساعت </span>
    <span className={`text-Gray-N500 text-[12px] font-normal leading-3 ${textStyles.small} ${textStyles.normal}`}>{englishToFarsiNumber(minutes)}</span>
    <span className={`text-Gray-N500 text-[12px] font-normal leading-3 ${textStyles.small} ${textStyles.normal}`}> دقیقه</span>
  </span>
)

// Render flight route visualization component
const FlightRouteVisualization = ({ isMobile = true }: { isMobile?: boolean }) => (
  <div className="relative mx-0  flex flex-1 items-center justify-center">
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
    <div className={`text-Gray-N600 justify-center text-[12px] font-normal leading-3 text-right ${textStyles.small} ${textStyles.normal}`}>{text}</div>
  </div>
)

// Badge with icon for baggage
const BaggageBadge = ({ text }: { text: string }) => (
  <div className={badgeStyles()}>
    <PiSuitcaseRollingLight className="h-3 w-3 text-Gray-N600"/>
    <div className={`text-Gray-N600 justify-center  text-[12px] font-normal leading-3 text-right ${textStyles.small} ${textStyles.normal}`}>{text}</div>
  </div>
)

// Render flight information badges
const FlightInfoBadges = ({ flightInfo }: { flightInfo: FlightCardProps["flightInfo"] }) => (
  <div className="inline-flex flex-wrap content-start items-start justify-start gap-2 self-stretch">
    {flightInfo.cabinClass && <InfoBadge text={flightInfo.cabinClass} />}
    {flightInfo.baggage && <BaggageBadge text={flightInfo.baggage} />}
    {flightInfo.ticketType && <InfoBadge text={flightInfo.ticketType} />}
    {flightInfo.aircraft && <InfoBadge text={flightInfo.aircraft} />}
  </div>
)

// Price Information Component
const PriceInfo = ({ price }: { price: FlightCardProps["price"] }) => (
  <div className="bg-Gray-N50 outline-Gray-N200 relative flex flex-col items-end justify-center gap-3 self-stretch rounded-lg px-3 py-2 outline-1 outline-offset-[-1px]">
    {price.label && (
      <div className="flex gap-1 items-start w-full">
      <div className={`text-Gray-N500 justify-center  self-stretch text-right ${textStyles.good} ${textStyles.normal}`}>
        {price.label} 
      </div>
          <div
            className={`text-Gray-N600 justify-start self-stretch text-right ${textStyles.good} ${textStyles.normal}`}
          >
            در
          </div>
          </div>
    )}
    <div className="inline-flex items-center justify-between self-stretch">
      <div className="flex items-center justify-start gap-1">
        <div className="inline-flex flex-col items-start justify-center gap-1">
        </div>
        <div className="outline-Gray-N200 relative size-6 overflow-hidden rounded-[48px] bg-white outline-1 outline-offset-[-1px]">
          {price.agencyLogo && (
            <Image
              src={price.agencyLogo}
              alt={`${price.agency} logo`}
              width={11}
              height={13}
              className="absolute"
              style={{ left: "7px", top: "6px" }}
            />
          )}
        </div>
        <div className="inline-flex flex-col items-start justify-center gap-1">
          <div
            className={`text-Gray-N600 justify-start self-stretch text-right text-[15px] ${textStyles.good} ${textStyles.semibold}`}
          >
            {price.agency}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1">
        <div className="text-Gray-N700 justify-start text-right text-[17px] text-base leading-7 font-semibold">
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
            <time
              className={`text-Gray-N800 flex-1 justify-start text-center ${textStyles.large} ${textStyles.semibold}`}
            >
              {departureTime}
            </time>
            <FlightRouteVisualization isMobile={true} />
            <time
              className={`text-Gray-N800 flex-1 justify-start text-center ${textStyles.large} ${textStyles.semibold}`}
            >
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
      <div className="inline-flex items-center justify-end gap-2 self-stretch ">
        {/* Airline logo and name */}
        <div className="inline-flex flex-col items-center justify-center gap-2">
          <div className="border-Gray-N200 relative size-11 overflow-hidden rounded-[48px] border">
            <Image src={airline.logo} alt={`${airline.name} logo`} fill className="object-contain" />
          </div>
          <div className={`text-Gray-N600 justify-start text-right text-[13px] ${textStyles.semibold}`}>
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
              <Button
                intent="text"
                size="small"
                className="self-stretch"
              >
                مشاهده {englishToFarsiNumber(otherSellersCount)} فروشنده
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="inline-flex w-[290px] md:w-[250px] flex-col items-start justify-start gap-2 px-2 -mx-3">
      <div className="flex flex-col items-center justify-center gap-3 self-stretch">
        <PriceInfo price={price} />

        <div className="flex flex-col items-start justify-start gap-1 self-stretch">
          <Button intent="primary" size="small" className="self-stretch" onClick={onBuy}>
            خرید
          </Button>
          {otherSellersCount > 0 && (
            <Button
              intent="text"
              size="small"
              className="self-stretch"
            >
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
      <div className="flex flex-col md-lg:hidden lg:hidden ">
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
                  {englishToFarsiNumber(departureTime)}
                </time>


            <FlightRouteVisualization isMobile={true} />
                
                <time className="text-Gray-N800 flex-1 justify-start text-center text-lg leading-loose font-semibold">
                {englishToFarsiNumber(arrivalTime)}
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
                <Image src={airline.logo} alt={`${airline.name} logo`} fill className="object-contain" />
              </div>
              <div className="text-Gray-N600 justify-start text-right text-[12px] leading-none font-semibold">
                {airline.name}
              </div>
            </div>
          </div>

          {/* Flight info badges */}
          <div
            data-layer="Frame 1000002341"
            className="inline-flex flex-wrap content-start items-start justify-start gap-1 self-stretch mt-3"
          >
            {flightInfo.cabinClass && <InfoBadge text={flightInfo.cabinClass} />}
            {flightInfo.baggage && <BaggageBadge text={flightInfo.baggage} />}
            {flightInfo.ticketType && <InfoBadge text={flightInfo.ticketType} />}
            {flightInfo.aircraft && <InfoBadge text={flightInfo.aircraft} />}
          </div>

          {/* Divider */}
          <div data-layer="Divider" className="bg-Gray-N100 relative h-px self-stretch my-2" />

          {/* Price and action section */}
          <div data-layer="Frame 1000002366" className="flex flex-col items-start justify-start gap-2 self-stretch">
            <div data-layer="Frame 1000002350" className="flex flex-col items-center justify-center gap-3 self-stretch">
              <div
                data-layer="Frame 1000002406"
                className="bg-Gray-N50 outline-Gray-N200 relative flex flex-col items-end justify-center gap-1 self-stretch rounded-lg px-3 py-2 outline-1 outline-offset-[-1px]"
              >
                {price.label && (
                  <div className="text-Gray-N500 justify-center self-stretch text-right text-[10px] leading-3 font-normal">
                    {price.label}
                  </div>
                )}
                <div
                  data-layer="Frame 1000002410"
                  className="inline-flex flex-row-reverse items-center justify-between self-stretch"
                >
                  <div data-layer="Frame 1000002342" className="flex flex-row-reverse items-center justify-end gap-1">
                    <div className="text-Gray-N500 justify-start text-right text-[11px] leading-none font-semibold">
                      تومان
                    </div>
                    <div className="text-Gray-N700 justify-start text-right text-base leading-7 font-semibold">
                      {englishToFarsiNumber(price.formattedAmount)}
                    </div>
                  </div>
                  <div data-layer="Frame 1000002408" className="flex flex-row-reverse items-center justify-end gap-2">
                    <div className="inline-flex flex-col items-end justify-center gap-1">
                      <div className="text-Gray-N600 justify-start self-stretch text-right text-[11px] leading-none font-semibold">
                        {price.agency}
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
                    <div className="inline-flex flex-col items-end justify-center gap-1">
                      <div className="text-Gray-N600 justify-start self-stretch text-right text-[11px] leading-none font-normal">
                        در
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div data-layer="Frame 1000002404" className="flex flex-col items-start justify-start gap-2 self-stretch">
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
      <div className="hidden w-full items-start md-lg:inline-flex justify-between gap-8 self-stretch px-6 pt-4 pb-2 lg:inline-flex">
        {/* Flight details - Right */}
        <FlightDetailsSection
          departureTime={departureTime}
          arrivalTime={arrivalTime}
          duration={duration}
          airline={airline}
          flightInfo={flightInfo}
        />

        {/* Vertical divider */}
        <div className="bg-Gray-N100 relative h-40 w-[1px]" />

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
