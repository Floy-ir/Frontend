"use client"

import { Airplane, Building3, Buildings } from "iconsax-react"

import React from "react"
import { FlightSearchForm } from "@/components/FlightSearchForm/FlightSearchForm"
import { Button } from "../../elements/Button/Button"

export function SearchFormContainer() {
  return (
    <div
      data-name="Container-for-search-container"
      className="outline-Gray-N100 relative mx-auto flex w-full max-w-full flex-col items-start gap-4 rounded-xl bg-white p-4 outline-1 outline-offset-[-1px] md:gap-6 md:rounded-3xl md:px-8 md:pt-6 md:pb-5"
    >
      {/* Tabs Navigation */}
      <div className="border-Gray-N200 flex w-full items-center justify-center gap-4 border-b pb-4 md:gap-6 md:pb-6">
        {/* Service Type Tabs */}
        <nav className="flex w-full items-center justify-center gap-1 md:w-auto md:justify-start md:gap-6">
          <div className="bg-Primary-P50 flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 md:flex-initial md:gap-3 md:px-6">
            <Airplane size={16} variant="Bold" color="var(--color-Primary-P500main)" className="md:size-5" />
            <span className="text-Primary-P500main text-sm font-semibold md:text-lg">پرواز</span>
          </div>

          <div className="bg-Gray-N200 hidden h-6 w-px lg:block" />

          <div className="flex flex-1 cursor-not-allowed items-center justify-center gap-1 rounded-lg px-2 py-1 sm:px-3 sm:py-2 md:flex-initial md:gap-3 md:px-6">
            <Buildings size={16} variant="Bold" color="var(--color-Gray-N400)" className="size-4 md:size-5" />
            <div className="relative flex">
              <span className="text-Gray-N400 text-xs font-medium sm:text-sm md:text-lg">هتل</span>
              <Button
                intent="secondary"
                size="small"
                className="absolute -top-3 -left-8 cursor-not-allowed rounded-full px-1 py-0.5 text-[8px] font-normal sm:text-[10px]"
              >
                به‌زودی
              </Button>
            </div>
          </div>

          <div className="bg-Gray-N200 hidden h-6 w-px justify-center lg:block" />

          <div className="flex flex-1 cursor-not-allowed items-center justify-center gap-1 rounded-lg px-2 py-1 sm:px-3 sm:py-2 md:flex-initial md:gap-3 md:px-6">
            <Building3 size={16} variant="Bold" color="var(--color-Gray-N400)" className="size-4 md:size-5" />
            <div className="relative flex">
              <span className="text-Gray-N400 text-xs font-medium sm:text-sm md:text-lg">اقامتگاه</span>
              <Button
                intent="secondary"
                size="small"
                className="absolute -top-3 -left-9 cursor-not-allowed rounded-full px-1.5 py-1 text-[8px] font-normal sm:text-[10px]"
              >
                به‌زودی
              </Button>
            </div>
          </div>
        </nav>

        {/* Trip Type Selection - Hidden on mobile */}
        <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
          <button className="outline-Gray-N100 flex items-center gap-2 rounded-3xl bg-white px-5 py-2.5 outline-2 outline-offset-[-2px]">
            <span className="text-Gray-N700 text-base font-medium">یک طرفه</span>
          </button>

          <button className="outline-Gray-N100 flex items-center gap-2 rounded-3xl bg-white px-5 py-2.5 outline-2 outline-offset-[-2px]">
            <span className="text-Gray-N700 text-base font-medium">داخلی</span>
          </button>
        </div>
      </div>
      <FlightSearchForm contextPage="landing" />
    </div>
  )
}
