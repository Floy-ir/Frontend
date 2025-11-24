"use client"

import { useEffect } from "react"
import { expandTelegramApp, isRunningInTelegram, notifyTelegramReady } from "@/utils/telegram"

interface TelegramInitializerProps {
  autoReady?: boolean
  autoExpand?: boolean
}

/**
 * Component to initialize the Telegram mini app and signal readiness
 */
const TelegramInitializer: React.FC<TelegramInitializerProps> = ({ autoReady = true, autoExpand = true }) => {
  useEffect(() => {
    if (!isRunningInTelegram()) return

    if (autoReady) {
      notifyTelegramReady()
    }

    if (autoExpand) {
      expandTelegramApp()
    }
  }, [autoReady, autoExpand])

  return null
}

export default TelegramInitializer
