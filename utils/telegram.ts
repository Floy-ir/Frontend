/**
 * Utility functions for Telegram Mini App integration
 */

export interface TelegramBackButton {
  isVisible?: boolean
  onClick?: (callback: () => void) => void
  offClick?: (callback: () => void) => void
  show?: () => void
  hide?: () => void
}

interface TelegramWebApp {
  initData?: string
  initDataUnsafe?: {
    user?: {
      id?: string | number
      first_name?: string
      last_name?: string
      username?: string
      language_code?: string
      is_premium?: boolean
      allows_write_to_pm?: boolean
    }
    query_id?: string
    auth_date?: number
    hash?: string
    [key: string]: unknown
  }
  colorScheme?: string
  themeParams?: Record<string, unknown>
  ready?: () => void
  expand?: () => void
  close?: () => void
  openLink?: (url: string, options?: Record<string, string | undefined>) => void
  openTelegramLink?: (url: string) => void
  BackButton?: TelegramBackButton
}

interface TelegramGlobal {
  WebApp?: TelegramWebApp
}

declare global {
  interface Window {
    Telegram?: TelegramGlobal
  }
}

const getBrowserWindow = (): (Window & typeof globalThis) | undefined => {
  return typeof window === "undefined" ? undefined : window
}

/**
 * Checks whether the app is running inside Telegram Mini App.
 * We require initData or a user payload to avoid false positives when the SDK is loaded on the web.
 */
export const isRunningInTelegram = (): boolean => {
  const browserWindow = getBrowserWindow()
  const webApp = browserWindow?.Telegram?.WebApp
  const hasInitData = typeof webApp?.initData === "string" && webApp.initData.length > 0
  const hasUser = !!webApp?.initDataUnsafe?.user?.id
  return Boolean(webApp && (hasInitData || hasUser))
}

export const getStableTelegramId = (): string | null => {
  const browserWindow = getBrowserWindow()
  const id = browserWindow?.Telegram?.WebApp?.initDataUnsafe?.user?.id
  return id != null ? String(id) : null
}

export const getRawTelegramInitData = (): string | null => {
  const browserWindow = getBrowserWindow()
  return browserWindow?.Telegram?.WebApp?.initData ?? null
}

export const getTelegramUserFirstName = (): string | undefined => {
  const browserWindow = getBrowserWindow()
  const name = browserWindow?.Telegram?.WebApp?.initDataUnsafe?.user?.first_name
  return typeof name === "string" && name.trim().length > 0 ? name : undefined
}

export const notifyTelegramReady = (): void => {
  const browserWindow = getBrowserWindow()
  if (!browserWindow || !isRunningInTelegram()) return

  try {
    browserWindow.Telegram?.WebApp?.ready?.()
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to notify Telegram ready", error)
    }
  }
}

export const expandTelegramApp = (): void => {
  const browserWindow = getBrowserWindow()
  if (!browserWindow || !isRunningInTelegram()) return

  try {
    browserWindow.Telegram?.WebApp?.expand?.()
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to expand Telegram app", error)
    }
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
  if (browserWindow && isRunningInTelegram()) {
    try {
      browserWindow.Telegram?.WebApp?.openLink?.(url, options)
      return
    } catch {
      /* ignore */
    }
  }
  browserWindow?.open(url, options?.target ?? "_blank")
}

export const openTelegramLink = (url: string): void => {
  const browserWindow = getBrowserWindow()
  if (browserWindow && isRunningInTelegram()) {
    try {
      browserWindow.Telegram?.WebApp?.openTelegramLink?.(url)
      return
    } catch {
      /* ignore */
    }
  }
  browserWindow?.open(url, "_blank")
}

export const getTelegramBackButton = (): TelegramBackButton | undefined => {
  const browserWindow = getBrowserWindow()
  return browserWindow?.Telegram?.WebApp?.BackButton
}

export const showTelegramBackButton = (): void => {
  const browserWindow = getBrowserWindow()
  if (!browserWindow || !isRunningInTelegram()) return

  try {
    browserWindow.Telegram?.WebApp?.BackButton?.show?.()
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to show Telegram back button", error)
    }
  }
}

export const hideTelegramBackButton = (): void => {
  const browserWindow = getBrowserWindow()
  if (!browserWindow || !isRunningInTelegram()) return

  try {
    browserWindow.Telegram?.WebApp?.BackButton?.hide?.()
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to hide Telegram back button", error)
    }
  }
}

export const onTelegramBackButtonClick = (callback: () => void): (() => void) => {
  const browserWindow = getBrowserWindow()
  const backButton = browserWindow?.Telegram?.WebApp?.BackButton

  if (!backButton || !isRunningInTelegram()) {
    return () => {}
  }

  try {
    backButton.onClick?.(callback)
  } catch {
    /* ignore */
  }

  return () => {
    try {
      backButton.offClick?.(callback)
    } catch {
      /* ignore */
    }
  }
}
