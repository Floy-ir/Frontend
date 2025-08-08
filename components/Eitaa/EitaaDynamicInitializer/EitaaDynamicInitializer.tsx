"use client"

import dynamic from "next/dynamic"

// Dynamically import EitaaInitializer with no SSR to prevent hydration mismatch
const EitaaInitializer = dynamic(() => import("@/components/Eitaa/EitaaInitializer/EitaaInitializer"), { ssr: false })

export default function EitaaDynamicInitializer() {
  return <EitaaInitializer />
}
