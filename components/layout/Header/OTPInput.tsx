"use client"

import React from "react"

export default function OTPInput({ length, value, onChange, onComplete, disabled }: {
  length: number
  value: string
  onChange: (v: string) => void
  onComplete?: (v: string) => void
  disabled?: boolean
}) {
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([])

  React.useEffect(() => {
    if (value && value.length === length && onComplete) onComplete(value)
  }, [value, length, onComplete])

  const handleInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "")
    if (!raw) {
      const chars = Array.from({ length }, (_, idx) => value[idx] ?? "")
      chars[index] = ""
      onChange(chars.join(""))
      return
    }
    const newChars = Array.from({ length }, (_, idx) => value[idx] ?? "")
    for (let i = 0; i < raw.length && index + i < length; i++) {
      newChars[index + i] = raw.charAt(i)
    }
    onChange(newChars.join(""))
    let nextIndex = index + raw.length
    if (nextIndex >= length) nextIndex = length - 1
    const nextInput = inputsRef.current[nextIndex]
    if (nextInput) nextInput.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if ((value[index] ?? "") === "") {
        const prev = Math.max(0, index - 1)
        const prevInput = inputsRef.current[prev]
        if (prevInput) prevInput.focus()
        const chars = Array.from({ length }, (_, idx) => value[idx] ?? "")
        chars[prev] = ""
        onChange(chars.join(""))
      } else {
        const chars = Array.from({ length }, (_, idx) => value[idx] ?? "")
        chars[index] = ""
        onChange(chars.join(""))
      }
    }
  }

  return (
    <div className="flex gap-2" dir="ltr">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => { inputsRef.current[i] = el }}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={e => handleInput(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          disabled={disabled}
          className="w-10.5 h-10.5 text-center rounded-md border border-gray-300 focus:border-Primary-P500main focus:ring-0"
        />
      ))}
    </div>
  )
}
