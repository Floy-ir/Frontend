"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { FloatingInput, LoadingDots } from "./SharedInputs"

export default function SignupForm({
  handleSignupSubmit,
  emptyFields,
  formError,
  isLoading,
  phone,
  onPhoneChange,
}: {
  handleSignupSubmit: (data: { phone: string }) => void | Promise<void>
  emptyFields: string[]
  formError: string
  isLoading: boolean
  phone?: string
  onPhoneChange?: (v: string) => void
}) {
  const p = phone ?? ""
  return (
    <div className="w-[85%]">
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          void handleSignupSubmit({ phone: p })
        }}
      >
        <p className="text-sm text-gray-500">برای دریافت کد تایید شماره تلفن خود را وارد کنید.</p>

        <FloatingInput
          name="phone"
          type="tel"
          label="شماره تلفن"
          error={emptyFields.includes("phone")}
          value={p}
          onChange={(e) => onPhoneChange?.(e.target.value)}
          autoComplete="tel"
        />

        {formError && <p className="-mt-2 text-right text-sm text-red-600">{formError}</p>}
        <Button
          type="submit"
          className={`bg-Primary-P500main w-full rounded-lg text-white ${
            formError ? "mb-4" : "-mb-0"
          } text-base font-medium transition hover:bg-[#431cb5]`}
          style={{ minHeight: 40 }}
        >
          {isLoading ? <LoadingDots /> : "دریافت کد تایید"}
        </Button>
      </form>
    </div>
  )
}
