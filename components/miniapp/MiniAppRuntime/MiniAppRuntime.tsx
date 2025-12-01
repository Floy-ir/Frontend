"use client"

import { useEffect, useState } from "react"

import BaleDynamicBackButton from "@/components/Bale/BaleDynamicBackButton/BaleDynamicBackButton"
import BaleDynamicInitializer from "@/components/Bale/BaleDynamicInitializer/BaleDynamicInitializer"
import EitaaDynamicAutoAuth from "@/components/Eitaa/EitaaDynamicAutoAuth/EitaaDynamicAutoAuth"
import EitaaDynamicBackButton from "@/components/Eitaa/EitaaDynamicBackButton/EitaaDynamicBackButton"
import EitaaDynamicInitializer from "@/components/Eitaa/EitaaDynamicInitializer/EitaaDynamicInitializer"
import TelegramDynamicAutoAuth from "@/components/Telegram/TelegramDynamicAutoAuth/TelegramDynamicAutoAuth"
import TelegramDynamicBackButton from "@/components/Telegram/TelegramDynamicBackButton/TelegramDynamicBackButton"
import TelegramDynamicInitializer from "@/components/Telegram/TelegramDynamicInitializer/TelegramDynamicInitializer"
import TelegramScriptLoader from "@/components/Telegram/TelegramScriptLoader/TelegramScriptLoader"
import { getMiniAppPlatform, MINIAPP_SDK_READY_EVENT, MiniAppPlatform } from "@/utils/miniapp"

/**
 * Mounts all mini-app only behaviors (SDKs, auto-auth, back buttons) once we
 * detect the runtime is actually inside a supported mini app container.
 */
const MiniAppRuntime = () => {
  const [platform, setPlatform] = useState<MiniAppPlatform | null>(null)

  useEffect(() => {
    const detectPlatform = () => {
      const detected = getMiniAppPlatform()
      if (detected) {
        setPlatform(detected)
        return true
      }
      return false
    }

    if (detectPlatform()) return

    const onSDKReady = () => {
      detectPlatform()
    }

    window.addEventListener(MINIAPP_SDK_READY_EVENT, onSDKReady)
    const interval = window.setInterval(() => {
      if (detectPlatform()) {
        window.clearInterval(interval)
        window.removeEventListener(MINIAPP_SDK_READY_EVENT, onSDKReady)
      }
    }, 300)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener(MINIAPP_SDK_READY_EVENT, onSDKReady)
    }
  }, [])

  return (
    <>
      <TelegramScriptLoader />

      {platform === "bale" && (
        <>
          <BaleDynamicInitializer />
          <BaleDynamicBackButton />
        </>
      )}

      {platform === "eitaa" && (
        <>
          <EitaaDynamicInitializer />
          <EitaaDynamicAutoAuth />
          <EitaaDynamicBackButton />
        </>
      )}

      {platform === "telegram" && (
        <>
          <TelegramDynamicInitializer />
          <TelegramDynamicAutoAuth />
          <TelegramDynamicBackButton />
        </>
      )}
    </>
  )
}

export default MiniAppRuntime
