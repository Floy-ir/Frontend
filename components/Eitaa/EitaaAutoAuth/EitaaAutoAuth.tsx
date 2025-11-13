"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/services/api"
import { askContactAndStore, getStableEitaaId, isRunningInEitaa } from "@/utils/eitaa"

interface EitaaUser {
  phone?: string
  first_name?: string
  [key: string]: unknown
}

interface EitaaWebApp {
  initData: string | null
  initDataUnsafe?: {
    user?: EitaaUser
    [key: string]: unknown
  }
  ready: () => void
  expand: () => void
  openLink: (url: string) => void
  openEitaaLink: (url: string) => void
  [key: string]: unknown
}

interface EitaaGlobal {
  WebApp: EitaaWebApp
  [key: string]: unknown
}

interface EitaaWindow extends Window {
  Eitaa?: EitaaGlobal
}

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
const EitaaAutoAuth: React.FC = () => {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (started) return
    setStarted(true)
    if (!isRunningInEitaa()) return
    // don't override existing logged-in user
    try {
      const existing = localStorage.getItem("auth_token")
      if (existing) return
    } catch { }

    const run = async () => {
      try {
        const eitaaId: string | null = getStableEitaaId()
        // Prefer server-side Eitaa auth: many backends expose an endpoint that
        // accepts Eitaa's initData and returns a session token. We'll send the
        // raw initData and the stable eitaa id to the backend and expect a
        // response { token, user } on success. Replace the endpoint below
        // with your actual backend route if different.
        const win = window as EitaaWindow
        const rawInitData = win.Eitaa?.WebApp?.initData ?? null

        // Try to get a phone number: prefer contact picker if initData lacks it
        let phone: string | undefined
        // Some Eitaa implementations include phone in initDataUnsafe.start_param or user - try common locations
        try {
          const initUser = win.Eitaa?.WebApp?.initDataUnsafe?.user
          if (initUser && initUser.phone) phone = String(initUser.phone)
        } catch { }

        if (!phone) {
          try {
            const picked = await askContactAndStore(eitaaId ?? "")
            if (picked) phone = picked
          } catch {
            /* ignore */
          }
        }

        // Build payload for backend Eitaa auth exchange
        const payload: { eitaa_id: string | null; init_data: unknown; phone?: string } = { eitaa_id: eitaaId, init_data: rawInitData }
        if (phone) payload.phone = formatMobile(phone.replace(/[^0-9+]/g, ""))

        try {
          // NOTE: ensure your backend exposes an endpoint like /accounts/eitaa-auth/
          // that validates init_data and issues a token. If your backend uses a
          // different path, update the string below.
          const res = await apiFetch<{ token?: string; user?: Record<string, unknown> }>("/accounts/eitaa-auth/", {
            method: "POST",
            data: payload,
          })

          if (res?.token) {
            try {
              localStorage.setItem("auth_token", res.token)
              if (res.user) localStorage.setItem("auth_user", JSON.stringify(res.user))
              try {
                window.dispatchEvent(new Event("auth-changed"))
              } catch { }
            } catch { }
            // successful server-side session created; nothing more to do
            return
          }

          // If backend did not return a token, fall back to persisting a
          // lightweight local `auth_user` so UI can greet the user.
          try {
            const initUser = win.Eitaa?.WebApp?.initDataUnsafe?.user
            const userObj = { mobile: payload.phone || "", full_name: (initUser && initUser.first_name) || "" }
            localStorage.setItem("auth_user", JSON.stringify(userObj))
            try {
              window.dispatchEvent(new Event("auth-changed"))
            } catch { }
          } catch { }
        } catch {
          // If backend call fails, persist minimal local info so header shows a greeting
          try {
            const initUser = win.Eitaa?.WebApp?.initDataUnsafe?.user
            const userObj = { mobile: payload.phone || "", full_name: (initUser && initUser.first_name) || "" }
            localStorage.setItem("auth_user", JSON.stringify(userObj))
            try {
              window.dispatchEvent(new Event("auth-changed"))
            } catch { }
          } catch { }
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
