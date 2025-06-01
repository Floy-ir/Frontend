import React from "react"
import { DialogTitle } from "@radix-ui/react-dialog"
import { CloseCircle } from "iconsax-react"
import Image from "next/image"
import { DrawerClose } from "@/components/ui/drawer"
import { FancySlider } from "@/components/ui/fancy-slider"
import { Checkbox } from "@/components/ui/checkbox"
import { englishToFarsiNumber } from "@/utils/numbers"
import { Airline, DrawerContentRefType, FilterState, Website } from "@/app/types"

// Props for the FilterDrawerContent component
export interface FilterDrawerContentProps {
  title: string
  activeFiltersCount: number
  clearFilters: () => void
  activeSection: string
  filters: FilterState
  updateFilter: (category: string, key: string, value: boolean) => void
  flightTimeRange: [number, number]
  setFlightTimeRange: (range: [number, number]) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  priceRangeBounds: [number, number]
  availableSeatClasses: string[]
  availableWebsites: Website[]
  availableAirlines: Airline[]
}

// Props for the FilterSection component
export interface FilterSectionProps {
  title: string
  children: React.ReactNode
  count?: number
  isOpen?: boolean
  isLast?: boolean
}

// Props for the FilterCheckbox component
export interface FilterCheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  logo?: string
  extraText?: string
}

// Format price with commas
const formatPrice = (price: number) => {
  return englishToFarsiNumber(price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
}

// Format time as HH:MM
const formatTime = (hour: number) => {
  return englishToFarsiNumber(`${hour.toString().padStart(2, "0")}:00`)
}

// Filter section with expandable header
export const FilterSection: React.FC<FilterSectionProps> = ({ title, children, count = 0, isOpen = true, isLast = false }) => {
  const [expanded, setExpanded] = React.useState(isOpen)

  return (
    <div className="flex flex-col items-start justify-start gap-4 self-stretch">
      <div
        className="flex cursor-pointer items-center justify-between gap-[7px] self-stretch"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="text-Gray-N600 text-sm leading-normal font-semibold">{title}</div>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <div className="bg-Primary-P50 flex h-5 w-10 items-center justify-center rounded-[80px]">
              <div className="text-Primary-P500main text-[13px] leading-normal font-medium">
                {englishToFarsiNumber(count)}
              </div>
            </div>
          )}
          <div className="flex-shrink-0">
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            >
              <path d="M1 1L6 6L11 1" stroke="#384250" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && children}

      {!isLast && <div className="bg-Gray-N100 h-px self-stretch" />}
    </div>
  )
}

