const DEFAULT_BACKEND_ORIGIN = 'http://10.100.48.139:8081'

export const BACKEND_ORIGIN =
  import.meta.env.VITE_BACKEND_ORIGIN || DEFAULT_BACKEND_ORIGIN

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : BACKEND_ORIGIN)

const defaultWsOrigin = BACKEND_ORIGIN.replace(/^http/, 'ws')
const proxyWsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
export const WS_URL = import.meta.env.VITE_WS_URL || (import.meta.env.DEV ? proxyWsUrl : `${defaultWsOrigin}/ws`)
