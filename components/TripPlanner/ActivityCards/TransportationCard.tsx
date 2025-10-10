import { MoreVertical, Plane } from "lucide-react"

import { Button } from "@/components/elements/Button/Button"
import type { Transportation } from "@/app/types/trip"
import { englishToFarsiNumber } from "@/utils/numbers"

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

  const handleViewAllFlights = () => {
    if (onFlightClick) {
      onFlightClick(activity)
    }
  }

  const handleBookingRedirect = () => {
    if (activity.recommendedFlight) {
      // Placeholder URL - in real implementation, this would be the actual booking URL
      const bookingUrl = `https://example.com/booking?origin=${activity.origin}&destination=${activity.destination}`
      window.open(bookingUrl, "_blank")
    }
  }

  // Enhanced flight card with recommended option (compact version)
  if (activity.mode === "flight" && activity.recommendedFlight) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3" dir="rtl">
        {/* Header with title and recommended badge */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-anjoman-max text-base font-semibold text-Gray-N800">
              پرواز به {activity.destination}
            </h3>
            <span className="rounded bg-Primary-P50 px-1.5 py-0.5 font-anjoman-max text-xs font-medium text-Primary-P700">
              پیشنهادی
            </span>
          </div>
          <div className="font-anjoman-max text-sm font-semibold text-Gray-N800 whitespace-nowrap">
              {englishToFarsiNumber(activity.recommendedFlight.price.formattedAmount)} تومان
          </div>
        </div>

        {/* Compact flight info with price and buttons */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-Gray-N600">
            <span className="font-medium">{activity.recommendedFlight.airline}</span>
            <span>•</span>
            <span>{englishToFarsiNumber(activity.recommendedFlight.departureTime)} - {englishToFarsiNumber(activity.recommendedFlight.arrivalTime)}</span>
            <span>•</span>
            <span>{activity.duration}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
            <Button
                intent="primary"
                size="small"
                className="text-xs px-3"
                onClick={handleBookingRedirect}
              >
                رزرو از {activity.recommendedFlight.price.agency}
              </Button>
              <Button
                intent="secondary"
                size="small"
                className="text-xs px-3"
                onClick={handleViewAllFlights}
              >
                مشاهده همه
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default card for non-flight transportation or flights without recommended data
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3" dir="rtl">
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