// Checkbox component for filters
export const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ label, checked, onChange, logo, extraText }) => (
  <div className="inline-flex items-center justify-end gap-2 self-stretch">
    <div className="flex items-center justify-center gap-2 p-[3px]">
      <div
        className={`relative flex size-[18px] items-center justify-center overflow-hidden rounded-sm ${
          checked ? "bg-Primary-P500main" : "outline-Gray-N300 outline-1 outline-offset-[-1px]"
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
      <div className="flex items-center justify-start gap-2 self-stretch">
        <div className="border-Gray-N200 size-8 overflow-hidden rounded-[48px] border p-2">
          <Image src={logo} alt={label} width={32} height={32} className="object-contain" />
        </div>
      </div>
    )}

    <div className="inline-flex flex-1 flex-col items-end justify-start gap-1">
      <div className="text-Gray-N700 self-stretch text-right text-sm leading-normal font-medium">{label}</div>
    </div>
    {extraText && (
      <div className="text-Gray-N500 text-right text-[13px] leading-none font-normal">
        {englishToFarsiNumber(extraText)}
      </div>
    )}
  </div>
)

// Main FilterDrawerContent component
const FilterDrawerContent = React.forwardRef<DrawerContentRefType, FilterDrawerContentProps>(
  (
    {
      title,
      activeSection,
      filters,
      flightTimeRange,
      priceRange,
      priceRangeBounds,
      availableSeatClasses,
      availableWebsites,
      availableAirlines,
    },
    ref
  ) => {
    // Create local state copies to use within the drawer
    const [localFilters, setLocalFilters] = React.useState<FilterState>({ ...filters })
    const [localFlightTimeRange, setLocalFlightTimeRange] = React.useState<[number, number]>([...flightTimeRange])
    const [localPriceRange, setLocalPriceRange] = React.useState<[number, number]>([...priceRange])
    // Add local state for price range bounds from props
    const [localPriceRangeBounds, setLocalPriceRangeBounds] = React.useState<[number, number]>([...priceRangeBounds])

    // Update local state when props change (for initial render)
    React.useEffect(() => {
      // Create deep copy of filters to avoid reference issues
      setLocalFilters({
        ticketType: { ...filters.ticketType },
        cabinClass: { ...filters.cabinClass },
        airlines: { ...filters.airlines },
        agencies: { ...filters.agencies },
      })
      setLocalFlightTimeRange([...flightTimeRange])
      setLocalPriceRange([...priceRange])
      setLocalPriceRangeBounds([...priceRangeBounds])
    }, [filters, flightTimeRange, priceRange, priceRangeBounds])

    // Expose the method to get local state via ref
    React.useImperativeHandle(
      ref,
      () => ({
        getLocalState() {
          return {
            localFilters,
            localPriceRange,
            localFlightTimeRange,
          }
        },
      }),
      [localFilters, localPriceRange, localFlightTimeRange]
    )

    // Handle local filter changes
    const handleLocalFilterUpdate = (category: string, key: string, value: boolean) => {
      if (key === "all" && value === false) {
        // Clear all filters in the specific category locally
        setLocalFilters((prev) => {
          const updatedCategory: Record<string, boolean> = {}
          // Set all keys in this category to false
          Object.keys(prev[category as keyof typeof prev]).forEach((k) => {
            updatedCategory[k] = false
          })

          return {
            ...prev,
            [category]: updatedCategory,
          }
        })
      } else {
        // Regular single filter update locally
        setLocalFilters((prev) => ({
          ...prev,
          [category]: {
            ...prev[category as keyof typeof prev],
            [key]: value,
          },
        }))
      }
    }

    // Local clear filters function
    const handleLocalClearFilters = () => {
      setLocalFilters({
        ticketType: { charter: false, system: false },
        cabinClass: { economy: false, business: false, premiumEconomy: false },
        airlines: {},
        agencies: {},
      })
      setLocalFlightTimeRange([4, 24])
      setLocalPriceRange(localPriceRangeBounds)
    }

    // Calculate local active filters count
    const localActiveFiltersCount =
      Object.values(localFilters.ticketType).filter(Boolean).length +
      Object.values(localFilters.cabinClass).filter(Boolean).length +
      Object.values(localFilters.airlines).filter(Boolean).length +
      Object.values(localFilters.agencies).filter(Boolean).length +
      (localPriceRange[0] !== localPriceRangeBounds[0] || localPriceRange[1] !== localPriceRangeBounds[1] ? 1 : 0) +
      (localFlightTimeRange[0] !== 4 || localFlightTimeRange[1] !== 24 ? 1 : 0)

    // Calculate total active filters for chips display
    const totalActiveFiltersForChips =
      Object.values(localFilters.ticketType).filter(Boolean).length +
      Object.values(localFilters.cabinClass).filter(Boolean).length +
      Object.values(localFilters.airlines).filter(Boolean).length +
      Object.values(localFilters.agencies).filter(Boolean).length +
      (localPriceRange[0] !== localPriceRangeBounds[0] || localPriceRange[1] !== localPriceRangeBounds[1] ? 1 : 0) +
      (localFlightTimeRange[0] !== 4 || localFlightTimeRange[1] !== 24 ? 1 : 0)

    return (
      <div className="inline-flex h-full max-h-[80vh] w-full flex-col items-start justify-start">
        <DialogTitle className="bg-Shade-White border-Gray-N100 sticky top-0 z-10 inline-flex items-center self-stretch border-b py-4">
          <div className="relative inline-flex w-full items-center justify-center gap-2 self-stretch">
            <div
              className={`text-Primary-P500main absolute left-5 cursor-pointer text-[13px] leading-normal font-medium ${
                localActiveFiltersCount === 0 || activeSection !== "all" ? "invisible" : ""
              }`}
              onClick={handleLocalClearFilters}
            >
              حذف فیلتر‌ها
            </div>

            <div className="flex flex-1 items-center justify-center text-center">
              <div className="flex items-center justify-center">
                <div className="text-Gray-N600 ml-2 text-center text-base leading-7 font-semibold">{title}</div>
              </div>
              {localActiveFiltersCount > 0 && activeSection === "all" && (
                <div className="bg-Primary-P50 flex size-5 items-center justify-center gap-2 rounded-[80px]">
                  <div className="text-Primary-P500main text-[13px] leading-normal font-medium">
                    {englishToFarsiNumber(localActiveFiltersCount)}
                  </div>
                </div>
              )}
            </div>

            <div className="absolute right-5 flex items-center justify-start gap-2">
              <DrawerClose className="cursor-pointer">
                <CloseCircle size="24" color="#334155" variant="Outline" />
              </DrawerClose>
            </div>
          </div>
        </DialogTitle>

        <div className="max-h-[calc(80vh-60px)] w-full overflow-y-auto">
          {/* Active Filter Chips Section (Horizontally Scrollable) */}
          {activeSection === "all" && totalActiveFiltersForChips > 0 && (
            <div className="border-Gray-N100 w-full border-b px-5 py-1">
              <div
                className="flex items-center gap-[7px] overflow-x-auto p-2 whitespace-nowrap"
                style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}
              >
                {/* Ticket Type Filters */}
                {Object.entries(localFilters.ticketType).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={`ticketType-${key}`}
                        className="bg-Shade-White outline-Gray-N100 flex flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]"
                      >
                        <div
                          className="flex cursor-pointer items-center justify-start gap-2 py-1"
                          onClick={() => handleLocalFilterUpdate("ticketType", key, false)}
                        >
                          <div className="relative size-4 overflow-hidden rounded-[48px]">
                            <CloseCircle size="16" color="#94A3B8" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">
                            {key === "charter" ? "چارتری" : "سیستمی"}
                          </div>
                        </div>
                      </div>
                    )
                )}

                {/* Cabin Class Filters */}
                {Object.entries(localFilters.cabinClass).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={`cabinClass-${key}`}
                        className="bg-Shade-White outline-Gray-N100 flex flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]"
                      >
                        <div
                          className="flex cursor-pointer items-center justify-start gap-2 py-1"
                          onClick={() => handleLocalFilterUpdate("cabinClass", key, false)}
                        >
                          <div className="relative size-4 overflow-hidden rounded-[48px]">
                            <CloseCircle size="16" color="#94A3B8" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">
                            {key === "economy" ? "اکونومی" : key === "premiumEconomy" ? "اکونومی پریمیوم" : "بیزینس"}
                          </div>
                        </div>
                      </div>
                    )
                )}

                {/* Airlines Filters */}
                {Object.entries(localFilters.airlines).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={`airlines-${key}`}
                        className="bg-Shade-White outline-Gray-N100 flex flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]"
                      >
                        <div
                          className="flex cursor-pointer items-center justify-start gap-2 py-1"
                          onClick={() => handleLocalFilterUpdate("airlines", key, false)}
                        >
                          <div className="relative size-4 overflow-hidden rounded-[48px]">
                            <CloseCircle size="16" color="#94A3B8" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">
                            {availableAirlines.find((airline) => airline.uid === key)?.name || key}
                          </div>
                        </div>
                      </div>
                    )
                )}

                {/* Agencies Filters */}
                {Object.entries(localFilters.agencies).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={`agencies-${key}`}
                        className="bg-Shade-White outline-Gray-N100 flex flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]"
                      >
                        <div
                          className="flex cursor-pointer items-center justify-start gap-2 py-1"
                          onClick={() => handleLocalFilterUpdate("agencies", key, false)}
                        >
                          <div className="relative size-4 overflow-hidden rounded-[48px]">
                            <CloseCircle size="16" color="#94A3B8" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <div className="text-Gray-N700 text-sm leading-normal font-medium">
                            {availableWebsites.find((website) => website.uid === key)?.name_fa || key}
                          </div>
                        </div>
                      </div>
                    )
                )}

                {/* Price Range Filter */}
                {(localPriceRange[0] !== localPriceRangeBounds[0] ||
                  localPriceRange[1] !== localPriceRangeBounds[1]) && (
                  <div className="bg-Shade-White outline-Gray-N100 flex flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]">
                    <div
                      className="flex cursor-pointer items-center justify-start gap-2 py-1"
                      onClick={() => setLocalPriceRange(localPriceRangeBounds)}
                    >
                      <div className="relative size-4 overflow-hidden rounded-[48px]">
                        <CloseCircle size="16" color="#94A3B8" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="text-Gray-N700 text-sm leading-normal font-medium">
                        بازه قیمت (تومان): {englishToFarsiNumber(Math.floor(localPriceRange[0] / 1000))} تا{" "}
                        {englishToFarsiNumber(Math.floor(localPriceRange[1] / 1000))} هزار
                      </div>
                    </div>
                  </div>
                )}

                {/* Flight Time Range Filter */}
                {(localFlightTimeRange[0] !== 4 || localFlightTimeRange[1] !== 24) && (
                  <div className="bg-Shade-White outline-Gray-N100 flex flex-shrink-0 items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]">
                    <div
                      className="flex cursor-pointer items-center justify-start gap-2 py-1"
                      onClick={() => setLocalFlightTimeRange([4, 24])}
                    >
                      <div className="relative size-4 overflow-hidden rounded-[48px]">
                        <CloseCircle size="16" color="#94A3B8" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="text-Gray-N700 text-sm leading-normal font-medium">
                        ساعت پرواز: {englishToFarsiNumber(localFlightTimeRange[0])} تا{" "}
                        {englishToFarsiNumber(localFlightTimeRange[1])}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-Shade-White flex flex-col items-center justify-center gap-3 self-stretch px-5 py-4">
            {/* Filtered content based on activeSection */}
            {/* Flight Time Range */}
            {(activeSection === "all" || activeSection === "flightTime") && (
              <FilterSection title="ساعت پرواز رفت" isLast={activeSection !== "all"}>
                <FancySlider
                  value={localFlightTimeRange}
                  onValueChange={setLocalFlightTimeRange}
                  min={4}
                  max={24}
                  step={1}
                  leftLabel={formatTime(localFlightTimeRange[1])}
                  rightLabel={formatTime(localFlightTimeRange[0])}
                />
              </FilterSection>
            )}

            {/* Price Range */}
            {(activeSection === "all" || activeSection === "priceRange") && (
              <FilterSection title="بازه قیمت (تومان)" isLast={activeSection !== "all"}>
                <FancySlider
                  value={localPriceRange}
                  onValueChange={setLocalPriceRange}
                  min={localPriceRangeBounds[0]}
                  max={localPriceRangeBounds[1]}
                  step={Math.max(1, Math.floor((localPriceRangeBounds[1] - localPriceRangeBounds[0]) / 50))}
                  leftLabel={formatPrice(localPriceRange[1])}
                  rightLabel={formatPrice(localPriceRange[0])}
                />
              </FilterSection>
            )}

            {/* Cabin Class */}
            {(activeSection === "all" || activeSection === "cabinClass") && (
              <FilterSection
                title="کلاس پروازی"
                count={Object.values(localFilters.cabinClass).filter(Boolean).length}
                isLast={activeSection !== "all"}
              >
                {availableSeatClasses.includes("Economy") && (
                  <FilterCheckbox
                    label="اکونومی"
                    checked={localFilters.cabinClass.economy}
                    onChange={(v) => handleLocalFilterUpdate("cabinClass", "economy", v)}
                  />
                )}
                {availableSeatClasses.includes("Premium Economy") && (
                  <FilterCheckbox
                    label="اکونومی پریمیوم"
                    checked={localFilters.cabinClass.premiumEconomy || false}
                    onChange={(v) => handleLocalFilterUpdate("cabinClass", "premiumEconomy", v)}
                  />
                )}
                {availableSeatClasses.includes("Business") && (
                  <FilterCheckbox
                    label="بیزینس"
                    checked={localFilters.cabinClass.business}
                    onChange={(v) => handleLocalFilterUpdate("cabinClass", "business", v)}
                  />
                )}
              </FilterSection>
            )}

            {/* Airlines */}
            {(activeSection === "all" || activeSection === "airlines") && (
              <FilterSection
                title="شرکت‌های هواپیمایی"
                count={Object.values(localFilters.airlines).filter(Boolean).length}
                isLast={activeSection !== "all"}
              >
                {availableAirlines.length > 0 ? (
                  availableAirlines.map((airline) => (
                    <FilterCheckbox
                      key={airline.uid}
                      label={airline.name}
                      logo={airline.image || "/images/logo.webp"}
                      extraText={
                        airline.min_price
                          ? `از ${englishToFarsiNumber(Math.floor(airline.min_price).toLocaleString())}`
                          : ""
                      }
                      checked={localFilters.airlines[airline.uid] || false}
                      onChange={(v) => handleLocalFilterUpdate("airlines", airline.uid, v)}
                    />
                  ))
                ) : (
                  <div className="text-Gray-N500 py-2 text-center text-sm">هیچ ایرلاینی یافت نشد</div>
                )}
              </FilterSection>
            )}

            {/* Agencies */}
            {(activeSection === "all" || activeSection === "agencies") && (
              <FilterSection title="وبسایت‌ها" count={Object.values(localFilters.agencies).filter(Boolean).length}>
                {availableWebsites.length > 0 ? (
                  availableWebsites.map((website) => (
                    <FilterCheckbox
                      key={website.uid}
                      label={website.name_fa}
                      logo={website.image || "/images/logo.webp"}
                      extraText={
                        website.min_price
                          ? `از ${englishToFarsiNumber(Math.floor(website.min_price).toLocaleString())}`
                          : ""
                      }
                      checked={localFilters.agencies[website.uid] || false}
                      onChange={(v) => handleLocalFilterUpdate("agencies", website.uid, v)}
                    />
                  ))
                ) : (
                  <div className="text-Gray-N500 py-2 text-center text-sm">هیچ وبسایتی یافت نشد</div>
                )}
              </FilterSection>
            )}
          </div>
        </div>
      </div>
    )
  }
)

export default FilterDrawerContent 