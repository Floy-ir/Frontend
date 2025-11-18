import dynamic from "next/dynamic"

const EitaaBackButton = dynamic(() => import("@/components/Eitaa/EitaaBackButton/EitaaBackButton"), { ssr: false })

export default function EitaaDynamicBackButton() {
  return <EitaaBackButton />
}

