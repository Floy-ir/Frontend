"use client"

import { DialogClose } from "@radix-ui/react-dialog"
import { CloseCircle } from "iconsax-react"
// import { flightRouterStateSchema } from "next/dist/server/app-render/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import FlightInfo from "./flightInfo"
import TicketCard from "./ticketCard"

export default function ComparisonDialog({
  open,
  onOpenChange,
  websites,
  departureTime,
  arrivalTime,
  origin,
  destination,
  duration,
  otherSellersCount,
  airline,
  flightInfo,
  onBuy

}: {
  onBuy: () => void 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departureTime: string
  arrivalTime: string
  origin: string
  destination: string
  duration: { hours: number; minutes: number }
  otherSellersCount: number
  airline: {
    name: string
    logo: string
  }
  flightInfo: {
    baggage: string
    // ticketType: string
    cabinClass: string
  }
  websites: {
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
  }[]
}) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-Gray-N100 gap-0 border-none p-0 shadow-none m-0 w-full h-full  
                      lg:h-[641px] lg:max-w-[968px] rounded-none lg:rounded-2xl ">
        
        <DialogHeader className="bg-Shade-white rounded-none lg:rounded-t-2xl ">
          <div className="flex flex-row items-center justify-between px-6 py-4">
            <DialogTitle className="text-Gray-N600 text-sm leading-normal font-semibold">جزییات پرواز</DialogTitle>
            <DialogClose>
              <CloseCircle size="24" color="#334155" />
            </DialogClose>
          </div>

          {/* divider */}
          <div className="bg-Gray-N200 h-px self-stretch" />
        </DialogHeader>

        <div className="mb-7 flex overflow-y-auto flex-col lg:flex-row items-start gap-4 md:px-24 lg:px-6.5 md:pt-6.5">
          {/* flight info */}
          <FlightInfo
            departureTime={departureTime}
            arrivalTime={arrivalTime}
            origin={origin}
            destination={destination}
            duration={duration}
            otherSellersCount={otherSellersCount}
            airline={airline} 
            flightInfo={flightInfo}/>

          {/* ticket cards */}
          <TicketCard websites={websites}/>
        </div>
        
      </DialogContent>
    </Dialog>
  )
}
