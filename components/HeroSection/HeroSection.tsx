"use client"

import React from "react"

import { SearchFormContainer } from "@/components/SearchFormContainer/SearchFormContainer"

export function HeroSection() {
  return (
    <section data-name="Container-for-hero-section" className="relative mx-auto mt-4 flex h-[700px] md:h-[800px] w-full max-w-[1136px] px-6 lg:mt-11 lg:h-[487px] xl:px-0">
      <div className="flex w-full flex-col items-start">
        {/* Main Title */}
        <div className="mb-6 flex w-full flex-col items-start gap-[9px] lg:mb-10 lg:inline-flex lg:w-auto lg:flex-row lg:items-baseline">
          <span className="text-right text-[28px] leading-[48px] font-light text-white lg:text-5xl lg:leading-normal">
            مرجع مقایسه قیمت و خرید
          </span>
          <h1 className="text-right text-[28px] leading-[48px] font-bold text-white lg:text-5xl lg:leading-normal lg:font-extrabold">
            بلیط هواپیما
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-Gray-N100 mb-14 w-full text-right text-[13px] font-normal opacity-80 lg:mb-20 lg:text-xl">
          همین الان از معتبر‌ترین آژانس‌ها رزرو کن!
        </div>

        {/* Search Form Container */}
        <div className="w-full">
          <SearchFormContainer />
        </div>
      </div>
    </section>
  )
}
