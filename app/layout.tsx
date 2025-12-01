import "styles/tailwind.css"
import type { Metadata } from "next"
import Script from "next/script"

import { ClarityAnalytics } from "@/components/analytics/ClarityAnalytics"
import { ActiveMenuProvider } from "@/components/layout/ActiveMenuProvider/ActiveMenuProvider"
import Footer from "@/components/layout/Footer/Footer"
import MiniAppRuntime from "@/components/miniapp/MiniAppRuntime/MiniAppRuntime"
import { MINIAPP_SDK_READY_EVENT } from "@/utils/miniapp"
import { anjomanMaxVF } from "../lib/fonts"

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const EITAA_SDK_SRC = "https://developer.eitaa.com/eitaa-web-app.js"
const BALE_SDK_SRC = "https://tapi.bale.ai/miniapp.js?3"

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
      { url: "/favicon/dark-favicon.png", media: "(prefers-color-scheme: dark)", type: "image/x-icon" },
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
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-gtag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}

        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />

        {/* Eitaa MiniApp SDK (always loaded) */}
        <Script
          src={EITAA_SDK_SRC}
          strategy="beforeInteractive"
          onLoad={() => {
            window.dispatchEvent(new Event(MINIAPP_SDK_READY_EVENT))
          }}
        />

        {/* Bale MiniApp SDK */}
        <Script
          src={BALE_SDK_SRC}
          strategy="afterInteractive"
          onLoad={() => {
            window.dispatchEvent(new Event(MINIAPP_SDK_READY_EVENT))
          }}
        />
      </head>
      <body className={`${anjomanMaxVF.variable} font-anjoman-max`} suppressHydrationWarning={true}>
        {/* Analytics */}
        <ClarityAnalytics />

        {/* Mini App Runtime (only when in mini app) */}
        <MiniAppRuntime />

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
