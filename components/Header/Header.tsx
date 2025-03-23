"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { Airplane, HambergerMenu } from "iconsax-react"
import Link from "next/link"
import React, { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "../Button/Button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "../ui/drawer"

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
      true: ["text-white", "font-semibold"],
      false: ["text-white", "font-normal", "hover:text-white/90"],
    },
  },
  defaultVariants: {
    isActive: false,
  },
})

export function Header({ menuItems, className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className={twMerge("w-full rounded-3xl sticky top-0 z-50", className)}>
      {/* Desktop view */}
      <div className="hidden items-center justify-between md:flex h-22">
        {/* Logo - Right Side in RTL */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-white">لوگو</span>
          <Airplane size={20} variant="Bold" className="text-white" />
        </div>

        {/* Navigation Menu - Middle */}
        <NavigationMenu.Root className="flex flex-1 justify-center">
          <NavigationMenu.List className="flex flex-row-reverse gap-12">
            {menuItems.map((item, index) => (
              <NavigationMenu.Item key={index}>
                <NavigationMenu.Link asChild>
                  <Link href={item.href} className={navItem({ isActive: item.isActive })}>
                    <span className="text-lg">{item.label}</span>
                    {item.isActive && (
                      <div className="relative h-1 w-1">
                        <div className="absolute h-1.5 w-1.5 rounded-sm bg-white"></div>
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
            className="rounded-xl bg-Gray-N100 px-6 py-4 text-indigo-600"
          >
            ورود | ثبت‌نام
          </Button>
        </div>
      </div>

      {/* Mobile view */}
      <div className="flex items-center justify-between md:hidden">
        {/* Drawer for mobile menu */}
        <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DrawerTrigger asChild>
            <button className="p-2">
              <HambergerMenu
                size={48}
                className="p-2"
                color="white"
              />
              <span className="sr-only">Toggle Menu</span>
            </button>
          </DrawerTrigger>
          <DrawerContent className="z-50 max-h-[80vh] bg-white p-0">
            <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
            <div className="overflow-auto p-6">
              <nav className="flex flex-col items-end space-y-3">
                {menuItems.map((item, index) => (
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

        {/* Login Button */}
        <Button
          href="/login"
          intent="secondary"
          size="small"
          className="rounded-xl bg-Gray-N100 px-4 py-3 text-sm text-indigo-600"
        >
          ورود | ثبت‌نام
        </Button>
      </div>
    </header>
  )
}
