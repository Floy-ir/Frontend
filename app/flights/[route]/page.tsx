"use client"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState, use } from "react"
import { getCityByCode } from "@/config/cities"
import { formatDate } from "@/utils/dateUtils"
import { FlightSearchHeader } from "@/components/FlightSearchHeader/FlightSearchHeader"
import { FlightResultsList } from "./FlightResultsList"
import { Button } from "@/components/ui/button"
import { FlightFilters } from "@/components/FlightFilters"
import Timeline from "@/components/FlightsPage/price-timeline"
import { ArrowUp2, Sort } from "iconsax-react"
import { DialogTitle } from "@radix-ui/react-dialog"

type RouteParams = {
  params: Promise<{
    route: string
  }>
  searchParams: Promise<{
    adult?: string
    child?: string
    infant?: string
    departing?: string
  }>
}

export default function FlightResults({ params, searchParams }: RouteParams) {
  // Unwrap params Promise using React.use()
  const unwrappedParams = use(params)
  // Unwrap searchParams Promise using React.use()
  const unwrappedSearchParams = use(searchParams)
  
  // Parse route from URL (format: THR-MHD)
  const [originCode, destinationCode] = unwrappedParams.route.split("-")
  
  // Get city names from codes
  const originCity = getCityByCode(originCode || "")?.label || originCode || ""
  const destinationCity = getCityByCode(destinationCode || "")?.label || destinationCode || ""

  // Get passenger counts and date from URL
  const adult = parseInt(unwrappedSearchParams.adult || "1")
  const child = parseInt(unwrappedSearchParams.child || "0")
  const infant = parseInt(unwrappedSearchParams.infant || "0")
  const passengerCount = adult + child + infant
  const departureDate = unwrappedSearchParams.departing || formatDate(new Date())

  // For timeline component - ensure it's always a string
  const selectedDate = unwrappedSearchParams.departing || formatDate(new Date())

  // State for sorting
  const [sortKey, setSortKey] = React.useState<"cheapest" | "mostExpensive" | "earliest" | "latest">("cheapest")

  // Sample flight data for demonstration
  const sampleFlights = [
    {
      id: "1",
      departureTime: "۱۱:۳۰",
      arrivalTime: "۰۹:۳۰",
      duration: { hours: 1, minutes: 30 },
      airline: {
        name: "آتا",
        logo: "/images/logo.webp",
      },
      flightInfo: {
        aircraft: "Boeing 737-300",
        baggage: "۲۰ kg",
        ticketType: "سیستمی",
        cabinClass: "اکونومی",
      },
      price: {
        amount: 3534678,
        formattedAmount: "3,534,678",
        agency: "علی بابا",
        agencyLogo: "/images/logo.webp",
        label: "ارزان‌ترین",
      },
      otherSellersCount: 3,
    },
    {
      id: "2",
      departureTime: "۱۳:۴۵",
      arrivalTime: "۱۵:۱۵",
      duration: { hours: 1, minutes: 30 },
      airline: {
        name: "ایران ایر",
        logo: "/images/logo.webp",
      },
      flightInfo: {
        aircraft: "Airbus A320",
        baggage: "۲۵ kg",
        ticketType: "چارتری",
        cabinClass: "اکونومی",
      },
      price: {
        amount: 3689000,
        formattedAmount: "3,689,000",
        agency: "فلای تودی",
        agencyLogo: "/images/logo.webp",
        label: "ارزان‌ترین",
      },
      otherSellersCount: 5,
    },
    {
      id: "3",
      departureTime: "۱۷:۲۰",
      arrivalTime: "۱۸:۵۰",
      duration: { hours: 1, minutes: 30 },
      airline: {
        name: "آسمان",
        logo: "/images/logo.webp",
      },
      flightInfo: {
        aircraft: "Boeing 737-400",
        baggage: "۲۰ kg",
        ticketType: "سیستمی",
        cabinClass: "بیزینس",
      },
      price: {
        amount: 4150000,
        formattedAmount: "4,150,000",
        agency: "مستر بلیط",
        agencyLogo: "/images/logo.webp",
        label: "ارزان‌ترین",
      },
      otherSellersCount: 2,
    },
  ]

  // Sort options
  const sortOptions = [
    { key: "cheapest" as const, label: "ارزان‌ترین" },
    { key: "mostExpensive" as const, label: "گران‌ترین" },
    { key: "earliest" as const, label: "نزدیک‌ترین" },
    { key: "latest" as const, label: "دیر‌ترین" },
  ]

  // Get current sort label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find(option => option.key === sortKey)
    return option?.label || "ارزان‌ترین"
  }

  // Sort flights based on selected sort key
  const sortedFlights = [...sampleFlights].sort((a, b) => {
    switch (sortKey) {
      case "cheapest":
        return a.price.amount - b.price.amount
      case "mostExpensive":
        return b.price.amount - a.price.amount
      case "earliest":
        return a.departureTime.localeCompare(b.departureTime)
      case "latest":
        return b.departureTime.localeCompare(a.departureTime)
      default:
        return 0
    }
  })

  return (
    <div className="bg-Gray/N100 flex min-h-screen flex-col mb-8">
      {/* Search header */}
      <FlightSearchHeader
        originCity={originCity}
        destinationCity={destinationCity}
        date={departureDate}
        passengerCount={passengerCount}
        originCode={originCode || ""}
        destinationCode={destinationCode || ""}
        adult={adult}
        child={child}
        infant={infant}
      />
      <div className="bg-Shade-White flex w-full flex-row-reverse items-center justify-center gap-2 px-4 py-3 md:hidden">
        {/* mobile sort */}
        <Drawer>
          <DrawerTrigger asChild>
            <div className="bg-Shade-White flex flex-1 items-center justify-center gap-[7px]">
              <div className="flex items-center justify-start gap-2 py-1">
                <Sort size="16" color="#1E1E1E" />
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-Gray-N700 text-sm leading-normal font-medium">
                  {getCurrentSortLabel()}
                </div>
              </div>
              <div className="flex items-center justify-start py-1">
                <ArrowUp2 size="12" color="#1E1E1E" className="rotate-180" />
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent className="bg-Shade-White rounded-t-2xl">
            <div className="inline-flex h-full w-full flex-col items-start justify-start">
              <DialogTitle className="bg-Shade-White border-Gray-N100 inline-flex items-center justify-center self-stretch border-b px-5 py-4">
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-Gray-N600 text-right text-base leading-7 font-semibold">ترتیب نمایش</div>
                  </div>
                </div>
              </DialogTitle>
              {/* Sort Options */}
              <div className="bg-Shade-White flex flex-col items-center justify-center self-stretch px-5">
                {sortOptions.map(({ key, label }) => (
                  <div key={key} className="flex w-full flex-col items-center justify-center gap-4 py-3">
                    <label className="flex w-full cursor-pointer items-center justify-start gap-2">
                      <Checkbox
                        checked={sortKey === key}
                        onCheckedChange={() => {
                          setSortKey(key)
                          const drawer = document.querySelector("[data-state=open]") as HTMLElement
                          if (drawer) drawer.click()
                        }}
                        className="data-[state=checked]:bg-Primary-P500main data-[state=checked]:border-Primary-P500main rounded-full"
                      />
                      <span className="text-Gray-N700 text-sm font-medium">{label}</span>
                    </label>
                    <div className="bg-Gray-N100 h-px w-full" />
                  </div>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Divider */}
        <div className="bg-Gray-N200 h-full w-px rounded-[33px]" />

        {/* Filter section */}
        <div className="flex flex-1 items-center justify-center gap-[7px]">فیلتر‌ها</div>
      </div>
      {/* Main content */}
      <div className="container mx-auto max-w-266 p-0 md:px-4 md:py-6">
        {/* Timeline component from HEAD branch */}
        <div className="mb-6">
          <Timeline
            originCityCode={originCode || ""}
            destinationCityCode={destinationCode || ""}
            selectedDate={selectedDate}
            adult={String(adult)}
            child={String(child)}
            infant={String(infant)}
            autoScrollToSelected={true}
          />
        </div>

        <div className="mb-8 flex flex-row items-center justify-between px-3 md:px-0">
          <p className="text-Gray-N800 text-right text-sm font-semibold">۳ نتیجه</p>
          {/* desktop sort */}
          <div className="hidden flex-row items-center justify-end gap-3 md:flex">
            {sortOptions.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className={`flex items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] ${
                  sortKey === key
                    ? "bg-Primary-P50 text-Primary-P500main outline-Primary-P500main font-semibold"
                    : "bg-Shade-White text-Gray-N700 outline-Gray-N100 font-medium"
                }`}
              >
                <span className="text-sm leading-normal">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-row gap-4">
          {/* Flight filters sidebar */}
          <div className="hidden lg:block">
            <FlightFilters />
          </div>

          {/* Flight results list */}
          <div className="flex-1">
            <FlightResultsList flights={sortedFlights} />
          </div>
        </div>
      </div>
    </div>
  )
}
