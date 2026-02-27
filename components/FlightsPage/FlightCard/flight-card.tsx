"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Airplane } from "iconsax-react"
import Image from "next/image"
import React, { useState } from "react"
import { PiSuitcaseRollingLight } from "react-icons/pi"
import { twMerge } from "tailwind-merge"
import { Button } from "@/components/elements/Button/Button"
import ComparisonDialog from "@/components/FlightsPage/comparisonPage/page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { clarityTasks, recordSellerRedirect, trackClarityEvent as trackClarity } from "@/utils/clarity"
import { englishToFarsiNumber } from "@/utils/numbers"

const clarityElementTags = {
  buy: "flight-card-buy-button",
  compare: "flight-card-other-sellers-button",
} as const

const clarityEvents = {
  buy: clarityTasks.flightCardVisitProvider,
  compare: clarityTasks.flightCardOtherSellers,
} as const

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

export interface FlightCardProps extends VariantProps<typeof flightCardVariants> {
  departureTime: string
  arrivalTime: string
  origin: string
  destination: string
  duration: {
    hours: number
    minutes: number
  }
  airline: {
    name: string
    logo: string
  }
  flightInfo: {
    // aircraft: string
    baggage: string
    // ticketType: string
    cabinClass: string
  }
  price: {
    amount: number
    formattedAmount: string
    agency: string
    agency_eng?: string
    agencyLogo: string
    label?: string
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
  onBuy: () => void
  otherSellersCount?: number
  className?: string
}

// Render up to 3 seller avatars as overlapping circles (shadcn avatar group style)
const SellersAvatars = ({ websites }: { websites?: FlightCardProps["websites"] }) => {
  if (!websites || !websites.length) return null

  const sellers = websites
    .filter((site) => site.detail && (site.detail.image || site.detail.name_fa || site.detail.name))
    .slice(0, 3)

  if (!sellers.length) return null

  return (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
      {sellers.map((site, index) => {
        const displayName = site.detail?.name_fa || site.detail?.name || ""
        const initials = displayName ? displayName.slice(0, 2) : "?"

        return (
          <Avatar key={site.detail?.uid ?? `${displayName}-${index}`} className="border-Gray-N100 h-6 w-6 border">
            {site.detail?.image ? (
              <AvatarImage src={site.detail.image} alt={displayName} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
        )
      })}
    </div>
  )
}

// Format duration for display
const FormatDuration = ({ hours, minutes }: { hours: number; minutes: number }) => (
  <span>
    <span className={`text-Gray-N500 text-[12px] font-normal leading-3 ${textStyles.small} ${textStyles.normal}`}>
      {englishToFarsiNumber(hours)}{" "}
    </span>
    <span className={`text-Gray-N500 text-[12px] font-normal leading-3${textStyles.small} ${textStyles.normal}`}>
      ساعت{" "}
    </span>
    <span className={`text-Gray-N500 text-[12px] font-normal leading-3 ${textStyles.small} ${textStyles.normal}`}>
      {englishToFarsiNumber(minutes)}
    </span>
    <span className={`text-Gray-N500 text-[12px] font-normal leading-3 ${textStyles.small} ${textStyles.normal}`}>
      {" "}
      دقیقه
    </span>
  </span>
)

// Render flight route visualization component
const FlightRouteVisualization = ({ isMobile = true }: { isMobile?: boolean }) => (
  <div className="relative mx-0 flex flex-1 items-center justify-center">
    <div className="border-Gray-N300 size-1.5 rounded-[33px] border" />
    <div className="bg-Gray-N200 w-23 relative h-px flex-1" />
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
      className={`text-Gray-N600 justify-center text-right text-[12px] font-normal leading-3 ${textStyles.small} ${textStyles.normal}`}
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
      className={`text-Gray-N600 inline-flex justify-center gap-1 text-right text-[12px] font-normal leading-3 ${textStyles.small} ${textStyles.normal}`}
    >
      {text} کیلوگرم
    </div>
  </div>
)

// Render flight information badges
const FlightInfoBadges = ({ flightInfo }: { flightInfo: FlightCardProps["flightInfo"] }) => (
  <div className="inline-flex flex-wrap content-start items-start justify-start gap-2 self-stretch">
    {flightInfo.cabinClass && <InfoBadge text={flightInfo.cabinClass} />}
    {flightInfo.baggage && <BaggageBadge text={englishToFarsiNumber(flightInfo.baggage)} />}
    {/* {flightInfo.ticketType && <InfoBadge text={flightInfo.ticketType} />} */}
    {/* {flightInfo.aircraft && <InfoBadge text={flightInfo.aircraft} />} */}
  </div>
)

// Price Information Component
const PriceInfo = ({ price }: { price: FlightCardProps["price"] }) => (
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
        <div className="outline-Gray-N200 size-6 overflow-hidden rounded-[48px] bg-white outline-1 outline-offset-[-1px]">
          {price.agencyLogo && (
            <Image
              src={price.agencyLogo}
              alt={`${price.agency} logo`}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          )}
        </div>

        <div className="inline-flex flex-col items-start justify-center gap-1">
          <div
            className={`text-Gray-N600 justify-start self-stretch text-right text-[15px] ${textStyles.normal} ${textStyles.normal}`}
          >
            {price.agency}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1">
        <div className="text-Gray-N700 justify-start text-right text-[17px] text-base font-semibold leading-7">
          {englishToFarsiNumber(price.formattedAmount)}
        </div>
        <div className={`text-Gray-N500 justify-start text-right ${textStyles.medium} ${textStyles.normal}`}>تومان</div>
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  origin,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  destination,
  isMobile = false,
}: Omit<FlightCardProps, "price" | "onBuy" | "otherSellersCount" | "className" | "intent"> & {
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
              {englishToFarsiNumber(departureTime)}
            </time>
            <FlightRouteVisualization isMobile={true} />
            <time
              className={`text-Gray-N800 flex-1 justify-start text-center ${textStyles.large} ${textStyles.semibold}`}
            >
              {englishToFarsiNumber(arrivalTime)}
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
      <div className="inline-flex items-center justify-end gap-2 self-stretch">
        {/* Airline logo and name */}
        <div className="inline-flex flex-col items-center justify-center gap-2">
          <div className="border-Gray-N200 relative size-11 overflow-hidden rounded-[48px] border">
            <Image src={airline.logo} alt={`${airline.name} logo`} fill className="rounded-[50px] object-contain" />
          </div>
          <div className={`text-Gray-N600 justify-start text-right text-[13px] ${textStyles.semibold}`}>
            {airline.name}
          </div>
        </div>
        <div className="inline-flex flex-1 flex-col items-start justify-center">
          <div className="inline-flex items-center justify-start self-stretch">
            <time className={`text-Gray-N800 flex-1 justify-start text-center ${textStyles.xl} ${textStyles.semibold}`}>
              {englishToFarsiNumber(departureTime)}
            </time>
            <FlightRouteVisualization isMobile={false} />
            <time className={`text-Gray-N800 flex-1 justify-start text-center ${textStyles.xl} ${textStyles.semibold}`}>
              {englishToFarsiNumber(arrivalTime)}
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

export function FlightCard({
  departureTime,
  arrivalTime,
  duration,
  airline,
  flightInfo,
  price,
  intent,
  websites,
  onBuy,
  otherSellersCount = 0,
  className,
  destination,
  origin,
}: FlightCardProps) {
  const [showComparison, setShowComparison] = useState(false)
  const handleBuyClick = () => {
    void trackClarity(clarityEvents.buy, {
      provider: price.agency,
      provider_eng: price.agency_eng,
      origin,
      destination,
      route: `${origin}-${destination}`,
      button: "primary",
    })
    void recordSellerRedirect(price.agency_eng || price.agency, {
      provider_fa: price.agency,
      origin,
      destination,
      redirect_url: price.base_redirect_url,
      price: price.amount,
    })
    onBuy()
  }
  const handleComparisonClick = () => {
    void trackClarity(clarityEvents.compare, {
      provider: price.agency,
      provider_eng: price.agency_eng,
      origin,
      destination,
      other_sellers: otherSellersCount,
      route: `${origin}-${destination}`,
    })
    setShowComparison(true)
  }

  // Price and Action Section (Left Section in Desktop)
  const PriceActionSection = ({
    price,
    otherSellersCount = 0,
    isMobile = false,
    websites,
  }: Pick<FlightCardProps, "price" | "otherSellersCount" | "websites"> & {
    isMobile?: boolean
  }) => {
    if (isMobile) {
      return (
        <div className="flex flex-col items-start justify-start gap-2 self-stretch">
          <div className="flex flex-col items-center justify-center gap-3 self-stretch">
            <PriceInfo price={price} />

            <div className="flex flex-col items-start justify-start gap-2 self-stretch">
              <Button
                intent="primary"
                size="small"
                className="self-stretch"
                data-clarity-element="redirect-to-seller"
                onClick={handleBuyClick}
              >
                رفتن به {price.agency}
              </Button>

              <Button
                intent="text"
                size="small"
                className="text-Gray-N700 self-stretch rounded-xl bg-[#F5F5F7] transition hover:bg-[#EDEDEF]"
                data-clarity-element={clarityElementTags.compare}
                onClick={handleComparisonClick}
              >
                <span className="flex items-center justify-center gap-2 py-2 font-medium">
                  <span>
                    {otherSellersCount > 1
                      ? `مشاهده ${englishToFarsiNumber(otherSellersCount - 1)} فروشنده دیگر`
                      : "مشاهده جزئیات"}
                  </span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="-mx-3 inline-flex w-[290px] flex-col items-start justify-start gap-2 px-2 md:w-[300px]">
        <div className="flex flex-col items-center justify-center gap-3 self-stretch">
          <PriceInfo price={price} />

          <div className="flex flex-col items-start justify-start gap-2 self-stretch">
            <Button
              intent="primary"
              size="small"
              className="self-stretch"
              data-clarity-element="redirect-to-seller"
              onClick={handleBuyClick}
            >
              رفتن به {price.agency}
            </Button>

            <Button
              intent="text"
              size="small"
              className="text-Gray-N700 mb-2 self-stretch rounded-xl bg-[#F5F5F7] py-2 transition hover:bg-[#EDEDEF]"
              data-clarity-element={clarityElementTags.compare}
              onClick={handleComparisonClick}
            >
              <span
                className={`flex items-center justify-center gap-2 font-medium ${otherSellersCount > 1 ? "" : "py-1"} `}
              >
                <span>
                  {otherSellersCount > 1
                    ? `مشاهده ${englishToFarsiNumber(otherSellersCount - 1)} فروشنده دیگر`
                    : "مشاهده جزئیات"}
                </span>

                {otherSellersCount > 1 && <SellersAvatars websites={websites} />}
              </span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <article className={twMerge(flightCardVariants({ intent, className }))}>
      {/* Mobile/Tablet Layout */}
      <div className="flex flex-col lg:hidden md-lg:hidden">
        <div
          data-layer="Frame 1000002364"
          className="bg-Shade-White outline-Gray-N200 inline-flex flex-col items-center justify-center gap-3 self-stretch overflow-hidden rounded-xl px-4 pb-2 pt-4 outline-1 outline-offset-[-1px]"
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
                <time className="text-Gray-N800 flex-1 justify-start text-center text-lg font-semibold leading-loose">
                  {englishToFarsiNumber(arrivalTime)}
                </time>

                <FlightRouteVisualization isMobile={true} />

                <time className="text-Gray-N800 flex-1 justify-start text-center text-lg font-semibold leading-loose">
                  {englishToFarsiNumber(departureTime)}
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
              <div className="text-Gray-N600 justify-start text-right text-[12px] font-semibold leading-none">
                {airline.name}
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
            {/* {flightInfo.ticketType && <InfoBadge text={flightInfo.ticketType} />} */}
            {/* {flightInfo.aircraft && <InfoBadge text={flightInfo.aircraft} />} */}
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
                {price.label && (
                  <div className="flex w-full items-center justify-start gap-1">
                    <div className="text-Gray-N500 justify-center self-stretch text-right text-[10px] font-normal leading-3">
                      {price.label}
                    </div>
                    <div className="text-Gray-N600 justify-start self-stretch text-right text-[11px] font-normal leading-none">
                      در
                    </div>
                  </div>
                )}

                <div
                  data-layer="Frame 1000002410"
                  className="mb-0.5 mt-1 inline-flex flex-row-reverse items-center justify-between self-stretch"
                >
                  <div data-layer="Frame 1000002342" className="flex flex-row-reverse items-center justify-end gap-1">
                    <div className="text-Gray-N500 justify-start text-right text-[11px] font-normal leading-none">
                      تومان
                    </div>
                    <div className="text-Gray-N700 justify-start text-right text-base font-semibold leading-7">
                      {englishToFarsiNumber(price.formattedAmount)}
                    </div>
                  </div>
                  <div data-layer="Frame 1000002408" className="flex flex-row-reverse items-center justify-end gap-2">
                    <div className="inline-flex flex-col items-end justify-center gap-1">
                      <div
                        className={`text-Gray-N600 justify-start self-stretch text-right text-[12px] font-semibold leading-none`}
                      >
                        {price.agency}
                      </div>
                    </div>
                    <div className="outline-Gray-N200 flex size-8 items-center justify-center overflow-hidden rounded-[48px] bg-white outline-1 outline-offset-[-1px]">
                      {price.agencyLogo && (
                        <Image
                          src={price.agencyLogo}
                          alt={`${price.agency} logo`}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      )}
                    </div>

                    <div className="inline-flex flex-col items-end justify-center gap-1"></div>
                  </div>
                </div>
              </div>

              <div data-layer="Frame 1000002404" className="flex flex-col items-start justify-start gap-2 self-stretch">
                <Button
                  intent="primary"
                  size="small"
                  className="self-stretch px-5 py-3.5"
                  data-clarity-element="redirect-to-seller"
                  onClick={handleBuyClick}
                >
                  رفتن به {price.agency}
                </Button>

                <Button
                  intent="text"
                  size="small"
                  className="text-Gray-N700 mb-2 self-stretch rounded-xl bg-[#F5F5F7] py-2 transition hover:bg-[#EDEDEF]"
                  data-clarity-element={clarityElementTags.compare}
                  onClick={handleComparisonClick}
                >
                  <span
                    className={`flex items-center justify-center gap-2 font-medium ${
                      otherSellersCount > 1 ? "" : "py-1"
                    } `}
                  >
                    <span>
                      {otherSellersCount > 1
                        ? `مشاهده ${englishToFarsiNumber(otherSellersCount - 1)} فروشنده دیگر`
                        : "مشاهده جزئیات"}
                    </span>

                    {otherSellersCount > 1 && <SellersAvatars websites={websites} />}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden w-full items-start justify-between gap-8 self-stretch px-6 pb-2 pt-4 lg:inline-flex md-lg:inline-flex">
        {/* Flight details - Right */}
        <FlightDetailsSection
          departureTime={departureTime}
          arrivalTime={arrivalTime}
          duration={duration}
          airline={airline}
          flightInfo={flightInfo}
          websites={websites}
          origin={origin}
          destination={destination}
        />

        {/* Vertical divider */}
        <div className="bg-Gray-N100 h-45 relative w-[1px]" />

        {/* Price and action section - Left */}
        <PriceActionSection price={price} otherSellersCount={otherSellersCount} websites={websites} />
      </div>
      {showComparison && (
        <ComparisonDialog
          open={showComparison}
          onOpenChange={setShowComparison}
          departureTime={departureTime}
          arrivalTime={arrivalTime}
          origin={origin}
          destination={destination}
          duration={duration}
          airline={airline}
          flightInfo={flightInfo}
          websites={websites}
        />
      )}
    </article>
  )
}
