// Flight-related type definitions

export interface Airline {
  uid: string;
  name: string;
  image: string | null;
  min_price?: number;
}

export interface Website {
  uid: string;
  name: string;
  name_fa: string;
  image: string | null;
  min_price?: number;
}

export interface WebsiteDetail {
  detail: Website;
  adult_price: number;
  child_price: number | null;
  infant_price: number | null;
  base_redirect_url: string;
  one_adult_redirect_url: string | null;
  two_adult_redirect_url: string | null;
  remaining_seat: number;
}

export interface FlightFilters {
  min_price: number;
  max_price: number;
  allowed_weights: number[];
  seat_classes: string[];
  airlines: Airline[];
  websites: Website[];
}

export interface FlightResult {
  airline: Airline;
  origin: string;
  destination: string;
  departure_timestamp: number;
  arrival_timestamp: number;
  allowed_weight: number;
  seat_class: string;
  cheapest_price: number;
  cheapest_base_redirect_url: string;
  cheapest_one_adult_redirect_url: string | null;
  cheapest_two_adult_redirect_url: string | null;
  cheapest_website: Website;
  websites: WebsiteDetail[];
}

export interface FlightSearchResponseData {
  /** Total number of matching flights */
  count: number;
  /** Available filter options based on current result set */
  filters: FlightFilters;
  /** Detailed flight offers */
  results: FlightResult[];
}

export interface TransformedDuration {
  hours: number;
  minutes: number;
}

export interface TransformedAirline {
  name: string;
  logo: string;
}

export interface FlightInfo {
  baggage: string;
  cabinClass: string;
}

export interface PriceInfo {
  amount: number;
  formattedAmount: string;
  agency: string;
  agencyLogo: string;
  label: string;
  base_redirect_url: string;
  one_adult_redirect_url: string | null;
  two_adults_redirect_url: string | null;
}

export interface TransformedFlight {
  id: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  duration: TransformedDuration;
  airline: TransformedAirline;
  flightInfo: FlightInfo;
  price: PriceInfo;
  otherSellersCount: number;
  websites: WebsiteDetail[];
} 