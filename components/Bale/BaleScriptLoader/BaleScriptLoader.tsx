"use client"

import Script from "next/script"
import { useEffect, useState } from "react"
import { isRunningInBale } from "@/utils/bale"

/**
 * Loads the Bale mini app SDK only when running inside the Bale environment.
 * Prevents SDK noise (e.g., invoice warnings) on the regular web.
 */
const BaleScriptLoader = () => {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    setShouldLoad(isRunningInBale())
  }, [])

  if (!shouldLoad) return null

  return <Script src="https://tapi.bale.ai/miniapp.js?3" strategy="afterInteractive" />
}

export default BaleScriptLoader
