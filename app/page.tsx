import Image from "next/image"
import { Metadata } from "next"

import { Header } from "@/components/Header/Header"
import { HeroSection } from "@/components/HeroSection/HeroSection"
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
      <div className="fixed -top-12 left-0 w-full h-136">
        <Image
          src="/images/hero-image.png"
          alt="Hero Image"
          fill
          className="object-cover -z-40"
          sizes="100vw"
          priority
        />
      </div>
      <main className="rtl flex min-h-screen flex-col items-center bg-transparent relative z-10 m-4 md:m-0 font-anjoman-max">
        <div className="w-full max-w-[1136px]">
          <Header menuItems={menuItems}/>
          <HeroSection />
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
      </main>
    </>
  )
}
