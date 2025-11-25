"use client"

import { useTelegramBackButton } from "@/hooks/useTelegramBackButton"

/**
 * Component that integrates Telegram back button with Next.js router
 */
const TelegramBackButton: React.FC = () => {
  useTelegramBackButton()
  return null
}

export default TelegramBackButton
