"use client"

import React from "react"
import { twMerge } from "tailwind-merge"

// Floating label input component
export type FloatingInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: boolean
}
export function FloatingInput({ label, error, ...props }: FloatingInputProps) {
  const [value, setValue] = React.useState(props.value ?? "")
  React.useEffect(() => {
    if (props.value !== undefined) setValue(props.value as string)
  }, [props.value])
  return (
    <div className="relative w-full">
      <input
        {...props}
        value={value}
        onChange={e => {
          setValue(e.target.value)
          if (props.onChange) props.onChange(e)
        }}
        placeholder=" "
        className={twMerge(
          "peer w-full border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 transition bg-transparent",
          error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-Primary-P300",
          props.className
        )}
      />
      <label
        className={twMerge(
          "absolute right-3 text-gray-700 text-sm transition-all duration-200 pointer-events-none",
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400",
          "peer-focus:top-1.5 peer-focus:-translate-y-1/3 peer-focus:text-gray-700",
          error ? "text-red-600" : ""
        )}
      >
        {label}
      </label>
    </div>
  )
}

// LoadingDots animation component
export function LoadingDots() {
  return (
    <span className="flex items-center justify-center space-x-1 rtl:space-x-reverse">
      <span className="animate-bounce inline-block w-2 h-2 bg-white rounded-full"></span>
      <span className="animate-bounce inline-block w-2 h-2 bg-white rounded-full animation-delay-150 ml-1"></span>
      <span className="animate-bounce inline-block w-2 h-2 bg-white rounded-full animation-delay-300"></span>
    </span>
  )
}
