"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "@/components/elements/Button/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import img from "@/public/images/Frame 1000002391.svg"
export default function ExpirationModal({
  open,
  onOpenChange,
  onRefresh,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRefresh: () => void
}) {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="pshadow-lg w-[320px] rounded-xl border border-gray-200 bg-white px-10 md:w-[414px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Icon */}
        <DialogHeader className="flex items-center justify-center py-4">
          <div className="h-16 w-16">
            <Image src={img} alt="Refresh Icon" width={64} height={64} className="" />
          </div>
        </DialogHeader>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          {/* Title */}
          <DialogTitle className="text-center text-lg font-semibold text-gray-800">
            جستجو خود را به‌روز کنید
          </DialogTitle>

          {/* Message */}
          <p className="text-center text-base text-gray-600">زمان زیادی گذشته است و اطلاعات ممکن است به روز نباشد.</p>

          {/* Buttons */}
          <div className="mb-4 flex w-full flex-col items-center justify-center gap-2 md:flex-row">
            <Button
              intent="primary"
              size="large"
              className="w-full md:w-1/2"
              onClick={() => {
                onOpenChange(false)
                onRefresh()
              }}
            >
              به‌روزرسانی
            </Button>
            <Button
              intent="secondary"
              size="large"
              className="w-full md:w-1/2"
              onClick={() => {
                onOpenChange(false)
                router.push("/")
              }}
            >
              بازگشت به صفحه اصلی
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
