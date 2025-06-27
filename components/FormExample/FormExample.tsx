"use client"

import * as React from "react"

import { ComboboxSelect } from "@/components/elements/ComboboxSelect/ComboboxSelect"

export default function FormExample() {
  const [status, setStatus] = React.useState("")

  const options = [
    { value: "تهران", label: "تهران" },
    { value: "مشهد", label: "مشهد" },
    { value: "کیش", label: "کیش" },
    { value: "تبریز", label: "تبریز" },
  ]

  return (
    <ComboboxSelect
      label="مبدا"
      options={options}
      value={status}
      onChange={setStatus}
      // helperText="Select the current status"
      placeholder="انتخاب شهر"
      searchPlaceholder="جستجوی شهر مبدا"
      dir="rtl"
    />
  )
}
