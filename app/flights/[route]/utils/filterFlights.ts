import { Airline, FilterState, TransformedFlight } from "@/app/types"

export function filterFlights(
  flights: TransformedFlight[],
  filters: FilterState,
  priceRange: [number, number],
  flightTimeRange: [number, number],
  availableAirlines: Airline[]
): TransformedFlight[] {
  return flights.filter((flight) => {
    // Filter by price range
    if (flight.price.amount < priceRange[0] || flight.price.amount > priceRange[1]) {
      return false
    }

    // Filter by flight time range
    // Only apply if we have a valid departure time
    const departureTime = flight.departureTime
    if (departureTime) {
      // Try to extract hour as a number by:
      // 1. First checking for Persian digits (۰-۹)
      // 2. If not found, try normal digits (0-9)
      let departureHour: number | null = null

      // First try Persian digits pattern
      const persianMatch = departureTime.match(/^([۰۱۲۳۴۵۶۷۸۹]+):/)
      if (persianMatch && persianMatch[1]) {
        // Convert Persian digits to numbers
        const persianDigits = "۰۱۲۳۴۵۶۷۸۹"
        let hour = 0
        for (const digit of persianMatch[1]) {
          const index = persianDigits.indexOf(digit)
          if (index !== -1) {
            hour = hour * 10 + index
          }
        }
        departureHour = hour
      } else {
        // Try regular digits
        const regularMatch = departureTime.match(/^(\d+):/)
        if (regularMatch && regularMatch[1]) {
          departureHour = parseInt(regularMatch[1], 10)
        }
      }

      // Apply filter if we successfully extracted a valid hour
      if (departureHour !== null && (departureHour < flightTimeRange[0] || departureHour > flightTimeRange[1])) {
        return false
      }
    }

    // Filter by cabin class if any selected
    if (Object.values(filters.cabinClass).some(Boolean)) {
      // Map cabin class from flight to filter key
      const cabinClassMapping: Record<string, string> = {
        اکونومی: "economy",
        بیزینس: "business",
        "اکونومی پریمیوم": "premiumEconomy",
      }

      const flightCabinClass = flight.flightInfo.cabinClass || ""
      const cabinClassKey = cabinClassMapping[flightCabinClass]

      // Only check if we found a matching cabin class key
      if (cabinClassKey && !filters.cabinClass[cabinClassKey as keyof typeof filters.cabinClass]) {
        return false
      }
    }

    // Filter by airlines if any selected
    if (Object.values(filters.airlines).some(Boolean)) {
      // Find the airline UID based on name
      const airlineUID = availableAirlines.find((a) => a.name === flight.airline.name)?.uid

      if (!airlineUID || !filters.airlines[airlineUID]) {
        return false
      }
    }

    // Filter by agencies (websites) if any selected
    if (Object.values(filters.agencies).some(Boolean)) {
      // Check if at least one website offering this flight matches the filter
      const hasMatchingWebsite = flight.websites.some((website) => filters.agencies[website.detail.uid])

      if (!hasMatchingWebsite) {
        return false
      }
    }

    return true
  })
} 