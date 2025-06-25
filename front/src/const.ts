const HOST = "localhost:4000"
// const PROD_HOST = "tough-apt-stag.ngrok-free.app"
const PROD_HOST = "tung-ps42-modern-8ra.barking-duckbill.ts.net"
export const GH_PROJECT = "chat"
export const BACKEND_URL = `http://${HOST}/${GH_PROJECT}`
export const PROD_BACKEND_URL = `https://${PROD_HOST}/${GH_PROJECT}`
export const WS_URL = `ws://${HOST}/${GH_PROJECT}/socket/websocket`
export const PROD_WS_URL = `ws://${PROD_HOST}/${GH_PROJECT}/socket/websocket`
