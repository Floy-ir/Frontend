"use client"
import type { EmblaCarouselType } from "embla-carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { useCallback, useState } from "react"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import img from "../../public/dude.png"

const suggestions = [
    { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#10b98f] to-[#10b98f]" },
    { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#d9333e] to-[#d9333e]" },
    { text: "4tt4 الان رزرو کن", discount: "435 درصد تخفیف", bg: "from-[#5A28EE] to-[#764CF1]" },
    { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#10b98f] to-[#10b98f]" },
    { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#d9333e] to-[#d9333e]" },
    { text: "4tt4 الان رزرو کن", discount: "435 درصد تخفیف", bg: "from-[#5A28EE] to-[#764CF1]" },
    { text: "4tt4 الان رزرو کن", discount: "435 درصد تخفیف", bg: "from-[#5A28EE] to-[#764CF1]" },
    { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#10b98f] to-[#10b98f]" },
    { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#d9333e] to-[#d9333e]" },
  ]

function SuggestionCard({ text, discount, bg }: { text: string; discount: string; bg: string }) {
  return (
    <Card className="relative h-39 shrink-0 border-0">
      {/* Background  - Positioned Under Image */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-l ${bg}`} />

      <div className="relative flex h-full w-full flex-row items-end rounded-xl pr-6">
        {/* Image */}
        <Image
          src={img.src}
          alt="Suggestion"
          width={90}
          height={90}
          className="z-10 max-w-[40%] rounded-l-xl object-cover"
          priority
        />

        {/* Text Content */}
        <div className="z-10 flex flex-1 flex-col gap-1 pr-4 text-right text-white ">
          <div className="text-Shade-White font-['Anjoman_Max_FN'] text-base leading-relaxed font-normal">{text}</div>
          <div className="text-Shade-White font-['Anjoman_Max_FN'] text-xl leading-loose font-bold">{discount}</div>
        </div>
      </div>
    </Card>
  )
}


export default function SuggestionsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const onSelect = useCallback((embla: EmblaCarouselType | undefined) => {
    if (!embla) return
    setActiveIndex(embla.selectedScrollSnap())
  }, [])

  return (
    <Carousel
       
       opts={{ loop: true}}
      plugins={[Autoplay({ delay: 3000 })]}
      className="w-full"
      dir="ltr"
      setApi={(embla) => {
        if (!embla) return;
        embla.on("select", () => onSelect(embla));
      }}
    >
      <CarouselContent dir="ltr" className="">
        {suggestions.map((suggestion, index) => (
          <CarouselItem key={index} className="basis-[85%] lg:basis-1/3 md:basis-1/2">
            <SuggestionCard {...suggestion} />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Pagination Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {suggestions.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              activeIndex === index ? "w-2 bg-[#6d28d9]" : "bg-slate-300"
            }`}
          />
        ))}
      </div>

      {/* <CarouselPrevious />
        <CarouselNext /> */}
    </Carousel>
  )
}