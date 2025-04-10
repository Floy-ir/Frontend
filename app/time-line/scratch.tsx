"use client"

// import { ArrowLeft2, ArrowRight2 } from "iconsax-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useRef, useState } from "react"
import img from "@/public/images/arrow-right.svg"
import { formatToJalali } from "@/utils/dateUtils"
import { createFlightSearchUrl } from "@/utils/navigation"

const Timeline = () => {

  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Retrieve parameters from the URL
  const originCityCode = searchParams.get("origin") || "" // Default if not found
  const destinationCityCode = searchParams.get("destination") || "" // Default if not found
  const adult = parseInt(searchParams.get("adult") || "1", 10)
  const child = parseInt(searchParams.get("child") || "0", 10)
  const infant = parseInt(searchParams.get("infant") || "0", 10)
  const departingParam = searchParams.get("departing") || "2025-04-14" // Default to a specific date if not found

  // Initialize the selected date from the 'departing' query param
  const [selectedDay, setSelectedDay] = useState<string>(departingParam)

  // Passengers count
  const passengers = { adult, child, infant }

  const data = [
    { day: "شنبه", departuring: "2025-04-14", price: 2389 },
    { day: "یکشنبه", departuring: "2025-04-15", price: 2790 },
    { day: "دوشنبه", departuring: "2025-04-16", price: 2792 },
    { day: "سه‌شنبه", departuring: "2025-04-17", price: 2791 },
    { day: "چهارشنبه", departuring: "2025-04-18", price: 2800 },
    { day: "پنجشنبه", departuring: "2025-04-19", price: 2787 },
    { day: "جمعه", departuring: "2025-04-20", price: 2395 },
    { day: "شنبه", departuring: "2025-04-21", price: 2996 },
    { day: "یکشنبه", departuring: "2025-04-22", price: 2794 },
    { day: "دوشنبه", departuring: "2025-04-23", price: 2803 },
    { day: "سه‌شنبه", departuring: "2025-04-24", price: 2799 },
    { day: "چهارشنبه", departuring: "2025-04-25" },
    { day: "پنجشنبه", departuring: "2025-04-26", price: 2801 },
    { day: "جمعه", departuring: "2025-04-27", price: 3000 },
  ]

  // Calculate the min and max price
  const minPrice = Math.min(...data.filter((item) => item.price).map((item) => item.price || Infinity))
  const maxPrice = Math.max(...data.filter((item) => item.price).map((item) => item.price || -Infinity))

  // Calculate the average price
  const avgPrice =
    data
      .filter((item) => item.price !== undefined || item.price == 0)
      .reduce((acc, item) => acc + (item.price || 0), 0) /
    data.filter((item) => item.price !== undefined).length

  // Convert digits to Persian numerals
  const formatPrice = (price: number) => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
    return price
      .toLocaleString("en-US")
      .split("")
      .map((digit) => persianDigits[parseInt(digit)] || digit)
      .join("")
  }

  // Handle date selection and update the URL
  const handleDateSelection = (newDate: string) => {
    setSelectedDay(newDate)

    // Correctly create the URL with 'departing' as Date and 'passengers' separately
    const url = createFlightSearchUrl(
      originCityCode, // origin city code from the URL
      destinationCityCode, // destination city code from the URL
      new Date(newDate), // Convert the selected date to a Date object
      passengers // Pass passengers object here
    )

    // Navigate to the generated URL
    router.push(url)
  }

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
        className="absolute top-1/3 right-4 z-10 hidden cursor-pointer md:block"
      />

      {/* Timeline scroll area */}
      <div
        ref={scrollRef}
        className="bg-Shade-White outline-Gray-N100 relative inline-flex h-[64px] w-full snap-x snap-mandatory flex-nowrap items-center gap-3 overflow-x-auto scroll-smooth py-3 outline outline-offset-[-1px] md:h-[80px] lg:w-[1036px] lg:rounded-2xl"
      >
        <div className="flex snap-end gap-3 px-3">
          {data.map((item, index) => {
            const isSelected = selectedDay === item.departuring
            let priceColor = "text-gray-700"  // Default color

            if (item.price === minPrice) {
              priceColor = "text-Success-s600" // Green for min price
            } else if (item.price === maxPrice) {
              priceColor = "text-Error-E600" // Red for max price
            }
            return (
              <div
                key={index}
                onClick={() => handleDateSelection(item.departuring)}
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
                    {`${formatToJalali(new Date(item.departuring))?.split(" ")[0]?.[0]}- ${formatToJalali(
                      new Date(item.departuring)
                    )?.split(" ")[1]} ${formatToJalali(new Date(item.departuring))?.split(" ")[2]}`}
                  </span>

                  <span className="hidden md:inline">
                    {`${formatToJalali(new Date(item.departuring)).split(" ")[0]}- ${
                      formatToJalali(new Date(item.departuring)).split(" ")[1]
                    } ${formatToJalali(new Date(item.departuring)).split(" ")[2]}`}
                  </span>
                </div>
                <div
                  className={`mt-1 justify-center text-center ${
                    isSelected ? "text-Primary-P500main" : `${priceColor}`
                  } text-[13px] leading-normal font-medium`}
                >
                  {item.price ? formatPrice(item.price) : "-"}
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
