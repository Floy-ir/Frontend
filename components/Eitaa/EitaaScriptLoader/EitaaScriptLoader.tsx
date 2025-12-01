"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

const EITAA_SDK_SRC = "https://developer.eitaa.com/eitaa-web-app.js"

const isEitaaMiniAppEnvironment = (): boolean => {
  if (typeof window === "undefined") return false

  const hashParams = new URLSearchParams(window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "")
  const searchParams = new URLSearchParams(window.location.search)
  const hasInitData = hashParams.has("initData") || searchParams.has("initData")

  const userAgent = window.navigator?.userAgent ?? ""
  const hasEitaaUA = /Eitaa/i.test(userAgent)
  const hasEitaaGlobal = typeof window.Eitaa?.WebApp !== "undefined"
  const fromEitaaReferrer = (document.referrer || "").includes("eitaa")

  return hasInitData || hasEitaaUA || hasEitaaGlobal || fromEitaaReferrer
}

const EitaaScriptLoader = () => {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    setShouldLoad(isEitaaMiniAppEnvironment())
  }, [])

  if (!shouldLoad) return null

  return <Script src={EITAA_SDK_SRC} strategy="beforeInteractive" />
}

export default EitaaScriptLoader
