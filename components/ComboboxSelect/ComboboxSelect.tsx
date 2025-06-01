"use client"

import { ArrowDown2, ArrowUp2, CloseCircle, Location } from "iconsax-react"
import * as React from "react"
import { twMerge } from "tailwind-merge"
import {
  TextField,
  textFieldContainer,
  textFieldHelperText,
  textFieldLabel,
  TextFieldProps,
} from "@/components/TextField/TextField"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
  recentSelections?: Array<{ value: string; label: string }>
  autoFocus?: boolean
  hasError?: boolean
}

export const ComboboxSelect = React.forwardRef<
  HTMLInputElement,
  ComboboxSelectProps
>(function ComboboxSelect(
  {
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
    recentSelections = [],
    autoFocus,
    hasError,
    ...props
  },
  ref
) {
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
      autoFocus={autoFocus}
      ref={ref}
      hasError={hasError}
      {...props}
    />
  )

  // The options list component
  const OptionsList = React.useCallback(() => {
    // Add state to manage the search input value
    const [searchValue, setSearchValue] = React.useState("")
    const commandInputRef = React.useRef<HTMLInputElement>(null)

    // Function to clear the input value
    const clearSearch = () => {
      setSearchValue("")
      // Focus the input after clearing for better UX
      setTimeout(() => {
        commandInputRef.current?.focus()
      }, 0)
    }

    return (
      <Command className="overflow-hidden rounded-xl bg-white">
        <div className="p-4">
          <div className="flex flex-col items-end justify-center overflow-hidden rounded-lg px-2 outline-2 outline-offset-[-2px] outline-[#9170f4]">
            <div className="Content flex w-full items-center justify-between gap-3 rounded-lg">
              <CommandInput
                ref={commandInputRef}
                value={searchValue}
                onValueChange={setSearchValue}
                placeholder={searchPlaceholder || `جستجو ${label || "options"}...`}
                className={`h-10 flex-grow py-3 ${
                  dir === "rtl" ? "text-right" : "text-left"
                } border-none outline-none placeholder:text-gray-400`}
              />
              <div className="flex cursor-pointer items-center justify-center" onClick={clearSearch}>
                {!searchValue ? "" : <CloseCircle size={16} color="var(--color-Gray-N500)" />}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-Gray-N100 h-1 w-full"></div>

        {recentSelections.length > 0 && (
          <div className="flex items-center justify-start gap-3 self-stretch px-4 py-3">
            <div className="relative size-5">
              <div className="text-Gray-N400">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 6.25V10H13.75"
                    stroke="#9170F4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-row-reverse items-center justify-start gap-2 overflow-x-auto">
              {recentSelections.map((item) => (
                <div
                  key={item.value}
                  onClick={() => handleSelect(item.value)}
                  className="bg-Shade-White outline-Gray-N100 flex cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-2xl px-3 py-1 outline-2 outline-offset-[-2px]"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <div className="text-sm">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="border-Gray-N100 w-full border-t"></div>
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
                  <div className="text-Gray-N800 flex-1 text-right text-base leading-7 font-normal">{option.label}</div>
                </CommandItem>
                {index < options.length - 1 && <div className="border-Gray-N100 w-full border-t"></div>}
              </React.Fragment>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  }, [
    options,
    value,
    showSelectedIcon,
    maxHeight,
    dir,
    label,
    noResultsText,
    handleSelect,
    searchPlaceholder,
    recentSelections,
  ])

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
            className="border-Gray-N200 translate-x-4 transform overflow-hidden rounded-xl border bg-white p-0 shadow-[0px_4px_20px_rgba(0,0,0,0.1)]"
            align={dir === "rtl" ? "start" : "end"}
            sideOffset={4}
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
        <DrawerContent className="bg-white" style={{ zIndex: 9999 }}>
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
})
