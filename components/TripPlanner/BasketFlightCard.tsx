"use client"

import { Airplane } from "iconsax-react"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import React from "react"

import type { BasketFlightItem } from "@/app/types/basket"
import { Button } from "@/components/elements/Button/Button"
import { englishToFarsiNumber } from "@/utils/numbers"

type BasketFlightCardProps = {
  item: BasketFlightItem
  onRemove: (id: string) => void
  onRedirect: (url: string) => void
}

const FormatDuration = ({ hours, minutes }: { hours: number; minutes: number }) => (
  <span className="text-Gray-N500 font-anjoman-max text-[12px] leading-3 font-normal">
    {englishToFarsiNumber(hours)} ساعت {englishToFarsiNumber(minutes)} دقیقه
  </span>
)

const FlightRouteVisualization = () => (
  <div className="relative mx-0 flex flex-1 items-center justify-center">
    <div className="border-Gray-N300 size-1.5 rounded-[33px] border" />
    <div className="bg-Gray-N200 relative h-px w-16 flex-1" />
    <div className="bg-Gray-N300 size-1.5 rounded-[2px]" />
    <div className="absolute size-3 origin-top-left -rotate-90" style={{ left: "28px", top: "7px" }}>
      <Airplane size="16" color="#748297" variant="Bold" />
    </div>
  </div>
)

export function BasketFlightCard({ item, onRemove, onRedirect }: BasketFlightCardProps) {
  return (
    <article
      className="bg-Shade-White outline-Gray-N200 flex flex-col gap-3 overflow-hidden rounded-xl px-4 py-3 outline-1 outline-offset-[-1px]"
      dir="rtl"
    >
      {/* Flight Info Section */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col gap-2">
          {/* Time and Route */}
          <div className="flex items-center justify-start">
            <time className="text-Gray-N800 font-anjoman-max flex-1 text-center text-lg leading-loose font-semibold">
              {englishToFarsiNumber(item.departureTime)}
            </time>
            <FlightRouteVisualization />
            <time className="text-Gray-N800 font-anjoman-max flex-1 text-center text-lg leading-loose font-semibold">
              {englishToFarsiNumber(item.arrivalTime)}
            </time>
          </div>

          {/* Duration */}
          <div className="flex justify-center">
            <FormatDuration hours={item.duration.hours} minutes={item.duration.minutes} />
          </div>
        </div>

        {/* Airline Logo and Name */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="border-Gray-N200 relative size-9 overflow-hidden rounded-full border">
            <Image src={item.airline.logo} alt={`${item.airline.name} logo`} fill className="object-contain" />
          </div>
          <div className="text-Gray-N600 font-anjoman-max text-[11px] leading-none font-semibold">
            {item.airline.name}
          </div>
        </div>
      </div>

      {/* Flight Info Badges */}
      <div className="flex flex-wrap items-start justify-start gap-2">
        {item.flightInfo.cabinClass && (
          <div className="bg-Gray-N50 outline-Gray-N100 flex items-center justify-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-1 outline-[1.18px] outline-offset-[-1.18px]">
            <span className="text-Gray-N600 font-anjoman-max text-[12px] leading-3 font-normal">
              {item.flightInfo.cabinClass}
            </span>
          </div>
        )}
        {item.flightInfo.baggage && (
          <div className="bg-Gray-N50 outline-Gray-N100 flex items-center justify-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-1 outline-[1.18px] outline-offset-[-1.18px]">
            <span className="text-Gray-N600 font-anjoman-max text-[12px] leading-3 font-normal">
              {englishToFarsiNumber(item.flightInfo.baggage)} کیلوگرم
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="bg-Gray-N100 h-px w-full" />

      {/* Price and Actions */}
      <div className="flex flex-col gap-3">
        {/* Price Info */}
        <div className="bg-Gray-N50 outline-Gray-N200 flex items-center justify-between rounded-lg px-3 py-2 outline-1 outline-offset-[-1px]">
          <div className="flex items-center gap-2">
            <div className="outline-Gray-N200 size-6 overflow-hidden rounded-full bg-white outline-1 outline-offset-[-1px]">
              {item.price.agencyLogo && (
                <Image
                  src={item.price.agencyLogo}
                  alt={`${item.price.agency} logo`}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
              )}
            </div>
            <span className="text-Gray-N600 font-anjoman-max text-[15px] font-normal">{item.price.agency}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-Gray-N700 font-anjoman-max text-base leading-7 font-semibold">
              {englishToFarsiNumber(item.price.formattedAmount)}
            </span>
            <span className="text-Gray-N500 font-anjoman-max text-[11px] leading-none font-normal">تومان</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            intent="primary"
            size="small"
            className="flex-1"
            onClick={() => onRedirect(item.price.base_redirect_url)}
          >
            رفتن به {item.price.agency}
          </Button>

          <button
            onClick={() => onRemove(item.id)}
            className="bg-Error-E50 text-Error-E500main hover:bg-Error-E100 focus:ring-Error-E500main flex items-center justify-center rounded-lg px-3 py-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-label="حذف از سبد"
          >
            <Trash2 size={20} className="shrink-0" />
          </button>
        </div>
      </div>
    </article>
  )
}
