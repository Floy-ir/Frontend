"use client"

import React from "react"
import { Airplane, Home, Global, Calendar, ArrowSwapHorizontal } from "iconsax-react"

import { TextField } from "@/components/TextField/TextField"
import { ComboboxSelect } from "@/components/ComboboxSelect/ComboboxSelect"
import { Button } from "@/components/Button/Button"
import { SearchFormContainer } from "@/components/SearchFormContainer/SearchFormContainer"

export function HeroSection() {
  const cityOptions = [
    { value: "تهران", label: "تهران" },
    { value: "مشهد", label: "مشهد" },
    { value: "کیش", label: "کیش" },
    { value: "تبریز", label: "تبریز" },
  ]

  return (
    <section className="relative w-full max-w-[1440px] h-[487px] mb-16 bg-red-500">
      {/* Background gradient */}
      {/* <div className="absolute w-full h-[629px] -right-[107px] -top-[144px] rounded-[40px] overflow-hidden">
        <div className="absolute w-full h-[505px] right-full top-[510px] origin-top-right rotate-180 bg-gradient-to-r from-slate-700/0 to-slate-700/70 rounded-[32px]" />
      </div> */}


      {/* Subtitle */}
      <div className="absolute left-[975px] top-[127px] opacity-80 text-right text-Gray-N100 text-xl font-normal">
        همین الان از معتبر‌ترین آژانس‌ها رزرو کن!
      </div>

      {/* Main Title */}
      <div className="absolute left-[521px] top-[12px] inline-flex justify-start items-baseline gap-[9px]">
        <h1 className="text-right text-white text-5xl font-extrabold">بلیط هواپیما</h1>
        <span className="text-right text-white text-5xl font-light">مرجع مقایسه قیمت و خرید</span>
      </div>

      <SearchFormContainer cityOptions={cityOptions} />
    </section>
  )
} 