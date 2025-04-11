"use client"
import { DialogClose } from "@radix-ui/react-dialog"
import { ArrowLeft2 , CloseCircle, InfoCircle } from "iconsax-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/Button/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
    },
    {
      name: "اسمان",
      iconPath: "/images/alibaba-icon.png",
      price: "۲،۵۰۰،۰۰۰",
      remainingSeats: 3,
      redirectUrl: "https://www.alibaba.ir",
    },
    {
      name: "ماهان",
      iconPath: "/images/alibaba-icon.png",
      price: "۴،۰۰۰،۰۰۰",
      remainingSeats: 2,
      redirectUrl: "https://www.alibaba.ir",
    },
    {
      name: "Kish Air",
      iconPath: "/images/alibaba-icon.png",
      price: "۱،۷۰۰،۰۰۰",
      remainingSeats: 5,
      redirectUrl: "https://www.alibaba.ir",
    },
    {
      name: "Iran Air",
      iconPath: "/images/alibaba-icon.png",
      price: "۲،۸۰۰،۰۰۰",
      remainingSeats: 4,
      redirectUrl: "https://www.alibaba.ir",
    },
  ]
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-Gray-N100 gap-0 border-none p-0 shadow-none md:max-w-[1000px] ">
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
          <div className="flex w-2/5 flex-col items-end">v</div>

          <div className="flex w-3/5 flex-col items-start gap-5">
            <div className="text-Gray-N600 h-6 self-stretch text-right text-sm leading-normal font-semibold">
              ۳ فروشنده
            </div>
            <div className="cards-container  w-full snap-y overflow-y-auto snap-mandatory h-[550px]">

            {flightData.map((flight, index) => (
            <div key={index} className="flex w-full flex-col items-start">
              <div className="bg-Shade-White outline-Gray-N200 w-full mb-3 inline-flex flex-col items-center justify-center gap-3 self-stretch rounded-xl px-4 py-3 outline-1 outline-offset-[-1px]">
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
                        <div className="text-Gray-N600 justify-start text-right text-xs font-semibold">{flight.name}</div>
                      </div>
                    </div>

                    {/* price */}
                    <div className="flex items-center justify-end gap-1">
                      <div className="text-Gray-N700 justify-start text-right text-base font-bold">{flight.price}</div>
                      <div className="text-Gray-N500 justify-start text-right text-[11px] font-semibold">تومان</div>
                    </div>
                  </div>
                </div>

                {/* divider */}
                <div className="bg-Gray-N100 h-px self-stretch" />

                {/* button, seats and refund */}
                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="inline-flex items-center justify-between self-stretch">
                    {/* refund */}
                    <div className="flex items-center justify-center gap-1 rounded-xl px-5 py-3.5">
                      <InfoCircle size="14" color="#748297" />
                      <div className="text-Gray-N600 justify-center text-right text-[11px] font-normal">
                        قوانین استرداد
                      </div>
                    </div>

                    {/* button and seats */}
                    <div className="flex items-center justify-center gap-4">
                      {/* seats */}
                      <div className="text-Error-E500main justify-center text-center text-[10px] font-semibold">
                        {flight.remainingSeats} صندلی باقی مانده
                      </div>

                      {/* button */}
                      <Button intent="primary" size="small" onClick={() =>  window.open(flight.redirectUrl, "_blank")}>
                        مشاهده و خرید
                        <ArrowLeft2 color="#FFFFFF" size="16" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* badge */}
                <div className="bg-Success-s50 absolute top-0 left-0 inline-flex items-center justify-center gap-1 rounded-tl-sm rounded-br-sm px-2.5 py-1">
                  <div className="text-Success-s700 justify-center text-right text-[8px] font-semibold">ارزان‌ترین</div>
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
