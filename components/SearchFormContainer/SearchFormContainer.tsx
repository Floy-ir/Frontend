import React from "react"
import { Airplane, Home, Global, Calendar, ArrowSwapHorizontal, Buildings, Building3 } from "iconsax-react"

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
          <div className="w-[200px]">
            <ComboboxSelect
              placeholder="انتخاب شهر"
              options={cityOptions}
              filled={true}
              size="md"
              dir="rtl"
              label="مبدا"
              searchPlaceholder="جستجوی شهر مبدا"
            />
          </div>

          {/* Exchange Button */}
          <button className="outline-Gray-N100 flex items-center justify-center rounded-lg p-2 outline-2 outline-offset-[-2px]">
            <ArrowSwapHorizontal size={20} className="text-Primary-P500main scale-x-[-1] transform" color="var(--color-Primary-P500main)"/>
          </button>

          {/* Destination Field - Using ComboboxSelect */}
          <div className="w-[200px]">
            <ComboboxSelect
              placeholder="انتخاب شهر"
              options={cityOptions}
              filled={true}
              size="md"
              dir="rtl"
              label="مقصد"
              searchPlaceholder="جستجوی شهر مقصد"
            />
          </div>

          <div className="bg-Gray-N200 h-12 w-px" />

          {/* Date and Passenger Fields */}
          <div className="flex items-center gap-4">
            {/* Departure Date Field - Using TextField */}
            <div className="w-[200px]">
              <TextField
                placeholder="19 اسفند"
                label="تاریخ رفت"
                size="md"
                filled={true}
                dir="rtl"
              />
            </div>
          </div>

          {/* Return Date Field - Using TextField */}
          <div className="w-[200px]">
            <TextField
              placeholder="19 اسفند"
              label="تاریخ برگشت"
              size="md"
              filled={true}
              dir="rtl"
            />
          </div>
          
          <div className="bg-Gray-N200 h-12 w-px" />
          
          
        </div>

        {/* Search Button */}
        <Button intent="primary" size="large" className="w-[199px]">
          جستجوی پرواز
        </Button>
      </form>
    </div>
  )
}
