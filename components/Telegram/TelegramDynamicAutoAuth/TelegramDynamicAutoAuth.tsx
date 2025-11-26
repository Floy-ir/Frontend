import dynamic from "next/dynamic"

const TelegramAutoAuth = dynamic(() => import("@/components/Telegram/TelegramAutoAuth/TelegramAutoAuth"), { ssr: true })

export default function TelegramDynamicAutoAuth() {
  return <TelegramAutoAuth />
}
