"use client"

import { CloseCircle, Setting5 } from "iconsax-react"
import Image from "next/image"
import React, { useState } from "react"
import { Airline, Website } from "@/app/types/flight"
import { FancySlider } from "@/components/ui/fancy-slider"
import { englishToFarsiNumber } from "@/utils/numbers"

// Filter section with expandable header
const FilterSection = ({
  title,
  children,
  count = 0,
  isOpen = true,
  isLast = false,
}: {
  title: string
  children: React.ReactNode
  count?: number
  isOpen?: boolean
  isLast?: boolean
}) => {
  const [expanded, setExpanded] = React.useState(isOpen)

  return (
    <div className="flex flex-col items-start justify-start gap-4 self-stretch">
      <div
        className="flex cursor-pointer items-center justify-between gap-[7px] self-stretch"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="text-Gray-N600 text-sm leading-normal font-semibold">{title}</div>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <div className="bg-Primary-P50 flex h-5 w-10 items-center justify-center rounded-[80px]">
              <div className="text-Primary-P500main text-[13px] leading-normal font-medium">
                {englishToFarsiNumber(count)}
              </div>
            </div>
          )}
          <div className="flex-shrink-0">
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            >
              <path d="M1 1L6 6L11 1" stroke="#384250" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && children}

      {!isLast && <div className="bg-Gray-N100 h-px self-stretch" />}
    </div>
  )
}

