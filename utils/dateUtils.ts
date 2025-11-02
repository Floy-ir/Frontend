/**
 * Format a date as YYYY-MM-DD
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Format a date to Jalali (Persian) calendar format with day of week
 * @param date The date to format
 * @returns Formatted Persian date string (e.g., "دوشنبه ۲۵ فروردین")
 */
export function formatToJalali(date: Date): string {
  // Define options for formatting
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Full day name
    day: "numeric", // Day of month
    month: "long", // Full month name
    calendar: "persian", // Use Persian calendar
  }

  // Create formatter with Persian locale
  const formatter = new Intl.DateTimeFormat("fa-IR", options)

  // Format the date
  return formatter.format(date)
}
