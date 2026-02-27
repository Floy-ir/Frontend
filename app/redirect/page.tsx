"use client"
import { ArrowForwardSquare } from "iconsax-react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { Suspense, useEffect } from "react"
import { apiFetch } from "@/services/api"

function RedirectContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirectUrlParam = searchParams.get("redirect_url")
  const agency = searchParams.get("agency")
  const agency_eng = searchParams.get("agency_eng")

  // helper to reconstruct the full redirect target from the raw query string
  const getFullRedirectFromRaw = () => {
    if (typeof window === "undefined") return null
    const rawSearch = window.location.search || ""
    const key = "redirect_url="
    const startIdx = rawSearch.indexOf(key)
    if (startIdx === -1) return null
    const valueStart = startIdx + key.length
    const agencyIdx = rawSearch.indexOf("&agency=", valueStart)
    const agencyEngIdx = rawSearch.indexOf("&agency_eng=", valueStart)
    let endIdx = rawSearch.length
    if (agencyIdx !== -1 && agencyEngIdx !== -1) {
      endIdx = Math.min(agencyIdx, agencyEngIdx)
    } else if (agencyIdx !== -1) {
      endIdx = agencyIdx
    } else if (agencyEngIdx !== -1) {
      endIdx = agencyEngIdx
    }

    let extracted = rawSearch.substring(valueStart, endIdx)
    try {
      extracted = decodeURIComponent(extracted)
    } catch {
      // ignore
    }

    if (extracted.startsWith("redirect?")) extracted = extracted.replace(/^redirect\?/, "")
    extracted = extracted.replace(/[?&]$/, "")
    if (!/^https?:\/\//.test(extracted)) extracted = `https://${extracted}`
    return extracted
  }

  useEffect(() => {
    const full = getFullRedirectFromRaw()
    if (full) {
      const timeout = setTimeout(async () => {
        if (agency) {
          try {
            await apiFetch("/statistics/", {
              method: "POST",
              data: JSON.stringify({ provider: agency_eng }),
            })
          } catch {
            console.error("Logging provider failed:")
          }
        }
        console.log("Redirecting to:", full)
        router.push(full)
      }, 1000)
      return () => clearTimeout(timeout)
    }

    if (redirectUrlParam) {
      let decoded = redirectUrlParam
      try {
        decoded = decodeURIComponent(decoded)
      } catch {
        // ignore
      }
      if (!/^https?:\/\//.test(decoded)) decoded = `https://${decoded}`
      const timeout = setTimeout(() => {
        console.log("Redirecting to:", decoded)
        router.push(decoded)
      }, 1000)
      return () => clearTimeout(timeout)
    }

    router.back()
  }, [redirectUrlParam, agency])

  const handleManualRedirect = () => {
    const full = getFullRedirectFromRaw()
    if (full) {
      window.open(full, "_blank")
      return
    }
    if (redirectUrlParam) {
      let decoded = redirectUrlParam
      try {
        decoded = decodeURIComponent(decoded)
      } catch {
        // ignore
      }
      if (!/^https?:\/\//.test(decoded)) decoded = `https://${decoded}`
      window.open(decoded, "_blank")
    }
  }

  console.log("Redirecting to:", getFullRedirectFromRaw() ?? redirectUrlParam)

  return (
    <div className="mt-50 flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-1">
        <span className="text-Gray-N800 text-3xl font-semibold">در حال انتقال از فلوی به</span>
        <span className="text-Primary-P500main text-3xl font-semibold">{agency}</span>
      </div>
      <div className="text-Gray-N600 mt-2 text-base font-normal md:mt-0 md:text-xl"> لطفا چند لحظه صبر کنید... </div>

      <div className="relative flex h-[80px] w-[80px] animate-pulse items-center justify-center">
        <div className="bg-Primary-P100 absolute top-[11px] left-[12px] size-17 rounded-[20px]" />
        <ArrowForwardSquare size="64" color="#5a28ee" className="absolute top-[0px] left-[0px] size-20" />
      </div>

      <button onClick={handleManualRedirect} className="text-Gray-N800 mt-10 underline" type="button">
        اگر به طور خودکار منتقل نشدید، اینجا کلیک کنید!
      </button>
    </div>
  )
}

export default function Redirect() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectContent />
    </Suspense>
  )
}
