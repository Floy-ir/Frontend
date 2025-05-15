/**
 * Top‑level response from the flight search API.
 */
export interface FlightSearchResponse {
  /** Total number of matching flights */
  count: number;
  /** Available filter options based on current result set */
  filters: FlightFilters;
  /** Detailed flight offers */
  results: FlightResult[];
}

/**
 * Available filters for further narrowing the search.
 */
export interface FlightFilters {
  /** Minimum fare across all results */
  minPrice: number;
  /** Maximum fare across all results */
  maxPrice: number;
  /** Allowed baggage weights (e.g. [20, 30, 40]) */
  allowedWeights: number[];
  /** Available cabin classes (e.g. ["Economy","Business"]) */
  seatClasses: string[];
  /** Airlines present in the current result set */
  airlines: AirlineFilterOption[];
  /** Booking websites present in the current result set */
  websites: WebsiteFilterOption[];
}

/** A single airline filter option */
export interface AirlineFilterOption {
  uid: string;
  /** Display name */
  name: string;
  /** Optional localized name (e.g. Farsi) */
  nameFa?: string;
  /** URL to airline logo (or `null` if not available) */
  image: string | null;
  /** Lowest fare found on this airline */
  minPrice: number;
}

/** A single website filter option */
export interface WebsiteFilterOption {
  uid: string;
  name: string;
  nameFa?: string;
  image: string | null;
  minPrice: number;
}

/**
 * One flight result: a specific airline × route × time combination.
 */
export interface FlightResult {
  /** Airline operating the flight */
  airline: {
    uid: string;
    name: string;
    image: string | null;
  };
  /** IATA code or city name */
  origin: string;
  destination: string;
  /** UNIX epoch (seconds) */
  departureTimestamp: number;
  arrivalTimestamp: number;
  /** Included baggage allowance in kilograms */
  allowedWeight: number;
  /** Cabin class (e.g. "Economy", "Business") */
  seatClass: string;

  /**
   * Aggregated "cheapest" booking info for this flight:
   * - `price`: absolute lowest fare
   * - `website`: which site offers it
   * - `redirectUrl`: link to book that fare
   */
  cheapest: {
    price: number;
    website: {
      uid: string;
      name: string;
      nameFa?: string;
      image: string | null;
    };
    redirectUrl: string;
    /** If the cheapest fares differ by pax count, these may be provided */
    oneAdultRedirectUrl?: string;
    twoAdultRedirectUrl?: string;
    baseRedirectUrl?: string;
  };

  /** Detailed per‑site pricing & availability */
  websites: WebsiteOffer[];
}

/**
 * A single site's offer for a given flight result.
 */
export interface WebsiteOffer {
  uid: string;
  name: string;
  nameFa?: string;
  logo: string | null;

  /** Prices per passenger type */
  adultPrice: number;
  childPrice?: number;
  infantPrice?: number;

  /** Booking URLs */
  baseRedirectUrl: string;
  oneAdultRedirectUrl: string;
  twoAdultRedirectUrl: string;

  /** Seats still available at quoted fare */
  remainingSeats: number;
}

/**
 * Filter state used in the UI
 */
export interface FilterState {
  ticketType: { charter: boolean; system: boolean }
  cabinClass: { economy: boolean; business: boolean }
  airlines: { mahan: boolean; caspian: boolean; ata: boolean }
  agencies: { alibaba: boolean; flytoday: boolean; mrbilit: boolean }
}

/**
 * Transformed flight data for display in the UI
 */
export interface TransformedFlight {
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
    cabinClass: string
  }
  price: {
    amount: number
    formattedAmount: string
    agency: string
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
