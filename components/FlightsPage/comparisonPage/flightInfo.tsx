import { ArrowDown2 } from "iconsax-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/elements/Button/Button"
import { englishToFarsiNumber } from "@/utils/numbers"

export default function TicketCard({
  departureTime,
  arrivalTime,
  origin,
  destination,
  duration,
  flightInfo,
  airline,
}: {
  departureTime: string
  arrivalTime: string
  origin: string
  destination: string
  duration: { hours: number; minutes: number }
  airline: {
    name: string
    logo: string
  }
  flightInfo: {
    baggage: string
    // ticketType: string
    cabinClass: string
  }
}) {
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
        className="bg-Shade-White mt-0 inline-flex w-full flex-col items-end justify-center gap-2 self-stretch px-4 py-3 md:rounded-xl lg:mt-11"
        dir="ltr"
      >
        {/* airline and tags */}
        <div className="inline-flex items-center justify-end gap-4 self-stretch">
          <div className="inline-flex flex-1 flex-col items-start justify-center gap-2">
            {/* airline name */}
            <div className="text-Gray-N700 mb-1 justify-start self-stretch text-right text-base font-semibold leading-normal">
              {airline.name}
            </div>
            {/* tags */}
            <div className="inline-flex flex-wrap content-start items-start justify-end gap-1 self-stretch">
              <div className="bg-Gray-N100 flex items-center justify-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-1">
                {/* <div className="text-Gray-N600 justify-center text-right text-[13px] leading-3 font-normal">
                  Boeing 737-300
                </div> */}
              </div>
              <div className="bg-Gray-N100 flex items-center justify-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-1">
                <div className="text-Gray-N600 justify-center text-right text-[13px] font-normal leading-3">سیستمی</div>
              </div>
              <div className="bg-Gray-N100 flex items-center justify-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-1">
                <div className="text-Gray-N600 justify-center text-right text-[13px] font-normal leading-3">
                  {flightInfo.cabinClass}
                </div>
              </div>
            </div>
          </div>

          {/* airline image */}
          <div className="outline-Gray-N200 border-Gray-N200 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border bg-white outline-[1.20px] outline-offset-[-1.20px]">
            <Image alt="airline" src={airline.logo} width={36} height={36} className="rounded-full object-cover" />
          </div>
        </div>
        {/* time and location */}
        <div className="mt-3 flex flex-col items-center justify-start self-stretch pb-1">
          <div className="inline-flex items-center justify-start gap-2 self-stretch">
            <div className="inline-flex w-16 flex-col items-center justify-start">
              <div className="text-Gray-N800 justify-start self-stretch text-center text-xl font-semibold leading-loose">
                {arrivalTime}
              </div>
              <div className="flex flex-col items-center justify-start gap-2" dir="rtl">
                <div className="text-Gray-N500 justify-start text-center text-[12px] font-normal leading-3">
                  {destination}
                </div>
                {/* <div className="text-Gray-N500 justify-start text-center text-[10px] leading-3 font-normal">
                        فرودگاه مشهد
                      </div> */}
              </div>
            </div>
            {/* flight duriation */}
            <div className="inline-flex flex-1 flex-col items-center justify-end gap-2 self-stretch pb-6 pt-2">
              <div className="inline-flex justify-start gap-1 text-center" dir="rtl">
                <span className="text-Gray-N500 text-[13px] font-normal leading-3">
                  {englishToFarsiNumber(duration.hours)}
                </span>
                <span className="text-Gray-N500 text-[13px] font-normal leading-3">ساعت </span>
                <span className="text-Gray-N500 text-[13px] font-normal leading-3">
                  {englishToFarsiNumber(duration.minutes)}
                </span>
                <span className="text-Gray-N500 text-[13px] font-normal leading-3"> دقیقه</span>
              </div>
              {/* image */}
              <div className="w-45 md:w-90 lg:w-45 flex items-center justify-center gap-1.5">
                <Image alt="airline" width={196} height={6} src={"/images/airplane.png"} />
              </div>
            </div>

            <div className="inline-flex w-16 flex-col items-center justify-start">
              <div className="text-Gray-N800 justify-start self-stretch text-center text-xl font-semibold leading-loose">
                {departureTime}
              </div>
              <div className="flex flex-col items-center justify-start gap-2" dir="rtl">
                <div className="text-Gray-N500 justify-start text-center text-[12px] font-normal leading-3">
                  {origin}
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
              className="text-Primary-P500main -mb-2 justify-center text-center text-[15px] font-semibold leading-none"
            >
              جزییات
              <ArrowDown2 size="14" color="#5A28EE" />
            </Button>
          </div>
        </div>

        {/* details accordian */}
        <div
          style={{ maxHeight: height }}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${openDetails ? "mb-4 mt-2" : "my-0"}`}
        >
          <div
            ref={contentRef}
            className={`transition-opacity duration-500 ${openDetails ? "opacity-100" : "opacity-0"}`}
          >
            <div className="">
              {/* Accordion Content Here */}
              <div className="flex w-full flex-col justify-start gap-4 self-stretch" dir="rtl">
                <div className="gap-17 flex w-full flex-row">
                  <div className="inline-flex w-full items-center justify-start gap-1">
                    <div className="text-Gray-N500 shrink-0 justify-start text-start text-[14px] font-normal leading-[16px]">
                      بار مجاز:
                    </div>
                    <div className="text-Gray-N800 shrink-0 justify-start text-start text-[14px] font-semibold leading-[16px]">
                      {englishToFarsiNumber(flightInfo.baggage)}
                    </div>
                  </div>

                  <div className="inline-flex w-full items-center justify-end gap-1">
                    <div className="text-Gray-N500 shrink-0 justify-start text-start text-[14px] font-normal leading-[16px]">
                      کلاس پرواز:
                    </div>
                    <div className="text-Gray-N800 shrink-0 justify-start text-start text-[14px] font-semibold leading-[16px]">
                      اکونومی
                    </div>
                  </div>
                </div>

                {/* <div className="flex w-full flex-row gap-17 items-center">
                  <div className="inline-flex w-full items-start justify-end gap-1">
                    <div className="text-Gray-N500 shrink-0 justify-start text-start text-[14px] leading-[16px] font-normal">
                      نوع پرواز:
                    </div>
                    <div className="text-Gray-N800 shrink-0 justify-start text-start text-[14px] leading-[16px] font-semibold">
                      سیستمی
                    </div>
                  </div>

                  <div className="mt-4 inline-flex w-full items-center justify-start gap-1">
                    <div className="text-Gray-N500 shrink-0 justify-start text-start text-[14px] leading-[16px] font-normal">
                    شماره پرواز:
                    </div>
                    <div className="text-Gray-N800 shrink-0 justify-start text-start text-[14px] leading-[16px] font-semibold break-keep">
                    ۲۲۴۵
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
