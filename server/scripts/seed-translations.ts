import { MongoDBService } from '@/services/database'
import { TranslationModel, ITranslationModel } from '@/models/translation'

async function main() {
    // Establish a connection to the database
    await MongoDBService.lazy(process.env.MONGO_URI)

    // Clear the existing translations
    // await TranslationModel.getCollection().deleteMany({})

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
                value: 'Your nickname in WuWa...',
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
            general__cancel: {
                description: 'todo',
                value: 'Cancel',
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
            general__languages__ru: {
                description: 'todo',
                value: 'Russian',
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
            general__skip: {
                description: 'todo',
                value: 'Skip',
            },
            general__instructions: {
                description: 'todo',
                value: 'Instructions',
            },
            general__information: {
                description: 'todo',
                value: 'Information',
            },
            general__details: {
                description: 'todo',
                value: 'Details',
            },
            general__help: {
                description: 'todo',
                value: 'Help',
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
            nav__giveaway: {
                description: 'todo',
                value: 'Giveaway',
            },
            nav__shop: {
                description: 'todo',
                value: 'Shop',
            },
            exports__error__bot_start: {
                description: 'todo',
                value: 'If you didn\'t receive the exported image make sure that you started the bot <a href="%url">%url</a>. Come back and repeat the export.',
            },
            shop__order_created: {
                description: 'todo',
                value: 'Order has been created!',
            },
            shop__order_thank: {
                description: 'todo',
                value: 'Thanks for selecting our service. Please contact us at this account for further instructions',
            },
            shop__order_process_note: {
                description: 'todo',
                value: 'We will process your request soon',
            },
            shop__instructions_1: {
                description: 'todo',
                value: 'Select the goods you are insterested in',
            },
            shop__instructions_2: {
                description: 'todo',
                value: 'Complete the order by selecting the currency',
            },
            shop__instructions_3: {
                description: 'todo',
                value: 'After the order is completed, please send us a message to this account',
            },
            shop__info_1: {
                description: 'todo',
                value: 'You can pay with Rover Chat currency (Lunites)',
            },
            shop__info_2: {
                description: 'todo',
                value: 'The payment can be done with the following methods: phone number, PayPal, Revolut, USDT (TRC20)',
            },
            shop__info_3: {
                description: 'todo',
                value: 'Reviews can be found here',
            },
            shop__how_it_works: {
                description: 'todo',
                value: 'How does this work?',
            },
            shop__add_to_cart: {
                description: 'todo',
                value: 'Add to cart',
            },
            shop__order: {
                description: 'todo',
                value: 'Order',
            },
            shop__order__subtitle1: {
                description: 'todo',
                value: 'Please confirm and submit your order',
            },
            shop__order__subtitle2: {
                description: 'todo',
                value: 'Select the currency you prefer to pay with',
            },
            shop__order__total: {
                description: 'todo',
                value: 'Total',
            },
            shop__order__processed: {
                description: 'todo',
                value: 'Processed',
            },
            shop__order__cancelled: {
                description: 'todo',
                value: 'Cancelled',
            },
            shop__order__pending: {
                description: 'todo',
                value: 'Pending',
            },
            shop__my_orders: {
                description: 'todo',
                value: 'My orders',
            },
            shop__by_game: {
                description: 'todo',
                value: 'By game',
            },
            shop__products: {
                description: 'todo',
                value: 'Products',
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
                value: 'Твой никнейм в WuWa...',
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
            general__cancel: {
                description: 'todo',
                value: 'Отменить',
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
            general__languages__ru: {
                description: 'todo',
                value: 'Русский',
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
            general__skip: {
                description: 'todo',
                value: 'Пропустить',
            },
            general__instructions: {
                description: 'todo',
                value: 'Инструкция',
            },
            general__information: {
                description: 'todo',
                value: 'Информация',
            },
            general__details: {
                description: 'todo',
                value: 'Детали',
            },
            general__help: {
                description: 'todo',
                value: 'Помощь',
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
            nav__giveaway: {
                description: 'todo',
                value: 'Розыгрыш',
            },
            nav__shop: {
                description: 'todo',
                value: 'Магазин',
            },
            exports__error__bot_start: {
                description: 'todo',
                value: 'Если вы не получили картинку проверьте что вы начали беседу с ботом <a href="%url">%url</a>. Попробуйте еще раз.',
            },
            shop__order_created: {
                description: 'todo',
                value: 'Заказ был успешно создан!',
            },
            shop__order_thank: {
                description: 'todo',
                value: 'Спасибо, что выбрали наш сервис. Пожалуйста, напишите нам на этот аккаунт для дальнейших инструкций',
            },
            shop__order_process_note: {
                description: 'todo',
                value: 'Мы обработаем ваш заказ в скором времени',
            },
            shop__instructions_1: {
                description: 'todo',
                value: 'Выберете товары, которые вас интересуют',
            },
            shop__instructions_2: {
                description: 'todo',
                value: 'Завершите покупку в корзине, выбрав валюту',
            },
            shop__instructions_3: {
                description: 'todo',
                value: 'После того, как заказ создан, отправьте сообщение на этот аккаунт',
            },
            shop__info_1: {
                description: 'todo',
                value: 'Вы можете покупать донат за валюту Rover Chat (Lunites)',
            },
            shop__info_2: {
                description: 'todo',
                value: 'Оплата производится следующими способами: по номеру телефона, PayPal, Revolut, USDT (TRC20)',
            },
            shop__info_3: {
                description: 'todo',
                value: 'Отзывы о покупках можно посмотреть здесь',
            },
            shop__how_it_works: {
                description: 'todo',
                value: 'Как это работает?',
            },
            shop__add_to_cart: {
                description: 'todo',
                value: 'В корзину',
            },
            shop__order: {
                description: 'todo',
                value: 'Заказ',
            },
            shop__order__subtitle1: {
                description: 'todo',
                value: 'Пожалуйста, проверьте и завершите заказ',
            },
            shop__order__subtitle2: {
                description: 'todo',
                value: 'Выберете валюту в которой вы хотите провести оплату',
            },
            shop__order__total: {
                description: 'todo',
                value: 'Итого',
            },
            shop__order__processed: {
                description: 'todo',
                value: 'Обработан',
            },
            shop__order__cancelled: {
                description: 'todo',
                value: 'Отменён',
            },
            shop__order__pending: {
                description: 'todo',
                value: 'Обрабатывается',
            },
            shop__my_orders: {
                description: 'todo',
                value: 'Мои заказы',
            },
            shop__by_game: {
                description: 'todo',
                value: 'По игре',
            },
            shop__products: {
                description: 'todo',
                value: 'Товаров',
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

    const filtered: Omit<ITranslationModel, 'createdAt' | 'updatedAt'>[] = []

    // Insert translations into the database
    for (const t of mappedTranslations) {
        const found = await TranslationModel.getCollection().findOne({
            key: t.key,
            language: t.language,
        })
        if (found) {
            await TranslationModel.getCollection().updateOne(
                { _id: found._id },
                { $set: { value: t.value } },
            )
        }

        filtered.push(t)
    }

    if (filtered.length !== 0) {
        await TranslationModel.getCollection().insertMany(
            filtered.map((t) => ({
                ...t,
                createdAt: now,
                updatedAt: now,
            })),
        )
    }

    console.log('All translations seeded successfully!')
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error seeding translations:', err)
        process.exit(1)
    })
