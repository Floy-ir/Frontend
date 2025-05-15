"use client"

import { useState } from "react"
import { FancySlider } from "@/components/ui/fancy-slider"
import { SliderDemo } from "@/components/ui/slider-demo"

export default function SliderDemoPage() {
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 80])
  const [timeRange, setTimeRange] = useState<[number, number]>([8, 18])

  return (
    <main className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Slider Components</h1>
        <p className="text-lg text-slate-600 mb-8">
          Interactive examples of dual range and multi-range sliders built with Radix UI and Shadcn UI styling.
        </p>
        
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Fancy Slider Examples</h2>
            
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-medium mb-4">Price Range</h3>
                <p className="text-slate-600 mb-4">Selected price range: ${priceRange[0]} - ${priceRange[1]}</p>
                
                <div className="max-w-md mx-auto">
                  <FancySlider 
                    value={priceRange}
                    onValueChange={setPriceRange}
                    leftLabel={`$${priceRange[0]}`}
                    rightLabel={`$${priceRange[1]}`}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-medium mb-4">Time Range</h3>
                <p className="text-slate-600 mb-4">Selected time range: {timeRange[0]}:00 - {timeRange[1]}:00</p>
                
                <div className="max-w-md mx-auto">
                  <FancySlider 
                    value={timeRange}
                    onValueChange={setTimeRange}
                    min={0}
                    max={24}
                    leftLabel={`${timeRange[0]}:00`}
                    rightLabel={`${timeRange[1]}:00`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-md">
              <h3 className="text-lg font-medium mb-2">Usage</h3>
              <pre className="text-sm overflow-auto p-4 bg-slate-100 rounded"><code>{`<FancySlider
  value={[20, 80]}
  onValueChange={(value) => console.log(value)}
  min={0}
  max={100}
  step={1}
  leftLabel="Min"
  rightLabel="Max"
  className="max-w-md"
/>`}</code></pre>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Original Sliders</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <SliderDemo />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
} 