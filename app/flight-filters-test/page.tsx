'use client'

import React, { useState } from 'react'
import { FlightFilters } from '@/components/FlightFilters'

export default function FlightFiltersTestPage() {
  // Initial filter state
  const [filters, setFilters] = useState({
    ticketType: {
      charter: false,
      system: false,
    },
    cabinClass: {
      economy: false,
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

  // Filter ranges
  const [flightTimeRange, setFlightTimeRange] = useState<[number, number]>([9, 20])
  const [priceRange, setPriceRange] = useState<[number, number]>([1500000, 3500000])

  // Calculate active filters count
  const activeFiltersCount = 
    Object.values(filters.ticketType).filter(Boolean).length +
    Object.values(filters.cabinClass).filter(Boolean).length +
    Object.values(filters.airlines).filter(Boolean).length +
    Object.values(filters.agencies).filter(Boolean).length +
    ((flightTimeRange[0] !== 9 || flightTimeRange[1] !== 20) ? 1 : 0) +
    ((priceRange[0] !== 1500000 || priceRange[1] !== 3500000) ? 1 : 0)

  // Update specific filter
  const updateFilter = (category: string, key: string, value: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      ticketType: { charter: false, system: false },
      cabinClass: { economy: false, business: false },
      airlines: { mahan: false, caspian: false, ata: false },
      agencies: { alibaba: false, flytoday: false, mrbilit: false },
    })
    setFlightTimeRange([9, 20])
    setPriceRange([1500000, 3500000])
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-8 text-center">Flight Filters Test Page</h1>
      <div className="max-w-4xl mx-auto">
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
  )
} 