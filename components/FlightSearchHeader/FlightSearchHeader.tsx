"use client"

import React, { useState } from "react"
import { SearchNormal } from "iconsax-react"
import { Button } from "@/components/Button/Button"
import { FlightSearchForm } from "@/components/FlightSearchForm/FlightSearchForm"
import { getCityByCode } from "@/config/cities"
import { PassengerCount } from "@/components/PassengerSelector/PassengerSelector"
import { formatToJalali } from "@/utils/dateUtils"
import { englishToFarsiNumber } from "@/utils/numbers"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
          <div className="sm-md:flex-row flex flex-col items-center gap-1 sm:justify-start md:flex-row md:justify-end">
            {/* city */}
            <div className="text-Gray-N700 w-full text-right text-base leading-7 font-semibold md:w-[129px]">
              پرواز {originCity} به {destinationCity}
            </div>

            {/* dot */}
            <div className="bg-Gray-N200 ml-1 hidden size-1 shrink-0 rounded-[33px] md:block"></div>

            <div className="flex items-center gap-2 sm:justify-start md:justify-end">
              {/* date */}
              <div className="text-Gray-N500 shrink-0 text-right text-[13px] leading-normal font-medium">
                {persianDate}
              </div>

              {/* divider */}
              <div className="bg-Gray-N200 size-1 shrink-0 rounded-[33px]"></div>

              {/* passengers */}
              <div className="text-Gray-N500 shrink-0 text-right text-[13px] leading-normal font-medium">
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
        <div>
          <div className="border-y-none md:border-Gray-N200 fixed inset-0 mx-0 z-21 min-h-screen w-full bg-white py-6 md:relative md:inset-auto md:z-auto md:min-h-[110px] md:border-y">
            <div className="container mx-auto px-0 lg:px-4 h-full w-full">
              <FlightSearchForm
                onClose={handleCloseForm}
                initialOrigin={originFullName}
                initialDestination={destinationFullName}
                initialDepartureDate={parsedDate}
                initialPassengers={initialPassengers}
              />
            </div>
          </div>
          
        </div>
      )}
    </>
  )
}
