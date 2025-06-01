import { useState, useRef, useEffect } from "react"
import { Airline, FlightResult, FlightSearchResponseData, TransformedFlight, Website } from "@/app/types"
import { apiFetch } from "@/services/api/index"
import dude from "@/public/images/flash-circle-outline.svg"

export function useFlightData() {
  // State for flight data
  const [flights, setFlights] = useState<TransformedFlight[]>([])
  const [availableSeatClasses, setAvailableSeatClasses] = useState<string[]>([])
  const [availableWebsites, setAvailableWebsites] = useState<Website[]>([])
  const [availableAirlines, setAvailableAirlines] = useState<Airline[]>([])
  const [priceRangeBounds, setPriceRangeBounds] = useState<[number, number]>([500000, 5000000])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasLoadedFlights, setHasLoadedFlights] = useState(false)
  
  // Add this ref to track the last fetched date
  const lastFetchedDateRef = useRef<string>("")

  // Transform flight data function
  const transformFlightData = (input: FlightResult, id: string = "1"): TransformedFlight => {
    const departure = new Date(input.departure_timestamp * 1000)
    const arrival = new Date(input.arrival_timestamp * 1000)

    const durationMs = arrival.getTime() - departure.getTime()
    const duration = {
      hours: Math.floor(durationMs / (1000 * 60 * 60)),
      minutes: Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60)),
    }

    const toPersianTime = (date: Date) =>
      date
        .toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", hour12: false })
        .replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹".charAt(parseInt(d)))

    // Transform websites to match FlightData's websites structure
    const transformedWebsites = input.websites.map((website) => ({
      adult_price: website.adult_price,
      base_redirect_url: website.base_redirect_url,
      child_price: website.child_price,
      detail: {
        uid: website.detail.uid,
        name: website.detail.name,
        name_fa: website.detail.name_fa,
        image: website.detail.image,
      },
      infant_price: website.infant_price,
      one_adult_redirect_url: website.one_adult_redirect_url || "",
      remaining_seat: website.remaining_seat,
      two_adult_redirect_url: website.two_adult_redirect_url || "",
    }))

    return {
      id,
      departureTime: toPersianTime(departure),
      arrivalTime: toPersianTime(arrival),
      duration,
      origin: input.origin,
      destination: input.destination,
      airline: {
        name: input.airline.name || "نامشخص",
        logo: input.airline.image ?? dude.src,
      },
      flightInfo: {
        baggage: `${input.allowed_weight} `,
        cabinClass:
          input.seat_class === "Economy" ? "اکونومی" : input.seat_class === "Business" ? "بیزینس" : input.seat_class,
      },
      price: {
        amount: input.cheapest_price,
        formattedAmount: input.cheapest_price.toLocaleString("fa-IR"),
        agency: input.cheapest_website?.name_fa ?? "",
        agency_eng: input.cheapest_website?.name ?? "",
        agencyLogo: input.cheapest_website?.image ?? "",
        label: "ارزان ترین",
        base_redirect_url: input.cheapest_base_redirect_url ?? "",
        one_adult_redirect_url: input.cheapest_one_adult_redirect_url ?? input.cheapest_base_redirect_url,
        two_adults_redirect_url: input.cheapest_two_adult_redirect_url ?? input.cheapest_base_redirect_url,
      },
      otherSellersCount: input.websites.length,
      websites: transformedWebsites,
    }
  }

  // Fetch flights data
  const getFlights = async (originCode: string, destinationCode: string, departureDate: string, priceRange: [number, number]) => {
    try {
      setIsLoading(true)

      const startOfDay = new Date(`${departureDate}T00:00:00`).getTime() / 1000
      const endOfDay = new Date(`${departureDate}T23:59:59`).getTime() / 1000 + 1
      
      const data = await apiFetch<FlightSearchResponseData>("/flights/", {
        params: {
          origin: originCode,
          destination: destinationCode,
          departure_timestamp__gte: Math.max(startOfDay, Math.floor(Date.now() / 1000)),
          departure_timestamp__lte: endOfDay,
        },
      })

      if (data?.results) {
        const transformed = data.results.map((flight, index) => transformFlightData(flight, (index + 1).toString()))
        setFlights(transformed)

        // Update price range bounds if available in the API response
        if (data.filters && typeof data.filters.min_price === "number" && typeof data.filters.max_price === "number") {
          // Make sure max is at least min + 1 to avoid slider issues
          const max = Math.max(data.filters.max_price, data.filters.min_price + 1)
          const newBounds: [number, number] = [data.filters.min_price, max]

          // Only update if bounds actually changed or date changed
          const boundsChanged = newBounds[0] !== priceRangeBounds[0] || newBounds[1] !== priceRangeBounds[1]
          const dateChanged = lastFetchedDateRef.current !== departureDate

          if (boundsChanged) {
            setPriceRangeBounds(newBounds)
          }

          // Update last fetched date
          lastFetchedDateRef.current = departureDate
        }

        // Update available seat classes from API response
        if (data.filters && data.filters.seat_classes) {
          setAvailableSeatClasses(data.filters.seat_classes)
        }

        // Update available websites and airlines from API response
        if (data.filters && data.filters.websites) {
          setAvailableWebsites(data.filters.websites)
        }

        if (data.filters && data.filters.airlines) {
          setAvailableAirlines(data.filters.airlines)
        }

        // Mark that we've loaded data
        setHasLoadedFlights(true)
      } else {
        // No results returned, clear previous flights
        setFlights([])
        setHasLoadedFlights(true)
      }
    } catch (err) {
      console.error("Error fetching flights:", err)
      // Clear previous flights on error
      setFlights([])
      setHasLoadedFlights(true)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    flights,
    isLoading,
    hasLoadedFlights,
    setHasLoadedFlights,
    availableSeatClasses,
    availableWebsites,
    availableAirlines,
    priceRangeBounds,
    getFlights,
    setFlights
  }
} 