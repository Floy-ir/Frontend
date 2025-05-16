"use client"
import { DialogTitle } from "@radix-ui/react-dialog"
import { CloseCircle, Setting5, Sort } from "iconsax-react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { use, useEffect, useRef, useState } from "react"
import { FlightFilters } from "@/components/FlightFilters"
import { FlightSearchHeader } from "@/components/FlightSearchHeader/FlightSearchHeader"
import NoTicketFound from "@/components/FlightsPage/NoTicketFound"
import Timeline from "@/components/FlightsPage/price-timeline"
import { Checkbox } from "@/components/ui/checkbox"
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { FancySlider } from "@/components/ui/fancy-slider"
import { getCityByCode } from "@/config/cities"
import dude from "@/public/images/flash-circle-outline.svg"
import { apiFetch } from "@/services/api/index"
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

// Define the structure for filters state
interface FilterState {
  ticketType: { charter: boolean; system: boolean }
  cabinClass: { economy: boolean; business: boolean }
  airlines: { mahan: boolean; caspian: boolean; ata: boolean }
  agencies: { alibaba: boolean; flytoday: boolean; mrbilit: boolean }
}

type FlightData = {
  airline: {
    uid: string
    name: string
    image: string | null
  }
  allowed_weight: number
  arrival_timestamp: number
  cheapest_base_redirect_url: string
  cheapest_one_adult_redirect_url: string | null
  cheapest_price: number
  cheapest_two_adult_redirect_url: string | null
  cheapest_website: {
    uid: string
    name: string
    name_fa: string
    image: string | null
  }
  departure_timestamp: number
  destination: string
  origin: string
  seat_class: string
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
}

