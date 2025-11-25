"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  hideTelegramBackButton,
  isRunningInTelegram,
  onTelegramBackButtonClick,
  showTelegramBackButton,
} from "@/utils/telegram"

/**
 * Hook to handle Telegram back button integration with Next.js router
 *
 * - Shows the Telegram back button when running in a Telegram Mini App
 * - Wires the click event to Next.js router.back()
 * - Cleans up listeners and hides the button on unmount when configured
 */
export function useTelegramBackButton(options?: { showOnMount?: boolean; hideOnUnmount?: boolean }) {
  const router = useRouter()
  const showOnMount = options?.showOnMount !== false
  const hideOnUnmount = options?.hideOnUnmount !== false

  useEffect(() => {
    if (!isRunningInTelegram()) return

    if (showOnMount) {
      showTelegramBackButton()
    }

    const cleanup = onTelegramBackButtonClick(() => {
      router.back()
    })

    return () => {
      cleanup()
      if (hideOnUnmount) {
        hideTelegramBackButton()
      }
    }
  }, [router, showOnMount, hideOnUnmount])
}
