import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | Slider Components",
    default: "Slider Components Demo",
  },
  description: "Interactive slider components built with Radix UI",
}

export default function SliderDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  )
} 