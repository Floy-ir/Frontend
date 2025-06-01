"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Add, ArrowRight, ArrowSwapHorizontal, ArrowUp2 } from "iconsax-react"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/Button/Button"
import { ComboboxSelect } from "@/components/ComboboxSelect/ComboboxSelect"
import { DatePicker } from "@/components/DatePicker/DatePicker"
import { PassengerCount, PassengerSelector } from "@/components/PassengerSelector/PassengerSelector"
import type { CityOption } from "@/config/cities"
import { getCityByName, getCityOptions } from "@/config/cities"
import { useFlightFormPersistence } from "@/hooks/useFlightFormPersistence"
import { useStoredCities } from "@/hooks/useStoredCities"
import { formatDate } from "@/utils/dateUtils"
import { createFlightSearchUrl } from "@/utils/navigation"

// Define zod schema for form validation
const searchFormSchema = z.object({
  origin: z.string().min(1, { message: "مبدا را انتخاب کنید" }),
  destination: z.string().min(1, { message: "مقصد را انتخاب کنید" }),
  departureDate: z.date({ message: "انتخاب کنید" }),
  passengers: z.object({
    adult: z.number().int().min(1, { message: "تعداد مسافران را مشخص کنید" }),
    child: z.number().int().min(0, { message: "تعداد مسافران را مشخص کنید" }),
    infant: z.number().int().min(0, { message: "تعداد مسافران را مشخص کنید" }),
  }),
})

type SearchFormValues = z.infer<typeof searchFormSchema>

type FlightSearchFormProps = {
  initialOrigin?: string
  initialDestination?: string
  initialDepartureDate?: Date | null
  initialPassengers?: PassengerCount
  onClose?: () => void
  className?: string
  contextPage?: "landing" | "flights"
  id?: string
  autoFocus?: boolean
}

