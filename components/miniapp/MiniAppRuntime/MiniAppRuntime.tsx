"use client"

import { useEffect, useState } from "react"

import BaleDynamicBackButton from "@/components/Bale/BaleDynamicBackButton/BaleDynamicBackButton"
import BaleDynamicInitializer from "@/components/Bale/BaleDynamicInitializer/BaleDynamicInitializer"
import BaleScriptLoader from "@/components/Bale/BaleScriptLoader/BaleScriptLoader"
import EitaaDynamicAutoAuth from "@/components/Eitaa/EitaaDynamicAutoAuth/EitaaDynamicAutoAuth"
import EitaaDynamicBackButton from "@/components/Eitaa/EitaaDynamicBackButton/EitaaDynamicBackButton"
import EitaaDynamicInitializer from "@/components/Eitaa/EitaaDynamicInitializer/EitaaDynamicInitializer"
import TelegramDynamicAutoAuth from "@/components/Telegram/TelegramDynamicAutoAuth/TelegramDynamicAutoAuth"
import TelegramDynamicBackButton from "@/components/Telegram/TelegramDynamicBackButton/TelegramDynamicBackButton"
import TelegramDynamicInitializer from "@/components/Telegram/TelegramDynamicInitializer/TelegramDynamicInitializer"
import { getMiniAppPlatform, isRunningInMiniApp, MiniAppPlatform } from "@/utils/miniapp"

/**
 * Mounts all mini-app only behaviors (SDKs, auto-auth, back buttons) once we
 * detect the runtime is actually inside a supported mini app container.
 */
const MiniAppRuntime = () => {
  const [platform, setPlatform] = useState<MiniAppPlatform | null>(null)

  useEffect(() => {
    if (!isRunningInMiniApp()) return
    setPlatform(getMiniAppPlatform())
  }, [])

  if (!platform) return null

  if (platform === "bale") {
    return (
      <>
        <BaleScriptLoader />
        <BaleDynamicInitializer />
        <BaleDynamicBackButton />
      </>
    )
  }

  if (platform === "eitaa") {
    return (
      <>
        <EitaaDynamicInitializer />
        <EitaaDynamicAutoAuth />
        <EitaaDynamicBackButton />
      </>
    )
  }

  if (platform === "telegram") {
    return (
      <>
        <TelegramDynamicInitializer />
        <TelegramDynamicAutoAuth />
        <TelegramDynamicBackButton />
      </>
    )
  }

  return null
}

export default MiniAppRuntime
