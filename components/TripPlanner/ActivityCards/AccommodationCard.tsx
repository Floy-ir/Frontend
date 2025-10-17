import { Hotel, MoreVertical, Star } from "lucide-react"
import React from "react"

import type { Accommodation } from "@/app/types/trip"
import { englishToFarsiNumber } from "@/utils/numbers"

type AccommodationCardProps = {
  activity: Accommodation
}

export const AccommodationCard = React.memo(function AccommodationCard({ activity }: AccommodationCardProps) {
  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-lg border border-gray-200 bg-white p-3" dir="rtl">
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {activity.image ? (
          <img src={activity.image} alt={activity.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <Hotel className="h-10 w-10 text-blue-400" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate font-anjoman-max text-base font-semibold text-Gray-N800">{activity.name}</h3>
        <div className="mt-0.5 flex items-center gap-2 text-sm text-Gray-N600">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            <span className="font-medium">{englishToFarsiNumber(activity.rating)}</span>
          </div>
          <span>•</span>
          <span>{englishToFarsiNumber(activity.nightCount)} شب</span>
        </div>
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

