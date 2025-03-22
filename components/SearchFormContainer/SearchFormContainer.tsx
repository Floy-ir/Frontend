import React from "react"
import { Airplane, Home, Global, Calendar, ArrowSwapHorizontal } from "iconsax-react"

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
    <div className="absolute w-[1136px] right-[152px] top-[239px] px-8 pt-6 pb-5 bg-white rounded-3xl shadow-[0px_25px_66px_-12px_rgba(0,0,0,0.08)] outline outline-1 outline-offset-[-1px] outline-Gray-N100 flex flex-col items-start gap-6">
      {/* Tabs Navigation */}
      <div className="w-full pb-6 border-b border-Gray-N200 flex justify-start items-center gap-6">
        {/* Trip Type Selection */}
        <div className="flex-1 flex justify-end items-center gap-3">
          <button className="px-5 py-2.5 bg-white rounded-3xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex items-center gap-2">
            <span className="text-Gray-N700 text-base font-medium">یک طرفه</span>
          </button>
          
          <button className="px-5 py-2.5 bg-white rounded-3xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex items-center gap-2">
            <span className="text-Gray-N700 text-base font-medium">داخلی</span>
          </button>
        </div>

        {/* Service Type Tabs */}
        <nav className="flex items-center gap-6">
          <div className="px-6 py-2 bg-Primary-P50 rounded-lg flex items-center gap-3">
            <span className="text-Primary-P500main text-lg font-semibold">پرواز</span>
            <Airplane size={20} variant="Bold" className="text-Primary-P500main" />
          </div>
          
          <div className="w-px h-6 bg-Gray-N200" />
          
          <div className="px-6 py-2 rounded-lg flex items-center gap-3">
            <span className="text-Gray-N500 text-lg font-semibold">هتل</span>
            <Home size={20} variant="Bold" className="text-Gray-N500" />
          </div>
          
          <div className="w-px h-6 bg-Gray-N200" />
          
          <div className="px-6 py-2 rounded-lg flex items-center gap-3">
            <span className="text-Gray-N500 text-lg font-semibold">اقامتگاه</span>
            <Home size={20} variant="Bold" className="text-Gray-N500" />
          </div>
        </nav>
      </div>

      {/* Search Form */}
      <form className="w-full flex items-center gap-6">
        {/* Form Fields */}
        <div className="flex-1 flex items-center gap-6">
          {/* Date and Passenger Fields */}
          <div className="flex-1 flex items-center gap-4">
            {/* Return Date Field - Using TextField */}
            <TextField
              placeholder="تاریخ برگشت"
              size="md"
              filled={true}
              dir="rtl"
              rightIcon={<Calendar size={16} color="var(--color-Gray-N500)" />}
            />
            
            {/* Exchange Button */}
            <button className="p-2 rounded-lg outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex justify-center items-center">
              <ArrowSwapHorizontal size={20} className="text-Primary-P500main transform scale-x-[-1]" />
            </button>
            
            {/* Departure Date Field - Using TextField */}
            <TextField
              placeholder="تاریخ رفت"
              size="md"
              filled={true}
              dir="rtl"
              rightIcon={<Calendar size={16} color="var(--color-Gray-N500)" />}
            />
          </div>
          
          <div className="w-px h-12 bg-Gray-N200" />
          
          {/* Destination Field - Using ComboboxSelect */}
          <div className="w-[204px]">
            <ComboboxSelect
              placeholder="مقصد"
              options={cityOptions}
              filled={true}
              size="md"
              dir="rtl"
              rightIcon={<Global size={16} color="var(--color-Gray-N500)" />}
              searchPlaceholder="جستجوی شهر مقصد"
            />
          </div>
          
          <div className="w-px h-12 bg-Gray-N200" />
          
          {/* Origin Field - Using ComboboxSelect */}
          <div className="w-[103px]">
            <ComboboxSelect
              placeholder="مبدا"
              options={cityOptions}
              filled={true}
              size="md"
              dir="rtl"
              rightIcon={<Global size={16} color="var(--color-Gray-N500)" />}
              searchPlaceholder="جستجوی شهر مبدا"
            />
          </div>
        </div>

        {/* Search Button */}
        <Button 
          intent="primary" 
          size="large" 
          className="w-[199px]"
        >
          جستجوی پرواز
        </Button>
      </form>
    </div>
  )
} 