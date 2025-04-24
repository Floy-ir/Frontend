"use client"

import React, { useState } from "react"
import { DualRangeSlider, MultiRangeSlider } from "./slider"

export function SliderDemo() {
  const [dualRangeValue, setDualRangeValue] = useState<[number, number]>([20, 80])
  const [multiRangeValue, setMultiRangeValue] = useState<number[]>([10, 50, 90])

  return (
    <div className="space-y-10 p-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Dual Range Slider</h2>
        <p>Current value: {dualRangeValue.join(" - ")}</p>
        <DualRangeSlider
          value={dualRangeValue}
          onValueChange={setDualRangeValue}
          min={0}
          max={100}
          step={1}
          showLabels
          className="w-full max-w-md"
          formatLabel={(value) => `$${value}`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Multi Range Slider</h2>
        <p>Current value: {multiRangeValue.join(" - ")}</p>
        <MultiRangeSlider
          value={multiRangeValue}
          onValueChange={setMultiRangeValue}
          min={0}
          max={100}
          step={5}
          showLabels
          className="w-full max-w-md"
          formatLabel={(value) => `${value}%`}
        />
      </div>
    </div>
  )
} 