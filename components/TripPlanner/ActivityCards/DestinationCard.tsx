"use client"

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, MapPin, MoreVertical, X } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useState } from "react"

import type { Destination } from "@/app/types/trip"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { englishToFarsiNumber } from "@/utils/numbers"

type DestinationCardProps = {
  activity: Destination
}

export const DestinationCard = React.memo(function DestinationCard({ activity }: DestinationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const hasDescription = !!activity.description
  const hasImages = activity.descriptionImages && activity.descriptionImages.length > 0
  const selectedImageUrl =
    selectedImageIndex !== null && activity.descriptionImages
      ? activity.descriptionImages[selectedImageIndex]
      : undefined

  const handlePreviousImage = () => {
    if (selectedImageIndex !== null && activity.descriptionImages) {
      setSelectedImageIndex((prev) => (prev! > 0 ? prev! - 1 : activity.descriptionImages!.length - 1))
    }
  }

  const handleNextImage = () => {
    if (selectedImageIndex !== null && activity.descriptionImages) {
      setSelectedImageIndex((prev) => (prev! < activity.descriptionImages!.length - 1 ? prev! + 1 : 0))
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (selectedImageIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault()
        if (e.key === "ArrowLeft") {
          handleNextImage() // In RTL, left arrow goes to next
        } else {
          handlePreviousImage() // In RTL, right arrow goes to previous
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImageIndex, activity.descriptionImages])

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white" dir="rtl">
      {/* Main Content */}
      <div className="flex items-center gap-3 p-3">
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

      {/* Expandable Description */}
      {hasDescription && (
        <div className="border-t border-gray-100 px-3 pt-2 pb-2">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p
                className={`text-Gray-N700 text-sm leading-relaxed transition-all duration-200 ease-in-out ${
                  isExpanded ? "" : "line-clamp-1"
                }`}
              >
                {activity.description}
              </p>

              {/* Image Grid - Only shown when expanded */}
              {isExpanded && hasImages && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {activity.descriptionImages!.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className="focus:ring-Primary-P500main relative h-32 w-full overflow-hidden rounded-lg bg-gray-100 transition-opacity hover:opacity-80 focus:ring-2 focus:ring-offset-1 focus:outline-none"
                      aria-label={`نمایش تصویر ${index + 1} از ${activity.name}`}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${activity.name} - تصویر ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chevron Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-Gray-N500 hover:text-Gray-N700 focus:ring-Primary-P500main shrink-0 rounded p-0.5 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-offset-1 focus:outline-none"
              aria-expanded={isExpanded}
              aria-label="نمایش/مخفی کردن جزئیات"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Image Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="sr-only">نمایش تصاویر {activity.name}</DialogTitle>
          <DialogClose className="absolute top-4 left-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">بستن</span>
          </DialogClose>

          {/* Image Counter */}
          {selectedImageUrl && selectedImageIndex !== null && activity.descriptionImages && (
            <>
              <div className="absolute top-4 right-4 z-10 rounded-full bg-black/50 px-3 py-1.5 text-sm text-white">
                {englishToFarsiNumber(selectedImageIndex + 1)} /{" "}
                {englishToFarsiNumber(activity.descriptionImages.length)}
              </div>

              {/* Image Display */}
              <div className="relative h-[80vh] w-full">
                <Image
                  src={selectedImageUrl}
                  alt={`${activity.name} - تصویر ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Navigation Buttons */}
              {activity.descriptionImages.length > 1 && (
                  <>
                    {/* Previous Button (Right side in RTL) */}
                    <button
                      onClick={handlePreviousImage}
                      className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
                      aria-label="تصویر قبلی"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Next Button (Left side in RTL) */}
                    <button
                      onClick={handleNextImage}
                      className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
                      aria-label="تصویر بعدی"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  </>
                )}
              </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  )
})
