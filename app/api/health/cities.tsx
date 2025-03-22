"use client"

export default function PopularCities() {
  return (
    <div className="mt-14 inline-flex w-full items-center justify-start gap-2">
      {/* Large City Card */}
      <div className="outline-Gray-N200 relative inline-flex h-80 flex-1 flex-col items-center justify-end overflow-hidden rounded-2xl px-8 py-4 outline outline-offset-[-2px]">
        <div className="absolute top-0 left-0 h-80 w-141" />
        <CityInfo city="کیش" price="1,925,700" />
      </div>
      {/* small Cities Cards */}

      <div className="inline-flex flex-1 flex-col items-start justify-start gap-2">
        <CityRow city1="قشم" city2="کیش" />
        <CityRow city1="قشم" city2="قشم" />
      </div>
    </div>
  )
}

// 🎯 **Reusable City Card Component**
function CityCard({ city }: { city: string }) {
  return (
    <div className="relative inline-flex h-40 flex-1 flex-col items-center justify-end overflow-hidden rounded-2xl px-6 py-4 outline-1 outline-offset-[-2px]">
      <div className="absolute top-0 left-0 h-40 w-72" />
      <CityInfo city={city} price="1,925,700" />
    </div>
  )
}

// 🎯 **Reusable Row of Two Cities**
function CityRow({ city1, city2 }: { city1: string; city2: string }) {
  return (
    <div className="inline-flex items-center justify-start gap-2 self-stretch">
      <CityCard city={city1} />
      <CityCard city={city2} />
    </div>
  )
}

// 🎯 **Reusable City Info**
function CityInfo({ city, price }: { city: string; price: string }) {
  return (
    <div className="inline-flex w-full items-end justify-between self-stretch">
      {/* Price Section - Align to the Left */}
      <div className="inline-flex flex-col items-start justify-end">
        <div className="text-Shade-White text-xl leading-loose font-bold">{city}</div>
        <div className="text-Shade-White text-sm leading-normal font-normal">شروع قیمت از</div>
      </div>

      {/* City Name Section */}
      <div className="inline-flex flex-col items-end justify-start gap-2 text-right">
        <div className="text-Shade-White text-xs leading-none font-semibold">تومان</div>
        <div className="text-Shade-White text-base leading-7 font-semibold">{price}</div>
      </div>
    </div>
  )
}
