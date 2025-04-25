"use client"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Sort, Setting5, CloseCircle } from "iconsax-react"
import React, { use, useState } from "react"
import { FlightFilters } from "@/components/FlightFilters"
import { FlightSearchHeader } from "@/components/FlightSearchHeader/FlightSearchHeader"
import NoTicketFound from "@/components/FlightsPage/NoTicketFound"
import Timeline from "@/components/FlightsPage/price-timeline"
import { Checkbox } from "@/components/ui/checkbox"
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"
import { getCityByCode } from "@/config/cities"
import { formatDate } from "@/utils/dateUtils"
import { englishToFarsiNumber } from "@/utils/numbers"
import { FlightResultsList } from "./FlightResultsList"

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

  // Shared filters state
  const [filters, setFilters] = React.useState({
    ticketType: {
      charter: true,
      system: false,
    },
    cabinClass: {
      economy: true,
      business: false,
    },
    airlines: {
      mahan: false,
      caspian: false,
      ata: false,
    },
    agencies: {
      alibaba: false,
      flytoday: false,
      mrbilit: false,
    },
  })

  // Calculate active filters count
  const activeFiltersCount = Object.values(filters).reduce(
    (count, category) => count + Object.values(category).filter(Boolean).length,
    0
  )

  // Handler for filter changes
  const updateFilter = (category: string, key: string, value: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const clearFilters = () => {
    setFilters({
      ticketType: { charter: false, system: false },
      cabinClass: { economy: false, business: false },
      airlines: { mahan: false, caspian: false, ata: false },
      agencies: { alibaba: false, flytoday: false, mrbilit: false },
    })
  }

  // Flight time and price ranges
  const [flightTimeRange, setFlightTimeRange] = useState<[number, number]>([4, 24])
  const [priceRange, setPriceRange] = useState<[number, number]>([500000, 5000000])

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
        base_redirect_url:"https://www.alibaba.ir/flights/AWZ-THR?adult={adult_count}&child={child_count}&infant={infant_count}&departing=1404-02-09",
        one_adult_redirect_url:"https://www.alibaba.ir/flights/AWZ-THR/wj1cf4r/passengers",
        two_Adults_redirect_url:"https://www.alibaba.ir/flights/AWZ-THR/mtbv5go/passengers"
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
        base_redirect_url:"https://www.alibaba.ir/flights/AWZ-THR?adult={adult_count}&child={child_count}&infant={infant_count}&departing=1404-02-09",
        one_adult_redirect_url:"https://www.alibaba.ir/flights/AWZ-THR/wj1cf4r/passengers",
        two_Adults_redirect_url:"https://www.alibaba.ir/flights/AWZ-THR/jb1bsc/passengers"
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
        base_redirect_url:"https://www.alibaba.ir/flights/AWZ-THR?adult={adult_count}&child={child_count}&infant={infant_count}&departing=1404-02-09",
        one_adult_redirect_url:"https://www.alibaba.ir/flights/AWZ-THR/wj1cf4r/passengers",
        two_Adults_redirect_url:"https://www.alibaba.ir/flights/AWZ-THR/jb1bsc/passengers"
      },
      otherSellersCount: 2,
    },
  ]

  const sampleFlights1 = [{}]

  // Sort options
  const sortOptions = [
    { key: "cheapest" as const, label: "ارزان‌ترین" },
    { key: "mostExpensive" as const, label: "گران‌ترین" },
    { key: "earliest" as const, label: "نزدیک‌ترین" },
    { key: "latest" as const, label: "دیر‌ترین" },
  ]

  // Get current sort label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find((option) => option.key === sortKey)
    return option?.label || "ارزان‌ترین"
  }

  // Sort flights based on selected sort key, safely handling empty/incomplete objects
  const sortedFlights = [...sampleFlights]
    .filter((f) => f && f.id)
    .sort((a, b) => {
      const priceA = a.price?.amount || 0
      const priceB = b.price?.amount || 0
      const depTimeA = a.departureTime || ""
      const depTimeB = b.departureTime || ""

      switch (sortKey) {
        case "cheapest":
          return priceA - priceB
        case "mostExpensive":
          return priceB - priceA
        case "earliest":
          return depTimeA.localeCompare(depTimeB)
        case "latest":
          return depTimeB.localeCompare(depTimeA)
        default:
          return 0
      }
    })

  return (
    <div className="bg-Gray/N100 mb-8 flex min-h-screen flex-col">
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

      {/* Main content */}
      <div className="container mx-auto max-w-266 p-0 lg:px-4 lg:py-6">
        {sortedFlights.length > 0 ? (
          <>
            {/* Timeline component from HEAD branch */}
            <div className="mb-0 lg:mb-8">
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

            <div className="mb-6 hidden flex-row items-start justify-between lg:flex">
              <p className="text-Gray-N800 hidden text-right text-sm font-semibold lg:block">
                {sortedFlights.length} نتیجه
              </p>

              {/* desktop sort */}
              <div className="hidden flex-row items-center justify-end gap-3 lg:flex">
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

            {/* mobile sort and filter options */}
            <div className="flex items-center justify-start px-5 my-4 lg:hidden">
              {/* Mobile sort drawer trigger */}
              <Drawer>
                <DrawerTrigger asChild>
                  <div className="bg-Shade-White outline-Gray-N100 inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]">
                    <Sort size="16" color="#1E1E1E" />
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-Gray-N700 text-sm leading-normal font-medium"> مرتب سازی: </div>
                      <div className="text-Gray-N700 text-sm leading-normal font-medium">
                        {sortKey ? getCurrentSortLabel() : " ارزان‌ترین "}
                      </div>
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
                        <div className="flex-1"></div>
                      </div>
                    </DialogTitle>
                    {/* Sort Options */}
                    <div className="bg-Shade-White flex max-h-[calc(80vh-60px)] flex-col items-center justify-center self-stretch overflow-y-auto px-5">
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

              {/* Mobile filter drawer trigger */}
              <Drawer>
                <DrawerTrigger asChild>
                  <div data-layer="Chip" data-filled="False" data-l-icon="true" data-r-icon="true" data-size="Small" data-states="Default" data-type="Deletable" className="Chip h-8 px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 inline-flex justify-center items-center gap-1 overflow-hidden cursor-pointer mr-1">

                    <div data-layer="L icon" className="LIcon size- py-1 flex justify-start items-center gap-2">
                      <Setting5 size="16" color="#1E1E1E" />
                    </div>
                    <div data-layer="Container - Values" className="ContainerValues size- flex justify-center items-center gap-1">
                      <div data-layer="برچسب" className="justify-start text-Gray-N700 text-sm font-medium leading-normal">فیلتر‌ها</div>
                    </div>
                    <div data-layer="Delete" className="Delete size- py-1 flex justify-start items-center gap-2">
                      {activeFiltersCount > 0 && (
                        <div data-layer="Badge" data-color="Blue" data-fixed-with="No" data-show-icon="true" data-size="Small" data-type="Solid color" data-value-type="Number" className="Badge size- min-w-5 px-1.5 py-0.5 bg-Primary-P500main rounded-[48px] flex justify-center items-center overflow-hidden">
                          <div data-layer="1" className="flex-1 min-w-2 text-center justify-center text-Shade-White text-[11px] font-semibold leading-none">{englishToFarsiNumber(activeFiltersCount)}</div>
                        </div>
                      )}
                    </div>
                 
                  </div>
                </DrawerTrigger>
                <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh]">
                  <div className="inline-flex h-full w-full flex-col items-start justify-start max-h-[80vh]">
                    <DialogTitle className="bg-Shade-White border-Gray-N100 inline-flex items-center self-stretch border-b px-5 py-4 sticky top-0 z-10">
                      <div className="self-stretch inline-flex justify-between items-center w-full gap-2">
                        <div
                          className={`text-Primary-P500main text-[13px] font-medium leading-normal cursor-pointer ${activeFiltersCount === 0 ? 'invisible' : ''}`}
                          onClick={clearFilters}
                        >
                          حذف فیلتر‌ها
                        </div>
                        
                        <div className="flex-1 flex justify-center items-center text-center">
                          <div className="flex justify-center items-center">
                            <div className="text-Gray-N600 text-center text-base font-semibold leading-7 ml-2">فیلتر‌ها</div>
                          </div>
                          {activeFiltersCount > 0 && (
                            <div className="size-5 bg-Primary-P50 rounded-[80px] flex justify-center items-center gap-2 ">
                              <div className="text-Primary-P500main text-[13px] font-medium leading-normal">
                                {englishToFarsiNumber(activeFiltersCount)}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-start items-center gap-2">
                          <DrawerClose className="cursor-pointer">
                            <CloseCircle size="24" color="#334155" variant="Outline" />
                          </DrawerClose>
                        </div>
                      </div>
                    </DialogTitle>
                    <div className="w-full">
                      <div className="max-h-[calc(80vh-60px)] overflow-y-auto">
                        {/* Mobile filter content */}
                        <FlightFilters
                          filters={filters}
                          updateFilter={updateFilter}
                          clearFilters={clearFilters}
                          flightTimeRange={flightTimeRange}
                          setFlightTimeRange={setFlightTimeRange}
                          priceRange={priceRange}
                          setPriceRange={setPriceRange}
                          activeFiltersCount={activeFiltersCount}
                        />
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            <div className="flex flex-row gap-4">
              {/* Flight filters sidebar */}
              <div className="hidden lg:block">
                <FlightFilters
                  filters={filters}
                  updateFilter={updateFilter}
                  clearFilters={clearFilters}
                  flightTimeRange={flightTimeRange}
                  setFlightTimeRange={setFlightTimeRange}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  activeFiltersCount={activeFiltersCount}
                />
              </div>

              {/* Flight results list */}
              <div className="flex-1">
                <FlightResultsList flights={sortedFlights} />
              </div>
            </div>
          </>
        ) : (
          <div className="container mx-auto flex max-w-266 flex-col items-center justify-center p-0 lg:px-4 lg:py-6">
            <div className="`mb-8 max-w-[1010px]">
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
            <NoTicketFound />
          </div>
        )}
      </div>
    </div>
  )
}
