import path from 'path'

export const dev = process.env.NODE_ENV !== 'production'
export const hmr = process.env.NODE_ENV === 'hmr'
export const ROOT_DIR = path.join(__dirname, '..')
export const PORT = parseInt(process.env.PORT || (hmr ? '4000' : '3000'))

const keys = ['TELEGRAM_BOT_TOKEN', 'MONGO_URI', 'ALLOW_FAKE_PROFILES', 'OPENAI_API_KEY'] as const

export type Config = Record<(typeof keys)[number], string>

export const config = keys.reduce<Partial<Config>>((acc, n) => {
    acc[n] = process.env[n] || ''

    if (acc[n] === '') console.warn(`config[${n}] is not provided`)

    return acc
}, {}) as Config

export const SUPPORTED_SERVERS = ['SEA', 'Asia', 'Europe', 'HMT', 'America'] as const
export type IServerKey = (typeof SUPPORTED_SERVERS)[number]

export const SUPPORTED_LANGUAGES = ['en', 'zh-CN', 'zh-HK', 'ja', 'ko', 'fr', 'de', 'es'] as const
export type ILanguageKey = (typeof SUPPORTED_LANGUAGES)[number]
