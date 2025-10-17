"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { FloatingInput, LoadingDots } from "./SharedInputs"

export default function ForgotPasswordPhoneForm({
  onSubmit,
  isLoading,
  formError,
  initialPhone = "",
}: {
  onSubmit: (phone: string) => void | Promise<void>
  isLoading: boolean
  formError: string
  initialPhone?: string
}) {
  const [phone, setPhone] = useState(initialPhone)

  return (
    <form
      className="w-[85%] space-y-3.5"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(phone)
      }}
    >
      <h3 className="w-full text-center text-lg font-medium">وارد کردن کد تایید</h3>

      <p className="mb-4 text-sm text-gray-500">برای دریافت کد بازیابی شماره تلفن خود را وارد کنید.</p>
      <FloatingInput
        name="phone"
        type="tel"
        label="شماره تلفن"
        // do not force visual "required" error here; AuthModal will validate and show formError when needed
        value={phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
        autoComplete="tel"
      />
      {formError && <p className="text-right text-sm text-red-600">{formError}</p>}
      <Button
        type="submit"
        className="bg-Primary-P500main hover:bg-Primary-P600 mb-5 w-full rounded-lg py-2.5 text-base font-medium text-white transition"
        style={{ minHeight: 40 }}
        disabled={isLoading}
      >
        {isLoading ? <LoadingDots /> : "ارسال کد بازیابی"}
      </Button>
    </form>
  )
}
