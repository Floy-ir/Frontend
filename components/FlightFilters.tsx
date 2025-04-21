'use client'

import React from 'react'
import Image from 'next/image'
import { Setting5 } from 'iconsax-react'
import { RangeSlider } from '@/components/ui/range-slider'

// Filter section with expandable header
const FilterSection = ({ title, children, count = 0, isOpen = true }: { title: string, children: React.ReactNode, count?: number, isOpen?: boolean }) => {
  const [expanded, setExpanded] = React.useState(isOpen)
  
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      <div 
        className="self-stretch inline-flex justify-end items-center gap-[7px] cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 flex justify-center items-center gap-1">
          <div className="size-6 relative origin-top-left -rotate-180">
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" 
                 className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
              <path d="M1 1L6 6L11 1" stroke="#384250" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {count > 0 && (
            <div className="w-10 h-5 bg-Primary-P50 rounded-[80px] flex justify-center items-center gap-2">
              <div className="text-Primary-P500main text-[13px] font-medium font-['Anjoman_Max_FN'] leading-normal">
                {count}
              </div>
            </div>
          )}
          <div className="flex-1 text-right text-Gray-N600 text-sm font-semibold font-['Anjoman_Max_FN'] leading-normal">
            {title}
          </div>
        </div>
      </div>
      
      {expanded && children}
      
      <div className="self-stretch h-px bg-Gray-N100" />
    </div>
  )
}

// Checkbox component for filters
const FilterCheckbox = ({ 
  label, 
  checked, 
  onChange, 
  logo, 
  extraText 
}: { 
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  logo?: string;
  extraText?: string;
}) => (
  <div className="self-stretch inline-flex justify-end items-center gap-2">
    {extraText && (
      <div className="text-right text-Gray-N500 text-[13px] font-normal font-['Anjoman_Max_FN'] leading-none">
        {extraText}
      </div>
    )}
    <div className="flex-1 inline-flex flex-col justify-start items-end gap-1">
      <div className="self-stretch text-right text-Gray-N700 text-sm font-medium font-['Anjoman_Max_FN'] leading-normal">
        {label}
      </div>
    </div>
    {logo && (
      <div className="self-stretch flex justify-start items-center gap-2">
        <div className="size-8 p-2 rounded-[48px] border border-Gray-N200 overflow-hidden">
          <Image src={logo} alt={label} width={32} height={32} className="object-contain" />
        </div>
      </div>
    )}
    <div className="p-[3px] flex justify-center items-center gap-2">
      <div 
        className={`size-[18px] relative rounded-sm overflow-hidden flex items-center justify-center
          ${checked 
            ? "bg-Primary-P500main" 
            : "outline-1 outline-offset-[-1px] outline-Gray-N300"
          }`}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </div>
  </div>
)

