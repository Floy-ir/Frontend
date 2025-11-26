import dynamic from "next/dynamic"

const TelegramBackButton = dynamic(() => import("@/components/Telegram/TelegramBackButton/TelegramBackButton"), {
  ssr: true,
})

export default function TelegramDynamicBackButton() {
  return <TelegramBackButton />
}
