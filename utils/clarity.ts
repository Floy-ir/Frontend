"use client"

type ClarityClient = {
  (event: string, value?: unknown): void
  event?: (eventName: string, payload?: Record<string, unknown>) => void
  setTag?: (key: string, value: string | number | boolean | string[]) => void
}

const CLARITY_DEV_LOG_PREFIX = "[Clarity]"

const logClarityError = (message: string, error: unknown) => {
  if (process.env.NODE_ENV === "production") return
  console.error(`${CLARITY_DEV_LOG_PREFIX} ${message}`, error)
}

let clarityPromise: Promise<ClarityClient | null> | null = null

const isClarityReady = () => {
  if (typeof window === "undefined") return false
  return typeof (window as unknown as { clarity?: unknown }).clarity === "function"
}

const loadClarity = async (): Promise<ClarityClient | null> => {
  if (typeof window === "undefined") return null
  if (!clarityPromise) {
    clarityPromise = import("@microsoft/clarity")
      .then(({ default: clarity }) => (clarity as unknown as ClarityClient) ?? null)
      .catch((error) => {
        logClarityError("Failed to import Clarity", error)
        return null
      })
  }
  return clarityPromise
}

export const clarityTasks = {
  authModalOpen: "auth_modal_open",
  authModalClose: "auth_modal_close",
  authModalTabSwitch: "auth_modal_tab_switch",
  authModalLoginAttempt: "auth_modal_login_attempt",
  authModalLoginSuccess: "auth_modal_login_success",
  authModalLoginError: "auth_modal_login_error",
  authModalSignupAttempt: "auth_modal_signup_attempt",
  authModalOtpRequested: "auth_modal_otp_requested",
  authModalOtpVerified: "auth_modal_otp_verified",
  authModalOtpError: "auth_modal_otp_error",
  authModalOtpResent: "auth_modal_otp_resent",
  authModalSignupComplete: "auth_modal_signup_complete",
  authModalResetComplete: "auth_modal_reset_complete",
  eitaaAutoAuthStart: "eitaa_auto_auth_start",
  eitaaAutoAuthSuccess: "eitaa_auto_auth_success",
  eitaaAutoAuthFallback: "eitaa_auto_auth_fallback",
  eitaaAutoAuthError: "eitaa_auto_auth_error",
  miniAppPlatformPollingStarted: "miniapp_platform_polling_started",
  miniAppPlatformDetected: "miniapp_platform_detected",
  eitaaSdkLoadSuccess: "eitaa_sdk_load_success",
  eitaaSdkLoadError: "eitaa_sdk_load_error",
  flightsFilterUsed: "flights_filter_used",
  flightsFiltersCleared: "flights_filters_cleared",
  flightsSortChanged: "flights_sort_changed",
  flightsApiFailed: "flights_api_failed",
  redirectToSeller: "redirect_to_seller",
  jsError: "js_error",
  consoleWarning: "console_warning",
  pageLoadMetrics: "page_load_metrics",
  lcpObserved: "lcp_observed",
  lcpSlow: "lcp_slow",
  rageClick: "rage_click",
  quickBack: "quick_back",
  citySearchNotFound: "city_search_not_found",
} as const

export type ClarityTaskName = (typeof clarityTasks)[keyof typeof clarityTasks]

export const trackClarityEvent = async (eventName: ClarityTaskName | string, payload?: Record<string, unknown>) => {
  if (!eventName) return
  const clarity = await loadClarity()
  const clarityEvent = clarity?.event
  if (!clarityEvent) return

  const dispatch = (attempt: number) => {
    if (!isClarityReady()) {
      if (attempt >= 3) return
      const delay = 200 * (attempt + 1)
      setTimeout(() => dispatch(attempt + 1), delay)
      return
    }

    try {
      clarityEvent(eventName, payload)
    } catch (error) {
      logClarityError(`Failed to send event "${eventName}"`, error)
    }
  }

  dispatch(0)
}

export const setClarityTag = async (key: string, value: string | number | boolean | string[]) => {
  if (!key) return
  const clarity = await loadClarity()
  const claritySetTag = clarity?.setTag
  if (!claritySetTag) return

  const dispatch = (attempt: number) => {
    if (!isClarityReady()) {
      if (attempt >= 3) return
      const delay = 200 * (attempt + 1)
      setTimeout(() => dispatch(attempt + 1), delay)
      return
    }

    try {
      claritySetTag(key, value)
    } catch (error) {
      logClarityError(`Failed to set tag "${key}"`, error)
    }
  }

  dispatch(0)
}

// Track seller redirects in-session to surface top provider
const sellerRedirectCounts: Record<string, number> = {}

export const recordSellerRedirect = async (providerId: string, extra?: Record<string, unknown>) => {
  const normalizedProvider = providerId || "unknown"
  sellerRedirectCounts[normalizedProvider] = (sellerRedirectCounts[normalizedProvider] || 0) + 1

  // Calculate current top provider in-session
  let topProvider = normalizedProvider
  let topCount = 0
  for (const [provider, count] of Object.entries(sellerRedirectCounts)) {
    if (count > topCount) {
      topProvider = provider
      topCount = count
    }
  }

  await Promise.all([
    trackClarityEvent(clarityTasks.redirectToSeller, {
      provider: normalizedProvider,
      total_for_provider: sellerRedirectCounts[normalizedProvider],
      top_provider: topProvider,
      top_provider_count: topCount,
      ...extra,
    }),
    setClarityTag("top_redirect_provider", topProvider),
  ])
}
