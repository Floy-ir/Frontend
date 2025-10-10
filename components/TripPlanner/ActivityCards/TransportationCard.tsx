import { MoreVertical } from "lucide-react"

import type { Transportation } from "@/app/types/trip"

type TransportationCardProps = {
  activity: Transportation
  onFlightClick?: (activity: Transportation) => void
}

export function TransportationCard({ activity, onFlightClick }: TransportationCardProps) {
  const getModeLabel = () => {
    switch (activity.mode) {
      case "train":
        return "قطار"
      case "flight":
        return "پرواز"
      case "bus":
        return "اتوبوس"
      case "car":
        return "خودرو"
    }
  }

  const isFlightClickable = activity.mode === "flight" && onFlightClick

  const handleClick = () => {
    if (isFlightClickable) {
      onFlightClick(activity)
    }
  }

  return (
    <div 
      className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors ${
        isFlightClickable 
          ? "cursor-pointer hover:bg-gray-50 hover:border-Primary-P300 focus:outline-none focus:ring-2 focus:ring-Primary-P500main focus:ring-offset-2" 
          : ""
      }`} 
      dir="rtl"
      onClick={handleClick}
      role={isFlightClickable ? "button" : undefined}
      tabIndex={isFlightClickable ? 0 : undefined}
      onKeyDown={isFlightClickable ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleClick()
        }
      } : undefined}
      aria-label={isFlightClickable ? `مشاهده پروازهای ${activity.destination}` : undefined}
    >
      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate font-anjoman-max text-base font-semibold text-Gray-N800">
          {getModeLabel()} به {activity.destination}
        </h3>
        <div className="mt-0.5 flex items-center gap-2 text-sm text-Gray-N600">
          <span>{activity.duration}</span>
          {activity.departureTime && (
            <>
              <span>•</span>
              <span>{activity.departureTime}</span>
            </>
          )}
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
}

