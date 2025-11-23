import { getBaleUserFirstName, isRunningInBale, openExternalLink as openBaleExternalLink } from "./bale"
import { getEitaaUserFirstName, isRunningInEitaa, openExternalLink as openEitaaExternalLink } from "./eitaa"

type LinkOptions = {
  target?: string
  rel?: string
  [key: string]: string | undefined
}

export const isRunningInMiniApp = (): boolean => isRunningInEitaa() || isRunningInBale()

export const openMiniAppExternalLink = (url: string, options?: LinkOptions): void => {
  if (isRunningInBale()) {
    openBaleExternalLink(url, options)
    return
  }

  if (isRunningInEitaa()) {
    openEitaaExternalLink(url, options)
    return
  }

  if (typeof window !== "undefined") {
    window.open(url, options?.target ?? "_blank")
  }
}

export const getMiniAppFirstName = (): string | undefined => {
  return getEitaaUserFirstName() ?? getBaleUserFirstName()
}
