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
  infant = 0
}: FlightSearchHeaderProps) {
  const [showSearchForm, setShowSearchForm] = useState(false)

  const toggleSearchForm = () => {
    setShowSearchForm(prev => !prev)
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
  const originFullName = originCode ? (getCityByCode(originCode)?.label || originCity) : originCity
  const destinationFullName = destinationCode ? (getCityByCode(destinationCode)?.label || destinationCity) : destinationCity
  
  // Create passengers object
  const initialPassengers: PassengerCount = { 
    adult: adult || 1, 
    child: child || 0, 
    infant: infant || 0 
  }

  return (
    <>
      {!showSearchForm ? (
        // Flight summary header
        <div className="border-Gray-N200 flex w-full items-center justify-center gap-3 border-t border-b bg-white py-4">
          <div className="flex w-[352px] items-center justify-end gap-1">
            <div className="text-Gray-N700 text-right text-base leading-7 font-semibold">
              پرواز {originCity} به {destinationCity}
            </div>
            <div className="bg-Gray-N200 size-1 rounded-[33px]"></div>

            <div className="flex items-center justify-end gap-2">
              <div className="text-Gray-N500 text-right text-[13px] leading-normal font-medium">{persianDate}</div>
              <div className="bg-Gray-N200 size-1 rounded-[33px]"></div>
              <div className="text-Gray-N500 text-right text-[13px] leading-normal font-medium">{englishToFarsiNumber(passengerCount)} مسافر</div>
            </div>
          </div>

          <Button 
            intent="primary"
            size="small"
            className="px-5 py-3.5 mr-16"
            rightIcon={<SearchNormal size={16} color="#FFFFFF" />}
            onClick={toggleSearchForm}
          >
            تغییر
          </Button>
        </div>
      ) : (
        // Search form container
        <div className="w-full py-6 bg-white border-y border-Gray-N200">
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
