import "styles/tailwind.css"
import type { Metadata } from "next"
import Script from "next/script"

import { ClarityAnalytics } from "@/components/analytics/ClarityAnalytics"
import { ActiveMenuProvider } from "@/components/layout/ActiveMenuProvider/ActiveMenuProvider"
import Footer from "@/components/layout/Footer/Footer"
import MiniAppRuntime from "@/components/miniapp/MiniAppRuntime/MiniAppRuntime"
import { anjomanMaxVF } from "../lib/fonts"

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

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
        <Script src="https://developer.eitaa.com/eitaa-web-app.js" strategy="beforeInteractive" />

        {/* Microsoft Clarity */}
        {CLARITY_PROJECT_ID && (
          <Script id="clarity-snippet" strategy="beforeInteractive">
            {`
              (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            `}
          </Script>
        )}
      </head>
      <body className={`${anjomanMaxVF.variable} font-anjoman-max`} suppressHydrationWarning={true}>
        {/* Analytics */}
        <ClarityAnalytics />

        {/* Mini App Runtime (only when in mini app) */}
        <MiniAppRuntime />

        {/* Global Header with dynamic active state */}
        <ActiveMenuProvider />

        {/* Main Content */}
        <main className="min-h-screen" data-clarity-region="app-shell">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  )
}