// Checkbox component for filters
const FilterCheckbox = ({
  label,
  checked,
  onChange,
  logo,
  extraText,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  logo?: string
  extraText?: string
}) => (
  <div className="inline-flex items-center justify-end gap-2 self-stretch">
    <div className="flex items-center justify-center gap-2 p-[3px]">
      <div
        className={`relative flex size-[18px] items-center justify-center overflow-hidden rounded-sm ${
          checked ? "bg-Primary-P500main" : "outline-Gray-N300 outline-1 outline-offset-[-1px]"
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
    {logo && (
      <div className="flex items-center justify-start gap-2 self-stretch">
        <div className="border-Gray-N200 size-8 overflow-hidden rounded-full border">
          <Image src={logo} alt={label} width={32} height={32} className="rounded-full object-cover" />
        </div>
      </div>
    )}

    <div className="inline-flex flex-1 flex-col items-end justify-start gap-1">
      <div className="text-Gray-N700 self-stretch text-right text-sm leading-normal font-medium">{label}</div>
    </div>
    {extraText && (
      <div className="text-Gray-N500 text-right text-[13px] leading-none font-normal">
        {englishToFarsiNumber(extraText)}
      </div>
    )}
  </div>
)

// Range slider for price and time filters
const _RangeSlider = ({ minValue, maxValue }: { minValue: number; maxValue: number }) => {
  return (
    <div className="flex flex-col items-center justify-start gap-1 self-stretch py-3">
      <div className="relative inline-flex items-center justify-center self-stretch py-2">
        <div className="bg-Gray-N100 relative h-1 flex-1 overflow-hidden rounded-sm">
          <div className="bg-Primary-P500main absolute h-1 rounded-xs" style={{ width: "95%", left: "0" }} />
        </div>
        {/* This is a simplified slider - for a real implementation, use a proper range slider component */}
      </div>
      <div className="inline-flex h-6 items-center justify-between self-stretch">
        <div className="text-Gray-N500 text-sm leading-normal font-medium">{minValue}</div>
        <div className="text-Gray-N500 text-right text-sm leading-normal font-medium">{maxValue}</div>
      </div>
    </div>
  )
}

export function FlightFilters({
  filters,
  updateFilter,
  clearFilters,
  flightTimeRange,
  setFlightTimeRange,
  priceRange,
  setPriceRange,
  activeFiltersCount,
  priceRangeBounds,
  availableSeatClasses = [],
  availableWebsites = [],
  availableAirlines = [],
}: {
  filters: {
    ticketType: {
      charter: boolean
      system: boolean
    }
    cabinClass: {
      economy: boolean
      business: boolean
      premiumEconomy: boolean
    }
    airlines: Record<string, boolean>
    agencies: Record<string, boolean>
  }
  updateFilter: (category: string, key: string, value: boolean) => void
  clearFilters: () => void
  flightTimeRange: [number, number]
  setFlightTimeRange: (range: [number, number]) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  activeFiltersCount: number
  priceRangeBounds: [number, number]
  availableSeatClasses?: string[]
  availableWebsites?: Website[]
  availableAirlines?: Airline[]
}) {
  // Check if component is rendered in a drawer
  const [isInDrawer, setIsInDrawer] = useState(false)

  // Set drawer state on component mount
  React.useEffect(() => {
    const checkIfInDrawer = () => {
      const isSmallScreen = window.innerWidth < 1024
      const drawerContent = document.querySelector(".drawer-content")
      const isInDrawerContent = drawerContent?.contains(document.querySelector(".self-stretch.px-5.py-4")) || false
      setIsInDrawer(isSmallScreen || isInDrawerContent)
    }

    // Run check after a small delay to ensure DOM is ready
    setTimeout(checkIfInDrawer, 0)
    window.addEventListener("resize", checkIfInDrawer)

    return () => window.removeEventListener("resize", checkIfInDrawer)
  })

  // Format price with commas
  const formatPrice = (price: number) => {
    return englishToFarsiNumber(price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  }

  // Format time as HH:MM
  const formatTime = (hour: number) => {
    return englishToFarsiNumber(`${hour.toString().padStart(2, "0")}:00`)
  }

  // Helper to format price for display in filter options
  const formatMinPrice = (price?: number) => {
    if (!price) return ""
    return `از ${englishToFarsiNumber(Math.floor(price).toLocaleString())}`
  }

  // Filter chips component
  const FilterChips = () => {
    if (activeFiltersCount === 0) return null

    return (
      <div className="bg-Shade-White border-Gray-N100 inline-flex items-center justify-center gap-3 self-stretch border-b px-5 py-3">
        <div className="flex flex-1 flex-wrap items-center justify-end gap-[7px]">
          {/* Ticket Type Filters */}
          {/*Object.values(filters.ticketType).some(Boolean) && (
            <div className="bg-Primary-P50 outline-Primary-P500main flex items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline outline-2 outline-offset-[-2px]">
              <div
                className="flex cursor-pointer items-center justify-start gap-2 py-1"
                onClick={() => updateFilter("ticketType", "all", false)}
              >
                <div className="relative size-4 overflow-hidden rounded-[48px]">
                  <CloseCircle size="16" color="#0046B5" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-Primary-P500main text-sm leading-normal font-medium">
                  نوع بلیط:{" "}
                  {[filters.ticketType.charter ? "چارتر" : null, filters.ticketType.system ? "سیستمی" : null]
                    .filter(Boolean)
                    .join("، ")}
                </div>
              </div>
            </div>
          )*/}

          {/* Cabin Class Filters */}
          {Object.values(filters.cabinClass).some(Boolean) && (
            <div className="bg-Primary-P50 outline-Primary-P500main flex items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]">
              <div
                className="flex cursor-pointer items-center justify-start gap-2 py-1"
                onClick={() => updateFilter("cabinClass", "all", false)}
              >
                <div className="relative size-4 overflow-hidden rounded-[48px]">
                  <CloseCircle size="16" color="#0046B5" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-Primary-P500main text-sm leading-normal font-medium">
                  کلاس پروازی:{" "}
                  {[
                    filters.cabinClass.economy ? "اکونومی" : null,
                    filters.cabinClass.premiumEconomy ? "اکونومی پریمیوم" : null,
                    filters.cabinClass.business ? "بیزینس" : null,
                  ]
                    .filter(Boolean)
                    .join("، ")}
                </div>
              </div>
            </div>
          )}

          {/* Airlines Filters */}
          {Object.values(filters.airlines).some(Boolean) && (
            <div className="bg-Primary-P50 outline-Primary-P500main flex items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]">
              <div
                className="flex cursor-pointer items-center justify-start gap-2 py-1"
                onClick={() => updateFilter("airlines", "all", false)}
              >
                <div className="relative size-4 overflow-hidden rounded-[48px]">
                  <CloseCircle size="16" color="#0046B5" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-Primary-P500main text-sm leading-normal font-medium">
                  ایرلاین‌ها:{" "}
                  {availableAirlines
                    .filter((airline) => filters.airlines[airline.uid])
                    .map((airline) => airline.name)
                    .join("، ")}
                </div>
              </div>
            </div>
          )}

          {/* Agencies Filters */}
          {Object.values(filters.agencies).some(Boolean) && (
            <div className="bg-Primary-P50 outline-Primary-P500main flex items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]">
              <div
                className="flex cursor-pointer items-center justify-start gap-2 py-1"
                onClick={() => updateFilter("agencies", "all", false)}
              >
                <div className="relative size-4 overflow-hidden rounded-[48px]">
                  <CloseCircle size="16" color="#0046B5" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-Primary-P500main text-sm leading-normal font-medium">
                  وبسایت‌ها:{" "}
                  {availableWebsites
                    .filter((website) => filters.agencies[website.uid])
                    .map((website) => website.name_fa)
                    .join("، ")}
                </div>
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          {(priceRange[0] !== priceRangeBounds[0] || priceRange[1] !== priceRangeBounds[1]) && (
            <div className="bg-Primary-P50 outline-Primary-P500main flex items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]">
              <div
                className="flex cursor-pointer items-center justify-start gap-2 py-1"
                onClick={() => setPriceRange(priceRangeBounds)}
              >
                <div className="relative size-4 overflow-hidden rounded-[48px]">
                  <CloseCircle size="16" color="#0046B5" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-Primary-P500main text-sm leading-normal font-medium">
                  قیمت: {englishToFarsiNumber(Math.floor(priceRange[0] / 1000))} تا{" "}
                  {englishToFarsiNumber(Math.floor(priceRange[1] / 1000))} هزار
                </div>
              </div>
            </div>
          )}

          {/* Flight Time Range Filter */}
          {(flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24) && (
            <div className="bg-Primary-P50 outline-Primary-P500main flex items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]">
              <div
                className="flex cursor-pointer items-center justify-start gap-2 py-1"
                onClick={() => setFlightTimeRange([4, 24])}
              >
                <div className="relative size-4 overflow-hidden rounded-[48px]">
                  <CloseCircle size="16" color="#0046B5" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="text-Primary-P500main text-sm leading-normal font-medium">
                  ساعت پرواز: {englishToFarsiNumber(flightTimeRange[0])} تا {englishToFarsiNumber(flightTimeRange[1])}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${
        isInDrawer ? "w-full" : "outline-Gray-N200 w-[305px] outline-1 outline-offset-[-1px]"
      } inline-flex flex-col items-start justify-start overflow-hidden rounded-2xl`}
    >
      {/* Header - hide in drawer since drawer already has a header */}
      {!isInDrawer && (
        <div className="bg-Shade-White border-Gray-N100 inline-flex h-[68px] items-center justify-center gap-3 self-stretch border-b px-5 py-3">
          <div className="flex flex-1 items-center justify-between gap-[7px]">
            <div className="flex items-center justify-center gap-1">
              <div className="flex items-center justify-start gap-2 py-1">
                <Setting5 color="#334155" size={16} className="text-Gray-N700" />
              </div>
              <div className="text-Gray-N600 text-right text-base leading-7 font-semibold">فیلتر‌ها</div>
              {activeFiltersCount > 0 && (
                <div className="bg-Primary-P50 flex size-5 items-center justify-center gap-2 rounded-[80px]">
                  <div className="text-Primary-P500main text-[13px] leading-normal font-medium">
                    {englishToFarsiNumber(activeFiltersCount)}
                  </div>
                </div>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <div className="h-5 cursor-pointer rounded-[80px]" onClick={clearFilters}>
                <div className="text-Primary-P500main text-[13px] leading-normal font-medium">حذف فیلتر‌ها</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter chips */}
      {isInDrawer && <FilterChips />}

      {/* Filter sections */}
      <div className="bg-Shade-White flex flex-col items-center justify-center gap-3 self-stretch px-5 py-4">
        {/* Departure time */}
        <FilterSection title="ساعت پرواز رفت">
          <FancySlider
            value={flightTimeRange}
            onValueChange={setFlightTimeRange}
            min={4}
            max={24}
            step={1}
            leftLabel={formatTime(flightTimeRange[1]) as string}
            rightLabel={formatTime(flightTimeRange[0]) as string}
          />
        </FilterSection>

        {/* Price range */}
        <FilterSection title="بازه قیمت (تومان)">
          <FancySlider
            value={priceRange}
            onValueChange={setPriceRange}
            min={priceRangeBounds[0]}
            max={priceRangeBounds[1]}
            step={Math.max(1, Math.floor((priceRangeBounds[1] - priceRangeBounds[0]) / 50))}
            leftLabel={formatPrice(priceRange[1]) as string}
            rightLabel={formatPrice(priceRange[0]) as string}
          />
        </FilterSection>

        {/* Ticket type */}
        {/*<FilterSection title="نوع بلیط" count={Object.values(filters.ticketType).filter(Boolean).length}>
          <FilterCheckbox
            label="چارتر"
            checked={filters.ticketType.charter}
            onChange={(v) => updateFilter("ticketType", "charter", v)}
          />
          <FilterCheckbox
            label="سیستمی"
            checked={filters.ticketType.system}
            onChange={(v) => updateFilter("ticketType", "system", v)}
          />
        </FilterSection>*/}

        {/* Cabin class */}
        <FilterSection title="کلاس پروازی" count={Object.values(filters.cabinClass).filter(Boolean).length}>
          {availableSeatClasses.includes("Economy") && (
            <FilterCheckbox
              label="اکونومی"
              checked={filters.cabinClass.economy}
              onChange={(v) => updateFilter("cabinClass", "economy", v)}
            />
          )}
          {availableSeatClasses.includes("Premium Economy") && (
            <FilterCheckbox
              label="اکونومی پریمیوم"
              checked={filters.cabinClass.premiumEconomy}
              onChange={(v) => updateFilter("cabinClass", "premiumEconomy", v)}
            />
          )}
          {availableSeatClasses.includes("Business") && (
            <FilterCheckbox
              label="بیزینس"
              checked={filters.cabinClass.business}
              onChange={(v) => updateFilter("cabinClass", "business", v)}
            />
          )}
        </FilterSection>

        {/* Websites - Dynamically generated from API data */}
        <FilterSection title="وبسایت‌ها" count={Object.values(filters.agencies).filter(Boolean).length}>
          {availableWebsites.length > 0 ? (
            availableWebsites.map((website) => (
              <FilterCheckbox
                key={website.uid}
                label={website.name_fa}
                logo={website.image || "/images/logo.webp"}
                extraText={formatMinPrice(website.min_price)}
                checked={filters.agencies[website.uid] || false}
                onChange={(v) => updateFilter("agencies", website.uid, v)}
              />
            ))
          ) : (
            <div className="text-Gray-N500 py-2 text-center text-sm">هیچ وبسایتی یافت نشد</div>
          )}
        </FilterSection>

        {/* Airlines - Dynamically generated from API data */}
        <FilterSection
          title="شرکت‌های هواپیمایی"
          count={Object.values(filters.airlines).filter(Boolean).length}
          isLast={true}
        >
          {availableAirlines.length > 0 ? (
            availableAirlines.map((airline) => (
              <FilterCheckbox
                key={airline.uid}
                label={airline.name}
                logo={airline.image || "/images/logo.webp"}
                extraText={formatMinPrice(airline.min_price)}
                checked={filters.airlines[airline.uid] || false}
                onChange={(v) => updateFilter("airlines", airline.uid, v)}
              />
            ))
          ) : (
            <div className="text-Gray-N500 py-2 text-center text-sm">هیچ ایرلاینی یافت نشد</div>
          )}
        </FilterSection>
      </div>
    </div>
  )
}
