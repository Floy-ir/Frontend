"use client"

import * as React from "react"
import { twMerge } from "tailwind-merge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { TextField, TextFieldProps, textFieldContainer, textFieldHelperText, textFieldLabel } from "@/components/TextField/TextField"
import { JalaliCalendar } from "@/components/JalaliCalendar/jalali-calendar"
import { useMediaQuery } from "@/hooks/use-media-query"
import { englishToFarsiNumber } from "utils/numbers"

export interface DatePickerProps extends Omit<TextFieldProps, "onChange" | "value"> {
  value?: Date | string | null
  onChange?: (date: Date | string | null) => void
  minDate?: Date
  maxDate?: Date
  formatDate?: (date: Date) => string
  calendarProps?: Partial<React.ComponentProps<typeof JalaliCalendar>>
}

export function DatePicker({
  id,
  label,
  helperText,
  value = null,
  onChange,
  placeholder = "انتخاب تاریخ",
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
  minDate,
  maxDate,
  formatDate,
  calendarProps,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  // Convert string dates to Date objects if needed
  const selectedDate = value instanceof Date ? value : 
                      (typeof value === 'string' && value ? new Date(value) : null)
  
  // Default date formatter - can be overridden via props
  const defaultFormatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric' 
    }
    
    // Format the date based on locale
    const formatter = new Intl.DateTimeFormat('fa-IR', options)
    return formatter.format(date)
  }
  
  const formattedDate = selectedDate ? (formatDate ? formatDate(selectedDate) : defaultFormatDate(selectedDate)) : ""
  
  const handleDateSelect = (day: Date | undefined) => {
    if (day) {
      onChange?.(day)
      setOpen(false)
    }
  }
  
  // The trigger field component
  const triggerField = (
    <TextField
      id={id}
      value={dir === "rtl" && formattedDate ? englishToFarsiNumber(formattedDate) : formattedDate}
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
  
  // The calendar component
  const CalendarComponent = () => {
    // Create a single disabled object that handles both min and max dates
    const disabledDates = {
      before: minDate || new Date(),
      ...(maxDate && { after: maxDate })
    };
    
    return (
      <div className="p-4">
        <JalaliCalendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleDateSelect}
          disabled={disabledDates}
          {...calendarProps}
        />
      </div>
    );
  }
  
  // Desktop view uses Popover
  if (isDesktop) {
    return (
      <Container>
        <Popover open={open && !disabled} onOpenChange={disabled ? undefined : setOpen}>
          <PopoverTrigger asChild>
            <div className="cursor-pointer">{triggerField}</div>
          </PopoverTrigger>
          <PopoverContent
            className="overflow-hidden rounded-xl p-0 border border-Gray-N200 shadow-[0px_4px_20px_rgba(0,0,0,0.1)] bg-white transform translate-x-4"
            align={dir === "rtl" ? "start" : "end"}
            sideOffset={4}
          >
            <CalendarComponent />
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
          <div className="cursor-pointer">{triggerField}</div>
        </DrawerTrigger>
        <DrawerContent className="bg-white flex items-center justify-center">
          <DrawerHeader className="px-4">
            <DrawerTitle>{label || "انتخاب تاریخ"}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pt-0 flex justify-center">
            <CalendarComponent />
          </div>
        </DrawerContent>
      </Drawer>
    </Container>
  )
}