"use client"

import * as React from "react"
import { Check, ArrowUp2, ArrowDown2 } from "iconsax-react"
import { twMerge } from "tailwind-merge"
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TextField, TextFieldProps } from "@/components/TextField/TextField"
import { textFieldContainer, textFieldHelperText, textFieldLabel } from "@/components/TextField/TextField"
import { useMediaQuery } from "@/hooks/use-media-query"

export interface ComboboxSelectProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (value: string) => void
  noResultsText?: string
  showSelectedIcon?: boolean
  maxHeight?: string
  searchPlaceholder?: string
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
      leftIcon={leftIcon || (open ? <ArrowUp2 size={16} color="var(--color-Gray-N500)" /> : <ArrowDown2 size={16} color="var(--color-Gray-N500)" />)}
      {...props}
    />
  )
  
  // The options list component
  const OptionsList = React.useCallback(() => (
    <Command>
      <CommandInput 
        placeholder={searchPlaceholder || `جستجو ${label || 'options'}...`}
        className={`py-3 ${dir === "rtl" ? "text-right" : "text-left"}`}
      />
      <CommandList style={{ maxHeight }}>
        <CommandEmpty>{noResultsText}</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={handleSelect}
              className={`flex items-center justify-between ${dir === "rtl" ? "text-right" : "text-left"}`}
            >
              <span>{option.label}</span>
              {showSelectedIcon && option.value === value && (
                <Check size={16} />
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  ), [options, value, showSelectedIcon, maxHeight, dir, label, noResultsText, handleSelect, searchPlaceholder])
  
  // Main container wrapper
  const Container = ({ children }: { children: React.ReactNode }) => (
    <div className={twMerge(
      textFieldContainer({ intent, disabled, className: containerClassName }),
      props.noBorder && "gap-0"
    )}>
      {label && (
        <div className={twMerge(textFieldLabel({ intent, className: labelClassName }))}>
          {label}
        </div>
      )}
      
      {children}
      
      {helperText && (
        <div className={twMerge(textFieldHelperText({ intent, className: helperTextClassName }))}>
          {helperText}
        </div>
      )}
    </div>
  )

  // Desktop view uses Popover
  if (isDesktop) {
    return (
      <Container>
        <Popover open={open && !disabled} onOpenChange={disabled ? undefined : setOpen}>
          <PopoverTrigger asChild>
            <div>{triggerField}</div>
          </PopoverTrigger>
          <PopoverContent 
            className="p-0" 
            align={dir === "rtl" ? "end" : "start"}
            sideOffset={8}
            style={{ width: customWidth || "var(--radix-popover-trigger-width)" }}
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
            <DrawerTitle>
              {label || "Select an option"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pt-0">
            <OptionsList />
          </div>
        </DrawerContent>
      </Drawer>
    </Container>
  )
}