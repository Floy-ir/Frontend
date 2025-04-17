import { ArrowDown2 } from "iconsax-react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/Button/Button"

type FlightData = {
  name: string
  iconPath: string
  price: string
  remainingSeats: string
  redirectUrl: string
  adult: { number: string; price: string }
  child: { number: string; price: string }
  infant: { number: string; price: string }
}

export default function TicketCard({ flightData }: { flightData: FlightData[] }) {
  const [openDetails, setOpenDetails] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState("0px")

  useEffect(() => {
    if (openDetails && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`)
    } else {
      setHeight("0px")
    }
  }, [openDetails])

  return (
    <div className="flex w-full flex-col items-end lg:w-2/5">
      <div
        className="bg-Shade-White mt-0 inline-flex w-full flex-col items-end justify-center gap-2 self-stretch md:rounded-xl px-4 py-3  lg:mt-4"
        dir="ltr"
      >
        {/* airline and tags */}
        <div className="inline-flex items-center justify-end gap-4 self-stretch">
          <div className="inline-flex flex-1 flex-col items-start justify-center gap-2">
            {/* airline name */}
            <div className="text-Gray-N700 mb-1 justify-start self-stretch text-right text-base leading-normal font-semibold">
              آتا
            </div>
            {/* tags */}
            <div className="inline-flex flex-wrap content-start items-start justify-end gap-1 self-stretch">
              <div className="bg-Gray-N100 flex items-center justify-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-1">
                <div className="text-Gray-N600 justify-center text-right text-[13px] leading-3 font-normal">
                  Boeing 737-300
                </div>
              </div>
              <div className="bg-Gray-N100 flex items-center justify-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-1">
                <div className="text-Gray-N600 justify-center text-right text-[13px] leading-3 font-normal">سیستمی</div>
              </div>
              <div className="bg-Gray-N100 flex items-center justify-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-1">
                <div className="text-Gray-N600 justify-center text-right text-[13px] leading-3 font-normal">
                  اکونومی
                </div>
              </div>
            </div>
          </div>
          
          {/* airline image */}
          <div className="outline-Gray-N200 border-Gray-N200 flex h-9 w-9 items-center justify-center rounded-full border bg-white outline-[1.20px] outline-offset-[-1.20px]">
            <Image alt="airline" width={37} height={37} src={"/images/alibaba-icon.png"} />
          </div>
        </div>
        {/* time and location */}
        <div className="mt-3 flex flex-col items-center justify-start self-stretch pb-1">
          <div className="inline-flex items-center justify-start gap-2 self-stretch">
            <div className="inline-flex w-16 flex-col items-center justify-start">
              <div className="text-Gray-N800 justify-start self-stretch text-center text-xl leading-loose font-semibold">
                ۱۱:۳۰
              </div>
              <div className="flex flex-col items-center justify-start gap-2" dir="rtl">
                <div className="text-Gray-N500 justify-start text-center text-[12px] leading-3 font-normal">
                  مشهد(MHD)
                </div>
                {/* <div className="text-Gray-N500 justify-start text-center text-[10px] leading-3 font-normal">
                        فرودگاه مشهد
                      </div> */}
              </div>
            </div>
            {/* flight duriation */}
            <div className="inline-flex flex-1 flex-col items-center justify-end gap-2 self-stretch pt-2 pb-6">
              <div className="justify-start text-center" dir="rtl">
                <span className="text-Gray-N500 text-[13px] leading-3 font-semibold">۱ </span>
                <span className="text-Gray-N500 text-[13px] leading-3 font-normal">ساعت </span>
                <span className="text-Gray-N500 text-[13px] leading-3 font-semibold">۳۰</span>
                <span className="text-Gray-N500 text-[13px] leading-3 font-normal"> دقیقه</span>
              </div>
              {/* image */}
              <div className="flex items-center justify-center gap-1.5">
                <Image alt="airline" width={196} height={6} src={"/images/airplane.png"} />
              </div>
            </div>

            <div className="inline-flex w-16 flex-col items-center justify-start">
              <div className="text-Gray-N800 justify-start self-stretch text-center text-xl leading-loose font-semibold">
                ۰۹:۳۰
              </div>
              <div className="flex flex-col items-center justify-start gap-2" dir="rtl">
                <div className="text-Gray-N500 justify-start text-center text-[12px] leading-3 font-normal">
                  تهران(THR)
                </div>
                {/* <div className="text-Gray-N500 justify-start text-center text-[10px] leading-3 font-normal">
                        فرودگاه مهراباد
                      </div> */}
              </div>
            </div>
          </div>
        </div>
        {/* divider */}
        <div className="bg-Gray-N100 h-px self-stretch" />

        {/* details */}
        <div className="inline-flex items-center justify-center self-stretch" dir="rtl">
          <div onClick={() => setOpenDetails(!openDetails)}>
            <Button
              intent="text"
              size="small"
              className="text-Primary-P500main justify-center text-center text-[15px] -mb-2 leading-none font-semibold"
            >
              جزییات
              <ArrowDown2 size="14" color="#5A28EE" />
            </Button>
          </div>
        </div>

        {/* details accordian */}
        <div
          style={{ maxHeight: height }}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${openDetails ? "mt-2 mb-4" : "my-0"}`}
        >
          <div
            ref={contentRef}
            className={`transition-opacity duration-500 ${openDetails ? "opacity-100" : "opacity-0"}`}
          >
            <div className="">
              {/* Accordion Content Here */}
              <div className="flex w-full flex-col justify-start gap-4 self-stretch" dir="rtl">
                <div className="flex w-full flex-row gap-17">
                  <div className="inline-flex w-full items-center justify-start gap-1">
                    <div className="text-Gray-N500 shrink-0 justify-start text-start text-[14px] leading-[16px] font-normal">
                      شماره پرواز:
                    </div>
                    <div className="text-Gray-N800 shrink-0 justify-start text-start text-[14px] leading-[16px] font-semibold">
                      ۲۲۴۵
                    </div>
                  </div>

                  <div className="inline-flex w-full items-center justify-end gap-1">
                    <div className="text-Gray-N500 shrink-0 justify-start text-start text-[14px] leading-[16px] font-normal">
                      کلاس پرواز:
                    </div>
                    <div className="text-Gray-N800 shrink-0 justify-start text-start text-[14px] leading-[16px] font-semibold">
                      اکونومی
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-row gap-17">
                  <div className="mt-4 inline-flex w-full items-center justify-end gap-1">
                    <div className="text-Gray-N500 shrink-0 justify-start text-start text-[14px] leading-[16px] font-normal">
                      نوع پرواز:
                    </div>
                    <div className="text-Gray-N800 shrink-0 justify-start text-start text-[14px] leading-[16px] font-semibold">
                      سیستمی
                    </div>
                  </div>

                  <div className="mt-4 inline-flex w-full items-center justify-end gap-1">
                    <div className="text-Gray-N500 shrink-0 justify-start text-start text-[14px] leading-[16px] font-normal">
                      بار مجاز:
                    </div>
                    <div className="text-Gray-N800 shrink-0 justify-start text-start text-[14px] leading-[16px] font-semibold break-keep">
                      ۲۰ کیلوگرم
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
