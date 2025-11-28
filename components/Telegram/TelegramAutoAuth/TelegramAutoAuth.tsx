"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/services/api"
import {
  clearStoredAuthPlatform,
  extractFirstName,
  getMiniAppPlatform,
  hasMismatchedPlatformToken,
  setStoredAuthPlatform,
} from "@/utils/miniapp"
import { getRawTelegramInitData, getStableTelegramId, getTelegramUserFirstName } from "@/utils/telegram"

/**
 * Component that attempts automatic auth when running inside Telegram Mini App.
 *
 * Behavior:
 * - No-op if already authenticated (auth_token present).
 * - If in Telegram and no auth_token, calls backend with telegram id (and initData) to fetch a token/user.
 * - Falls back to storing the Telegram first_name locally for a friendly greeting.
 */
type AuthUser = {
  mobile: string
  full_name?: string
  request_id?: string
}

const TelegramAutoAuth: React.FC = () => {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (started) return
    setStarted(true)
    const platform = getMiniAppPlatform()
    if (platform !== "telegram") return

    try {
      const existing = localStorage.getItem("auth_token")
      const mismatchedToken = hasMismatchedPlatformToken("telegram")
      if (existing) {
        if (!mismatchedToken) return
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        clearStoredAuthPlatform()
      }
    } catch {}

    const persistFirstName = (name?: string) => {
      const firstName = extractFirstName(name)
      if (!firstName) return
      try {
        sessionStorage.setItem("full_name", firstName)
      } catch {}
    }

    const run = async () => {
      try {
        const telegramId = getStableTelegramId()
        const rawInitData = getRawTelegramInitData()

        if (telegramId) {
          const res = await apiFetch<{ token?: string; user?: AuthUser; request_id?: string }>("/accounts/telegram/", {
            method: "POST",
            data: { telegram_id: telegramId, init_data: rawInitData },
          })

          if (res?.token) {
            try {
              localStorage.setItem("auth_token", res.token)
              setStoredAuthPlatform("telegram")
              try {
                window.dispatchEvent(new Event("auth-changed"))
              } catch {}
            } catch {}
          }

          const fallbackFirstName = getTelegramUserFirstName() ?? ""
          const firstName = extractFirstName(res?.user?.full_name) ?? extractFirstName(fallbackFirstName) ?? ""
          persistFirstName(firstName)
        }
      } catch {
        try {
          const firstName = getTelegramUserFirstName() ?? ""
          persistFirstName(firstName)

          const userObj: AuthUser = {
            mobile: "",
            full_name: extractFirstName(firstName),
          }
          localStorage.setItem("auth_user", JSON.stringify(userObj))
          try {
            window.dispatchEvent(new Event("auth-changed"))
          } catch {}
        } catch {
          /* ignore */
        }
      }
    }

    run()
  }, [started])

  return null
}

export default TelegramAutoAuth
