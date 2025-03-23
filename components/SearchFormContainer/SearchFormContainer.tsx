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
    <div className="outline-Gray-N100 relative mx-auto flex w-full max-w-[1136px] flex-col items-start gap-6 rounded-3xl bg-white px-8 pt-6 pb-5 shadow-[0px_25px_66px_-12px_rgba(0,0,0,0.08)] outline-1 outline-offset-[-1px]">
      {/* Tabs Navigation */}
      <div className="border-Gray-N200 flex w-full items-center justify-start gap-6 border-b pb-6">
        {/* Service Type Tabs */}
        <nav className="flex items-center gap-6">
          <div className="bg-Primary-P50 flex items-center gap-3 rounded-lg px-6 py-2">
            <Airplane size={20} variant="Bold" color="var(--color-Primary-P500main)" />
            <span className="text-Primary-P500main text-lg font-semibold">پرواز</span>
          </div>

          <div className="bg-Gray-N200 h-6 w-px" />

          <div className="flex items-center gap-3 rounded-lg px-6 py-2">
            <Buildings size={20} variant="Bold" color="var(--color-Gray-N500)" />
            <span className="text-Gray-N500 text-lg font-semibold">هتل</span>
          </div>

          <div className="bg-Gray-N200 h-6 w-px" />

          <div className="flex items-center gap-3 rounded-lg px-6 py-2">
            <Building3 size={20} variant="Bold" color="var(--color-Gray-N500)" />
            <span className="text-Gray-N500 text-lg font-semibold">اقامتگاه</span>
          </div>
        </nav>

        {/* Trip Type Selection */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <button className="outline-Gray-N100 flex items-center gap-2 rounded-3xl bg-white px-5 py-2.5 outline-2 outline-offset-[-2px]">
            <span className="text-Gray-N700 text-base font-medium">یک طرفه</span>
          </button>

          <button className="outline-Gray-N100 flex items-center gap-2 rounded-3xl bg-white px-5 py-2.5 outline-2 outline-offset-[-2px]">
            <span className="text-Gray-N700 text-base font-medium">داخلی</span>
          </button>
        </div>
      </div>

      {/* Search Form */}
      <form className="flex w-full items-center gap-6">
        {/* Form Fields */}
        <div className="flex flex-1 items-center gap-6">
          {/* Origin Field - Using ComboboxSelect */}
          <div className="w-47">
            <ComboboxSelect
              noBorder
              placeholder="انتخاب شهر"
              options={cityOptions}
              filled={true}
              size="md"
              dir="rtl"
              label="مبدا"
              searchPlaceholder="جستجوی شهر مبدا"
              value={origin}
              onChange={setOrigin}
              expandDropdown={true}
            />
          </div>

          {/* Exchange Button */}
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

          {/* Destination Field - Using ComboboxSelect */}
          <div className="w-47">
            <ComboboxSelect
              noBorder
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

          <div className="bg-Gray-N200 h-12 w-px" />

          {/* Date and Passenger Fields */}
          <div className="flex items-center gap-4">
            {/* Departure Date Field - Using TextField */}
            <div className="w-18">
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
          </div>

          <Button
            intent="text"
            size="small"
            className=""
            rightIcon={<Add size="18" color="var(--color-Primary-P500main)" />}
          >
            تاریخ برگشت
          </Button>

          <div className="bg-Gray-N200 h-12 w-px" />

          {/* Return Date Field - Using TextField */}
          <div className="w-18">
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

        {/* Search Button */}
        <Button intent="primary" size="large" className="w-50">
          جستجوی پرواز
        </Button>
      </form>
    </div>
  )
}
