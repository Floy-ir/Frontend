"use client"
import React, { use, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RouteParams, SortKey } from "@/app/types"
import { FlightFilters } from "@/components/FlightFilters"
import { FlightSearchHeader } from "@/components/FlightSearchHeader/FlightSearchHeader"
import NoTicketFound from "@/components/FlightsPage/NoTicketFound"
import Timeline from "@/components/FlightsPage/price-timeline"
import { getCityByCode } from "@/config/cities"
import { formatDate } from "@/utils/dateUtils"
import { englishToFarsiNumber } from "@/utils/numbers"
import { FlightResultsList } from "./FlightResultsList"
import { useFlightData } from "./hooks/useFlightData"
import { useFlightFilters } from "./hooks/useFlightFilters"
import { useDrawerState } from "./hooks/useDrawerState"
import { filterFlights } from "./utils/filterFlights"
import { sortFlights } from "./utils/sortFlights"
import MobileSortAndFilter from "./components/MobileSortAndFilter"

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

  // Use our custom hooks
  const {
    flights,
    isLoading,
    hasLoadedFlights,
    setHasLoadedFlights,
    availableSeatClasses,
    availableWebsites,
    availableAirlines,
    priceRangeBounds,
    getFlights,
  } = useFlightData()

  const {
    filters,
    updateFilter,
    clearFilters,
    flightTimeRange,
    setFlightTimeRange,
    priceRange,
    setPriceRange,
    priceRangeBounds: filterPriceRangeBounds,
    setPriceRangeBounds: setFilterPriceRangeBounds,
    sortKey,
    setSortKey,
    updateURL,
    activeFiltersCount,
  } = useFlightFilters(priceRangeBounds)

  const {
    openDrawers,
    activeFilterSection,
    drawerContentRef,
    setActiveFilterSection,
    openDrawer,
    closeDrawer,
    setOpenDrawers,
  } = useDrawerState()

  // Get passenger counts and date from URL
  const adult = parseInt(unwrappedSearchParams.adult || "1")
  const child = parseInt(unwrappedSearchParams.child || "0")
  const infant = parseInt(unwrappedSearchParams.infant || "0")
  const passengerCount = adult + child + infant
  const departureDate = unwrappedSearchParams.departing || formatDate(new Date())

  // For timeline component - ensure it's always a string
  const selectedDate = unwrappedSearchParams.departing || formatDate(new Date())

  // Sort options
  const sortOptions = [
    { key: "cheapest" as SortKey, label: "ارزان‌ترین" },
    { key: "mostExpensive" as SortKey, label: "گران‌ترین" },
    { key: "earliest" as SortKey, label: "زودترین" },
    { key: "latest" as SortKey, label: "دیر‌ترین" },
  ]

  // Fetch city names
  useEffect(() => {
    const fetchOrigin = async () => {
      const origin = await getCityByCode(originCode || "")
      const destination = await getCityByCode(destinationCode || "")

      setOriginCity(origin?.label || originCode || "")
      setDestinationCity(destination?.label || destinationCode || "")
    }

    fetchOrigin()
  }, [originCode, destinationCode])

  // Update URL when filters change
  useEffect(() => {
    updateURL(
      unwrappedParams.route,
      filters,
      sortKey,
      flightTimeRange,
      priceRange
    )
  }, [filters, sortKey, flightTimeRange, priceRange, unwrappedParams.route, updateURL])

  // Sync priceRangeBounds between hooks
  useEffect(() => {
    setFilterPriceRangeBounds(priceRangeBounds)
  }, [priceRangeBounds, setFilterPriceRangeBounds])

  // Split the effect into two parts:
  // 1. Reset the loaded flag when dependencies change
  useEffect(() => {
    setHasLoadedFlights(false)
  }, [unwrappedParams.route, departureDate, setHasLoadedFlights])

  // 2. Load the data only when needed
  useEffect(() => {
    if (!hasLoadedFlights && originCode && destinationCode) {
      getFlights(originCode, destinationCode, departureDate, priceRange)
    }
  }, [hasLoadedFlights, originCode, destinationCode, departureDate, priceRange, getFlights])

  // Filter and sort flights
  const filteredFlights = filterFlights(
    flights,
    filters,
    priceRange,
    flightTimeRange,
    availableAirlines
  )
  
  const sortedAndFilteredFlights = sortFlights(filteredFlights, sortKey)

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
        updateFilter("ticketType", "charter", localFilters.ticketType.charter || false)
        updateFilter("ticketType", "system", localFilters.ticketType.system || false)
      } else if (drawerType === "cabinClass") {
        // Always update cabin class filters
        updateFilter("cabinClass", "economy", localFilters.cabinClass.economy || false)
        updateFilter("cabinClass", "business", localFilters.cabinClass.business || false)
        updateFilter("cabinClass", "premiumEconomy", localFilters.cabinClass.premiumEconomy || false)
      } else if (drawerType === "airlines") {
        // Always update airlines filters - handle the Record<string, boolean> structure
        for (const [key, value] of Object.entries(localFilters.airlines)) {
          updateFilter("airlines", key, value || false)
        }
      } else if (drawerType === "agencies") {
        // Always update agencies filters - handle the Record<string, boolean> structure
        for (const [key, value] of Object.entries(localFilters.agencies)) {
          updateFilter("agencies", key, value || false)
        }
      } else if (drawerType === "all") {
        // Apply all changes for the "all filters" drawer

        // Update ticket type filters
        updateFilter("ticketType", "charter", localFilters.ticketType.charter || false)
        updateFilter("ticketType", "system", localFilters.ticketType.system || false)

        // Update cabin class filters
        updateFilter("cabinClass", "economy", localFilters.cabinClass.economy || false)
        updateFilter("cabinClass", "business", localFilters.cabinClass.business || false)
        updateFilter("cabinClass", "premiumEconomy", localFilters.cabinClass.premiumEconomy || false)

        // Update airlines filters
        for (const [key, value] of Object.entries(localFilters.airlines)) {
          updateFilter("airlines", key, value || false)
        }

        // Update agencies filters
        for (const [key, value] of Object.entries(localFilters.agencies)) {
          updateFilter("agencies", key, value || false)
        }

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
        {/* Timeline component from HEAD branch */}
        <div className="mb-0 lg:mb-8">
          <Timeline
            originCityCode={originCode || ""}
            destinationCityCode={destinationCode || ""}
            selectedDate={selectedDate}
            adult={String(adult)}
            child={String(child)}
            infant={String(infant)}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="border-primary mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
            <p className="text-Gray-N600 text-lg font-medium">در حال جستجوی پروازها...</p>
          </div>
        ) : sortedAndFilteredFlights.length > 0 ? (
          <>
            <div className="mb-6 hidden flex-row items-start justify-between lg:flex">
              <p className="text-Gray-N800 hidden text-right text-sm font-semibold lg:block">
                {englishToFarsiNumber(sortedAndFilteredFlights.length)} نتیجه
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

            {/* Mobile sort and filter options */}
            <MobileSortAndFilter
              openDrawers={openDrawers}
              sortKey={sortKey}
              setSortKey={setSortKey}
              sortOptions={sortOptions}
              activeFiltersCount={activeFiltersCount}
              filters={filters}
              updateFilter={updateFilter}
              flightTimeRange={flightTimeRange}
              setFlightTimeRange={setFlightTimeRange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              priceRangeBounds={priceRangeBounds}
              availableSeatClasses={availableSeatClasses}
              availableWebsites={availableWebsites}
              availableAirlines={availableAirlines}
              drawerContentRef={drawerContentRef}
              handleDrawerOpenChange={handleDrawerOpenChange}
              openDrawer={openDrawer}
              setActiveFilterSection={setActiveFilterSection}
              clearFilters={clearFilters}
            />

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
                  priceRangeBounds={priceRangeBounds}
                  availableSeatClasses={availableSeatClasses}
                  availableWebsites={availableWebsites}
                  availableAirlines={availableAirlines}
                />
              </div>

              {/* Flight results list */}
              <div className="flex-1">
                <FlightResultsList 
                  flights={sortedAndFilteredFlights} 
                  onRefresh={() => {
                    if (originCode && destinationCode) {
                      getFlights(originCode, destinationCode, departureDate, priceRange)
                    }
                  }} 
                />
              </div>
            </div>
          </>
        ) : flights.length > 0 && activeFiltersCount > 0 ? (
          // No flights due to filters
          <>
            <div className="flex flex-row gap-4">
              {/* Flight filters sidebar - keep visible */}
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
                  priceRangeBounds={priceRangeBounds}
                  availableSeatClasses={availableSeatClasses}
                  availableWebsites={availableWebsites}
                  availableAirlines={availableAirlines}
                />
              </div>

              {/* No flights found message with actions - FOR FILTERED RESULTS */}
              <div className="flex-1">
                <NoTicketFound type="filter" onClearFilters={clearFilters} />
              </div>
            </div>
          </>
        ) : (
          // No flights at all for this day
          <>
            <div className="container mx-auto flex max-w-266 flex-col items-center justify-center p-0 lg:px-4 lg:py-6">
              <NoTicketFound
                type="noFlights"
                onChangeSearch={() => {
                  // Scroll to the top of the page
                  window.scrollTo({ top: 0, behavior: "smooth" })

                  // Find header search toggle button and click it
                  const searchToggleElement = document.querySelector('[data-search-toggle="true"]')
                  if (searchToggleElement instanceof HTMLElement) {
                    searchToggleElement.click()
                  }
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
