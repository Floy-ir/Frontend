import "styles/tailwind.css"
import type { Metadata } from "next"
import Script from "next/script"

import { ActiveMenuProvider } from "@/components/layout/ActiveMenuProvider/ActiveMenuProvider"
import EitaaDynamicInitializer from "@/components/Eitaa/EitaaDynamicInitializer/EitaaDynamicInitializer"
import Footer from "@/components/layout/Footer/Footer"
import { anjomanMaxVF } from "../lib/fonts"

// Define metadata
export const metadata: Metadata = {
  title: "فلوی | موتور جستجوی بلیط هواپیما و رزرو اقامتگاه",
  description: "فلوی | موتور جستجوی بلیط هواپیما و رزرو اقامتگاه",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png" }],
    other: [
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <Script src="https://developer.eitaa.com/eitaa-web-app.js" strategy="beforeInteractive" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body className={`${anjomanMaxVF.variable} font-anjoman-max`} suppressHydrationWarning={true}>
        {/* Eitaa Mini App Initializer */}
        <EitaaDynamicInitializer />

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
