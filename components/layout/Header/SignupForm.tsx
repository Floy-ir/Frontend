"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { FloatingInput, LoadingDots } from "./SharedInputs"

export default function SignupForm({ handleSignupSubmit, emptyFields, formError, isLoading }: {
  handleSignupSubmit: (data: { phone: string }) => void | Promise<void>
  emptyFields: string[]
  formError: string
  isLoading: boolean
}) {
  const [phone, setPhone] = React.useState("")
  React.useEffect(() => {
    if (!formError) {
      setPhone("")
    }
  }, [formError])
  return (
  <div className="w-[85%] mt-5">
    
    <form
      className="space-y-5"
      onSubmit={e => {
        e.preventDefault()
        void handleSignupSubmit({ phone })
      }}
    >
      <p className="text-sm text-gray-500 mb-4 m-1">برای دریافت کد تایید شماره تلفن خود را وارد کنید.</p>

      <FloatingInput
        name="phone"
        type="tel"
        label="شماره تلفن"
        error={emptyFields.includes("phone")}
        value={phone}
        onChange={e => setPhone(e.target.value)}
        autoComplete="tel"
      />
      
      {formError && <p className="text-red-600 text-sm text-right -mt-2">{formError}</p>}
      <Button
        type="submit"
        className={`w-full bg-Primary-P500main text-white rounded-lg py-2.5 ${formError ? "mt-0" : "mt-4"} text-base font-medium hover:bg-Primary-P600 transition`}
        style={{ minHeight: 40 }}
      >
        {isLoading ? <LoadingDots /> : "دریافت کد تایید"}
      </Button>
    </form>
  </div>
)
}
