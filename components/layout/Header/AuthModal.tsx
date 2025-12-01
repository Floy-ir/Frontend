"use client"

import React from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/services/api/index"
import { clarityTasks, trackClarityEvent } from "@/utils/clarity"
import { setStoredAuthPlatform } from "@/utils/miniapp"
import ForgotPasswordPhoneForm from "./ForgotPasswordPhoneForm"
import LoginForm from "./LoginForm"
import OTPInput from "./OTPInput"
import ResetPasswordForm from "./ResetPasswordForm"
import { LoadingDots } from "./SharedInputs"
import SignupDetailsForm from "./SignupDetailsForm"
import SignupForm from "./SignupForm"
import { Drawer, DrawerContent, DrawerTitle } from "../../ui/drawer"

function cleanPersianToEnglishDigits(input: string) {
  return input.replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 1776))
}

export default function AuthModal({
  isOpen,
  onClose,
  showToast,
  initialPayload,
}: {
  isOpen: boolean
  onClose: () => void
  showToast: (message: string) => void
  initialPayload?: Record<string, unknown>
}) {
  // Optional initial payload for opening the modal programmatically
  // (e.g. from Eitaa auto-auth). We'll pick it up from a custom event
  // or via the Header which can pass initialPayload as needed.
  // NOTE: Header will pass an `initialPayload` prop when it opens the modal.
  // We use a runtime check on (window as any).authModalInitialPayload if needed.
  const [activeTab, setActiveTab] = React.useState<"login" | "signup">("login")
  const [formError, setFormError] = React.useState("")
  const [emptyFields, setEmptyFields] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [otpError, setOtpError] = React.useState("")
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [otpValue, setOtpValue] = React.useState("")
  const [phoneForOtp, setPhoneForOtp] = React.useState("")
  const [isRtl, setIsRtl] = React.useState(false)
  const [step, setStep] = React.useState<0 | 1 | 2 | "forgot-phone">(0) // 0=form,1=otp,2=details, 'forgot-phone' = phone input for forgot
  const [resetMode, setResetMode] = React.useState(false)
  const [otpUuid, setOtpUuid] = React.useState<string | null>(null)

  // controlled inputs owned by AuthModal
  const [loginPhone, setLoginPhone] = React.useState("")
  const [loginPassword, setLoginPassword] = React.useState("")
  const [signupPhone, setSignupPhone] = React.useState("")
  const previousIsOpenRef = React.useRef(isOpen)

  React.useEffect(() => {
    if (isOpen && !previousIsOpenRef.current) {
      void trackClarityEvent(clarityTasks.authModalOpen, {
        initial_tab: activeTab,
        initial_step: step,
        has_initial_payload: Boolean(initialPayload),
      })
    } else if (!isOpen && previousIsOpenRef.current) {
      void trackClarityEvent(clarityTasks.authModalClose, {
        last_step: step,
        last_tab: activeTab,
      })
    }

    previousIsOpenRef.current = isOpen
  }, [activeTab, initialPayload, isOpen, step])

  const handleTabChange = (tab: "login" | "signup") => {
    if (tab === activeTab) return
    setActiveTab(tab)
    setFormError("")
    setEmptyFields([])
    void trackClarityEvent(clarityTasks.authModalTabSwitch, { tab })
  }

  const handleClose = () => {
    onClose()
    setFormError("")
    setEmptyFields([])
  }

  // reset inputs when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLoginPhone("")
      setLoginPassword("")
      setSignupPhone("")
    }
  }, [isOpen])

  // If opened with an initial payload (e.g. from Eitaa auto-auth), apply it
  React.useEffect(() => {
    if (!isOpen || !initialPayload) return
    try {
      const p = initialPayload as Record<string, unknown>
      if (p.step === "otp") {
        const phone = p.phone as string | undefined
        const uuid = p.otp_uuid as string | undefined
        if (phone) setPhoneForOtp(phone)
        if (uuid) setOtpUuid(uuid)
        setStep(1)
        setResetMode(!!p.resetMode)
      }
    } catch {
      // ignore malformed payload
    }
  }, [isOpen, initialPayload])

  // resend cooldown
  const [resendCooldown, setResendCooldown] = React.useState<number>(0)
  React.useEffect(() => {
    if (resendCooldown <= 0) return
    const id = setInterval(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearInterval(id)
  }, [resendCooldown])

  function extractServerMessage(err: unknown) {
    // apiFetch throws an Error with .response possibly containing { detail } or messages
    type ErrResp = { response?: { detail?: string; message?: string }; message?: string }
    const e = err as ErrResp
    const msg = e?.response?.detail || e?.response?.message || e?.message

    // Prefer mapping by response.type when backend provides it
    // Some backends return: { type: 'SomeException', detail: '...' }
    // We'll try to map `response.type` first, then fall back to exact-detail text matching.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyE = e as any
    const respType: string | undefined = anyE?.response?.type

    const typeTranslations: Record<string, string> = {
      UsedUidException: "این شناسه کاربر قبلاً استفاده شده است.",
      UsedPhoneNumberException: "این شماره موبایل قبلاً استفاده شده است.",
      UsedUsernameException: "این نام کاربری قبلاً استفاده شده است.",
      UserNotFound: "کاربر پیدا نشد.",
      SessionNotFound: "نشست کاربر یافت نشد.",
      InvalidTokenException: "توکن احراز هویت نامعتبر است.",
      SessionTimeout: "زمان نشست به پایان رسیده است.",
      TerminatedSessionException: "شما از حساب خود خارج شده‌اید.",
      WrongPasswordException: "رمز عبور اشتباه است.",
      InvalidOTPException: "کد تأیید اشتباه یا منقضی شده است.",
      OTPExpiredException: "کد تأیید منقضی شده است.",
      OTPAlreadyUsedException: "کد تأیید قبلاً استفاده شده است.",
      OTPVerificationRequiredException: "برای ادامه نیاز به تأیید کد OTP دارید.",
      SMSServiceFailedException: "ارسال پیامک ناموفق بود.",
    }

    if (respType && typeTranslations[respType]) {
      return typeTranslations[respType]
    }

    // Map older/other backends by exact detail/message text
    const errorTranslations: Record<string, string> = {
      "uid has been used before.": "شناسه کاربر قبلاً استفاده شده است.",
      "mobile number has been used before.": "شماره موبایل قبلاً استفاده شده است.",
      "username has been used before.": "نام کاربری قبلاً استفاده شده است.",
      "user not exist": "کاربر پیدا نشد.",
      "no session found corresponding to this session_uid": "نشست مربوطه پیدا نشد.",
      "the authentication token is invalid": "توکن احراز هویت نامعتبر است.",
      "too much time has passed from last activity": "زمان نشست به پایان رسیده است.",
      "already logged out": "کاربر از قبل خارج شده است.",
      "wrong password entered": "رمز عبور اشتباه وارد شده است.",
      "invalid or expired OTP code": "کد تأیید اشتباه یا منقضی شده است.",
      "OTP code has expired": "کد تأیید منقضی شده است.",
      "OTP code has already been used": "کد تأیید قبلاً استفاده شده است.",
      "OTP verification required before proceeding": "نیاز به تأیید کد OTP است.",
      "Failed to send SMS": "ارسال پیامک با خطا مواجه شد.",
    }

    if (msg && typeof msg === "string") {
      return errorTranslations[msg] || msg
    }

    return "خطایی رخ داد"
  }

  const showOtp = step === 1 || step === 2

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
      void trackClarityEvent(clarityTasks.authModalLoginAttempt, {
        has_initial_payload: Boolean(initialPayload),
        has_phone: Boolean(phone),
        is_phone_valid: isPhoneValid,
      })
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
        try {
          localStorage.setItem("auth_token", lr.token)
          setStoredAuthPlatform("web")
          // persist a minimal user object so header can show a welcome label
          try {
            // Try to get full_name from response, fallback to phone
            const resUser = (res as unknown as Record<string, unknown>)?.user as Record<string, unknown> | undefined
            const userObj = {
              mobile,
              full_name:
                (resUser?.full_name as string) ||
                ((res as unknown as Record<string, unknown>)?.full_name as string) ||
                "",
            }
            localStorage.setItem("auth_user", JSON.stringify(userObj))
          } catch {}
          // notify other parts of the app that auth state changed
          try {
            window.dispatchEvent(new Event("auth-changed"))
          } catch {}
        } catch {}
      }
      // success - backend may return token or session cookie
      showToast("با موفقیت وارد شدید!")
      void trackClarityEvent(clarityTasks.authModalLoginSuccess, { has_token: Boolean(lr?.token) })
      setTimeout(handleClose, 200)
    } catch (err) {
      console.error(err)
      const friendlyMessage = extractServerMessage(err) || "خطایی رخ داد"
      setFormError(friendlyMessage)
      void trackClarityEvent(clarityTasks.authModalLoginError, {
        has_phone: Boolean(phone),
        is_phone_valid: isPhoneValid,
        message: friendlyMessage,
      })
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
      void trackClarityEvent(clarityTasks.authModalSignupAttempt, { has_phone: Boolean(phone) })
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
      void trackClarityEvent(clarityTasks.authModalOtpRequested, {
        flow: "signup",
        has_uuid: Boolean(uuid),
      })
    } catch (err) {
      console.error(err)
      setFormError(extractServerMessage(err) || "خطایی رخ داد")
    } finally {
      setIsLoading(false)
    }
  }

  // when user clicks "forgot password" from login form, this is called
  const handleForgotPassword = async (phone?: string) => {
    // If no phone was passed (user clicked "forgot" without filling phone),
    // show the dedicated phone input form so they can enter it.
    if (!phone) {
      // If we're already on the forgot-phone form and the user submitted empty,
      // show an error asking them to fill the phone.
      if (step === "forgot-phone") {
        setFormError("شماره تلفن را وارد کنید.")
        setEmptyFields(["phone"])
        return
      }

      setStep("forgot-phone")
      setFormError("")
      setEmptyFields([])
      return
    }

    // otherwise proceed with the existing flow using provided phone
    // allow submitting the forgot flow without forcing the red "empty" highlight
    // if the submitted phone is empty, try to fall back to the phone currently typed in the login form
    let cleaned = cleanPersianToEnglishDigits(phone.trim())
    if (!cleaned && loginPhone) cleaned = cleanPersianToEnglishDigits(loginPhone.trim())

    const phonePattern = /^(09\d{9}|98\d{10})$/
    if (!phonePattern.test(cleaned)) {
      // don't mark the field red here; just show a friendly error message
      setFormError("شماره تلفن را به درستی وارد کنید.")
      setEmptyFields([])
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
      void trackClarityEvent(clarityTasks.authModalOtpRequested, {
        flow: "reset",
        has_uuid: Boolean(uuid),
      })
    } catch (err) {
      console.error(err)
      setFormError(extractServerMessage(err) || "خطایی رخ داد")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (code: string) => {
    setOtpError("")
    setIsVerifying(true)
    const flow = resetMode ? "reset" : "signup"
    try {
      // Basic local validation
      if (!code || code.length !== 6) {
        setOtpError("کد وارد شده معتبر نیست.")
        void trackClarityEvent(clarityTasks.authModalOtpError, { flow, reason: "invalid_length" })
        return
      }
      // call verify endpoint with phoneForOtp and code + otp uuid
      if (!phoneForOtp) {
        setOtpError("شماره تلفن یافت نشد.")
        void trackClarityEvent(clarityTasks.authModalOtpError, { flow, reason: "missing_phone" })
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
      void trackClarityEvent(clarityTasks.authModalOtpVerified, {
        flow,
        has_uuid: Boolean(res?.otp_uuid ?? otpUuid),
      })
    } catch (err) {
      console.error(err)
      // prefer server-provided message translated to Persian when available
      const friendlyMessage = extractServerMessage(err) || "خطایی رخ داد"
      setOtpError(friendlyMessage)
      void trackClarityEvent(clarityTasks.authModalOtpError, { flow, reason: "server_error", message: friendlyMessage })
    } finally {
      setIsVerifying(false)
    }
  }

  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    setOtpError("")
    if (!phoneForOtp) {
      setOtpError("شماره تلفن یافت نشد.")
      return
    }
    setIsLoading(true)
    try {
      const mobile = formatMobile(phoneForOtp)
      const endpoint = resetMode ? "/accounts/forgot-password/" : "/accounts/send-otp/"
      const res = await apiFetch<{ otp_uuid?: string }>(endpoint, {
        method: "POST",
        data: { mobile },
      })
      if (res?.otp_uuid) setOtpUuid(res.otp_uuid)
      // start 2 minute cooldown
      setResendCooldown(120)
      setOtpError("")
      void trackClarityEvent(clarityTasks.authModalOtpResent, {
        flow: resetMode ? "reset" : "signup",
        has_uuid: Boolean(res?.otp_uuid ?? otpUuid),
      })
    } catch (err) {
      console.error(err)
      const friendlyMessage = extractServerMessage(err) || "خطایی رخ داد"
      setOtpError(friendlyMessage)
      void trackClarityEvent(clarityTasks.authModalOtpError, {
        flow: resetMode ? "reset" : "signup",
        reason: "resend_failed",
        message: friendlyMessage,
      })
    } finally {
      setIsLoading(false)
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
      void trackClarityEvent(clarityTasks.authModalSignupComplete, {
        has_phone: Boolean(phoneForOtp),
      })
      showToast("ثبت‌نام با موفقیت انجام شد! لطفا وارد شوید")
      setTimeout(() => {
        // reset and switch to login so the user can sign in immediately
        setActiveTab("login")
        setStep(0)
        setLoginPhone(phoneForOtp)
        setLoginPassword("")
        setSignupPhone("")
        setPhoneForOtp("")
        setOtpValue("")
        setOtpUuid(null)
        setFormError("")
        setOtpError("")
        setEmptyFields([])
        setResetMode(false)
      }, 200)
    } catch (err) {
      console.error(err)
      setFormError(extractServerMessage(err) || "خطایی رخ داد")
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
      void trackClarityEvent(clarityTasks.authModalResetComplete, {
        has_phone: Boolean(phoneForOtp),
      })
      showToast("رمز عبور با موفقیت تغییر کرد! لطفا وارد شوید")
      setTimeout(() => {
        // reset state and return to login so the user can sign in
        setActiveTab("login")
        setStep(0)
        setLoginPhone(phoneForOtp)
        setLoginPassword("")
        setSignupPhone("")
        setPhoneForOtp("")
        setOtpValue("")
        setFormError("")
        setOtpError("")
        setEmptyFields([])
        setResetMode(false)
        setOtpUuid(null)
      }, 200)
    } catch (err) {
      console.error(err)
      setFormError(extractServerMessage(err) || "خطایی رخ داد")
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
    <div className="flex h-full w-full flex-col rounded-t-2xl bg-white">
      {((typeof step === "number" && step > 0) || step === "forgot-phone") && (
        <button
          onClick={() => {
            setStep(0)
            setOtpValue("")
            setOtpError("")
            setFormError("")
            setEmptyFields([])
          }}
          className="text-Gray-N700 mr-7 flex items-center gap-1 rounded-lg py-2 text-sm md:mr-5"
          type="button"
        >
          <span className="inline-block rotate-180 text-xl">&#8592;</span>
        </button>
      )}

      {!showOtp && step !== "forgot-phone" && (
        <div className="my-4 flex items-center justify-center">
          <div className="absolute top-3 right-5">
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700" aria-label="close">
              ✕
            </button>
          </div>
          <div
            className="ring-Gray-N100 inline-flex rounded-full bg-transparent p-1 ring-1"
            role="tablist"
            aria-label="auth tabs"
          >
            <button
              role="tab"
              aria-selected={activeTab === "login"}
              onClick={() => handleTabChange("login")}
              className={twMerge(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 md:px-6 md:py-2",
                activeTab === "login"
                  ? "bg-Primary-P500main text-white shadow"
                  : "text-Gray-N700 hover:bg-Gray-N50 bg-transparent"
              )}
            >
              ورود
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "signup"}
              onClick={() => handleTabChange("signup")}
              className={twMerge(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 md:px-6 md:py-2",
                activeTab === "signup"
                  ? "bg-Primary-P500main text-white shadow"
                  : "text-Gray-N700 hover:bg-Gray-N50 bg-transparent"
              )}
            >
              ثبت‌نام
            </button>
          </div>
        </div>
      )}

      {/* sliding content */}
      <div className="relative">
        <div className="h-full w-full overflow-hidden">
          <div
            className="flex items-start transition-transform duration-300 ease-in-out"
            style={{
              width: "300%",
              transform:
                step === 0 || step === "forgot-phone"
                  ? "translateX(0)"
                  : step === 1
                  ? `translateX(${isRtl ? "33.333%" : "-33.333%"})`
                  : `translateX(${isRtl ? "66.666%" : "-66.666%"})`,
            }}
          >
            <div className="items-strech flex w-1/3 flex-col px-2">
              <div className="flex w-full flex-col items-center justify-center">
                {step === "forgot-phone" ? (
                  <ForgotPasswordPhoneForm
                    onSubmit={handleForgotPassword}
                    isLoading={isLoading}
                    formError={formError}
                  />
                ) : activeTab === "login" ? (
                  <div className="mb-3 flex h-full w-full flex-col items-center justify-center">
                    <LoginForm
                      handleLoginSubmit={handleLoginSubmit}
                      emptyFields={emptyFields}
                      formError={formError}
                      isLoading={isLoading}
                      onForgot={handleForgotPassword}
                      phone={loginPhone}
                      password={loginPassword}
                      onPhoneChange={(v) => setLoginPhone(v)}
                      onPasswordChange={(v) => setLoginPassword(v)}
                    />
                  </div>
                ) : (
                  <div className="flex w-full flex-col items-center justify-center py-6">
                    <SignupForm
                      handleSignupSubmit={handleSignupSubmit}
                      emptyFields={emptyFields}
                      formError={formError}
                      isLoading={isLoading}
                      phone={signupPhone}
                      onPhoneChange={(v) => setSignupPhone(v)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 flex w-1/3 flex-col items-stretch px-2">
              <div className="flex w-full flex-col items-center space-y-4 text-center">
                <h3 className="mt-3 text-lg font-medium">وارد کردن کد تایید</h3>
                <p className="text-sm text-gray-600">کد ارسال شده به شماره {phoneForOtp || "-"} را وارد کنید.</p>
                <div className="flex items-center justify-center">
                  <OTPInput
                    length={6}
                    value={otpValue}
                    onChange={(val) => setOtpValue(val)}
                    onComplete={(val) => void handleVerifyOtp(val)}
                    disabled={isVerifying}
                  />
                </div>
                {otpError && <p className="mt-2 text-right text-sm text-red-600">{otpError}</p>}
                <div className="mb-4">
                  <Button
                    type="button"
                    className="bg-Primary-P500main hover:bg-Primary-P600 w-full rounded-lg text-base font-medium text-white transition"
                    style={{ minHeight: 40 }}
                    disabled={isVerifying || otpValue.length !== 6}
                    onClick={() => handleVerifyOtp(otpValue)}
                  >
                    {isVerifying ? <LoadingDots /> : "بررسی کد"}
                  </Button>
                </div>
                <div className="text-center">
                  {resendCooldown > 0 ? (
                    <p className="text-sm text-gray-500">ارسال مجدد در {formatSeconds(resendCooldown)}</p>
                  ) : (
                    <button
                      type="button"
                      className="text-Primary-P500main text-sm hover:underline"
                      onClick={handleResendOtp}
                    >
                      ارسال مجدد
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex w-1/3 flex-col items-stretch px-2">
              <div className="mt-2 w-full">
                {step === 2 &&
                  (resetMode ? (
                    <ResetPasswordForm
                      onSubmit={handleResetPassword}
                      emptyFields={emptyFields}
                      formError={formError}
                      isLoading={isLoading}
                    />
                  ) : (
                    <SignupDetailsForm
                      onSubmit={handleFinalSignup}
                      emptyFields={emptyFields}
                      formError={formError}
                      isLoading={isLoading}
                    />
                  ))}
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
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleClose()
        }}
      >
        {/* no vertical scrolling on Drawer itself */}
        <DrawerContent className="fixed -right-0 bottom-0 left-0 z-50 overflow-hidden rounded-t-2xl border-none bg-white p-0 shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-transparent">
          <span className="sr-only">
            <DrawerTitle>Authentication</DrawerTitle>
          </span>
          <div className="h-full">{Inner}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="sm-md:w-[350px] border-Gray-N100 relative w-full overflow-hidden rounded-2xl border bg-white p-2 shadow-xl md:w-[350px]">
        {Inner}
      </div>
    </div>
  )
}
