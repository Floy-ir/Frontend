import "styles/tailwind.css"
import type { Metadata } from "next"
import Script from "next/script"

import { ClarityAnalytics } from "@/components/analytics/ClarityAnalytics"
import BaleDynamicBackButton from "@/components/Bale/BaleDynamicBackButton/BaleDynamicBackButton"
import BaleDynamicInitializer from "@/components/Bale/BaleDynamicInitializer/BaleDynamicInitializer"
import BaleScriptLoader from "@/components/Bale/BaleScriptLoader/BaleScriptLoader"
import EitaaDynamicAutoAuth from "@/components/Eitaa/EitaaDynamicAutoAuth/EitaaDynamicAutoAuth"
import EitaaDynamicBackButton from "@/components/Eitaa/EitaaDynamicBackButton/EitaaDynamicBackButton"
import EitaaDynamicInitializer from "@/components/Eitaa/EitaaDynamicInitializer/EitaaDynamicInitializer"
import { ActiveMenuProvider } from "@/components/layout/ActiveMenuProvider/ActiveMenuProvider"
import Footer from "@/components/layout/Footer/Footer"
import { env } from "../env.mjs"
import TelegramDynamicAutoAuth from "@/components/Telegram/TelegramDynamicAutoAuth/TelegramDynamicAutoAuth"
import TelegramDynamicBackButton from "@/components/Telegram/TelegramDynamicBackButton/TelegramDynamicBackButton"
import TelegramDynamicInitializer from "@/components/Telegram/TelegramDynamicInitializer/TelegramDynamicInitializer"
import { anjomanMaxVF } from "../lib/fonts"

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

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

        <Script src="https://developer.eitaa.com/eitaa-web-app.js" strategy="beforeInteractive" />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        {env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta name="google-site-verification" content={env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
        )}
      </head>
      <body className={`${anjomanMaxVF.variable} font-anjoman-max`} suppressHydrationWarning={true}>
        {/* Analytics */}
        <ClarityAnalytics />

        {/* Bale SDK (only when in Bale mini app) */}
        <BaleScriptLoader />

        {/* Mini App Initializers */}
        <EitaaDynamicInitializer />
        <BaleDynamicInitializer />
        <TelegramDynamicInitializer />
        <EitaaDynamicAutoAuth />
        <TelegramDynamicAutoAuth />
        <EitaaDynamicBackButton />
        <BaleDynamicBackButton />
        <TelegramDynamicBackButton />

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
