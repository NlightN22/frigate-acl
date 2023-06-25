require('dotenv').config()
export const host = process.env.SERVER_HOST || 'localhost'
export const port = process.env.SERVER_PORT || '3333'
export const hostURL = new URL ('http://' + host + ':' + port)
export const frontendURL = new URL (process.env.FRIGATE_FROTEND_SERVER || '')
export const wsFrontendURL = new URL (frontendURL.toString().replace(/^http/, 'ws'))
export const mongoDbUrl = new URL(process.env.MONGODB_URI || '')
// export const wsFrontendURL = frontendURL.replace(/^http/, 'ws') || ''