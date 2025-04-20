"use client"

import * as React from "react"
import { twMerge } from "tailwind-merge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TextField, TextFieldProps, textFieldContainer, textFieldHelperText, textFieldLabel } from "@/components/TextField/TextField"
import { JalaliCalendar } from "@/components/JalaliCalendar/jalali-calendar"
import { useMediaQuery } from "@/hooks/use-media-query"
import { englishToFarsiNumber } from "utils/numbers"
import { Button } from "@/components/ui/button"
import { X, ArrowRight } from "lucide-react"

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
  
  // Prevent scrolling and hide main page header when datepicker is open on mobile
  React.useEffect(() => {
    if (!isDesktop && open) {
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden'
      
      // Hide the main page header (site navigation)
      document.body.classList.add('datepicker-fullscreen-open')
    } else {
      // Restore scrolling when closed
      document.body.style.overflow = ''
      
      // Restore the main page header
      document.body.classList.remove('datepicker-fullscreen-open')
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('datepicker-fullscreen-open')
    }
  }, [open, isDesktop])
  
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
  
  // Desktop calendar component - unchanged from original
  const DesktopCalendarComponent = () => {
    // Create a single disabled object that handles both min and max dates
    const disabledDates = {
      before: minDate || new Date(),
      ...(maxDate && { after: maxDate })
    };
    
    return (
      <div className="p-4">
        {/* @ts-ignore - Ignoring type issues to allow for the calendar to work properly */}
        <JalaliCalendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={disabledDates}
          {...calendarProps}
        />
      </div>
    );
  }
  
  // Mobile calendar component - with full-screen styling
  const MobileCalendarComponent = () => {
    // Create a single disabled object that handles both min and max dates
    const disabledDates = {
      before: minDate || new Date(),
      ...(maxDate && { after: maxDate })
    };
    
    // Add direct handler for mobile
    const handleMobileSelect = (day: Date | undefined) => {
      handleDateSelect(day)
    }
    
    return (
      <div className="w-full h-full">
        {/* @ts-ignore - Ignoring type issues to allow for the calendar to work properly */}
        <JalaliCalendar
          mode="single" 
          selected={selectedDate}
          onSelect={handleMobileSelect}
          disabled={disabledDates}
          className="w-full mx-auto"
          classNames={{
            months: "flex flex-col space-y-4 w-full",
            month: "w-full",
            month_grid: "w-full",
            weekdays: "self-stretch p-3 bg-slate-50 inline-flex justify-start items-start w-full",
            weekday: "flex-1 text-center justify-start text-slate-500 text-sm font-medium leading-normal",
            table: "w-full border-collapse",
            row: "flex w-full justify-between mb-2",
            cell: "text-center flex-1 p-0 relative",
            day: "w-12 h-12 p-0 flex items-center justify-center text-base rounded-full mx-auto",
            day_today: "bg-Primary-P50",
            day_selected: "!bg-Primary-P300 !text-white !font-bold hover:!bg-Primary-P300"
          }}
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
            <DesktopCalendarComponent />
          </PopoverContent>
        </Popover>
      </Container>
    )
  }
  
  // Mobile view uses full screen modal
  return (
    <Container>
      <div className="cursor-pointer" onClick={() => !disabled && setOpen(true)}>
        {triggerField}
      </div>
      
      {open && !disabled && (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col">
          <div className="self-stretch pt-4 inline-flex flex-col justify-center items-end gap-4">
            <div className="self-stretch px-4 inline-flex justify-start items-center gap-4">
            <div 
                className="size-6 relative cursor-pointer" 
                onClick={() => setOpen(false)}
              >
                <ArrowRight className="h-6 w-6 text-Gray-N500" />
              </div>
              <div className="text-right text-Gray-N600 text-sm font-semibold leading-normal">
                {label || "انتخاب تاریخ"}
              </div>
          
            </div>
            <div className="self-stretch h-px relative bg-Gray-N200 mb-4"></div>
          </div>
          <div className="flex-1 w-full px-0 py-0 overflow-auto">
            <style jsx global>{`
              /* Hide the main page header when datepicker is open */
              body.datepicker-fullscreen-open > header {
                display: none !important;
              }
              
              /* Mobile calendar styles */
              .rdp {
                width: 100% !important;
                margin: 0 !important;
              }
              .rdp-months {
                width: 100% !important;
                padding: 0 !important;
              }
              .rdp-month {
                width: 100% !important;
              }
              
              /* Fix caption and navigation alignment */
              .rdp-caption {
                position: relative !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 1.5rem 0 !important;
                width: 100% !important;
                box-sizing: border-box !important;
              }
              
              /* Add padding to the month container to fix spacing */
              .rdp-month {
                width: 100% !important;
                padding: 0 1.5rem !important;
                box-sizing: border-box !important;
              }
              
              .rdp-caption_label {
                font-size: 1.125rem !important;
                font-weight: 600 !important;
                padding: 0.5rem 1rem !important;
                z-index: 1 !important;
              }
              
              .rdp-nav {
                position: absolute !important;
                left: 1.5rem !important;
                right: 1.5rem !important;
                display: flex !important;
                justify-content: space-between !important;
                padding: 0 !important;
                width: calc(100% - 3rem) !important;
              }
              
              /* Also add padding to the table */
              .rdp-table, .rdp-months {
                padding: 0 0.5rem !important;
                box-sizing: border-box !important;
              }
              
              .rdp-weekdays {
                margin: 1.5rem 0.5rem 0 0.5rem !important;
                width: calc(100% - 1rem) !important;
                background-color: #f8fafc !important;
                padding: 0.75rem !important;
              }
              
              .rdp-button_previous,
              .rdp-button_next {
                height: 2.5rem !important;
                width: 2.5rem !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                background-color: transparent !important;
                border-radius: 9999px !important;
              }
              
              /* Table and day styles */
              .rdp-table {
                width: 100% !important;
                table-layout: fixed !important;
              }
              .rdp-cell {
                width: calc(100% / 7) !important;
                padding: 0 !important;
              }
              .rdp-weekday {
                color: #64748b !important;
                font-size: 0.875rem !important;
                font-weight: 500 !important;
                flex: 1 !important;
                text-align: center !important;
                width: auto !important;
              }
              .rdp-button {
                width: 100% !important;
                max-width: none !important;
                height: 3rem !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                margin: 0 auto !important;
              }
              .rdp-day_selected, 
              .rdp-day_selected:hover,
              .rdp-day_selected:focus {
                background-color: var(--Primary-P300, #4472FF) !important;
                color: white !important;
                font-weight: bold !important;
              }
              
              /* Additional styling to force selected state */
              [aria-selected="true"] {
                background-color: #4472FF !important;
                color: white !important;
                font-weight: bold !important;
              }
            `}</style>
            <MobileCalendarComponent />
          </div>
        </div>
      )}
    </Container>
  )
}