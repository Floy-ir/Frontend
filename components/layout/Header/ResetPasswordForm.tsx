"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import PasswordInput from "./PasswordInput"
import { LoadingDots } from "./SharedInputs"

export default function ResetPasswordForm({
  onSubmit,
  emptyFields,
  formError,
  isLoading,
}: {
  onSubmit: (data: { password: string; confirm: string }) => void | Promise<void>
  emptyFields: string[]
  formError: string
  isLoading: boolean
}) {
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")

  React.useEffect(() => {
    if (!formError) {
      setPassword("")
      setConfirm("")
    }
  }, [formError])

  return (
    <form
      className="space-y-3.5 px-5"
      onSubmit={(e) => {
        e.preventDefault()
        void onSubmit({ password, confirm })
      }}
    >
      <p className="mb-2 text-sm text-gray-500">رمز عبور جدید خود را وارد کنید.</p>

      <PasswordInput
        name="password"
        label="رمز عبور جدید"
        error={emptyFields.includes("password")}
        value={password}
        onChange={(v) => setPassword(v)}
        autoComplete="new-password"
      />
      <PasswordInput
        name="confirm"
        label="تکرار رمز عبور"
        error={emptyFields.includes("confirm")}
        value={confirm}
        onChange={(v) => setConfirm(v)}
        autoComplete="new-password"
      />
      {formError && <p className="text-right text-sm text-red-600">{formError}</p>}
      <Button
        type="submit"
        className="bg-Primary-P500main hover:bg-Primary-P600 w-full rounded-lg py-2.5 text-base font-medium text-white transition"
        style={{ minHeight: 40 }}
      >
        {isLoading ? <LoadingDots /> : "تغییر رمز"}
      </Button>
    </form>
  )
}
