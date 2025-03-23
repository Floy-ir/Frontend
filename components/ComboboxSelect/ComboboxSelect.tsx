"use client"

import * as React from "react"
import { Check, ArrowUp2, ArrowDown2, SearchNormal, CloseCircle, Location } from "iconsax-react"
import { twMerge } from "tailwind-merge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TextField, TextFieldProps } from "@/components/TextField/TextField"
import { textFieldContainer, textFieldHelperText, textFieldLabel } from "@/components/TextField/TextField"
import { useMediaQuery } from "@/hooks/use-media-query"

export interface ComboboxSelectProps extends Omit<TextFieldProps, "onChange" | "value"> {
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (value: string) => void
  noResultsText?: string
  showSelectedIcon?: boolean
  maxHeight?: string
  searchPlaceholder?: string
  dropdownWidth?: string | number
  expandDropdown?: boolean
}

export function ComboboxSelect({
  id,
  label,
  helperText,
  options,
  value = "",
  onChange,
  placeholder = "یک گزینه را انتخاب کنید",
  noResultsText = "نتیجه‌ای پیدا نشد",
  disabled,
  rightIcon,
  intent,
  size,
  width,
  filled,
  containerClassName,
  labelClassName,
  inputClassName,
  helperTextClassName,
  customWidth,
  customHeight,
  dir = "rtl",
  showSelectedIcon = true,
  maxHeight = "300px",
  searchPlaceholder,
  leftIcon,
  dropdownWidth,
  expandDropdown = false,
  ...props
}: ComboboxSelectProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Find the selected option
  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (currentValue: string) => {
    onChange?.(currentValue)
    setOpen(false)
  }

  // The trigger field
  const triggerField = (
    <TextField
      id={id}
      value={selectedOption?.label || ""}
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
      rightIcon={rightIcon}
      leftIcon={
        leftIcon ||
        (open ? (
          <ArrowUp2 size={16} color="var(--color-Gray-N500)" />
        ) : (
          <ArrowDown2 size={16} color="var(--color-Gray-N500)" />
        ))
      }
      {...props}
    />
  )

  // The options list component
  const OptionsList = React.useCallback(
    () => (
      <Command className="overflow-hidden rounded-xl bg-white">
        <div className="p-4">
          <div className="flex flex-col items-end justify-center overflow-hidden rounded-xl px-4 outline-2 outline-offset-[-2px] outline-[#8480fc]">
            <div className="flex w-full items-center justify-between gap-3">
              <CommandInput
                placeholder={searchPlaceholder || `جستجو ${label || "options"}...`}
                className={`h-10 flex-grow py-3 ${dir === "rtl" ? "text-right" : "text-left"} border-none outline-none`}
              />
              {value && (
                <div className="flex items-center justify-center">
                  <CloseCircle size={16} color="var(--color-Gray-N500)" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-Gray-N100 h-1 w-full"></div>

        <CommandList className="shadow-[0px_25px_66px_-12px_rgba(0,0,0,0.08)]" style={{ maxHeight }}>
          <CommandEmpty className="px-4 py-3 text-right">{noResultsText}</CommandEmpty>
          <CommandGroup className="overflow-hidden">
            {options.map((option, index) => (
              <React.Fragment key={option.value}>
                <CommandItem
                  value={option.value}
                  onSelect={handleSelect}
                  className="flex cursor-pointer items-center justify-between px-4 py-3"
                >
                  <div className="relative size-4">
                    <Location size={16} color="var(--color-Gray-N500)" />
                  </div>
                  <div className="text-Gray-N800 flex-1 text-right text-base leading-7 font-medium">{option.label}</div>
                </CommandItem>
                {index < options.length - 1 && <div className="border-t border-Gray-N100 w-full"></div>}
              </React.Fragment>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    [options, value, showSelectedIcon, maxHeight, dir, label, noResultsText, handleSelect, searchPlaceholder]
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

  // Calculate dropdown width
  const getDropdownWidth = () => {
    if (dropdownWidth) {
      return typeof dropdownWidth === "number" ? `${dropdownWidth}px` : dropdownWidth
    }
    if (expandDropdown) {
      return "calc(var(--radix-popover-trigger-width) + 68px)"
    }
    return customWidth || "var(--radix-popover-trigger-width)"
  }

  // Desktop view uses Popover
  if (isDesktop) {
    return (
      <Container>
        <Popover open={open && !disabled} onOpenChange={disabled ? undefined : setOpen}>
          <PopoverTrigger asChild>
            <div>{triggerField}</div>
          </PopoverTrigger>
          <PopoverContent
            className="overflow-hidden rounded-xl p-0 border border-Gray-N200 shadow-[0px_4px_20px_rgba(0,0,0,0.1)] bg-white"
            align={dir === "rtl" ? "end" : "start"}
            sideOffset={8}
            style={{ width: getDropdownWidth() }}
          >
            <OptionsList />
          </PopoverContent>
        </Popover>
      </Container>
    )
  }

  // Mobile view uses Drawer
  return (
    <Container>
      <Drawer open={open && !disabled} onOpenChange={disabled ? undefined : setOpen}>
        <DrawerTrigger asChild>
          <div>{triggerField}</div>
        </DrawerTrigger>
        <DrawerContent className="bg-white">
          <DrawerHeader className="px-4">
            <DrawerTitle>{label || "Select an option"}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pt-0">
            <OptionsList />
          </div>
        </DrawerContent>
      </Drawer>
    </Container>
  )
}
