"use client"

import { Add, Minus } from "iconsax-react"
import * as React from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "@/components/elements/Button/Button"
import {
  TextField,
  textFieldContainer,
  textFieldHelperText,
  textFieldLabel,
  TextFieldProps,
} from "@/components/elements/TextField/TextField"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useMediaQuery } from "@/hooks/use-media-query"
import { englishToFarsiNumber } from "utils/numbers"

// Passenger types with display names
type PassengerType = "adult" | "child" | "infant"

interface PassengerTypeConfig {
  type: PassengerType
  label: string
  description: string
  min: number
  max: number
}

const passengerTypes: PassengerTypeConfig[] = [
  {
    type: "adult",
    label: "بزرگسال",
    description: "۱۲ سال به بالا",
    min: 1,
    max: 9,
  },
  {
    type: "child",
    label: "کودک",
    description: "۲ تا ۱۲ سال",
    min: 0,
    max: 4,
  },
  {
    type: "infant",
    label: "نوزاد",
    description: "زیر ۲ سال",
    min: 0,
    max: 2,
  },
]

export interface PassengerCount {
  adult: number
  child: number
  infant: number
}

export interface PassengerSelectorProps extends Omit<TextFieldProps, "onChange" | "value"> {
  value: PassengerCount | string
  onChange: (value: PassengerCount) => void
  maxTotalPassengers?: number
  hasError?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PassengerSelector({
  id,
  label,
  helperText,
  value = { adult: 1, child: 0, infant: 0 },
  onChange,
  placeholder = "۱ مسافر",
  disabled,
  intent,
  size = "md",
  width,
  filled = false,
  containerClassName,
  labelClassName,
  inputClassName,
  helperTextClassName,
  customWidth,
  customHeight,
  dir = "rtl",
  maxTotalPassengers = 9,
  hasError,
  open,
  onOpenChange,
  ...props
}: PassengerSelectorProps) {
  // Convert string value to PassengerCount if needed
  const passengerCount: PassengerCount = typeof value === "string" ? { adult: 1, child: 0, infant: 0 } : value

  // Use the value from props directly, don't maintain a separate internal state
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const currentOpen = isControlled ? open : internalOpen
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const setOpenState = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  // Calculate total passengers
  const totalPassengers = Object.values(passengerCount).reduce((sum, count) => sum + count, 0)

  // Format passenger count for display
  const formatPassengerCount = () => {
    if (totalPassengers === 0) return placeholder
    return `${englishToFarsiNumber(totalPassengers)} مسافر`
  }

  // Handle increment/decrement of passenger counts
  const updatePassengerCount = (type: PassengerType, increment: boolean) => {
    const config = passengerTypes.find((pt) => pt.type === type)
    if (!config) return

    const newCount = { ...passengerCount }

    if (increment) {
      // Check if incrementing would exceed max for this type
      if (newCount[type] >= config.max) return

      // Check if total passengers would exceed max
      if (totalPassengers >= maxTotalPassengers) return

      newCount[type]++
    } else {
      // Check if decrementing would go below min for this type
      if (newCount[type] <= config.min) return

      newCount[type]--
    }

    // Call onChange directly without setTimeout
    onChange(newCount)
  }

  // The trigger field component
  const triggerField = (
    <TextField
      id={id}
      value={formatPassengerCount()}
      placeholder={placeholder}
      intent={intent}
      size={size}
      width={width}
      filled={filled}
      disabled={disabled}
      inputClassName={inputClassName}
      customWidth={customWidth}
      customHeight={customHeight}
      dir={dir}
      readOnly
      hasError={hasError}
      {...props}
    />
  )

  // Main container wrapper
  const Container = ({ children }: { children: React.ReactNode }) => (
    <div
      className={twMerge(
        textFieldContainer({ intent, disabled, className: containerClassName }),
        props.noBorder && "gap-0"
      )}
    >
      {label && <div className={twMerge(textFieldLabel({ intent, className: labelClassName }))}>{label}</div>}
      {children}
      {helperText && (
        <div className={twMerge(textFieldHelperText({ intent, className: helperTextClassName }))}>{helperText}</div>
      )}
    </div>
  )

  // The passenger selector component
  const PassengerSelectorContent = () => (
    <div className="flex flex-col gap-6 p-4">
      {/* Passenger type selectors */}
      <div className="flex flex-col gap-4">
        {passengerTypes.map((passengerType) => (
          <div key={passengerType.type} className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-Gray-N700 text-sm font-semibold">{passengerType.label}</span>
              <span className="text-Gray-N500 text-xs">{passengerType.description}</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                intent="primary"
                size="custom"
                customSize="w-8 h-8 p-0 flex items-center justify-center"
                onClick={() => updatePassengerCount(passengerType.type, true)}
                disabled={
                  passengerCount[passengerType.type] >= passengerType.max || totalPassengers >= maxTotalPassengers
                }
              >
                <Add size={16} color="var(--color-white)" />
              </Button>

              <span className="text-Gray-N700 min-w-6 text-center font-medium">
                {englishToFarsiNumber(passengerCount[passengerType.type])}
              </span>

              <Button
                type="button"
                intent="primary"
                size="custom"
                customSize="w-8 h-8 p-0 flex items-center justify-center"
                onClick={() => updatePassengerCount(passengerType.type, false)}
                disabled={passengerCount[passengerType.type] <= passengerType.min}
              >
                <Minus size={16} color="var(--color-white)" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Maximum passengers error message */}
      {totalPassengers >= maxTotalPassengers && (
        <div className="mb-2 rounded-md bg-red-50 p-3">
          <div className="flex">
            <div className="text-sm font-medium text-red-600">
              حداکثر تعداد مسافران {englishToFarsiNumber(maxTotalPassengers)} نفر است.
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Desktop view uses Popover
  if (isDesktop) {
    return (
      <Container>
        <Popover open={currentOpen && !disabled} onOpenChange={disabled ? undefined : setOpenState}>
          <PopoverTrigger asChild>
            <div className="cursor-pointer">{triggerField}</div>
          </PopoverTrigger>
          <PopoverContent
            className="border-Gray-N200 translate-x-4 transform overflow-hidden rounded-xl border bg-white p-0 shadow-[0px_4px_20px_rgba(0,0,0,0.1)]"
            align={dir === "rtl" ? "start" : "end"}
            sideOffset={4}
          >
            <PassengerSelectorContent />
          </PopoverContent>
        </Popover>
      </Container>
    )
  }

  // Mobile view uses Drawer
  return (
    <Container>
      <Drawer open={currentOpen && !disabled} onOpenChange={disabled ? undefined : setOpenState}>
        <DrawerTrigger asChild>
          <div className="cursor-pointer">{triggerField}</div>
        </DrawerTrigger>
        <DrawerContent className="bg-white">
          <DrawerHeader className="px-4">
            <DrawerTitle>{label || "انتخاب مسافران"}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pt-0">
            <PassengerSelectorContent />
          </div>
        </DrawerContent>
      </Drawer>
    </Container>
  )
}
