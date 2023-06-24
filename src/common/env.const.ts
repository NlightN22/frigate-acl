require('dotenv').config()
export const hostURL = 'http://' + process.env.SERVER_HOST + ':' + process.env.SERVER_PORT
export const frontendURL = process.env.FRIGATE_FROTEND_SERVER || ''
export const wsFrontendURL = process.env.FRIGATE_FROTEND_SERVER?.replace(/^http/, 'ws') || ''