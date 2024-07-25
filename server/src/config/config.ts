import path from 'path'

export const dev = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'hmr'
export const ROOT_DIR = path.join(__dirname, '..')
export const GATEWAY_PATH = '/clickerMiniapp'
