// Travel basket related type definitions

export interface BasketFlightItem {
  id: string
  departureTime: string
  arrivalTime: string
  origin: string
  destination: string
  duration: {
    hours: number
    minutes: number
  }
  airline: {
    name: string
    logo: string
  }
  flightInfo: {
    baggage: string
    cabinClass: string
  }
  price: {
    amount: number
    formattedAmount: string
    agency: string
    agencyLogo: string
    base_redirect_url: string
  }
}
