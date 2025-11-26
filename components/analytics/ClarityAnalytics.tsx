"use client"

import clarity from "@microsoft/clarity"
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

    try {
      clarity.init(projectId)

      const trafficSource = detectTrafficSource()
      clarity.setTag("traffic_source", trafficSource)
      clarity.event(`traffic_source_detected_${trafficSource}`)
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to initialize Microsoft Clarity", error)
      }
    }
  }, [])

  return null
}
