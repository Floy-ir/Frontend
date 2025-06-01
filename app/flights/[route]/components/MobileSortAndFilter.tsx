import React from "react"
import { Setting5, Sort } from "iconsax-react"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogTitle } from "@radix-ui/react-dialog"
import { CloseCircle } from "iconsax-react"
import { DrawerClose } from "@/components/ui/drawer"
import { englishToFarsiNumber } from "@/utils/numbers"
import { Airline, FilterState, SortKey, Website } from "@/app/types"
import FilterDrawerContent from "./FilterDrawerContent"

interface MobileSortAndFilterProps {
  openDrawers: Record<string, boolean>
  sortKey: SortKey
  setSortKey: (key: SortKey) => void
  sortOptions: { key: SortKey; label: string }[]
  activeFiltersCount: number
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
  drawerContentRef: React.RefObject<any>
  handleDrawerOpenChange: (isOpen: boolean, drawerType: string) => void
  openDrawer: (drawer: string) => void
  setActiveFilterSection: (section: string) => void
  clearFilters: () => void
}

export default function MobileSortAndFilter({
  openDrawers,
  sortKey,
  setSortKey,
  sortOptions,
  activeFiltersCount,
  filters,
  updateFilter,
  flightTimeRange,
  setFlightTimeRange,
  priceRange,
  setPriceRange,
  priceRangeBounds,
  availableSeatClasses,
  availableWebsites,
  availableAirlines,
  drawerContentRef,
  handleDrawerOpenChange,
  openDrawer,
  setActiveFilterSection,
  clearFilters,
}: MobileSortAndFilterProps) {

  // Get current sort label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find((option) => option.key === sortKey)
    return option?.label || "ارزان‌ترین"
  }

  return (
    <div className="my-4 flex items-center justify-start px-5 lg:hidden">
      {/* Filter Chips - Each opens a specific section */}
      <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {/* Mobile sort drawer trigger */}
        <Drawer open={openDrawers.sort} onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "sort")}>
          <DrawerTrigger asChild>
            <div
              className="bg-Shade-White outline-Gray-N100 inline-flex items-center justify-center gap-1 rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]"
              onClick={() => openDrawer("sort")}
            >
              <Sort size="16" color="#1E1E1E" />
              <div className="flex items-center justify-center gap-2">
                <div className="text-Gray-N700 text-sm leading-normal font-medium text-nowrap">
                  {" "}
                  مرتب سازی:{" "}
                </div>
                <div className="text-Gray-N700 text-sm leading-normal font-medium">
                  {sortKey ? getCurrentSortLabel() : " ارزان‌ترین "}
                </div>
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent className="bg-Shade-White rounded-t-2xl">
            <div className="inline-flex h-full w-full flex-col items-start justify-start">
              <DialogTitle className="bg-Shade-White border-Gray-N100 inline-flex items-center justify-center self-stretch border-b px-5 py-4">
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-Gray-N600 text-right text-base leading-7 font-semibold">
                      ترتیب نمایش
                    </div>
                  </div>
                  <div className="flex-1"></div>
                </div>
              </DialogTitle>
              {/* Sort Options */}
              <div className="bg-Shade-White flex max-h-[calc(80vh-60px)] flex-col items-center justify-center self-stretch overflow-y-auto px-5">
                {sortOptions.map(({ key, label }) => (
                  <div key={key} className="flex w-full flex-col items-center justify-center gap-4 py-3">
                    <label className="flex w-full cursor-pointer items-center justify-start gap-2">
                      <Checkbox
                        checked={sortKey === key}
                        onCheckedChange={() => {
                          setSortKey(key)
                          handleDrawerOpenChange(false, "sort")
                        }}
                        className="data-[state=checked]:bg-Primary-P500main data-[state=checked]:border-Primary-P500main rounded-full"
                      />
                      <span className="text-Gray-N700 text-sm font-medium">{label}</span>
                    </label>
                    <div className="bg-Gray-N100 h-px w-full" />
                  </div>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* All Filters Chip - always first */}
        <Drawer open={openDrawers.all} onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "all")}>
          <DrawerTrigger asChild>
            <div
              className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
              onClick={() => openDrawer("all")}
            >
              <Setting5 size="16" color="#1E1E1E" />
              <div className="flex items-center gap-1">
                <div className="text-Gray-N700 text-sm leading-normal font-medium">فیلتر‌ها</div>
                {activeFiltersCount > 0 && (
                  <div className="bg-Primary-P50 flex size-5 items-center justify-center rounded-[80px]">
                    <div className="text-Primary-P500main text-[11px] leading-none font-semibold">
                      {englishToFarsiNumber(activeFiltersCount)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
            <FilterDrawerContent
              ref={drawerContentRef}
              title="فیلتر‌ها"
              activeFiltersCount={activeFiltersCount}
              clearFilters={clearFilters}
              activeSection="all"
              filters={filters}
              updateFilter={updateFilter}
              flightTimeRange={flightTimeRange}
              setFlightTimeRange={setFlightTimeRange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              priceRangeBounds={priceRangeBounds}
              availableSeatClasses={availableSeatClasses}
              availableWebsites={availableWebsites}
              availableAirlines={availableAirlines}
            />
          </DrawerContent>
        </Drawer>

        {/* Active filters first */}
        {/* Price Range Filter Chip - if active */}
        {(priceRange[0] !== priceRangeBounds[0] || priceRange[1] !== priceRangeBounds[1]) && (
          <Drawer
            open={openDrawers.priceRange}
            onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "priceRange")}
          >
            <DrawerTrigger asChild>
              <div
                className="bg-Primary-P50 outline-Primary-P500main mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                onClick={() => {
                  setActiveFilterSection("priceRange")
                  openDrawer("priceRange")
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="text-Primary-P500main text-sm leading-normal font-medium">
                    قیمت: {englishToFarsiNumber(Math.floor(priceRange[0] / 1000))} تا{" "}
                    {englishToFarsiNumber(Math.floor(priceRange[1] / 1000))} هزار
                  </div>
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
              <FilterDrawerContent
                ref={drawerContentRef}
                title="بازه قیمت"
                activeFiltersCount={
                  priceRange[0] !== priceRangeBounds[0] || priceRange[1] !== priceRangeBounds[1] ? 1 : 0
                }
                clearFilters={() => setPriceRange(priceRangeBounds)}
                activeSection="priceRange"
                filters={filters}
                updateFilter={updateFilter}
                flightTimeRange={flightTimeRange}
                setFlightTimeRange={setFlightTimeRange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                priceRangeBounds={priceRangeBounds}
                availableSeatClasses={availableSeatClasses}
                availableWebsites={availableWebsites}
                availableAirlines={availableAirlines}
              />
            </DrawerContent>
          </Drawer>
        )}

        {/* Flight Time Filter Chip - if active */}
        {(flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24) && (
          <Drawer
            open={openDrawers.flightTime}
            onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "flightTime")}
          >
            <DrawerTrigger asChild>
              <div
                className="bg-Primary-P50 outline-Primary-P500main mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                onClick={() => {
                  setActiveFilterSection("flightTime")
                  openDrawer("flightTime")
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="text-Primary-P500main text-sm leading-normal font-medium">
                    ساعت پرواز: {englishToFarsiNumber(flightTimeRange[0])} تا{" "}
                    {englishToFarsiNumber(flightTimeRange[1])}
                  </div>
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
              <FilterDrawerContent
                ref={drawerContentRef}
                title="ساعت پرواز رفت"
                activeFiltersCount={flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24 ? 1 : 0}
                clearFilters={() => setFlightTimeRange([4, 24])}
                activeSection="flightTime"
                filters={filters}
                updateFilter={updateFilter}
                flightTimeRange={flightTimeRange}
                setFlightTimeRange={setFlightTimeRange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                priceRangeBounds={priceRangeBounds}
                availableSeatClasses={availableSeatClasses}
                availableWebsites={availableWebsites}
                availableAirlines={availableAirlines}
              />
            </DrawerContent>
          </Drawer>
        )}

        {/* Cabin Class Filter Chip - if active */}
        {Object.values(filters.cabinClass).some(Boolean) && (
          <Drawer
            open={openDrawers.cabinClass}
            onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "cabinClass")}
          >
            <DrawerTrigger asChild>
              <div
                className="bg-Primary-P50 outline-Primary-P500main mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                onClick={() => {
                  setActiveFilterSection("cabinClass")
                  openDrawer("cabinClass")
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="text-Primary-P500main text-sm leading-normal font-medium">
                    کلاس پروازی:{" "}
                    {[
                      filters.cabinClass.economy ? "اکونومی" : null,
                      filters.cabinClass.premiumEconomy ? "اکونومی پریمیوم" : null,
                      filters.cabinClass.business ? "بیزینس" : null,
                    ]
                      .filter(Boolean)
                      .join("، ")}
                  </div>
                </div>
              </div>
            </DrawerTrigger>

            <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
              <FilterDrawerContent
                ref={drawerContentRef}
                title="کلاس پروازی"
                activeFiltersCount={Object.values(filters.cabinClass).filter(Boolean).length}
                clearFilters={() => updateFilter("cabinClass", "all", false)}
                activeSection="cabinClass"
                filters={filters}
                updateFilter={updateFilter}
                flightTimeRange={flightTimeRange}
                setFlightTimeRange={setFlightTimeRange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                priceRangeBounds={priceRangeBounds}
                availableSeatClasses={availableSeatClasses}
                availableWebsites={availableWebsites}
                availableAirlines={availableAirlines}
              />
            </DrawerContent>
          </Drawer>
        )}

        {/* Airlines Filter Chip - if active */}
        {Object.values(filters.airlines).some(Boolean) && (
          <Drawer
            open={openDrawers.airlines}
            onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "airlines")}
          >
            <DrawerTrigger asChild>
              <div
                className="bg-Primary-P50 outline-Primary-P500main mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                onClick={() => {
                  setActiveFilterSection("airlines")
                  openDrawer("airlines")
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="text-Primary-P500main text-sm leading-normal font-medium">
                    ایرلاین‌ها:{" "}
                    {availableAirlines
                      .filter((airline) => filters.airlines[airline.uid])
                      .map((airline) => airline.name)
                      .join("، ")}
                  </div>
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
              <FilterDrawerContent
                ref={drawerContentRef}
                title="شرکت‌های هواپیمایی"
                activeFiltersCount={Object.values(filters.airlines).filter(Boolean).length}
                clearFilters={() => updateFilter("airlines", "all", false)}
                activeSection="airlines"
                filters={filters}
                updateFilter={updateFilter}
                flightTimeRange={flightTimeRange}
                setFlightTimeRange={setFlightTimeRange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                priceRangeBounds={priceRangeBounds}
                availableSeatClasses={availableSeatClasses}
                availableWebsites={availableWebsites}
                availableAirlines={availableAirlines}
              />
            </DrawerContent>
          </Drawer>
        )}

        {/* Agencies Filter Chip - if active */}
        {Object.values(filters.agencies).some(Boolean) && (
          <Drawer
            open={openDrawers.agencies}
            onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "agencies")}
          >
            <DrawerTrigger asChild>
              <div
                className="bg-Primary-P50 outline-Primary-P500main mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                onClick={() => {
                  setActiveFilterSection("agencies")
                  openDrawer("agencies")
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="text-Primary-P500main text-sm leading-normal font-medium">
                    وبسایت‌ها:{" "}
                    {availableWebsites
                      .filter((website) => filters.agencies[website.uid])
                      .map((website) => website.name_fa)
                      .join("، ")}
                  </div>
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
              <FilterDrawerContent
                ref={drawerContentRef}
                title="وبسایت‌ها"
                activeFiltersCount={Object.values(filters.agencies).filter(Boolean).length}
                clearFilters={() => updateFilter("agencies", "all", false)}
                activeSection="agencies"
                filters={filters}
                updateFilter={updateFilter}
                flightTimeRange={flightTimeRange}
                setFlightTimeRange={setFlightTimeRange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                priceRangeBounds={priceRangeBounds}
                availableSeatClasses={availableSeatClasses}
                availableWebsites={availableWebsites}
                availableAirlines={availableAirlines}
              />
            </DrawerContent>
          </Drawer>
        )}

        {/* Inactive filters after active ones */}
        {/* Price Range Filter Chip - if inactive */}
        {priceRange[0] === priceRangeBounds[0] && priceRange[1] === priceRangeBounds[1] && (
          <Drawer
            open={openDrawers.priceRange}
            onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "priceRange")}
          >
            <DrawerTrigger asChild>
              <div
                className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                onClick={() => {
                  setActiveFilterSection("priceRange")
                  openDrawer("priceRange")
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="text-Gray-N700 text-sm leading-normal font-medium">قیمت</div>
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
              <FilterDrawerContent
                ref={drawerContentRef}
                title="بازه قیمت"
                activeFiltersCount={
                  priceRange[0] !== priceRangeBounds[0] || priceRange[1] !== priceRangeBounds[1] ? 1 : 0
                }
                clearFilters={() => setPriceRange(priceRangeBounds)}
                activeSection="priceRange"
                filters={filters}
                updateFilter={updateFilter}
                flightTimeRange={flightTimeRange}
                setFlightTimeRange={setFlightTimeRange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                priceRangeBounds={priceRangeBounds}
                availableSeatClasses={availableSeatClasses}
                availableWebsites={availableWebsites}
                availableAirlines={availableAirlines}
              />
            </DrawerContent>
          </Drawer>
        )}

        {/* Flight Time Filter Chip - if inactive */}
        {flightTimeRange[0] === 4 && flightTimeRange[1] === 24 && (
          <Drawer
            open={openDrawers.flightTime}
            onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "flightTime")}
          >
            <DrawerTrigger asChild>
              <div
                className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                onClick={() => {
                  setActiveFilterSection("flightTime")
                  openDrawer("flightTime")
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="text-Gray-N700 text-sm leading-normal font-medium">ساعت پرواز</div>
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
              <FilterDrawerContent
                ref={drawerContentRef}
                title="ساعت پرواز رفت"
                activeFiltersCount={flightTimeRange[0] !== 4 || flightTimeRange[1] !== 24 ? 1 : 0}
                clearFilters={() => setFlightTimeRange([4, 24])}
                activeSection="flightTime"
                filters={filters}
                updateFilter={updateFilter}
                flightTimeRange={flightTimeRange}
                setFlightTimeRange={setFlightTimeRange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                priceRangeBounds={priceRangeBounds}
                availableSeatClasses={availableSeatClasses}
                availableWebsites={availableWebsites}
                availableAirlines={availableAirlines}
              />
            </DrawerContent>
          </Drawer>
        )}

        {/* Airlines Filter Chip - if inactive */}
        {!Object.values(filters.airlines).some(Boolean) && (
          <Drawer
            open={openDrawers.airlines}
            onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "airlines")}
          >
            <DrawerTrigger asChild>
              <div
                className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                onClick={() => {
                  setActiveFilterSection("airlines")
                  openDrawer("airlines")
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="text-Gray-N700 text-sm leading-normal font-medium">ایرلاین‌ها</div>
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
              <FilterDrawerContent
                ref={drawerContentRef}
                title="شرکت‌های هواپیمایی"
                activeFiltersCount={Object.values(filters.airlines).filter(Boolean).length}
                clearFilters={() => updateFilter("airlines", "all", false)}
                activeSection="airlines"
                filters={filters}
                updateFilter={updateFilter}
                flightTimeRange={flightTimeRange}
                setFlightTimeRange={setFlightTimeRange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                priceRangeBounds={priceRangeBounds}
                availableSeatClasses={availableSeatClasses}
                availableWebsites={availableWebsites}
                availableAirlines={availableAirlines}
              />
            </DrawerContent>
          </Drawer>
        )}

        {/* Agencies Filter Chip - if inactive */}
        {!Object.values(filters.agencies).some(Boolean) && (
          <Drawer
            open={openDrawers.agencies}
            onOpenChange={(isOpen) => handleDrawerOpenChange(isOpen, "agencies")}
          >
            <DrawerTrigger asChild>
              <div
                className="bg-Shade-White outline-Gray-N100 mr-1 inline-flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-3 py-1 whitespace-nowrap outline-2 outline-offset-[-2px]"
                onClick={() => {
                  setActiveFilterSection("agencies")
                  openDrawer("agencies")
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="text-Gray-N700 text-sm leading-normal font-medium">وبسایت‌ها</div>
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent className="bg-Shade-White max-h-[80vh] rounded-t-2xl pb-4">
              <FilterDrawerContent
                ref={drawerContentRef}
                title="وبسایت‌ها"
                activeFiltersCount={Object.values(filters.agencies).filter(Boolean).length}
                clearFilters={() => updateFilter("agencies", "all", false)}
                activeSection="agencies"
                filters={filters}
                updateFilter={updateFilter}
                flightTimeRange={flightTimeRange}
                setFlightTimeRange={setFlightTimeRange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                priceRangeBounds={priceRangeBounds}
                availableSeatClasses={availableSeatClasses}
                availableWebsites={availableWebsites}
                availableAirlines={availableAirlines}
              />
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  )
} 