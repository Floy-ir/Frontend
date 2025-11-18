"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { isRunningInEitaa, onEitaaBackButtonClick, showEitaaBackButton, hideEitaaBackButton } from "@/utils/eitaa"

/**
 * Hook to handle Eitaa back button integration with Next.js router
 * 
 * This hook:
 * - Shows the back button when running in Eitaa
 * - Sets up a click handler that uses Next.js router to navigate back
 * - Automatically cleans up the event listener on unmount
 * 
 * @param options Configuration options
 * @param options.showOnMount Whether to show the back button on mount (default: true)
 * @param options.hideOnUnmount Whether to hide the back button on unmount (default: true)
 */
export function useEitaaBackButton(options?: {
  showOnMount?: boolean
  hideOnUnmount?: boolean
}) {
  const router = useRouter()
  const showOnMount = options?.showOnMount !== false // default true
  const hideOnUnmount = options?.hideOnUnmount !== false // default true

  useEffect(() => {
    // Only run if we're in Eitaa
    if (!isRunningInEitaa()) {
      return
    }

    // Show the back button on mount if enabled
    if (showOnMount) {
      showEitaaBackButton()
    }

    // Set up the back button click handler
    const cleanup = onEitaaBackButtonClick(() => {
      // Use Next.js router to navigate back
      router.back()
    })

    // Cleanup on unmount
    return () => {
      cleanup()
      if (hideOnUnmount) {
        hideEitaaBackButton()
      }
    }
  }, [router, showOnMount, hideOnUnmount])
}

