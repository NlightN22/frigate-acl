require('dotenv').config()
export const host = process.env.SERVER_HOST || 'localhost'
export const port = process.env.SERVER_PORT || '3333'
export const hostURL = 'http://' + host + ':' + port
export const frontendURL = process.env.FRIGATE_FROTEND_SERVER || ''
export const wsFrontendURL = frontendURL.replace(/^http/, 'ws') || ''