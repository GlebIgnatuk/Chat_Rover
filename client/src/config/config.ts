export const ACTIVITY_POLLING_INTERVAL = 30 * 1000

export const PATH_PREFIX = '/app'
export const AUTH_PATH_PREFIX = '/auth'
export const PROTECTED_PATH_PREFIX = '/'

export const DEBUG = import.meta.env.DEV
export const SUPPORTED_SERVERS = ['SEA', 'Asia', 'Europe', 'HMT', 'America'] as const

const names = [
    'Whitney Luna',
    'Mehmet Carpenter',
    'Ciaran Mckee',
    'Leona Jacobs',
    'Bonnie Bentley',
    'Millicent Hendricks',
    'Jaden Sparks',
    'Rajan Shannon',
    'Tamsin Leach',
    'Fahad Paul',
]

export type FakeProfile = {
    id: number
    first_name: string
    last_name: string | null
    username: string
    language_code: string
    is_premium: boolean
    allows_write_to_pm: boolean
}

const randomString = (min: number, max: number) => {
    const length = Math.floor(Math.random() * (max - min)) + min
    const sequence = Array.from({ length }, () => Math.floor(Math.random() * (122 - 97)) + 97)

    return String.fromCharCode(...sequence)
}

export const generateFakeProfile = (
    from: Partial<FakeProfile>,
): { profile: FakeProfile; encoded: string } => {
    const username = from.username ?? randomString(4, 10)

    const profile: FakeProfile = {
        id: from.id ?? Math.floor(Date.now() / 1000),
        username: username,
        first_name: from.first_name ?? username,
        last_name: from.last_name ?? null,
        allows_write_to_pm: from.allows_write_to_pm ?? true,
        is_premium: from.is_premium ?? false,
        language_code: from.language_code ?? 'en',
    }

    const params = new URLSearchParams()
    params.set('user', JSON.stringify(profile))
    params.set('chat_instance', '-1')
    params.set('chat_type', 'private')
    params.set('auth_date', Math.floor(Date.now() / 1000).toString())
    params.set('hash', '-1')
    params.set('tgWebAppVersion', '7.10')
    params.set('tgWebAppPlatform', 'web')
    params.set(
        'tgWebAppThemeParams',
        JSON.stringify({
            bg_color: '#212121',
            button_color: '#8774e1',
            button_text_color: '#ffffff',
            hint_color: '#aaaaaa',
            link_color: '#8774e1',
            secondary_bg_color: '#181818',
            text_color: '#ffffff',
            header_bg_color: '#212121',
            accent_text_color: '#8774e1',
            section_bg_color: '#212121',
            section_header_text_color: '#8774e1',
            subtitle_text_color: '#aaaaaa',
            destructive_text_color: '#ff595a',
        }),
    )

    return {
        profile: profile,
        encoded: params.toString(),
    }
}

export const FAKE_PROFILES = names.map((name, idx) =>
    generateFakeProfile({
        id: idx + 1,
        first_name: name.split(' ')[0],
        last_name: name.split(' ')[1] || null,
        username: name.toLowerCase().trim().replace(/[^\w]/g, '_'),
        language_code: idx % 2 === 0 ? 'ru' : 'en',
        is_premium: true,
        allows_write_to_pm: true,
    }),
)
