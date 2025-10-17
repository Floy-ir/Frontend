import { MapPin, MoreVertical } from "lucide-react"
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
          <img src={activity.image} alt={activity.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-Primary-P100 to-Primary-P200">
            <MapPin className="h-10 w-10 text-Primary-P400" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate font-anjoman-max text-base font-semibold text-Gray-N800">{activity.name}</h3>
        <p className="text-sm text-Gray-N600">مقصد</p>
      </div>

      {/* Menu Button */}
      <button
        className="shrink-0 rounded-full p-1 text-Gray-N500 transition-colors hover:bg-gray-100 hover:text-Gray-N700 focus:outline-none focus:ring-2 focus:ring-Primary-P500main focus:ring-offset-2"
        aria-label="گزینه‌های بیشتر"
      >
        <MoreVertical className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
})