export function FlightSearchForm({
  initialOrigin = "",
  initialDestination = "",
  initialDepartureDate = null,
  initialPassengers = { adult: 1, child: 0, infant: 0 },
  onClose,
  className = "",
  contextPage,
  id,
  autoFocus,
}: FlightSearchFormProps) {
  const router = useRouter()
  const [options, setOptions] = useState<Pick<CityOption, "value" | "label">[]>([])
  // Use our custom hooks
  const { recentSelections, addRecentSelection, saveSearch } = useStoredCities()
  const { loadFormData, saveFormData } = useFlightFormPersistence()
  const [isLoading, setIsLoading] = useState(false)

  // Load persisted form data
  const persistedFormData = useMemo(() => loadFormData(), [])

  // Create form with react-hook-form
  const { control, handleSubmit, setValue, watch, trigger } = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      // Prioritize prop values over persisted values
      origin: initialOrigin || persistedFormData.origin,
      destination: initialDestination || persistedFormData.destination,
      departureDate:
        initialDepartureDate ||
        (persistedFormData.departureDate ? new Date(persistedFormData.departureDate) : undefined),
      passengers: initialPassengers || persistedFormData.passengers,
    },
    mode: "onChange",
  })

  const origin = watch("origin")
  const destination = watch("destination")
  const departureDate = watch("departureDate")
  const passengers = watch("passengers")

  // Save form values to localStorage whenever they change
  useEffect(() => {
    if (origin || destination || departureDate || passengers) {
      saveFormData({
        origin,
        destination,
        departureDate: departureDate ? departureDate.toISOString() : null,
        passengers,
      })
    }
  }, [origin, destination, departureDate, passengers, saveFormData])

  // Filter options to exclude selected cities
  const originOptions = useMemo(() => {
    return options.filter((option) => option.value !== destination)
  }, [options, destination])

  const destinationOptions = useMemo(() => {
    return options.filter((option) => option.value !== origin)
  }, [options, origin])

  const filteredRecentSelectionsOrigin = useMemo(() => {
    return recentSelections.filter((city) => city.value !== destination)
  }, [recentSelections, destination])

  const filteredRecentSelectionsDestination = useMemo(() => {
    return recentSelections.filter((city) => city.value !== origin)
  }, [recentSelections, origin])

  // Get city options from config
  useEffect(() => {
    getCityOptions().then(setOptions)
  }, [])

  // Custom onChange handlers
  const handleOriginChange = async (value: string) => {
    setValue("origin", value)
    // Trigger validation immediately
    trigger("origin")

    const cityOption = await getCityByName(value)
    if (cityOption) {
      addRecentSelection(value, cityOption.label, cityOption.code)
    }
  }

  const handleDestinationChange = async (value: string) => {
    setValue("destination", value)
    // Trigger validation immediately
    trigger("destination")

    const cityOption = await getCityByName(value)
    if (cityOption) {
      addRecentSelection(value, cityOption.label, cityOption.code)
    }
  }

  // Add function to handle date change with validation
  const handleDateChange = (date: Date | string | null) => {
    if (date) {
      setValue("departureDate", date instanceof Date ? date : new Date(date))
      // Trigger validation immediately
      trigger("departureDate")
    }
  }

  // Add function to handle passengers change with validation
  const handlePassengersChange = (passengers: PassengerCount) => {
    setValue("passengers", passengers)
    // Trigger validation immediately
    trigger("passengers")
  }

  // Handle exchange of origin and destination
  const handleExchange = () => {
    const currentOrigin = watch("origin")
    const currentDestination = watch("destination")
    setValue("origin", currentDestination)
    setValue("destination", currentOrigin)
  }

  // Handle search form submission
  const onSubmit = async (data: SearchFormValues) => {
    setIsLoading(true)

    try {
      // Get the city objects with their codes
      const originCity = await getCityByName(data.origin)
      const destinationCity = await getCityByName(data.destination)

      // If we can't find the codes, don't proceed
      if (!originCity || !destinationCity) {
        setIsLoading(false)
        return
      }

      // Save search when user submits
      saveSearch(originCity.code, destinationCity.code, formatDate(data.departureDate))

      // Close form if needed
      if (onClose) {
        onClose()
      }

      // Navigate to the flights page with the query parameters
      router.push(createFlightSearchUrl(originCity.code, destinationCity.code, data.departureDate, data.passengers))
    } catch (error) {
      console.error(error)
      // In case of error, reset loading state
      setIsLoading(false)
    }
  }

  // Create a state to track if we should focus the input
  const [shouldFocus, setShouldFocus] = useState(autoFocus)

  // Handle autofocus when the form is opened
  useEffect(() => {
    setShouldFocus(autoFocus)
  }, [autoFocus])

  // Error message renderer
  const renderErrorMessage = (errorMessage?: string) => {
    if (!errorMessage) return null

    return (
      <div className="text-Error-E500main absolute right-0 -bottom-2 z-20 text-xs">
        <span>{errorMessage}</span>
      </div>
    )
  }

  return (
    <div className="m-0 flex w-full flex-col items-center" id={id}>
      <div
        className={`relative flex h-full w-full flex-col items-center lg:flex-row lg:justify-center ${
          contextPage == "flights" ? "px-0 lg:px-30" : ""
        }`}
        role="dialog"
        aria-label="جستجوی پرواز"
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
          <div className="mt-4 flex w-full flex-col items-start gap-1 px-4 lg:mt-0 lg:flex-row lg:items-center lg:gap-3 lg:px-0 xl:gap-6">
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
                  <div className="relative z-150 w-full">
                    <Controller
                      name="origin"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <ComboboxSelect
                            noBorder
                            expandDropdown
                            placeholder="انتخاب شهر"
                            options={originOptions}
                            filled={true}
                            size="md"
                            dir="rtl"
                            label="مبدا"
                            searchPlaceholder="جستجوی شهر مبدا"
                            value={field.value}
                            onChange={handleOriginChange}
                            recentSelections={filteredRecentSelectionsOrigin}
                            autoFocus={shouldFocus}
                            hasError={!!fieldState.error}
                          />
                          {renderErrorMessage(fieldState.error?.message)}
                        </>
                      )}
                    />
                  </div>

                  {/* Divider between fields - Mobile & Tablet */}
                  <div className="bg-Gray-N200 my-2 h-px w-full"></div>

                  {/* Destination Field - Mobile & Tablet */}
                  <div className="relative w-full">
                    <Controller
                      name="destination"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <ComboboxSelect
                            noBorder
                            expandDropdown
                            placeholder="انتخاب شهر"
                            options={destinationOptions}
                            filled={true}
                            size="md"
                            dir="rtl"
                            label="مقصد"
                            searchPlaceholder="جستجوی شهر مقصد"
                            value={field.value}
                            onChange={handleDestinationChange}
                            recentSelections={filteredRecentSelectionsDestination}
                            hasError={!!fieldState.error}
                          />
                          {renderErrorMessage(fieldState.error?.message)}
                        </>
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
              <div className="relative w-full lg:w-40 xl:w-47">
                <Controller
                  name="origin"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <ComboboxSelect
                        noBorder
                        expandDropdown
                        placeholder="انتخاب شهر"
                        options={originOptions}
                        filled={true}
                        size="md"
                        dir="rtl"
                        label="مبدا"
                        searchPlaceholder="جستجوی شهر مبدا"
                        value={field.value}
                        onChange={handleOriginChange}
                        recentSelections={filteredRecentSelectionsOrigin}
                        hasError={!!fieldState.error}
                      />
                      {renderErrorMessage(fieldState.error?.message)}
                    </>
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
              <div className="relative w-full lg:w-40 xl:w-47">
                <Controller
                  name="destination"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <ComboboxSelect
                        noBorder
                        expandDropdown
                        placeholder="انتخاب شهر"
                        options={destinationOptions}
                        filled={true}
                        size="md"
                        dir="rtl"
                        label="مقصد"
                        searchPlaceholder="جستجوی شهر مقصد"
                        value={field.value}
                        onChange={handleDestinationChange}
                        recentSelections={filteredRecentSelectionsDestination}
                        hasError={!!fieldState.error}
                      />
                      {renderErrorMessage(fieldState.error?.message)}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="bg-Gray-N200 hidden h-12 w-px lg:block" />

            {/* Date and Passenger Fields - Side by side on all devices */}
            <div className="flex w-full flex-row items-center gap-4">
              {/* Departure Date Field */}
              <div className="relative w-1/2 lg:w-20 lg:pb-0 xl:w-20">
                <Controller
                  name="departureDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <DatePicker
                        noBorder
                        placeholder="انتخاب تاریخ"
                        label="تاریخ رفت"
                        size="md"
                        filled={true}
                        dir="rtl"
                        value={field.value}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        calendarProps={{
                          className: "w-full",
                        }}
                        hasError={!!fieldState.error}
                      />
                      {renderErrorMessage(fieldState.error?.message)}
                    </>
                  )}
                />
              </div>

              {/* Return Date Button - Hidden on mobile but visible on tablet and desktop */}
              <div className="hidden lg:block">
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
              <div className="relative w-1/2 lg:w-16 lg:pb-0 xl:w-18">
                <Controller
                  name="passengers"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <PassengerSelector
                        noBorder
                        placeholder="۱ مسافر"
                        label="مسافران"
                        size="md"
                        filled={true}
                        dir="rtl"
                        value={field.value}
                        onChange={handlePassengersChange}
                        hasError={!!fieldState.error}
                      />
                      {fieldState.error && renderErrorMessage(fieldState.error?.message)}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Divider before search button - Only visible in mobile layout (until 1169px) */}
            <div className="bg-Gray-N200 my-2 h-px w-full lg:hidden"></div>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-4 flex w-full items-center justify-center gap-4 pr-4 lg:mt-0 lg:w-1/4">
          <Button
            intent="primary"
            size="large"
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                <span>در حال جستجو...</span>
              </>
            ) : (
              "جستجوی پرواز"
            )}
          </Button>
        </div>
      </div>

      <Button
        intent="text"
        size="medium"
        className={`mt-2 -mb-5 ${contextPage == "flights" ? "hidden md:block" : "hidden"}`}
        onClick={onClose}
        leftIcon={<ArrowUp2 size="20" color="#5A28EE" />}
      >
        بستن
      </Button>
    </div>
  )
}
