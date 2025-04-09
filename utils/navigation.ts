import { formatDate } from './dateUtils'
import { PassengerCount } from '@/components/PassengerSelector/PassengerSelector'

/**
 * Generate a URL for flight search results
 */
export function createFlightSearchUrl(
  originCode: string,
  destinationCode: string,
  departureDate: Date | null,
  passengers: PassengerCount
): string {
  // Create the base path
  const path = `/flights/${originCode}-${destinationCode}`
  
  // Create the query parameters
  const query = new URLSearchParams({
    adult: String(passengers.adult),
    child: String(passengers.child),
    infant: String(passengers.infant),
  })
  
  // Add departure date if available
  if (departureDate) {
    query.append('departing', formatDate(departureDate))
  }
  
  // Return the complete URL
  return `${path}?${query.toString()}`
} 