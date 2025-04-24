"use client"

import React, { useState } from "react"
import { ArrowSwapHorizontal, Add, ArrowRight, CloseCircle, ArrowUp, ArrowUp2 } from "iconsax-react"
import { useRouter } from "next/navigation"

import { ComboboxSelect } from "@/components/ComboboxSelect/ComboboxSelect"
import { Button } from "@/components/Button/Button"
import { DatePicker } from "@/components/DatePicker/DatePicker"
import { PassengerSelector, PassengerCount } from "@/components/PassengerSelector/PassengerSelector"
import { getCityByName, getCityOptions } from "@/config/cities"
import { useStoredCities } from "@/hooks/useStoredCities"
import { formatDate } from "@/utils/dateUtils"
import { createFlightSearchUrl } from "@/utils/navigation"

type FlightSearchFormProps = {
  initialOrigin?: string
  initialDestination?: string
  initialDepartureDate?: Date | null
  initialPassengers?: PassengerCount
  onClose?: () => void
  className?: string
}

export function FlightSearchForm({
  initialOrigin = "",
  initialDestination = "",
  initialDepartureDate = null,
  initialPassengers = { adult: 1, child: 0, infant: 0 },
  onClose,
  className = "",
}: FlightSearchFormProps) {
  const router = useRouter()
  const [origin, setOrigin] = useState(initialOrigin)
  const [destination, setDestination] = useState(initialDestination)
  const [departureDate, setDepartureDate] = useState<Date | null>(initialDepartureDate)
  const [passengers, setPassengers] = useState<PassengerCount>(initialPassengers)

  // Use our custom hook
  const { recentSelections, addRecentSelection, saveSearch } = useStoredCities()

  // Get city options from config
  const cityOptions = getCityOptions()

  // Custom onChange handlers
  const handleOriginChange = (value: string) => {
    setOrigin(value)
    const cityOption = getCityByName(value)
    if (cityOption) {
      addRecentSelection(value, cityOption.label)
    }
  }

  const handleDestinationChange = (value: string) => {
    setDestination(value)
    const cityOption = getCityByName(value)
    if (cityOption) {
      addRecentSelection(value, cityOption.label)
    }
  }

  // Handle exchange of origin and destination
  const handleExchange = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  // Add a wrapper handler function for the DatePicker
  const handleDateChange = (date: string | Date | null) => {
    // Convert string dates to Date objects if needed
    if (typeof date === "string") {
      setDepartureDate(new Date(date))
    } else {
      setDepartureDate(date)
    }
  }

  // Handle search button click
  const handleSearch = () => {
    // Don't proceed if required fields are missing
    if (!origin || !destination || !departureDate) {
      return
    }

    // Get the city objects with their codes
    const originCity = getCityByName(origin)
    const destinationCity = getCityByName(destination)

    // If we can't find the codes, don't proceed
    if (!originCity || !destinationCity) {
      console.error("City codes not found")
      return
    }

    // Save search when user submits
    if (departureDate) {
      saveSearch(originCity.code, destinationCity.code, formatDate(departureDate))
    }

    // Close form if needed
    if (onClose) {
      onClose()
    }

    // Navigate to the flights page with the query parameters
    router.push(createFlightSearchUrl(originCity.code, destinationCity.code, departureDate, passengers))
  }

  return (
    <div className="flex flex-col w-full m-0 items-center">
      <div className="relative flex h-full flex-col items-center w-full lg:flex-row lg:justify-center lg:px-30">

        <div className={`flex w-full flex-col items-start gap-4 lg:flex-row lg:items-center lg:gap-6  ${className}`}>
          {/* mobile title and Arrow */}
          <div className="mx-4 flex w-full items-center justify-start gap-4 md:hidden">
            <ArrowRight size="24" color="#748297" onClick={onClose} className="cursor-pointer" />
            <div className="text-Gray-N600 text-sm leading-normal font-semibold">تغییر جستجو</div>
          </div>
          <div className="bg-Gray-N200 block h-px w-full md:hidden"></div>
          {/* close icon */}
          {/* <ArrowRight
            size="24"
            color="#748297"
            onClick={onClose}
            className="mx-4 hidden cursor-pointer md:block lg:hidden"
          /> */}

          {/* <div className="absolute md:left-[16px] lg:hidden hidden md:block flex-row">
          <CloseCircle size="27" color="#748297" onClick={onClose} className="cursor-pointer" />
        </div> */}

          {/* Form Fields */}
          <div className="mt-4 flex w-full flex-col items-start gap-1 px-4 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 lg:px-0">
            {/* Origin/Destination Section - Mobile & Tablet layout (until 1169px) */}
            <div className="flex w-full flex-col lg:hidden">
              <div className="flex w-full flex-row-reverse items-center gap-4">
                {/* Exchange Button - Mobile & Tablet */}
                <div>
                  <button
                    type="button"
                    className="outline-Gray-N100 flex items-center justify-center rounded-lg p-2 outline-2 outline-offset-[-2px]"
                    onClick={handleExchange}
                  >
                    <ArrowSwapHorizontal
                      size={20}
                      className="text-Primary-P500main scale-x-[-1] transform"
                      color="var(--color-Primary-P500main)"
                    />
                  </button>
                </div>

                {/* Fields Container - Mobile & Tablet */}
                <div className="flex flex-1 flex-col">
                  {/* Origin Field - Mobile & Tablet */}
                  <div className="w-full">
                    <ComboboxSelect
                      noBorder
                      expandDropdown
                      placeholder="انتخاب شهر"
                      options={cityOptions}
                      filled={true}
                      size="md"
                      dir="rtl"
                      label="مبدا"
                      searchPlaceholder="جستجوی شهر مبدا"
                      value={origin}
                      onChange={handleOriginChange}
                      recentSelections={recentSelections}
                    />
                  </div>

                  {/* Divider between fields - Mobile & Tablet */}
                  <div className="bg-Gray-N200 my-2 h-px w-full"></div>

                  {/* Destination Field - Mobile & Tablet */}
                  <div className="w-full">
                    <ComboboxSelect
                      noBorder
                      expandDropdown
                      placeholder="انتخاب شهر"
                      options={cityOptions}
                      filled={true}
                      size="md"
                      dir="rtl"
                      label="مقصد"
                      searchPlaceholder="جستجوی شهر مقصد"
                      value={destination}
                      onChange={handleDestinationChange}
                      recentSelections={recentSelections}
                    />
                  </div>
                </div>
              </div>

              {/* Horizontal divider after Origin/Destination - Mobile & Tablet */}
              <div className="bg-Gray-N200 my-2 h-px w-full"></div>
            </div>

            {/* Origin/Destination Section - Desktop layout (1170px and up) */}
            <div className="hidden w-full items-start gap-4 lg:flex lg:w-auto lg:flex-row lg:items-center xl:gap-6">
              {/* Origin Field - Desktop */}
              <div className="w-full xl:w-47">
                <ComboboxSelect
                  noBorder
                  expandDropdown
                  placeholder="انتخاب شهر"
                  options={cityOptions}
                  filled={true}
                  size="md"
                  dir="rtl"
                  label="مبدا"
                  searchPlaceholder="جستجوی شهر مبدا"
                  value={origin}
                  onChange={handleOriginChange}
                  recentSelections={recentSelections}
                />
              </div>

              {/* Exchange Button - Desktop */}
              <div className="flex justify-center">
                <button
                  type="button"
                  className="outline-Gray-N100 flex items-center justify-center rounded-lg p-2 outline-2 outline-offset-[-2px]"
                  onClick={handleExchange}
                >
                  <ArrowSwapHorizontal
                    size={20}
                    className="text-Primary-P500main scale-x-[-1] transform"
                    color="var(--color-Primary-P500main)"
                  />
                </button>
              </div>

              {/* Destination Field - Desktop */}
              <div className="w-full xl:w-47">
                <ComboboxSelect
                  noBorder
                  expandDropdown
                  placeholder="انتخاب شهر"
                  options={cityOptions}
                  filled={true}
                  size="md"
                  dir="rtl"
                  label="مقصد"
                  searchPlaceholder="جستجوی شهر مقصد"
                  value={destination}
                  onChange={handleDestinationChange}
                  recentSelections={recentSelections}
                />
              </div>
            </div>

            <div className="bg-Gray-N200 hidden h-12 w-px xl:block" />

            {/* Date and Passenger Fields - Side by side on all devices */}
            <div className="mt-4 flex w-full flex-row items-center gap-4 xl:mt-0">
              {/* Departure Date Field */}
              <div className="w-1/2 xl:w-20">
                <DatePicker
                  noBorder
                  placeholder="انتخاب تاریخ"
                  label="تاریخ رفت"
                  size="md"
                  filled={true}
                  dir="rtl"
                  value={departureDate}
                  onChange={handleDateChange}
                  minDate={new Date()} // Can't select dates in the past
                  calendarProps={{
                    className: "w-full",
                  }}
                />
              </div>

              {/* Return Date Button - Hidden on mobile and tablet */}
              <div className="hidden xl:block">
                <Button
                  disabled
                  intent="text"
                  size="small"
                  rightIcon={<Add size="18" color="var(--color-Primary-P500main)" />}
                >
                  تاریخ برگشت
                </Button>
              </div>

              <div className="bg-Gray-N200 h-12 w-px" />

              {/* Passengers Field */}
              <div className="w-1/2 xl:w-18">
                <PassengerSelector
                  noBorder
                  placeholder="۱ مسافر"
                  label="مسافران"
                  size="md"
                  filled={true}
                  dir="rtl"
                  value={passengers}
                  onChange={setPassengers}
                />
              </div>
            </div>

            {/* Divider before search button - Only visible in mobile layout (until 1169px) */}
            <div className="bg-Gray-N200 my-2 h-px w-full lg:hidden"></div>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-4 flex w-full items-center justify-center gap-4 px-4 lg:mt-0 lg:w-1/4">
          <Button intent="primary" size="large" className="w-full" onClick={handleSearch}>
            جستجوی پرواز
          </Button>
        </div>
      </div>
      
      <div className="bg-Gray-N100 my-2 h-px w-full hidden md:flex md:mt-5"></div>
        <Button intent="text" size="medium" className="-mb-4  hidden md:flex" onClick={onClose} leftIcon={<ArrowUp2 size="24" color="#5A28EE" />}>
          بستن
        </Button>

    </div>
  )
}
