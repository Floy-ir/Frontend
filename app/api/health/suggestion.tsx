"use client"
import type { EmblaCarouselType } from "embla-carousel"
import Autoplay from "embla-carousel-autoplay"
import { useCallback, useState } from "react"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
const suggestions = [
  { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#5A28EE] to-[#764CF1]" },
  { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#d9333e] to-[#d9333e]" },
  { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#10b98f] to-[#10b98f]" },
]

// 🎯 **Reusable Suggestion Card Component**
function SuggestionCard({ text, discount, bg }: { text: string; discount: string; bg: string }) {
  return (
    <Card className="-p-0 h-34 sm:w-72 md:w-100">
      <div className={`flex h-full w-full flex-col justify-end rounded-xl bg-gradient-to-l pr-6 ${bg}`}>
        <SuggestionInfo text={text} discount={discount} />
      </div>
    </Card>
  )
}

// 🎯 **Reusable Suggestion Info**
function SuggestionInfo({ text, discount }: { text: string; discount: string }) {
  return (
    <div className="mb-2 flex flex-col gap-1 text-right text-white">
      <div className="text-base leading-relaxed font-normal">{text}</div>
      <div className="text-2xl leading-loose font-bold">{discount}</div>
    </div>
  )
}

// 🎯 **Main Carousel Component**
export default function SuggestionsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const onSelect = useCallback((embla: EmblaCarouselType | undefined) => {
    if (!embla) return
    setActiveIndex(embla.selectedScrollSnap())
  }, [])

  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      plugins={[Autoplay({ delay: 2000 })]}
      className="w-full"
      setApi={(embla) => embla && embla.on("select", () => onSelect(embla))}
    >
      <CarouselContent className="flex flex-row items-center justify-center">
        {suggestions.map((suggestion, index) => (
          <CarouselItem key={index} className="flex flex-col justify-center sm:basis-[90%] md:basis-1/3 gap-6">
            <SuggestionCard {...suggestion} />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Pagination Dots */}
      <div className="mt-4 flex justify-center gap-2">
        {suggestions.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              activeIndex === index ? "w-2 bg-[#6d28d9]" : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </Carousel>
  )
}
