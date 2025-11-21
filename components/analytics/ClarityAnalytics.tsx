"use client"

import clarity from "@microsoft/clarity"
import { useEffect } from "react"

export function ClarityAnalytics() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

    if (!projectId) return

    try {
      clarity.init(projectId)
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to initialize Microsoft Clarity", error)
      }
    }
  }, [])

  return null
}

