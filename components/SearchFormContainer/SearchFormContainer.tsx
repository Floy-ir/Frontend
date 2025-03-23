import React, { useState } from "react"
import { Airplane, ArrowSwapHorizontal, Buildings, Building3, Add } from "iconsax-react"

import { TextField } from "@/components/TextField/TextField"
import { ComboboxSelect } from "@/components/ComboboxSelect/ComboboxSelect"
import { Button } from "@/components/Button/Button"

type CityOption = {
  value: string
  label: string
}

interface SearchFormContainerProps {
  cityOptions: CityOption[]
}

export function SearchFormContainer({ cityOptions }: SearchFormContainerProps) {
  // Add state management for origin and destination
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [passengers, setPassengers] = useState("")

  // Handle exchange of origin and destination
  const handleExchange = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  return (
    <div className="outline-Gray-N100 relative mx-auto flex w-full flex-col items-start gap-4 md:gap-6 rounded-xl md:rounded-3xl bg-white p-4 md:px-8 md:pt-6 md:pb-5 shadow-[0px_25px_66px_-12px_rgba(0,0,0,0.08)] outline-1 outline-offset-[-1px]">
      {/* Tabs Navigation */}
      <div className="border-Gray-N200 flex w-full items-center justify-start gap-4 md:gap-6 border-b pb-4 md:pb-6">
        {/* Service Type Tabs */}
        <nav className="flex w-full items-center justify-center gap-1 md:w-auto md:justify-start md:gap-6">
          <div className="bg-Primary-P50 flex flex-1 md:flex-initial items-center gap-1 md:gap-3 rounded-lg px-3 md:px-6 py-2">
            <span className="text-Primary-P500main text-sm md:text-lg font-semibold">پرواز</span>
            <Airplane size={16} variant="Bold" color="var(--color-Primary-P500main)" className="md:size-5" />
          </div>

          <div className="bg-Gray-N200 h-6 w-px hidden md:block" />

          <div className="flex flex-1 md:flex-initial items-center gap-1 md:gap-3 rounded-lg px-3 md:px-6 py-2">
            <span className="text-Gray-N500 text-sm md:text-lg font-semibold">هتل</span>
            <Buildings size={16} variant="Bold" color="var(--color-Gray-N500)" className="md:size-5" />
          </div>

          <div className="bg-Gray-N200 h-6 w-px hidden md:block" />

          <div className="flex flex-1 md:flex-initial items-center gap-1 md:gap-3 rounded-lg px-3 md:px-6 py-2">
            <span className="text-Gray-N500 text-sm md:text-lg font-semibold">اقامتگاه</span>
            <Building3 size={16} variant="Bold" color="var(--color-Gray-N500)" className="md:size-5" />
          </div>
        </nav>

        {/* Trip Type Selection - Hidden on mobile */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-3">
          <button className="outline-Gray-N100 flex items-center gap-2 rounded-3xl bg-white px-5 py-2.5 outline-2 outline-offset-[-2px]">
            <span className="text-Gray-N700 text-base font-medium">یک طرفه</span>
          </button>

          <button className="outline-Gray-N100 flex items-center gap-2 rounded-3xl bg-white px-5 py-2.5 outline-2 outline-offset-[-2px]">
            <span className="text-Gray-N700 text-base font-medium">داخلی</span>
          </button>
        </div>
      </div>

      {/* Search Form */}
      <div className="flex w-full flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        {/* Form Fields */}
        <div className="flex w-full flex-col md:flex-row md:flex-1 items-start md:items-center gap-1 md:gap-6">
          {/* Origin/Destination Section - Mobile layout */}
          <div className="flex w-full flex-col md:hidden">
            <div className="flex w-full items-center gap-4">
              {/* Exchange Button - Mobile */}
              <div className="-rotate-90">
                <button
                  type="button"
                  className="outline-Gray-N100 flex items-center justify-center rounded-lg p-2 outline-2 outline-offset-[-2px]"
                  onClick={handleExchange}
                >
                  <ArrowSwapHorizontal
                    size={20}
                    className="text-Primary-P500main"
                    color="var(--color-Primary-P500main)"
                  />
                </button>
              </div>
              
              {/* Fields Container - Mobile */}
              <div className="flex flex-1 flex-col">
                {/* Origin Field - Mobile */}
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
                    onChange={setOrigin}
                  />
                </div>
                
                {/* Divider between fields - Mobile */}
                <div className="h-px w-full bg-Gray-N200 my-2"></div>
                
                {/* Destination Field - Mobile */}
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
                    onChange={setDestination}
                  />
                </div>
              </div>
            </div>
            
            {/* Horizontal divider after Origin/Destination - Mobile */}
            <div className="h-px w-full bg-Gray-N200 my-2"></div>
          </div>

          {/* Origin/Destination Section - Desktop layout */}
          <div className="hidden md:flex w-full md:w-auto md:flex-row items-start md:items-center gap-4 md:gap-6">
            {/* Origin Field - Desktop */}
            <div className="w-full md:w-47">
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
                onChange={setOrigin}
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
            <div className="w-full md:w-47">
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
                onChange={setDestination}
              />
            </div>
          </div>

          <div className="hidden md:block bg-Gray-N200 h-12 w-px" />

          {/* Date and Passenger Fields - Side by side on mobile and desktop */}
          <div className="flex w-full mt-4 md:mt-0 flex-row items-center gap-4">
            {/* Departure Date Field */}
            <div className="w-1/2 md:w-18">
              <TextField
                noBorder
                placeholder="۱۹ اسفند"
                label="تاریخ رفت"
                size="md"
                filled={true}
                dir="rtl"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>

            <div className="bg-Gray-N200 h-12 w-px" />

            {/* Passengers Field */}
            <div className="w-1/2 md:w-18">
              <TextField
                noBorder
                placeholder="۱ مسافر"
                label="مسافران"
                size="md"
                filled={true}
                dir="rtl"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
              />
            </div>
          </div>

          {/* Return Date Button - Hidden on mobile */}
          <div className="hidden md:block">
            <Button
              intent="text"
              size="small"
              rightIcon={<Add size="18" color="var(--color-Primary-P500main)" />}
            >
              تاریخ برگشت
            </Button>
          </div>
        </div>

        {/* Divider before search button - Mobile only */}
        <div className="h-px w-full bg-Gray-N200 my-2 md:hidden"></div>

        {/* Search Button - Full width on mobile */}
        <Button intent="primary" size="large" className="w-full md:w-50 mt-4 md:mt-0">
          جستجوی پرواز
        </Button>
      </div>
    </div>
  )
}
