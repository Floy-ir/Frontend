"use client"

import { useEffect } from "react"
import { isRunningInBale, notifyBaleReady } from "@/utils/bale"

interface BaleInitializerProps {
  autoReady?: boolean
}

/**
 * Component to initialize the Bale mini app and signal readiness
 */
export const BaleInitializer: React.FC<BaleInitializerProps> = ({ autoReady = true }) => {
  useEffect(() => {
    if (autoReady && isRunningInBale()) {
      notifyBaleReady()
    }
  }, [autoReady])

  return null
}

export default BaleInitializer
