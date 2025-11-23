import dynamic from "next/dynamic"

const BaleBackButton = dynamic(() => import("@/components/Bale/BaleBackButton/BaleBackButton"), { ssr: true })

export default function BaleDynamicBackButton() {
  return <BaleBackButton />
}
