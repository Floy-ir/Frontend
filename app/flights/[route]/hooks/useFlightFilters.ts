import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FilterState, SortKey } from '@/app/types'

export function useFlightFilters(
  initialPriceRangeBounds: [number, number] = [500000, 5000000]
) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  
  // Initialize sort key from URL
  const [sortKey, setSortKey] = useState<SortKey>(
    (urlSearchParams.get('sort') as SortKey) || 'cheapest'
  )

  // Parse filter values from URL
  const getInitialFilterState = () => {
    const ticketParam = urlSearchParams.get('ticketType') || ''
    const cabinParam = urlSearchParams.get('cabinClass') || ''
    const airlinesParam = urlSearchParams.get('airlines') || ''
    const agenciesParam = urlSearchParams.get('agencies') || ''

    // Create record objects for airlines and agencies
    const airlineValues: Record<string, boolean> = {}
    airlinesParam
      .split(',')
      .filter(Boolean)
      .forEach((airline) => {
        airlineValues[airline] = true
      })

    const agencyValues: Record<string, boolean> = {}
    agenciesParam
      .split(',')
      .filter(Boolean)
      .forEach((agency) => {
        agencyValues[agency] = true
      })

    return {
      ticketType: {
        charter: ticketParam.includes('charter'),
        system: ticketParam.includes('system'),
      },
      cabinClass: {
        economy: cabinParam.includes('economy'),
        business: cabinParam.includes('business'),
        premiumEconomy: cabinParam.includes('premiumEconomy'),
      },
      airlines: airlineValues,
      agencies: agencyValues,
    }
  }

  // Get time range from URL
  const getInitialTimeRange = (): [number, number] => {
    const timeParam = urlSearchParams.get('flightTime')
    if (timeParam) {
      const parts = timeParam.split('-')
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
    const priceParam = urlSearchParams.get('priceRange')
    if (priceParam) {
      const parts = priceParam.split('-')
      if (parts.length === 2) {
        const min = parseInt(parts[0]!)
        const max = parseInt(parts[1]!)
        if (!isNaN(min) && !isNaN(max)) {
          return [min, max]
        }
      }
    }
    // Use dynamic bounds from API if available, otherwise fallback to defaults
    return [initialPriceRangeBounds[0], initialPriceRangeBounds[1]]
  }

  // Shared filters state
  const [filters, setFilters] = useState<FilterState>(getInitialFilterState())
  const [flightTimeRange, setFlightTimeRange] = useState<[number, number]>(getInitialTimeRange())
  const [priceRange, setPriceRange] = useState<[number, number]>(getInitialPriceRange())
  const [priceRangeBounds, setPriceRangeBounds] = useState<[number, number]>(initialPriceRangeBounds)

  // Update URL when filters change
  const updateURL = (
    route: string,
    currentFilters: FilterState,
    currentSortKey: SortKey,
    currentFlightTimeRange: [number, number],
    currentPriceRange: [number, number]
  ) => {
    const currentUrlParams = new URLSearchParams(urlSearchParams.toString())

    // Update sort in URL
    currentUrlParams.set('sort', currentSortKey)

    // Update ticket types in URL
    const ticketTypes = Object.entries(currentFilters.ticketType)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)

    if (ticketTypes.length > 0) {
      currentUrlParams.set('ticketType', ticketTypes.join(','))
    } else {
      currentUrlParams.delete('ticketType')
    }

    // Update cabin class in URL
    const cabinClasses = Object.entries(currentFilters.cabinClass)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)

    if (cabinClasses.length > 0) {
      currentUrlParams.set('cabinClass', cabinClasses.join(','))
    } else {
      currentUrlParams.delete('cabinClass')
    }

    // Update airlines in URL
    const airlines = Object.entries(currentFilters.airlines)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)

    if (airlines.length > 0) {
      currentUrlParams.set('airlines', airlines.join(','))
    } else {
      currentUrlParams.delete('airlines')
    }

    // Update agencies in URL
    const agencies = Object.entries(currentFilters.agencies)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)

    if (agencies.length > 0) {
      currentUrlParams.set('agencies', agencies.join(','))
    } else {
      currentUrlParams.delete('agencies')
    }

    // Update flight time range in URL if changed from default
    if (currentFlightTimeRange[0] !== 4 || currentFlightTimeRange[1] !== 24) {
      currentUrlParams.set('flightTime', `${currentFlightTimeRange[0]}-${currentFlightTimeRange[1]}`)
    } else {
      currentUrlParams.delete('flightTime')
    }

    // Update price range in URL if changed from default
    if (currentPriceRange[0] !== priceRangeBounds[0] || currentPriceRange[1] !== priceRangeBounds[1]) {
      currentUrlParams.set('priceRange', `${currentPriceRange[0]}-${currentPriceRange[1]}`)
    } else {
      currentUrlParams.delete('priceRange')
    }

    // Update the URL without page reload
    router.replace(`/flights/${route}?${currentUrlParams.toString()}`, { scroll: false })
  }

  // Calculate active filters count
  const getActiveFiltersCount = () => {
    return (
      Object.values(filters).reduce((count, category) => count + Object.values(category).filter(Boolean).length, 0) +
      (priceRange[0] !== priceRangeBounds[0] || priceRange[1] !== priceRangeBounds[1] ? 1 : 0) +
      (flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24 ? 1 : 0)
    )
  }

  // Handler for filter changes
  const updateFilter = (category: string, key: string, value: boolean) => {
    if (key === 'all' && value === false) {
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
  }

  const clearFilters = () => {
    setFilters({
      ticketType: { charter: false, system: false },
      cabinClass: { economy: false, business: false, premiumEconomy: false },
      airlines: {},
      agencies: {},
    })
    setFlightTimeRange([4, 24])
    setPriceRange(priceRangeBounds)
  }

  // Return the hook values and functions
  return {
    filters,
    updateFilter,
    clearFilters,
    flightTimeRange,
    setFlightTimeRange,
    priceRange,
    setPriceRange,
    priceRangeBounds,
    setPriceRangeBounds,
    sortKey,
    setSortKey,
    updateURL,
    activeFiltersCount: getActiveFiltersCount(),
  }
} 