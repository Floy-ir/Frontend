"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { FloatingInput, LoadingDots } from "./SharedInputs"

export default function LoginForm({
  handleLoginSubmit,
  emptyFields,
  formError,
  isLoading,
  onForgot,
  phone,
  password,
  onPhoneChange,
  onPasswordChange,
}: {
  handleLoginSubmit: (data: { phone: string; password: string }) => void | Promise<void>
  emptyFields: string[]
  formError: string
  isLoading: boolean
  onForgot?: (phone?: string) => void | Promise<void>
  phone?: string
  password?: string
  onPhoneChange?: (v: string) => void
  onPasswordChange?: (v: string) => void
}) {
  // inputs are controlled by parent `AuthModal` when provided
  const p = phone ?? ""
  const pass = password ?? ""
  return (
    <form
      className="w-[85%] space-y-3.5"
      onSubmit={(e) => {
        e.preventDefault()
        void handleLoginSubmit({ phone: p, password: pass })
      }}
    >
      <p className="mb-4 text-sm text-gray-500">برای ورود شماره تلفن و رمز عبود خود را وارد کنید.</p>

        <FloatingInput
        name="phone"
        type="tel"
        label="شماره تلفن"
        error={emptyFields.includes("phone")}
        value={p}
        onChange={(e) => onPhoneChange?.(e.target.value)}
        autoComplete="tel"
      />
      <FloatingInput
        name="password"
        type="password"
        label="رمز عبور"
        error={emptyFields.includes("password")}
        value={pass}
        onChange={(e) => onPasswordChange?.(e.target.value)}
        autoComplete="current-password"
      />
      {formError && <p className="text-right text-sm text-red-600">{formError}</p>}
      <Button
        type="submit"
        className="bg-Primary-P500main hover:bg-Primary-P600 w-full rounded-lg py-2.5 text-base font-medium text-white transition"
        style={{ minHeight: 40 }}
      >
        {isLoading ? <LoadingDots /> : "ورود"}
      </Button>
      <div className="text-center">
        <button
          type="button"
          className="text-Primary-P500main text-sm hover:underline"
            onClick={() => {
            if (!onForgot) return
            // pass current phone value from parent if available
            onForgot(p || undefined)
          }}
        >
          فراموشی رمز عبور
        </button>
      </div>
    </form>
  )
}
