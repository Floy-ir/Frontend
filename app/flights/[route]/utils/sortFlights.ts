import { SortKey, TransformedFlight } from "@/app/types"

export function sortFlights(flights: TransformedFlight[], sortKey: SortKey): TransformedFlight[] {
  return [...flights]
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
} 