import { InitializerContext } from '@/context/initializer/InitializerContext'
import { SingleCategoryList } from '@/features/shop/components/SingleCategoryList'
import { createPublicStore } from '@/store/store'

export const SEOShopScreen = () => {
    const onInteract = () => {
        window.open('https://t.me/wuthering_waves_en', '_blank')
    }

    return (
        <div className="overflow-y-auto h-full">
            <InitializerContext.Provider
                value={{
                    store: createPublicStore({
                        appConfig: {
                            app: {
                                languages: [],
                            },
                            game: {
                                languages: [],
                                servers: [],
                            },
                        },
                        intls: {
                            ru: {
                                shop__add_to_cart: 'Купить',
                            },
                            en: {
                                shop__add_to_cart: 'Buy',
                            },
                        },
                        selectedLanguage: 'ru',
                        wuwaCharacters: [],
                        fallbackLanguage: 'en',
                    }),
                }}
            >
                <SingleCategoryList
                    cartItems={{}}
                    onAddProductToCart={onInteract}
                    onRemoveProductToCart={onInteract}
                    products={[
                        {
                            _id: '1',
                            name: 'Lunite Subscription',
                            category: '',
                            photoPath: '/products/wuthering-waves/lunite_subscription.png',
                            prices: [
                                { currency: 'RUB', price: 499 },
                                { currency: 'USD', price: 4.49 },
                            ],
                            gameId: null,
                        },
                        {
                            _id: '2',
                            name: 'Insider Channel',
                            category: '',
                            photoPath: '/products/wuthering-waves/insider_channel.png',
                            prices: [
                                { currency: 'RUB', price: 949 },
                                { currency: 'USD', price: 9.49 },
                            ],
                            gameId: null,
                        },
                        {
                            _id: '3',
                            name: 'Connoiseur Channel',
                            category: '',
                            photoPath: '/products/wuthering-waves/connoiseur_channel.png',
                            prices: [
                                { currency: 'RUB', price: 1840 },
                                { currency: 'USD', price: 19.49 },
                            ],
                            gameId: null,
                        },
                        {
                            _id: '4',
                            name: 'Lunite x60',
                            category: '',
                            photoPath: '/products/wuthering-waves/lunite-60.png',
                            prices: [
                                { currency: 'RUB', price: 149 },
                                { currency: 'USD', price: 0.99 },
                            ],
                            gameId: null,
                        },
                        {
                            _id: '5',
                            name: 'Lunite x300',
                            category: '',
                            photoPath: '/products/wuthering-waves/lunite-60.png',
                            prices: [
                                { currency: 'RUB', price: 499 },
                                { currency: 'USD', price: 4.49 },
                            ],
                            gameId: null,
                        },
                        {
                            _id: '6',
                            name: 'Lunite x980',
                            category: '',
                            photoPath: '/products/wuthering-waves/lunite-60.png',
                            prices: [
                                { currency: 'RUB', price: 1340 },
                                { currency: 'USD', price: 14.49 },
                            ],
                            gameId: null,
                        },
                        {
                            _id: '7',
                            name: 'Lunite x1980',
                            category: '',
                            photoPath: '/products/wuthering-waves/lunite-60.png',
                            prices: [
                                { currency: 'RUB', price: 2540 },
                                { currency: 'USD', price: 29.49 },
                            ],
                            gameId: null,
                        },
                        {
                            _id: '8',
                            name: 'Lunite x3280',
                            category: '',
                            photoPath: '/products/wuthering-waves/lunite-60.png',
                            prices: [
                                { currency: 'RUB', price: 4540 },
                                { currency: 'USD', price: 49.49 },
                            ],
                            gameId: null,
                        },
                        {
                            _id: '9',
                            name: 'Lunite x6480',
                            category: '',
                            photoPath: '/products/wuthering-waves/lunite-60.png',
                            prices: [
                                { currency: 'RUB', price: 9040 },
                                { currency: 'USD', price: 99.49 },
                            ],
                            gameId: null,
                        },
                    ]}
                />
            </InitializerContext.Provider>
        </div>
    )
}
