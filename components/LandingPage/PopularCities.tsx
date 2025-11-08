"use client"

import Image, { StaticImageData } from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getCityByCode } from "@/config/cities"
import { apiFetch } from "@/services/api"
import { englishToFarsiNumber } from "@/utils/numbers"
import ahvaz from "../../public/images/ahvaz.jpg"
import isfahan from "../../public/images/isfahan.jpg"
import kish from "../../public/images/kish.jpeg"
import mashhad from "../../public/images/mashhad.jpg"
import shiraz from "../../public/images/shiraz.jpg"
import tabriz from "../../public/images/tabriz.jpg"
import tehran from "../../public/images/tehran.jpg"

// Define interface for flight data
interface FlightData {
  origin: string
  destination: string
  price: number
  [key: string]: string | number | boolean | undefined
}

interface FlightDataWithLabels extends FlightData {
  originLabel: string
  destinationLabel: string
}

const getDestinationImage = (destinationCode: string): StaticImageData => {
  switch (destinationCode) {
    case "KIH":
      return kish
    case "MHD":
      return mashhad
    case "SYZ":
      return shiraz
    case "TBZ":
      return tabriz
    case "IFN":
      return isfahan
    case "AWZ":
      return ahvaz
    default:
      return tehran
  }
}

function CityRow({
  cities,
}: {
  cities: { city: string; price: string; bg: StaticImageData; origin: string; destination: string; departingDate?: string }[]
}) {
  return (
    <div className="flex w-full gap-2">
      {cities.map((city, index) => (
        <CityCard key={index} {...city} />
      ))}
    </div>
  )
}

function CityCard({
  city,
  price,
  bg,
  large,
  origin,
  destination,
  departingDate,
}: {
  city: string
  price: string
  bg: StaticImageData
  large?: boolean
  origin?: string
  destination?: string
  departingDate?: string
}) {
  const router = useRouter()

  const handleClick = () => {
    if (origin && destination && departingDate) {
      router.push(`/flights/${origin}-${destination}?adult=1&child=0&infant=0&departing=${departingDate}&sort=cheapest`)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`relative flex ${
        large ? "h-80 w-67 px-8 py-4 md:w-80 lg:w-120" : "h-39 w-69 px-6 py-4"
      } flex-1 cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border-2 border-slate-200 transition-colors hover:border-blue-400`}
    >
      {/* Background Image */}
      <Image src={bg} alt={city} fill className="h-full w-full object-cover" priority />

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-l from-slate-800/80 to-slate-700/0" />

      {/* City Info  */}
      <div className="flex w-full items-end justify-between">
        {/* City Name */}
        <div className="flex flex-col items-start">
          <div className="text-Shade-White z-10 justify-center self-stretch text-right text-lg leading-loose font-semibold">
            {city}
          </div>
          <div className="text-Shade-White z-10 justify-center text-sm leading-normal font-normal">شروع قیمت از</div>
        </div>

        {/* Price */}
        <div className="flex flex-col items-end text-right">
          <div className="text-Shade-White z-10 mb-1 text-xs leading-none font-normal">تومان</div>
          <div className="text-Shade-White z-10 justify-center self-stretch text-base leading-7 font-semibold">
            {englishToFarsiNumber(price)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PopularCities() {
  const [cityData, setCityData] = useState<{ count: number; results: FlightDataWithLabels[] } | null>(null)

  useEffect(() => {
    const defaultOriginList = ["THR", "MHD", "KIH"]
    let originList = [...defaultOriginList]

    try {
      const stored = localStorage.getItem("app:cities:recentSelections")
      if (stored) {
        const parsed = JSON.parse(stored) as Array<{ value: string; label: string; code: string }>
        const recentCodes = parsed.map((c) => c.code)
        originList = Array.from(new Set([...recentCodes, ...defaultOriginList]))
      }
    } catch (e) {
      console.error("Failed to read from localStorage:", e)
    }

    ;(async () => {
      try {
        const query = `?favorite_cities=${originList.join(",")}`
        const response = (await apiFetch(`/flights/favorite_cities/${query}`, {
          method: "GET",
        })) as { count: number; results: FlightData[] }

        const resultsWithLabels = await Promise.all(
          response.results.map(async (flight) => {
            const originCity = flight.origin ? await getCityByCode(flight.origin) : undefined
            const destinationCity = flight.destination ? await getCityByCode(flight.destination) : undefined
            return {
              ...flight,
              originLabel: originCity ? originCity.label : flight.origin,
              destinationLabel: destinationCity ? destinationCity.label : flight.destination,
            }
          })
        )

        setCityData({ count: response.count, results: resultsWithLabels })
      } catch (error) {
        console.error("Failed to fetch flight data:", error)
      }
    })()
  }, [])

  return (
    <div className="mt-6 mb-8 flex w-full gap-2 md:mt-10 lg:mt-14 lg:flex-row">
      <div className="relative flex w-full snap-x snap-mandatory flex-nowrap gap-2 overflow-x-auto scroll-smooth sm:px-0">
        {cityData && cityData.results.length > 0 ? (
          <>
            {cityData.results[0] && (
              <div className="mb-4 shrink-0 snap-start">
                <CityCard
                  city={`${cityData.results[0].originLabel} به ${cityData.results[0].destinationLabel}`}
                  price={cityData.results[0].price.toLocaleString()}
                  bg={getDestinationImage(cityData.results[0].destination)}
                  large
                  origin={cityData.results[0].origin}
                  destination={cityData.results[0].destination}
                  departingDate={String(cityData.results[0].date)}
                />
              </div>
            )}
            <div className="flex flex-1 flex-col gap-2">
              {cityData.results
                .slice(1, 5)
                .reduce<
                  {
                    origin: string
                    destination: string
                    originLabel: string
                    destinationLabel: string
                    price: number
                    date?: string
                  }[][]
                >((rows, flight, index, arr) => {
                  if (index % 2 === 0) rows.push(arr.slice(index, index + 2))
                  return rows
                }, [])
                .map(
                  (
                    pair: {
                      origin: string
                      destination: string
                      originLabel: string
                      destinationLabel: string
                      price: number
                      date?: string
                    }[],
                    index: number
                  ) => (
                    <div key={index} className="shrink-0 snap-start">
                      <CityRow
                        cities={pair.map((flight) => ({
                          city: `${flight.originLabel} به ${flight.destinationLabel}`,
                          price: flight.price.toLocaleString(),
                          bg: getDestinationImage(flight.destination),
                          origin: flight.origin,
                          destination: flight.destination,
                          departingDate: String(flight.date),
                        }))}
                      />
                    </div>
                  )
                )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
