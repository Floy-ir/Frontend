"use client"

import { ArrowRight2, ArrowLeft2 } from "iconsax-react"
import React, { useRef, useState } from "react"
import { Button } from "@/components/Button/Button"
import img from "@/public/images/arrow-right.svg"
import Image from "next/image"
const Timeline = () => {
  const data = [
    { day: "شنبه", date: "۳ اسفند", price: 2389 },
    { day: "یکشنبه", date: "۴ اسفند", price: 2790 },
    { day: "دوشنبه", date: "۵ اسفند", price: 2792 },
    { day: "سه‌شنبه", date: "۶ اسفند", price: 2791 },
    { day: "چهارشنبه", date: "۷ اسفند", price: 2800 },
    { day: "پنجشنبه", date: "۸ اسفند", price: 2787 },
    { day: "جمعه", date: "۹ اسفند", price: 2395 },
    { day: "شنبه", date: "۱۰ اسفند", price: 2996 },
    { day: "یکشنبه", date: "۱۱ اسفند", price: 2794 },
    { day: "دوشنبه", date: "۱۲ اسفند", price: 2803 },
    { day: "سه‌شنبه", date: "۱۳ اسفند", price: 2799 },
    { day: "چهارشنبه", date: "۱۴ اسفند" },
    { day: "پنجشنبه", date: "۱۵ اسفند", price: 2801 },
    { day: "جمعه", date: "۱۶ اسفند", price: 2792 },
  ]

  // Calculate the average price, excluding items with no price
  const avgPrice =
    data
      .filter((item) => item.price !== undefined || item.price == 0) // Exclude items without a price or price=0
      .reduce((acc, item) => acc + (item.price || 0), 0) / data.filter((item) => item.price !== undefined).length

  // Set the initial selected day
  const [selectedDay, setSelectedDay] = useState(6) // Default selected day is 4th index (جمعه - ۴ اسفند)

  // Convert digits to Persian numerals
  const formatPrice = (price: number) => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
    return price
      .toLocaleString("en-US")
      .split("")
      .map((digit) => persianDigits[parseInt(digit)] || digit)
      .join("")
  }

  return (
    <div className="relative max-w-screen flex-nowrap items-center justify-center overflow-x-auto">
      {/* Gradient and Arrows */}
      <div className="pointer-events-none absolute inset-0 z-10 flex w-full justify-between">
  
        <div className="h-full w-[69px] bg-gradient-to-l from-white to-transparent lg:rounded-2xl">
          {/* <ArrowRight2 className="hidden md:block absolute top-1/3 right-4 " size="24" color="#334155"/> */}
          <Image
            src={img}
            width={24}
            height={24}
            alt="arrow"
            className="absolute top-7 right-4 hidden md:block"
            color="#334155"
          />
        </div>
        <div className="h-full w-[69px] bg-gradient-to-r from-white to-transparent lg:rounded-2xl">
          {/* <ArrowLeft2 className="hidden md:block absolute top-1/3 left-4" size="24" color="#334155"/> */}
          <Image
            src={img}
            width={24}
            height={24}
            alt="arrow"
            className="absolute top-7 left-4 hidden rotate-180 md:block"
            color="#334155"
          />
        </div>
      </div>

      {/* Timeline scroll area */}
      <div className="bg-Shade-White outline-Gray-N100 relative inline-flex h-[64px] w-full snap-x snap-proximity flex-nowrap items-center justify-center gap-3 overflow-x-auto overflow-y-hidden scroll-smooth py-3 outline outline-offset-[-1px] md:h-[80px] lg:w-[1036px] lg:rounded-2xl">
        <div className="flex gap-3 px-3">
          {data.map((item, index) => {
            const isSelected = index === selectedDay
            const priceColor =
              item.price !== undefined && item.price > avgPrice + 200
                ? "text-Error-E600"
                : item.price !== undefined && item.price < avgPrice - 200
                ? "text-Success-s600"
                : "text-gray-700"
            return (
              <div
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`h-[48px] w-[69px] shrink-0 snap-center px-1 py-2 md:h-[56] md:w-[102px] ${
                  isSelected ? "bg-Primary-P50 border-Primary-P300 border-2" : "bg-Gray-N50 outline-Gray-N200 outline"
                } inline-flex cursor-pointer flex-col items-center justify-center rounded-sm outline-offset-[-1px]`}
              >
                <div
                  className={`justify-center text-center ${
                    isSelected ? "text-Primary-P500main" : "text-Gray-N500"
                  } text-[11px] leading-none font-medium`}
                >
                  <span className="inline md:hidden">
                    {item.day[0]} - {item.date}
                  </span>

                  <span className="hidden md:inline">
                    {item.day} - {item.date}
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
