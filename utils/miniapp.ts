import { getBaleUserFirstName, isRunningInBale, openExternalLink as openBaleExternalLink } from "./bale"
import { getEitaaUserFirstName, isRunningInEitaa, openExternalLink as openEitaaExternalLink } from "./eitaa"
import { getTelegramUserFirstName, isRunningInTelegram, openExternalLink as openTelegramExternalLink } from "./telegram"

type LinkOptions = {
  target?: string
  rel?: string
  [key: string]: string | undefined
}

export type MiniAppPlatform = "eitaa" | "bale" | "telegram"

const AUTH_PLATFORM_KEY = "auth_platform"

export const getMiniAppPlatform = (): MiniAppPlatform | null => {
  if (isRunningInEitaa()) return "eitaa"
  if (isRunningInBale()) return "bale"
  if (isRunningInTelegram()) return "telegram"
  return null
}

export const isRunningInMiniApp = (): boolean => Boolean(getMiniAppPlatform())

export const openMiniAppExternalLink = (url: string, options?: LinkOptions): void => {
  if (isRunningInTelegram()) {
    openTelegramExternalLink(url, options)
    return
  }

  if (isRunningInBale()) {
    openBaleExternalLink(url, options)
    return
  }

  if (isRunningInEitaa()) {
    openEitaaExternalLink(url, options)
    return
  }

  if (typeof window !== "undefined") {
    window.open(url, options?.target ?? "_blank")
  }
}

export const getMiniAppFirstName = (): string | undefined => {
  return getEitaaUserFirstName() ?? getBaleUserFirstName() ?? getTelegramUserFirstName()
}

export const getStoredAuthPlatform = (): MiniAppPlatform | "web" | null => {
  try {
    const value = localStorage.getItem(AUTH_PLATFORM_KEY)
    if (value === "eitaa" || value === "bale" || value === "telegram" || value === "web") return value
    return null
  } catch {
    return null
  }
}

export const setStoredAuthPlatform = (platform: MiniAppPlatform | "web"): void => {
  try {
    localStorage.setItem(AUTH_PLATFORM_KEY, platform)
  } catch {
    /* ignore */
  }
}

export const clearStoredAuthPlatform = (): void => {
  try {
    localStorage.removeItem(AUTH_PLATFORM_KEY)
  } catch {
    /* ignore */
  }
}

export const getPlatformBoundAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  try {
    const token = localStorage.getItem("auth_token")
    if (!token) return null

    const platform = getMiniAppPlatform()
    if (!platform) return token

    const storedPlatform = getStoredAuthPlatform()
    if (!storedPlatform) return null

    return storedPlatform === platform ? token : null
  } catch {
    return null
  }
}

export const hasMismatchedPlatformToken = (platform: MiniAppPlatform): boolean => {
  if (typeof window === "undefined") return false
  try {
    const token = localStorage.getItem("auth_token")
    if (!token) return false
    const storedPlatform = getStoredAuthPlatform()
    if (!storedPlatform) return true
    return storedPlatform !== platform
  } catch {
    return false
  }
}
