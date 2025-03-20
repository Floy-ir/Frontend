import { Eye, User } from "iconsax-react"
import { Metadata } from "next"

import { Header } from "components/Header/Header"
import { TextField } from "components/TextField/TextField"

export const metadata: Metadata = {
  title: "Next.js Enterprise Boilerplate",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://next-enterprise.vercel.app/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://raw.githubusercontent.com/Blazity/next-enterprise/main/.github/assets/project-logo.png",
      },
    ],
  },
}

export default function Web() {
  const menuItems = [
    { label: "صفحه اصلی", href: "/", isActive: true },
    { label: "پشتیبانی", href: "/support" },
    { label: "بلاگ", href: "/blog" },
    { label: "درباره ما", href: "/about" },
  ]

  return (
    <>
      <main className="rtl flex min-h-screen flex-col items-center bg-white px-4 py-6">
        <Header menuItems={menuItems} className="mb-8 bg-white" />

        <div className="container mx-auto mt-12 text-center">
          <h1 className="text-3xl font-bold text-slate-900"> فلوی، پرواز تا بی نهایت</h1>
          <p className="mt-4 text-slate-600">این یک متن چرت و پرت است که توسط یک نفر نوشته شده است.</p>
        </div>
        <div className="p-8">
          <TextField
            label="عنوان"
            placeholder="متن ورودی"
            // prefix="پیشوند"
            // suffix="پسوند"
            helperText="متن راهنما"
            maxLength={20}
            showCharCount
            leftIcon={<Eye color="var(--color-Gray-N500)" />}
            rightIcon={<User color="var(--color-Gray-N500)" />}
            dir="rtl"
            width="md"
          />
        </div>
      </main>
    </>
  )
}
