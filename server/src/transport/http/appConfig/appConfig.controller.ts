import { SUPPORTED_LANGUAGES, SUPPORTED_SERVERS } from '@/config/config'
import { IRequestHandler } from '../types'

export const get: IRequestHandler = (req, res) => {
    const config = {
        game: {
            languages: SUPPORTED_LANGUAGES,
            servers: SUPPORTED_SERVERS,
        },
        app: {
            // @todo put into db
            languages: ['en', 'ru'],
        },
    }

    res.json({ success: true, data: config })
}

export const getIntl: IRequestHandler = async (req, res) => {
    const language = req.params.language

    // @todo put into db
    const intl: Record<string, any> = {
        en: {
            auth__greeting: 'Hello',

            general__loading: 'Loading',
        },
        ru: {
            auth__greeting: 'Привет',

            general__loading: 'Загрузка',
        },
    }

    await new Promise((res) => setTimeout(res, 2100))

    if (language in intl) {
        res.json({ success: true, data: intl[language as keyof typeof intl] })
    } else {
        res.json({ success: true, data: intl['en'] })
    }
}