type TransformedFlight = {
  id: string
  departureTime: string
  arrivalTime: string
  origin: string
  destination: string
  duration: { hours: number; minutes: number }
  airline: {
    name: string
    logo: string
  }
  flightInfo: {
    baggage: string
    // ticketType: string
    cabinClass: string
  }
  price: {
    amount: number
    formattedAmount: string
    agency: string
    agency_eng:string
    agencyLogo: string
    label: string
    base_redirect_url: string
    one_adult_redirect_url: string | null
    two_adults_redirect_url: string | null
  }
  otherSellersCount: number
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

  const [originCity, setOriginCity] = useState("")
  const [destinationCity, setDestinationCity] = useState("")

  useEffect(() => {
    const fetchOrigin = async () => {
      const origin = await getCityByCode(originCode || "")
      const destination = await getCityByCode(destinationCode || "")

      setOriginCity(origin?.label || originCode || "")
      setDestinationCity(destination?.label || destinationCode || "")
    }

    fetchOrigin()
  }, [])

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
    const ticketParam = urlSearchParams.get("ticketType") || ""
    const cabinParam = urlSearchParams.get("cabinClass") || ""
    const airlinesParam = urlSearchParams.get("airlines") || ""
    const agenciesParam = urlSearchParams.get("agencies") || ""

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
    }
  }

  // Get time range from URL
  const getInitialTimeRange = (): [number, number] => {
    const timeParam = urlSearchParams.get("flightTime")
    if (timeParam) {
      const parts = timeParam.split("-")
      if (parts.length === 2) {
        const min = parseInt(parts[0]!)
        const max = parseInt(parts[1]!)
        if (!isNaN(min) && !isNaN(max)) {
          return [min, max]
        }
      }
    }
    return [4, 24]
  }

  // Get price range from URL
  const getInitialPriceRange = (): [number, number] => {
    const priceParam = urlSearchParams.get("priceRange")
    if (priceParam) {
      const parts = priceParam.split("-")
      if (parts.length === 2) {
        const min = parseInt(parts[0]!)
        const max = parseInt(parts[1]!)
        if (!isNaN(min) && !isNaN(max)) {
          return [min, max]
        }
      }
    }
    return [500000, 5000000]
  }

  // Shared filters state
  const [filters, setFilters] = React.useState<FilterState>(getInitialFilterState())

  // Flight time and price ranges
  const [flightTimeRange, setFlightTimeRange] = useState<[number, number]>(getInitialTimeRange())
  const [priceRange, setPriceRange] = useState<[number, number]>(getInitialPriceRange())

  // Track which drawer has uncommitted changes
  const [dirtyDrawers, setDirtyDrawers] = useState<Record<string, boolean>>({
    all: false,
    ticketType: false,
    cabinClass: false,
    airlines: false,
    agencies: false,
    flightTime: false,
    priceRange: false,
  })

  // Track drawer changes that need to be applied
  const drawerChangesRef = React.useRef<Record<string, unknown>>({})

  // Helper function to mark a drawer as having changes
  const markDrawerDirty = (drawer: string, isDirty: boolean) => {
    setDirtyDrawers((prev) => ({
      ...prev,
      [drawer]: isDirty,
    }))
  }

  // Store changes to be applied when a drawer closes
  const _storeDrawerChanges = (drawer: string, changes: unknown) => {
    drawerChangesRef.current[drawer] = changes
    markDrawerDirty(drawer, true)
  }

  // Apply changes when a drawer closes
  const _applyDrawerChanges = (drawer: string) => {
    if (dirtyDrawers[drawer] && drawerChangesRef.current[drawer]) {
      const changes = drawerChangesRef.current[drawer] as Record<string, unknown>

      // Apply changes based on drawer type
      if (drawer === "priceRange" && typeof changes.priceRange !== 'undefined') {
        setPriceRange(changes.priceRange as [number, number])
      } else if (drawer === "flightTime" && typeof changes.flightTimeRange !== 'undefined') {
        setFlightTimeRange(changes.flightTimeRange as [number, number])
      } else if (["ticketType", "cabinClass", "airlines", "agencies"].includes(drawer) && 
                 typeof changes.filters !== 'undefined') {
        // Apply filter changes
        const category = drawer
        const newFilters = changes.filters as Record<string, boolean>

        Object.entries(newFilters).forEach(([key, value]) => {
          const typedCategory = category as keyof typeof filters
          // Need to use type assertion safely
          if (
            typedCategory in filters &&
            key in filters[typedCategory] &&
            filters[typedCategory][key as keyof (typeof filters)[typeof typedCategory]] !== value
          ) {
            _updateFilter(category, key, value as boolean)
          }
        })
      } else if (drawer === "all" && typeof changes.all !== 'undefined') {
        // Apply all changes from the "all filters" drawer
        const allChanges = changes.all as {
          filters?: Record<string, Record<string, boolean>>,
          priceRange?: [number, number],
          flightTimeRange?: [number, number]
        }
        
        const { filters: newFilters, priceRange: newPriceRange, flightTimeRange: newFlightTimeRange } = allChanges

        // Update filters
        if (newFilters) {
          Object.entries(newFilters).forEach(([category, categoryFilters]) => {
            const typedCategory = category as keyof typeof filters
            if (typedCategory in filters) {
              Object.entries(categoryFilters as Record<string, boolean>).forEach(([key, value]) => {
                if (
                  key in filters[typedCategory] &&
                  filters[typedCategory][key as keyof (typeof filters)[typeof typedCategory]] !== value
                ) {
                  _updateFilter(category, key, value as boolean)
                }
              })
            }
          })
        }

        // Update ranges
        if (newPriceRange) {
          setPriceRange(newPriceRange)
        }
        if (newFlightTimeRange) {
          setFlightTimeRange(newFlightTimeRange)
        }
      }

      // Clear changes
      drawerChangesRef.current[drawer] = null
      markDrawerDirty(drawer, false)
    }
  }

  // Update URL when filters change
  const updateURL = () => {
    const currentUrlParams = new URLSearchParams(urlSearchParams.toString())

    // Update sort in URL
    currentUrlParams.set("sort", sortKey)

    // Update ticket types in URL
    const ticketTypes = Object.entries(filters.ticketType)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)

    if (ticketTypes.length > 0) {
      currentUrlParams.set("ticketType", ticketTypes.join(","))
    } else {
      currentUrlParams.delete("ticketType")
    }

    // Update cabin class in URL
    const cabinClasses = Object.entries(filters.cabinClass)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)

    if (cabinClasses.length > 0) {
      currentUrlParams.set("cabinClass", cabinClasses.join(","))
    } else {
      currentUrlParams.delete("cabinClass")
    }

    // Update airlines in URL
    const airlines = Object.entries(filters.airlines)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)

    if (airlines.length > 0) {
      currentUrlParams.set("airlines", airlines.join(","))
    } else {
      currentUrlParams.delete("airlines")
    }

    // Update agencies in URL
    const agencies = Object.entries(filters.agencies)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)

    if (agencies.length > 0) {
      currentUrlParams.set("agencies", agencies.join(","))
    } else {
      currentUrlParams.delete("agencies")
    }

    // Update flight time range in URL if changed from default
    if (flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24) {
      currentUrlParams.set("flightTime", `${flightTimeRange[0]}-${flightTimeRange[1]}`)
    } else {
      currentUrlParams.delete("flightTime")
    }

    // Update price range in URL if changed from default
    if (priceRange[0] !== 500000 || priceRange[1] !== 5000000) {
      currentUrlParams.set("priceRange", `${priceRange[0]}-${priceRange[1]}`)
    } else {
      currentUrlParams.delete("priceRange")
    }

    // Update the URL without page reload
    router.replace(`/flights/${unwrappedParams.route}?${currentUrlParams.toString()}`, { scroll: false })
  }

  // Call updateURL whenever filter values change
  useEffect(() => {
    updateURL()
  }, [filters, sortKey, flightTimeRange, priceRange])

  // Calculate active filters count
  const _activeFiltersCount =
    Object.values(filters).reduce((count, category) => count + Object.values(category).filter(Boolean).length, 0) +
    (priceRange[0] !== 500000 || priceRange[1] !== 5000000 ? 1 : 0) +
    (flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24 ? 1 : 0)

  // Handler for filter changes
  const _updateFilter = (category: string, key: string, value: boolean) => {
    if (key === "all" && value === false) {
      // Clear all filters in the specific category
      setFilters((prev) => {
        const updatedCategory: Record<string, boolean> = {}
        // Set all keys in this category to false
        Object.keys(prev[category as keyof typeof prev]).forEach((k) => {
          updatedCategory[k] = false
        })

        return {
          ...prev,
          [category]: updatedCategory,
        }
      })
    } else {
      // Regular single filter update
      setFilters((prev) => ({
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [key]: value,
        },
      }))
    }

    // This will cause the URL update in the useEffect hook
    // The drawer state is now preserved separately in openDrawers state
  }

  const _clearFilters = () => {
    setFilters({
      ticketType: { charter: false, system: false },
      cabinClass: { economy: false, business: false },
      airlines: { mahan: false, caspian: false, ata: false },
      agencies: { alibaba: false, flytoday: false, mrbilit: false },
    })
  }
  
  const _setFlightTimeRange = (range: [number, number]) => {
    // Implementation would go here
  }
  
  const _setPriceRange = (range: [number, number]) => {
    // Implementation would go here
  }

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null)

  // Add state to control drawer open states
  const [openDrawers, setOpenDrawers] = useState<Record<string, boolean>>({
    sort: false,
    all: false,
    ticketType: false,
    cabinClass: false,
    airlines: false,
    agencies: false,
    flightTime: false,
    priceRange: false,
  })

  // Helper function to open a specific drawer
  const openDrawer = (drawer: string) => {
    setOpenDrawers((prev) => ({
      ...prev,
      [drawer]: true,
    }))
  }

  // Helper function to close a specific drawer
  const closeDrawer = (drawer: string) => {
    setOpenDrawers((prev) => ({
      ...prev,
      [drawer]: false,
    }))
  }

  const [flights, setFlights] = useState<TransformedFlight[]>([])
  const pathname = usePathname()
  // const [error, setError] = useState<string | null>(null);
    function transformFlightData(input: FlightData, id: string = "1"): TransformedFlight {
      const departure = new Date(input.departure_timestamp * 1000)
      const arrival = new Date(input.arrival_timestamp * 1000)

      const durationMs = arrival.getTime() - departure.getTime()
      const duration = {
        hours: Math.floor(durationMs / (1000 * 60 * 60)),
        minutes: Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60)),
      }

      const toPersianTime = (date: Date) =>
        date
          .toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", hour12: false })
          .replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹".charAt(parseInt(d)))

      return {
        id,
        departureTime: toPersianTime(departure),
        arrivalTime: toPersianTime(arrival),
        duration,
        origin: input.origin,
        destination: input.destination,
        airline: {
          name: input.airline.name || "نامشخص",
          logo: input.airline.image ?? dude.src,
        },
        flightInfo: {
          baggage: `${input.allowed_weight} `,
          // ticketType: "سیستمی",
          cabinClass:
            input.seat_class === "Economy" ? "اکونومی" : input.seat_class === "Business" ? "بیزینس" : input.seat_class,
        },
        price: {
          amount: input.cheapest_price,
          formattedAmount: input.cheapest_price.toLocaleString("fa-IR"),
          agency: input.cheapest_website?.name_fa ?? "",
          agency_eng: input.cheapest_website?.name ?? "",
          agencyLogo: input.cheapest_website?.image ?? "",
          label: "ارزان ترین",
          base_redirect_url: input.cheapest_base_redirect_url ?? "",
          one_adult_redirect_url: input.cheapest_one_adult_redirect_url ?? input.cheapest_base_redirect_url,
          two_adults_redirect_url: input.cheapest_two_adult_redirect_url ?? input.cheapest_base_redirect_url,
        },
        otherSellersCount: input.websites.length,
        websites: input.websites,
      }
    }

    const getFlights = async (departureDate: string) => {
      
      try {
        const startOfDay = new Date(`${departureDate}T00:00:00`).getTime() / 1000
        const endOfDay = new Date(`${departureDate}T23:59:59`).getTime() / 1000 + 1
        const [originCode, destinationCode] = unwrappedParams.route.split("-")
        const data = await apiFetch<{ results: FlightData[] }>("/flights", {
          params: {
            origin: originCode,
            destination: destinationCode,
            departure_timestamp__gte: startOfDay,
            departure_timestamp__lte: endOfDay,
          },
        })

        // console.log(params)

        if (data?.results) {
          const transformed = data.results.map((flight, index) => transformFlightData(flight, (index + 1).toString()))
          setFlights(transformed)
        }
      } catch (err) {
        console.error("Error fetching flights:", err)
      }
    }

  //fetch flights
  useEffect(() => {
    // console.log("asdfg")
    // console.log(pathname)
    // const fullUrl = `${pathname}?${searchParams.toString()}`

    getFlights(departureDate)
  }, [pathname, searchParams])

  // Sort flights based on selected sort key, safely handling empty/incomplete objects
  const sortedFlights = [...flights]
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

  // Create a drawer content ref to communicate with the FilterDrawerContent
  const drawerContentRef = useRef<{
    getLocalState: () => {
      localFilters: FilterState
      localPriceRange: [number, number]
      localFlightTimeRange: [number, number]
    }
  }>(null)

  // Drawer open/close handler that applies the changes from local state
  const handleDrawerOpenChange = (isOpen: boolean, drawerType: string) => {
    // If drawer is closing, get and apply the local state
    if (!isOpen && openDrawers[drawerType] && drawerContentRef.current) {
      const { localFilters, localPriceRange, localFlightTimeRange } = drawerContentRef.current.getLocalState()

      // Apply the changes based on drawer type
      if (drawerType === "priceRange") {
        setPriceRange(localPriceRange)
      } else if (drawerType === "flightTime") {
        setFlightTimeRange(localFlightTimeRange)
      } else if (drawerType === "ticketType") {
        // Always update values from local state when drawer closes
        _updateFilter("ticketType", "charter", localFilters.ticketType.charter)
        _updateFilter("ticketType", "system", localFilters.ticketType.system)
      } else if (drawerType === "cabinClass") {
        // Always update cabin class filters
        _updateFilter("cabinClass", "economy", localFilters.cabinClass.economy)
        _updateFilter("cabinClass", "business", localFilters.cabinClass.business)
      } else if (drawerType === "airlines") {
        // Always update airlines filters
        _updateFilter("airlines", "mahan", localFilters.airlines.mahan)
        _updateFilter("airlines", "caspian", localFilters.airlines.caspian)
        _updateFilter("airlines", "ata", localFilters.airlines.ata)
      } else if (drawerType === "agencies") {
        // Always update agencies filters
        _updateFilter("agencies", "alibaba", localFilters.agencies.alibaba)
        _updateFilter("agencies", "flytoday", localFilters.agencies.flytoday)
        _updateFilter("agencies", "mrbilit", localFilters.agencies.mrbilit)
      } else if (drawerType === "all") {
        // Apply all changes for the "all filters" drawer

        // Update ticket type filters
        _updateFilter("ticketType", "charter", localFilters.ticketType.charter)
        _updateFilter("ticketType", "system", localFilters.ticketType.system)

        // Update cabin class filters
        _updateFilter("cabinClass", "economy", localFilters.cabinClass.economy)
        _updateFilter("cabinClass", "business", localFilters.cabinClass.business)

        // Update airlines filters
        _updateFilter("airlines", "mahan", localFilters.airlines.mahan)
        _updateFilter("airlines", "caspian", localFilters.airlines.caspian)
        _updateFilter("airlines", "ata", localFilters.airlines.ata)

        // Update agencies filters
        _updateFilter("agencies", "alibaba", localFilters.agencies.alibaba)
        _updateFilter("agencies", "flytoday", localFilters.agencies.flytoday)
        _updateFilter("agencies", "mrbilit", localFilters.agencies.mrbilit)

        // Update ranges
        setPriceRange(localPriceRange)
        setFlightTimeRange(localFlightTimeRange)
      }
    }

    // Update drawer open state
    setOpenDrawers((prev) => ({
      ...prev,
      [drawerType]: isOpen,
    }))
  }

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
                {englishToFarsiNumber(sortedFlights.length)} نتیجه
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
            <div className="my-4 flex items-center justify-start px-5 lg:hidden">
              {/* Filter Chips - Each opens a specific section */}
              <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {/* Mobile sort drawer trigger */}
                <Drawer open={openDrawers.sort} onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "sort")}>
                  <DrawerTrigger asChild>
                    <div
                      className="bg-Shade-White outline-Gray-N100 inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]"
                      onClick={() => openDrawer("sort")}
                    >
                      <Sort size="16" color="#1E1E1E" />
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-Gray-N700 text-sm leading-normal font-medium text-nowrap">
                          {" "}
                          مرتب سازی:{" "}
                        </div>
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
                            <div className="text-Gray-N600 text-right text-base leading-7 font-semibold">
                              ترتیب نمایش
                            </div>
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
                                  closeDrawer("sort")
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
                <Drawer open={openDrawers.all} onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "all")}>
                  <DrawerTrigger asChild>
                    <div
                      className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                      onClick={() => openDrawer("all")}
                    >
                      <Setting5 size="16" color="#1E1E1E" />
                      <div className="flex items-center gap-1">
                        <div className="text-Gray-N700 text-sm leading-normal font-medium">فیلتر‌ها</div>
                        {_activeFiltersCount > 0 && (
                          <div className="bg-Primary-P50 flex size-5 items-center justify-center rounded-[80px]">
                            <div className="text-Primary-P500main text-[11px] leading-none font-semibold">
                              {englishToFarsiNumber(_activeFiltersCount)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </DrawerTrigger>
                  <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                    <FilterDrawerContent
                      ref={drawerContentRef}
                      title="فیلتر‌ها"
                      activeFiltersCount={_activeFiltersCount}
                      clearFilters={_clearFilters}
                      activeSection="all"
                      filters={filters}
                      updateFilter={_updateFilter}
                      flightTimeRange={flightTimeRange}
                      setFlightTimeRange={_setFlightTimeRange}
                      priceRange={priceRange}
                      setPriceRange={_setPriceRange}
                    />
                  </DrawerContent>
                </Drawer>

                {/* Active filters first */}
                {/* Price Range Filter Chip - if active */}
                {(priceRange[0] !== 500000 || priceRange[1] !== 5000000) && (
                  <Drawer
                    open={openDrawers.priceRange}
                    onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "priceRange")}
                  >
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Primary-P50 outline-Primary-P500main mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                        onClick={() => {
                          setActiveFilterSection("priceRange")
                          setOpenDrawers((prev) => ({ ...prev, priceRange: true }))
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Primary-P500main text-sm leading-normal font-medium">
                            قیمت: {englishToFarsiNumber(Math.floor(priceRange[0] / 1000))} تا{" "}
                            {englishToFarsiNumber(Math.floor(priceRange[1] / 1000))} هزار
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                      <FilterDrawerContent
                        ref={drawerContentRef}
                        title="بازه قیمت"
                        activeFiltersCount={priceRange[0] !== 500000 || priceRange[1] !== 5000000 ? 1 : 0}
                        clearFilters={() => setPriceRange([500000, 5000000])}
                        activeSection="priceRange"
                        filters={filters}
                        updateFilter={_updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={_setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={_setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Flight Time Filter Chip - if active */}
                {(flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24) && (
                  <Drawer
                    open={openDrawers.flightTime}
                    onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "flightTime")}
                  >
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Primary-P50 outline-Primary-P500main mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                        onClick={() => {
                          setActiveFilterSection("flightTime")
                          openDrawer("flightTime")
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Primary-P500main text-sm leading-normal font-medium">
                            ساعت پرواز: {englishToFarsiNumber(flightTimeRange[0])} تا{" "}
                            {englishToFarsiNumber(flightTimeRange[1])}
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                      <FilterDrawerContent
                        ref={drawerContentRef}
                        title="ساعت پرواز رفت"
                        activeFiltersCount={flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24 ? 1 : 0}
                        clearFilters={() => setFlightTimeRange([4, 24])}
                        activeSection="flightTime"
                        filters={filters}
                        updateFilter={_updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={_setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={_setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Ticket Type Filter Chip - if active */}
                {Object.values(filters.ticketType).some(Boolean) && (
                  <Drawer
                    open={openDrawers.ticketType}
                    onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "ticketType")}
                  >
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Primary-P50 outline-Primary-P500main mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                        onClick={() => {
                          setActiveFilterSection("ticketType")
                          openDrawer("ticketType")
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Primary-P500main text-sm leading-normal font-medium">
                            نوع بلیط:{" "}
                            {[filters.ticketType.charter ? "چارتری" : null, filters.ticketType.system ? "سیستمی" : null]
                              .filter(Boolean)
                              .join("، ")}
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                      <FilterDrawerContent
                        ref={drawerContentRef}
                        title="نوع بلیط"
                        activeFiltersCount={Object.values(filters.ticketType).filter(Boolean).length}
                        clearFilters={() => _updateFilter("ticketType", "all", false)}
                        activeSection="ticketType"
                        filters={filters}
                        updateFilter={_updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={_setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={_setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Cabin Class Filter Chip - if active */}
                {Object.values(filters.cabinClass).some(Boolean) && (
                  <Drawer
                    open={openDrawers.cabinClass}
                    onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "cabinClass")}
                  >
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Primary-P50 outline-Primary-P500main mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                        onClick={() => {
                          setActiveFilterSection("cabinClass")
                          openDrawer("cabinClass")
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Primary-P500main text-sm leading-normal font-medium">
                            کلاس پروازی:{" "}
                            {[
                              filters.cabinClass.economy ? "اکونومی" : null,
                              filters.cabinClass.business ? "بیزینس" : null,
                            ]
                              .filter(Boolean)
                              .join("، ")}
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>

                    <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                      <FilterDrawerContent
                        ref={drawerContentRef}
                        title="کلاس پروازی"
                        activeFiltersCount={Object.values(filters.cabinClass).filter(Boolean).length}
                        clearFilters={() => _updateFilter("cabinClass", "all", false)}
                        activeSection="cabinClass"
                        filters={filters}
                        updateFilter={_updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={_setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={_setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Airlines Filter Chip - if active */}
                {Object.values(filters.airlines).some(Boolean) && (
                  <Drawer
                    open={openDrawers.airlines}
                    onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "airlines")}
                  >
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Primary-P50 outline-Primary-P500main mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                        onClick={() => {
                          setActiveFilterSection("airlines")
                          openDrawer("airlines")
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Primary-P500main text-sm leading-normal font-medium">
                            ایرلاین‌ها:{" "}
                            {[
                              filters.airlines.mahan ? "ماهان" : null,
                              filters.airlines.caspian ? "کاسپین" : null,
                              filters.airlines.ata ? "آتا" : null,
                            ]
                              .filter(Boolean)
                              .join("، ")}
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                      <FilterDrawerContent
                        ref={drawerContentRef}
                        title="شرکت‌های هواپیمایی"
                        activeFiltersCount={Object.values(filters.airlines).filter(Boolean).length}
                        clearFilters={() => _updateFilter("airlines", "all", false)}
                        activeSection="airlines"
                        filters={filters}
                        updateFilter={_updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={_setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={_setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Agencies Filter Chip - if active */}
                {Object.values(filters.agencies).some(Boolean) && (
                  <Drawer
                    open={openDrawers.agencies}
                    onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "agencies")}
                  >
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Primary-P50 outline-Primary-P500main mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                        onClick={() => {
                          setActiveFilterSection("agencies")
                          openDrawer("agencies")
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Primary-P500main text-sm leading-normal font-medium">
                            وبسایت‌ها:{" "}
                            {[
                              filters.agencies.alibaba ? "علی بابا" : null,
                              filters.agencies.flytoday ? "فلای تودی" : null,
                              filters.agencies.mrbilit ? "مستر بلیط" : null,
                            ]
                              .filter(Boolean)
                              .join("، ")}
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                      <FilterDrawerContent
                        ref={drawerContentRef}
                        title="وبسایت‌ها"
                        activeFiltersCount={Object.values(filters.agencies).filter(Boolean).length}
                        clearFilters={() => _updateFilter("agencies", "all", false)}
                        activeSection="agencies"
                        filters={filters}
                        updateFilter={_updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={_setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={_setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Inactive filters after active ones */}
                {/* Price Range Filter Chip - if inactive */}
                {priceRange[0] === 500000 && priceRange[1] === 5000000 && (
                  <Drawer
                    open={openDrawers.priceRange}
                    onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "priceRange")}
                  >
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                        onClick={() => {
                          setActiveFilterSection("priceRange")
                          openDrawer("priceRange")
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">قیمت</div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                      <FilterDrawerContent
                        ref={drawerContentRef}
                        title="بازه قیمت"
                        activeFiltersCount={priceRange[0] !== 500000 || priceRange[1] !== 5000000 ? 1 : 0}
                        clearFilters={() => setPriceRange([500000, 5000000])}
                        activeSection="priceRange"
                        filters={filters}
                        updateFilter={_updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={_setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={_setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Flight Time Filter Chip - if inactive */}
                {flightTimeRange[0] === 4 && flightTimeRange[1] === 24 && (
                  <Drawer
                    open={openDrawers.flightTime}
                    onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "flightTime")}
                  >
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                        onClick={() => {
                          setActiveFilterSection("flightTime")
                          openDrawer("flightTime")
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">ساعت پرواز</div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                      <FilterDrawerContent
                        ref={drawerContentRef}
                        title="ساعت پرواز رفت"
                        activeFiltersCount={flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24 ? 1 : 0}
                        clearFilters={() => setFlightTimeRange([4, 24])}
                        activeSection="flightTime"
                        filters={filters}
                        updateFilter={_updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={_setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={_setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Ticket Type Filter Chip - if inactive */}
                {!Object.values(filters.ticketType).some(Boolean) && (
                  <Drawer
                    open={openDrawers.ticketType}
                    onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "ticketType")}
                  >
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                        onClick={() => {
                          setActiveFilterSection("ticketType")
                          openDrawer("ticketType")
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">نوع بلیط</div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                      <FilterDrawerContent
                        ref={drawerContentRef}
                        title="نوع بلیط"
                        activeFiltersCount={Object.values(filters.ticketType).filter(Boolean).length}
                        clearFilters={() => _updateFilter("ticketType", "all", false)}
                        activeSection="ticketType"
                        filters={filters}
                        updateFilter={_updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={_setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={_setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Cabin Class Filter Chip - if inactive */}
                {!Object.values(filters.cabinClass).some(Boolean) && (
                  <Drawer
                    open={openDrawers.cabinClass}
                    onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "cabinClass")}
                  >
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                        onClick={() => {
                          setActiveFilterSection("cabinClass")
                          openDrawer("cabinClass")
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">کلاس پروازی</div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                      <FilterDrawerContent
                        ref={drawerContentRef}
                        title="کلاس پروازی"
                        activeFiltersCount={Object.values(filters.cabinClass).filter(Boolean).length}
                        clearFilters={() => _updateFilter("cabinClass", "all", false)}
                        activeSection="cabinClass"
                        filters={filters}
                        updateFilter={_updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={_setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={_setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Airlines Filter Chip - if inactive */}
                {!Object.values(filters.airlines).some(Boolean) && (
                  <Drawer
                    open={openDrawers.airlines}
                    onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "airlines")}
                  >
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                        onClick={() => {
                          setActiveFilterSection("airlines")
                          openDrawer("airlines")
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">ایرلاین‌ها</div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                      <FilterDrawerContent
                        ref={drawerContentRef}
                        title="شرکت‌های هواپیمایی"
                        activeFiltersCount={Object.values(filters.airlines).filter(Boolean).length}
                        clearFilters={() => _updateFilter("airlines", "all", false)}
                        activeSection="airlines"
                        filters={filters}
                        updateFilter={_updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={_setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={_setPriceRange}
                      />
                    </DrawerContent>
                  </Drawer>
                )}

                {/* Agencies Filter Chip - if inactive */}
                {!Object.values(filters.agencies).some(Boolean) && (
                  <Drawer
                    open={openDrawers.agencies}
                    onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "agencies")}
                  >
                    <DrawerTrigger asChild>
                      <div
                        className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                        onClick={() => {
                          setActiveFilterSection("agencies")
                          openDrawer("agencies")
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">وبسایت‌ها</div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
                      <FilterDrawerContent
                        ref={drawerContentRef}
                        title="وبسایت‌ها"
                        activeFiltersCount={Object.values(filters.agencies).filter(Boolean).length}
                        clearFilters={() => _updateFilter("agencies", "all", false)}
                        activeSection="agencies"
                        filters={filters}
                        updateFilter={_updateFilter}
                        flightTimeRange={flightTimeRange}
                        setFlightTimeRange={_setFlightTimeRange}
                        priceRange={priceRange}
                        setPriceRange={_setPriceRange}
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
                  updateFilter={_updateFilter}
                  clearFilters={_clearFilters}
                  flightTimeRange={flightTimeRange}
                  setFlightTimeRange={_setFlightTimeRange}
                  priceRange={priceRange}
                  setPriceRange={_setPriceRange}
                  activeFiltersCount={_activeFiltersCount}
                />
              </div>

              {/* Flight results list */}
              <div className="flex-1">
                <FlightResultsList flights={sortedFlights} onRefresh={() => getFlights(departureDate)}/>
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

// Simpler drawer content component with ref API
const FilterDrawerContent = React.forwardRef<
  {
    getLocalState: () => {
      localFilters: FilterState
      localPriceRange: [number, number]
      localFlightTimeRange: [number, number]
    }
  },
  {
    title: string
    activeFiltersCount: number
    clearFilters: () => void
    activeSection: string
    filters: FilterState
    updateFilter: (category: string, key: string, value: boolean) => void
    flightTimeRange: [number, number]
    setFlightTimeRange: (range: [number, number]) => void
    priceRange: [number, number]
    setPriceRange: (range: [number, number]) => void
  }
>(
  (
    {
      title,
      activeFiltersCount,
      clearFilters,
      activeSection,
      filters,
      updateFilter,
      flightTimeRange,
      setFlightTimeRange,
      priceRange,
      setPriceRange,
    },
    ref
  ) => {
    // Create local state copies to use within the drawer
    const [localFilters, setLocalFilters] = React.useState<FilterState>({ ...filters })
    const [localFlightTimeRange, setLocalFlightTimeRange] = React.useState<[number, number]>([...flightTimeRange])
    const [localPriceRange, setLocalPriceRange] = React.useState<[number, number]>([...priceRange])

    // Update local state when props change (for initial render)
    React.useEffect(() => {
      // Create deep copy of filters to avoid reference issues
      setLocalFilters({
        ticketType: { ...filters.ticketType },
        cabinClass: { ...filters.cabinClass },
        airlines: { ...filters.airlines },
        agencies: { ...filters.agencies },
      })
      setLocalFlightTimeRange([...flightTimeRange])
      setLocalPriceRange([...priceRange])
    }, [filters, flightTimeRange, priceRange])

    // Expose the method to get local state via ref
    React.useImperativeHandle(
      ref,
      () => ({
        getLocalState() {
          return {
            localFilters,
            localPriceRange,
            localFlightTimeRange,
          }
        },
      }),
      [localFilters, localPriceRange, localFlightTimeRange]
    )

    // Handle local filter changes
    const handleLocalFilterUpdate = (category: string, key: string, value: boolean) => {
      if (key === "all" && value === false) {
        // Clear all filters in the specific category locally
        setLocalFilters((prev) => {
          const updatedCategory: Record<string, boolean> = {}
          // Set all keys in this category to false
          Object.keys(prev[category as keyof typeof prev]).forEach((k) => {
            updatedCategory[k] = false
          })

          return {
            ...prev,
            [category]: updatedCategory,
          }
        })
      } else {
        // Regular single filter update locally
        setLocalFilters((prev) => ({
          ...prev,
          [category]: {
            ...prev[category as keyof typeof prev],
            [key]: value,
          },
        }))
      }
    }

    // Local clear filters function
    const handleLocalClearFilters = () => {
      setLocalFilters({
        ticketType: { charter: false, system: false },
        cabinClass: { economy: false, business: false },
        airlines: { mahan: false, caspian: false, ata: false },
        agencies: { alibaba: false, flytoday: false, mrbilit: false },
      })
      setLocalFlightTimeRange([4, 24])
      setLocalPriceRange([500000, 5000000])
    }

    // Calculate local active filters count
    const localActiveFiltersCount =
      Object.values(localFilters.ticketType).filter(Boolean).length +
      Object.values(localFilters.cabinClass).filter(Boolean).length +
      Object.values(localFilters.airlines).filter(Boolean).length +
      Object.values(localFilters.agencies).filter(Boolean).length +
      (localPriceRange[0] !== 500000 || localPriceRange[1] !== 5000000 ? 1 : 0) +
      (localFlightTimeRange[0] !== 4 || localFlightTimeRange[1] !== 24 ? 1 : 0)

    // Calculate total active filters for chips display
    const totalActiveFiltersForChips =
      Object.values(localFilters.ticketType).filter(Boolean).length +
      Object.values(localFilters.cabinClass).filter(Boolean).length +
      Object.values(localFilters.airlines).filter(Boolean).length +
      Object.values(localFilters.agencies).filter(Boolean).length +
      (localPriceRange[0] !== 500000 || localPriceRange[1] !== 5000000 ? 1 : 0) +
      (localFlightTimeRange[0] !== 4 || localFlightTimeRange[1] !== 24 ? 1 : 0)

    return (
      <div className="inline-flex h-full max-h-[80vh] w-full flex-col items-start justify-start">
        <DialogTitle className="bg-Shade-White border-Gray-N100 sticky top-0 z-10 inline-flex items-center self-stretch border-b py-4">
          <div className="relative inline-flex w-full items-center justify-center gap-2 self-stretch">
            <div
              className={`text-Primary-P500main absolute left-5 cursor-pointer text-[13px] leading-normal font-medium ${
                localActiveFiltersCount === 0 || activeSection !== "all" ? "invisible" : ""
              }`}
              onClick={handleLocalClearFilters}
            >
              حذف فیلتر‌ها
            </div>

            <div className="flex flex-1 items-center justify-center text-center">
              <div className="flex items-center justify-center">
                <div className="text-Gray-N600 ml-2 text-center text-base leading-7 font-semibold">{title}</div>
              </div>
              {localActiveFiltersCount > 0 && activeSection === "all" && (
                <div className="bg-Primary-P50 flex size-5 items-center justify-center gap-2 rounded-[80px]">
                  <div className="text-Primary-P500main text-[13px] leading-normal font-medium">
                    {englishToFarsiNumber(localActiveFiltersCount)}
                  </div>
                </div>
              )}
            </div>

            <div className="absolute right-5 flex items-center justify-start gap-2">
              <DrawerClose className="cursor-pointer">
                <CloseCircle size="24" color="#334155" variant="Outline" />
              </DrawerClose>
            </div>
          </div>
        </DialogTitle>

        <div className="max-h-[calc(80vh-60px)] w-full overflow-y-auto">
          {/* Active Filter Chips Section (Horizontally Scrollable) */}
          {activeSection === "all" && totalActiveFiltersForChips > 0 && (
            <div className="border-Gray-N100 w-full border-b px-5 py-1">
              <div
                className="flex items-center gap-[7px] overflow-x-auto p-2 whitespace-nowrap"
                style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}
              >
                {/* Ticket Type Filters */}
                {Object.entries(localFilters.ticketType).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={`ticketType-${key}`}
                        className="bg-Shade-White outline-Gray-N100 flex flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]"
                      >
                        <div
                          className="flex cursor-pointer items-center justify-start gap-2 py-1"
                          onClick={() => handleLocalFilterUpdate("ticketType", key, false)}
                        >
                          <div className="relative size-4 overflow-hidden rounded-[48px]">
                            <CloseCircle size="16" color="#94A3B8" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">
                            {key === "charter" ? "چارتری" : "سیستمی"}
                          </div>
                        </div>
                      </div>
                    )
                )}

                {/* Cabin Class Filters */}
                {Object.entries(localFilters.cabinClass).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={`cabinClass-${key}`}
                        className="bg-Shade-White outline-Gray-N100 flex flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]"
                      >
                        <div
                          className="flex cursor-pointer items-center justify-start gap-2 py-1"
                          onClick={() => handleLocalFilterUpdate("cabinClass", key, false)}
                        >
                          <div className="relative size-4 overflow-hidden rounded-[48px]">
                            <CloseCircle size="16" color="#94A3B8" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">
                            {key === "economy" ? "اکونومی" : "بیزینس"}
                          </div>
                        </div>
                      </div>
                    )
                )}

                {/* Airlines Filters */}
                {Object.entries(localFilters.airlines).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={`airlines-${key}`}
                        className="bg-Shade-White outline-Gray-N100 flex flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]"
                      >
                        <div
                          className="flex cursor-pointer items-center justify-start gap-2 py-1"
                          onClick={() => handleLocalFilterUpdate("airlines", key, false)}
                        >
                          <div className="relative size-4 overflow-hidden rounded-[48px]">
                            <CloseCircle size="16" color="#94A3B8" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">
                            {key === "mahan" ? "ماهان" : key === "caspian" ? "کاسپین" : "آتا"}
                          </div>
                        </div>
                      </div>
                    )
                )}

                {/* Agencies Filters */}
                {Object.entries(localFilters.agencies).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={`agencies-${key}`}
                        className="bg-Shade-White outline-Gray-N100 flex flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]"
                      >
                        <div
                          className="flex cursor-pointer items-center justify-start gap-2 py-1"
                          onClick={() => handleLocalFilterUpdate("agencies", key, false)}
                        >
                          <div className="relative size-4 overflow-hidden rounded-[48px]">
                            <CloseCircle size="16" color="#94A3B8" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">
                            {key === "alibaba" ? "علی بابا" : key === "flytoday" ? "فلای تودی" : "مستر بلیط"}
                          </div>
                        </div>
                      </div>
                    )
                )}

                {/* Price Range Filter */}
                {(localPriceRange[0] !== 500000 || localPriceRange[1] !== 5000000) && (
                  <div className="bg-Shade-White outline-Gray-N100 flex flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]">
                    <div
                      className="flex cursor-pointer items-center justify-start gap-2 py-1"
                      onClick={() => setLocalPriceRange([500000, 5000000])}
                    >
                      <div className="relative size-4 overflow-hidden rounded-[48px]">
                        <CloseCircle size="16" color="#94A3B8" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="text-Gray-N700 text-sm leading-normal font-medium">
                        بازه قیمت (تومان): {englishToFarsiNumber(Math.floor(localPriceRange[0] / 1000))} تا{" "}
                        {englishToFarsiNumber(Math.floor(localPriceRange[1] / 1000))} هزار
                      </div>
                    </div>
                  </div>
                )}

                {/* Flight Time Range Filter */}
                {(localFlightTimeRange[0] !== 4 || localFlightTimeRange[1] !== 24) && (
                  <div className="bg-Shade-White outline-Gray-N100 flex flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]">
                    <div
                      className="flex cursor-pointer items-center justify-start gap-2 py-1"
                      onClick={() => setLocalFlightTimeRange([4, 24])}
                    >
                      <div className="relative size-4 overflow-hidden rounded-[48px]">
                        <CloseCircle size="16" color="#94A3B8" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="text-Gray-N700 text-sm leading-normal font-medium">
                        ساعت پرواز: {englishToFarsiNumber(localFlightTimeRange[0])} تا{" "}
                        {englishToFarsiNumber(localFlightTimeRange[1])}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-Shade-White flex flex-col items-center justify-center gap-3 self-stretch px-5 py-4">
            {/* Filtered content based on activeSection */}
            {/* Flight Time Range */}
            {(activeSection === "all" || activeSection === "flightTime") && (
              <FilterSection title="ساعت پرواز رفت" isLast={activeSection !== "all"}>
                <FancySlider
                  value={localFlightTimeRange}
                  onValueChange={setLocalFlightTimeRange}
                  min={4}
                  max={24}
                  step={1}
                  leftLabel={formatTime(localFlightTimeRange[1])}
                  rightLabel={formatTime(localFlightTimeRange[0])}
                />
              </FilterSection>
            )}

            {/* Price Range */}
            {(activeSection === "all" || activeSection === "priceRange") && (
              <FilterSection title="بازه قیمت (تومان)" isLast={activeSection !== "all"}>
                <FancySlider
                  value={localPriceRange}
                  onValueChange={setLocalPriceRange}
                  min={500000}
                  max={5000000}
                  step={100000}
                  leftLabel={formatPrice(localPriceRange[1])}
                  rightLabel={formatPrice(localPriceRange[0])}
                />
              </FilterSection>
            )}

            {/* Ticket Type */}
            {(activeSection === "all" || activeSection === "ticketType") && (
              <FilterSection
                title="نوع بلیط"
                count={Object.values(localFilters.ticketType).filter(Boolean).length}
                isLast={activeSection !== "all"}
              >
                <FilterCheckbox
                  label="چارتر"
                  checked={localFilters.ticketType.charter}
                  onChange={(v) => handleLocalFilterUpdate("ticketType", "charter", v)}
                />
                <FilterCheckbox
                  label="سیستمی"
                  checked={localFilters.ticketType.system}
                  onChange={(v) => handleLocalFilterUpdate("ticketType", "system", v)}
                />
              </FilterSection>
            )}

            {/* Cabin Class */}
            {(activeSection === "all" || activeSection === "cabinClass") && (
              <FilterSection
                title="کلاس پروازی"
                count={Object.values(localFilters.cabinClass).filter(Boolean).length}
                isLast={activeSection !== "all"}
              >
                <FilterCheckbox
                  label="اکونومی"
                  checked={localFilters.cabinClass.economy}
                  onChange={(v) => handleLocalFilterUpdate("cabinClass", "economy", v)}
                />
                <FilterCheckbox
                  label="بیزینس"
                  checked={localFilters.cabinClass.business}
                  onChange={(v) => handleLocalFilterUpdate("cabinClass", "business", v)}
                />
              </FilterSection>
            )}

            {/* Airlines */}
            {(activeSection === "all" || activeSection === "airlines") && (
              <FilterSection
                title="شرکت‌های هواپیمایی"
                count={Object.values(localFilters.airlines).filter(Boolean).length}
                isLast={activeSection !== "all"}
              >
                <FilterCheckbox
                  label="ماهان"
                  logo="/images/logo.webp"
                  extraText="از ۲,346,890"
                  checked={localFilters.airlines.mahan}
                  onChange={(v) => handleLocalFilterUpdate("airlines", "mahan", v)}
                />
                <FilterCheckbox
                  label="کاسپین"
                  logo="/images/logo.webp"
                  extraText="از ۲,346,890"
                  checked={localFilters.airlines.caspian}
                  onChange={(v) => handleLocalFilterUpdate("airlines", "caspian", v)}
                />
                <FilterCheckbox
                  label="آتا"
                  logo="/images/logo.webp"
                  extraText="از ۲,346,890"
                  checked={localFilters.airlines.ata}
                  onChange={(v) => handleLocalFilterUpdate("airlines", "ata", v)}
                />
              </FilterSection>
            )}

            {/* Agencies */}
            {(activeSection === "all" || activeSection === "agencies") && (
              <FilterSection
                title="وبسایت‌ها"
                count={Object.values(localFilters.agencies).filter(Boolean).length}
                isLast={activeSection !== "all"}
              >
                <FilterCheckbox
                  label="علی‌بابا"
                  logo="/images/logo.webp"
                  extraText="از ۲,346,890"
                  checked={localFilters.agencies.alibaba}
                  onChange={(v) => handleLocalFilterUpdate("agencies", "alibaba", v)}
                />
                <FilterCheckbox
                  label="فلای تودی"
                  logo="/images/logo.webp"
                  extraText="از ۲,346,890"
                  checked={localFilters.agencies.flytoday}
                  onChange={(v) => handleLocalFilterUpdate("agencies", "flytoday", v)}
                />
                <FilterCheckbox
                  label="مستر بلیط"
                  logo="/images/logo.webp"
                  extraText="از ۲,346,890"
                  checked={localFilters.agencies.mrbilit}
                  onChange={(v) => handleLocalFilterUpdate("agencies", "mrbilit", v)}
                />
              </FilterSection>
            )}
          </div>
        </div>
      </div>
    )
  }
)

// Format price with commas
const formatPrice = (price: number) => {
  return englishToFarsiNumber(price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
}

// Format time as HH:MM
const formatTime = (hour: number) => {
  return englishToFarsiNumber(`${hour.toString().padStart(2, "0")}:00`)
}

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
        <div className="border-Gray-N200 size-8 overflow-hidden rounded-[48px] border p-2">
          <Image src={logo} alt={label} width={32} height={32} className="object-contain" />
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