export function FlightFilters() {
  const [filters, setFilters] = React.useState({
    ticketType: {
      charter: true,
      system: false
    },
    cabinClass: {
      economy: true,
      business: false
    },
    airlines: {
      mahan: false,
      caspian: false,
      ata: false
    },
    agencies: {
      alibaba: false,
      flytoday: false,
      mrbilit: false
    },
    priceRange: [1534678, 3534678] as [number, number],
    departureTime: [9 * 60 + 30, 11 * 60 + 30] as [number, number] // 09:30 - 11:30 in minutes
  })

  const updateFilter = (category: string, key: string, value: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const updateRangeFilter = (category: keyof typeof filters, values: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      [category]: values
    }))
  }

  const clearFilters = () => {
    setFilters({
      ticketType: { charter: false, system: false },
      cabinClass: { economy: false, business: false },
      airlines: { mahan: false, caspian: false, ata: false },
      agencies: { alibaba: false, flytoday: false, mrbilit: false },
      priceRange: [1534678, 3534678],
      departureTime: [9 * 60 + 30, 11 * 60 + 30]
    })
  }

  // Format price values with commas
  const formatPrice = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Format time values as HH:MM
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  // Count active filters
  const activeFiltersCount = Object.values(filters).reduce(
    (count, category) => {
      if (Array.isArray(category)) {
        return count;
      }
      return count + Object.values(category).filter(Boolean).length
    }, 
    0
  )

  return (
    <div className="w-[305px] rounded-2xl outline-1 outline-offset-[-1px] outline-Gray-N200 inline-flex flex-col justify-start items-start overflow-hidden">
      {/* Header */}
      <div className="self-stretch h-[68px] px-5 py-3 bg-Shade-White border-b border-Gray-N100 inline-flex justify-center items-center gap-3">
        <div className="flex-1 flex justify-end items-center gap-[7px]">
          {activeFiltersCount > 0 && (
            <div className="flex-1 h-5 rounded-[80px] flex justify-start items-center gap-2 cursor-pointer" onClick={clearFilters}>
              <div className="text-Primary-P500main text-[13px] font-medium font-['Anjoman_Max_FN'] leading-normal">
                حذف فیلتر‌ها
              </div>
            </div>
          )}
          {activeFiltersCount > 0 && (
            <div className="size-5 bg-Primary-P50 rounded-[80px] flex justify-center items-center gap-2">
              <div className="text-Primary-P500main text-[13px] font-medium font-['Anjoman_Max_FN'] leading-normal">
                {activeFiltersCount}
              </div>
            </div>
          )}
          <div className="flex justify-center items-center gap-1">
            <div className="text-right text-Gray-N600 text-base font-semibold font-['Anjoman_Max_FN'] leading-7">
              فیلتر‌ها
            </div>
          </div>
          <div className="py-1 flex justify-start items-center gap-2">
            <Setting5 size={16} className="text-Gray-N700" />
          </div>
        </div>
      </div>

      {/* Filter sections */}
      <div className="self-stretch px-5 py-4 bg-Shade-White flex flex-col justify-center items-center gap-3">
        {/* Departure time */}
        <FilterSection title="ساعت پرواز رفت">
          <RangeSlider
            min={0}
            max={24 * 60}
            step={15}
            defaultValue={[filters.departureTime[0], filters.departureTime[1]] as [number, number]}
            formatValue={formatTime}
            onChange={(values: [number, number]) => updateRangeFilter('departureTime', values)}
          />
        </FilterSection>

        {/* Price range */}
        <FilterSection title="بازه قیمت (تومان)">
          <RangeSlider
            min={500000}
            max={5000000}
            step={10000}
            defaultValue={[filters.priceRange[0], filters.priceRange[1]] as [number, number]}
            formatValue={formatPrice}
            onChange={(values: [number, number]) => updateRangeFilter('priceRange', values)}
          />
        </FilterSection>

        {/* Ticket type */}
        <FilterSection title="نوع بلیط" count={Object.values(filters.ticketType).filter(Boolean).length}>
          <FilterCheckbox 
            label="چارتر" 
            checked={filters.ticketType.charter}
            onChange={(v) => updateFilter('ticketType', 'charter', v)}
          />
          <FilterCheckbox 
            label="سیستمی" 
            checked={filters.ticketType.system}
            onChange={(v) => updateFilter('ticketType', 'system', v)}
          />
        </FilterSection>

        {/* Cabin class */}
        <FilterSection title="کلاس پروازی" count={Object.values(filters.cabinClass).filter(Boolean).length}>
          <FilterCheckbox 
            label="اکونومی" 
            checked={filters.cabinClass.economy}
            onChange={(v) => updateFilter('cabinClass', 'economy', v)}
          />
          <FilterCheckbox 
            label="بیزینس" 
            checked={filters.cabinClass.business}
            onChange={(v) => updateFilter('cabinClass', 'business', v)}
          />
        </FilterSection>

        {/* Websites */}
        <FilterSection title="وبسایت‌ها">
          <FilterCheckbox 
            label="علی‌بابا" 
            logo="/images/logo.webp"
            extraText="از ۲,346,890"
            checked={filters.agencies.alibaba}
            onChange={(v) => updateFilter('agencies', 'alibaba', v)}
          />
          <FilterCheckbox 
            label="فلای تودی" 
            logo="/images/logo.webp"
            extraText="از ۲,346,890"
            checked={filters.agencies.flytoday}
            onChange={(v) => updateFilter('agencies', 'flytoday', v)}
          />
          <FilterCheckbox 
            label="مستر بلیط" 
            logo="/images/logo.webp"
            extraText="از ۲,346,890"
            checked={filters.agencies.mrbilit}
            onChange={(v: boolean) => updateFilter('agencies', 'mrbilit', v)}
          />
        </FilterSection>

        {/* Airlines */}
        <FilterSection title="شرکت‌های هواپیمایی">
          <FilterCheckbox 
            label="ماهان" 
            logo="/images/logo.webp"
            extraText="از ۲,346,890"
            checked={filters.airlines.mahan}
            onChange={(v) => updateFilter('airlines', 'mahan', v)}
          />
          <FilterCheckbox 
            label="کاسپین" 
            logo="/images/logo.webp"
            extraText="از ۲,346,890"
            checked={filters.airlines.caspian}
            onChange={(v) => updateFilter('airlines', 'caspian', v)}
          />
          <FilterCheckbox 
            label="آتا" 
            logo="/images/logo.webp"
            extraText="از ۲,346,890"
            checked={filters.airlines.ata}
            onChange={(v) => updateFilter('airlines', 'ata', v)}
          />
        </FilterSection>
      </div>
    </div>
  )
} 