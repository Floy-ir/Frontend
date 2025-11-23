"use client"

import { useBaleBackButton } from "@/hooks/useBaleBackButton"

/**
 * Component that integrates Bale back button with Next.js router
 */
const BaleBackButton: React.FC = () => {
  useBaleBackButton()
  return null
}

export default BaleBackButton
