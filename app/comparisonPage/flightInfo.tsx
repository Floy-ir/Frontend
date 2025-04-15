import { ArrowDown2 } from "iconsax-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/Button/Button"

type FlightData = {
    name: string;
    iconPath: string;
    price: string;
    remainingSeats: string;
    redirectUrl: string;
    adult: { number: string; price: string };
    child: { number: string; price: string };
    infant: { number: string; price: string };
  };
  
export default function TicketCard({flightData}:{flightData: FlightData[];}) {
    const [openDetails, setOpenDetails] = useState(false)
    return(
        <div className="flex w-2/5 flex-col items-end">
            <div
              dir="ltr"
              className="bg-Shade-White mt-11 inline-flex flex-col items-end justify-center gap-2 self-stretch rounded-xl px-4 py-3"
            >
              {/* airline and tags */}
              <div className="inline-flex items-center justify-end gap-3 self-stretch">
                <div className="inline-flex flex-1 flex-col items-start justify-center gap-1">
                  <div className="text-Gray-N700 justify-start self-stretch text-right text-sm leading-normal font-semibold">
                    آتا
                  </div>
                  <div className="inline-flex flex-wrap content-start items-start justify-end gap-1 self-stretch">
                    <div className="bg-Gray-N100 flex items-center justify-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-1">
                      <div className="text-Gray-N600 justify-center text-right text-[10px] leading-3 font-normal">
                        Boeing 737-300
                      </div>
                    </div>
                    <div className="bg-Gray-N100 flex items-center justify-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-1">
                      <div className="text-Gray-N600 justify-center text-right text-[10px] leading-3 font-normal">
                        سیستمی
                      </div>
                    </div>
                    <div className="bg-Gray-N100 flex items-center justify-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-1">
                      <div className="text-Gray-N600 justify-center text-right text-[10px] leading-3 font-normal">
                        اکونومی
                      </div>
                    </div>
                  </div>
                </div>
                <div className="outline-Gray-N200 border-Gray-N200 flex h-9 w-9 items-center justify-center rounded-full border bg-white outline-[1.20px] outline-offset-[-1.20px]">
                  <Image alt="airline" width={36} height={36} src={"/images/alibaba-icon.png"} />
                </div>
              </div>
              {/* time and location */}
              <div className="flex flex-col items-center justify-start self-stretch pb-1">
                <div className="inline-flex items-center justify-start gap-2 self-stretch">
                  <div className="inline-flex w-16 flex-col items-center justify-start">
                    <div className="text-Gray-N800 justify-start self-stretch text-center text-lg leading-loose font-semibold">
                      ۱۱:۳۰
                    </div>
                    <div className="flex flex-col items-center justify-start gap-2" dir="rtl">
                      <div className="text-Gray-N500 justify-start text-center text-[10px] leading-3 font-normal">
                        مشهد(MHD)
                      </div>
                      {/* <div className="text-Gray-N500 justify-start text-center text-[10px] leading-3 font-normal">
                        فرودگاه مشهد
                      </div> */}
                    </div>
                  </div>
                  <div className="inline-flex flex-1 flex-col items-center justify-end gap-2 self-stretch pt-2 pb-6">
                    <div className="justify-start text-center" dir="rtl">
                      <span className="text-Gray-N500 text-[10px] leading-3 font-semibold">۱ </span>
                      <span className="text-Gray-N500 text-[10px] leading-3 font-normal">ساعت </span>
                      <span className="text-Gray-N500 text-[10px] leading-3 font-semibold">۳۰</span>
                      <span className="text-Gray-N500 text-[10px] leading-3 font-normal"> دقیقه</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <Image alt="airline" width={196} height={6} src={"/images/airplane.png"} />
                    </div>
                  </div>
                  <div className="inline-flex w-16 flex-col items-center justify-start">
                    <div className="text-Gray-N800 justify-start self-stretch text-center text-lg leading-loose font-semibold">
                      ۰۹:۳۰
                    </div>
                    <div className="flex flex-col items-center justify-start gap-2" dir="rtl">
                      <div className="text-Gray-N500 justify-start text-center text-[10px] leading-3 font-normal">
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
                    className="text-Primary-P500main justify-center text-center text-[13px] leading-none font-semibold"
                  >
                    جزییات
                    <ArrowDown2 size="14" color="#5A28EE" />
                  </Button>
                </div>
              </div>
              <div className={`overflow-hidden transition-all duration-1000 ease-in-out 
                      ${openDetails? "mt-4 max-h-[1000px]" : "max-h-0"} `}>
              {openDetails && (
                <div className="mb-4">
                  {/* Accordion Content Here */}
                  <div className="flex flex-col gap-4 justify-start self-stretch w-full" dir="rtl">
                    
                    
                    <div className="flex w-full flex-row gap-17">
                     
                      <div className="inline-flex w-full items-center justify-start gap-1  ">
                        <div className="text-Gray-N500 justify-start text-start text-[11px] leading-none font-normal">
                          شماره پرواز:
                        </div>
                        <div className="text-Gray-N800 justify-start text-start text-[11px] leading-none font-semibold">
                          ۲۲۴۵
                        </div>
                      </div>

                      <div className="inline-flex w-full items-center justify-end gap-1 ">
                        <div className="text-Gray-N500  shrink-0 justify-start text-start text-[11px] leading-none font-normal">
                          کلاس پرواز:
                        </div>
                        <div className="text-Gray-N800  shrink-0 justify-start text-start text-[11px] leading-none font-semibold">
                          اکونومی
                        </div>
                      </div>
                    
                    </div>
                   
                    <div className="flex w-full flex-row gap-17">

                      <div className="mt-4 inline-flex w-full items-center justify-end gap-1  ">
                        <div className="text-Gray-N500 justify-start  shrink-0 text-start text-[11px] leading-none font-normal">
                          نوع پرواز:
                        </div>
                        <div className="text-Gray-N800 justify-start  shrink-0 text-start text-[11px] leading-none font-semibold">
                          سیستمی
                        </div>
                      </div>

                      <div className="mt-4 inline-flex w-full items-center justify-end gap-1">
                        <div className="text-Gray-N500 justify-start  shrink-0 text-start text-[11px] leading-none font-normal">
                          بار مجاز:
                        </div>
                        <div className="text-Gray-N800 break-keep  shrink-0  justify-start   text-start text-[11px] leading-none font-semibold">
                          ۲۰ کیلوگرم
                        </div>
                      </div>

                    </div>
                  
                  
                  </div>
                </div>
              )}
</div>
              
            </div>
          </div>
    )}