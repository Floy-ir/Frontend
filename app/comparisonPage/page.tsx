"use client"

import { DialogClose } from "@radix-ui/react-dialog"
import { CloseCircle } from "iconsax-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import FlightInfo from "./flightInfo"
import TicketCard from "./ticketCard"

export default function ComparisonDialog() {
  const [open, setOpen] = useState(true)

  // Sample flight data
  const flightData = [
    {
      name: "علی بابا",
      iconPath: "/images/alibaba-icon.png",
      price: "2,000,000",
      remainingSeats: "1",
      redirectUrl: "https://www.alibaba.ir",
      child: { number: "1", price: "1,000,000" },
      infant: { number: "1", price: "500,000" },
      adult: { number: "1", price: "3,000,000" },
    },
    {
      name: "اسمان",
      iconPath: "/images/alibaba-icon.png",
      price: "2,500,000",
      remainingSeats: "1",
      redirectUrl: "https://www.alibaba.ir",
      child: { number: "1", price: "800,000" },
      infant: { number: "1", price: "400,000" },
      adult: { number: "1", price: "2,100,000" },
    },
    {
      name: "ماهان",
      iconPath: "/images/alibaba-icon.png",
      price: "۴،۰۰۰،۰۰۰",
      remainingSeats: "2",
      redirectUrl: "https://www.alibaba.ir",
      child: { number: "1", price: "900,000" },
      infant: { number: "1", price: "450,000" },
      adult: { number: "1", price: "3,500,000" },
    },
    {
      name: "Kish Air",
      iconPath: "/images/alibaba-icon.png",
      price: "۷۰۰،۰۰۰",
      remainingSeats: "5",
      redirectUrl: "https://www.alibaba.ir",
      child: { number: "1", price: "700,000" },
      infant: { number: "1", price: "350,000" },
      adult: { number: "1", price: "1,000,000" },
    },
    {
      name: "Iran Air",
      iconPath: "/images/alibaba-icon.png",
      price: "۲،۸۰۰،۰۰۰",
      remainingSeats: "4",
      redirectUrl: "https://www.alibaba.ir",
      child: { number: "1", price: "850,000" },
      infant: { number: "1", price: "420,000" },
      adult: { number: '1', price: "2,500,000" },
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-Gray-N100 gap-0 border-none p-0 shadow-none md:max-w-[968px]">
        <DialogHeader className="bg-Shade-White rounded-t-2xl">
          <div className="flex flex-row items-center justify-between px-6 py-4">
            <DialogTitle className="text-Gray-N600 text-sm leading-normal font-semibold">جزییات پرواز</DialogTitle>
            <DialogClose>
              <CloseCircle size="24" color="#334155" />
            </DialogClose>
          </div>

          {/* divider */}
          <div className="bg-Gray-N200 h-px self-stretch" />
        </DialogHeader>

        <div className="mb-7 flex flex-row items-start gap-4 px-6.5 pt-6.5">
          {/* flight info */}
          <FlightInfo flightData={flightData} />

          {/* ticket cards */}
          
        <TicketCard flightData={flightData} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
