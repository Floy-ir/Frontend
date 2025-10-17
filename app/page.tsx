             import { Metadata } from "next"
import Image from "next/image"

import Benefits from "@/components/LandingPage/Benefits"
import Companies from "@/components/LandingPage/Companies"
import { HeroSection } from "@/components/LandingPage/HeroSection/HeroSection"

import PopularCities from "@/components/LandingPage/PopularCities"
// import Suggestions from "@/components/LandingPage/suggestions"
import Questions from "@/components/LandingPage/Questions"
import img from "../public/images/Underline_06.svg"

export const metadata: Metadata = {
  title: "فلوی | مقایسه بلیط هواپیما",
  twitter: {
    card: "summary_large_image",
  },

  openGraph: {
    url: "https://flow.ir/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://flow.ir/images/landing2.webp",
      },
    ],
  },
}

export default function Web() {
  return (
    <>
      {/* Background Image with Oval Bottom */}
      <div className="rounded-oval-mobile absolute inset-0 -z-10 h-[720px] max-h-[775px] w-full overflow-hidden sm:h-[720px] md:h-[760px] lg:h-[478px]">
        {/* Main image container */}
        <Image
          src="/images/landing2.webp"
          alt="Hero Background"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/40" />
      </div>

      {/* Remove extra container divs - let the header handle its own width */}
      {/* <div className="rtl">
        <Header menuItems={menuItems} />
      </div> */}

      <main className="rtl relative z-10 flex min-h-screen flex-col items-center bg-transparent">
        <div className="w-full">
          <HeroSection />
        </div>

        <Companies />

        <div className="w-full pt-8 pb-12 lg:py-16">
          <Benefits />
        </div>

        {/* Cities */}
        <div
          data-name="Container-for-cities"
          className="flex w-full shrink-0 flex-col items-center justify-between bg-white py-8 lg:pt-12 lg:pb-4"
          id="cheapest-week"
        >
          <div className="mx-auto w-full max-w-[1136px] px-6 xl:px-0">
            {/* Title */}
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col justify-start">
                <h2 className="mb-1 text-xl font-semibold text-[#334155] md:text-2xl">
                  ارزان ترین پرواز های هفته آينده
                </h2>
                <Image alt="" src={img} width={100} height={100} />
              </div>

              {/*Buttons */}
              {/* <div className="flex flex-row items-center">
              <Button intent="text" size="medium" className="mr-6">
                مشاهده همه
              </Button>
              <div className="hidden flex-row items-center sm:flex">
                <Button
                  size="medium"
                  intent="secondary"
                  rightIcon={<ArrowRight2 size="20" color="#4641FB" />}
                  className="ml-4.5"
                />
                <Button size="medium" intent="secondary" rightIcon={<ArrowLeft2 size="20" color="#4641FB" />} />
              </div>
            </div> */}
            </div>
            <PopularCities />
          </div>
        </div>

        {/* suggestions */}
        {/* <div className="mt-12 flex w-full max-w-[1500px] shrink-0 flex-col items-center justify-center px-4 py-8 lg:px-38 lg:py-12">
          <Suggestions />
        </div> */}
        <div data-name="Container-for-questions" className="mb-13 w-full" id="faq">
          <div className="mx-auto w-full max-w-[1136px] px-6 xl:px-0">
            <Questions />
          </div>
        </div>
      </main>
    </>
  )
}
