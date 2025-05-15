"use client"

import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header/Header'
import { useEffect, useMemo, useState } from 'react'

type MenuItem = {
  label: string
  href: string
  isActive: boolean
}

export function ActiveMenuProvider() {
  const pathname = usePathname()
  // Use state to ensure re-render when path changes
  const [currentPath, setCurrentPath] = useState(pathname)
  
  // Update currentPath when pathname changes
  useEffect(() => {
    setCurrentPath(pathname)
  }, [pathname])
  
  // Base menu items
  const baseMenuItems: MenuItem[] = [
    { label: "صفحه اصلی", href: "/", isActive: false },
    { label: "پروازها", href: "/flights", isActive: false },
    { label: "هتل‌ها", href: "/hotels", isActive: false },
    { label: "اقامتگاه‌ها", href: "/accommodations", isActive: false },
    { label: "درباره ما", href: "/about", isActive: false },
  ]
  
  // Determine active menu item based on current path
  const menuItems = useMemo(() => {
    return baseMenuItems.map(item => ({
      ...item,
      isActive: item.href === '/' 
        ? currentPath === '/' 
        : currentPath.startsWith(item.href)
    }))
  }, [currentPath])
  
  // Force scrolled style on all pages except the home page
  const forceScrolledStyle = currentPath !== '/'
  
  return <Header 
    menuItems={menuItems} 
    forceScrolledStyle={forceScrolledStyle} 
    key={`header-${currentPath}`} // Force re-render when path changes
  />
} 