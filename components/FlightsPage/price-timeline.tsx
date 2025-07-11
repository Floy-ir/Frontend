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
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import img from "@/public/images/arrow-right.svg"
import { apiFetch } from "@/services/api"
import { formatToJalali } from "@/utils/dateUtils"
import { createFlightSearchUrl } from "@/utils/navigation"
import { englishToFarsiNumber } from "@/utils/numbers"

export const fetchprices = async (
  referenceDate: string,
  originCityCode: string,
  destinationCityCode: string,
  setData: React.Dispatch<React.SetStateAction<FlightData[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true)
  // Dynamically adjust backward_day to avoid including days before today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const refDate = new Date(referenceDate)
  refDate.setHours(0, 0, 0, 0)

  const finalReferenceDate = refDate < today ? today : refDate
  const finalReferenceDateStr = finalReferenceDate.toISOString().split("T")[0]

  const timeDiff = refDate.getTime() - today.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const safeBackwardDay = Math.max(-1, daysDiff - 1)
  const forward = safeBackwardDay > 7 ? 11 : 15 - safeBackwardDay

  const query = new URLSearchParams({
    origin: originCityCode,
    destination: destinationCityCode,
    reference_date: finalReferenceDateStr || "",
    forward_day: forward.toString(),
    backward_day: safeBackwardDay > 10 ? 10 : safeBackwardDay.toString(),
  } as Record<string, string>).toString()
  try {
    console.log(query)
    const response: FlightResponse | undefined = await apiFetch(`/flights/cheapest?${query}`)
    // console.log("Cheapest flight data:", response)
    if (response) {
      setData(response.results || [])
    } else {
      console.error("No flight data returned")
      setData([])
    }
  } catch (err) {
    console.error("Error fetching cheapest flights", err)
  }
  setIsLoading(false)
}

const Timeline = ({
  originCityCode,
  destinationCityCode,
  selectedDate,
  adult,
  child,
  infant,
  isLoading,
  setIsLoading,
  data,
  setData,
}: {
  originCityCode: string
  destinationCityCode: string
  selectedDate: string
  adult: string
  child: string
  infant: string
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  data: FlightData[]
  setData: React.Dispatch<React.SetStateAction<FlightData[]>>
}) => {
  const router = useRouter()

  // Initialize the selected date from the 'departing' query param
  const searchParams = useSearchParams()
  const departingParam = searchParams.get("departing") || selectedDate
  const [selectedDay, setSelectedDay] = useState<string>(departingParam)

  // Calculate the min and max price
  const minPrice = Math.min(...data.filter((item) => item.price).map((item) => item.price || Infinity))
  const maxPrice = Math.max(...data.filter((item) => item.price).map((item) => item.price || -Infinity))

  // Passengers count
  const passengers = {
    adult: parseInt(adult, 10),
    child: parseInt(child, 10),
    infant: parseInt(infant, 10),
  }

  // Update selectedDay whenever selectedDate (departingParam) changes
  useEffect(() => {
    setSelectedDay(selectedDate)
  }, [selectedDate])

  // Fetch cheapest flights for timeline
  useEffect(() => {
    fetchprices(selectedDate, originCityCode, destinationCityCode, setData, setIsLoading)
  }, []) // runs once on mount

  //scroll with mouse option
  // useEffect(() => {
  //   const container = scrollRef.current
  //   if (!container) return

  //   const onWheel = (e: WheelEvent) => {
  //     if (e.deltaY !== 0) {
  //       e.preventDefault()
  //       container.scrollBy({ left: e.deltaY, behavior: "smooth" })
  //     }
  //   }

  //   container.addEventListener("wheel", onWheel, { passive: false })

  //   return () => {
  //     container.removeEventListener("wheel", onWheel)
  //   }
  // }, [])

  const scrollRef = useRef<HTMLDivElement>(null)

  const handleDateSelection = (newDate: string) => {
    const dates = data.map((item) => item.date)
    const isEdge = newDate === dates[0] || newDate === dates[dates.length - 1]

    if (isEdge) {
      fetchprices(newDate, originCityCode, destinationCityCode, setData, setIsLoading)
    }

    const url = createFlightSearchUrl(originCityCode, destinationCityCode, new Date(newDate), passengers)
    router.push(url)

    setSelectedDay(newDate)
  }

  // const onRefresh = () => {
  //   fetchprices(selectedDay, originCityCode, destinationCityCode, setData, setIsLoading)
  // }

  // Auto-scroll the selected date into view after data is fetched and DOM is updated
  useEffect(() => {
    if (!scrollRef.current) return
    const selectedEl = scrollRef.current.querySelector('[data-selected="true"]') as HTMLElement
    if (selectedEl) {
      const scrollContainer = scrollRef.current
      const offset = selectedEl.offsetLeft - scrollContainer.offsetWidth / 2 + selectedEl.offsetWidth / 2
      scrollContainer.scrollTo({ left: offset, behavior: "smooth" })
    }
  }, [selectedDay, data])
  return (
    <div className="relative max-w-screen items-center justify-center">
      {/* Gradient */}
      <div className="pointer-events-none absolute inset-0 z-9 flex w-full justify-between">
        <div className="h-full w-[73px] bg-gradient-to-l from-white to-transparent lg:rounded-2xl"></div>
        <div className="h-full w-[73px] bg-gradient-to-r from-white to-transparent lg:rounded-2xl"></div>
      </div>

      {/* buttons */}
      <Image
        src={img}
        alt="scroll left"
        width={28}
        height={28}
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
        width={28}
        height={28}
        onClick={() => {
          if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })
          }
        }}
        className="absolute top-1/3 right-4 z-10 hidden cursor-pointer md:block"
      />

      {/* Timeline scroll area */}
      <div
        ref={scrollRef}
        className="bg-Shade-White relative inline-flex h-[74px] w-full snap-x snap-mandatory flex-nowrap items-center gap-3 overflow-x-auto scroll-smooth py-3 md:h-[85px] lg:rounded-2xl"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex snap-end gap-3 px-3">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-Gray-N100 inline-flex h-[50px] w-[87px] shrink-0 animate-pulse flex-col items-center justify-center rounded-sm md:h-[57px] md:w-[113px]"
                >
                  <div className="mb-1 h-3 w-14 rounded bg-gray-300" />
                  <div className="h-4 w-10 rounded bg-gray-300" />
                </div>
              ))
            : data.map((item, index) => {
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
                      isSelected
                        ? "bg-Primary-P50 border-Primary-P300 border-2"
                        : "bg-Gray-N50 outline-Gray-N200 outline"
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
                        ? englishToFarsiNumber(
                            Math.round(item.price / 1000)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, "،")
                          )
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
