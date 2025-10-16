"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import PasswordInput from "./PasswordInput"
import { FloatingInput, LoadingDots } from "./SharedInputs"

export default function SignupDetailsForm({
  onSubmit,
  emptyFields,
  formError,
  isLoading,
}: {
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
      className="mb-5 space-y-3 px-4"
      onSubmit={(e) => {
        e.preventDefault()
        void onSubmit({ name, password, confirm })
      }}
    >
      <p className="text-sm text-gray-500"> اطلاعات خود را وارد کنید. </p>

      <FloatingInput
        name="name"
        type="text"
        label="نام"
        error={emptyFields.includes("name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        className="outline-none"
      />
      <PasswordInput
        name="password"
        label="رمز عبور"
        error={emptyFields.includes("password")}
        value={password}
        onChange={(v) => setPassword(v)}
        autoComplete="new-password"
        className="outline-none"
      />
      <PasswordInput
        name="confirm"
        label="تکرار رمز عبور"
        error={emptyFields.includes("confirm")}
        value={confirm}
        onChange={(v) => setConfirm(v)}
        autoComplete="new-password"
        className="outline-none"
      />
      {formError && <p className="text-right text-sm text-red-600">{formError}</p>}
      <Button
        type="submit"
        className="bg-Primary-P500main hover:bg-Primary-P600 w-full rounded-lg text-base font-medium text-white transition"
        style={{ minHeight: 40 }}
      >
        {isLoading ? <LoadingDots /> : "ثبت‌نام"}
      </Button>
    </form>
  )
}
