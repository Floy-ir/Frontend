"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"
import { cn } from "@/lib/utils"

// Type guard to check if a value is defined
const isDefined = <T,>(value: T | undefined): value is T => value !== undefined

interface FancySliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    "defaultValue" | "value" | "onValueChange"
  > {
  className?: string
  defaultValue?: [number, number]
  value?: [number, number]
  onValueChange?: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  leftLabel?: string
  rightLabel?: string
}

const FancySlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, FancySliderProps>(
  (
    {
      className,
      defaultValue = [20, 80],
      value,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      leftLabel = "Min",
      rightLabel = "Max",
      ...props
    },
    ref
  ) => {
    // Ensure values are within min and max and sorted
    const normalizedDefaultValue: [number, number] = React.useMemo(() => {
      const minValue = Math.max(min, Math.min(defaultValue[0], max))
      const maxValue = Math.max(min, Math.min(defaultValue[1], max))
      return [Math.min(minValue, maxValue), Math.max(minValue, maxValue)]
    }, [defaultValue, min, max])

    const handleValueChange = React.useCallback(
      (newValues: number[]) => {
        if (onValueChange && newValues.length === 2) {
          const firstValue = newValues[0]
          const secondValue = newValues[1]

          if (isDefined(firstValue) && isDefined(secondValue)) {
            onValueChange([firstValue, secondValue])
          }
        }
      },
      [onValueChange]
    )

    // Calculate the position of the track
    const currentValues = value || normalizedDefaultValue
    const trackStart = ((currentValues[0] - min) / (max - min)) * 100
    const trackEnd = ((currentValues[1] - min) / (max - min)) * 100
    const trackWidth = trackEnd - trackStart

    return (
      <div className={cn("flex w-full flex-col items-center justify-start gap-1 py-3", className)}>
        <div className="relative flex w-full items-center justify-center py-2">
          {/* Inactive track */}
          <div className="h-1 w-full overflow-hidden rounded-sm bg-gray-200">
            {/* Colored active track */}
            <div
              className="absolute h-1 rounded-sm bg-[var(--Primary-P500main,#5a28ee)]"
              style={{
                left: `${trackStart}%`,
                width: `${trackWidth}%`,
              }}
            />
          </div>

          {/* Slider with custom styling */}
          <SliderPrimitive.Root
            ref={ref}
            className="absolute inset-0 flex touch-none items-center select-none"
            value={value}
            defaultValue={normalizedDefaultValue}
            min={min}
            max={max}
            step={step}
            onValueChange={handleValueChange}
            {...props}
          >
            <SliderPrimitive.Track className="relative h-1 w-full grow rounded-full bg-transparent">
              <SliderPrimitive.Range className="absolute h-full bg-transparent" />
            </SliderPrimitive.Track>

            {/* Left thumb with arrow */}
            <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full bg-[var(--Primary-P500main,#5a28ee)] focus:ring-2 focus:ring-[var(--Primary-P500main,#5a28ee)] focus:ring-offset-2 focus:outline-none">
              <div className="absolute -top-[6px] -left-[6px] size-8">
                <div className="absolute top-[6px] left-[6px] size-5 rounded-full bg-[var(--Primary-P500main,#5a28ee)]" />
              </div>
              <div className="absolute top-[4px] left-[4px] size-3 overflow-hidden text-white">
                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.17 2.67L7.5 6L4.17 9.33"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </SliderPrimitive.Thumb>

            {/* Right thumb with arrow */}
            <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full bg-[var(--Primary-P500main,#5a28ee)] focus:ring-2 focus:ring-[var(--Primary-P500main,#5a28ee)] focus:ring-offset-2 focus:outline-none">
              <div className="absolute -top-[6px] -left-[6px] size-8">
                <div className="absolute top-[6px] left-[6px] size-5 rounded-full bg-[var(--Primary-P500main,#5a28ee)]" />
              </div>
              <div className="absolute top-[4px] left-[4px] size-3 overflow-hidden text-white">
                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.83 2.67L4.5 6L7.83 9.33"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </SliderPrimitive.Thumb>
          </SliderPrimitive.Root>
        </div>

        {/* Labels */}
        <div className="flex h-6 w-full items-center justify-between">
          <div className="text-Gray-N500 text-sm font-medium">{leftLabel}</div>
          <div className="text-Gray-N500 text-sm font-medium">{rightLabel}</div>
        </div>
      </div>
    )
  }
)
FancySlider.displayName = "FancySlider"

export { FancySlider }
