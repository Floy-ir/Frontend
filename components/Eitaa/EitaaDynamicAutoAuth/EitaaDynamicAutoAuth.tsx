import dynamic from "next/dynamic"

const EitaaAutoAuth = dynamic(() => import("@/components/Eitaa/EitaaAutoAuth/EitaaAutoAuth"), { ssr: true })

export default function EitaaDynamicAutoAuth() {
  return <EitaaAutoAuth />
}
