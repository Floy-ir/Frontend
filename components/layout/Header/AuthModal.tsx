"use client"

import React from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "@/components/ui/button"
import LoginForm from "./LoginForm"
import OTPInput from "./OTPInput"
import { LoadingDots } from "./SharedInputs"
import SignupDetailsForm from "./SignupDetailsForm"
import SignupForm from "./SignupForm"
import { Drawer, DrawerContent } from "../../ui/drawer"

function cleanPersianToEnglishDigits(input: string) {
  return input.replace(/[\u06F0-\u06F9]/g, d => String(d.charCodeAt(0) - 1776))
}

export default function AuthModal({
  isOpen,
  onClose,
  showToast,
}: {
  isOpen: boolean
  onClose: () => void
  showToast: (message: string) => void
}) {
  const [activeTab, setActiveTab] = React.useState<"login" | "signup">("login")
  const [formError, setFormError] = React.useState("")
  const [emptyFields, setEmptyFields] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [otpError, setOtpError] = React.useState("")
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [otpValue, setOtpValue] = React.useState("")
  const [phoneForOtp, setPhoneForOtp] = React.useState("")
  const [isRtl, setIsRtl] = React.useState(false)
  const [step, setStep] = React.useState<0 | 1 | 2>(0) // 0=form,1=otp,2=details

  const showOtp = step > 0

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const dir = document.documentElement?.getAttribute("dir") || document.body?.getAttribute("dir") || "ltr"
      setIsRtl(dir === "rtl")
    }
  }, [])

  // detect small screen to switch to Drawer on mobile
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(max-width: 640px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener?.("change", update)
    return () => mq.removeEventListener?.("change", update)
  }, [])

  const handleLoginSubmit = async (data: { phone: string; password: string }) => {
  const phone = cleanPersianToEnglishDigits(data.phone.trim())
    const password = data.password.trim()
    const empty: string[] = []

    if (!phone) empty.push("phone")
    if (!password) empty.push("password")

    const phonePattern = /^(09\d{9}|98\d{10})$/
    const isPhoneValid = phonePattern.test(phone)

    setEmptyFields(empty)

    if (empty.length > 0) {
      setFormError("فیلدهای مشخص شده را پر کنید.")
      return
    }

    if (!isPhoneValid) {
      setFormError("شماره تلفن را به درستی وارد کنید.")
      setEmptyFields([...empty, "phone"])
      return
    }

    setFormError("")
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      showToast("با موفقیت وارد شدید!")
      setTimeout(() => onClose(), 200)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (data: { phone: string }) => {
    const phone = cleanPersianToEnglishDigits(data.phone.trim())
    const empty: string[] = []
    const phonePattern = /^(09\d{9}|98\d{10})$/

    if (!phone) empty.push("phone")
    setEmptyFields(empty)
    if (empty.length > 0) {
      setFormError("فیلدهای مشخص شده را پر کنید.")
      return
    }

    if (!phonePattern.test(phone)) {
      setFormError("شماره تلفن را به درستی وارد کنید.")
      setEmptyFields(["phone"])
      return
    }

    setFormError("")
    setIsLoading(true)
    try {
      // TODO: call real signup API here and send the verification code
      await new Promise(resolve => setTimeout(resolve, 1200))
      // show the OTP pane and carry phone
      setPhoneForOtp(phone)
      setOtpValue("")
      setStep(1)
      setOtpError("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (code: string) => {
    setOtpError("")
    setIsVerifying(true)
    try {
      // Basic local validation
      if (!code || code.length !== 6) {
        setOtpError("کد وارد شده معتبر نیست.")
        return
      }
      // TODO: call verify endpoint with phoneForOtp and code
      await new Promise(resolve => setTimeout(resolve, 1100))
      // On success move to details step (don't close yet)
      setOtpError("")
      setStep(2)
      // prepare details step
      setOtpValue("")
    } catch (err) {
      console.error(err)
      setOtpError("کد وارد شده معتبر نیست.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleFinalSignup = async (data: { name: string; password: string; confirm: string }) => {
    const name = data.name.trim()
    const password = data.password.trim()
    const confirm = data.confirm.trim()
    const empty: string[] = []
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    if (!name) empty.push("name")
    if (!password) empty.push("password")
    if (!confirm) empty.push("confirm")

    if (empty.length > 0) {
      setFormError("فیلدهای مشخص شده را پر کنید.")
      setEmptyFields(empty)
      return
    }

    if (!passwordPattern.test(password)) {
      setFormError("رمز عبور باید ۸ کاراکتر و ترکیبی از اعداد و حروف باشد.")
      setEmptyFields(["password"])
      return
    }

    if (password !== confirm) {
      setFormError("رمز عبور و تکرار آن باید برابر باشند.")
      setEmptyFields(["password", "confirm"])
      return
    }

    setFormError("")
    setIsLoading(true)
    try {
      // TODO: call final signup API with phoneForOtp, name, password
      await new Promise(resolve => setTimeout(resolve, 1200))
      showToast("ثبت‌نام با موفقیت انجام شد!")
      setTimeout(() => {
        // reset all state and close
        setStep(0)
        setPhoneForOtp("")
        setOtpValue("")
        setFormError("")
        setEmptyFields([])
        onClose()
      }, 200)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const Inner = (
    <div className="bg-white rounded-t-2xl w-full h-full flex flex-col">
      {step > 0 ? (
        <button
          onClick={() => {
            setStep(0)
            setOtpValue("")
            setOtpError("")
            setFormError("")
            setEmptyFields([])
          }}
          className="flex items-center gap-1 text-sm text-Gray-N700 md:px-3 py-2 rounded-lg"
          type="button"
        >
          <span className="text-xl rotate-180 inline-block">&#8592;</span>
        </button>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={() => {
              onClose()
              setFormError("")
              setEmptyFields([])
            }}
            className="text-gray-500 hover:text-gray-700 px-2 py-1 md:px-3 md:py-2"
            aria-label="close"
          >
            ✕
          </button>
        </div>
      )}

      {!showOtp && (
        <div className="flex justify-center mb-4 md:mb-6 min-h-[48px]">
          <div className="inline-flex rounded-full bg-transparent ring-1 ring-Gray-N100 p-1 " role="tablist" aria-label="auth tabs">
            <button
              role="tab"
              aria-selected={activeTab === "login"}
              onClick={() => { setActiveTab("login"); setFormError(""); setEmptyFields([]) }}
              className={twMerge(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 md:px-6 md:py-2",
                activeTab === "login"
                  ? "bg-Primary-P500main text-white shadow"
                  : "text-Gray-N700 bg-transparent hover:bg-Gray-N50"
              )}
            >
              ورود
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "signup"}
              onClick={() => { setActiveTab("signup"); setFormError(""); setEmptyFields([]) }}
              className={twMerge(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 md:px-6 md:py-2",
                activeTab === "signup"
                  ? "bg-Primary-P500main text-white shadow"
                  : "text-Gray-N700 bg-transparent hover:bg-Gray-N50"
              )}
            >
              ثبت‌نام
            </button>
          </div>
        </div>
      )}

      {/* sliding content */}
      <div className="relative flex-1">
        <div className="w-full overflow-hidden h-full">
          <div
            className="flex transition-transform duration-300 ease-in-out items-start"
            style={{
              width: "300%",
              transform:
                step === 0
                  ? "translateX(0)"
                  : step === 1
                  ? `translateX(${isRtl ? "33.333%" : "-33.333%"})`
                  : `translateX(${isRtl ? "66.666%" : "-66.666%"})`,
            }}
          >
            <div className="w-1/3 flex flex-col items-strech h-full">
              <div className="w-full h-full flex flex-col items-center justify-center">
                {activeTab === "login" ? (
                  <LoginForm
                    handleLoginSubmit={handleLoginSubmit}
                    emptyFields={emptyFields}
                    formError={formError}
                    isLoading={isLoading}
                  />
                ) : (
                  <SignupForm
                    handleSignupSubmit={handleSignupSubmit}
                    emptyFields={emptyFields}
                    formError={formError}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>

            <div className="w-1/3 px-2 flex flex-col items-stretch h-full">
              <div className="text-center w-full flex flex-col items-center">
                <h3 className="text-lg font-medium mb-2 mt-8">وارد کردن کد تایید</h3>
                <p className="text-sm text-gray-600 mb-4">کد ارسال شده به شماره {phoneForOtp || "-"} را وارد کنید.</p>
                <div className="flex items-center justify-center mt-2 mb-2">
                  <OTPInput
                    length={6}
                    value={otpValue}
                    onChange={val => setOtpValue(val)}
                    onComplete={val => void handleVerifyOtp(val)}
                    disabled={isVerifying}
                  />
                </div>
                {otpError && <p className="text-red-600 text-sm text-right mt-2">{otpError}</p>}
                <div className="mt-auto">
                  <Button
                    type="button"
                    className="w-full mt-4 bg-Primary-P500main text-white rounded-lg py-2.5 text-base font-medium hover:bg-Primary-P600 transition"
                    style={{ minHeight: 45 }}
                    disabled={isVerifying || otpValue.length !== 6}
                    onClick={() => handleVerifyOtp(otpValue)}
                  >
                    {isVerifying ? <LoadingDots /> : "بررسی کد"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-1/3 px-2 flex flex-col items-stretch h-full">
              <div className="w-full mt-2">
                {step === 2 && (
                  <SignupDetailsForm onSubmit={handleFinalSignup} emptyFields={emptyFields} formError={formError} isLoading={isLoading} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Mobile: render Drawer bottom sheet, Desktop: centered modal
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={open => { if (!open) onClose() }}>
        {/* no vertical scrolling on Drawer itself */}
        <DrawerContent className="z-50 fixed bottom-0 left-0 -right-0 rounded-t-2xl bg-white p-0 overflow-hidden">
          <div className="h-full mb-3">
            {Inner}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-2 rounded-2xl shadow-xl w-full md:w-[420px] h-[300px] md:h-[340px] relative border border-Gray-N100 overflow-hidden">
        {Inner}
      </div>
    </div>
  )
}
        
