/**
 * Utility functions for Eitaa Mini App integration
 */

// Type definition for the Eitaa WebApp object
interface EitaaWebApp {
  ready: () => void
  expand: () => void
  openLink: (url: string, options?: Record<string, string | undefined> | undefined) => void
  openEitaaLink: (url: string) => void
  // Eitaa may provide these runtime fields when embedded in the mini-app
  initData?: string
  initDataUnsafe?: {
    user?: {
      id?: string | number
      first_name?: string
      last_name?: string
      phone?: string
    }
    [key: string]: unknown
  }
  // The requestContact callback shapes vary between Eitaa versions; keep it optional
  requestContact?: (callback: (granted: boolean, data?: unknown) => void) => void
}

// Type definition for the Eitaa global object
interface EitaaGlobal {
  WebApp?: EitaaWebApp
}

// Global Eitaa object
declare global {
  interface Window {
    Eitaa?: EitaaGlobal
  }
}

/**
 * Check if the app is running inside Eitaa
 * This checks for actual initData or user data, not just the presence of the WebApp object,
 * to avoid false positives when the Eitaa script is loaded but not in mini app context.
 */
const getBrowserWindow = (): (Window & typeof globalThis) | undefined => {
  return typeof window === "undefined" ? undefined : window
}

export const isRunningInEitaa = (): boolean => {
  const browserWindow = getBrowserWindow()
  return !!browserWindow?.Eitaa?.WebApp?.initData
}
/**
 * Notes on Eitaa auth helpers in this file:
 *
 * - `getStableEitaaId` and `getRawInitData` read information that Eitaa
 *   injects into the WebApp object. `initDataUnsafe.user` usually contains
 *   a basic user object (id, first_name, etc). We use these helpers only
 *   on the client at runtime (they are unsafe to call on the server).
 *
 * - `askContactAndStore` wraps the Eitaa `requestContact` API which prompts
 *   the user to share a contact. The returned payloads vary between Eitaa
 *   versions so `extractPhoneFromContact` attempts several common shapes.
 *
 * - The application uses these helpers to implement a best-effort Eitaa
 *   login UX: we try to obtain the user's name from `initDataUnsafe` and
 *   (optionally) request their contact to prefill phone and start the OTP
 *   flow. That logic lives in `components/Eitaa/EitaaAutoAuth` and is
 *   intentionally client-only.
 */

// Additional helpers for Eitaa auth flows
export const getStableEitaaId = (): string | null => {
  const browserWindow = getBrowserWindow()
  const id = browserWindow?.Eitaa?.WebApp?.initDataUnsafe?.user?.id
  return id != null ? String(id) : null
}

export const getRawInitData = (): string | null => {
  const browserWindow = getBrowserWindow()
  return browserWindow?.Eitaa?.WebApp?.initData ?? null
}
export const extractPhoneFromContact = (contactData: unknown): string | undefined => {
  const getPhoneFromObject = (obj: unknown): string | undefined => {
    if (!obj || typeof obj !== "object") return undefined
    const asAny = obj as Record<string, unknown>
    // Common shapes used by different Eitaa versions
    const candidates = [
      // nested under responseUnsafe.contact.phone
      (asAny.responseUnsafe as Record<string, unknown> | undefined)?.contact as Record<string, unknown> | undefined,
      asAny.contact as Record<string, unknown> | undefined,
      asAny,
    ]

    for (const c of candidates) {
      if (!c) continue
      const phone = c.phone
      if (typeof phone === "string" && phone.trim().length > 0) return phone
    }

    return undefined
  }

  try {
    if (!contactData) return undefined

    if (typeof contactData === "string") {
      // If it's a JSON string, try to parse and extract
      try {
        const parsed: unknown = JSON.parse(contactData)
        const fromObj = getPhoneFromObject(parsed)
        if (fromObj) return fromObj
      } catch {
        // Not JSON, check if it's a bare phone number
        if (/^\+?\d{8,15}$/.test(contactData)) return contactData
      }
    }

    return getPhoneFromObject(contactData)
  } catch {
    return undefined
  }
}

export const askContactAndStore = async (_eitaaId: string): Promise<string | undefined> => {
  const browserWindow = getBrowserWindow()
  const webApp = browserWindow?.Eitaa?.WebApp
  if (!webApp?.requestContact) return undefined

  return await new Promise<string | undefined>((resolve) => {
    try {
      if (webApp.requestContact) {
        webApp.requestContact((granted, data: unknown) => {
          if (!granted) return resolve(undefined)
          const phone = extractPhoneFromContact(data)
          resolve(phone)
        })
      }
    } catch {
      resolve(undefined)
    }
  })
}

/**
 * Notify Eitaa that the app is ready to be displayed
 */
export const notifyEitaaReady = (): void => {
  const browserWindow = getBrowserWindow()
  if (browserWindow && isRunningInEitaa()) {
    browserWindow.Eitaa?.WebApp?.ready()
  }
}

/**
 * Expand the mini app to maximum available height
 */
export const expandEitaaApp = (): void => {
  const browserWindow = getBrowserWindow()
  if (browserWindow && isRunningInEitaa()) {
    browserWindow.Eitaa?.WebApp?.expand()
  }
}

/**
 * Open a link in an external browser
 * @param url URL to open
 * @param options Additional options
 */
export const openExternalLink = (
  url: string,
  options?: {
    target?: string
    rel?: string
    [key: string]: string | undefined
  }
): void => {
  const browserWindow = getBrowserWindow()
  if (browserWindow && isRunningInEitaa()) {
    browserWindow.Eitaa?.WebApp?.openLink(url, options)
  } else {
    // Fallback for when not running in Eitaa
    browserWindow?.open(url, "_blank")
  }
}

/**
 * Open an Eitaa link within the Eitaa app
 * @param url Eitaa URL to open
 */
export const openEitaaLink = (url: string): void => {
  const browserWindow = getBrowserWindow()
  if (browserWindow && isRunningInEitaa()) {
    browserWindow.Eitaa?.WebApp?.openEitaaLink(url)
  } else {
    // Fallback for when not running in Eitaa
    browserWindow?.open(url, "_blank")
  }
}
