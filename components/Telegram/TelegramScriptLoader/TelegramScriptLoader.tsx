"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

const TELEGRAM_SDK_SRC = "https://telegram.org/js/telegram-web-app.js"

const isTelegramMiniAppEnvironment = (): boolean => {
  if (typeof window === "undefined") return false

  const hashParams = new URLSearchParams(window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "")
  const hasTelegramHashParams =
    hashParams.has("tgWebAppData") || hashParams.has("tgWebAppPlatform") || hashParams.has("tgWebAppVersion")

  const userAgent = window.navigator?.userAgent ?? ""
  const hasTelegramUA = /Telegram/i.test(userAgent)
  const hasWebviewBridge =
    typeof (window as unknown as { TelegramWebviewProxy?: unknown }).TelegramWebviewProxy !== "undefined"
  const hasTelegramGlobal = typeof window.Telegram?.WebApp !== "undefined"

  return hasTelegramHashParams || hasTelegramUA || hasWebviewBridge || hasTelegramGlobal
}

const TelegramScriptLoader = () => {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    setShouldLoad(isTelegramMiniAppEnvironment())
  }, [])

  if (!shouldLoad) return null

  return <Script src={TELEGRAM_SDK_SRC} strategy="beforeInteractive" />
}

export default TelegramScriptLoader
