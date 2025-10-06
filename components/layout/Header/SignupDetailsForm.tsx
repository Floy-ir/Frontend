"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { FloatingInput, LoadingDots } from "./SharedInputs"

export default function SignupDetailsForm({ onSubmit, emptyFields, formError, isLoading }: {
  onSubmit: (data: { name: string; password: string; confirm: string }) => void | Promise<void>
  emptyFields: string[]
  formError: string
  isLoading: boolean
}) {
  const [name, setName] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")

  React.useEffect(() => {
    if (!formError) {
      setName("")
      setPassword("")
      setConfirm("")
    }
  }, [formError])

  return (
      <form
      className="space-y-3 w-[85%] mr-16.5 mt-4"
      onSubmit={e => {
        e.preventDefault()
        void onSubmit({ name, password, confirm })
      }}
    >
      <p className="text-sm text-gray-500 mb-3 mt-1"> اطلاعات خود را وارد کنید. </p>

      <FloatingInput
        name="name"
        type="text"
        label="نام"
        error={emptyFields.includes("name")}
        value={name}
        onChange={e => setName(e.target.value)}
        autoComplete="name"
      />
      <FloatingInput
        name="password"
        type="password"
        label="رمز عبور"
        error={emptyFields.includes("password")}
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoComplete="new-password"
      />
      <FloatingInput
        name="confirm"
        type="password"
        label="تکرار رمز عبور"
        error={emptyFields.includes("confirm")}
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        autoComplete="new-password"
      />
      {formError && <p className="text-red-600 text-sm text-right">{formError}</p>}
      <Button
        type="submit"
        className="w-full bg-Primary-P500main text-white rounded-lg py-2.5 text-base font-medium hover:bg-Primary-P600 transition"
        style={{ minHeight: 40 }}
      >
        {isLoading ? <LoadingDots /> : "ثبت‌نام"}
      </Button>
    </form>
  )
}
