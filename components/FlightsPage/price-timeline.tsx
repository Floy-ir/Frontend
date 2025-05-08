"use client"

interface FlightData {
  price: number
  date: string
  origin: string
  destination: string
}

interface FlightResponse {
  results: FlightData[]
}

// import { ArrowLeft2, ArrowRight2 } from "iconsax-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import img from "@/public/images/arrow-right.svg"
import { apiFetch } from "@/services/api"
import { formatToJalali } from "@/utils/dateUtils"
import { createFlightSearchUrl } from "@/utils/navigation"
import { englishToFarsiNumber } from "@/utils/numbers"

const Timeline = ({
  originCityCode,
  destinationCityCode,
  selectedDate,
  adult,
  child,
  infant,
  autoScrollToSelected,
}: {
  originCityCode: string
  destinationCityCode: string
  selectedDate: string
  adult: string
  child: string
  infant: string
  autoScrollToSelected?: boolean
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Initialize the selected date from the 'departing' query param
  const [selectedDay, setSelectedDay] = useState<string>(selectedDate)
  const [data, setData] = useState<FlightData[]>([])

  // Passengers count
  const passengers = {
    adult: parseInt(adult, 10),
    child: parseInt(child, 10),
    infant: parseInt(infant, 10),
  }

  // Fetch cheapest flights for timeline
  useEffect(() => {
    fetchCheapestFlights(selectedDate)
  }, []) // runs once on mount

  const fetchCheapestFlights = async (referenceDate: string) => {
    // const referenceDate = selectedDate // should be in 'YYYY-MM-DD' format
    const query = new URLSearchParams({
      origin: originCityCode,
      destination: destinationCityCode,
      reference_date: referenceDate,
      forward_day: "7",
      backward_day: "8",
    }).toString()
    try {
      const response: FlightResponse | undefined = await apiFetch(`/flights/cheapest?${query}`)
      console.log("Cheapest flight data:", response)
      if (response) {
        setData(response.results || [])
        isScroll = true
      } else {
        console.error("No flight data returned")
        setData([])
      }
    } catch (err) {
      console.error("Error fetching cheapest flights", err)
    }
  }

  // Calculate the min and max price
  const minPrice = Math.min(...data.filter((item) => item.price).map((item) => item.price || Infinity))
  const maxPrice = Math.max(...data.filter((item) => item.price).map((item) => item.price || -Infinity))

  let isScroll = true

  const handleDateSelection = (newDate: string) => {
    isScroll = false

    const dates = data.map((item) => item.date)
    const isEdge = newDate === dates[0] || newDate === dates[dates.length - 1]

    if (isEdge) {
      fetchCheapestFlights(newDate)
    }

    const url = createFlightSearchUrl(originCityCode, destinationCityCode, new Date(newDate), passengers)
    router.push(url)

    setSelectedDay(newDate)
  }

  useEffect(() => {
    if (isScroll && autoScrollToSelected && scrollRef.current) {
      const selectedEl = scrollRef.current.querySelector('[data-selected="true"]') as HTMLElement
      if (selectedEl) {
        const container = scrollRef.current
        const offsetLeft = selectedEl.offsetLeft - container.offsetWidth / 2 + selectedEl.offsetWidth / 2
        container.scrollTo({ left: offsetLeft, behavior: "smooth" })
      }
    }
  }, [isScroll, selectedDate])

  return (
    <div className="relative max-w-screen items-center justify-center">
      {/* Gradient */}
      <div className="pointer-events-none absolute inset-0 z-9 flex w-full justify-between">
        <div className="h-full w-[69px] bg-gradient-to-l from-white to-transparent lg:rounded-2xl"></div>
        <div className="h-full w-[69px] bg-gradient-to-r from-white to-transparent lg:rounded-2xl"></div>
      </div>

      {/* buttons */}
      <Image
        src={img}
        alt="scroll left"
        width={24}
        height={24}
        onClick={() => {
          if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })
          }
        }}
        className="absolute top-1/3 left-4 z-10 hidden rotate-180 cursor-pointer md:block"
      />
      <Image
        src={img}
        alt="scroll right"
        width={24}
        height={24}
        onClick={() => {
          if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })
          }
        }}
        className="absolute top-1/3 right-4 z-10 hidden cursor-pointer lg:block"
      />

      {/* Timeline scroll area */}
      <div
        ref={scrollRef}
        className="bg-Shade-White outline-Gray-N100 relative inline-flex h-[74px] w-full snap-x snap-mandatory flex-nowrap items-center gap-3 overflow-x-auto scroll-smooth py-3 outline outline-offset-[-1px] md:h-[85px] lg:rounded-2xl"
      >
        <div className="flex snap-end gap-3 px-3">
          {data.map((item, index) => {
            const isSelected = selectedDay === item.date
            let priceColor = "text-gray-700" // Default color

            if (item.price === minPrice) {
              priceColor = "text-Success-s600" // Green for min price
            } else if (item.price === maxPrice) {
              priceColor = "text-Error-E600" // Red for max price
            }

            // Get the Jalali date and day of the week
            const jalaliDate = formatToJalali(new Date(item.date))
            return (
              <div
                key={index}
                data-selected={isSelected}
                onClick={() => handleDateSelection(item.date)}
                className={`inline-flex h-[50px] w-[87px] shrink-0 cursor-pointer snap-end flex-col items-center justify-center rounded-sm px-1 py-2 outline-offset-[-1px] md:h-[57] md:w-[113px] ${
                  isSelected ? "bg-Primary-P50 border-Primary-P300 border-2" : "bg-Gray-N50 outline-Gray-N200 outline"
                } `}
              >
                <div
                  className={`justify-center text-center ${
                    isSelected ? "text-Primary-P500main" : "text-Gray-N500"
                  } text-[11px] leading-none font-medium`}
                >
                  <span className="inline md:hidden">
                    {`${formatToJalali(new Date(item.date))?.split(" ")[0]?.[0]}- ${formatToJalali(
                      new Date(item.date)
                    )?.split(" ")[1]} ${formatToJalali(new Date(item.date))?.split(" ")[2]}`}
                  </span>

                  <span className="hidden md:inline">
                    {jalaliDate
                      ? `${jalaliDate.split(" ")[0]} - ${jalaliDate.split(" ")[1]} ${jalaliDate.split(" ")[2]}`
                      : "-"}
                  </span>
                </div>
                <div
                  className={`mt-1 justify-center text-center ${
                    isSelected ? "text-Primary-P500main" : `${priceColor}`
                  } text-[13px] leading-normal font-medium`}
                >
                  {item.price === 0
                    ? "-"
                    : item.price
                    ? englishToFarsiNumber(item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "،"))
                    : "-"}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Timeline
