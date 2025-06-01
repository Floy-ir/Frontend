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
  airline,
  flightInfo,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
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
      <DialogContent className="bg-Gray-N100 m-0 h-full w-full gap-0 rounded-none border-none p-0 shadow-none lg:h-[665px] lg:max-w-[968px] lg:rounded-2xl">
        <DialogHeader className="bg-Shade-white rounded-none lg:rounded-t-2xl">
          <div className="flex flex-row items-center justify-between px-6 py-4">
            <DialogTitle className="text-Gray-N600 text-sm leading-normal font-semibold">جزییات پرواز</DialogTitle>
            <DialogClose>
              <CloseCircle size="24" color="#334155" />
            </DialogClose>
          </div>

          {/* divider */}
          <div className="bg-Gray-N200 h-px self-stretch" />
        </DialogHeader>

        <div className="mb-7 flex flex-col items-start gap-4 overflow-y-auto md:px-24 md:pt-6.5 lg:flex-row lg:px-6.5">
          {/* flight info */}
          <FlightInfo
            departureTime={departureTime}
            arrivalTime={arrivalTime}
            origin={origin}
            destination={destination}
            duration={duration}
            airline={airline}
            flightInfo={flightInfo}
          />

          {/* ticket cards */}
          <TicketCard websites={websites} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
