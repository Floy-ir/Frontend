"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { Airplane, HambergerMenu } from "iconsax-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import { isRunningInEitaa } from "@/utils/eitaa"
import { twMerge } from "tailwind-merge"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/services/api"
import AuthModal from "./AuthModal"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "../../ui/drawer"

interface MenuItem {
  label: string
  href: string
  isActive?: boolean
}

interface HeaderProps {
  menuItems: MenuItem[]
  className?: string
  forceScrolledStyle?: boolean
  compact?: boolean
}

type AuthUser = {
  mobile: string
  full_name?: string
  request_id?: string
}

const navItem = cva(["flex", "flex-col", "items-center", "gap-1"], {
  variants: {
    isActive: {
      true: ["font-semibold"],
      false: ["font-normal", "hover:opacity-90"],
    },
    isScrolled: {
      true: ["text-Gray-N700"],
      false: ["text-white"],
    },
  },
  defaultVariants: {
    isActive: false,
    isScrolled: false,
  },
  compoundVariants: [
    {
      isActive: true,
      isScrolled: false,
      className: "text-white",
    },
    {
      isActive: true,
      isScrolled: true,
      className: "text-Gray-N700",
    },
  ],
})

export function Header({ menuItems, className, forceScrolledStyle = false, compact = false }: HeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(true)
  const [isScrolled, setIsScrolled] = useState<boolean>(forceScrolledStyle ?? false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalInitPayload, setModalInitPayload] = useState<any>(null)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false)
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)
  const showToast = (message: string) => {
    const id = Date.now()
    setToast({ id, message })
    setTimeout(() => setToast((curr) => (curr && curr.id === id ? null : curr)), 3000)
  }

  useEffect(() => {
    setIsScrolled(forceScrolledStyle || window.scrollY > 50)
  }, [forceScrolledStyle])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      const hasScrolledEnough = currentScrollPos > 50
      const isScrollingUp = prevScrollPos > currentScrollPos
      const isAtTop = currentScrollPos < 70
      const shouldBeVisible = isScrollingUp || isAtTop || mobileMenuOpen
      setVisible(shouldBeVisible)
      setIsScrolled(forceScrolledStyle || hasScrolledEnough)
      setPrevScrollPos(currentScrollPos)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [prevScrollPos, mobileMenuOpen, forceScrolledStyle])

  const headerClasses = twMerge(
    "w-full fixed top-0 left-0 right-0 z-20 transition-all duration-300",
    !visible ? "-translate-y-full" : "translate-y-0",
    visible && isScrolled ? "bg-white border-b border-Gray-N200" : "bg-transparent",
    className
  )

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 768)
    checkScreen()
    window.addEventListener("resize", checkScreen)
    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  useEffect(() => {
    const readUser = () => {
      try {
        const raw = localStorage.getItem("auth_user")
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed && typeof parsed === "object" && typeof (parsed as { mobile?: unknown }).mobile === "string") {
            setAuthUser(parsed as { mobile: string; full_name?: string })
          } else {
            setAuthUser(null)
          }
        } else setAuthUser(null)
      } catch {
        setAuthUser(null)
      }
    }
    readUser()
    const onAuth = () => readUser()
    window.addEventListener("auth-changed", onAuth)
    // If there's no stored auth_user but the app is running inside Eitaa,
    // try to read Eitaa init data and show a greeting using the Eitaa user
    // info. This provides a friendly UX inside the mini-app even before
    // a server-side session (token) exists.
    if (!localStorage.getItem("auth_user") && isRunningInEitaa()) {
      try {
        // runtime access to the Eitaa WebApp init data
        const raw = (window as any)?.Eitaa?.WebApp?.initDataUnsafe?.user
        if (raw && raw.first_name) {
          const userWithoutRequestId: AuthUser = { mobile: "", full_name: raw.first_name }
          try {
            localStorage.setItem("auth_user", JSON.stringify(userWithoutRequestId))
            window.dispatchEvent(new Event("auth-changed"))
          } catch {}
          setAuthUser(userWithoutRequestId)

          const eitaId = raw.id != null ? String(raw.id) : null
          if (eitaId) {
            ;(async () => {
              try {
                const response = await apiFetch<{ request_id?: string }>("/accounts/eita/", {
                  method: "POST",
                  data: { eita_id: eitaId },
                })
                if (response?.request_id) {
                  const userWithRequestId: AuthUser = { ...userWithoutRequestId, request_id: response.request_id }
                  setAuthUser(userWithRequestId)
                  try {
                    localStorage.setItem("auth_user", JSON.stringify(userWithRequestId))
                    window.dispatchEvent(new Event("auth-changed"))
                  } catch {}
                }
              } catch {
                /* ignore */
              }
            })()
          }
        }
      } catch {}
    }
    return () => window.removeEventListener("auth-changed", onAuth)
  }, [])

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const ce = e as CustomEvent
        setModalInitPayload(ce.detail ?? null)
        setIsModalOpen(true)
      } catch {
        setModalInitPayload(null)
        setIsModalOpen(true)
      }
    }
    window.addEventListener("open-auth-modal", handler as EventListener)
    return () => window.removeEventListener("open-auth-modal", handler as EventListener)
  }, [])
  // For very small flight pages we hide header to maximize space; show header on chat page
  if (pathname?.startsWith("/flights") && isSmallScreen) {
    return <></>
  }

  // size classes for compact mode
  const desktopHeight = compact ? "h-12" : "h-22"
  const spacerLg = compact ? "lg:h-12" : "lg:h-22"
  const logoTextClass = compact ? "text-sm" : "text-lg"
  const navGap = compact ? "gap-6" : "gap-12"

  // Determine a friendly display name. Priority:
  // 1. server/local auth_user stored in localStorage (authUser)
  // 2. Eitaa init data (when running inside the mini-app)
  const eitaaDisplayName =
    typeof window !== "undefined" ? (window as any)?.Eitaa?.WebApp?.initDataUnsafe?.user?.first_name : undefined
  const displayName = authUser ? authUser.full_name || authUser.mobile : eitaaDisplayName || "کاربر"

  return (
    <>
      <header className={headerClasses}>
        {/* Content container - only constrain width for content, not background */}
        <div
          className={`lg-xl:px-6 mx-auto w-full max-w-[1136px] px-4 md:px-4 ${
            compact ? "px-3 lg:px-4" : "px-4 lg:px-6"
          } ${isScrolled ? "w-full" : ""}`}
        >
          {/* Desktop view */}
          <div className={`hidden ${desktopHeight} items-center justify-between lg:flex`}>
            {/* Logo - Right Side in RTL */}
            <div className="flex items-center gap-2">
              <span className={`${logoTextClass} font-semibold ${isScrolled ? "text-Gray-N700" : "text-white"}`}>
                فلوی
              </span>
              <Airplane
                size={compact ? 16 : 20}
                variant="Bold"
                className={isScrolled ? "text-Gray-N700" : "text-white"}
              />
            </div>
            <NavigationMenu.Root className="flex flex-1 justify-center">
              <NavigationMenu.List className={`flex flex-row-reverse ${navGap}`}>
                {menuItems.map((item, index) => (
                  <NavigationMenu.Item key={index}>
                    <NavigationMenu.Link asChild>
                      <Link
                        href={item.href}
                        className={navItem({
                          // isActive: item.isActive,
                          isScrolled: isScrolled,
                        })}
                      >
                        <span className={compact ? "text-sm" : "text-lg"}>{item.label}</span>
                        {/* {item.isActive && (
                          <div className="relative h-1 w-1">
                            <div
                              className={`absolute h-1.5 w-1.5 rounded-sm ${
                                isScrolled ? "bg-Primary-P300" : "bg-white"
                              }`}
                            ></div>
                          </div>
                        )} */}
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                ))}
              </NavigationMenu.List>
            </NavigationMenu.Root>
            <div className="relative">
              {!authUser && !isRunningInEitaa() ? (
                <Button
                  size="default"
                  onClick={() => setIsModalOpen(true)}
                  className={twMerge(
                    "rounded-xl px-6 py-4 transition-colors",
                    isScrolled
                      ? "bg-Gray-N100 text-Primary-P500main hover:bg-Gray-N100"
                      : "bg-Gray-N100 hover:bg-Gray-N100 text-indigo-600"
                  )}
                >
                  ورود | ثبت‌نام
                </Button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className={twMerge(
                      "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                      isScrolled ? "text-Primary-P500main" : "bg-Gray-N50 text-Primary-P500main"
                    )}
                  >
                    سلام {displayName}!
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 w-30 rounded-md bg-white shadow-lg">
                      <button
                        onClick={() => {
                          try {
                            localStorage.removeItem("auth_token")
                            localStorage.removeItem("auth_user")
                          } catch {}
                          try {
                            window.dispatchEvent(new Event("auth-changed"))
                          } catch {}
                          setUserMenuOpen(false)
                        }}
                        className="hover:bg-Gray-N50 w-full px-4 py-2 text-right text-sm hover:rounded-md"
                      >
                        خروج
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Mobile view */}
          <div className={`flex items-center justify-between lg:hidden ${compact ? "py-1" : "py-2"}`}>
            {/* Drawer for mobile menu */}
            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DrawerTrigger asChild>
                <button className={compact ? "p-1" : "p-2"}>
                  <HambergerMenu
                    size={compact ? 32 : 48}
                    className={compact ? "p-1" : "p-2"}
                    color={isScrolled ? "#334155" : "white"}
                  />
                  <span className="sr-only">Toggle Menu</span>
                </button>
              </DrawerTrigger>
              <DrawerContent className="z-50 max-h-[80vh] bg-white p-0">
                <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
                <div className="overflow-auto p-6">
                  <nav className="flex flex-col items-end space-y-3">
                    {menuItems.map((item: MenuItem, index: number) => (
                      <Link
                        key={index}
                        href={item.href}
                        className={`w-full px-6 py-3 text-right text-[1.15rem] ${
                          item.isActive ? "font-semibold text-slate-800" : "text-slate-500"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </DrawerContent>
            </Drawer>
            {!authUser && !isRunningInEitaa() ? (
              <Button
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className={twMerge(
                  "rounded-lg px-3 py-2 transition-colors",
                  isScrolled
                    ? "bg-Gray-N100 text-Primary-P500main hover:bg-Gray-N100"
                    : "bg-Gray-N100 hover:bg-Gray-N100 text-indigo-600"
                )}
              >
                ورود | ثبت‌نام
              </Button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className={twMerge(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isScrolled ? "text-Primary-P500main" : "bg-Gray-N50 text-Primary-P500main"
                  )}
                >
                  سلام {displayName}!
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-30 rounded-md border bg-white shadow-lg">
                    <button
                      onClick={() => {
                        try {
                          localStorage.removeItem("auth_token")
                          localStorage.removeItem("auth_user")
                        } catch {}
                        try {
                          window.dispatchEvent(new Event("auth-changed"))
                        } catch {}
                        setUserMenuOpen(false)
                      }}
                      className="hover:bg-Gray-N50 w-full px-4 py-2 text-right text-sm hover:rounded-md"
                    >
                      خروج
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      {toast && (
        <div className="fixed top-6 left-1/2 z-[100] -translate-x-1/2">
          <div className="bg-Gray-N900 fonr-small rounded-lg px-4 py-2 text-[12px] text-white shadow-lg md:text-[14px] md:font-normal">
            {toast.message}
          </div>
        </div>
      )}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setModalInitPayload(null)
        }}
        showToast={showToast}
        initialPayload={modalInitPayload}
      />

      {/* Spacer div to prevent layout shifts - matches header height */}
      <div className={`h-12 w-full ${spacerLg}`}></div>
    </>
  )
}
