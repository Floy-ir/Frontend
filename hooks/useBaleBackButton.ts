"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { hideBaleBackButton, isRunningInBale, onBaleBackButtonClick, showBaleBackButton } from "@/utils/bale"

/**
 * Hook to handle Bale back button integration with Next.js router
 *
 * - Shows the Bale back button when running in Bale mini app
 * - Sets up a click handler that uses Next.js router to navigate back
 * - Cleans up listeners and hides the button on unmount when configured
 */
export function useBaleBackButton(options?: { showOnMount?: boolean; hideOnUnmount?: boolean }) {
  const router = useRouter()
  const showOnMount = options?.showOnMount !== false
  const hideOnUnmount = options?.hideOnUnmount !== false

  useEffect(() => {
    if (!isRunningInBale()) return

    if (showOnMount) {
      showBaleBackButton()
    }

    const cleanup = onBaleBackButtonClick(() => {
      router.back()
    })

    return () => {
      cleanup()
      if (hideOnUnmount) {
        hideBaleBackButton()
      }
    }
  }, [router, showOnMount, hideOnUnmount])
}
