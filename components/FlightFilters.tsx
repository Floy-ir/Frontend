'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Setting5, CloseCircle } from 'iconsax-react'
import { FancySlider } from "@/components/ui/fancy-slider"
import { englishToFarsiNumber } from "@/utils/numbers"

// Filter section with expandable header
const FilterSection = ({ title, children, count = 0, isOpen = true, isLast = false }: { title: string, children: React.ReactNode, count?: number, isOpen?: boolean, isLast?: boolean }) => {
  const [expanded, setExpanded] = React.useState(isOpen)

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      <div
        className="self-stretch flex justify-between items-center gap-[7px] cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="text-Gray-N600 text-sm font-semibold leading-normal">
            {title}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <div className="w-10 h-5 bg-Primary-P50 rounded-[80px] flex justify-center items-center">
              <div className="text-Primary-P500main text-[13px] font-medium leading-normal">
                {englishToFarsiNumber(count)}
              </div>
            </div>
          )}
          <div className="flex-shrink-0">
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
              <path d="M1 1L6 6L11 1" stroke="#384250" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

      </div>

      {expanded && children}

      {!isLast && <div className="self-stretch h-px bg-Gray-N100" />}
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
            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
    {logo && (
      <div className="self-stretch flex justify-start items-center gap-2">
        <div className="size-8 p-2 rounded-[48px] border border-Gray-N200 overflow-hidden">
          <Image src={logo} alt={label} width={32} height={32} className="object-contain" />
        </div>
      </div>
    )}


    <div className="flex-1 inline-flex flex-col justify-start items-end gap-1">
      <div className="self-stretch text-right text-Gray-N700 text-sm font-medium  leading-normal">
        {label}
      </div>
    </div>
    {extraText && (
      <div className="text-right text-Gray-N500 text-[13px] font-normal  leading-none">
        {englishToFarsiNumber(extraText)}
      </div>
    )}

  </div>
)

// Range slider for price and time filters
const RangeSlider = ({
  minLabel,
  maxLabel,
  onChange,
  minValue,
  maxValue
}: {
  minLabel: string;
  maxLabel: string;
  onChange?: (min: number, max: number) => void;
  minValue?: number;
  maxValue?: number;
}) => {
  return (
    <div className="self-stretch py-3 flex flex-col justify-start items-center gap-1">
      <div className="self-stretch py-2 relative inline-flex justify-center items-center">
        <div className="flex-1 h-1 relative bg-Gray-N100 rounded-sm overflow-hidden">
          <div className="h-1 absolute bg-Primary-P500main rounded-xs"
            style={{ width: '95%', left: '0' }} />
        </div>
        {/* This is a simplified slider - for a real implementation, use a proper range slider component */}
      </div>
      <div className="self-stretch h-6 inline-flex justify-between items-center">
        <div className="text-Gray-N500 text-sm font-medium  leading-normal">
          {minLabel}
        </div>
        <div className="text-right text-Gray-N500 text-sm font-medium  leading-normal">
          {maxLabel}
        </div>
      </div>
    </div>
  )
}

