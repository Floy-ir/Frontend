"use client"

import { ArrowDown2, ArrowLeft2, InfoCircle } from "iconsax-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/Button/Button"
import { englishToFarsiNumber } from "@/utils/numbers"

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

    const [openPriceDetails, setOpenPriceDetails] = useState<boolean[]>(new Array(flightData.length).fill(false)) // for each card's price details
    const [openRefundRules, setOpenRefundRules] = useState<boolean[]>(new Array(flightData.length).fill(false)) // for each card's refund rules
  
        return(
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
                        <div className="flex items-center justify-end gap-2">
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
                      <div className={`overflow-hidden transition-all duration-1000 ease-in-out w-full
                      ${openPriceDetails[index] ? "mt-2 max-h-[1000px]" : "max-h-0"} `}>
                      {openPriceDetails[index] && (
                        <div className="  w-full">
                          {/* divider */}
                          <div className="bg-Gray-N200 mb-4 h-px w-full self-stretch" />
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex w-full items-center justify-end gap-3">
                              <div className="text-Gray-N700 text-[11px] leading-none font-normal">
                                {" "}
                                بزرگسال ({englishToFarsiNumber(flight.adult.number)}){" "}
                              </div>
                              <div className="text-Gray-N700 text-left text-sm leading-normal font-normal">
                              {englishToFarsiNumber(flight.adult.price)}
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
                              {englishToFarsiNumber(flight.child.price)}
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
                              {englishToFarsiNumber(flight.infant.price)}
                              </div>
                              <div className="text-Gray-N500 justify-start text-[11px] font-semibold">تومان</div>
                            </div>
                          </div>
                        </div>
                      )}
                      </div>
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
                          <InfoCircle size="14" color={`${openRefundRules[index] ? "#5A28EE" : "#748297"}`} />
                          <div className={`${openRefundRules[index] ? "text-Primary-P500main" : "text-Gray-N600"} justify-center text-right text-[11px] font-normal`}>
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
                      className={`overflow-hidden transition-all duration-1000 ease-in-out ${
                        openRefundRules[index] ? "my-3 max-h-[1000px]" : "max-h-0"
                      } flex w-full flex-col`}
                    >
                      {openRefundRules[index] && (
                        <>
                          <div className="bg-Gray-N50 outline-Gray-N100 inline-flex flex-col items-start justify-start self-stretch rounded-lg px-4 py-3 outline-1 outline-offset-[-1px]">
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
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
    )
}