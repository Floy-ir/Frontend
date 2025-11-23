"use client"
import { ArrowDown2, ArrowUp2 } from "iconsax-react"
import Image from "next/image"
import type { StaticImageData } from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { isRunningInMiniApp } from "@/utils/miniapp"
import aparat from "../../../public/images/Frame 4402.svg"
import instagram from "../../../public/images/instagram.svg"
// import linkdin from "../../../public/images/linkedin-svgrepo-com 1.svg"
import telegram from "../../../public/images/send-2.svg"
// import youtube from "../../../public/images/youtube.svg"
import { Button } from "../../elements/Button/Button"

const Footer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()
  const isInMiniApp = isRunningInMiniApp()

  const desktopSocialLinks: { href: string; label: string; icon: StaticImageData }[] = [
    { href: "https://www.instagram.com/floy.io?igsh=ZzQ4YWdqc2Y4MWY0&utm_source=qr", label: "Instagram", icon: instagram },
    { href: "https://t.me/floy_ir", label: "Telegram", icon: telegram },
    // { href: "https://x.com/floy_ir", label: "X", icon: X },
    // { href: "https://www.linkedin.com", label: "LinkedIn", icon: linkdin },
  ]

  const mobileSocialLinks: { href: string; label: string; icon: StaticImageData }[] = [
    ...desktopSocialLinks,
    { href: "https://www.aparat.com", label: "Aparat", icon: aparat },
  ]

  if (pathname?.startsWith("/chat")) {
    return <></>
  }

  return (
    <div className="w-full">
      {/* tablet and desktop */}
      <footer className="hidden w-full flex-col items-center justify-center text-gray-600 md:flex">
        {/* Main footer container */}
        <div className="flex w-full flex-col justify-between bg-white">
          <div className="mx-auto w-full max-w-[1136px] px-6 xl:px-0">
            <div className="mt-10 mb-9 flex w-full flex-row justify-between">
              {/* First Grid */}
              <div className="my-2 grid grid-cols-3 gap-10 text-right">
                <div className="flex flex-col gap-6">
                  <h3 className="md:text-md font-medium text-gray-600 lg:text-lg"> فلوی </h3>
                  <div className="flex flex-col gap-4 text-sm text-gray-500">
                    <span>قوانین و مقررات</span>
                    <span>تماس با ما</span>
                    <span>درباره ما</span>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <h3 className="md:text-md font-medium text-gray-600 lg:text-lg"> خدمات مشتریان</h3>
                  <div className="flex flex-col gap-4 text-sm text-gray-500">
                    <span>سوالات متداول</span>
                    <span>پشتیبانی</span>
                    {/* <span>راهنما</span> */}
                    <span>وبلاگ</span>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <h3 className="md:text-md font-medium text-gray-600 lg:text-lg"> خدمات </h3>
                  <div className="flex flex-col gap-4 text-sm text-gray-500">
                    <span>بلیط پرواز</span>
                    <span>اقامتگاه</span>
                    <span>هتل</span>
                  </div>
                </div>
              </div>

              {/* Second Grid */}
              <div className="flex flex-col items-end justify-end gap-8.5">
                <h1 className="text-primary-500 text-5xl leading-[87px] font-semibold">فلوی</h1>
                {/* <h3 className="text-sm text-[#748297]">تلفن پشتیبانی: ۰۲۱۱۲۳۴۵۶۷۸</h3> */}
                {!isInMiniApp && (
                  <div className="flex md:gap-4 lg:gap-8">
                    {desktopSocialLinks.map(({ href, label, icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex items-center justify-center rounded-lg bg-slate-100 md:h-8 md:w-8 lg:h-10 lg:w-10"
                      >
                        <Image src={icon} alt={label} width={24} height={24} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* divider */}
            <div className="outline-Gray-N200 h-0 w-full outline-1 outline-offset-[-0.50px]" />

            {/* Third Grid */}
            <div className="flex flex-col md:my-4 lg:my-6">
              <div className="text-Gray-N600 mb-1 justify-center text-right text-lg leading-loose font-medium">
                {" "}
                فلوی{" "}
              </div>
              <p className="text-Gray-N500 flex flex-col items-start justify-start text-right text-[13px] leading-normal">
                فلوی یک پلتفرم جستجوی بلیط است که امکان مقایسه و خرید آسان بلیط هواپیما، هتل و اقامتگاه های مسافرتی را
                از میان ارائه دهندگان معتبر فراهم می‌کند. ما با جمع آوری داده‌های به‌روز و قیمت‌های متفاوت به کاربران
                کمک می‌کنیم تا بهترین انتخاب را برای سفرهای خود داشته باشند. هدف ما ساده‌سازی فرآیند جستجو و رزرو،
                صرفه‌جویی در زمان و هزینه، و ایجاد تجربه‌ای لذت‌بخش برای مسافران است.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="w-full">
          <p className="py-3 text-center text-[11px] font-normal text-gray-500">
            کلیه حقوق این سرویس (وب‌سایت و اپلیکیشن‌های موبایل) محفوظ و متعلق به شرکت فلوی می‌باشد.
          </p>
        </div>
      </footer>

      {/* mobile */}
      <footer className="flex w-full flex-col items-center justify-center text-gray-600 md:hidden">
        {/* Main footer container */}
        <div className="flex w-full flex-col justify-between bg-white">
          <div className="mx-auto w-full max-w-[1136px] px-6 xl:px-0">
            {/* Accordion instead of Grid */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="floy">
                <AccordionTrigger className="px-5 text-sm font-medium text-slate-600">فلوی</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 px-5 text-xs text-gray-500">
                  <span>قوانین و مقررات</span>
                  <span>تماس با ما</span>
                  <span>درباره ما</span>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="services">
                <AccordionTrigger className="px-5 text-sm font-medium text-slate-600">خدمات</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 px-5 text-xs text-gray-500">
                  <span>بلیط پرواز</span>
                  <span>اقامتگاه</span>
                  <span>هتل</span>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="customer-services">
                <AccordionTrigger className="px-5 text-sm font-medium text-slate-600">خدمات مشتریان</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 px-5 text-xs text-gray-500">
                  <span>سوالات متداول</span>
                  <span>پشتیبانی</span>
                  {/* <span>راهنما</span> */}
                  <span>وبلاگ</span>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* divider */}
            <div className="border-b border-slate-100 last:border-b-0" />

            {/* Second Grid */}
            <div className="mt-10 mb-9 flex w-full flex-col justify-between">
              <div className="flex flex-col items-center justify-center gap-8.5">
                <h1 className="text-5xl leading-[87px] font-semibold text-[#4641fb]">فلوی</h1>
                <h3 className="text-sm text-[#748297]">تلفن پشتیبانی: ۰۲۱۱۲۳۴۵۶۷۸</h3>
                {!isInMiniApp && (
                  <div className="flex gap-6">
                    {mobileSocialLinks.map(({ href, label, icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100"
                      >
                        <Image src={icon} alt={label} width={24} height={24} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* divider */}
            <div className="outline-Gray-N200 h-0 w-full outline-1 outline-offset-[-0.50px]" />

            {/* Third Grid */}
            <div className="my-6 flex w-full flex-col">
              <div className="text-Gray-N600 mb-1 justify-center text-right text-lg leading-loose font-medium">
                فلوی
              </div>
              <p className="text-Gray-N500 flex flex-col items-start justify-start text-right text-[13px] leading-normal">
                {isExpanded
                  ? `فلوی یک پلتفرم جستجوی بلیط است که امکان مقایسه و رزرو آسان بلیط پرواز، هتل، قطار و دیگر خدمات سفر را از
                  میان صدها منبع معتبر فراهم می‌کند. ما با ارائه داده‌های به‌روز و قیمت‌های رقابتی، به کاربران کمک می‌کنیم
                  تا بهترین انتخاب را برای سفرهای خود داشته باشند. هدف ما ساده‌سازی فرآیند جستجو و رزرو، صرفه‌جویی در زمان و
                  هزینه، و ایجاد تجربه‌ای لذت‌بخش برای مسافران است.`
                  : `فلوی یک پلتفرم جستجوی بلیط است که امکان مقایسه و رزرو آسان بلیط پرواز، هتل، قطار و دیگر خدمات سفر را از
                  میان صدها منبع معتبر فراهم می‌کند. ما ...
                   `}
                <Button
                  intent="text"
                  size="small"
                  className="-mx-5"
                  rightIcon={
                    isExpanded ? <ArrowUp2 color="#4641FB" size="20" /> : <ArrowDown2 color="#4641FB" size="20" />
                  }
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "کمتر " : "بیشتر"}
                </Button>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="w-full px-4">
          <p className="py-3 text-center text-[11px] font-normal text-gray-500">
            کلیه حقوق این سرویس (وب‌سایت و اپلیکیشن‌های موبایل) محفوظ و متعلق به شرکت فلوی می‌باشد.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Footer
