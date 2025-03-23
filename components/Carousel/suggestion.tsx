"use client"
import type { EmblaCarouselType } from "embla-carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { useCallback, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import img from "../../public/dude.png"
const suggestions = [
  { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#10b98f] to-[#10b98f]" },
  { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#d9333e] to-[#d9333e]" },
  { text: "4tt4 الان رزرو کن", discount: "435 درصد تخفیف", bg: "from-[#5A28EE] to-[#764CF1]" },
  { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#10b98f] to-[#10b98f]" },
  { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#d9333e] to-[#d9333e]" },
  { text: "4tt4 الان رزرو کن", discount: "435 درصد تخفیف", bg: "from-[#5A28EE] to-[#764CF1]" },
  { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#10b98f] to-[#10b98f]" },
  { text: "همین الان رزرو کن", discount: "۵۰ درصد تخفیف", bg: "from-[#d9333e] to-[#d9333e]" },
  { text: "4tt4 الان رزرو کن", discount: "435 درصد تخفیف", bg: "from-[#5A28EE] to-[#764CF1]" },

]

function SuggestionCard({ text, discount, bg }: { text: string; discount: string; bg: string }) {
  return (
    <Card className="-p-0 h-34 shrink-0 relative">
      {/* Background Gradient - Positioned Under Image */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-l ${bg}`} />

      <div className="relative flex h-full w-full flex-row items-center rounded-xl pr-6">
        {/* Left-Side Image */}
        <Image src={img.src} alt="Suggestion" width={90} height={90} className="h-full w-auto max-w-[40%] rounded-l-xl object-cover z-10" priority />

        {/* Text Content */}
        <div className="mb-2 flex flex-col gap-1 text-right text-white flex-1 pr-4 z-10">
          <div className="text-Shade-White font-['Anjoman_Max_FN'] text-base leading-relaxed font-normal">{text}</div>
          <div className="text-Shade-White text-xl font-bold font-['Anjoman_Max_FN'] leading-loose">{discount}</div>
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
  console.log(suggestions)
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 2000 })]}
      className="w-full"
      dir="ltr"
      setApi={(embla) => embla && embla.on("select", () => onSelect(embla))}
    >
      <CarouselContent dir="ltr" className="">
        {suggestions.map((suggestion, index) => (
          <CarouselItem key={index} className="sm:basis-[85%] md:basis-1/3">
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

      {/* <CarouselPrevious />
        <CarouselNext /> */}
    </Carousel>

    // <Carousel className="w-full max-w-xs" opts={{ align: "center", loop: true }}>
    //   <CarouselContent>
    //     {Array.from({ length: 3 }).map((_, index) => (
    //       <CarouselItem key={index}>
    //         <div className="p-1">

    //             <Card className="-p-0 h-34 w-full">
    //          <div
    //            className={`flex h-full w-full flex-col justify-end rounded-xl bg-gradient-to-l pr-6 ${"from-[#10b98f] to-[#10b98f]"}`}
    //          >
    //            <div className="mb-2 flex flex-col gap-1 text-right text-white">
    //              <div className="text-base leading-relaxed font-normal">"همین الان رزرو کن"</div>
    //              <div className="text-2xl leading-loose font-bold">"۵۰ درصد تخفیف"</div>
    //              <span className="text-4xl font-semibold">{index + 1}</span>
    //            </div>
    //          </div>

    //           </Card>
    //         </div>
    //       </CarouselItem>

    //     ))}
    //   </CarouselContent>
    //   <CarouselPrevious />
    //   <CarouselNext />
    // </Carousel>
  )
}