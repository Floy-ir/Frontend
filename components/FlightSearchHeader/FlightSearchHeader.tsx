"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, SearchNormal } from "iconsax-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/Button/Button"
import { FlightSearchForm } from "@/components/FlightSearchForm/FlightSearchForm"
import { PassengerCount } from "@/components/PassengerSelector/PassengerSelector"
import { getCityByCode } from "@/config/cities"
import { formatToJalali } from "@/utils/dateUtils"
import { englishToFarsiNumber } from "@/utils/numbers"

type FlightSearchHeaderProps = {
  originCity: string
  destinationCity: string
  date: string
  passengerCount: number
  originCode?: string
  destinationCode?: string
  adult?: number
  child?: number
  infant?: number
}

export function FlightSearchHeader({
  originCity,
  destinationCity,
  date,
  passengerCount,
  originCode,
  destinationCode,
  adult = 1,
  child = 0,
  infant = 0,
}: FlightSearchHeaderProps) {
  const [showSearchForm, setShowSearchForm] = useState(false)

  const toggleSearchForm = () => {
    setShowSearchForm((prev) => !prev)
  }

  // Handle closing the form
  const handleCloseForm = () => {
    setShowSearchForm(false)
  }

  // Parse date string to Date object
  const parsedDate = date ? new Date(date) : null

  // Format the date for display in Persian calendar format
  // This will convert dates like "2025-04-14" to "دوشنبه ۲۵ فروردین"
  const persianDate = parsedDate ? formatToJalali(parsedDate) : date

  // Get full city names if we have codes

  const [originFullName, setOriginFullName] = useState("")
  const [destinationFullName, setDestinationFullName] = useState("")

  useEffect(() => {
    const fetchOrigin = async () => {
      const originCityObj = originCode ? await getCityByCode(originCode) : undefined
      setOriginFullName(originCityObj?.label || destinationCity)

      const destinationCityObj = destinationCode ? await getCityByCode(destinationCode) : undefined
      setDestinationFullName(destinationCityObj?.label || destinationCity)
    }

    fetchOrigin()
  }, [])

  // Create passengers object
  const initialPassengers: PassengerCount = {
    adult: adult || 1,
    child: child || 0,
    infant: infant || 0,
  }
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    handleResize() // Run once on mount
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {!showSearchForm ? (
        isDesktop ? (
          <motion.div
            key="summary"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="border-Gray-N200 flex w-full items-center justify-center gap-3 border-t border-b bg-white px-4 py-4 md:px-0">
              {/* info */}
              <div className="sm-md:flex-row sm-md:items-center flex flex-col items-start gap-2 sm:justify-start md:flex-row md:items-center md:justify-end">
                {/* city */}
                <div className="text-Gray-N700 shrink-0 text-right text-base leading-7 font-semibold lg:text-[17px]">
                  پرواز {originCity} به {destinationCity}
                </div>

                {/* dot */}
                <div className="bg-Gray-N200 sm-md:block ml-1 hidden size-1 shrink-0 rounded-[33px] md:block"></div>

                <div className="flex items-center gap-2 sm:justify-start md:justify-end">
                  {/* date */}
                  <div className="text-Gray-N500 shrink-0 text-right text-[13px] leading-normal font-medium lg:text-[15px]">
                    {persianDate}
                  </div>

                  {/* divider */}
                  <div className="bg-Gray-N200 size-1 shrink-0 rounded-[33px]"></div>

                  {/* passengers */}
                  <div className="text-Gray-N500 shrink-0 text-right text-[13px] leading-normal font-medium lg:text-[15px]">
                    {englishToFarsiNumber(passengerCount)} مسافر
                  </div>
                </div>
              </div>
              <Button
                intent="primary"
                size="small"
                className="mr-16 px-5 py-3.5"
                rightIcon={<SearchNormal size={16} color="#FFFFFF" />}
                onClick={toggleSearchForm}
                data-search-toggle="true"
                aria-expanded={showSearchForm}
                aria-controls="flight-search-form"
                aria-label={showSearchForm ? "بستن فرم جستجو" : "تغییر جستجو"}
              >
                تغییر
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="border-Gray-N200 flex w-full items-center justify-center gap-3 border-b bg-white px-4 py-4 md:px-0">
            <div className="flex gap-2">
              {/* Arrow */}
              <div>
                <Link href="/" className="sm-md:mt-1 mt-3.5 flex items-center gap-1 text-sm">
                  <ArrowRight size="29" color="#737373" />
                </Link>
              </div>
              {/* info */}
              <div className="sm-md:flex-row sm-md:items-center flex flex-col items-start gap-2 sm:justify-start md:flex-row md:items-center md:justify-end">
                {/* city */}
                <div className="text-Gray-N700 shrink-0 text-right text-base leading-7 font-semibold lg:text-[17px]">
                  پرواز {originCity} به {destinationCity}
                </div>

                {/* dot */}
                <div className="bg-Gray-N200 sm-md:block ml-1 hidden size-1 shrink-0 rounded-[33px] md:block"></div>

                <div className="flex items-center gap-2 sm:justify-start md:justify-end">
                  {/* date */}
                  <div className="text-Gray-N500 shrink-0 text-right text-[13px] leading-normal font-medium lg:text-[15px]">
                    {persianDate}
                  </div>

                  {/* divider */}
                  <div className="bg-Gray-N200 size-1 shrink-0 rounded-[33px]"></div>

                  {/* passengers */}
                  <div className="text-Gray-N500 shrink-0 text-right text-[13px] leading-normal font-medium lg:text-[15px]">
                    {englishToFarsiNumber(passengerCount)} مسافر
                  </div>
                </div>
              </div>
            </div>
            <Button
              intent="primary"
              size="small"
              className="mr-16 px-5 py-3.5"
              rightIcon={<SearchNormal size={16} color="#FFFFFF" />}
              onClick={toggleSearchForm}
              data-search-toggle="true"
              aria-expanded={showSearchForm}
              aria-controls="flight-search-form"
              aria-label={showSearchForm ? "بستن فرم جستجو" : "تغییر جستجو"}
            >
              تغییر
            </Button>
          </div>
        )
      ) : isDesktop ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="border-y-none md:border-Gray-N200 fixed inset-0 z-[100] mx-0 min-h-screen w-full bg-white py-6 md:relative md:inset-auto md:z-auto md:min-h-[110px] md:border-y">
            <div className="h-full w-full px-0">
              <FlightSearchForm
                onClose={handleCloseForm}
                initialOrigin={originFullName}
                initialDestination={destinationFullName}
                initialDepartureDate={parsedDate}
                initialPassengers={initialPassengers}
                contextPage="flights"
                id="flight-search-form"
                autoFocus={true}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="border-y-none md:border-Gray-N200 fixed inset-0 z-[100] mx-0 min-h-screen w-full bg-white py-6 md:relative md:inset-auto md:z-auto md:min-h-[110px] md:border-y">
          <div className="h-full w-full px-0">
            <FlightSearchForm
              onClose={handleCloseForm}
              initialOrigin={originFullName}
              initialDestination={destinationFullName}
              initialDepartureDate={parsedDate}
              initialPassengers={initialPassengers}
              contextPage="flights"
              id="flight-search-form"
              autoFocus={true}
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
