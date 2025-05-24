import React from "react"

export default function FlightsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Main content */}
      {children}
    </div>
  )
}
