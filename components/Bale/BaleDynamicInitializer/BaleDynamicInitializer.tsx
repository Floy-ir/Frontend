import dynamic from "next/dynamic"

const BaleInitializer = dynamic(() => import("@/components/Bale/BaleInitializer/BaleInitializer"), { ssr: true })

export default function BaleDynamicInitializer() {
  return <BaleInitializer />
}
