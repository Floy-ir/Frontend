import "styles/tailwind.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="font-family-anjoman-max">
      <body>{children}</body>
    </html>
  )
}
