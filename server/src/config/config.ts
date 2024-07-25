import path from 'path'

export const dev = process.env.APP_ENV !== 'production'
export const ROOT_DIR = path.join(__dirname, '..')
export const GATEWAY_PATH = '/clickerMiniapp'
