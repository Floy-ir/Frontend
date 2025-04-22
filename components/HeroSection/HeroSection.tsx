"use client"

import React from "react"

import { SearchFormContainer } from "@/components/SearchFormContainer/SearchFormContainer"

export function HeroSection() {


  return (
    <section className="relative flex mt-4 mb-10 w-full md:mt-11 md:h-[800px] lg-xl:h-[800px] xl:h-[487px]">
      <div className="flex w-full flex-col items-start">
        {/* Main Title */}
        <div className="mb-6 flex w-full flex-col items-start gap-[9px] md:mb-10 md:inline-flex md:w-auto md:flex-row md:items-baseline">
          <span className="text-right text-[28px] leading-[48px] font-light text-white md:text-5xl md:leading-normal">
            مرجع مقایسه قیمت و خرید
          </span>
          <h1 className="text-right text-[28px] leading-[48px] font-bold text-white md:text-5xl md:leading-normal md:font-extrabold">
            بلیط هواپیما
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-Gray-N100 mb-12 w-full text-right text-[13px] font-normal opacity-80 md:mb-20 md:text-xl">
          همین الان از معتبر‌ترین آژانس‌ها رزرو کن!
        </div>

        {/* Search Form Container */}
        <div className="w-full">
          <SearchFormContainer/>
        </div>
      </div>
    </section>
  )
}
