/**
 * Utility functions for Bale Mini App integration
 */

export interface BaleBackButton {
  isVisible?: boolean
  onClick?: (callback: () => void) => void
  offClick?: (callback: () => void) => void
  show?: () => void
  hide?: () => void
}

interface BaleWebApp {
  ready?: () => void
  expand?: () => void
  close?: () => void
  openLink?: (url: string, options?: Record<string, string | undefined> | undefined) => void
  // Bale may provide runtime fields similar to Telegram/Eitaa
  initData?: string
  initDataUnsafe?: {
    user?: {
      id?: string | number
      first_name?: string
      last_name?: string
    }
    [key: string]: unknown
  }
  requestContact?: (callback: (granted: boolean, data?: unknown) => void) => void
  requestWriteAccess?: (callback: (granted: boolean) => void) => void
  onEvent?: (event: string, callback: () => void) => void
  offEvent?: (event: string, callback: () => void) => void
  BackButton?: BaleBackButton
}

interface BaleGlobal {
  WebApp?: BaleWebApp
}

declare global {
  interface Window {
    Bale?: BaleGlobal
  }
}

const getBrowserWindow = (): (Window & typeof globalThis) | undefined => {
  return typeof window === "undefined" ? undefined : window
}

export const isRunningInBale = (): boolean => {
  const browserWindow = getBrowserWindow()
  const webApp = browserWindow?.Bale?.WebApp
  return !!(webApp?.initData || webApp?.initDataUnsafe)
}

export const getStableBaleId = (): string | null => {
  const browserWindow = getBrowserWindow()
  const id = browserWindow?.Bale?.WebApp?.initDataUnsafe?.user?.id
  return id != null ? String(id) : null
}

export const getRawBaleInitData = (): string | null => {
  const browserWindow = getBrowserWindow()
  return browserWindow?.Bale?.WebApp?.initData ?? null
}

export const getBaleUserFirstName = (): string | undefined => {
  const browserWindow = getBrowserWindow()
  const name = browserWindow?.Bale?.WebApp?.initDataUnsafe?.user?.first_name
  return typeof name === "string" && name.trim().length > 0 ? name : undefined
}

export const notifyBaleReady = (): void => {
  const browserWindow = getBrowserWindow()
  if (browserWindow && isRunningInBale()) {
    browserWindow.Bale?.WebApp?.ready?.()
  }
}

export const expandBaleApp = (): void => {
  const browserWindow = getBrowserWindow()
  if (browserWindow && isRunningInBale()) {
    browserWindow.Bale?.WebApp?.expand?.()
  }
}

export const openExternalLink = (
  url: string,
  options?: {
    target?: string
    rel?: string
    [key: string]: string | undefined
  }
): void => {
  const browserWindow = getBrowserWindow()
  if (browserWindow && isRunningInBale()) {
    browserWindow.Bale?.WebApp?.openLink?.(url, options)
  } else {
    browserWindow?.open(url, options?.target ?? "_blank")
  }
}

export const getBaleBackButton = (): BaleBackButton | undefined => {
  const browserWindow = getBrowserWindow()
  return browserWindow?.Bale?.WebApp?.BackButton
}

export const showBaleBackButton = (): void => {
  const browserWindow = getBrowserWindow()
  if (browserWindow && isRunningInBale()) {
    const backButton = browserWindow.Bale?.WebApp?.BackButton
    backButton?.show?.()
  }
}

export const hideBaleBackButton = (): void => {
  const browserWindow = getBrowserWindow()
  if (browserWindow && isRunningInBale()) {
    const backButton = browserWindow.Bale?.WebApp?.BackButton
    backButton?.hide?.()
  }
}

export const onBaleBackButtonClick = (callback: () => void): (() => void) => {
  const browserWindow = getBrowserWindow()
  const webApp = browserWindow?.Bale?.WebApp

  if (!webApp || !isRunningInBale()) {
    return () => {}
  }

  // Prefer BackButton API if available
  const backButton = webApp.BackButton
  if (backButton?.onClick && backButton?.offClick) {
    backButton.onClick(callback)
    return () => {
      try {
        backButton.offClick?.(callback)
      } catch {
        /* ignore */
      }
    }
  }

  // Fallback to generic event hooks
  if (webApp.onEvent) {
    webApp.onEvent("backButtonPressed", callback)
    return () => {
      try {
        webApp.offEvent?.("backButtonPressed", callback)
      } catch {
        /* ignore */
      }
    }
  }

  return () => {}
}
