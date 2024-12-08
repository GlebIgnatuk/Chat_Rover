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
            auth__nickname__title: 'Welcome, Rover!',
            auth__nickname__text:
                "We'd like to see you in our world. Let's proceed with a quick setup. Please write your name below.",
            auth__profile__info1: "Let's create a profile!",
            auth__profile__info2: 'Tap to start',
            auth__profile__nickname_placeholder: 'Your nickname...',
            auth__profile__uid: 'UID',
            auth__profile__about: 'About',
            auth__profile__about_placeholder: 'Looking for rovers to play together...',
            auth__profile__info: 'Info',
            auth__profile__world_level: 'World level',
            auth__profile__voice: 'Voice',
            auth__profile__languages: 'Languages',

            general__loading: 'Loading',
            general__continue: 'Continue',
            general__create: 'Create',
            general__languages__en: 'English',
            'general__languages__zh-CN': 'Chinise (simplified)',
            'general__languages__zh-HK': 'Chinise (traditional)',
            general__languages__ja: 'Japanese',
            general__languages__ko: 'Korean',
            general__languages__fr: 'French',
            general__languages__de: 'German',
            general__languages__es: 'Spanish',

            search__filters: 'Filters',
            search__characters: 'Characters',

            nav__chat: 'Chat',
            nav__guides: 'Guides',
            nav__search: 'Search',
            nav__messages: 'Messages',
            nav__account: 'Account',
        },
        ru: {
            auth__greeting: 'Привет',
            auth__nickname__title: 'Привет, Ровер!',
            auth__nickname__text:
                'Мы бы хотели видеть тебя в нашем мире. Давай быстренько всё оформим. Пожалуйста укажи своё имя ниже.',
            auth__profile__info1: 'Давай создадим профиль!',
            auth__profile__info2: 'Нажми чтобы начать',
            auth__profile__nickname: 'Твой никнейм...',
            auth__profile__uid: 'UID',
            auth__profile__about: 'О Себе',
            auth__profile__about_placeholder: 'Ищу Роверов для совместной игры...',
            auth__profile__info: 'Инфо',
            auth__profile__world_level: 'Уровень мира',
            auth__profile__voice: 'Общение',
            auth__profile__languages: 'Языки',

            general__loading: 'Загрузка',
            general__continue: 'Продолжить',
            general__create: 'Создать',
            general__languages__en: 'English',
            'general__languages__zh-CN': 'Китайский (упрощенный)',
            'general__languages__zh-HK': 'Китайский (традиционный)',
            general__languages__ja: 'Японский',
            general__languages__ko: 'Корейский',
            general__languages__fr: 'Французский',
            general__languages__de: 'Немецкий',
            general__languages__es: 'Испанский',

            search__filters: 'Фильтры',
            search__characters: 'Персонажи',

            nav__chat: 'Чат',
            nav__guides: 'Билды',
            nav__search: 'Поиск',
            nav__messages: 'Личка',
            nav__account: 'Аккаунт',
        },
    }

    await new Promise((res) => setTimeout(res, 2100))

    if (language in intl) {
        res.json({ success: true, data: intl[language as keyof typeof intl] })
    } else {
        res.json({ success: true, data: intl['en'] })
    }
}
