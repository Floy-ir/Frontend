"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none items-center select-none", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <SliderPrimitive.Range className="absolute h-full bg-slate-900 dark:bg-slate-400" />
    </SliderPrimitive.Track>
    {(props.value || props.defaultValue)?.map((_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        className="block h-5 w-5 rounded-full border-2 border-slate-900 bg-white ring-offset-white transition-colors focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-slate-50 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
      />
    ))}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

// Type guard to check if a value is defined
const isDefined = <T,>(value: T | undefined): value is T => value !== undefined

// DualRangeSlider component for selecting a range with two handles
interface DualRangeSliderProps extends Omit<
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
  formatLabel?: (value: number) => string
  showLabels?: boolean
}

const DualRangeSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, DualRangeSliderProps>(
  (
    {
      className,
      defaultValue = [0, 100],
      value,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      formatLabel = (value) => `${value}`,
      showLabels = false,
      ...props
    },
    ref
  ) => {
    // Ensure values are within min and max
    const normalizedDefaultValue: [number, number] = [
      Math.max(min, Math.min(defaultValue[0], max)),
      Math.max(min, Math.min(defaultValue[1], max)),
    ]

    // Ensure the values are in ascending order
    const sortedDefaultValue: [number, number] = [
      Math.min(...normalizedDefaultValue),
      Math.max(...normalizedDefaultValue),
    ]

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

    return (
      <div className={cn("space-y-2", className)}>
        <Slider
          ref={ref}
          defaultValue={sortedDefaultValue}
          value={value}
          min={min}
          max={max}
          step={step}
          onValueChange={handleValueChange}
          {...props}
        />
        {showLabels && (
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">{formatLabel(value?.[0] ?? sortedDefaultValue[0])}</span>
            <span className="text-sm text-slate-500">{formatLabel(value?.[1] ?? sortedDefaultValue[1])}</span>
          </div>
        )}
      </div>
    )
  }
)
DualRangeSlider.displayName = "DualRangeSlider"

// MultiRangeSlider component for selecting multiple ranges
interface MultiRangeSliderProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  "defaultValue" | "value" | "onValueChange"
> {
  className?: string
  defaultValue?: number[]
  value?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  formatLabel?: (value: number) => string
  showLabels?: boolean
}

const MultiRangeSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, MultiRangeSliderProps>(
  (
    {
      className,
      defaultValue = [0, 50, 100],
      value,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      formatLabel = (value) => `${value}`,
      showLabels = false,
      ...props
    },
    ref
  ) => {
    // Ensure values are within min and max and sorted
    const normalizedDefaultValue = React.useMemo((): number[] => {
      const values = [...(defaultValue || [])]
      // Filter out values outside the range and undefined values
      const filteredValues = values.filter(isDefined).filter((val) => val >= min && val <= max)
      // Sort values in ascending order
      filteredValues.sort((a, b) => a - b)
      // Ensure we have at least 2 values
      if (filteredValues.length < 2) {
        return [min, max]
      }
      return filteredValues
    }, [defaultValue, min, max])

    // Make sure currentValues is a non-undefined array of numbers
    const currentValues: number[] = React.useMemo(() => {
      return value?.filter(isDefined) || normalizedDefaultValue
    }, [value, normalizedDefaultValue])

    return (
      <div className={cn("space-y-2", className)}>
        <Slider
          ref={ref}
          defaultValue={normalizedDefaultValue}
          value={value}
          min={min}
          max={max}
          step={step}
          onValueChange={onValueChange}
          {...props}
        />
        {showLabels && (
          <div className="flex justify-between">
            {currentValues.map((val, index) => (
              <span key={index} className="text-sm text-slate-500">
                {formatLabel(val)}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }
)
MultiRangeSlider.displayName = "MultiRangeSlider"

export { Slider, DualRangeSlider, MultiRangeSlider }
