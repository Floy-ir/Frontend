"use client"
import { ArrowForwardSquare } from "iconsax-react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { Suspense, useEffect } from "react"

function RedirectContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirectUrl = searchParams.get("redirect_url")
  const agency = searchParams.get("agency")

  useEffect(() => {
    if (redirectUrl) {
      const timeout = setTimeout(() => {
        const fixedUrl = redirectUrl.startsWith("http") ? redirectUrl : `https://${redirectUrl}`
        window.open(fixedUrl, "_blank")
        router.back()
      }, 1000)

      return () => clearTimeout(timeout)
    } else {
      router.replace("/") // fallback if redirect_url is not present
    }
  }, [redirectUrl])

    const handleManualRedirect = () => {
    if (redirectUrl) {
      const fixedUrl = redirectUrl.startsWith("http") ? redirectUrl : `https://${redirectUrl}`
      window.open(fixedUrl, "_blank")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 mt-50">
      <div className="flex flex-col items-center md:flex-row gap-4 md:gap-1 ">
        <span className="text-Gray-N800 text-3xl font-semibold">در حال انتقال از فلوی به</span>
        <span className="text-Primary-P500main text-3xl font-semibold">{agency}</span>
      </div>
      <div className="text-Gray-N600 text-base md:text-xl font-normal mt-2 md:mt-0"> لطفا چند لحظه صبر کنید... </div>

      <div className="relative flex items-center justify-center w-[80px] h-[80px] animate-pulse">
        <div className="bg-Primary-P100 absolute top-[11px] left-[12px] size-17 rounded-[20px]" />
        <ArrowForwardSquare size="64" color="#5a28ee" className="absolute size-20 top-[0px] left-[0px]" />
      </div>

      <button
        onClick={handleManualRedirect}
        className="mt-10 text-Gray-N800 underline"
        type="button"
      >
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