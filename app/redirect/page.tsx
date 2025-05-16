"use client"
import { ArrowForwardSquare } from "iconsax-react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { Suspense, useEffect } from "react"
import { apiFetch } from "@/services/api"
function RedirectContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirectUrl = searchParams.get("redirect_url")
  const agency = searchParams.get("agency")
  const agency_eng = searchParams.get("agency_eng")


  useEffect(() => {
  
    if (redirectUrl) {
      const timeout = setTimeout(async () => {
        const fixedUrl = redirectUrl.startsWith("http") ? redirectUrl : `https://${redirectUrl}`
        // Log provider before redirect
        if (agency) {
          try {
            const response = await apiFetch("/statistics/", {
              method: "POST",
              data: JSON.stringify({ provider: agency_eng }),
            })
            console.log("Log provider response:", response)
          } catch (error) {
            console.error("Logging provider failed:", error)
          }
        }
        router.push(fixedUrl)
      }, 1000)

      return () => clearTimeout(timeout)
    } else {
      router.back() // fallback if redirect_url is not present
    }
  }, [redirectUrl, agency])

  const handleManualRedirect = () => {
    if (redirectUrl) {
      const fixedUrl = redirectUrl.startsWith("http") ? redirectUrl : `https://${redirectUrl}`
      window.open(fixedUrl, "_blank")
    }
  }

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
