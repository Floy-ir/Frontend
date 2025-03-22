"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { Airplane, HambergerMenu } from "iconsax-react"
import Link from "next/link"
import React, { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "../Button/Button"

interface MenuItem {
  label: string
  href: string
  isActive?: boolean
}

interface HeaderProps {
  menuItems: MenuItem[]
  className?: string
}

const navItem = cva(["flex", "flex-col", "items-center", "gap-1"], {
  variants: {
    isActive: {
      true: ["text-slate-800", "font-semibold"],
      false: ["text-slate-500", "font-medium", "hover:text-slate-700"],
    },
  },
  defaultVariants: {
    isActive: false,
  },
})

export function Header({ menuItems, className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className={twMerge("max-w-8xl mx-auto w-full rounded-3xl px-6 py-6", className)}>
      {/* Desktop view */}
      <div className="hidden items-center justify-between md:flex">
        {/* Logo - Right Side in RTL */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-slate-800">لوگو</span>
          <Airplane size={20} variant="Bold" className="text-blue-600" />
        </div>

        {/* Navigation Menu - Middle */}
        <NavigationMenu.Root className="flex flex-1 justify-center">
          <NavigationMenu.List className="flex flex-row-reverse gap-12">
            {menuItems.map((item, index) => (
              <NavigationMenu.Item key={index}>
                <NavigationMenu.Link asChild>
                  <Link href={item.href} className={navItem({ isActive: item.isActive })}>
                    <span className="text-base">{item.label}</span>
                    {item.isActive && (
                      <div className="relative h-1 w-1">
                        <div className="absolute h-1.5 w-1.5 rounded-sm bg-emerald-500"></div>
                      </div>
                    )}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {/* Login Button - Left Side in RTL */}
        <div>
          <Button
            href="/login"
            intent="secondary"
            size="small"
            className="rounded-xl bg-slate-100 px-6 py-4 text-indigo-600"
          >
            ورود | ثبت‌نام
          </Button>
        </div>
      </div>

      {/* Mobile view */}
      <div className="flex items-center justify-between md:hidden">
        {/* Hamburger Menu */}
        <HambergerMenu
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          size={48}
          className="p-2"
          color="var(--color-Gray-N500)"
        />

        {/* Login Button */}
        <Button
          href="/login"
          intent="secondary"
          size="small"
          className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-indigo-600"
        >
          ورود | ثبت‌نام
        </Button>
      </div>

      {/* Mobile menu (shown when mobileMenuOpen is true) */}
      {mobileMenuOpen && (
        <div className="mt-4 rounded-xl bg-white py-2 shadow-md md:hidden">
          <nav className="flex flex-col items-end">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`w-full px-6 py-3 text-right ${
                  item.isActive ? "font-semibold text-slate-800" : "text-slate-500"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
