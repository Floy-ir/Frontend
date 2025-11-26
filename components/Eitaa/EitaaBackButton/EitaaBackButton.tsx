"use client"

import React from "react"
import { useEitaaBackButton } from "@/hooks/useEitaaBackButton"

/**
 * Component that integrates Eitaa back button with Next.js router
 *
 * This component automatically:
 * - Shows the Eitaa back button when running in Eitaa mini app
 * - Handles back button clicks using Next.js router navigation
 * - Hides the back button when the component unmounts
 *
 * The component renders nothing (null) as it only manages the back button state.
 */
const EitaaBackButton: React.FC = () => {
  useEitaaBackButton()

  return null
}

export default EitaaBackButton
