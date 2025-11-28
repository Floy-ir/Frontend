"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/services/api"
import { getBaleUserFirstName, getStableBaleId } from "@/utils/bale"
import {
  clearStoredAuthPlatform,
  extractFirstName,
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

    const persistFirstName = (name?: string) => {
      const firstName = extractFirstName(name)
      if (!firstName) return
      try {
        sessionStorage.setItem("full_name", firstName)
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

            const fallbackFirstName = getBaleUserFirstName() ?? ""
            const firstName =
              extractFirstName(res?.user?.full_name) ??
              extractFirstName(fallbackFirstName) ??
              extractFirstName(sessionStorage.getItem("full_name")) ??
              ""
            persistFirstName(firstName)
          }
        } catch {
          // If backend call fails, persist minimal local info so header shows a greeting
          try {
            const firstName = getBaleUserFirstName() ?? ""

            persistFirstName(firstName)

            const userObj: AuthUser = {
              mobile: "",
              full_name: extractFirstName(firstName),
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
