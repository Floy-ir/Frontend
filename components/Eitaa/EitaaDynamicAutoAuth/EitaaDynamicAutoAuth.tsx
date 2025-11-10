import dynamic from "next/dynamic"

const EitaaAutoAuth = dynamic(() => import("@/components/Eitaa/EitaaAutoAuth/EitaaAutoAuth"), { ssr: false })

export default function EitaaDynamicAutoAuth() {
  return <EitaaAutoAuth />
}
