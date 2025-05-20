"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { Airplane, ArrowRight, ArrowRight2, HambergerMenu } from "iconsax-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "../Button/Button"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "../ui/drawer"

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
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(forceScrolledStyle)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  // This effect updates isScrolled when forceScrolledStyle changes
  useEffect(() => {
    setIsScrolled(forceScrolledStyle || window.scrollY > 50)
  }, [forceScrolledStyle])

  useEffect(() => {
    // Function to handle scroll
    const handleScroll = () => {
      const currentScrollPos = window.scrollY

      // Only set scrolled if we've passed a more significant threshold
      // Always respect forceScrolledStyle if it's true
      const hasScrolledEnough = currentScrollPos > 50

      // Visible if:
      // 1. Scrolling up
      // 2. At the top of the page
      // 3. Mobile menu is open
      const isScrollingUp = prevScrollPos > currentScrollPos
      const isAtTop = currentScrollPos < 70
      const shouldBeVisible = isScrollingUp || isAtTop || mobileMenuOpen

      // Update states
      if (shouldBeVisible) {
        setVisible(true)
      } else {
        setVisible(false)
      }

      // Update isScrolled state - always true if forceScrolledStyle is set
      setIsScrolled(forceScrolledStyle || hasScrolledEnough)

      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener("scroll", handleScroll)

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [prevScrollPos, mobileMenuOpen, forceScrolledStyle])

  // Header classes - apply rounded corners only when not scrolled
  const headerClasses = twMerge(
    "w-full fixed top-0 left-0 right-0 z-20 transition-all duration-300",
    // Only rounded when at the top and not scrolled
    !visible ? "-translate-y-full" : "translate-y-0",
    visible && isScrolled ? "bg-white border-b border-Gray-N200" : "bg-transparent",
    className
  )
  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 768)
    }
    checkScreen()
    window.addEventListener("resize", checkScreen)
    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  // Add smooth scrolling behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  if (pathname.startsWith("/flights") && isSmallScreen) {
    return <></>
  }

  return (
    <>
      <header className={headerClasses}>
        {/* Content container - only constrain width for content, not background */}
        <div className={`mx-auto max-w-[1136px] ${isScrolled ? "w-full" : ""}`}>
          {/* Desktop view */}
          <div className="hidden h-22 items-center justify-between md:flex">
            {/* Logo - Right Side in RTL */}
            <div className="flex items-center gap-2">
              <span className={`text-lg font-semibold ${isScrolled ? "text-Gray-N700" : "text-white"}`}>فلوی</span>
              <Airplane size={20} variant="Bold" className={isScrolled ? "text-Gray-N700" : "text-white"} />
            </div>

            {/* Navigation Menu - Middle */}
            <NavigationMenu.Root className="flex flex-1 justify-center">
              <NavigationMenu.List className="flex flex-row-reverse gap-12">
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
                        <span className="text-lg">{item.label}</span>
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
            {/* Login Button - Left Side in RTL */}
            {/* <div>
              <Button
                href="/login"
                intent="secondary"
                size="small"
                disabled
                className={twMerge(
                  "rounded-xl px-6 py-4",
                  isScrolled
                    ? "bg-Gray-N100 text-Primary-P500main" // Scrolled state styling
                    : "bg-Gray-N100 text-indigo-600"      // Default styling
                )}
              >
                ورود | ثبت‌نام
              </Button>
            </div> */}
          </div>

          {/* Mobile view */}
          <div className="flex items-center justify-between md:hidden">
            {/* Drawer for mobile menu */}
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
                    {menuItems.map((item, index) => {
                      return item.href === "/" ? (
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
                      ) : (
                        <span
                          key={index}
                          className={`w-full px-6 py-3 text-right text-[1.15rem] cursor-not-allowed opacity-50 ${
                            item.isActive ? "font-semibold text-slate-800" : "text-slate-500"
                          }`}
                        >
                          {item.label}
                        </span>
                      )
                    })}
                  </nav>
                </div>
              </DrawerContent>
            </Drawer>

            {/* Login Button */}
            <Button
              href="/login"
              intent="secondary"
              size="small"
              disabled
              className={twMerge(
                "rounded-xl px-4 py-3 text-sm",
                isScrolled
                  ? "bg-Gray-N100 text-Primary-P500main" // Scrolled state styling
                  : "bg-Gray-N100 text-indigo-600" // Default styling
              )}
            >
              ورود | ثبت‌نام
            </Button>
          </div>
        </div>
      </header>

      {/* Spacer div to prevent layout shifts - matches header height */}
      <div className="h-16 w-full md:h-22"></div>
    </>
  )
}
