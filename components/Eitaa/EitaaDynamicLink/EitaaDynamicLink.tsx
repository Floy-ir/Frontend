"use client"

import dynamic from "next/dynamic"
import { ReactNode } from "react"

// Dynamically import EitaaLink with no SSR to prevent hydration mismatch
const EitaaLink = dynamic(() => import("@/components/Eitaa/EitaaLink/EitaaLink"), { ssr: true })

interface EitaaDynamicLinkProps {
  href: string
  children: ReactNode
  className?: string
  options?: {
    target?: string
    rel?: string
    [key: string]: string | undefined
  }
}

export default function EitaaDynamicLink({ href, children, className, options }: EitaaDynamicLinkProps) {
  return (
    <EitaaLink href={href} className={className} options={options}>
      {children}
    </EitaaLink>
  )
}
