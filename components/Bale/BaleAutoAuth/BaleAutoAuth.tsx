"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/services/api"
import { getBaleUserFirstName, getStableBaleId } from "@/utils/bale"
import {
  clearStoredAuthPlatform,
  getMiniAppPlatform,
  hasMismatchedPlatformToken,
  setStoredAuthPlatform,
} from "@/utils/miniapp"

/**
 * Component that runs in Bale mini app and attempts to kick off
 * a login/signup flow using the user's Bale id if available.
 *
 * Behavior:
 * - If user already has auth_token in localStorage, do nothing.
 * - If running in Bale and no auth_token: call backend Bale auth endpoint
 *   and persist token/full_name when present.
 */
type AuthUser = {
  mobile: string
  full_name?: string
  request_id?: string
}

const BaleAutoAuth: React.FC = () => {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (started) return
    setStarted(true)
    const platform = getMiniAppPlatform()
    if (platform !== "bale") return

    // don't override existing logged-in user
    try {
      const existing = localStorage.getItem("auth_token")
      const mismatchedToken = hasMismatchedPlatformToken("bale")
      if (existing) {
        if (!mismatchedToken) return
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        clearStoredAuthPlatform()
      }
    } catch {}

    const persistFullName = (name?: string) => {
      if (!name) return
      try {
        sessionStorage.setItem("full_name", name)
      } catch {}
    }

    const run = async () => {
      try {
        const baleId = getStableBaleId()

        try {
          if (baleId) {
            const res = await apiFetch<{ token?: string; user?: AuthUser; request_id?: string }>("/accounts/bale/", {
              method: "POST",
              data: { bale_id: baleId },
            })

            if (res?.token) {
              try {
                localStorage.setItem("auth_token", res.token)
                setStoredAuthPlatform("bale")
                try {
                  window.dispatchEvent(new Event("auth-changed"))
                } catch {}
              } catch {}
            }

            const fallbackFullName = getBaleUserFirstName() ?? ""
            const fullName =
              (res?.user?.full_name && typeof res.user.full_name === "string"
                ? res.user.full_name
                : fallbackFullName) || ""
            persistFullName(fullName)
          }
        } catch {
          // If backend call fails, persist minimal local info so header shows a greeting
          try {
            const fullName = getBaleUserFirstName() ?? ""

            persistFullName(fullName)

            const userObj: AuthUser = {
              mobile: "",
              full_name: fullName,
            }
            localStorage.setItem("auth_user", JSON.stringify(userObj))
            try {
              window.dispatchEvent(new Event("auth-changed"))
            } catch {}
          } catch {}
        }
      } catch {
        // ignore
      }
    }

    run()
  }, [started])

  return null
}

export default BaleAutoAuth
