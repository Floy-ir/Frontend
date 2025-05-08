import { Metadata } from "next"
import Image from "next/image"


import { HeroSection } from "@/components/HeroSection/HeroSection"
import Benefits from "@/components/LandingPage/Benefits"
import Companies from "@/components/LandingPage/Companies"

import PopularCities from "@/components/LandingPage/PopularCities"
// import Suggestions from "@/components/LandingPage/suggestions"
import Questions from "@/components/LandingPage/Questions"
import img from "../public/images/Underline_06.svg"

export const metadata: Metadata = {
  title: "Next.js Enterprise Boilerplate",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://next-enterprise.vercel.app/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://raw.githubusercontent.com/Blazity/next-enterprise/main/.github/assets/project-logo.png",
      },
    ],
  },
}

export default function Web() {
  return (
    <>
      {/* Background Image with Oval Bottom */}
      <div className="absolute inset-0 w-full h-[775px] max-h-[775px] md:h-[775px] xl:h-[478px] -z-10 overflow-hidden rounded-oval-mobile md:rounded-oval">
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
      
      <main className="rtl relative z-10 flex min-h-screen flex-col items-center bg-transparent w-full">
        <div className="w-full max-w-[1136px] mx-auto px-4 md:px-0">
          <HeroSection />
        </div>

        <Companies />
        <Benefits />
        {/* Cities */}
        <div className="flex w-full shrink-0 flex-col items-center justify-between bg-white px-4 py-8 lg:px-38 lg:py-12">
          <div className="max-w-11/12">
          {/* Title */}
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col justify-start">
              <h2 className="mb-1 text-2xl font-semibold text-[#334155]">شهر‌های پرطرفدار</h2>
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
        <div className="mt-12 flex w-full max-w-[1500px] shrink-0 flex-col items-center justify-center px-4 py-8 lg:px-38 lg:py-12">
          {/* <Suggestions /> */}
        </div>
        <div className="mb-13 w-full">
          <Questions />
        </div>
      </main>
    </>
  )
}
