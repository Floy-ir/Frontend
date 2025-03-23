"use client"

import * as React from "react"

import { ComboboxSelect } from "@/components/ComboboxSelect/ComboboxSelect"
import { ArrowSquareUp } from "iconsax-react"

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
      // leftIcon=<ArrowSquareUp color="var(--color-Gray-N500)" />
      dir="rtl"
    />
  )
}