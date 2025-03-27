import "styles/tailwind.css"
import { anjomanMaxVF } from "../lib/fonts"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${anjomanMaxVF.variable} font-anjoman-max`}>
      <body>{children}</body>
    </html>
  )
}
