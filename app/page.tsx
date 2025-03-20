import { ArrowLeft2, ArrowRight2, Eye, User } from "iconsax-react"
import { Metadata } from "next"
import Image from "next/image"
import { Button } from "components/Button/Button"
// import { CustomCarousel } from "components/Carousel/Carousel"
import { Header } from "components/Header/Header"
import { TextField } from "components/TextField/TextField"
// import { Carousel, CarouselContent, CarouselItem } from "src/components/ui/carousel"
import img from "../public/Underline_06.svg"
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
      <main className="rtl flex min-h-screen flex-col items-center bg-[#f4f6f9] py-6">
        <Header menuItems={menuItems} className="mb-8 bg-white" />

        <div className="container mx-auto mt-12 text-center">
          <h1 className="text-3xl font-bold text-slate-900"> فلوی، پرواز تا بی نهایت</h1>
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
        {/* ---------------------------------------------------------------------------------------------------- */}
        <div className="flex w-full flex-col items-center justify-between bg-white p-6 px-38">
          {/* Title, Buttons, and View All */}
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col justify-start">
              <h2 className="mb-1 text-2xl font-bold text-[#334155]">شهر‌های پرطرفدار</h2>
              <Image alt="kjh" src={img} width={100} height={100} />
            </div>

            <div className="flex flex-row items-center">
              <Button intent="text" size="medium" className="mr-6">
                مشاهده همه
              </Button>
              <Button
                size="medium"
                intent="secondary"
                rightIcon={<ArrowRight2 size="20" color="#4641FB" />}
                className="ml-4.5"
              />
              <Button size="medium" intent="secondary" rightIcon={<ArrowLeft2 size="20" color="#4641FB" />} />
            </div>
          </div>
          {/* Carousel */}
          {/* <CustomCarousel
            loop
            items={[
              <div className="rounded-lg bg-blue-500 p-10 text-white">تهران</div>,
              <div className="rounded-lg bg-red-500 p-10 text-white">مشهد</div>,
              <div className="rounded-lg bg-green-500 p-10 text-white">اصفهان</div>,
            ]}
          /> */}
        </div>
      </main>
    </>
  )
}
