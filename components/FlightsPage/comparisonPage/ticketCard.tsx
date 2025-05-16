"use client"

import { ArrowDown2, ArrowLeft2, InfoCircle } from "iconsax-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/Button/Button"
import dude from "@/public/images/flash-circle-outline.svg"
import { englishToFarsiNumber } from "@/utils/numbers"

type dude = {
  adult_price: number
  base_redirect_url: string
  child_price: number | null
  detail: {
    uid: string
    name: string
    name_fa: string
    image: string | null
  }
  infant_price: number | null
  one_adult_redirect_url: string
  remaining_seat: number
  two_adult_redirect_url: string
}

export default function TicketCard({ websites }: { websites: dude[] }) {
  const [openPriceDetails, setOpenPriceDetails] = useState<boolean[]>(new Array(websites.length).fill(false)) // for each card's price details
  const [openRefundRules, setOpenRefundRules] = useState<boolean[]>(new Array(websites.length).fill(false)) // for each card's refund rules
  const refundRefs = useRef<(HTMLDivElement | null)[]>([])
  const [refundHeights, setRefundHeights] = useState<string[]>(new Array(websites.length).fill("0px"))
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const adultCount = searchParams.get("adult") ?? "0"
  const childCount = searchParams.get("child") ?? "0"
  const infantCount = searchParams.get("infant") ?? "0"

  const router = useRouter()

  // Calculate total price for a website
  const getTotalPrice = (website: dude) =>
    website.adult_price * Number(adultCount) +
    (website.child_price ?? 0) * Number(childCount) +
    (website.infant_price ?? 0) * Number(infantCount)
  // Find the minimum price among all websites
  const minPrice = Math.min(...websites.map(getTotalPrice))
  const sortedWebsites = [...websites].sort((a, b) => getTotalPrice(a) - getTotalPrice(b))

  useEffect(() => {
    const newRefundHeights = openRefundRules.map((isOpen, i) =>
      isOpen && refundRefs.current[i] ? `${refundRefs.current[i]!.scrollHeight}px` : "0px"
    )
    setRefundHeights(newRefundHeights)
  }, [openRefundRules])

  const handleBuy = (website: dude) => {
    let redirectUrl = ""

    if (adultCount === "1" && childCount === "0" && infantCount === "0") {
      redirectUrl = website.one_adult_redirect_url ?? ""
    } else if (adultCount === "2" && childCount === "0" && infantCount === "0") {
      redirectUrl = website.two_adult_redirect_url ?? ""
    } else {
      redirectUrl = website.base_redirect_url
        .replace("{adult_count}", adultCount)
        .replace("{child_count}", childCount)
        .replace("{infant_count}", infantCount)
    }

    const encodedRedirectUrl = redirectUrl
    const encodedAgency = website.detail.name_fa

    router.push(`/redirect?redirect_url=${encodedRedirectUrl}&agency=${encodedAgency}`)
  }
  return (
    <div className="flex w-full flex-col items-start gap-5 lg:w-3/5">
      <div className="cards-container h-[550px] w-full snap-y snap-mandatory overflow-y-auto px-3 md:px-0">
        <div className="text-Gray-N600 mt-5 mb-5 h-6 self-stretch text-right text-sm leading-normal font-semibold md:mt-0">
          {englishToFarsiNumber(websites.length)} فروشنده
        </div>
        {sortedWebsites.map((website, index) => {
          const contentRef = useRef<HTMLDivElement>(null)
          const [height, setHeight] = useState("0px")
          useEffect(() => {
            if (openPriceDetails[index] && contentRef.current) {
              setHeight(`${contentRef.current.scrollHeight}px`)
            } else {
              setHeight("0px")
            }
          }, [openPriceDetails[index]])

          // Removed local refundRef and refundHeight in favor of global refundRefs and refundHeights
          return (
            <div key={index} className="flex w-full flex-col items-start">
              <div className="bg-Shade-White outline-Gray-N200 relative mb-3 inline-flex w-full flex-col items-center justify-center gap-3 self-stretch rounded-xl px-4 py-3 outline-1 outline-offset-[-1px]">
                {/* badge */}
                {getTotalPrice(website) === minPrice && (
                  <div className="bg-Success-s50 absolute top-0 left-0 inline-flex items-center justify-center gap-1 rounded-tl-sm rounded-br-sm px-2.5 py-1">
                    <div className="text-Success-s700 justify-center text-right text-[8px] font-semibold">
                      ارزان‌ترین
                    </div>
                  </div>
                )}

                {/* name, icon and price */}
                <div className="bg-Gray-N50 outline-Gray-N100 flex flex-col items-end justify-center gap-1 self-stretch rounded-lg px-3 py-2 outline-1 outline-offset-[-1px]">
                  <div className="inline-flex items-center justify-between self-stretch">
                    {/* name and icon */}
                    <div className="flex items-center justify-end gap-2">
                      <div className="outline-Gray-N200 flex h-6 w-6 items-center justify-center rounded-[57.60px] bg-white outline-[1.20px] outline-offset-[-1.20px]">
                        <Image
                          alt={website.detail.name_fa}
                          width={20}
                          height={20}
                          className="h-[15.60px] w-[12.48px]"
                          src={website.detail.image ?? dude.src}
                        />
                      </div>

                      <div className="flex flex-col items-start justify-center gap-1">
                        <div className="text-Gray-N600 justify-start text-right text-xs font-semibold">
                          {website.detail.name_fa}
                        </div>
                      </div>
                    </div>

                    {/* price */}
                    <div className="flex items-center justify-end gap-1">
                      <div
                        onClick={() => {
                          const newPriceDetails = [...openPriceDetails]
                          newPriceDetails[index] = !newPriceDetails[index]
                          setOpenPriceDetails(newPriceDetails)
                        }}
                        className="text-Gray-N500 mx-2 flex w-full flex-row items-center justify-start gap-1 text-right text-[11px] font-normal md:mx-4"
                      >
                        جزئیات قیمت
                        <ArrowDown2 size="14" color="#748297" />
                      </div>
                      <div className="text-Gray-N700 justify-start text-right text-sm font-bold md:text-base">
                        {englishToFarsiNumber(
                          (
                            website.adult_price * Number(adultCount) +
                            (website.child_price ?? 0) * Number(childCount) +
                            (website.infant_price ?? 0) * Number(infantCount)
                          ).toLocaleString("fa-IR")
                        )}
                      </div>

                      <div className="text-Gray-N500 justify-start text-right text-[11px] font-semibold">تومان</div>
                    </div>
                  </div>
                  <div
                    style={{ maxHeight: height }}
                    className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
                      openPriceDetails[index] ? "mt-2" : "mt-0"
                    }`}
                  >
                    <div className="w-full" ref={contentRef}>
                      {/* divider */}
                      <div className="bg-Gray-N200 mb-4 h-px w-full self-stretch" />

                      {/* prices */}
                      <div className="flex flex-col items-end gap-2">
                        {Number(adultCount) > 0 && (
                          <div className="flex w-full items-center justify-end gap-3">
                            <div className="text-Gray-N700 text-[11px] leading-none font-normal">
                              بزرگسال ({englishToFarsiNumber(adultCount)})
                            </div>
                            <div className="text-Gray-N700 text-left text-sm leading-normal font-normal">
                              {englishToFarsiNumber(website.adult_price)}
                            </div>
                            <div className="text-Gray-N500 justify-start text-right text-[11px] font-semibold">
                              تومان
                            </div>
                          </div>
                        )}
                        {Number(childCount) > 0 && (
                          <div className="flex w-full items-center justify-end gap-3">
                            <div className="text-Gray-N700 text-[11px] leading-none font-normal">
                              کودک ({englishToFarsiNumber(childCount)})
                            </div>
                            <div className="text-Gray-N700 text-left text-sm leading-normal font-normal">
                              {englishToFarsiNumber(website.child_price ?? "نامشخص")}
                            </div>
                            <div className="text-Gray-N500 justify-start text-right text-[11px] font-semibold">
                              تومان
                            </div>
                          </div>
                        )}
                        {Number(infantCount) > 0 && (
                          <div className="flex w-full items-center justify-end gap-3">
                            <div className="text-Gray-N700 text-[11px] leading-none font-normal">
                              نوزاد ({englishToFarsiNumber(infantCount)})
                            </div>
                            <div className="text-Gray-N700 text-left text-sm leading-normal font-normal">
                              {englishToFarsiNumber(website.infant_price ?? "نامشخص")}
                            </div>
                            <div className="text-Gray-N500 justify-start text-right text-[11px] font-semibold">
                              تومان
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* divider */}
                <div className="bg-Gray-N100 h-px self-stretch" />

                {/* button and seats */}
                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="inline-flex items-center justify-between self-stretch">
                    {/* refund */}
                    <div
                      className={`${
                        website.remaining_seat < 6 ? "text-Error-E500main" : "text-Gray-N600"
                      } mr-3 hidden justify-end text-center text-[10px] font-semibold md:block md:text-[12px]`}
                    >
                      {englishToFarsiNumber(website.remaining_seat)} صندلی باقی مانده
                    </div>
                    <div className="flex flex-col items-center justify-between gap-3">
                      {/* sm: seats */}
                      <div
                        className={`${
                          website.remaining_seat < 6 ? "text-Error-E500main" : "text-Gray-N600"
                        } block justify-center text-center text-[10px] font-semibold md:hidden md:text-[12px]`}
                      >
                        {englishToFarsiNumber(website.remaining_seat)} صندلی باقی مانده
                      </div>

                      {/* <div
                        className="flex cursor-pointer items-center justify-center gap-1 rounded-xl md:px-5 md:py-3.5"
                        onClick={() => {
                          const newRefundRules = [...openRefundRules]
                          newRefundRules[index] = !newRefundRules[index]
                          setOpenRefundRules(newRefundRules)
                        }}
                      >
                        <InfoCircle size="15" color={`${openRefundRules[index] ? "#5A28EE" : "#748297"}`} />
                        <div
                          className={`${
                            openRefundRules[index] ? "text-Primary-P500main" : "text-Gray-N600"
                          } justify-center text-right text-[12px] font-normal`}
                        >
                          قوانین استرداد
                        </div>
                      </div> */}
                    </div>
                    {/* button and seats */}
                    {/* md: seats */}

                    <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                      {/* button */}
                      <Button intent="primary" size="small" onClick={() => handleBuy(website)}>
                        مشاهده و خرید
                        <ArrowLeft2 color="#FFFFFF" size="16" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* refund */}
                {/* <div style={{ maxHeight: refundHeights[index] }} className={`flex w-full flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                    openRefundRules[index] ? "my-3" : "my-0" } `} >
                  <div
                    ref={(el) => {
                      refundRefs.current[index] = el
                    }}
                  >
                    <div
                      className={`${
                        openRefundRules[index] ? "opacity-100" : "opacity-0"
                      } transition-opacity duration-400`}
                    >
                      <div className="bg-Gray-N50 outline-Gray-N100 inline-flex w-full flex-col items-start justify-start self-stretch rounded-lg px-4 py-3 outline-1 outline-offset-[-1px]">
                        <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                          <div className="inline-flex items-center justify-center self-stretch rounded-xl p-2">
                            <div className="text-Gray-N700 flex-1 justify-center text-right text-[13px] leading-none font-normal">
                              از زمان صدور بلیط تا ۱۲:۰۰ ظهر ۳ روز قبل از پرواز
                            </div>
                            <div className="text-Error-E500main justify-center text-center text-[13px] leading-normal font-medium">
                              ۲۰٪
                            </div>
                          </div>
                          <div className="bg-Gray-N100 h-px self-stretch" />
                          <div className="inline-flex items-center justify-center self-stretch rounded-xl p-2">
                            <div className="text-Gray-N700 flex-1 justify-center text-right text-[13px] leading-none font-normal">
                              از ۱۲:۰۰ ظهر ۳ روز قبل از پرواز تا ۱۲:۰۰ ظهر ۱ روز قبل از پرواز
                            </div>
                            <div className="text-Error-E500main justify-center text-center text-[13px] leading-normal font-medium">
                              ۳۰٪
                            </div>
                          </div>
                          <div className="bg-Gray-N100 h-px self-stretch" />
                          <div className="inline-flex items-center justify-center self-stretch rounded-xl p-2">
                            <div className="text-Gray-N700 flex-1 justify-center text-right text-[13px] leading-none font-normal">
                              از ۱۲:۰۰ ظهر ۱ روز قبل از پرواز تا ۳ ساعت قبل از پرواز
                            </div>
                            <div className="text-Error-E500main justify-center text-center text-[13px] leading-normal font-medium">
                              ۳۰%
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 mb-1 inline-flex items-center justify-center gap-2 self-stretch rounded-xl">
                          <InfoCircle size="14" color="#748297" />

                          <div className="text-Gray-N600 flex-1 justify-center text-right text-[11px] leading-3 font-normal">
                            جریمه استرداد، طبق قوانین ایرلاین انجام میشود. فلوی هیچ گونه دخالتی در تعیین مقدار جریمه
                            ندارد.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
