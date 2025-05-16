// Flight-related type definitions

export interface Airline {
  uid: string;
  name: string;
  image: string | null;
}

export interface Website {
  uid: string;
  name: string;
  name_fa: string;
  image: string | null;
}

export interface WebsiteDetail {
  adult_price: number;
  base_redirect_url: string;
  child_price: number | null;
  detail: Website;
  infant_price: number | null;
  one_adult_redirect_url: string;
  remaining_seat: number;
  two_adult_redirect_url: string;
}

export interface FlightData {
  airline: Airline;
  allowed_weight: number;
  arrival_timestamp: number;
  cheapest_base_redirect_url: string;
  cheapest_one_adult_redirect_url: string | null;
  cheapest_price: number;
  cheapest_two_adult_redirect_url: string | null;
  cheapest_website: Website;
  departure_timestamp: number;
  destination: string;
  origin: string;
  seat_class: string;
  websites: WebsiteDetail[];
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