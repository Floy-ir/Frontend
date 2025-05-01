"use client"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Sort, Setting5, CloseCircle } from "iconsax-react"
import React, { use, useState, useEffect } from "react"
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
import { FancySlider } from "@/components/ui/fancy-slider"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

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

// Define the structure for filters state
interface FilterState {
  ticketType: { charter: boolean; system: boolean };
  cabinClass: { economy: boolean; business: boolean };
  airlines: { mahan: boolean; caspian: boolean; ata: boolean };
  agencies: { alibaba: boolean; flytoday: boolean; mrbilit: boolean };
}

export default function FlightResults({ params, searchParams }: RouteParams) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  
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
  const [sortKey, setSortKey] = React.useState<"cheapest" | "mostExpensive" | "earliest" | "latest">(
    (urlSearchParams.get("sort") as "cheapest" | "mostExpensive" | "earliest" | "latest") || "cheapest"
  )

  // Parse filter values from URL
  const getInitialFilterState = () => {
    const ticketParam = urlSearchParams.get("ticketType") || "";
    const cabinParam = urlSearchParams.get("cabinClass") || "";
    const airlinesParam = urlSearchParams.get("airlines") || "";
    const agenciesParam = urlSearchParams.get("agencies") || "";
    
    return {
      ticketType: {
        charter: ticketParam.includes("charter"),
        system: ticketParam.includes("system"),
      },
      cabinClass: {
        economy: cabinParam.includes("economy"),
        business: cabinParam.includes("business"),
      },
      airlines: {
        mahan: airlinesParam.includes("mahan"),
        caspian: airlinesParam.includes("caspian"),
        ata: airlinesParam.includes("ata"),
      },
      agencies: {
        alibaba: agenciesParam.includes("alibaba"),
        flytoday: agenciesParam.includes("flytoday"),
        mrbilit: agenciesParam.includes("mrbilit"),
      },
    };
  };

  // Get time range from URL
  const getInitialTimeRange = (): [number, number] => {
    const timeParam = urlSearchParams.get("flightTime");
    if (timeParam) {
      const parts = timeParam.split("-");
      if (parts.length === 2) {
        const min = parseInt(parts[0]!);
        const max = parseInt(parts[1]!);
        if (!isNaN(min) && !isNaN(max)) {
          return [min, max];
        }
      }
    }
    return [4, 24];
  };

  // Get price range from URL
  const getInitialPriceRange = (): [number, number] => {
    const priceParam = urlSearchParams.get("priceRange");
    if (priceParam) {
      const parts = priceParam.split("-");
      if (parts.length === 2) {
        const min = parseInt(parts[0]!);
        const max = parseInt(parts[1]!);
        if (!isNaN(min) && !isNaN(max)) {
          return [min, max];
        }
      }
    }
    return [500000, 5000000];
  };

  // Shared filters state
  const [filters, setFilters] = React.useState<FilterState>(getInitialFilterState());

  // Flight time and price ranges
  const [flightTimeRange, setFlightTimeRange] = useState<[number, number]>(getInitialTimeRange());
  const [priceRange, setPriceRange] = useState<[number, number]>(getInitialPriceRange());

  // Update URL when filters change
  const updateURL = () => {
    const currentUrlParams = new URLSearchParams(urlSearchParams.toString());
    
    // Update sort in URL
    currentUrlParams.set("sort", sortKey);
    
    // Update ticket types in URL
    const ticketTypes = Object.entries(filters.ticketType)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    
    if (ticketTypes.length > 0) {
      currentUrlParams.set("ticketType", ticketTypes.join(","));
    } else {
      currentUrlParams.delete("ticketType");
    }
    
    // Update cabin class in URL
    const cabinClasses = Object.entries(filters.cabinClass)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    
    if (cabinClasses.length > 0) {
      currentUrlParams.set("cabinClass", cabinClasses.join(","));
    } else {
      currentUrlParams.delete("cabinClass");
    }
    
    // Update airlines in URL
    const airlines = Object.entries(filters.airlines)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    
    if (airlines.length > 0) {
      currentUrlParams.set("airlines", airlines.join(","));
    } else {
      currentUrlParams.delete("airlines");
    }
    
    // Update agencies in URL
    const agencies = Object.entries(filters.agencies)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    
    if (agencies.length > 0) {
      currentUrlParams.set("agencies", agencies.join(","));
    } else {
      currentUrlParams.delete("agencies");
    }
    
    // Update flight time range in URL if changed from default
    if (flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24) {
      currentUrlParams.set("flightTime", `${flightTimeRange[0]}-${flightTimeRange[1]}`);
    } else {
      currentUrlParams.delete("flightTime");
    }
    
    // Update price range in URL if changed from default
    if (priceRange[0] !== 500000 || priceRange[1] !== 5000000) {
      currentUrlParams.set("priceRange", `${priceRange[0]}-${priceRange[1]}`);
    } else {
      currentUrlParams.delete("priceRange");
    }
    
    // Update the URL without page reload
    router.replace(`/flights/${unwrappedParams.route}?${currentUrlParams.toString()}`, { scroll: false });
  };

  // Call updateURL whenever filter values change
  useEffect(() => {
    updateURL();
  }, [filters, sortKey, flightTimeRange, priceRange]);

  // Calculate active filters count
  const activeFiltersCount = Object.values(filters).reduce(
    (count, category) => count + Object.values(category).filter(Boolean).length,
    0
  ) + 
  ((priceRange[0] !== 500000 || priceRange[1] !== 5000000) ? 1 : 0) + 
  ((flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24) ? 1 : 0)

  // Handler for filter changes
  const updateFilter = (category: string, key: string, value: boolean) => {
    if (key === 'all' && value === false) {
      // Clear all filters in the specific category
      setFilters((prev) => {
        const updatedCategory: Record<string, boolean> = {};
        // Set all keys in this category to false
        Object.keys(prev[category as keyof typeof prev]).forEach(k => {
          updatedCategory[k] = false;
        });
        
        return {
          ...prev,
          [category]: updatedCategory
        };
      });
    } else {
      // Regular single filter update
      setFilters((prev) => ({
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [key]: value,
        },
      }));
    }
  }

  const clearFilters = () => {
    setFilters({
      ticketType: { charter: false, system: false },
      cabinClass: { economy: false, business: false },
      airlines: { mahan: false, caspian: false, ata: false },
      agencies: { alibaba: false, flytoday: false, mrbilit: false },
    })
    // Reset range slider values
    setFlightTimeRange([4, 24])
    setPriceRange([500000, 5000000])
  }

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
        base_redirect_url: "https://www.alibaba.ir/flights/AWZ-THR?adult={adult_count}&child={child_count}&infant={infant_count}&departing=1404-02-09",
        one_adult_redirect_url: "https://www.alibaba.ir/flights/AWZ-THR/wj1cf4r/passengers",
        two_Adults_redirect_url: "https://www.alibaba.ir/flights/AWZ-THR/mtbv5go/passengers"
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
        base_redirect_url: "https://www.alibaba.ir/flights/AWZ-THR?adult={adult_count}&child={child_count}&infant={infant_count}&departing=1404-02-09",
        one_adult_redirect_url: "https://www.alibaba.ir/flights/AWZ-THR/wj1cf4r/passengers",
        two_Adults_redirect_url: "https://www.alibaba.ir/flights/AWZ-THR/jb1bsc/passengers"
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
        base_redirect_url: "https://www.alibaba.ir/flights/AWZ-THR?adult={adult_count}&child={child_count}&infant={infant_count}&departing=1404-02-09",
        one_adult_redirect_url: "https://www.alibaba.ir/flights/AWZ-THR/wj1cf4r/passengers",
        two_Adults_redirect_url: "https://www.alibaba.ir/flights/AWZ-THR/jb1bsc/passengers"
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

  // Track which filter section is active in the drawer
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null)

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
                    className={`flex items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] ${sortKey === key
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

              {/* Filter Chips - Each opens a specific section */}
              <div className="flex gap-1 overflow-x-auto">
                {/* Mobile sort drawer trigger */}
                <Drawer>
                  <DrawerTrigger asChild>
                    <div className="bg-Shade-White outline-Gray-N100 inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]">
                      <Sort size="16" color="#1E1E1E" />
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-Gray-N700 text-sm leading-normal font-medium text-nowrap"> مرتب سازی: </div>
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

                {/* All Filters Chip - always first */}
                <Drawer>
                  <DrawerTrigger asChild>
                    <div className="bg-Shade-White outline-Gray-N100 inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1">
                      <Setting5 size="16" color="#1E1E1E" />
                      <div className="flex items-center gap-1">
                        <div className="text-Gray-N700 text-sm font-medium leading-normal">فیلتر‌ها</div>
                        {activeFiltersCount > 0 && (
                          <div className="size-5 bg-Primary-P50 rounded-[80px] flex justify-center items-center">
                            <div className="text-Primary-P500main text-[11px] font-semibold leading-none">
                              {englishToFarsiNumber(activeFiltersCount)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </DrawerTrigger>
                  <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                    <FilterDrawerContent
                      title="فیلتر‌ها"
                      activeFiltersCount={activeFiltersCount}
                      clearFilters={clearFilters}
                      activeSection="all"
                      filters={filters}
                      updateFilter={updateFilter}
                      flightTimeRange={flightTimeRange}
                      setFlightTimeRange={setFlightTimeRange}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                    />
                  </DrawerContent>
                </Drawer>

                {/* Active filters first */}
                {/* Price Range Filter Chip - if active */}
                {(priceRange[0] !== 500000 || priceRange[1] !== 5000000) && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Primary-P50 outline-Primary-P500main inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1"
                        onClick={() => setActiveFilterSection('priceRange')}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Primary-P500main text-sm font-medium leading-normal">
                            قیمت: {englishToFarsiNumber(Math.floor(priceRange[0] / 1000))} تا {englishToFarsiNumber(Math.floor(priceRange[1] / 1000))} هزار
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                      <FilterDrawerContent
                        title="بازه قیمت"
                        activeFiltersCount={(priceRange[0] !== 500000 || priceRange[1] !== 5000000) ? 1 : 0}
                        clearFilters={() => setPriceRange([500000, 5000000])}
                        activeSection="priceRange"
                        filters={filters}
                        updateFilter={updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Flight Time Filter Chip - if active */}
                {(flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24) && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Primary-P50 outline-Primary-P500main inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1"
                        onClick={() => setActiveFilterSection('flightTime')}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Primary-P500main text-sm font-medium leading-normal">
                            ساعت پرواز: {englishToFarsiNumber(flightTimeRange[0])} تا {englishToFarsiNumber(flightTimeRange[1])}
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                      <FilterDrawerContent
                        title="ساعت پرواز رفت"
                        activeFiltersCount={(flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24) ? 1 : 0}
                        clearFilters={() => setFlightTimeRange([4, 24])}
                        activeSection="flightTime"
                        filters={filters}
                        updateFilter={updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Ticket Type Filter Chip - if active */}
                {Object.values(filters.ticketType).some(Boolean) && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Primary-P50 outline-Primary-P500main inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1"
                        onClick={() => setActiveFilterSection('ticketType')}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Primary-P500main text-sm font-medium leading-normal">
                            نوع بلیط: {[
                              filters.ticketType.charter ? 'چارتر' : null,
                              filters.ticketType.system ? 'سیستمی' : null
                            ].filter(Boolean).join('، ')}
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                      <FilterDrawerContent
                        title="نوع بلیط"
                        activeFiltersCount={Object.values(filters.ticketType).filter(Boolean).length}
                        clearFilters={() => updateFilter('ticketType', 'all', false)}
                        activeSection="ticketType"
                        filters={filters}
                        updateFilter={updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Cabin Class Filter Chip - if active */}
                {Object.values(filters.cabinClass).some(Boolean) && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Primary-P50 outline-Primary-P500main inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1"
                        onClick={() => setActiveFilterSection('cabinClass')}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Primary-P500main text-sm font-medium leading-normal">
                            کلاس پروازی: {[
                              filters.cabinClass.economy ? 'اکونومی' : null,
                              filters.cabinClass.business ? 'بیزینس' : null
                            ].filter(Boolean).join('، ')}
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                      <FilterDrawerContent
                        title="کلاس پروازی"
                        activeFiltersCount={Object.values(filters.cabinClass).filter(Boolean).length}
                        clearFilters={() => updateFilter('cabinClass', 'all', false)}
                        activeSection="cabinClass"
                        filters={filters}
                        updateFilter={updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Airlines Filter Chip - if active */}
                {Object.values(filters.airlines).some(Boolean) && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Primary-P50 outline-Primary-P500main inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1"
                        onClick={() => setActiveFilterSection('airlines')}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Primary-P500main text-sm font-medium leading-normal">
                            ایرلاین‌ها: {[
                              filters.airlines.mahan ? 'ماهان' : null,
                              filters.airlines.caspian ? 'کاسپین' : null,
                              filters.airlines.ata ? 'آتا' : null
                            ].filter(Boolean).join('، ')}
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                      <FilterDrawerContent
                        title="شرکت‌های هواپیمایی"
                        activeFiltersCount={Object.values(filters.airlines).filter(Boolean).length}
                        clearFilters={() => updateFilter('airlines', 'all', false)}
                        activeSection="airlines"
                        filters={filters}
                        updateFilter={updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Agencies Filter Chip - if active */}
                {Object.values(filters.agencies).some(Boolean) && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Primary-P50 outline-Primary-P500main inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1"
                        onClick={() => setActiveFilterSection('agencies')}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Primary-P500main text-sm font-medium leading-normal">
                            وبسایت‌ها: {[
                              filters.agencies.alibaba ? 'علی بابا' : null,
                              filters.agencies.flytoday ? 'فلای تودی' : null,
                              filters.agencies.mrbilit ? 'مستر بلیط' : null
                            ].filter(Boolean).join('، ')}
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                      <FilterDrawerContent
                        title="وبسایت‌ها"
                        activeFiltersCount={Object.values(filters.agencies).filter(Boolean).length}
                        clearFilters={() => updateFilter('agencies', 'all', false)}
                        activeSection="agencies"
                        filters={filters}
                        updateFilter={updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Inactive filters after active ones */}
                {/* Price Range Filter Chip - if inactive */}
                {(priceRange[0] === 500000 && priceRange[1] === 5000000) && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Shade-White outline-Gray-N100 inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1"
                        onClick={() => setActiveFilterSection('priceRange')}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Gray-N700 text-sm font-medium leading-normal">قیمت</div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                      <FilterDrawerContent
                        title="بازه قیمت"
                        activeFiltersCount={(priceRange[0] !== 500000 || priceRange[1] !== 5000000) ? 1 : 0}
                        clearFilters={() => setPriceRange([500000, 5000000])}
                        activeSection="priceRange"
                        filters={filters}
                        updateFilter={updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Flight Time Filter Chip - if inactive */}
                {(flightTimeRange[0] === 4 && flightTimeRange[1] === 24) && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Shade-White outline-Gray-N100 inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1"
                        onClick={() => setActiveFilterSection('flightTime')}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Gray-N700 text-sm font-medium leading-normal">ساعت پرواز</div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                      <FilterDrawerContent
                        title="ساعت پرواز رفت"
                        activeFiltersCount={(flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24) ? 1 : 0}
                        clearFilters={() => setFlightTimeRange([4, 24])}
                        activeSection="flightTime"
                        filters={filters}
                        updateFilter={updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Ticket Type Filter Chip - if inactive */}
                {!Object.values(filters.ticketType).some(Boolean) && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Shade-White outline-Gray-N100 inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1"
                        onClick={() => setActiveFilterSection('ticketType')}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Gray-N700 text-sm font-medium leading-normal">نوع بلیط</div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                      <FilterDrawerContent
                        title="نوع بلیط"
                        activeFiltersCount={Object.values(filters.ticketType).filter(Boolean).length}
                        clearFilters={() => updateFilter('ticketType', 'all', false)}
                        activeSection="ticketType"
                        filters={filters}
                        updateFilter={updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Cabin Class Filter Chip - if inactive */}
                {!Object.values(filters.cabinClass).some(Boolean) && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Shade-White outline-Gray-N100 inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1"
                        onClick={() => setActiveFilterSection('cabinClass')}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Gray-N700 text-sm font-medium leading-normal">کلاس پروازی</div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                      <FilterDrawerContent
                        title="کلاس پروازی"
                        activeFiltersCount={Object.values(filters.cabinClass).filter(Boolean).length}
                        clearFilters={() => updateFilter('cabinClass', 'all', false)}
                        activeSection="cabinClass"
                        filters={filters}
                        updateFilter={updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Airlines Filter Chip - if inactive */}
                {!Object.values(filters.airlines).some(Boolean) && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Shade-White outline-Gray-N100 inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1"
                        onClick={() => setActiveFilterSection('airlines')}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Gray-N700 text-sm font-medium leading-normal">ایرلاین‌ها</div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                      <FilterDrawerContent
                        title="شرکت‌های هواپیمایی"
                        activeFiltersCount={Object.values(filters.airlines).filter(Boolean).length}
                        clearFilters={() => updateFilter('airlines', 'all', false)}
                        activeSection="airlines"
                        filters={filters}
                        updateFilter={updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Agencies Filter Chip - if inactive */}
                {!Object.values(filters.agencies).some(Boolean) && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Shade-White outline-Gray-N100 inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px] whitespace-nowrap cursor-pointer mr-1"
                        onClick={() => setActiveFilterSection('agencies')}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Gray-N700 text-sm font-medium leading-normal">وبسایت‌ها</div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White rounded-t-2xl max-h-[80vh] pb-4">
                      <FilterDrawerContent
                        title="وبسایت‌ها"
                        activeFiltersCount={Object.values(filters.agencies).filter(Boolean).length}
                        clearFilters={() => updateFilter('agencies', 'all', false)}
                        activeSection="agencies"
                        filters={filters}
                        updateFilter={updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}
              </div>
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

// Drawer content component for filters
const FilterDrawerContent = ({
  title,
  activeFiltersCount,
  clearFilters,
  activeSection,
  filters,
  updateFilter,
  flightTimeRange,
  setFlightTimeRange,
  priceRange,
  setPriceRange
}: {
  title: string,
  activeFiltersCount: number,
  clearFilters: () => void,
  activeSection: string,
  filters: FilterState,
  updateFilter: (category: string, key: string, value: boolean) => void,
  flightTimeRange: [number, number],
  setFlightTimeRange: (range: [number, number]) => void,
  priceRange: [number, number],
  setPriceRange: (range: [number, number]) => void
}) => {

  // Calculate total active filters for chips display
  const totalActiveFiltersForChips = 
    Object.values(filters.ticketType).filter(Boolean).length +
    Object.values(filters.cabinClass).filter(Boolean).length +
    Object.values(filters.airlines).filter(Boolean).length +
    Object.values(filters.agencies).filter(Boolean).length +
    ((priceRange[0] !== 500000 || priceRange[1] !== 5000000) ? 1 : 0) +
    ((flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24) ? 1 : 0);

  return (
    <div className="inline-flex h-full w-full flex-col items-start justify-start max-h-[80vh]">
      <DialogTitle className="bg-Shade-White border-Gray-N100 inline-flex items-center self-stretch border-b px-5 py-4 sticky top-0 z-10">
        <div className="self-stretch inline-flex justify-center items-center w-full gap-2 relative">
          <div
            className={`absolute left-5 text-Primary-P500main text-[13px] font-medium leading-normal cursor-pointer ${activeFiltersCount === 0 ? 'invisible' : ''}`}
            onClick={clearFilters}
          >
            حذف فیلتر‌ها
          </div>
          
          <div className="flex-1 flex justify-center items-center text-center">
            <div className="flex justify-center items-center">
              <div className="text-Gray-N600 text-center text-base font-semibold leading-7 ml-2">{title}</div>
            </div>
            {activeFiltersCount > 0 && (
              <div className="size-5 bg-Primary-P50 rounded-[80px] flex justify-center items-center gap-2 ">
                <div className="text-Primary-P500main text-[13px] font-medium leading-normal">
                  {englishToFarsiNumber(activeFiltersCount)}
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute right-5 flex justify-start items-center gap-2">
            <DrawerClose className="cursor-pointer">
              <CloseCircle size="24" color="#334155" variant="Outline" />
            </DrawerClose>
          </div>
        </div>
      </DialogTitle>
      
      <div className="w-full max-h-[calc(80vh-60px)] overflow-y-auto">
        {/* Active Filter Chips Section (Horizontally Scrollable) */}
        {activeSection === 'all' && totalActiveFiltersForChips > 0 && (
          <div className="px-5 py-1 border-b border-Gray-N100 w-full">
            <div className="flex items-center gap-[7px] overflow-x-auto whitespace-nowrap p-2" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}>
              {/* Ticket Type Filters */}
              {Object.entries(filters.ticketType).map(([key, value]) => 
                value && (
                  <div key={`ticketType-${key}`} className="px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex-shrink-0 flex justify-center items-center gap-1 overflow-hidden">
                    <div className="py-1 flex justify-start items-center gap-2 cursor-pointer" onClick={() => updateFilter('ticketType', key, false)}>
                      <div className="size-4 relative rounded-[48px] overflow-hidden">
                        <CloseCircle size="16" color="#94A3B8" />
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      <div className="text-Gray-N700 text-sm font-medium leading-normal">
                        {key === 'charter' ? 'چارتری' : 'سیستمی'}
                      </div>
                    </div>
                  </div>
                )
              )}
              
              {/* Cabin Class Filters */}
              {Object.entries(filters.cabinClass).map(([key, value]) => 
                value && (
                  <div key={`cabinClass-${key}`} className="px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex-shrink-0 flex justify-center items-center gap-1 overflow-hidden">
                    <div className="py-1 flex justify-start items-center gap-2 cursor-pointer" onClick={() => updateFilter('cabinClass', key, false)}>
                      <div className="size-4 relative rounded-[48px] overflow-hidden">
                        <CloseCircle size="16" color="#94A3B8" />
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      <div className="text-Gray-N700 text-sm font-medium leading-normal">
                        {key === 'economy' ? 'اکونومی' : 'بیزینس'}
                      </div>
                    </div>
                  </div>
                )
              )}
              
              {/* Airlines Filters */}
              {Object.entries(filters.airlines).map(([key, value]) => 
                value && (
                  <div key={`airlines-${key}`} className="px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex-shrink-0 flex justify-center items-center gap-1 overflow-hidden">
                    <div className="py-1 flex justify-start items-center gap-2 cursor-pointer" onClick={() => updateFilter('airlines', key, false)}>
                      <div className="size-4 relative rounded-[48px] overflow-hidden">
                        <CloseCircle size="16" color="#94A3B8" />
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      <div className="text-Gray-N700 text-sm font-medium leading-normal">
                        {key === 'mahan' ? 'ماهان' : key === 'caspian' ? 'کاسپین' : 'آتا'}
                      </div>
                    </div>
                  </div>
                )
              )}
              
              {/* Agencies Filters */}
              {Object.entries(filters.agencies).map(([key, value]) => 
                value && (
                  <div key={`agencies-${key}`} className="px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex-shrink-0 flex justify-center items-center gap-1 overflow-hidden">
                    <div className="py-1 flex justify-start items-center gap-2 cursor-pointer" onClick={() => updateFilter('agencies', key, false)}>
                      <div className="size-4 relative rounded-[48px] overflow-hidden">
                        <CloseCircle size="16" color="#94A3B8" />
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      <div className="text-Gray-N700 text-sm font-medium leading-normal">
                        {key === 'alibaba' ? 'علی بابا' : key === 'flytoday' ? 'فلای تودی' : 'مستر بلیط'}
                      </div>
                    </div>
                  </div>
                )
              )}
              
              {/* Price Range Filter */}
              {(priceRange[0] !== 500000 || priceRange[1] !== 5000000) && (
                <div className="px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex-shrink-0 flex justify-center items-center gap-1 overflow-hidden">
                  <div className="py-1 flex justify-start items-center gap-2 cursor-pointer" onClick={() => setPriceRange([500000, 5000000])}>
                    <div className="size-4 relative rounded-[48px] overflow-hidden">
                      <CloseCircle size="16" color="#94A3B8" />
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-1">
                    <div className="text-Gray-N700 text-sm font-medium leading-normal">
                      بازه قیمت (تومان): {englishToFarsiNumber(Math.floor(priceRange[0] / 1000))} تا {englishToFarsiNumber(Math.floor(priceRange[1] / 1000))} هزار
                    </div>
                  </div>
                </div>
              )}
              
              {/* Flight Time Range Filter */}
              {(flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24) && (
                <div className="px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex-shrink-0 flex justify-center items-center gap-1 overflow-hidden">
                  <div className="py-1 flex justify-start items-center gap-2 cursor-pointer" onClick={() => setFlightTimeRange([4, 24])}>
                    <div className="size-4 relative rounded-[48px] overflow-hidden">
                      <CloseCircle size="16" color="#94A3B8" />
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-1">
                    <div className="text-Gray-N700 text-sm font-medium leading-normal">
                      ساعت پرواز: {englishToFarsiNumber(flightTimeRange[0])} تا {englishToFarsiNumber(flightTimeRange[1])}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="self-stretch px-5 py-4 bg-Shade-White flex flex-col justify-center items-center gap-3">
          {/* Filtered content based on activeSection */}
          {/* Flight Time Range */}
          {(activeSection === 'all' || activeSection === 'flightTime') && (
            <FilterSection title="ساعت پرواز رفت" isLast={activeSection !== 'all'}>
              <FancySlider
                value={flightTimeRange}
                onValueChange={setFlightTimeRange}
                min={4}
                max={24}
                step={1}
                leftLabel={formatTime(flightTimeRange[1])}
                rightLabel={formatTime(flightTimeRange[0])}
              />
            </FilterSection>
          )}

          {/* Price Range */}
          {(activeSection === 'all' || activeSection === 'priceRange') && (
            <FilterSection title="بازه قیمت (تومان)" isLast={activeSection !== 'all'}>
              <FancySlider
                value={priceRange}
                onValueChange={setPriceRange}
                min={500000}
                max={5000000}
                step={100000}
                leftLabel={formatPrice(priceRange[1])}
                rightLabel={formatPrice(priceRange[0])}
              />
            </FilterSection>
          )}

          {/* Ticket Type */}
          {(activeSection === 'all' || activeSection === 'ticketType') && (
            <FilterSection title="نوع بلیط" count={Object.values(filters.ticketType).filter(Boolean).length} isLast={activeSection !== 'all'}>
              <FilterCheckbox
                label="چارتر"
                checked={filters.ticketType.charter}
                onChange={(v) => updateFilter('ticketType', 'charter', v)}
              />
              <FilterCheckbox
                label="سیستمی"
                checked={filters.ticketType.system}
                onChange={(v) => updateFilter('ticketType', 'system', v)}
              />
            </FilterSection>
          )}

          {/* Cabin Class */}
          {(activeSection === 'all' || activeSection === 'cabinClass') && (
            <FilterSection title="کلاس پروازی" count={Object.values(filters.cabinClass).filter(Boolean).length} isLast={activeSection !== 'all'}>
              <FilterCheckbox
                label="اکونومی"
                checked={filters.cabinClass.economy}
                onChange={(v) => updateFilter('cabinClass', 'economy', v)}
              />
              <FilterCheckbox
                label="بیزینس"
                checked={filters.cabinClass.business}
                onChange={(v) => updateFilter('cabinClass', 'business', v)}
              />
            </FilterSection>
          )}

          {/* Airlines */}
          {(activeSection === 'all' || activeSection === 'airlines') && (
            <FilterSection 
              title="شرکت‌های هواپیمایی" 
              count={Object.values(filters.airlines).filter(Boolean).length}
              isLast={activeSection !== 'all'}
            >
              <FilterCheckbox
                label="ماهان"
                logo="/images/logo.webp"
                extraText="از ۲,346,890"
                checked={filters.airlines.mahan}
                onChange={(v) => updateFilter('airlines', 'mahan', v)}
              />
              <FilterCheckbox
                label="کاسپین"
                logo="/images/logo.webp"
                extraText="از ۲,346,890"
                checked={filters.airlines.caspian}
                onChange={(v) => updateFilter('airlines', 'caspian', v)}
              />
              <FilterCheckbox
                label="آتا"
                logo="/images/logo.webp"
                extraText="از ۲,346,890"
                checked={filters.airlines.ata}
                onChange={(v) => updateFilter('airlines', 'ata', v)}
              />
            </FilterSection>
          )}

          {/* Agencies */}
          {(activeSection === 'all' || activeSection === 'agencies') && (
            <FilterSection title="وبسایت‌ها" count={Object.values(filters.agencies).filter(Boolean).length} isLast={activeSection !== 'all'}>
              <FilterCheckbox
                label="علی‌بابا"
                logo="/images/logo.webp"
                extraText="از ۲,346,890"
                checked={filters.agencies.alibaba}
                onChange={(v) => updateFilter('agencies', 'alibaba', v)}
              />
              <FilterCheckbox
                label="فلای تودی"
                logo="/images/logo.webp"
                extraText="از ۲,346,890"
                checked={filters.agencies.flytoday}
                onChange={(v) => updateFilter('agencies', 'flytoday', v)}
              />
              <FilterCheckbox
                label="مستر بلیط"
                logo="/images/logo.webp"
                extraText="از ۲,346,890"
                checked={filters.agencies.mrbilit}
                onChange={(v) => updateFilter('agencies', 'mrbilit', v)}
              />
            </FilterSection>
          )}
        </div>
      </div>
    </div>
  );
};

// Format price with commas
const formatPrice = (price: number) => {
  return englishToFarsiNumber(price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

// Format time as HH:MM
const formatTime = (hour: number) => {
  return englishToFarsiNumber(`${hour.toString().padStart(2, '0')}:00`);
}

// Filter section with expandable header
const FilterSection = ({
  title,
  children,
  count = 0,
  isOpen = true,
  isLast = false
}: {
  title: string,
  children: React.ReactNode,
  count?: number,
  isOpen?: boolean,
  isLast?: boolean
}) => {
  const [expanded, setExpanded] = React.useState(isOpen)

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      <div
        className="self-stretch flex justify-between items-center gap-[7px] cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="text-Gray-N600 text-sm font-semibold leading-normal">
            {title}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <div className="w-10 h-5 bg-Primary-P50 rounded-[80px] flex justify-center items-center">
              <div className="text-Primary-P500main text-[13px] font-medium leading-normal">
                {englishToFarsiNumber(count)}
              </div>
            </div>
          )}
          <div className="flex-shrink-0">
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
              <path d="M1 1L6 6L11 1" stroke="#384250" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && children}

      {!isLast && <div className="self-stretch h-px bg-Gray-N100" />}
    </div>
  )
}

// Checkbox component for filters
const FilterCheckbox = ({
  label,
  checked,
  onChange,
  logo,
  extraText
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  logo?: string;
  extraText?: string;
}) => (
  <div className="self-stretch inline-flex justify-end items-center gap-2">
    <div className="p-[3px] flex justify-center items-center gap-2">
      <div
        className={`size-[18px] relative rounded-sm overflow-hidden flex items-center justify-center
          ${checked
            ? "bg-Primary-P500main"
            : "outline-1 outline-offset-[-1px] outline-Gray-N300"
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
      <div className="self-stretch flex justify-start items-center gap-2">
        <div className="size-8 p-2 rounded-[48px] border border-Gray-N200 overflow-hidden">
          <Image src={logo} alt={label} width={32} height={32} className="object-contain" />
        </div>
      </div>
    )}

    <div className="flex-1 inline-flex flex-col justify-start items-end gap-1">
      <div className="self-stretch text-right text-Gray-N700 text-sm font-medium leading-normal">
        {label}
      </div>
    </div>
    {extraText && (
      <div className="text-right text-Gray-N500 text-[13px] font-normal leading-none">
        {englishToFarsiNumber(extraText)}
      </div>
    )}
  </div>
)
