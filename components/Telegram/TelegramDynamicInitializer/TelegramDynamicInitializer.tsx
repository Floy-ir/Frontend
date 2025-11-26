import dynamic from "next/dynamic"

const TelegramInitializer = dynamic(() => import("@/components/Telegram/TelegramInitializer/TelegramInitializer"), {
  ssr: true,
})

export default function TelegramDynamicInitializer() {
  return <TelegramInitializer />
}
