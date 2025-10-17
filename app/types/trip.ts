export type ActivityType = "transportation" | "destination" | "accommodation" | "attraction"

export interface Location {
  lat: number
  lng: number
  name: string
}

export interface BaseActivity {
  id: string
  type: ActivityType
  time?: string
}

export interface Transportation extends BaseActivity {
  type: "transportation"
  mode: "train" | "flight" | "bus" | "car"
  origin: string
  destination: string
  duration: string
  departureTime?: string
  arrivalTime?: string
  recommendedFlight?: {
    airline: string
    airlineLogo?: string
    departureTime: string
    arrivalTime: string
    duration?: {
      hours: number
      minutes: number
    }
    flightInfo?: {
      baggage: string
      cabinClass: string
    }
    price: {
      amount: number
      formattedAmount: string
      agency: string
      agencyLogo?: string
      label?: string
    }
  }
}

export interface Destination extends BaseActivity {
  type: "destination"
  name: string
  description: string
  image?: string
  location: Location
}

export interface Accommodation extends BaseActivity {
  type: "accommodation"
  name: string
  rating: number
  reviewCount: number
  guestCount: number
  nightCount: number
  pricePerNight?: string
  image?: string
  location: Location
}

export interface Attraction extends BaseActivity {
  type: "attraction"
  name: string
  description?: string
  image?: string
  location: Location
  estimatedDuration?: string
}

export type Activity = Transportation | Destination | Accommodation | Attraction

export interface TripDay {
  date: string
  dayName: string
  activities: Activity[]
}

export interface TripPlan {
  id: string
  title: string
  startDate: string
  endDate: string
  travelerCount: number
  days: TripDay[]
  mainLocation: Location
}
