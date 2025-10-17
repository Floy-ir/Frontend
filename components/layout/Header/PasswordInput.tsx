"use client"

import { Eye, EyeSlash } from "iconsax-react"
import React from "react"
import { FloatingInput } from "./SharedInputs"

export default function PasswordInput({
  value,
  onChange,
  name,
  label,
  error,
  autoComplete,
  className,
}: {
  value: string
  onChange: (v: string) => void
  name?: string
  label: string
  error?: boolean
  autoComplete?: string
  className?: string
}) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className={className}>
      <div className="relative">
        <FloatingInput
          name={name}
          type={visible ? "text" : "password"}
          label={label}
          error={error}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-Gray-N700 absolute top-1/2 right-auto left-3 z-10 -translate-y-1/2 cursor-pointer text-sm"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <Eye size={18} variant="Outline" color="currentColor" />
          ) : (
            <EyeSlash size={18} variant="Outline" color="currentColor" />
          )}
        </button>
      </div>
    </div>
  )
}
