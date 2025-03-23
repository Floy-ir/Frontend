"use client"

import React from "react"

import { SearchFormContainer } from "@/components/SearchFormContainer/SearchFormContainer"

export function HeroSection() {
  const cityOptions = [
    { value: "تهران", label: "تهران" },
    { value: "مشهد", label: "مشهد" },
    { value: "کیش", label: "کیش" },
    { value: "تبریز", label: "تبریز" },
  ]

  return (
    <section className="relative w-full h-[487px] mb-10 mt-11">
      {/* Background gradient */}
      {/* <div className="absolute w-full h-[629px] -right-[107px] -top-[144px] rounded-[40px] overflow-hidden">
        <div className="absolute w-full h-[505px] right-full top-[510px] origin-top-right rotate-180 bg-gradient-to-r from-slate-700/0 to-slate-700/70 rounded-[32px]" />
      </div> */}

      <div className="flex flex-col items-start w-full">
        {/* Main Title */}
        <div className="inline-flex justify-start items-baseline gap-[9px] mb-10 h-19">
          <span className="text-right text-white text-5xl font-light">مرجع مقایسه قیمت و خرید</span>
          <h1 className="text-right text-white text-5xl font-extrabold">بلیط هواپیما</h1>
        </div>
        
        {/* Subtitle */}
        <div className=" mb-20 opacity-80 text-right text-Gray-N100 text-xl font-normal">
          همین الان از معتبر‌ترین آژانس‌ها رزرو کن!
        </div>
        
        {/* Search Form Container */}
        <div className="w-full">
          <SearchFormContainer cityOptions={cityOptions} />
        </div>
      </div>
    </section>
  )
} 