"use client"

import React from "react"
import { twMerge } from "tailwind-merge"

export function FlightCardSkeleton({ className }: { className?: string }) {
  return (
    <article className={twMerge("bg-Shade-White rounded-xl outline-1 outline-offset-[-1px] outline-Gray-N200 overflow-hidden", className)}>
      {/* Mobile/Tablet Layout */}
      <div className="md-lg:hidden flex flex-col lg:hidden">
        <div className="bg-Shade-White outline-Gray-N200 inline-flex flex-col items-center justify-center gap-3 self-stretch overflow-hidden rounded-xl px-4 pt-4 pb-2 outline-1 outline-offset-[-1px]">
          {/* Flight info section */}
          <div className="inline-flex flex-row-reverse items-center justify-center gap-6 self-stretch">
            <div className="inline-flex flex-1 flex-col items-end justify-center">
              <div className="inline-flex flex-row-reverse items-center justify-start self-stretch">
                <div className="flex-1 justify-start text-center">
                  <div className="mx-auto h-7 w-16 animate-pulse rounded bg-Gray-N100"></div>
                </div>

                {/* Flight route visualization */}
                <div className="relative mx-0 flex flex-1 items-center justify-center">
                  <div className="border-Gray-N300 animate-pulse size-1.5 rounded-[33px] border bg-Gray-N100" />
                  <div className="bg-Gray-N200 relative h-px w-23 flex-1" />
                  <div className="bg-Gray-N300 animate-pulse size-1.5 rounded-[2px]" />
                  <div className="absolute size-3 origin-top-left -rotate-90 animate-pulse bg-Gray-N100"
                    style={{ left: "33px", top: "7px" }}>
                  </div>
                </div>

                <div className="flex-1 justify-start text-center">
                  <div className="mx-auto h-7 w-16 animate-pulse rounded bg-Gray-N100"></div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-end gap-2 self-stretch">
                <div className="justify-start text-center">
                  <div className="mx-auto mt-1 h-3 w-20 animate-pulse rounded bg-Gray-N100"></div>
                </div>
              </div>
            </div>

            {/* Airline logo and name */}
            <div className="inline-flex flex-col items-center justify-center gap-2">
              <div className="border-Gray-N200 relative size-9 overflow-hidden rounded-[48px] border bg-Gray-N100 animate-pulse"></div>
              <div className="h-4 w-14 animate-pulse rounded bg-Gray-N100"></div>
            </div>
          </div>

          {/* Flight info badges */}
          <div className="mt-3 inline-flex flex-wrap content-start items-start justify-start gap-1 self-stretch">
            <div className="h-6 w-20 animate-pulse rounded-sm bg-Gray-N100"></div>
            <div className="h-6 w-24 animate-pulse rounded-sm bg-Gray-N100"></div>
          </div>

          {/* Divider */}
          <div className="bg-Gray-N100 relative my-2 h-px self-stretch" />

          {/* Price and action section */}
          <div className="flex flex-col items-start justify-start gap-2 self-stretch">
            <div className="flex flex-col items-center justify-center gap-3 self-stretch">
              <div className="bg-Gray-N50 outline-Gray-N200 relative flex flex-col items-end justify-center gap-1 self-stretch rounded-lg px-3 py-3 outline-1 outline-offset-[-1px]">
                <div className="mt-1 mb-0.5 inline-flex flex-row-reverse items-center justify-between self-stretch">
                  <div className="flex flex-row-reverse items-center justify-end gap-1">
                    <div className="h-5 w-16 animate-pulse rounded bg-Gray-N100"></div>
                  </div>
                  <div className="flex flex-row-reverse items-center justify-end gap-2">
                    <div className="h-5 w-20 animate-pulse rounded bg-Gray-N100"></div>
                    <div className="outline-Gray-N200 flex size-8 animate-pulse items-center justify-center overflow-hidden rounded-[48px] bg-Gray-N100 outline-1 outline-offset-[-1px]"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                <div className="h-10 w-full animate-pulse rounded bg-Gray-N100"></div>
                <div className="h-10 w-full animate-pulse rounded bg-Gray-N100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="md-lg:inline-flex hidden w-full items-start justify-between gap-8 self-stretch px-6 pt-4 pb-2 lg:inline-flex">
        {/* Flight details - Right */}
        <div className="inline-flex flex-1 flex-col items-center justify-between self-stretch px-4 py-4">
          <div className="inline-flex items-center justify-end gap-2 self-stretch">
            {/* Airline logo and name */}
            <div className="inline-flex flex-col items-center justify-center gap-2">
              <div className="border-Gray-N200 relative size-11 overflow-hidden rounded-[48px] border bg-Gray-N100 animate-pulse"></div>
              <div className="h-4 w-16 animate-pulse rounded bg-Gray-N100"></div>
            </div>
            <div className="inline-flex flex-1 flex-col items-start justify-center">
              <div className="inline-flex items-center justify-start self-stretch">
                <div className="flex-1 justify-start text-center">
                  <div className="mx-auto h-7 w-20 animate-pulse rounded bg-Gray-N100"></div>
                </div>

                {/* Flight route visualization */}
                <div className="relative mx-0 flex flex-1 items-center justify-center">
                  <div className="border-Gray-N300 size-1.5 rounded-[33px] border bg-Gray-N100 animate-pulse" />
                  <div className="bg-Gray-N200 relative h-px w-23 flex-1" />
                  <div className="bg-Gray-N300 size-1.5 rounded-[2px] animate-pulse" />
                  <div className="absolute size-3 origin-top-left -rotate-90 animate-pulse bg-Gray-N100"
                    style={{ left: "55px", top: "7px" }}>
                  </div>
                </div>

                <div className="flex-1 justify-start text-center">
                  <div className="mx-auto h-7 w-20 animate-pulse rounded bg-Gray-N100"></div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-end gap-2 self-stretch">
                <div className="justify-start text-center">
                  <div className="mx-auto mt-2 h-3 w-24 animate-pulse rounded bg-Gray-N100"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Flight info badges */}
          <div className="inline-flex flex-wrap content-start items-start justify-start gap-2 self-stretch">
            <div className="h-6 w-24 animate-pulse rounded-sm bg-Gray-N100"></div>
            <div className="h-6 w-32 animate-pulse rounded-sm bg-Gray-N100"></div>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="bg-Gray-N100 relative h-40 w-[1px]" />

        {/* Price and action section - Left */}
        <div className="-mx-3 inline-flex w-[290px] flex-col items-start justify-start gap-2 px-2 md:w-[300px]">
          <div className="flex flex-col items-center justify-center gap-3 self-stretch">
            <div className="bg-Gray-N50 outline-Gray-N200 relative flex flex-col items-end justify-center gap-3 self-stretch rounded-lg px-3 py-2 outline-1 outline-offset-[-1px]">
              <div className="inline-flex items-center justify-between self-stretch">
                <div className="flex items-center justify-start gap-1">
                  <div className="outline-Gray-N200 size-6 overflow-hidden rounded-[48px] bg-Gray-N100 animate-pulse outline-1 outline-offset-[-1px]"></div>
                  <div className="h-5 w-16 animate-pulse rounded bg-Gray-N100"></div>
                </div>

                <div className="flex items-center justify-end gap-1">
                  <div className="h-6 w-20 animate-pulse rounded bg-Gray-N100"></div>
                  <div className="h-4 w-12 animate-pulse rounded bg-Gray-N100"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start justify-start gap-1 self-stretch">
              <div className="h-10 w-full animate-pulse rounded bg-Gray-N100"></div>
              <div className="h-8 w-full animate-pulse rounded bg-Gray-N100"></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
} 