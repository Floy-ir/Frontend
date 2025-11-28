"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/services/api"
import { askContactAndStore, getStableEitaaId } from "@/utils/eitaa"
import {
  clearStoredAuthPlatform,
  extractFirstName,
  getMiniAppPlatform,
  hasMismatchedPlatformToken,
  setStoredAuthPlatform,
} from "@/utils/miniapp"

function formatMobile(raw: string) {
  if (!raw) return raw
  if (raw.startsWith("+")) return raw
  if (raw.startsWith("09")) return "+98" + raw.slice(1)
  if (raw.startsWith("98")) return "+" + raw
  return raw
}

/**
 * Component that runs in Eitaa mini app and attempts to kick off
 * a login/signup flow using the user's contact (phone) if available.
 *
 * Behavior:
 * - If user already has auth_token in localStorage, do nothing.
 * - If running in Eitaa and no auth_token: try to obtain phone via
 *   askContactAndStore and trigger send-otp and open the auth modal by
 *   dispatching a custom 'open-auth-modal' event with payload.
 */
type AuthUser = {
  mobile: string
  full_name?: string
  request_id?: string
}

const EitaaAutoAuth: React.FC = () => {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (started) return
    setStarted(true)
    const platform = getMiniAppPlatform()
    if (platform !== "eitaa") return
    // don't override existing logged-in user
    try {
      const existing = localStorage.getItem("auth_token")
      const mismatchedToken = hasMismatchedPlatformToken("eitaa")
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
        const eitaaId = getStableEitaaId()
        // Prefer server-side Eitaa auth: many backends expose an endpoint that
        // accepts Eitaa's initData and returns a session token. We'll send the
        // raw initData and the stable eitaa id to the backend and expect a
        // response { token, user } on success. Replace the endpoint below
        // with your actual backend route if different.
        const rawInitData = (window as any)?.Eitaa?.WebApp?.initData ?? null

        // Try to get a phone number: first check if we already have it stored
        // let phone: string | undefined
        // try {
        //   const storedUser = localStorage.getItem("auth_user")
        //   if (storedUser) {
        //     const parsed = JSON.parse(storedUser) as AuthUser
        //     if (parsed.mobile && parsed.mobile.trim().length > 0) {
        //       phone = parsed.mobile
        //     }
        //   }
        // } catch { }

        // // If not stored, try to get from initData
        // if (!phone) {
        //   try {
        //     const initUser = (window as any)?.Eitaa?.WebApp?.initDataUnsafe?.user
        //     if (initUser && initUser.phone) phone = String(initUser.phone)
        //   } catch { }
        // }

        // // Only request contact if we don't have phone number from any source
        // // This prevents asking for contact on every mini app open
        // if (!phone) {
        //   try {
        //     const picked = await askContactAndStore(eitaaId ?? "")
        //     if (picked) phone = picked
        //   } catch {
        //     /* ignore */
        //   }
        // }

        try {
          if (eitaaId) {
            const res = await apiFetch<{ token?: string; user?: AuthUser; request_id?: string }>("/accounts/eitaa/", {
              method: "POST",
              data: { eita_id: eitaaId },
            })

            if (res?.token) {
              try {
                localStorage.setItem("auth_token", res.token)
                setStoredAuthPlatform("eitaa")
                try {
                  window.dispatchEvent(new Event("auth-changed"))
                } catch {}
              } catch {}
            }

            const initUser = (window as any)?.Eitaa?.WebApp?.initDataUnsafe?.user
            const fallbackFirstName = (initUser && initUser.first_name) || ""
            // const sanitizedPhone = phone ? formatMobile(phone.replace(/[^0-9+]/g, "")) : ""

            // Store full_name in session storage
            const firstName = extractFirstName(res?.user?.full_name) ?? extractFirstName(fallbackFirstName) ?? ""
            persistFirstName(firstName)

            // const mergedUser: AuthUser = {
            //   mobile:
            //     (res?.user?.mobile && typeof res.user.mobile === "string" ? res.user.mobile : sanitizedPhone) || "",
            //   full_name:
            //     (res?.user?.full_name && typeof res.user.full_name === "string"
            //       ? res.user.full_name
            //       : fallbackFullName) || undefined,
            //   request_id: res?.request_id,
            // }
            // try {
            //   localStorage.setItem("auth_user", JSON.stringify(mergedUser))
            //   try {
            //     window.dispatchEvent(new Event("auth-changed"))
            //   } catch { }
            // } catch { }
          }
        } catch {
          // If backend call fails, persist minimal local info so header shows a greeting
          try {
            const initUser = (window as any)?.Eitaa?.WebApp?.initDataUnsafe?.user
            const firstName = (initUser && initUser.first_name) || ""

            // Store full_name in session storage
            persistFirstName(firstName)

            const sanitizedPhone = "" // phone variable is commented out above
            const userObj: AuthUser = {
              mobile: sanitizedPhone || "",
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

export default EitaaAutoAuth
