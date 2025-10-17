import { MapPin, MoreVertical } from "lucide-react"
import Image from "next/image"
import React from "react"

import type { Destination } from "@/app/types/trip"

type DestinationCardProps = {
  activity: Destination
}

export const DestinationCard = React.memo(function DestinationCard({ activity }: DestinationCardProps) {
  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-lg border border-gray-200 bg-white p-3" dir="rtl">
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {activity.image ? (
          <Image src={activity.image} alt={activity.name} fill className="object-cover" />
        ) : (
          <div className="from-Primary-P100 to-Primary-P200 flex h-full w-full items-center justify-center bg-gradient-to-br">
            <MapPin className="text-Primary-P400 h-10 w-10" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-anjoman-max text-Gray-N800 truncate text-base font-semibold">{activity.name}</h3>
        <p className="text-Gray-N600 text-sm">مقصد</p>
      </div>

      {/* Menu Button */}
      <button
        className="text-Gray-N500 hover:text-Gray-N700 focus:ring-Primary-P500main shrink-0 rounded-full p-1 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        aria-label="گزینه‌های بیشتر"
      >
        <MoreVertical className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
})
