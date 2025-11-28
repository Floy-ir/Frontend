"use client"

import { useEffect } from "react"
import { isRunningInBale } from "@/utils/bale"
import { isRunningInEitaa } from "@/utils/eitaa"

const detectTrafficSource = (): "web" | "bale" | "eitaa" => {
  if (isRunningInBale()) return "bale"
  if (isRunningInEitaa()) return "eitaa"
  return "web"
}

export function ClarityAnalytics() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

    if (!projectId) return

    const run = () => {
      import("@microsoft/clarity")
        .then(({ default: clarity }) => {
          clarity.init(projectId)

          const trafficSource = detectTrafficSource()
          clarity.setTag("traffic_source", trafficSource)
          clarity.event(`traffic_source_detected_${trafficSource}`)
        })
        .catch((error) => {
          if (process.env.NODE_ENV !== "production") {
            console.error("Failed to initialize Microsoft Clarity", error)
          }
        })
    }

    if (typeof window === "undefined") return

    const idle = (window as typeof window & { requestIdleCallback?: typeof requestIdleCallback }).requestIdleCallback
    if (idle) {
      idle(run, { timeout: 1500 })
    } else {
      setTimeout(run, 500)
    }
  }, [])

  return null
}
