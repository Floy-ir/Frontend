"use client"

import React from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/services/api/index"
import LoginForm from "./LoginForm"
import OTPInput from "./OTPInput"
import ResetPasswordForm from "./ResetPasswordForm"
import { LoadingDots } from "./SharedInputs"
import SignupDetailsForm from "./SignupDetailsForm"
import SignupForm from "./SignupForm"
import { Drawer, DrawerContent, DrawerTitle } from "../../ui/drawer"

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
  const [resetMode, setResetMode] = React.useState(false)
  const [otpUuid, setOtpUuid] = React.useState<string | null>(null)

  // controlled inputs owned by AuthModal
  const [loginPhone, setLoginPhone] = React.useState("")
  const [loginPassword, setLoginPassword] = React.useState("")
  const [signupPhone, setSignupPhone] = React.useState("")

  // reset inputs when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLoginPhone("")
      setLoginPassword("")
      setSignupPhone("")
    }
  }, [isOpen])

  // resend cooldown
  const [resendCooldown, setResendCooldown] = React.useState<number>(0)
  React.useEffect(() => {
    if (resendCooldown <= 0) return
    const id = setInterval(() => setResendCooldown(c => c - 1), 1000)
    return () => clearInterval(id)
  }, [resendCooldown])

  function extractServerMessage(err: unknown) {
    // apiFetch throws an Error with .response possibly containing { detail } or messages
    type ErrResp = { response?: { detail?: string; message?: string }; message?: string }
    const e = err as ErrResp
    const msg = e?.response?.detail || e?.response?.message || e?.message
    return String(msg ?? "خطایی رخ داد")
  }

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
      // call login endpoint
      const mobile = formatMobile(phone)
      const res = await apiFetch<{ token?: string; detail?: string }>("/accounts/login/", {
        method: "POST",
        data: { mobile, password },
      })
      if (!res) {
        setFormError("خطا در ورود. دوباره تلاش کنید.")
        return
      }
      // persist token if provided
      type LoginRes = { token?: string }
      const lr = res as unknown as LoginRes
      if (lr?.token) {
        try { localStorage.setItem("auth_token", lr.token) } catch {}
      }
      // success - backend may return token or session cookie
      showToast("با موفقیت وارد شدید!")
      setTimeout(() => onClose(), 200)
    } catch (err) {
      console.error(err)
      setFormError(extractServerMessage(err))
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
      // call send-otp for signup
      const mobile = formatMobile(phone)
      const res = await apiFetch<{ otp_uuid?: string }>("/accounts/send-otp/", {
        method: "POST",
        data: { mobile },
      })
      const uuid = res?.otp_uuid ?? null
      setOtpUuid(uuid)
      // show the OTP pane and carry phone
      setPhoneForOtp(phone)
      setOtpValue("")
      setStep(1)
      setResetMode(false)
      setOtpError("")
    } catch (err) {
      console.error(err)
      setFormError(extractServerMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  // when user clicks "forgot password" from login form, this is called
  const handleForgotPassword = async (phone?: string) => {
    const cleaned = phone ? cleanPersianToEnglishDigits(phone.trim()) : ""
    const empty: string[] = []
    if (!cleaned) empty.push("phone")
    setEmptyFields(empty)
    if (empty.length > 0) {
      setFormError("فیلدهای مشخص شده را پر کنید.")
      return
    }

    const phonePattern = /^(09\d{9}|98\d{10})$/
    if (!phonePattern.test(cleaned)) {
      setFormError("شماره تلفن را به درستی وارد کنید.")
      setEmptyFields(["phone"])
      return
    }

    // trigger otp for reset flow
    setFormError("")
    setIsLoading(true)
    try {
      // request a reset OTP for this phone from API
      const mobile = formatMobile(cleaned)
      const res = await apiFetch<{ otp_uuid?: string }>("/accounts/forgot-password/", {
        method: "POST",
        data: { mobile },
      })
      const uuid = res?.otp_uuid ?? null
      setOtpUuid(uuid)
      setPhoneForOtp(cleaned)
      setOtpValue("")
      setStep(1)
      setResetMode(true)
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
      // call verify endpoint with phoneForOtp and code + otp uuid
      if (!phoneForOtp) {
        setOtpError("شماره تلفن یافت نشد.")
        return
      }
      const mobile = formatMobile(phoneForOtp)
      const res = await apiFetch<{ otp_uuid?: string }>("/accounts/verify-otp/", {
        method: "POST",
        data: { mobile, code, otp_uuid: otpUuid },
      })
      // server may return/refresh otp_uuid
      if (res?.otp_uuid) setOtpUuid(res.otp_uuid)
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
      // call final signup API with phoneForOtp, name, password and otp_uuid
      const mobile = formatMobile(phoneForOtp)
      await apiFetch("/accounts/signup/", {
        method: "POST",
        data: { mobile, password, full_name: name, otp_uuid: otpUuid },
      })
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

  const handleResetPassword = async (data: { password: string; confirm: string }) => {
    const password = data.password.trim()
    const confirm = data.confirm.trim()
    const empty: string[] = []
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

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
      // call reset API with phoneForOtp and password and otp_uuid
      const mobile = formatMobile(phoneForOtp)
      await apiFetch("/accounts/reset-password/", {
        method: "POST",
        data: { mobile, new_password: password, otp_uuid: otpUuid },
      })
      showToast("رمز عبور با موفقیت تغییر کرد!")
      setTimeout(() => {
        // reset all state and close
        setStep(0)
        setPhoneForOtp("")
        setOtpValue("")
        setFormError("")
        setEmptyFields([])
        setResetMode(false)
        onClose()
      }, 200)
    } finally {
      setIsLoading(false)
    }
  }

  function formatMobile(raw: string) {
    // raw is already cleaned digits: could be 09..., 98..., or +...
    if (!raw) return raw
    if (raw.startsWith("+")) return raw
    if (raw.startsWith("09")) return "+98" + raw.slice(1)
    if (raw.startsWith("98")) return "+" + raw
    return raw
  }

  if (!isOpen) return null

  const Inner = (
    <div className="bg-white rounded-t-2xl w-full h-full flex flex-col">
      {step > 0 && (
        <button
          onClick={() => {
            setStep(0)
            setOtpValue("")
            setOtpError("")
            setFormError("")
            setEmptyFields([])
          }}
          className="flex items-center gap-1 text-sm text-Gray-N700 py-2 rounded-lg mr-7 md:mr-5"
          type="button"
        >
          <span className="text-xl rotate-180 inline-block">&#8592;</span>
        </button>
      )}

      {!showOtp && (
        <div className="flex justify-center items-center my-4 ">
          <div className="absolute top-3 right-5">
            <button
              onClick={() => {
                onClose()
                setFormError("")
                setEmptyFields([])
              }}
              className="text-gray-500 hover:text-gray-700"
              aria-label="close"
            >
              ✕
            </button>
          </div>
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
            className="flex transition-transform duration-300 ease-in-out items-start mb-0"
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
                  <div className="w-full h-full flex flex-col items-center justify-center mb-3">
                  <LoginForm
                    handleLoginSubmit={handleLoginSubmit}
                    emptyFields={emptyFields}
                    formError={formError}
                    isLoading={isLoading}
                    onForgot={handleForgotPassword}
                    phone={loginPhone}
                    password={loginPassword}
                    onPhoneChange={v => setLoginPhone(v)}
                    onPasswordChange={v => setLoginPassword(v)}
                  /> 
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center mt-4">

                  <SignupForm
                    handleSignupSubmit={handleSignupSubmit}
                    emptyFields={emptyFields}
                    formError={formError}
                    isLoading={isLoading}
                    phone={signupPhone}
                    onPhoneChange={v => setSignupPhone(v)}
                  />
                  </div>
                )}
              </div>
            </div>

            <div className="w-1/3 px-2 flex flex-col items-stretch h-full">
              <div className="text-center w-full flex flex-col items-center space-y-4">
                <h3 className="text-lg font-medium">وارد کردن کد تایید</h3>
                <p className="text-sm text-gray-600">کد ارسال شده به شماره {phoneForOtp || "-"} را وارد کنید.</p>
                <div className="flex items-center justify-center">
                  <OTPInput
                    length={6}
                    value={otpValue}
                    onChange={val => setOtpValue(val)}
                    onComplete={val => void handleVerifyOtp(val)}
                    disabled={isVerifying}
                  />
                </div>
                {otpError && <p className="text-red-600 text-sm text-right mt-2">{otpError}</p>}
                <div className="mb-4">
                  <Button
                    type="button"
                    className="w-full bg-Primary-P500main text-white rounded-lg text-base font-medium hover:bg-Primary-P600 transition"
                    style={{ minHeight: 40 }}
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
                  resetMode ? (
                    <ResetPasswordForm onSubmit={handleResetPassword} emptyFields={emptyFields} formError={formError} isLoading={isLoading} />
                  ) : (
                    <SignupDetailsForm onSubmit={handleFinalSignup} emptyFields={emptyFields} formError={formError} isLoading={isLoading} />
                  )
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
        <DrawerContent className="z-50 fixed bottom-0 left-0 -right-0 rounded-t-2xl bg-white p-0 overflow-hidden border-none shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent">
          <span className="sr-only">
            <DrawerTitle>Authentication</DrawerTitle>
          </span>
          <div className="h-full ">
            {Inner}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-2 rounded-2xl shadow-xl w-full sm-md:w-[350px] md:w-[350px] relative border border-Gray-N100 overflow-hidden">
        {Inner}
      </div>
    </div>
  )
}
        
