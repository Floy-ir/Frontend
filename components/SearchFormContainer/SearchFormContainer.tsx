import React, { useState } from "react"
import { Airplane, ArrowSwapHorizontal, Buildings, Building3, Add } from "iconsax-react"

import { TextField } from "@/components/TextField/TextField"
import { ComboboxSelect } from "@/components/ComboboxSelect/ComboboxSelect"
import { Button } from "@/components/Button/Button"
import { DatePicker } from "@/components/DatePicker/DatePicker"
import { PassengerSelector, PassengerCount } from "@/components/PassengerSelector/PassengerSelector"

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
  const [departureDate, setDepartureDate] = useState<Date | null>(null)
  const [passengers, setPassengers] = useState<PassengerCount>({ adult: 1, child: 0, infant: 0 })

  // Handle exchange of origin and destination
  const handleExchange = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  // Add a wrapper handler function for the DatePicker
  const handleDateChange = (date: string | Date | null) => {
    // Convert string dates to Date objects if needed
    if (typeof date === 'string') {
      setDepartureDate(new Date(date));
    } else {
      setDepartureDate(date);
    }
  };

  return (
    <div className="outline-Gray-N100 relative mx-auto flex w-full flex-col items-start gap-4 rounded-xl bg-white p-4 shadow-[0px_25px_66px_-12px_rgba(0,0,0,0.08)] outline-1 outline-offset-[-1px] md:gap-6 md:rounded-3xl md:px-8 md:pt-6 md:pb-5">
      {/* Tabs Navigation */}
      <div className="border-Gray-N200 flex w-full items-center justify-start gap-4 border-b pb-4 md:gap-6 md:pb-6">
        {/* Service Type Tabs */}
        <nav className="flex w-full items-center justify-center gap-1 md:w-auto md:justify-start md:gap-6">
          <div className="bg-Primary-P50 justify-center flex flex-1 items-center gap-1 rounded-lg px-3 py-2 md:flex-initial md:gap-3 md:px-6">
            <Airplane size={16} variant="Bold" color="var(--color-Primary-P500main)" className="md:size-5" />
            <span className="text-Primary-P500main text-sm font-semibold md:text-lg">پرواز</span>
          </div>

          <div className="bg-Gray-N200 hidden h-6 w-px md:block" />

          <div className="justify-center flex flex-1 items-center gap-1 rounded-lg px-3 py-2 md:flex-initial md:gap-3 md:px-6">
            <Buildings size={16} variant="Bold" color="var(--color-Gray-N500)" className="md:size-5" />
            <span className="text-Gray-N500 text-sm font-semibold md:text-lg">هتل</span>
          </div>

          <div className="justify-center bg-Gray-N200 hidden h-6 w-px md:block" />

          <div className="flex flex-1 items-center gap-1 rounded-lg px-3 py-2 md:flex-initial md:gap-3 md:px-6">
            <Building3 size={16} variant="Bold" color="var(--color-Gray-N500)" className="md:size-5" />
            <span className="text-Gray-N500 text-sm font-semibold md:text-lg">اقامتگاه</span>
          </div>
        </nav>

        {/* Trip Type Selection - Hidden on mobile */}
        <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
          <button className="outline-Gray-N100 flex items-center gap-2 rounded-3xl bg-white px-5 py-2.5 outline-2 outline-offset-[-2px]">
            <span className="text-Gray-N700 text-base font-medium">یک طرفه</span>
          </button>

          <button className="outline-Gray-N100 flex items-center gap-2 rounded-3xl bg-white px-5 py-2.5 outline-2 outline-offset-[-2px]">
            <span className="text-Gray-N700 text-base font-medium">داخلی</span>
          </button>
        </div>
      </div>

      {/* Search Form */}
      <div className="flex w-full flex-col items-start gap-4 md:flex-col lg:flex-row md:items-start lg:items-center md:gap-6">
        {/* Form Fields */}
        <div className="flex w-full flex-col items-start gap-1 md:flex-row md:items-center md:gap-6">
          {/* Origin/Destination Section - Mobile layout */}
          <div className="flex w-full flex-col md:hidden">
            <div className="flex flex-row-reverse w-full items-center gap-4">
              {/* Exchange Button - Mobile */}
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
                    recentSelections={[
                      { value: "tehran", label: "تهران" },
                      { value: "shiraz", label: "مشهد" },
                      { value: "isfahan", label: "تبریز" }
                    ]}
                  />
                </div>

                {/* Divider between fields - Mobile */}
                <div className="bg-Gray-N200 my-2 h-px w-full"></div>

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
                    recentSelections={[
                      { value: "tehran", label: "تهران" },
                      { value: "shiraz", label: "مشهد" },
                      { value: "isfahan", label: "تبریز" }
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Horizontal divider after Origin/Destination - Mobile */}
            <div className="bg-Gray-N200 my-2 h-px w-full"></div>
          </div>

          {/* Origin/Destination Section - Desktop layout */}
          <div className="hidden w-full items-start gap-4 md:flex md:w-auto md:flex-row md:items-center md:gap-6">
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
                recentSelections={[
                  { value: "tehran", label: "تهران" },
                  { value: "shiraz", label: "مشهد" },
                  { value: "isfahan", label: "تبریز" }
                ]}
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
                recentSelections={[
                  { value: "tehran", label: "تهران" },
                  { value: "shiraz", label: "مشهد" },
                  { value: "isfahan", label: "تبریز" }
                ]}
              />
            </div>
          </div>

          <div className="bg-Gray-N200 hidden h-12 w-px md:block" />

          {/* Date and Passenger Fields - Side by side on mobile and desktop */}
          <div className="mt-4 flex w-full flex-row items-center gap-4 md:mt-0">
            {/* Departure Date Field - REPLACED WITH DATEPICKER */}
            <div className="w-1/2 md:w-20">
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

            {/* Return Date Button - Hidden on mobile */}
            <div className="hidden md:block">
              <Button disabled intent="text" size="small" rightIcon={<Add size="18" color="var(--color-Primary-P500main)" />}>
                تاریخ برگشت
              </Button>
            </div>

            <div className="bg-Gray-N200 h-12 w-px" />

            {/* Passengers Field */}
            <div className="w-1/2 md:w-18">
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
        </div>

        {/* Divider before search button - Mobile only */}
        <div className="bg-Gray-N200 my-2 h-px w-full md:hidden"></div>

        {/* Search Button - Full width on mobile and medium screens */}
        <Button 
          intent="primary" 
          size="large" 
          className="mt-4 w-full md:mt-4 lg:mt-0 md:w-full lg:w-50"
          // disabled={!origin || !destination || !departureDate}
        >
          جستجوی پرواز
        </Button>
      </div>
    </div>
  )
}