export function FlightFilters({ 
  filters,
  updateFilter,
  clearFilters,
  flightTimeRange,
  setFlightTimeRange,
  priceRange,
  setPriceRange,
  activeFiltersCount
}: { 
  filters: {
    ticketType: {
      charter: boolean;
      system: boolean;
    };
    cabinClass: {
      economy: boolean;
      business: boolean;
    };
    airlines: {
      mahan: boolean;
      caspian: boolean;
      ata: boolean;
    };
    agencies: {
      alibaba: boolean;
      flytoday: boolean;
      mrbilit: boolean;
    };
  };
  updateFilter: (category: string, key: string, value: boolean) => void;
  clearFilters: () => void;
  flightTimeRange: [number, number];
  setFlightTimeRange: (range: [number, number]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  activeFiltersCount: number;
}) {
  // Check if component is rendered in a drawer
  const [isInDrawer, setIsInDrawer] = useState(false)
  
  // Set drawer state on component mount
  React.useEffect(() => {
    const checkIfInDrawer = () => {
      const isSmallScreen = window.innerWidth < 1100
      const drawerContent = document.querySelector('.drawer-content')
      const isInDrawerContent = drawerContent?.contains(document.querySelector('.self-stretch.px-5.py-4')) || false
      setIsInDrawer(isSmallScreen || isInDrawerContent)
    }
    
    // Run check after a small delay to ensure DOM is ready
    setTimeout(checkIfInDrawer, 0)
    window.addEventListener('resize', checkIfInDrawer)
    
    return () => window.removeEventListener('resize', checkIfInDrawer)
  })

  // Format price with commas
  const formatPrice = (price: number) => {
    return englishToFarsiNumber(price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }

  // Format time as HH:MM
  const formatTime = (hour: number) => {
    return englishToFarsiNumber(`${hour.toString().padStart(2, '0')}:00`);
  }

  // Filter chips component
  const FilterChips = () => {
    if (activeFiltersCount === 0) return null;
    
    return (
      <div className="self-stretch px-5 py-3 bg-Shade-White border-b border-Gray-N100 inline-flex justify-center items-center gap-3">
        <div className="flex-1 flex justify-end items-center gap-[7px] flex-wrap">
          {/* Ticket Type Filters */}
          {Object.entries(filters.ticketType).map(([key, value]) => 
            value && (
              <div key={`ticketType-${key}`} className="px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex justify-center items-center gap-1 overflow-hidden">
                <div className="py-1 flex justify-start items-center gap-2 cursor-pointer" onClick={() => updateFilter('ticketType', key, false)}>
                  <div className="size-4 relative rounded-[48px] overflow-hidden">
                    <CloseCircle size="16" color="#94A3B8" />
                  </div>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <div className="text-Gray-N700 text-sm font-medium leading-normal">
                    {key === 'charter' ? 'چارتری' : 'سیستمی'}
                  </div>
                </div>
              </div>
            )
          )}
          
          {/* Cabin Class Filters */}
          {Object.entries(filters.cabinClass).map(([key, value]) => 
            value && (
              <div key={`cabinClass-${key}`} className="px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex justify-center items-center gap-1 overflow-hidden">
                <div className="py-1 flex justify-start items-center gap-2 cursor-pointer" onClick={() => updateFilter('cabinClass', key, false)}>
                  <div className="size-4 relative rounded-[48px] overflow-hidden">
                    <CloseCircle size="16" color="#94A3B8" />
                  </div>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <div className="text-Gray-N700 text-sm font-medium leading-normal">
                    {key === 'economy' ? 'اکونومی' : 'بیزینس'}
                  </div>
                </div>
              </div>
            )
          )}
          
          {/* Airlines Filters */}
          {Object.entries(filters.airlines).map(([key, value]) => 
            value && (
              <div key={`airlines-${key}`} className="px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex justify-center items-center gap-1 overflow-hidden">
                <div className="py-1 flex justify-start items-center gap-2 cursor-pointer" onClick={() => updateFilter('airlines', key, false)}>
                  <div className="size-4 relative rounded-[48px] overflow-hidden">
                    <CloseCircle size="16" color="#94A3B8" />
                  </div>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <div className="text-Gray-N700 text-sm font-medium leading-normal">
                    {key === 'mahan' ? 'ماهان' : key === 'caspian' ? 'کاسپین' : 'آتا'}
                  </div>
                </div>
              </div>
            )
          )}
          
          {/* Agencies Filters */}
          {Object.entries(filters.agencies).map(([key, value]) => 
            value && (
              <div key={`agencies-${key}`} className="px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex justify-center items-center gap-1 overflow-hidden">
                <div className="py-1 flex justify-start items-center gap-2 cursor-pointer" onClick={() => updateFilter('agencies', key, false)}>
                  <div className="size-4 relative rounded-[48px] overflow-hidden">
                    <CloseCircle size="16" color="#94A3B8" />
                  </div>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <div className="text-Gray-N700 text-sm font-medium leading-normal">
                    {key === 'alibaba' ? 'علی بابا' : key === 'flytoday' ? 'فلای تودی' : 'مستر بلیط'}
                  </div>
                </div>
              </div>
            )
          )}
          
          {/* Price Range Filter */}
          {(priceRange[0] !== 500000 || priceRange[1] !== 5000000) && (
            <div className="px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex justify-center items-center gap-1 overflow-hidden">
              <div className="py-1 flex justify-start items-center gap-2 cursor-pointer" onClick={() => setPriceRange([1500000, 3500000])}>
                <div className="size-4 relative rounded-[48px] overflow-hidden">
                  <CloseCircle size="16" color="#94A3B8" />
                </div>
              </div>
              <div className="flex justify-center items-center gap-1">
                <div className="text-Gray-N700 text-sm font-medium leading-normal">
                  بازه قیمت (تومان): {englishToFarsiNumber(Math.floor(priceRange[0] / 1000))} تا {englishToFarsiNumber(Math.floor(priceRange[1] / 1000))} هزار
                </div>
              </div>
            </div>
          )}
          
          {/* Flight Time Range Filter */}
          {(flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24) && (
            <div className="px-3 py-1 bg-Shade-White rounded-2xl outline outline-2 outline-offset-[-2px] outline-Gray-N100 flex justify-center items-center gap-1 overflow-hidden">
              <div className="py-1 flex justify-start items-center gap-2 cursor-pointer" onClick={() => setFlightTimeRange([4, 24])}>
                <div className="size-4 relative rounded-[48px] overflow-hidden">
                  <CloseCircle size="16" color="#94A3B8" />
                </div>
              </div>
              <div className="flex justify-center items-center gap-1">
                <div className="text-Gray-N700 text-sm font-medium leading-normal">
                  ساعت پرواز: {englishToFarsiNumber(flightTimeRange[0])} تا {englishToFarsiNumber(flightTimeRange[1])}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${isInDrawer ? 'w-full' : 'w-[305px] outline-1 outline-offset-[-1px] outline-Gray-N200'} rounded-2xl inline-flex flex-col justify-start items-start overflow-hidden`}>
      {/* Header - hide in drawer since drawer already has a header */}
      {!isInDrawer && (
        <div className="self-stretch h-[68px] px-5 py-3 bg-Shade-White border-b border-Gray-N100 inline-flex justify-center items-center gap-3">
          <div className="flex-1 flex justify-between items-center gap-[7px]">
            <div className="flex justify-center items-center gap-1">
              <div className="py-1 flex justify-start items-center gap-2">
                <Setting5 color="#334155" size={16} className="text-Gray-N700" />
              </div>
              <div className="text-right text-Gray-N600 text-base font-semibold  leading-7">
                فیلتر‌ها
              </div>
              {activeFiltersCount > 0 && (
                <div className="size-5 bg-Primary-P50 rounded-[80px] flex justify-center items-center gap-2">
                  <div className="text-Primary-P500main text-[13px] font-medium  leading-normal">
                    {englishToFarsiNumber(activeFiltersCount)}
                  </div>
                </div>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <div className=" h-5 rounded-[80px] cursor-pointer" onClick={clearFilters}>
                <div className="text-Primary-P500main text-[13px] font-medium  leading-normal">
                  حذف فیلتر‌ها
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter chips */}
      {isInDrawer && <FilterChips />}

      {/* Filter sections */}
      <div className="self-stretch px-5 py-4 bg-Shade-White flex flex-col justify-center items-center gap-3">
        {/* Departure time */}
        <FilterSection title="ساعت پرواز رفت">
          <FancySlider
            value={flightTimeRange}
            onValueChange={setFlightTimeRange}
            min={4}
            max={24}
            step={1}
            leftLabel={formatTime(flightTimeRange[1]) as string}
            rightLabel={formatTime(flightTimeRange[0]) as string}
          />
        </FilterSection>

        {/* Price range */}
        <FilterSection title="بازه قیمت (تومان)">
          <FancySlider
            value={priceRange}
            onValueChange={setPriceRange}
            min={500000}
            max={5000000}
            step={100000}
            leftLabel={formatPrice(priceRange[1]) as string}
            rightLabel={formatPrice(priceRange[0]) as string}
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
        <FilterSection title="شرکت‌های هواپیمایی" isLast={true}>
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