"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { Airplane, HambergerMenu } from "iconsax-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "@/components/ui/button"
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

export function Header({ menuItems, className, forceScrolledStyle = false }: HeaderProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(true)
  const [isScrolled, setIsScrolled] = useState<boolean>(forceScrolledStyle ?? false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [authUser, setAuthUser] = useState<{ mobile: string; full_name?: string } | null>(null)
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
    return () => window.removeEventListener("auth-changed", onAuth)
  }, [])

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
  }, [])

  return (
    <>
      <header className={headerClasses}>
        <div className={`lg-xl:px-6 mx-auto w-full max-w-[1136px] px-4 md:px-4 lg:px-6 ${isScrolled ? "w-full" : ""}`}>
          {/* Desktop view */}
          <div className="hidden h-22 items-center justify-between lg:flex">
            <div className="flex items-center gap-2">
              <span className={`text-lg font-semibold ${isScrolled ? "text-Gray-N700" : "text-white"}`}>فلوی</span>
              <Airplane size={20} variant="Bold" className={isScrolled ? "text-Gray-N700" : "text-white"} />
            </div>
            <NavigationMenu.Root className="flex flex-1 justify-center">
              <NavigationMenu.List className="flex flex-row-reverse gap-12">
                {menuItems.map((item: MenuItem, index: number) => (
                  <NavigationMenu.Item key={index}>
                    <NavigationMenu.Link asChild>
                      <Link href={item.href} className={navItem({ isScrolled })}>
                        <span className="text-lg">{item.label}</span>
                      </Link>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                ))}
              </NavigationMenu.List>
            </NavigationMenu.Root>
            <div className="relative">
              {!authUser ? (
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
                    سلام {authUser.full_name ? authUser.full_name : authUser.mobile}!
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
          <div className="flex w-full items-center justify-between lg:hidden">
            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DrawerTrigger asChild>
                <button className="p-2">
                  <HambergerMenu size={48} className="p-2" color={isScrolled ? "#334155" : "white"} />
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
            {!authUser ? (
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
                  سلام {authUser.full_name ? authUser.full_name : authUser.mobile}!
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
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} showToast={showToast} />
      <div className="h-16 w-full lg:h-22"></div>
    </>
  )
}
