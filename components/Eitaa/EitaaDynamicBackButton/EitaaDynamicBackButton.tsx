import dynamic from "next/dynamic"

const EitaaBackButton = dynamic(() => import("@/components/Eitaa/EitaaBackButton/EitaaBackButton"), { ssr: true })

export default function EitaaDynamicBackButton() {
  return <EitaaBackButton />
}

