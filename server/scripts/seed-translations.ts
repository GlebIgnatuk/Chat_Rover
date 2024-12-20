import { MongoDBService } from '@/services/database';
import { TranslationModel, ITranslationModel } from '@/models/translation';

async function main() {
    // Establish a connection to the database
    await MongoDBService.lazy(process.env.MONGO_URI);

    // Clear the existing translations
    await TranslationModel.getCollection().deleteMany({});

    const now = new Date();

    // All translations (from appConfig.controller.ts)
    const translations: Record<string, Record<string, { description: string; value: string }>> = {
        en: {
            auth__greeting: { description: 'Greeting message on the authentication screen', value: 'Hello' },
            auth__nickname__title: { description: 'Nickname setup title', value: 'Welcome, Rover!' },
            auth__nickname__text: {
                description: 'Text under nickname title',
                value: "We'd like to see you in our world. Let's proceed with a quick setup. Please write your name below.",
            },
            auth__profile__info1: { description: 'Profile creation step 1', value: "Let's create a profile!" },
            auth__profile__info2: { description: 'Profile creation step 2', value: 'Tap to start' },
            auth__profile__nickname_placeholder: { description: 'Placeholder for nickname input', value: 'Your nickname...' },
            auth__profile__uid: { description: 'Label for UID', value: 'UID' },
            auth__profile__about: { description: 'Label for About field', value: 'About' },
            auth__profile__about_placeholder: { description: 'Placeholder for About field', value: 'Looking for rovers to play together...' },
            auth__profile__info: { description: 'Label for Info section', value: 'Info' },
            auth__profile__world_level: { description: 'Label for World Level', value: 'World level' },
            auth__profile__voice: { description: 'Label for Voice field', value: 'Voice' },
            auth__profile__languages: { description: 'Label for Languages field', value: 'Languages' },
            general__loading: { description: 'Loading indicator', value: 'Loading' },
            general__continue: { description: 'Button label for Continue', value: 'Continue' },
            general__create: { description: 'Button label for Create', value: 'Create' },
            nav__chat: { description: 'Navigation menu - Chat', value: 'Chat' },
            nav__guides: { description: 'Navigation menu - Guides', value: 'Guides' },
            nav__search: { description: 'Navigation menu - Search', value: 'Search' },
            nav__messages: { description: 'Navigation menu - Messages', value: 'Messages' },
            nav__account: { description: 'Navigation menu - Account', value: 'Account' },
        },
        ru: {
            auth__greeting: { description: 'Приветствие на экране авторизации', value: 'Привет' },
            auth__nickname__title: { description: 'Заголовок настройки имени пользователя', value: 'Привет, Ровер!' },
            auth__nickname__text: {
                description: 'Текст под заголовком настройки имени пользователя',
                value: 'Мы бы хотели видеть тебя в нашем мире. Давай быстренько всё оформим. Пожалуйста укажи своё имя ниже.',
            },
            auth__profile__info1: { description: 'Этап создания профиля 1', value: 'Давай создадим профиль!' },
            auth__profile__info2: { description: 'Этап создания профиля 2', value: 'Нажми чтобы начать' },
            auth__profile__nickname_placeholder: { description: 'Плейсхолдер для ввода имени пользователя', value: 'Твой никнейм...' },
            auth__profile__uid: { description: 'Метка для UID', value: 'UID' },
            auth__profile__about: { description: 'Метка для поля О Себе', value: 'О Себе' },
            auth__profile__about_placeholder: { description: 'Плейсхолдер для поля О Себе', value: 'Ищу Роверов для совместной игры...' },
            auth__profile__info: { description: 'Метка для секции Инфо', value: 'Инфо' },
            auth__profile__world_level: { description: 'Метка для Уровня мира', value: 'Уровень мира' },
            auth__profile__voice: { description: 'Метка для поля Общение', value: 'Общение' },
            auth__profile__languages: { description: 'Метка для поля Языки', value: 'Языки' },
            general__loading: { description: 'Индикатор загрузки', value: 'Загрузка' },
            general__continue: { description: 'Кнопка Продолжить', value: 'Продолжить' },
            general__create: { description: 'Кнопка Создать', value: 'Создать' },
            nav__chat: { description: 'Меню навигации - Чат', value: 'Чат' },
            nav__guides: { description: 'Меню навигации - Гайды', value: 'Билды' },
            nav__search: { description: 'Меню навигации - Поиск', value: 'Поиск' },
            nav__messages: { description: 'Меню навигации - Сообщения', value: 'Личка' },
            nav__account: { description: 'Меню навигации - Аккаунт', value: 'Аккаунт' },
        },
    };

    // Prepare translations for insertion
    const mappedTranslations: Omit<ITranslationModel, 'createdAt' | 'updatedAt'>[] = [];

    for (const [language, keys] of Object.entries(translations)) {
        for (const [key, { description, value }] of Object.entries(keys)) {
            mappedTranslations.push({
                key,
                description,
                language,
                value,
            });
        }
    }

    // Insert translations into the database
    await TranslationModel.getCollection().insertMany(
        mappedTranslations.map((t) => ({
            ...t,
            createdAt: now,
            updatedAt: now,
        }))
    );

    console.log('All translations seeded successfully!');
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error seeding translations:', err);
        process.exit(1);
    });
