import { Metadata } from "next"
import Image from "next/image"

import { Header } from "@/components/Header/Header"
import { HeroSection } from "@/components/HeroSection/HeroSection"
import Benefits from "@/components/LandingPage/Benefits"
import Companies from "@/components/LandingPage/Companies"

import PopularCities from "@/components/LandingPage/PopularCities"
import Suggestions from "@/components/LandingPage/suggestions"
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
  const menuItems = [
    { label: "صفحه اصلی", href: "/", isActive: true },
    { label: "پشتیبانی", href: "/support" },
    { label: "بلاگ", href: "/blog" },
    { label: "درباره ما", href: "/about" },
  ]

  return (
    <>
      {/* Hero image section */}
      <div className="fixed -top-12 left-0 h-136 w-full">
        <Image
          src="/images/hero-image.png"
          alt="Hero Image"
          fill
          className="-z-40 object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <main className="rtl font-anjoman-max relative z-10 flex min-h-screen flex-col items-center bg-transparent">
        <div className="m-4 md:m-0">
          <div className="w-full max-w-[1136px]">
            <Header menuItems={menuItems} />
            <HeroSection />
          </div>
        </div>

        {/* <div className="container mx-auto mt-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">فلوی، پرواز تا بی نهایت</h2>
          <p className="mt-4 text-slate-600">این یک متن چرت و پرت است که توسط یک نفر نوشته شده است.</p>
        </div>
        
        <div className="p-8">
          <TextField
            label="عنوان"
            placeholder="متن ورودی"
            helperText="متن راهنما"
            maxLength={20}
            showCharCount
            leftIcon={<Eye color="var(--color-Gray-N500)" />}
            rightIcon={<User color="var(--color-Gray-N500)" />}
            dir="rtl"
            width="md"
          />
        </div>
        <FormExample /> */}

        <Companies />
        <Benefits />
        {/* Cities */}
        <div className="flex w-full max-w-[1600px] shrink-0 flex-col items-center justify-between bg-white px-4 py-8 lg:px-38 lg:py-12">
          {/* Title */}
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col justify-start">
              <h2 className="mb-1 text-2xl font-bold text-[#334155]">شهر‌های پرطرفدار</h2>
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

        {/* suggestions */}
        <div className="mt-12 flex w-full max-w-[1500px] shrink-0 flex-col items-center justify-center px-4 py-8 lg:px-38 lg:py-12">
          <Suggestions />
        </div>
      </main>
    </>
  )
}
