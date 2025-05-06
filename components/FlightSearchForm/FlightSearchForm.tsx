"use client"

import { Add, ArrowRight, ArrowSwapHorizontal, ArrowUp2 } from "iconsax-react"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"

import { Button } from "@/components/Button/Button"
import { ComboboxSelect } from "@/components/ComboboxSelect/ComboboxSelect"
import { DatePicker } from "@/components/DatePicker/DatePicker"
import { PassengerCount, PassengerSelector } from "@/components/PassengerSelector/PassengerSelector"
import { getCityByName, getCityOptions } from "@/config/cities"
import { useStoredCities } from "@/hooks/useStoredCities"
import { formatDate } from "@/utils/dateUtils"
import { createFlightSearchUrl } from "@/utils/navigation"

type FlightSearchFormProps = {
  initialOrigin?: string
  initialDestination?: string
  initialDepartureDate?: Date | null
  initialPassengers?: PassengerCount
  onClose?: () => void
  className?: string
  contextPage?: "landing" | "flights"
}

type FormValues = {
  origin: string
  destination: string
  departureDate: Date | null
  passengers: PassengerCount
}

export function FlightSearchForm({
  initialOrigin = "",
  initialDestination = "",
  initialDepartureDate = null,
  initialPassengers = { adult: 1, child: 0, infant: 0 },
  onClose,
  className = "",
  contextPage,
}: FlightSearchFormProps) {
  const router = useRouter()
  
  // Use our custom hook
  const { recentSelections, addRecentSelection, saveSearch } = useStoredCities()

  // Get city options from config
  const cityOptions = getCityOptions()

  // Setup form with react-hook-form
  const { control, handleSubmit, watch, setValue, setFocus, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      origin: initialOrigin,
      destination: initialDestination,
      departureDate: initialDepartureDate,
      passengers: initialPassengers
    },
    mode: "onChange"
  });

  // Watch form values for focus management
  const origin = watch("origin");
  const destination = watch("destination");
  const departureDate = watch("departureDate");

  // Handle automatic focus management
  useEffect(() => {
    if (origin && !destination) {
      setTimeout(() => setFocus("destination"), 100);
    }
  }, [origin, destination, setFocus]);

  useEffect(() => {
    if (destination && !departureDate) {
      setTimeout(() => setFocus("departureDate"), 100);
    }
  }, [destination, departureDate, setFocus]);

  // Handle exchange of origin and destination
  const handleExchange = () => {
    const currentOrigin = watch("origin");
    const currentDestination = watch("destination");
    
    setValue("origin", currentDestination);
    setValue("destination", currentOrigin);
  }

  // Handle city selection for recent selection tracking
  const handleCityChange = (value: string, fieldName: "origin" | "destination") => {
    const cityOption = getCityByName(value);
    if (cityOption) {
      addRecentSelection(value, cityOption.label);
    }
  }

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    const { origin, destination, departureDate, passengers } = data;
    
    // Get the city objects with their codes
    const originCity = getCityByName(origin);
    const destinationCity = getCityByName(destination);

    // If we can't find the codes, don't proceed
    if (!originCity || !destinationCity) {
      console.error("City codes not found");
      return;
    }

    // Save search when user submits
    if (departureDate) {
      saveSearch(originCity.code, destinationCity.code, formatDate(departureDate));
    }

    // Close form if needed
    if (onClose) {
      onClose();
    }

    // Navigate to the flights page with the query parameters
    router.push(createFlightSearchUrl(originCity.code, destinationCity.code, departureDate, passengers));
  }

  console.log(contextPage);

  return (
    <div className="m-0 flex w-full flex-col items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div
          className={`relative flex h-full w-full flex-col items-center lg:flex-row lg:justify-center ${
            contextPage == "flights" ? "px-0 lg:px-30" : ""
          }`}
        >
          <div className={`flex w-full flex-col items-start gap-4 lg:flex-row lg:items-center lg:gap-6 ${className}`}>
            {/* mobile title and Arrow */}
            <div
              className={`mx-4 w-full items-center justify-start gap-4 ${
                contextPage == "flights" ? "flex md:hidden" : "hidden"
              }`}
            >
              <ArrowRight size="24" color="#748297" onClick={onClose} className="cursor-pointer" />
              <div className="text-Gray-N600 text-sm leading-normal font-semibold">تغییر جستجو</div>
            </div>
            <div className={`bg-Gray-N200 h-px w-full ${contextPage == "flights" ? "block md:hidden" : "hidden"}`}></div>

            {/* Form Fields */}
            <div className="mt-4 flex w-full flex-col items-start gap-1 px-4 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 lg:px-0">
              {/* Origin/Destination Section - Mobile & Tablet layout (until 1169px) */}
              <div className="flex w-full flex-col lg:hidden">
                <div className="flex w-full flex-row-reverse items-center gap-4">
                  {/* Exchange Button - Mobile & Tablet */}
                  <div>
                    <button
                      type="button"
                      className="outline-Gray-N100 flex items-center justify-center rounded-lg p-2 outline-2 outline-offset-[-2px]"
                      onClick={handleExchange}
                    >
                      <ArrowSwapHorizontal
                        size={20}
                        className="text-Primary-P500main scale-x-[-1] transform"
                        color="var(--color-Primary-P500main)"
                      />
                    </button>
                  </div>

                  {/* Fields Container - Mobile & Tablet */}
                  <div className="flex flex-1 flex-col">
                    {/* Origin Field - Mobile & Tablet */}
                    <div className="w-full">
                      <Controller
                        name="origin"
                        control={control}
                        rules={{ required: "مبدا الزامی است" }}
                        render={({ field }) => (
                          <ComboboxSelect
                            noBorder
                            expandDropdown
                            placeholder="انتخاب شهر"
                            options={cityOptions}
                            filled={true}
                            size="md"
                            dir="rtl"
                            label="مبدا"
                            searchPlaceholder="جستجوی شهر مبدا"
                            value={field.value}
                            onChange={(val) => {
                              field.onChange(val);
                              handleCityChange(val, "origin");
                            }}
                            recentSelections={recentSelections}
                          />
                        )}
                      />
                    </div>

                    {/* Divider between fields - Mobile & Tablet */}
                    <div className="bg-Gray-N200 my-2 h-px w-full"></div>

                    {/* Destination Field - Mobile & Tablet */}
                    <div className="w-full">
                      <Controller
                        name="destination"
                        control={control}
                        rules={{ required: "مقصد الزامی است" }}
                        render={({ field }) => (
                          <ComboboxSelect
                            noBorder
                            expandDropdown
                            placeholder="انتخاب شهر"
                            options={cityOptions}
                            filled={true}
                            size="md"
                            dir="rtl"
                            label="مقصد"
                            searchPlaceholder="جستجوی شهر مقصد"
                            value={field.value}
                            onChange={(val) => {
                              field.onChange(val);
                              handleCityChange(val, "destination");
                            }}
                            recentSelections={recentSelections}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Horizontal divider after Origin/Destination - Mobile & Tablet */}
                <div className="bg-Gray-N200 my-2 h-px w-full"></div>
              </div>

              {/* Origin/Destination Section - Desktop layout (1170px and up) */}
              <div className="hidden w-full items-start gap-4 lg:flex lg:w-auto lg:flex-row lg:items-center xl:gap-6">
                {/* Origin Field - Desktop */}
                <div className="w-full xl:w-47">
                  <Controller
                    name="origin"
                    control={control}
                    rules={{ required: "مبدا الزامی است" }}
                    render={({ field }) => (
                      <ComboboxSelect
                        noBorder
                        expandDropdown
                        placeholder="انتخاب شهر"
                        options={cityOptions}
                        filled={true}
                        size="md"
                        dir="rtl"
                        label="مبدا"
                        searchPlaceholder="جستجوی شهر مبدا"
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          handleCityChange(val, "origin");
                        }}
                        recentSelections={recentSelections}
                      />
                    )}
                  />
                </div>

                {/* Exchange Button - Desktop */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="outline-Gray-N100 flex items-center justify-center rounded-lg p-2 outline-2 outline-offset-[-2px]"
                    onClick={handleExchange}
                  >
                    <ArrowSwapHorizontal
                      size={20}
                      className="text-Primary-P500main scale-x-[-1] transform"
                      color="var(--color-Primary-P500main)"
                    />
                  </button>
                </div>

                {/* Destination Field - Desktop */}
                <div className="w-full xl:w-47">
                  <Controller
                    name="destination"
                    control={control}
                    rules={{ required: "مقصد الزامی است" }}
                    render={({ field }) => (
                      <ComboboxSelect
                        noBorder
                        expandDropdown
                        placeholder="انتخاب شهر"
                        options={cityOptions}
                        filled={true}
                        size="md"
                        dir="rtl"
                        label="مقصد"
                        searchPlaceholder="جستجوی شهر مقصد"
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          handleCityChange(val, "destination");
                        }}
                        recentSelections={recentSelections}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="bg-Gray-N200 hidden h-12 w-px xl:block" />

              {/* Date and Passenger Fields - Side by side on all devices */}
              <div className="mt-4 flex w-full flex-row items-center gap-4 xl:mt-0">
                {/* Departure Date Field */}
                <div className="w-1/2 xl:w-20">
                  <Controller
                    name="departureDate"
                    control={control}
                    rules={{ required: "تاریخ رفت الزامی است" }}
                    render={({ field }) => (
                      <DatePicker
                        noBorder
                        placeholder="انتخاب تاریخ"
                        label="تاریخ رفت"
                        size="md"
                        filled={true}
                        dir="rtl"
                        value={field.value}
                        onChange={field.onChange}
                        minDate={new Date()} // Can't select dates in the past
                        calendarProps={{
                          className: "w-full",
                        }}
                      />
                    )}
                  />
                </div>

                {/* Return Date Button - Hidden on mobile and tablet */}
                <div className="hidden xl:block">
                  <Button
                    disabled
                    intent="text"
                    size="small"
                    rightIcon={<Add size="18" color="var(--color-Primary-P500main)" />}
                  >
                    تاریخ برگشت
                  </Button>
                </div>

                <div className="bg-Gray-N200 h-12 w-px" />

                {/* Passengers Field */}
                <div className="w-1/2 xl:w-18">
                  <Controller
                    name="passengers"
                    control={control}
                    render={({ field }) => (
                      <PassengerSelector
                        noBorder
                        placeholder="۱ مسافر"
                        label="مسافران"
                        size="md"
                        filled={true}
                        dir="rtl"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Divider before search button - Only visible in mobile layout (until 1169px) */}
              <div className="bg-Gray-N200 my-2 h-px w-full lg:hidden"></div>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-4 flex w-full items-center justify-center gap-4 px-4 lg:mt-0 lg:w-1/4">
            <Button intent="primary" size="large" className="w-full" type="submit">
              جستجوی پرواز
            </Button>
          </div>
        </div>

        {/* <div
          className={`bg-Gray-N100 my-2 h-px w-full md:mt-5 ${contextPage == "flights" ? "hidden md:block" : "hidden"}`}
        ></div> */}
        <Button
          intent="text"
          size="medium"
          className={`-mb-5 -mt-1 ${contextPage == "flights" ? "hidden md:block" : "hidden"}`}
          onClick={onClose}
          leftIcon={<ArrowUp2 size="20" color="#5A28EE" />}
        >
          بستن
        </Button>
      </form>
    </div>
  )
}
