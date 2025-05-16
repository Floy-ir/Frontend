import "styles/tailwind.css"
import type { Metadata } from "next"

import { ActiveMenuProvider } from "@/components/ActiveMenuProvider/ActiveMenuProvider"
import Footer from "@/components/Footer/Footer"
import { anjomanMaxVF } from "../lib/fonts"

// Define metadata
export const metadata: Metadata = {
  title: "فلوی | موتور جستجوی بلیط هواپیما و رزرو اقامتگاه",
  description: "فلوی | موتور جستجوی بلیط هواپیما و رزرو اقامتگاه",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${anjomanMaxVF.variable} font-anjoman-max`}>
        {/* Global Header with dynamic active state */}

        <ActiveMenuProvider />

        {/* Main Content */}
        <main className="min-h-screen">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  )
}
