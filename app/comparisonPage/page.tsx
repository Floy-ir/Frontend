"use client"
import { DialogClose } from "@radix-ui/react-dialog"
import { ArrowDown2, ArrowLeft2, CloseCircle, InfoCircle } from "iconsax-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/Button/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { englishToFarsiNumber } from "@/utils/numbers"
export default function ComparisonDialog() {
  const [open, setOpen] = useState(true)

  // Sample flight data
  const flightData = [
    {
      name: "علی بابا",
      iconPath: "/images/alibaba-icon.png",
      price: "۳،۵۳۴،۶۷۸",
      remainingSeats: 1,
      redirectUrl: "https://www.alibaba.ir",
      child: { number: 1, price: "۱،۰۰۰،۰۰۰" },
      infant: { number: 1, price: "۵۰۰،۰۰۰" },
      adult: { number: 1, price: "۳،۰۰،۰۰۰" },
    },
    {
      name: "اسمان",
      iconPath: "/images/alibaba-icon.png",
      price: "۲،۵۰۰،۰۰۰",
      remainingSeats: 3,
      redirectUrl: "https://www.alibaba.ir",
      child: { number: 1, price: "۸۰۰،۰۰۰" },
      infant: { number: 1, price: "۴۰۰،۰۰۰" },
      adult: { number: 1, price: "۲،۱۰۰،۰۰۰" },
    },
    {
      name: "ماهان",
      iconPath: "/images/alibaba-icon.png",
      price: "۴،۰۰۰،۰۰۰",
      remainingSeats: 2,
      redirectUrl: "https://www.alibaba.ir",
      child: { number: 1, price: "۹۰۰،۰۰۰" },
      infant: { number: 1, price: "۴۵۰،۰۰۰" },
      adult: { number: 1, price: "۳،۵۰۰،۰۰۰" },
    },
    {
      name: "Kish Air",
      iconPath: "/images/alibaba-icon.png",
      price: "۱،۷۰۰،۰۰۰",
      remainingSeats: 5,
      redirectUrl: "https://www.alibaba.ir",
      child: { number: 1, price: "۷۰۰،۰۰۰" },
      infant: { number: 1, price: "۳۵۰،۰۰۰" },
      adult: { number: 1, price: "۱،۰۰۰،۰۰۰" },
    },
    {
      name: "Iran Air",
      iconPath: "/images/alibaba-icon.png",
      price: "۲،۸۰۰،۰۰۰",
      remainingSeats: 4,
      redirectUrl: "https://www.alibaba.ir",
      child: { number: 1, price: "۸۵۰،۰۰۰" },
      infant: { number: 1, price: "۴۲۰،۰۰۰" },
      adult: { number: 1, price: "۲،۵۰۰،۰۰۰" },
    },
  ]
  const [openPriceDetails, setOpenPriceDetails] = useState<boolean[]>(new Array(flightData.length).fill(false)) // for each card's price details
  const [openRefundRules, setOpenRefundRules] = useState<boolean[]>(new Array(flightData.length).fill(false)) // for each card's refund rules

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-Gray-N100 gap-0 border-none p-0 shadow-none md:max-w-[968px] ">
        <DialogHeader className="bg-Shade-White rounded-t-2xl">
          <div className="flex flex-row items-center justify-between px-6 py-4">
            <DialogTitle className="text-Gray-N600 text-sm leading-normal font-semibold">جزییات پرواز</DialogTitle>
            <DialogClose>
              <CloseCircle size="24" color="#334155" />
            </DialogClose>
          </div>

          {/* divider */}
          <div className="bg-Gray-N200 relative h-px self-stretch" />
        </DialogHeader>

        <div className="mb-7 flex flex-row items-center gap-4 px-6.5 pt-6.5">
          {/* flight info */}
          <div className="flex w-2/5 flex-col items-end">v</div>

          {/* ticket cards */}
          <div className="flex w-3/5 flex-col items-start gap-5">
            <div className="cards-container h-[550px] w-full snap-y snap-mandatory overflow-y-auto">
              <div className="text-Gray-N600 mb-5 h-6 self-stretch text-right text-sm leading-normal font-semibold">
                {englishToFarsiNumber(flightData.length)} فروشنده
              </div>
              {flightData.map((flight, index) => (
                <div key={index} className="flex w-full flex-col items-start">
                  <div className="bg-Shade-White outline-Gray-N200 relative mb-3 inline-flex w-full flex-col items-center justify-center gap-3 self-stretch rounded-xl px-4 py-3 outline-1 outline-offset-[-1px]">
                    {/* badge */}
                    <div className="bg-Success-s50 absolute top-0 left-0 inline-flex items-center justify-center gap-1 rounded-tl-sm rounded-br-sm px-2.5 py-1">
                      <div className="text-Success-s700 justify-center text-right text-[8px] font-semibold">
                        ارزان‌ترین
                      </div>
                    </div>

                    {/* name, icon and price */}
                    <div className="bg-Gray-N50 outline-Gray-N100 flex flex-col items-end justify-center gap-1 self-stretch rounded-lg px-3 py-2 outline-1 outline-offset-[-1px]">
                      <div className="inline-flex items-center justify-between self-stretch">
                        {/* name and icon */}
                        <div className="flex items-center justify-end gap-1">
                          <div className="outline-Gray-N200 flex h-6 w-6 items-center justify-center rounded-[57.60px] bg-white outline-[1.20px] outline-offset-[-1.20px]">
                            <Image
                              alt={flight.name}
                              width={20}
                              height={20}
                              className="h-[15.60px] w-[12.48px]"
                              src={flight.iconPath}
                            />
                          </div>

                          <div className="flex flex-col items-start justify-center gap-1">
                            <div className="text-Gray-N600 justify-start text-right text-xs font-semibold">
                              {flight.name}
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
                            className="text-Gray-N500 mx-4 flex flex-row items-center justify-start gap-1 text-right text-[11px] font-normal"
                          >
                            جزئیات قیمت
                            <ArrowDown2 size="14" color="#748297" />
                          </div>
                          <div className="text-Gray-N700 justify-start text-right text-base font-bold">
                            {englishToFarsiNumber(flight.price)}
                          </div>

                          <div className="text-Gray-N500 justify-start text-right text-[11px] font-semibold">تومان</div>
                        </div>
                      </div>

                      {openPriceDetails[index] && (
                        <div className="mt-2 w-full overflow-hidden transition-all duration-500 ease-in-out">
                          {/* divider */}
                          <div className="bg-Gray-N200 relative mb-2 h-px w-full self-stretch" />
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex w-full items-center justify-end gap-3">
                              <div className="text-Gray-N700 text-[11px] leading-none font-normal">
                                {" "}
                                بزرگسال ({englishToFarsiNumber(flight.adult.number)}){" "}
                              </div>
                              <div className="text-Gray-N700 text-left text-sm leading-normal font-normal">
                                {flight.adult.price}
                              </div>
                              <div className="text-Gray-N500 justify-start text-right text-[11px] font-semibold">
                                تومان
                              </div>
                            </div>

                            <div className="flex w-full items-center justify-end gap-3">
                              <div className="text-Gray-N700 text-[11px] leading-none font-normal">
                                {" "}
                                کودک ({englishToFarsiNumber(flight.child.number)}){" "}
                              </div>
                              <div className="text-Gray-N700 text-left text-sm leading-normal font-normal">
                                {flight.child.price}
                              </div>
                              <div className="text-Gray-N500 justify-start text-right text-[11px] font-semibold">
                                تومان
                              </div>
                            </div>

                            <div className="flex w-full items-center justify-end gap-3">
                              <div className="text-Gray-N700 text-[11px] leading-none font-normal">
                                {" "}
                                نوزاد ({englishToFarsiNumber(flight.infant.number)}){" "}
                              </div>
                              <div className="text-Gray-N700 text-left text-sm leading-normal font-normal">
                                {flight.infant.price}
                              </div>
                              <div className="text-Gray-N500 justify-start text-[11px] font-semibold">تومان</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* divider */}
                    <div className="bg-Gray-N100 h-px self-stretch" />

                    {/* button, seats and refund */}
                    <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                      <div className="inline-flex items-center justify-between self-stretch">
                        {/* refund */}
                        <div
                          className="flex cursor-pointer items-center justify-center gap-1 rounded-xl px-5 py-3.5"
                          onClick={() => {
                            const newRefundRules = [...openRefundRules]
                            newRefundRules[index] = !newRefundRules[index]
                            setOpenRefundRules(newRefundRules)
                          }}
                        >
                          <InfoCircle size="14" color="#748297" />
                          <div className="text-Gray-N600 justify-center text-right text-[11px] font-normal">
                            قوانین استرداد
                          </div>
                        </div>

                        {/* button and seats */}
                        <div className="flex items-center justify-center gap-4">
                          {/* seats */}
                          <div className="text-Error-E500main justify-center text-center text-[10px] font-semibold">
                            {englishToFarsiNumber(flight.remainingSeats)} صندلی باقی مانده
                          </div>

                          {/* button */}
                          <Button
                            intent="primary"
                            size="small"
                            onClick={() => window.open(flight.redirectUrl, "_blank")}
                          >
                            مشاهده و خرید
                            <ArrowLeft2 color="#FFFFFF" size="16" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-100 ease-in-out ${
                        openRefundRules[index] ? "my-3 max-h-[1000px]" : "max-h-0"
                      } flex w-full flex-col`}
                    >
                      {openRefundRules[index] && (
                        <>
                          <div className="bg-Gray-N50 outline-Gray-N100 inline-flex flex-col items-start justify-start self-stretch rounded-lg px-4 py-3 outline-1 outline-offset-[-1px]">
                            <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                              <div className="inline-flex items-center justify-center self-stretch rounded-xl p-2">
                                <div className="text-Gray-N700 flex-1 justify-center text-right text-[13px] leading-none font-normal">
                                  از زمان صدور بلیط تا 12:00 ظهر 3 روز قبل از پرواز
                                </div>
                                <div className="text-Error-E500main justify-center text-center text-[13px] leading-normal font-medium">
                                  ۲۰٪
                                </div>
                              </div>
                              <div className="bg-Gray-N100 relative h-px self-stretch" />
                              <div className="inline-flex items-center justify-center self-stretch rounded-xl p-2">
                                <div className="text-Gray-N700 flex-1 justify-center text-right text-[13px] leading-none font-normal">
                                  از 12:00 ظهر 3 روز قبل از پرواز تا 12:00 ظهر 1 روز قبل از پرواز
                                </div>
                                <div className="text-Error-E500main justify-center text-center text-[13px] leading-normal font-medium">
                                  ۳۰٪
                                </div>
                              </div>
                              <div className="bg-Gray-N100 relative h-px self-stretch" />
                              <div className="inline-flex items-center justify-center self-stretch rounded-xl p-2">
                                <div className="text-Gray-N700 flex-1 justify-center text-right text-[13px] leading-none font-normal">
                                  از 12:00 ظهر 1 روز قبل از پرواز تا 3 ساعت قبل از پرواز
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
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
