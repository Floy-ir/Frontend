declare function getConfig(): {
  publicRuntimeConfig: Record<string, unknown>
  serverRuntimeConfig: Record<string, unknown>
}

export = getConfig
