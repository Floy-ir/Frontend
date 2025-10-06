"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { FloatingInput, LoadingDots } from "./SharedInputs"

export default function LoginForm({ handleLoginSubmit, emptyFields, formError, isLoading }: {
  handleLoginSubmit: (data: { phone: string; password: string }) => void | Promise<void>
  emptyFields: string[]
  formError: string
  isLoading: boolean
}) {
  const [phone, setPhone] = React.useState("")
  const [password, setPassword] = React.useState("")
  React.useEffect(() => {
    if (!formError) {
      setPhone("")
      setPassword("")
    }
  }, [formError])
  return (
    <form
      className="space-y-3.5 w-[85%]"
      onSubmit={e => {
        e.preventDefault()
        void handleLoginSubmit({ phone, password })
      }}
    >
      <FloatingInput
        name="phone"
        type="tel"
        label="شماره تلفن"
        error={emptyFields.includes("phone")}
        value={phone}
        onChange={e => setPhone(e.target.value)}
        autoComplete="tel"
      />
      <FloatingInput
        name="password"
        type="password"
        label="رمز عبور"
        error={emptyFields.includes("password")}
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      {formError && <p className="text-red-600 text-sm text-right">{formError}</p>}
      <Button
        type="submit"
        className="w-full bg-Primary-P500main text-white rounded-lg py-2.5 text-base font-medium hover:bg-Primary-P600 transition"
        style={{ minHeight: 40 }}
      >
        {isLoading ? <LoadingDots /> : "ورود"}
      </Button>
      <div className="text-center">
        // todo: o=implement forgot password
        <button type="button" className="text-Primary-P500main hover:underline text-sm">
          فراموشی رمز عبور
        </button>
      </div>
    </form>
  )
}
