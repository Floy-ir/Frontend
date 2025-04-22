"use client"

import React, { useState } from "react"
import { SearchNormal } from "iconsax-react"
import { Button } from "@/components/Button/Button"
import { FlightSearchForm } from "@/components/FlightSearchForm/FlightSearchForm"
import { getCityByCode } from "@/config/cities"
import { PassengerCount } from "@/components/PassengerSelector/PassengerSelector"
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
  const originFullName = originCode ? getCityByCode(originCode)?.label || originCity : originCity
  const destinationFullName = destinationCode
    ? getCityByCode(destinationCode)?.label || destinationCity
    : destinationCity

  // Create passengers object
  const initialPassengers: PassengerCount = {
    adult: adult || 1,
    child: child || 0,
    infant: infant || 0,
  }

  return (
    <>
      {!showSearchForm ? (
        // Flight summary header
        <div className="border-Gray-N200 flex w-full items-center justify-center gap-3 border-t border-b bg-white px-4 py-4 md:px-0">
          {/* info */}
          <div className="flex flex-col sm-md:flex-row md:flex-row items-center sm:justify-start md:justify-end gap-1">
            
            {/* city */}
            <div className="text-right w-full md:w-[129px] text-Gray-N700  text-base leading-7 font-semibold">
              پرواز {originCity} به {destinationCity}
            </div>

            {/* dot */}
            <div className="bg-Gray-N200 size-1 rounded-[33px] shrink-0 hidden md:block ml-1"></div>

            <div className="flex items-center sm:justify-start md:justify-end gap-2">
              {/* date */}
              <div className="text-Gray-N500 text-right text-[13px] leading-normal font-medium shrink-0">{persianDate}</div>

              {/* divider */}
              <div className="bg-Gray-N200 size-1 rounded-[33px] shrink-0"></div>

              {/* passengers */}
              <div className="text-Gray-N500 text-right text-[13px] leading-normal font-medium  shrink-0">
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
          >
            تغییر
          </Button>
        </div>
      ) : (
        // Search form container
        <div className="border-Gray-N200 w-full border-y bg-white py-6">
          <div className="container mx-auto px-4">
            <FlightSearchForm
              onClose={handleCloseForm}
              initialOrigin={originFullName}
              initialDestination={destinationFullName}
              initialDepartureDate={parsedDate}
              initialPassengers={initialPassengers}
            />
          </div>
        </div>
      )}
    </>
  )
}
