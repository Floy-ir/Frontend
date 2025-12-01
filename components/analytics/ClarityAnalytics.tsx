"use client"

import { useEffect } from "react"
import { isRunningInBale } from "@/utils/bale"
import { clarityTasks, trackClarityEvent } from "@/utils/clarity"
import { isRunningInEitaa } from "@/utils/eitaa"

const detectTrafficSource = (): "web" | "bale" | "eitaa" => {
  if (isRunningInBale()) return "bale"
  if (isRunningInEitaa()) return "eitaa"
  return "web"
}

export function ClarityAnalytics() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

    if (!projectId) return

    const run = () => {
      import("@microsoft/clarity")
        .then(({ default: clarity }) => {
          clarity.init(projectId)

          const trafficSource = detectTrafficSource()
          clarity.setTag("traffic_source", trafficSource)
          clarity.event(`traffic_source_detected_${trafficSource}`)
        })
        .catch((error) => {
          if (process.env.NODE_ENV !== "production") {
            console.error("Failed to initialize Microsoft Clarity", error)
          }
        })
    }

    if (typeof window === "undefined") return

    const idle = (window as typeof window & { requestIdleCallback?: typeof requestIdleCallback }).requestIdleCallback
    if (idle) {
      idle(run, { timeout: 1500 })
    } else {
      setTimeout(run, 500)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleError = (event: ErrorEvent) => {
      const payload = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack?.slice(0, 5000),
        type: "error",
      }
      void trackClarityEvent(clarityTasks.jsError, payload)
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as Error | string
      const payload = {
        message: typeof reason === "string" ? reason : reason?.message,
        stack: typeof reason === "string" ? undefined : reason?.stack?.slice(0, 5000),
        type: "unhandledrejection",
      }
      void trackClarityEvent(clarityTasks.jsError, payload)
    }

    const originalWarn = console.warn
    console.warn = (...args: unknown[]) => {
      originalWarn?.(...args)
      const message = args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" | ")
      void trackClarityEvent(clarityTasks.consoleWarning, {
        message,
      })
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
      console.warn = originalWarn
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || typeof performance === "undefined") return

    const reportNavigationTiming = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
      if (!nav) return
      void trackClarityEvent(clarityTasks.pageLoadMetrics, {
        load_time_ms: Math.round(nav.loadEventEnd - nav.startTime),
        dom_content_loaded_ms: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        ttfb_ms: Math.round(nav.responseStart - nav.requestStart),
        fetch_start_ms: Math.round(nav.fetchStart - nav.startTime),
        transfer_size: nav.transferSize,
        initiator_type: nav.initiatorType,
      })
    }

    const lcpEntries: LargestContentfulPaint[] = []
    let lcpObserver: PerformanceObserver | null = null

    if ("PerformanceObserver" in window) {
      try {
        lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as LargestContentfulPaint[]
          lcpEntries.push(...entries)
        })
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })
      } catch {
        /* ignore */
      }
    }

    const reportLcp = () => {
      if (!lcpEntries.length) return
      const lastEntry = lcpEntries[lcpEntries.length - 1]
      const { value, element, url } = lastEntry
      const tag = element?.tagName
      const classes = element?.className && typeof element.className === "string" ? element.className : undefined
      void trackClarityEvent(clarityTasks.lcpObserved, {
        lcp_ms: Math.round(value),
        tag,
        classes: classes?.slice(0, 180),
        url,
      })
      if (value >= 2500) {
        void trackClarityEvent(clarityTasks.lcpSlow, {
          lcp_ms: Math.round(value),
          tag,
          url,
        })
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        reportLcp()
        reportNavigationTiming()
        lcpObserver?.disconnect()
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange, { once: false })
    window.addEventListener("pagehide", onVisibilityChange, { once: false })

    // For users staying on the page: report after a short delay
    const timer = window.setTimeout(() => {
      reportLcp()
      reportNavigationTiming()
    }, 4000)

    return () => {
      lcpObserver?.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("pagehide", onVisibilityChange)
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Rage clicks: 3+ clicks within 800ms on same element
    let lastTarget: EventTarget | null = null
    let clickCount = 0
    let lastTimestamp = 0
    let resetTimeout: number | undefined

    const resetRage = () => {
      clickCount = 0
      lastTarget = null
      lastTimestamp = 0
      if (resetTimeout) {
        window.clearTimeout(resetTimeout)
        resetTimeout = undefined
      }
    }

    const handleClick = (event: MouseEvent) => {
      const now = performance.now()
      const sameTarget = lastTarget === event.target
      const withinWindow = now - lastTimestamp <= 800

      if (sameTarget && withinWindow) {
        clickCount += 1
      } else {
        clickCount = 1
        lastTarget = event.target
      }

      lastTimestamp = now
      if (resetTimeout) window.clearTimeout(resetTimeout)
      resetTimeout = window.setTimeout(resetRage, 900)

      if (clickCount >= 3 && sameTarget && withinWindow) {
        const target = event.target as HTMLElement | null
        void trackClarityEvent(clarityTasks.rageClick, {
          tag: target?.tagName,
          classes: target?.className?.toString()?.slice(0, 180),
          id: target?.id,
        })
        resetRage()
      }
    }

    // Quick back: pagehide before 3 seconds AND not BFCache restore
    const navigationStart = performance.timeOrigin
    let returned = false

    const handlePageHide = (event: PageTransitionEvent) => {
      if (returned) return
      const now = performance.now()
      if (!event.persisted && now < 3000) {
        returned = true
        void trackClarityEvent(clarityTasks.quickBack, {
          time_ms: Math.round(now),
        })
      }
    }

    window.addEventListener("click", handleClick, true)
    window.addEventListener("pagehide", handlePageHide)

    return () => {
      window.removeEventListener("click", handleClick, true)
      window.removeEventListener("pagehide", handlePageHide)
      resetRage()
    }
  }, [])

  return null
}
