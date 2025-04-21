"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface RangeSliderProps {
  minLabel?: string
  maxLabel?: string
  min: number
  max: number
  step?: number
  defaultValue?: [number, number]
  formatValue?: (value: number) => string
  onChange?: (values: [number, number]) => void
  className?: string
}

export function RangeSlider({
  minLabel,
  maxLabel,
  min,
  max,
  step = 1,
  defaultValue,
  formatValue,
  onChange,
  className,
}: RangeSliderProps) {
  // Use min and max for default values if not provided
  const initialValues: [number, number] = defaultValue || [min, max]
  const [values, setValues] = React.useState<[number, number]>(initialValues)

  const handleChange = React.useCallback(
    (newValues: number[]) => {
      if (newValues.length >= 2) {
        const rangeValues: [number, number] = [newValues[0], newValues[1]]
        setValues(rangeValues)
        onChange?.(rangeValues)
      }
    },
    [onChange]
  )

  // Format the values for display
  const displayMinValue = React.useMemo(() => 
    formatValue ? formatValue(values[0]) : minLabel || values[0].toString(),
    [formatValue, values, minLabel]
  )
  
  const displayMaxValue = React.useMemo(() => 
    formatValue ? formatValue(values[1]) : maxLabel || values[1].toString(),
    [formatValue, values, maxLabel]
  )

  return (
    <div className="w-full py-3 flex flex-col justify-start items-center gap-1">
      <div className="w-full py-2 relative inline-flex justify-center items-center">
        <SliderPrimitive.Root
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
          )}
          min={min}
          max={max}
          step={step}
          value={values}
          onValueChange={handleChange}
          defaultValue={initialValues}
        >
          <SliderPrimitive.Track
            className="relative h-1 w-full grow overflow-hidden rounded-sm bg-Gray-N100"
          >
            <SliderPrimitive.Range className="absolute h-full bg-Primary-P500main" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            className="block h-4 w-4 rounded-full border border-Gray-N200 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Primary-P500main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          />
          <SliderPrimitive.Thumb
            className="block h-4 w-4 rounded-full border border-Gray-N200 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Primary-P500main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          />
        </SliderPrimitive.Root>
      </div>
      <div className="w-full h-6 inline-flex justify-between items-center">
        <div className="text-Gray-N500 text-sm font-medium font-['Anjoman_Max_FN'] leading-normal">
          {displayMinValue}
        </div>
        <div className="text-right text-Gray-N500 text-sm font-medium font-['Anjoman_Max_FN'] leading-normal">
          {displayMaxValue}
        </div>
      </div>
    </div>
  )
} 