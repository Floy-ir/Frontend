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

  const isProbablyBaleEnvironment = () => {
    if (typeof window === "undefined") return false
    if (isRunningInBale()) return true

    const hashParams = new URLSearchParams(window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "")
    const searchParams = new URLSearchParams(window.location.search)
    const userAgent = window.navigator?.userAgent ?? ""
    const fromBaleReferrer = (document.referrer || "").toLowerCase().includes("bale")

    const hasInitData = hashParams.has("initData") || searchParams.has("initData")
    const hasBaleUA = /Bale/i.test(userAgent)

    return hasInitData || hasBaleUA || fromBaleReferrer
  }

  useEffect(() => {
    setShouldLoad(isProbablyBaleEnvironment())
  }, [])

  if (!shouldLoad) return null

  return <Script src="https://tapi.bale.ai/miniapp.js?3" strategy="afterInteractive" />
}

export default BaleScriptLoader
