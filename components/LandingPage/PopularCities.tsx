"use client"

import Image, { StaticImageData } from "next/image"
import image1 from "../../public/images/image1.png"
import image2 from "../../public/images/image2.png"
import image3 from "../../public/images/image3.png"
import image4 from "../../public/images/image4.jpg"

const cities: { city: string; price: string; bg: StaticImageData; large?: boolean }[] = [
  { city: "کیش", price: "۱،۹۲۵،۷۰۰", bg: image4, large: true },
  { city: "کیش", price: "۱،۹۲۵،۷۰۰", bg: image1 },
  { city: "قشم", price: "۱،۹۲۵،۷۰۰", bg: image3 },
  { city: "قشم", price: "۱،۹۲۵،۷۰۰", bg: image3 },
  { city: "قشم", price: "۱،۹۲۵،۷۰۰", bg: image2 },
]

function CityRow({ cities }: { cities: { city: string; price: string; bg: StaticImageData }[] }) {
  return (
    <div className="flex w-full gap-2">
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
        large ? "h-80 w-67 px-8 py-4 md:w-80 lg:w-141" : "h-39 w-69 px-6 py-4"
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
          <div className="text-Shade-White z-10 justify-center self-stretch text-right text-xl leading-loose font-bold">
            {city}
          </div>
          <div className="text-Shade-White z-10 justify-center text-sm leading-normal font-normal">
            شروع قیمت از
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col items-end text-right">
          <div className="text-Shade-White z-10 mb-1 text-xs leading-none font-semibold">
            تومان
          </div>
          <div className="text-Shade-White z-10 justify-center self-stretch text-base leading-7 font-semibold">
            {price}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PopularCities() {
  return (
    <div className="mt-6 md:mt-10 lg:mt-14 flex w-full gap-2 lg:flex-row mb-8">
      {/* Scrollable Container for Smaller Screens */}

      <div className="relative flex w-full snap-x snap-proximity flex-nowrap gap-2 overflow-hidden overflow-x-auto scroll-smooth sm:justify-center sm:px-12 lg:overflow-visible">
        {/* Large City Card */}
        {cities[0] && (
          <div className="shrink-0 snap-center mb-4">
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
              <div key={index} className="shrink-0 snap-center">
                <CityRow cities={pair} />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}