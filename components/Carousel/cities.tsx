"use client"

import Image, { StaticImageData } from "next/image"
import image1 from "../../public/image1.png"
import image2 from "../../public/image2.png"
import image3 from "../../public/image3.png"
import image4 from "../../public/image4.jpg"

const cities: { city: string; price: string; bg: StaticImageData; large?: boolean }[] = [
  { city: "کیش", price: "۱،۹۲۵،۷۰۰", bg: image4, large: true },
  { city: "کیش", price: "۱،۹۲۵،۷۰۰", bg: image1 },
  { city: "قشم", price: "۱،۹۲۵،۷۰۰", bg: image3 },
  { city: "قشم", price: "۱،۹۲۵،۷۰۰", bg: image3 },
  { city: "قشم", price: "۱،۹۲۵،۷۰۰", bg: image2 },
]

function CityRow({ cities }: { cities: { city: string; price: string; bg: StaticImageData }[] }) {
  return (
    <div className="flex w-full gap-2 ">
      {cities.map((city, index) => (
        <CityCard key={index} {...city} />
      ))}
    </div>
  )
}

function CityCard({ city, price, bg, large }: { city: string; price: string; bg: StaticImageData; large?: boolean }) {
  return (
    <div
      className={`relative flex ${
        large ? "h-82 lg:not-only:w-[1/2] sm:w-[1/4] px-8 py-4" : "h-40 w-60 px-6 py-4"
      } flex-1 flex-col justify-end overflow-hidden rounded-2xl border-2 border-slate-200`}
    >
      {/* Background Image */}
      <Image src={bg} alt={city} fill className="h-full w-full" priority />

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-l from-slate-700/80 to-slate-700/0" />

      {/* City Info  */}
      <div className="flex w-full items-end justify-between">
        {/* City Name */}
        <div className="flex flex-col items-start">
          <div className="text-Shade-White z-10 justify-center self-stretch text-right font-['Anjoman_Max_FN'] text-xl leading-loose font-bold text-white">
            {city}
          </div>
          <div className="text-Shade-White z-10 justify-center font-['Anjoman_Max_FN'] text-sm leading-normal font-normal text-white">
            شروع قیمت از
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col items-end text-right">
          <div className="text-Shade-White z-10 mb-1 font-['Anjoman_Max_FN'] text-xs leading-none font-semibold text-white">
            تومان
          </div>
          <div className="text-Shade-White z-10 justify-center self-stretch font-['Anjoman_Max_FN'] text-base leading-7 font-semibold text-white">
            {price}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PopularCities() {
  return (
    <div className="mt-14 flex w-full gap-2 lg:flex-row ">
      {/* Scrollable Container for Smaller Screens */}

      <div className="relative flex w-full gap-2 overflow-x-auto snap-x snap-mandatory sm:justify-center sm:px-12 scroll-smooth overflow-hidden flex-nowrap">
      {/* Large City Card */}
        {cities[0] && (
          <div className="snap-center shrink-0 ">
            <CityCard {...cities[0]} />
          </div>
        )}

        {/* Small Cities Cards */}
      <div className="flex flex-1 flex-col gap-2">
          {cities
            .slice(1)
            .reduce<{ city: string; price: string; bg: StaticImageData }[][]>((rows, city, index, arr) => {
              if (index % 2 === 0) rows.push(arr.slice(index, index + 2))
              return rows
            }, [])
            .map((pair, index) => (
              <div key={index} className="snap-center shrink-0  ">
                <CityRow cities={pair} />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}