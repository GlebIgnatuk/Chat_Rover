export const pathPrefix = ''
export const ACTIVITY_POLLING_INTERVAL = 30 * 1000

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

export const FAKE_PROFILES = names
    .map((name, idx) => ({
        id: idx + 1,
        first_name: name.split(' ')[0],
        last_name: name.split(' ')[1] || null,
        username: name.toLowerCase().trim().replace(/[^\w]/g, '_'),
        language_code: 'en',
        is_premium: true,
        allows_write_to_pm: true,
    }))
    .map((p) => {
        const params = new URLSearchParams()
        params.set('user', JSON.stringify(p))
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
            user: p,
            encoded: params.toString(),
        }
    })
