import { MongoDBService } from '@/services/database'
import { TranslationModel, ITranslationModel } from '@/models/translation'

async function main() {
    // Establish a connection to the database
    await MongoDBService.lazy(process.env.MONGO_URI)

    // Clear the existing translations
    await TranslationModel.getCollection().deleteMany({})

    const now = new Date()

    // All translations (from appConfig.controller.ts)
    const translations: Record<string, Record<string, { description: string; value: string }>> = {
        en: {
            auth__greeting: {
                description: 'todo',
                value: 'Hello',
            },
            auth__nickname__title: {
                description: 'todo',
                value: 'Welcome, Rover!',
            },
            auth__nickname__text: {
                description: 'todo',
                value: "We'd like to see you in our world. Let's proceed with a quick setup. Please write your name below.",
            },
            auth__profile__info1: {
                description: 'todo',
                value: "Let's create a profile!",
            },
            auth__profile__info2: {
                description: 'todo',
                value: 'Tap to start',
            },
            auth__profile__nickname_placeholder: {
                description: 'todo',
                value: 'Your nickname...',
            },
            auth__profile__uid: {
                description: 'todo',
                value: 'UID',
            },
            auth__profile__about: {
                description: 'todo',
                value: 'About',
            },
            auth__profile__about_placeholder: {
                description: 'todo',
                value: 'Looking for rovers to play together...',
            },
            auth__profile__info: {
                description: 'todo',
                value: 'Info',
            },
            auth__profile__world_level: {
                description: 'todo',
                value: 'World level',
            },
            auth__profile__voice: {
                description: 'todo',
                value: 'Voice',
            },
            auth__profile__languages: {
                description: 'todo',
                value: 'Languages',
            },
            general__loading: {
                description: 'todo',
                value: 'Loading',
            },
            general__continue: {
                description: 'todo',
                value: 'Continue',
            },
            general__create: {
                description: 'todo',
                value: 'Create',
            },
            general__languages__en: {
                description: 'todo',
                value: 'English',
            },
            'general__languages__zh-CN': {
                description: 'todo',
                value: 'Chinise (simplified)',
            },
            'general__languages__zh-HK': {
                description: 'todo',
                value: 'Chinise (traditional)',
            },
            general__languages__ja: {
                description: 'todo',
                value: 'Japanese',
            },
            general__languages__ko: {
                description: 'todo',
                value: 'Korean',
            },
            general__languages__fr: {
                description: 'todo',
                value: 'French',
            },
            general__languages__de: {
                description: 'todo',
                value: 'German',
            },
            general__languages__es: {
                description: 'todo',
                value: 'Spanish',
            },
            general__yes: {
                description: 'todo',
                value: 'Yes',
            },
            general__no: {
                description: 'todo',
                value: 'No',
            },
            general__error: {
                description: 'todo',
                value: 'Error',
            },
            general__dismiss: {
                description: 'todo',
                value: 'Dismiss',
            },
            search__filters: {
                description: 'todo',
                value: 'Filters',
            },
            search__characters: {
                description: 'todo',
                value: 'Characters',
            },
            nav__chat: {
                description: 'todo',
                value: 'Chat',
            },
            nav__guides: {
                description: 'todo',
                value: 'Guides',
            },
            nav__search: {
                description: 'todo',
                value: 'Search',
            },
            nav__messages: {
                description: 'todo',
                value: 'Messages',
            },
            nav__account: {
                description: 'todo',
                value: 'Account',
            },
            exports__error__bot_start: {
                description: 'todo',
                value: "If you didn't receive the exported image make sure that you started the bot %url. Come back and repeat the export.",
            },
        },
        ru: {
            auth__greeting: {
                description: 'todo',
                value: 'Привет',
            },
            auth__nickname__title: {
                description: 'todo',
                value: 'Привет, Ровер!',
            },
            auth__nickname__text: {
                description: 'todo',
                value: 'Мы бы хотели видеть тебя в нашем мире. Давай быстренько всё оформим. Пожалуйста укажи своё имя ниже.',
            },
            auth__profile__info1: {
                description: 'todo',
                value: 'Давай создадим профиль!',
            },
            auth__profile__info2: {
                description: 'todo',
                value: 'Нажми чтобы начать',
            },
            auth__profile__nickname_placeholder: {
                description: 'todo',
                value: 'Твой никнейм...',
            },
            auth__profile__uid: {
                description: 'todo',
                value: 'UID',
            },
            auth__profile__about: {
                description: 'todo',
                value: 'О Себе',
            },
            auth__profile__about_placeholder: {
                description: 'todo',
                value: 'Ищу Роверов для совместной игры...',
            },
            auth__profile__info: {
                description: 'todo',
                value: 'Инфо',
            },
            auth__profile__world_level: {
                description: 'todo',
                value: 'Уровень мира',
            },
            auth__profile__voice: {
                description: 'todo',
                value: 'Общение',
            },
            auth__profile__languages: {
                description: 'todo',
                value: 'Языки',
            },
            general__loading: {
                description: 'todo',
                value: 'Загрузка',
            },
            general__continue: {
                description: 'todo',
                value: 'Продолжить',
            },
            general__create: {
                description: 'todo',
                value: 'Создать',
            },
            general__languages__en: {
                description: 'todo',
                value: 'English',
            },
            'general__languages__zh-CN': {
                description: 'todo',
                value: 'Китайский (упрощенный)',
            },
            'general__languages__zh-HK': {
                description: 'todo',
                value: 'Китайский (традиционный)',
            },
            general__languages__ja: {
                description: 'todo',
                value: 'Японский',
            },
            general__languages__ko: {
                description: 'todo',
                value: 'Корейский',
            },
            general__languages__fr: {
                description: 'todo',
                value: 'Французский',
            },
            general__languages__de: {
                description: 'todo',
                value: 'Немецкий',
            },
            general__languages__es: {
                description: 'todo',
                value: 'Испанский',
            },
            general__yes: {
                description: 'todo',
                value: 'Да',
            },
            general__no: {
                description: 'todo',
                value: 'Нет',
            },
            general__error: {
                description: 'todo',
                value: 'Ошибка',
            },
            general__dismiss: {
                description: 'todo',
                value: 'Скрыть',
            },
            search__filters: {
                description: 'todo',
                value: 'Фильтры',
            },
            search__characters: {
                description: 'todo',
                value: 'Персонажи',
            },
            nav__chat: {
                description: 'todo',
                value: 'Чат',
            },
            nav__guides: {
                description: 'todo',
                value: 'Билды',
            },
            nav__search: {
                description: 'todo',
                value: 'Поиск',
            },
            nav__messages: {
                description: 'todo',
                value: 'Личка',
            },
            nav__account: {
                description: 'todo',
                value: 'Аккаунт',
            },
            exports__error__bot_start: {
                description: 'todo',
                value: 'Если вы не получили картинку проверьте что вы начали беседу с ботом %url. Попробуйте еще раз.',
            },
        },
    }

    // Prepare translations for insertion
    const mappedTranslations: Omit<ITranslationModel, 'createdAt' | 'updatedAt'>[] = []

    for (const [language, keys] of Object.entries(translations)) {
        for (const [key, { description, value }] of Object.entries(keys)) {
            mappedTranslations.push({
                key,
                description,
                language,
                value,
            })
        }
    }

    // Insert translations into the database
    await TranslationModel.getCollection().insertMany(
        mappedTranslations.map((t) => ({
            ...t,
            createdAt: now,
            updatedAt: now,
        })),
    )

    console.log('All translations seeded successfully!')
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error seeding translations:', err)
        process.exit(1)
    })
